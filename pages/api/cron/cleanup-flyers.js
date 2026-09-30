import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { FLYER_BUCKET } from '../../../lib/events'

// Daily Vercel Cron (see vercel.json). Deletes uploaded flyer files that no
// event references any more — events removed by the purge-past-events
// pg_cron job, rejected submissions deleted by hand, and uploads whose
// event never saved.
//
// Safety rules:
//  - Only files in the event-flyers bucket under submissions/ are touched.
//    Hand-set flier_url images live elsewhere and are never deleted.
//  - A file referenced by ANY event row (pending or approved) is kept.
//  - Files younger than 24 hours are kept, so an in-progress submission
//    can't lose its flyer.
//  - If the list of referenced files can't be loaded, nothing is deleted.

const PREFIX = 'submissions'
const MIN_AGE_MS = 24 * 60 * 60 * 1000
const PAGE = 1000

async function referencedPaths() {
  const paths = new Set()
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabaseAdmin
      .from('events').select('flier_path')
      .not('flier_path', 'is', null)
      .order('id').range(from, from + PAGE - 1)
    if (error) throw error
    data.forEach(r => paths.add(r.flier_path))
    if (data.length < PAGE) return paths
  }
}

async function storedFlyers() {
  const files = []
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await supabaseAdmin.storage.from(FLYER_BUCKET)
      .list(PREFIX, { limit: PAGE, offset, sortBy: { column: 'name', order: 'asc' } })
    if (error) throw error
    files.push(...data.filter(f => f.id))   // skip folder placeholders
    if (data.length < PAGE) return files
  }
}

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  if (!supabaseAdmin) {
    console.error('Flyer cleanup skipped: SUPABASE_SERVICE_ROLE_KEY is not set.')
    return res.status(503).json({ error: 'Service key not configured' })
  }

  try {
    const [keep, files] = await Promise.all([referencedPaths(), storedFlyers()])
    const cutoff = Date.now() - MIN_AGE_MS
    const orphans = files
      .map(f => ({ path: `${PREFIX}/${f.name}`, created: Date.parse(f.created_at) }))
      .filter(f => !keep.has(f.path) && f.created < cutoff)
      .map(f => f.path)

    let removed = 0
    for (let i = 0; i < orphans.length; i += 100) {
      const batch = orphans.slice(i, i + 100)
      const { error } = await supabaseAdmin.storage.from(FLYER_BUCKET).remove(batch)
      if (error) console.error('Flyer cleanup: remove failed for a batch:', error)
      else removed += batch.length
    }

    console.log(`Flyer cleanup: ${files.length} stored, ${keep.size} referenced, ${removed}/${orphans.length} orphans removed.`)
    return res.status(200).json({ stored: files.length, referenced: keep.size, orphans: orphans.length, removed })
  } catch (err) {
    console.error('Flyer cleanup aborted (nothing deleted):', err)
    return res.status(500).json({ error: 'Cleanup failed' })
  }
}
