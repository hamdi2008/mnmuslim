import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { category, search } = req.query

    let query = supabase
      .from('listings')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(
        `service_name.ilike.%${search}%,provider_name.ilike.%${search}%,service_area.ilike.%${search}%`
      )
    }

    const { data, error } = await query

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
