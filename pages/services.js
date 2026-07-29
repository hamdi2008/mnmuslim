import { useState, useEffect, useMemo, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CATEGORIES, getCategoryById } from '../lib/categories'
import { cityOptions, matchesCity } from '../lib/cities'
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
    <Link href={`/listing/${listing.id}`} className={`sv-card${featured ? ' sv-card-featured' : ''}`}>
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
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {listing.service_area}
        </span>
      </div>

      <div className="sv-card-footer">
        <span className="sv-card-contact">
          {listing.website && (
            <span className="sv-contact-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              {prettyDomain(listing.website)}
            </span>
          )}
          {listing.phone && (
            <span className="sv-contact-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z"/></svg>
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
  const [activeCity, setActiveCity]   = useState('')
  const [phIdx, setPhIdx]             = useState(0)
  const resultsRef = useRef(null)
  const router = useRouter()

  // Rotating placeholder — same 3s interval as homepage
  useEffect(() => {
    const t = setInterval(() => setPhIdx(i => (i + 1) % PLACEHOLDERS.length), 3000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!router.isReady) return
    if (router.query.search)   setSearch(router.query.search)
    if (router.query.category) setActiveCat(router.query.category)
    if (router.query.city)     setActiveCity(router.query.city)
  }, [router.isReady, router.query])

  // The whole approved directory is fetched once; search, category, and city
  // all filter client-side so the count and the chip counts stay in sync.
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

  const cities = useMemo(
    () => cityOptions(allListings.map(l => l.service_area)),
    [allListings]
  )

  function matchesSearch(listing, term) {
    if (!term) return true
    const haystack = [
      listing.service_name,
      listing.business_name,
      listing.provider_name,
      listing.description,
      listing.service_area,
      getCategoryById(listing.category).name,
    ].filter(Boolean).join(' ').toLowerCase()
    return haystack.includes(term)
  }

  const term = search.trim().toLowerCase()

  const listings = useMemo(() => allListings.filter(l =>
    (!activeCat || l.category === activeCat) &&
    matchesCity(l.service_area, activeCity) &&
    matchesSearch(l, term)
  ), [allListings, activeCat, activeCity, term])

  // Chip counts respect the other filters but not the category itself, so the
  // numbers describe what clicking a chip would actually show.
  const popularCats = useMemo(() => {
    const pool = allListings.filter(l =>
      matchesCity(l.service_area, activeCity) && matchesSearch(l, term)
    )
    return CATEGORIES
      .map(cat => ({ ...cat, count: pool.filter(l => l.category === cat.id).length }))
      .filter(cat => cat.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  }, [allListings, activeCity, term])

  const hasFilters = Boolean(search || activeCat || activeCity)

  const countLabel = useMemo(() => {
    const catName = activeCat ? getCategoryById(activeCat).name : ''
    const noun = listings.length === 1 ? 'service' : 'services'
    let label = `Showing ${listings.length} ${catName ? `${catName} ` : ''}${noun}`
    if (activeCity) label += ` in ${activeCity}`
    if (search.trim()) label += ` matching “${search.trim()}”`
    return label
  }, [listings.length, activeCat, activeCity, search])

  function toggleCat(id) {
    setActiveCat(prev => (prev === id ? '' : id))
  }

  function clearAll() {
    setSearch('')
    setActiveCat('')
    setActiveCity('')
  }

  function scrollToResults(e) {
    if (e) e.preventDefault()
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

        {/* ── HERO — exact homepage layout ── */}
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

            {/* Exact homepage search component */}
            <div className="hn-search-wrap">
              <div className="hn-search-box">
                <svg className="hn-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  className="hn-search-input"
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

        {/* ── FILTER BAR — same shape across every MN directory ── */}
        <div className="sv-filterbar">
          <div className="sv-filterbar-inner">
            <div className="sv-fb-search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                className="sv-fb-input"
                type="search"
                placeholder="Search services..."
                aria-label="Search services"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="sv-fb-select"
              aria-label="Filter by category"
              value={activeCat}
              onChange={e => setActiveCat(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              className="sv-fb-select"
              aria-label="Filter by city"
              value={activeCity}
              onChange={e => setActiveCity(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile CTA — the desktop one lives in the results toolbar */}
        <div className="sv-mobile-submit">
          <Link href="/submit" className="sv-list-btn">+ List Your Service</Link>
        </div>

        {/* ── DIRECTORY ── */}
        <div className="sv-body">

          {/* Sticky sidebar — stays in sync with the Category dropdown */}
          <aside className="sv-sidebar">
            <div className="sv-sidebar-label">Categories</div>
            <button className={`sv-cat-btn${activeCat === '' ? ' sv-cat-active' : ''}`} onClick={() => setActiveCat('')}>
              All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button key={cat.id} className={`sv-cat-btn${activeCat === cat.id ? ' sv-cat-active' : ''}`} onClick={() => toggleCat(cat.id)}>
                {cat.name}
              </button>
            ))}

            <div className="sv-sidebar-label" style={{ marginTop: '24px' }}>City</div>
            <button className={`sv-cat-btn${activeCity === '' ? ' sv-cat-active' : ''}`} onClick={() => setActiveCity('')}>
              All Cities
            </button>
            {cities.map(city => (
              <button key={city} className={`sv-cat-btn${activeCity === city ? ' sv-cat-active' : ''}`} onClick={() => setActiveCity(prev => prev === city ? '' : city)}>
                {city}
              </button>
            ))}
          </aside>

          {/* Main */}
          <main className="sv-main" ref={resultsRef}>

            {/* Popular categories — quick jump into the biggest sections */}
            {!loading && popularCats.length > 1 && (
              <div className="sv-popchips">
                {popularCats.map(cat => (
                  <button
                    key={cat.id}
                    className={`sv-popchip${activeCat === cat.id ? ' sv-popchip-active' : ''}`}
                    onClick={() => toggleCat(cat.id)}
                  >
                    {cat.name} <span className="sv-popchip-count">{cat.count}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Toolbar — listing count + desktop CTA */}
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
                <div className="sv-empty-icon">🔍</div>
                <h3 className="sv-empty-title">No services found.</h3>
                <p className="sv-empty-sub">
                  {hasFilters
                    ? 'Try another city or category.'
                    : 'The directory is just getting started — be the first to list your service.'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                  {hasFilters && <button className="sv-empty-reset" onClick={clearAll}>Reset Filters</button>}
                  <Link href="/submit" className="sv-empty-cta">List Your Service →</Link>
                </div>
              </div>
            )}

            {/* Featured section — any listing with featured = true */}
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
