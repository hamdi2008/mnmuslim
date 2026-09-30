// `plural: true` marks names that are already a plural noun, so the listing
// count can say "3 Conferences" instead of "3 Conferences events".
export const EVENT_CATEGORIES = [
  { id: 'lectures',    name: 'Lectures',            icon: '🎙️',   plural: true },
  { id: 'classes',     name: 'Classes & Seminars',  icon: '📖',   plural: true },
  { id: 'conferences', name: 'Conferences',         icon: '🏛️',   plural: true },
  { id: 'social',      name: 'Social & Recreation', icon: '🎉' },
  { id: 'youth',       name: 'Youth',               icon: '🧑‍🎓' },
  { id: 'health',      name: 'Health & Wellness',   icon: '🌿' },
  { id: 'networking',  name: 'Networking',          icon: '💼' },
  { id: 'iftars',      name: 'Iftars',              icon: '🌙',   plural: true },
  { id: 'matrimonial', name: 'Matrimonial',         icon: '💍' },
  { id: 'fundraisers', name: 'Fundraisers',         icon: '🤝',   plural: true },
  { id: 'community',   name: 'Community',           icon: '🕌' },
  { id: 'other',       name: 'Other',               icon: '✨' },
]

export function getEventCategoryById(id) {
  return EVENT_CATEGORIES.find((c) => c.id === id) || { name: 'Other', icon: '✨' }
}

// Explicit column list — the events table uses a column-level grant to keep
// contact_email private, so select('*') would fail. Keep in sync with
// supabase-events-schema.sql.
export const EVENT_PUBLIC_COLUMNS =
  'id,title,category,date,end_date,time_label,start_time,end_time,venue,address,city,cost,link,flier_url,flier_path,description,created_at'

// Uploaded flyers live in a private Storage bucket and are served through
// /api/events/[id]/flyer once the event is approved.
export const FLYER_BUCKET = 'event-flyers'
export const FLYER_MAX_BYTES = 4 * 1024 * 1024
export const FLYER_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

