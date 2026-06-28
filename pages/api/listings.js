import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { category, search } = req.query

  try {
    let query = supabase
      .from('listings')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (search && search.trim()) {
      const term = search.trim()
      query = query.or(
        [
          `service_name.ilike.%${term}%`,
          `provider_name.ilike.%${term}%`,
          `description.ilike.%${term}%`,
          `service_area.ilike.%${term}%`,
          `business_name.ilike.%${term}%`,
          `category.ilike.%${term}%`,
        ].join(',')
      )
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data || [])
  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
