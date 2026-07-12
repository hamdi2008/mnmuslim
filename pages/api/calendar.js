import { supabase } from '../../lib/supabase'
import { EVENT_PUBLIC_COLUMNS, mnToday, icsCalendar } from '../../lib/events'

// Live iCalendar feed of all upcoming approved events. Subscribe once
// (Google Calendar "From URL" or webcal://) and new events sync in.
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const today = mnToday()
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_PUBLIC_COLUMNS)
    .eq('approved', true)
    .or(`date.gte.${today},end_date.gte.${today}`)
    .order('date', { ascending: true })

  if (error) {
    console.error('Calendar feed error:', JSON.stringify(error))
    return res.status(500).end()
  }

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8')
  res.setHeader('Content-Disposition', 'inline; filename="mnmuslim-events.ics"')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  return res.status(200).send(icsCalendar(data || []))
}
