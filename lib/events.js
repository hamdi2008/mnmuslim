export const EVENT_CATEGORIES = [
  { id: 'lectures',    name: 'Lectures',            icon: '🎙️' },
  { id: 'classes',     name: 'Classes & Seminars',  icon: '📖' },
  { id: 'conferences', name: 'Conferences',         icon: '🏛️' },
  { id: 'social',      name: 'Social & Recreation', icon: '🎉' },
  { id: 'youth',       name: 'Youth',               icon: '🧑‍🎓' },
  { id: 'health',      name: 'Health & Wellness',   icon: '🌿' },
  { id: 'networking',  name: 'Networking',          icon: '💼' },
  { id: 'iftars',      name: 'Iftars',              icon: '🌙' },
  { id: 'matrimonial', name: 'Matrimonial',         icon: '💍' },
  { id: 'fundraisers', name: 'Fundraisers',         icon: '🤝' },
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
  'id,title,category,date,end_date,time_label,venue,city,link,flier_url,description,created_at'

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

export function directionsUrl(event) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue}, ${event.city}, MN`)}`
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
// All-day entries: time_label is display text, not parseable — the exact
// time goes in the description instead.

function icsEscape(s) {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

function icsEventLines(event, stamp) {
  const fmt = d => d.replaceAll('-', '')
  const descParts = []
  if (event.time_label) descParts.push(`Time: ${event.time_label}`)
  descParts.push(`Details: https://mnmuslim.com/events/${event.id}`)
  if (event.link) descParts.push(`Event link: ${event.link}`)
  return [
    'BEGIN:VEVENT',
    `UID:mnmuslim-event-${event.id}@mnmuslim.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${fmt(event.date)}`,
    `DTEND;VALUE=DATE:${fmt(addDays(event.end_date || event.date, 1))}`,
    `SUMMARY:${icsEscape(event.title)}`,
    `LOCATION:${icsEscape(`${event.venue}, ${event.city}, MN`)}`,
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
    ...events.flatMap(e => icsEventLines(e, stamp)),
    'END:VCALENDAR',
  ].join('\r\n')
}
