import { useState, useEffect, useMemo, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CATEGORIES, getCategoryById } from '../lib/categories'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

// Daily seed shuffle — rotates order each day, stable within the day
function seededShuffle(arr) {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.abs((seed * (i + 1) * 2654435761) % (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function TrustBadges({ listing }) {
  const badges = []
  if (listing.owner_submitted)  badges.push('Owner Submitted')
  if (listing.verified)         badges.push('Verified')
  if (listing.responds_quickly) badges.push('Responds Quickly')
  if (!badges.length) return null
  return (
    <div className="sv-card-badges">
      {badges.map(b => <span key={b} className="sv-trust-badge">✓ {b}</span>)}
    </div>
  )
}

function initials(name) {
  const words = String(name || '').trim().split(/\s+/).filter(w => /[a-z0-9]/i.test(w))
  if (!words.length) return '?'
  return (words[0][0] + (words[1] ? words[1][0] : '')).toUpperCase()
}

function prettyPhone(phone) {
  const d = String(phone || '').replace(/\D/g, '')
  if (d.length === 11 && d[0] === '1') return prettyPhone(d.slice(1))
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
  return phone
}

function prettyDomain(url) {
  return String(url || '')
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
}

// `logo_url` isn't in the schema yet — initials are the norm today, and real
// logos will drop straight in when the column lands.
function ServiceLogo({ listing }) {
  if (listing.logo_url) {
    return (
      <span className="sv-avatar">
        <img src={listing.logo_url} alt="" />
      </span>
    )
  }
  return (
    <span className="sv-avatar sv-avatar-initials" aria-hidden="true">
      {initials(listing.business_name || listing.service_name)}
    </span>
  )
}

function ListingCard({ listing, featured }) {
  const cat = getCategoryById(listing.category)
  return (
    <Link
      href={`/listing/${listing.id}`}
      className={`sv-card${featured ? ' sv-card-featured' : ''}`}
      aria-label={`View details for ${listing.service_name}`}
    >
      <div className="sv-card-head">
        <ServiceLogo listing={listing} />
        <div className="sv-card-headtext">
          <div className="sv-card-name">{listing.service_name}</div>
          <div className="sv-card-provider">
            by <strong>{listing.business_name || listing.provider_name}</strong>
          </div>
        </div>
      </div>

      <TrustBadges listing={listing} />

      <p className="sv-card-desc">{listing.description}</p>

      <div className="sv-card-meta">
        <span className="sv-card-badge">{cat.name}</span>
        {featured && <span className="sv-featured-badge">★ Featured</span>}
        <span className="sv-card-area">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {listing.service_area}
        </span>
      </div>

      <div className="sv-card-footer">
        <span className="sv-card-contact">
          {listing.website && (
            <span className="sv-contact-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              {prettyDomain(listing.website)}
            </span>
          )}
          {listing.phone && (
            <span className="sv-contact-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z"/></svg>
              {prettyPhone(listing.phone)}
            </span>
          )}
        </span>
        <span className="sv-card-cta">View details →</span>
      </div>
    </Link>
  )
}

const PLACEHOLDERS = [
  'Wedding Photographer...',
  'Quran Teacher...',
  'Math Tutor...',
  'Home Cleaning...',
  'Tax Accountant...',
  'Therapist...',
  'Web Designer...',
  'Handyman...',
  'Immigration Lawyer...',
  'Event Planner...',
  'Graphic Designer...',
]

export default function Services() {
  const [allListings, setAllListings] = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [activeCat, setActiveCat]     = useState('')
  const [phIdx, setPhIdx]             = useState(0)
  const inited = useRef(false)
  const resultsRef = useRef(null)
  const router = useRouter()

  // Rotating placeholder — same 3s interval as homepage
  useEffect(() => {
    const t = setInterval(() => setPhIdx(i => (i + 1) % PLACEHOLDERS.length), 3000)
    return () => clearInterval(t)
  }, [])

  // Seed state from the URL once; the effect below then owns the query string.
  useEffect(() => {
    if (!router.isReady || inited.current) return
    inited.current = true
    if (router.query.search)   setSearch(router.query.search)
    if (router.query.category) setActiveCat(router.query.category)
  }, [router.isReady, router.query])

  // Keep filters in the URL so results can be shared or survive a refresh.
  useEffect(() => {
    if (!inited.current) return
    const query = {}
    if (search.trim()) query.search = search.trim()
    if (activeCat)     query.category = activeCat
    router.replace({ pathname: '/services', query }, undefined, { shallow: true, scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeCat])

  // The whole approved directory is fetched once; search and category filter
  // client-side so the count stays exact and instant.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res  = await fetch('/api/listings')
        const json = await res.json()
        if (!cancelled) setAllListings(Array.isArray(json) ? seededShuffle(json) : [])
      } catch (err) {
        if (!cancelled) setAllListings([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const term = search.trim().toLowerCase()

  const listings = useMemo(() => allListings.filter(l => {
    if (activeCat && l.category !== activeCat) return false
    if (!term) return true
    const haystack = [
      l.service_name,
      l.business_name,
      l.provider_name,
      l.description,
      l.service_area,
      getCategoryById(l.category).name,
    ].filter(Boolean).join(' ').toLowerCase()
    return haystack.includes(term)
  }), [allListings, activeCat, term])

  // "13 services" · "2 Health & Wellness services" · "3 Legal Services"
  const countLabel = useMemo(() => {
    const n = listings.length
    if (!n) return 'No services found'
    if (!activeCat) return `${n} ${n === 1 ? 'service' : 'services'}`
    const catName = getCategoryById(activeCat).name
    // Half the categories already end in "Services" — don't say it twice.
    if (/services?$/i.test(catName)) return `${n} ${catName}`
    return `${n} ${catName} ${n === 1 ? 'service' : 'services'}`
  }, [listings.length, activeCat])

  function toggleCat(id) {
    setActiveCat(prev => (prev === id ? '' : id))
  }

  function clearAll() {
    setSearch('')
    setActiveCat('')
  }

  // Results filter as you type; the hero button just takes you to them.
  function scrollToResults() {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const featuredListings = listings.filter(l => l.featured)
  const regularListings  = listings.filter(l => !l.featured)

  return (
    <>
      <Head>
        <title>Muslim Services Directory | MNMuslim</title>
        <meta name="description" content="Find Muslim-owned businesses and professionals across Minnesota." />
        <link rel="icon" href="/favicon.png" />
        {/* Open Graph */}
        <meta property="og:title" content="Muslim Services Directory | MNMuslim" />
        <meta property="og:description" content="Find Muslim-owned businesses and professionals across Minnesota." />
        <meta property="og:image" content="https://mnmuslim.com/og-image.png" />
        <meta property="og:url" content="https://mnmuslim.com/services" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MNMuslim" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Muslim Services Directory | MNMuslim" />
        <meta name="twitter:description" content="Find Muslim-owned businesses and professionals across Minnesota." />
        <meta name="twitter:image" content="https://mnmuslim.com/og-image.png" />
      </Head>

      <div className="home-page">

        {/* ── HERO — the page's only search ── */}
        <div className="hn-dark-header">
          <SiteNav />
          <section className="hn-hero">
            <div className="hn-g hn-g1" />
            <div className="hn-g hn-g2" />
            <div className="hn-g hn-g3" />

            <p className="hn-hero-eyebrow">Muslim Services Directory</p>

            <h1 className="hn-h1">
              Find Muslim Services
            </h1>

            <p className="hn-sub">
              Find the services you need from Minnesota’s Muslim community.
            </p>

            <div className="hn-search-wrap">
              <div className="hn-search-box">
                <svg className="hn-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  className="hn-search-input"
                  type="search"
                  aria-label="Search services"
                  placeholder={PLACEHOLDERS[phIdx]}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && scrollToResults()}
                />
                <button className="hn-search-btn" onClick={scrollToResults}>Search</button>
              </div>
            </div>

          </section>
        </div>

        {/* ── DIRECTORY ── */}
        <div className="sv-body">

          {/* Sticky category sidebar — desktop */}
          <aside className="sv-sidebar" aria-label="Service categories">
            <div className="sv-sidebar-label">Categories</div>
            <button
              className={`sv-cat-btn${activeCat === '' ? ' sv-cat-active' : ''}`}
              aria-pressed={activeCat === ''}
              onClick={() => setActiveCat('')}
            >
              All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`sv-cat-btn${activeCat === cat.id ? ' sv-cat-active' : ''}`}
                aria-pressed={activeCat === cat.id}
                onClick={() => toggleCat(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </aside>

          {/* Main */}
          <main className="sv-main" ref={resultsRef}>

            {/* Category control — mobile only, stands in for the hidden sidebar */}
            <select
              className="sv-mobile-cat"
              aria-label="Filter by category"
              value={activeCat}
              onChange={e => setActiveCat(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Count + CTA */}
            <div className="sv-results-head">
              <span className="sv-count">{loading ? 'Loading services…' : countLabel}</span>
              <Link href="/submit" className="sv-list-btn">+ List Your Service</Link>
            </div>

            {/* Skeleton */}
            {loading && (
              <div className="sv-loading">
                {[1,2,3,4,5,6].map(i => <div key={i} className="sv-skeleton" />)}
              </div>
            )}

            {/* Empty state */}
            {!loading && listings.length === 0 && (
              <div className="sv-empty">
                <div className="sv-empty-icon" aria-hidden="true">🔍</div>
                <h2 className="sv-empty-title">No services found</h2>
                <p className="sv-empty-sub">Try another search or category.</p>
                <button className="sv-empty-reset" onClick={clearAll}>
                  {term ? 'Clear search' : 'View all services'}
                </button>
              </div>
            )}

            {/* Featured — only when a listing is actually flagged */}
            {!loading && featuredListings.length > 0 && (
              <section className="sv-featured">
                <div className="sv-featured-head">
                  <span className="sv-featured-label">★ Featured</span>
                </div>
                <div className="sv-grid">
                  {featuredListings.map(listing => <ListingCard key={listing.id} listing={listing} featured />)}
                </div>
              </section>
            )}

            {/* Grid — everything else */}
            {!loading && regularListings.length > 0 && (
              <div className="sv-grid">
                {regularListings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
              </div>
            )}
          </main>
        </div>

        <SiteFooter />

      </div>
    </>
  )
}
