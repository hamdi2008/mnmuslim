import { supabase } from '../../lib/supabase'
import { EVENT_CATEGORIES } from '../../lib/events'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { title, category, date, end_date, time_label, venue, city, link, flier_url, description, contact_email } = req.body

  if (!title?.trim() || !category?.trim() || !date?.trim() || !venue?.trim() || !city?.trim() || !contact_email?.trim()) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  if (!EVENT_CATEGORIES.some(c => c.id === category)) {
    return res.status(400).json({ error: 'Invalid category.' })
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date format.' })
  }

  if (end_date && !/^\d{4}-\d{2}-\d{2}$/.test(end_date)) {
    return res.status(400).json({ error: 'Invalid end date format.' })
  }

  if (end_date && end_date < date) {
    return res.status(400).json({ error: 'End date can’t be before the start date.' })
  }

  const { error } = await supabase.from('events').insert([{
    title:         title.trim(),
    category:      category.trim(),
    date,
    end_date:      end_date || null,
    time_label:    time_label?.trim()    || null,
    venue:         venue.trim(),
    city:          city.trim(),
    link:          link?.trim()          || null,
    flier_url:     flier_url?.trim()     || null,
    description:   description?.trim()   || null,
    contact_email: contact_email.trim(),
    approved: false,
  }])

  if (error) return res.status(500).json({ error: error.message })
  return res.status(201).json({ message: 'Event submitted for review.' })
}
