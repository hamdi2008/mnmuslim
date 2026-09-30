import { supabase } from '../../../../lib/supabase'
import { FLYER_BUCKET, sniffImageType } from '../../../../lib/events'

// Serves an uploaded flyer at a stable URL (used by the detail page, og:image
// and JSON-LD). The events RLS policy and the bucket's select policy both
// limit this to approved events — pending flyers 404.
export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', ['GET', 'HEAD'])
    return res.status(405).end()
  }
  if (!/^\d+$/.test(req.query.id)) return res.status(404).end()

  const { data: event } = await supabase
    .from('events')
    .select('flier_path')
    .eq('id', req.query.id)
    .eq('approved', true)
    .maybeSingle()
  if (!event?.flier_path) return res.status(404).end()

  const { data: blob, error } = await supabase.storage.from(FLYER_BUCKET).download(event.flier_path)
  if (error || !blob) return res.status(404).end()
  const buf = Buffer.from(await blob.arrayBuffer())
  const type = sniffImageType(buf)
  if (!type) return res.status(404).end()

  res.setHeader('Content-Type', type)
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Content-Security-Policy', "default-src 'none'")
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800')
  if (req.method === 'HEAD') return res.status(200).end()
  res.status(200).send(buf)
}
