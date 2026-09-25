import { supabase } from '../lib/supabase'

// Served at /sitemap.xml. Built per request from Supabase, then cached at the
// edge (see Cache-Control below) so newly approved listings/events show up
// without a redeploy.

const SITE_URL = 'https://mnmuslim.com'

// Public, indexable pages. Leaves out /browse and /list-your-service (they
// only redirect), /api/*, and the 404 page.
const STATIC_PATHS = [
  '/',
  '/services',
  '/events',
  '/submit',
  '/submit-event',
  '/contact',
  '/privacy',
  '/terms',
]

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function urlEntry(path, lastmod) {
  return [
    '  <url>',
    `    <loc>${escapeXml(SITE_URL + path)}</loc>`,
    ...(lastmod ? [`    <lastmod>${escapeXml(lastmod)}</lastmod>`] : []),
    '  </url>',
  ].join('\n')
}

export async function getServerSideProps({ res }) {
  // Same filters as the detail pages: only approved rows are public.
  // Events have no updated_at column, so they carry no lastmod; past events
  // are purged nightly, so every approved event here is current.
  const [listings, events] = await Promise.all([
    supabase.from('listings').select('id,updated_at').eq('approved', true).order('id'),
    supabase.from('events').select('id').eq('approved', true).order('id'),
  ])

  // Don't serve (or cache) a sitemap that silently drops every listing.
  if (listings.error || events.error) {
    console.error('Sitemap fetch failed:', listings.error || events.error)
    res.statusCode = 500
    res.setHeader('Cache-Control', 'no-store')
    res.end()
    return { props: {} }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...STATIC_PATHS.map(path => urlEntry(path)),
    ...listings.data.map(l => urlEntry(`/listing/${l.id}`, l.updated_at)),
    ...events.data.map(e => urlEntry(`/events/${e.id}`)),
    '</urlset>',
  ].join('\n')

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.end(xml)
  return { props: {} }
}

export default function Sitemap() {
  return null
}
