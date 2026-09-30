import { randomUUID } from 'crypto'
import { supabase } from '../../lib/supabase'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { EVENT_CATEGORIES, FLYER_BUCKET, FLYER_MAX_BYTES, FLYER_TYPES, sniffImageType } from '../../lib/events'

// Multipart body (with the optional flyer) is parsed by hand below.
export const config = { api: { bodyParser: false } }

// Stays under Vercel's 4.5 MB request cap; the flyer itself is ≤ 4 MB.
const MAX_BODY_BYTES = FLYER_MAX_BYTES + 256 * 1024

const LIMITS = { title: 150, venue: 200, address: 200, city: 80, description: 2000, cost: 100, link: 500, contact_email: 254 }

class BadRequest extends Error {}

async function readBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw new BadRequest('That flyer is too large. Please use an image under 4 MB.')
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

// Trim, drop control characters (newlines kept only where allowed), cap length.
function clean(value, max, { multiline = false } = {}) {
  if (typeof value !== 'string') return ''
  const stripped = multiline
    ? value.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '')
    : value.replace(/[\u0000-\u001F\u007F]/g, ' ')
  return stripped.trim().slice(0, max)
}

function normalizeUrl(raw) {
  if (!raw) return null
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`
  let url
  try { url = new URL(withScheme) } catch { throw new BadRequest('Please enter a valid event link, or leave it blank.') }
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) {
    throw new BadRequest('Please enter a valid event link, or leave it blank.')
  }
  return url.toString()
}

// The flyer was uploaded but the event wasn't saved. Best effort: a failure
// here is logged, never shown to the submitter, and anything left behind
// is swept by /api/cron/cleanup-flyers.
async function removeOrphanFlyer(path) {
  if (!supabaseAdmin) {
    console.warn(`Orphan flyer left for the daily sweep (no service key): ${path}`)
    return
  }
  try {
    const { error } = await supabaseAdmin.storage.from(FLYER_BUCKET).remove([path])
    if (error) console.error(`Orphan flyer cleanup failed for ${path}:`, error)
  } catch (err) {
    console.error(`Orphan flyer cleanup failed for ${path}:`, err)
  }
}

const DATE_RE =/^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    if (!req.headers['content-type']?.startsWith('multipart/form-data')) {
      throw new BadRequest('Invalid submission.')
    }
    const body = await readBody(req)
    let form
    try {
      form = await new Response(body, { headers: { 'content-type': req.headers['content-type'] } }).formData()
    } catch { throw new BadRequest('Invalid submission.') }

    const title         = clean(form.get('title'), LIMITS.title)
    const category      = clean(form.get('category'), 40)
    const date          = clean(form.get('date'), 10)
    const end_date      = clean(form.get('end_date'), 10)
    const start_time    = clean(form.get('start_time'), 5)
    const end_time      = clean(form.get('end_time'), 5)
    const venue         = clean(form.get('venue'), LIMITS.venue)
    const address       = clean(form.get('address'), LIMITS.address)
    const city          = clean(form.get('city'), LIMITS.city)
    const description   = clean(form.get('description'), LIMITS.description, { multiline: true })
    const cost          = clean(form.get('cost'), LIMITS.cost)
    const link          = normalizeUrl(clean(form.get('link'), LIMITS.link))
    const contact_email = clean(form.get('contact_email'), LIMITS.contact_email)
    const promotion_interest = form.get('promotion_interest') === 'yes'

    // Honeypot: a field hidden from people. Anything in it means a bot.
    // Checked before anything is uploaded or saved.
    if (clean(form.get('website'), 500)) {
      throw new BadRequest('We couldn’t accept this submission. Please email your event to hello@mnmuslim.com.')
    }

    if (!title || !category || !date || !venue || !city || !description || !contact_email) {
      throw new BadRequest('Please fill in all required fields.')
    }
    if (!EVENT_CATEGORIES.some(c => c.id === category)) throw new BadRequest('Invalid category.')
    if (!DATE_RE.test(date) || isNaN(Date.parse(date))) throw new BadRequest('Invalid date.')
    if (end_date && (!DATE_RE.test(end_date) || isNaN(Date.parse(end_date)))) throw new BadRequest('Invalid end date.')
    if (end_date && end_date < date) throw new BadRequest('End date can’t be before the start date.')
    if (start_time && !TIME_RE.test(start_time)) throw new BadRequest('Invalid start time.')
    if (end_time && !TIME_RE.test(end_time)) throw new BadRequest('Invalid end time.')
    if (end_time && !start_time) throw new BadRequest('Please add a start time, or clear the end time.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email)) throw new BadRequest('Please enter a valid email address.')

    // Optional flyer — validated fully before anything is stored.
    let flyer = null
    const file = form.get('flyer')
    if (file && typeof file === 'object' && file.size > 0) {
      if (file.size > FLYER_MAX_BYTES) throw new BadRequest('That flyer is too large. Please use an image under 4 MB.')
      const buf = Buffer.from(await file.arrayBuffer())
      const type = sniffImageType(buf)
      if (!type) throw new BadRequest('Flyer must be a JPG, PNG, or WEBP image.')
      flyer = { buf, type, path: `submissions/${randomUUID()}.${FLYER_TYPES[type]}` }
    }

    if (flyer) {
      const { error } = await supabase.storage.from(FLYER_BUCKET)
        .upload(flyer.path, flyer.buf, { contentType: flyer.type, upsert: false })
      if (error) {
        console.error('Flyer upload failed:', error)
        return res.status(500).json({ error: 'We couldn’t upload your flyer. Please try again, or submit without it.' })
      }
    }

    let saved = false
    try {
      const { error } = await supabase.from('events').insert([{
        title,
        category,
        date,
        end_date:   end_date   || null,
        start_time: start_time || null,
        end_time:   end_time   || null,
        venue,
        address:    address    || null,
        city,
        description,
        cost:       cost       || null,
        link,
        flier_path: flyer?.path || null,
        contact_email,
        promotion_interest,
        approved: false,
      }])

      // Raised by the events_submission_rate_limit trigger.
      if (error?.message?.includes('rate_limited')) {
        return res.status(429).json({ error: 'We’ve received a lot of submissions recently. Please try again in an hour, or email hello@mnmuslim.com.' })
      }
      if (error) {
        console.error('Event insert failed:', error)
        return res.status(500).json({ error: 'Something went wrong. Please try again.' })
      }
      saved = true
      return res.status(201).json({ message: 'Event submitted for review.' })
    } finally {
      if (flyer && !saved) await removeOrphanFlyer(flyer.path)
    }
  } catch (err) {
    if (err instanceof BadRequest) return res.status(400).json({ error: err.message })
    console.error('Event submission failed:', err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