// Identify an image by its leading bytes (Uint8Array/Buffer), not by the
// name or type a browser claims. Returns a FLYER_TYPES key or null.
export function sniffImageType(b) {
  const ascii = (from, to) => String.fromCharCode(...b.subarray(from, to))
  if (b.length >= 3 && b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return 'image/jpeg'
  if (b.length >= 8 && ascii(1, 4) === 'PNG' && b[0] === 0x89 && b[4] === 0x0D && b[5] === 0x0A && b[6] === 0x1A && b[7] === 0x0A) return 'image/png'
  if (b.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp'
  return null
}

// Hand-set flier_url (older events) wins over an uploaded flyer.
export function eventImageUrl(event, { absolute = false } = {}) {
  if (event.flier_url) return event.flier_url
  if (!event.flier_path) return null
  return `${absolute ? 'https://mnmuslim.com' : ''}/api/events/${event.id}/flyer`
}

// "19:00:00" → "7:00 PM"
export function formatTime(t) {
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

// Structured start/end times when present, else the legacy free-text label.
export function eventTimeLabel(event) {
  if (event.start_time) {
    return event.end_time
      ? `${formatTime(event.start_time)} – ${formatTime(event.end_time)}`
      : formatTime(event.start_time)
  }
  return event.time_label || ''
}

// "2026-07-25" + "19:00:00" → "2026-07-25T19:00:00-05:00" (Central, DST-aware)
export function chicagoDateTime(date, time) {
  const probe = new Date(`${date}T${time.slice(0, 5)}:00Z`)
  const name = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', timeZoneName: 'shortOffset' })
    .formatToParts(probe).find(p => p.type === 'timeZoneName').value   // "GMT-5"
  const hours = Number(name.replace('GMT', '')) || 0
  const offset = `${hours < 0 ? '-' : '+'}${String(Math.abs(hours)).padStart(2, '0')}:00`
  return `${date}T${time.slice(0, 5)}:00${offset}`
}

// "Today" in Minnesota, as YYYY-MM-DD — so events don't expire at UTC midnight
// (6–7 PM Central) while an evening event is still on.
export function mnToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' })
}

// An event is upcoming through the end of its last day.
export function isUpcoming(event, today = mnToday()) {
  return (event.end_date || event.date) >= today
}

// "Saturday, July 25, 2026" — or "August 7–9, 2026" for multi-day events.
export function formatEventDate(date, endDate) {
  const d = new Date(`${date}T12:00:00`)
  if (!endDate || endDate === date) {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }
  const e = new Date(`${endDate}T12:00:00`)
  const sameMonth = d.getMonth() === e.getMonth() && d.getFullYear() === e.getFullYear()
  const startStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  const endStr = sameMonth
    ? e.toLocaleDateString('en-US', { day: 'numeric' })
    : e.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  return `${startStr}–${endStr}, ${e.getFullYear()}`
}

// "Al-Ihsan Islamic Center, 955 Minnehaha Ave W, Saint Paul, MN" — the
// street address is optional; older events often have it inside `venue`.
export function eventLocation(event) {
  return [event.venue, event.address, `${event.city}, MN`].filter(Boolean).join(', ')
}

export function directionsUrl(event) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventLocation(event))}`
}

// End of a timed event as { date, time }, or null without an end time.
// An end time at/before the start on a one-day event runs past midnight.
export function eventEnd(event) {
  if (!event.start_time || !event.end_time) return null
  if (event.end_date) return { date: event.end_date, time: event.end_time }
  return {
    date: event.end_time <= event.start_time ? addDays(event.date, 1) : event.date,
    time: event.end_time,
  }
}

function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

// Groups pre-sorted upcoming events under "This Week" / "Next Week" /
// month headers. Events already in progress group under This Week.
export function groupUpcomingEvents(events, today = mnToday()) {
  const dow = new Date(`${today}T12:00:00Z`).getUTCDay()
  const thisWeekEnd = addDays(today, (7 - dow) % 7)
  const nextWeekEnd = addDays(thisWeekEnd, 7)
  const groups = []
  const byLabel = new Map()
  for (const e of events) {
    const d = e.date > today ? e.date : today
    let label
    if (d <= thisWeekEnd) label = 'This Week'
    else if (d <= nextWeekEnd) label = 'Next Week'
    else {
      const month = new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })
      if (d.slice(0, 7) === today.slice(0, 7)) label = `Later in ${month}`
      else if (d.slice(0, 4) !== today.slice(0, 4)) label = `${month} ${d.slice(0, 4)}`
      else label = month
    }
    if (!byLabel.has(label)) {
      const g = { label, events: [] }
      byLabel.set(label, g)
      groups.push(g)
    }
    byLabel.get(label).events.push(e)
  }
  return groups
}

// ── iCalendar (.ics) ──
// Events with a structured start time become timed entries in Central
// time. Multi-day events without an end time, and older events with only
// the free-text time_label, stay all-day with the time in the description.

function icsEscape(s) {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

const ICS_CHICAGO_TZ = [
  'BEGIN:VTIMEZONE',
  'TZID:America/Chicago',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:-0600',
  'TZOFFSETTO:-0500',
  'TZNAME:CDT',
  'DTSTART:19700308T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:-0500',
  'TZOFFSETTO:-0600',
  'TZNAME:CST',
  'DTSTART:19701101T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
]

function icsIsTimed(event) {
  return Boolean(event.start_time && (event.end_time || !event.end_date))
}

function icsEventLines(event, stamp) {
  const fmt = d => d.replaceAll('-', '')
  const fmtLocal = (date, time) => `${fmt(date)}T${time.slice(0, 5).replace(':', '')}00`
  const timed = icsIsTimed(event)
  const end = eventEnd(event)

  const descParts = []
  const timeLabel = eventTimeLabel(event)
  if (timeLabel && !timed) descParts.push(`Time: ${timeLabel}`)
  descParts.push(`Details: https://mnmuslim.com/events/${event.id}`)
  if (event.link) descParts.push(`Event link: ${event.link}`)

  // No end time given → no DTEND, rather than inventing a duration.
  const when = timed
    ? [
        `DTSTART;TZID=America/Chicago:${fmtLocal(event.date, event.start_time)}`,
        ...(end ? [`DTEND;TZID=America/Chicago:${fmtLocal(end.date, end.time)}`] : []),
      ]
    : [
        `DTSTART;VALUE=DATE:${fmt(event.date)}`,
        `DTEND;VALUE=DATE:${fmt(addDays(event.end_date || event.date, 1))}`,
      ]

  return [
    'BEGIN:VEVENT',
    `UID:mnmuslim-event-${event.id}@mnmuslim.com`,
    `DTSTAMP:${stamp}`,
    ...when,
    `SUMMARY:${icsEscape(event.title)}`,
    `LOCATION:${icsEscape(eventLocation(event))}`,
    `DESCRIPTION:${icsEscape(descParts.join('\n'))}`,
    `URL:https://mnmuslim.com/events/${event.id}`,
    'END:VEVENT',
  ]
}

export function icsCalendar(events) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MNMuslim//Events//EN',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:MNMuslim Events',
    'X-WR-CALDESC:Muslim community events across Minnesota',
    'X-WR-TIMEZONE:America/Chicago',
    'X-PUBLISHED-TTL:PT12H',
    ...(events.some(icsIsTimed) ? ICS_CHICAGO_TZ : []),
    ...events.flatMap(e => icsEventLines(e, stamp)),
    'END:VCALENDAR',
  ].join('\r\n')
}
