export const EVENT_CATEGORIES = [
  { id: 'lectures',    name: 'Lectures',     icon: '🎙️' },
  { id: 'iftars',      name: 'Iftars',       icon: '🌙' },
  { id: 'youth',       name: 'Youth',        icon: '🧑‍🎓' },
  { id: 'matrimonial', name: 'Matrimonial',  icon: '💍' },
  { id: 'fundraisers', name: 'Fundraisers',  icon: '🤝' },
  { id: 'community',   name: 'Community',    icon: '🕌' },
]

export function getEventCategoryById(id) {
  return EVENT_CATEGORIES.find((c) => c.id === id) || { name: 'Community', icon: '🕌' }
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
