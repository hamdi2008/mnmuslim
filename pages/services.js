import { useState, useEffect } from 'react'
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

function ListingCard({ listing, featured }) {
  const cat = getCategoryById(listing.category)
  return (
    <Link href={`/listing/${listing.id}`} className={`sv-card${featured ? ' sv-card-featured' : ''}`}>
      <div className="sv-card-top">
        <span className="sv-card-badge">{cat.name}</span>
        {featured && <span className="sv-featured-badge">★ Featured</span>}
      </div>
      <div className="sv-card-name">{listing.service_name}</div>
      <div className="sv-card-provider">
        by <strong>{listing.business_name || listing.provider_name}</strong>
      </div>
      <TrustBadges listing={listing} />
      <p className="sv-card-desc">{listing.description}</p>
      <div className="sv-card-footer">
        <span className="sv-card-area">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {listing.service_area}
        </span>
        <span className="sv-card-cta">View details →</span>
      </div>
    </Link>
  )
}

// Category chip → category ID mapping
const CHIP_CATS = [
  { label: 'Education',         id: 'education' },
  { label: 'Home Services',     id: 'home' },
  { label: 'Technology',        id: 'tech' },
  { label: 'Health & Wellness', id: 'health' },
  { label: 'Photography',       id: 'photo' },
  { label: 'Business Services', id: 'business' },
]

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
  const [listings, setListings]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [activeCat, setActiveCat]   = useState('')
  const [phIdx, setPhIdx]           = useState(0)
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
  }, [router.isReady, router.query])

  // Core fetch — always call with explicit s/c values, never rely on state closure
  async function runFetch(s, c) {
    setLoading(true)
    const params = new URLSearchParams()
    if (s) params.set('search', s)
    if (c) params.set('category', c)
    try {
      const res  = await fetch('/api/listings?' + params.toString())
      const json = await res.json()
      setListings(Array.isArray(json) ? seededShuffle(json) : [])
    } catch(err) {
      setListings([])
    } finally {
      setLoading(false)
    }
  }

  // Initial load only
  useEffect(() => { runFetch('', '') }, [])

  // When category changes, re-fetch (clear search)
  useEffect(() => {
    if (!router.isReady) return
    runFetch('', activeCat)
  }, [activeCat])

  function toggleCat(id) {
    const next = activeCat === id ? '' : id
    setActiveCat(next)
    setSearch('')
  }

  function clearAll() {
    setSearch('')
    setActiveCat('')
    runFetch('', '')
  }

  function handleSearch(e) {
    if (e) e.preventDefault()
    const term = search.trim()
    setActiveCat('')
    runFetch(term, '')
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
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button className="hn-search-btn" onClick={handleSearch}>Search</button>
              </div>
            </div>

          </section>
        </div>

        {/* Mobile filter row — select + CTA button */}
        <div className="sv-mobile-filter">
          <select
            className="sv-cat-select"
            value={activeCat}
            onChange={e => setActiveCat(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <Link href="/submit" className="sv-mobile-list-btn">+ List Your Service</Link>
        </div>

        {/* ── DIRECTORY ── */}
        <div className="sv-body">

          {/* Sticky sidebar */}
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
          </aside>

          {/* Main */}
          <main className="sv-main">

            {/* Toolbar — desktop only */}
            <div className="sv-results-head sv-results-head-desktop">
              <div />
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
                <h3 className="sv-empty-title">
                  {activeCat ? 'No listings in this category yet.' : 'No services found'}
                </h3>
                <p className="sv-empty-sub">
                  {activeCat
                    ? 'Be the first to list your service in this category.'
                    : 'Try a different keyword or browse a different category.'}
                </p>
                {activeCat ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    <Link href="/submit" className="sv-empty-cta">List Your Service →</Link>
                    <button className="sv-empty-reset" onClick={clearAll}>Browse all categories</button>
                  </div>
                ) : (
                  <button className="sv-empty-reset" onClick={clearAll}>Clear filters</button>
                )}
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
