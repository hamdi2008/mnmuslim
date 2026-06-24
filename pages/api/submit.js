import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { business_name, service_name, provider_name, category, description, service_area, phone, email, website, instagram } = req.body

    if (!service_name || !provider_name || !category || !description || !service_area || !email) {
      return res.status(400).json({ error: 'Missing required fields.' })
    }

    const { error } = await supabase.from('listings').insert([{
      business_name: business_name?.trim() || null,
      service_name: service_name.trim(),
      provider_name: provider_name.trim(),
      category: category.trim(),
      description: description.trim(),
      service_area: service_area.trim(),
      phone: phone?.trim() || null,
      email: email.trim(),
      website: website?.trim() || null,
      instagram: instagram?.trim() || null,
      approved: false,
    }])

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ message: 'Listing submitted for review.' })
  }

  res.setHeader('Allow', ['POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
