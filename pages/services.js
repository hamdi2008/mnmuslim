import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CATEGORIES, getCategoryById } from '../lib/categories'

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

function ListingCard({ listing }) {
  const cat = getCategoryById(listing.category)
  return (
    <Link href={`/listing/${listing.id}`} className="sv-card">
      <div className="sv-card-top">
        <span className="sv-card-badge">{cat.name}</span>
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
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
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!router.isReady) return
    if (router.query.search)   setSearch(router.query.search)
    if (router.query.category) setActiveCat(router.query.category)
  }, [router.isReady, router.query])

  async function doFetch(s, c) {
    setLoading(true)
    const params = new URLSearchParams()
    if (s) params.set('search', s)
    if (c) params.set('category', c)
    try {
      const res  = await fetch(`/api/listings?${params.toString()}`)
      const json = await res.json()
      setListings(Array.isArray(json) ? seededShuffle(json) : [])
    } catch(err) {
      console.error('[listings] fetch error:', err)
      setListings([])
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch when category changes (debounced)
  useEffect(() => {
    const t = setTimeout(() => doFetch(search, activeCat), 300)
    return () => clearTimeout(t)
  }, [activeCat])

  // Initial load
  useEffect(() => {
    doFetch('', '')
  }, [])

  function toggleCat(id) { setActiveCat(prev => prev === id ? '' : id) }
  function clearAll()    { setSearch(''); doFetch('', ''); setActiveCat('') }

  function handleSearch(e) {
    if (e) e.preventDefault()
    setActiveCat('')
    doFetch(search, '')
  }

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

        {/* ── NAV ── */}
        <nav className={`hn-nav${scrolled ? ' scrolled' : ''}`}>
          <Link href="/" className="hn-logo">
            <img src="/logo.png" alt="MNMuslim" className="hn-logo-img" />
          </Link>
          <div className="hn-pill">
            <Link href="/services" className={`hn-nl${router.pathname === '/services' ? ' hn-nl-active' : ''}`} target="_blank" rel="noopener noreferrer">Services</Link>
            <a href="https://mnhalal.com" className="hn-nl" target="_blank" rel="noopener noreferrer">MNHalal</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/contact" className="hn-contact" target="_blank" rel="noopener noreferrer">Contact <span aria-hidden="true">→</span></Link>
            <button className="hn-mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen
                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
              }
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#060D1A', zIndex: 100, display: 'flex', flexDirection: 'column', padding: '20px 24px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '52px' }}>
              <Link href="/" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                <img src="/logo-light.png" alt="MNMuslim" style={{ width: '140px', height: 'auto', display: 'block' }} />
              </Link>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {[
                { label: 'Services', href: '/services', internal: true },
                { label: 'MNHalal', href: 'https://mnhalal.com', internal: false },
                { label: 'Contact', href: '/contact', internal: true },
              ].map(item => item.internal
                ? <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontSize: '32px', fontWeight: '800', textDecoration: 'none', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', letterSpacing: '-1px', display: 'block' }}>{item.label}</Link>
                : <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} style={{ color: '#fff', fontSize: '32px', fontWeight: '800', textDecoration: 'none', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', letterSpacing: '-1px', display: 'block' }}>{item.label}</a>
              )}
            </div>
          </div>
        )}

        {/* ── HERO — exact homepage layout ── */}
        <div className="hn-dark-header">
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
          <Link href="/submit" className="sv-mobile-list-btn" target="_blank" rel="noopener noreferrer">+ List Your Service</Link>
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
              <Link href="/submit" className="sv-list-btn" target="_blank" rel="noopener noreferrer">+ List Your Service</Link>
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
                    <Link href="/submit" className="sv-empty-cta" target="_blank" rel="noopener noreferrer">List Your Service →</Link>
                    <button className="sv-empty-reset" onClick={clearAll}>Browse all categories</button>
                  </div>
                ) : (
                  <button className="sv-empty-reset" onClick={clearAll}>Clear filters</button>
                )}
              </div>
            )}

            {/* Grid */}
            {!loading && listings.length > 0 && (
              <div className="sv-grid">
                {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
              </div>
            )}
          </main>
        </div>

        {/* ── FOOTER ── */}
        <footer className="hn-footer">
          <div className="hn-footer-inner">
            <div className="hn-footer-top">
              <div className="hn-footer-brand">
                <Link href="/" className="hn-footer-logo">
                  <img src="/logo-footer.png" alt="MNMuslim" className="hn-footer-logo-img" />
                </Link>
                <p className="hn-footer-tag">Helping Minnesota Muslims discover trusted businesses, services, and community resources.</p>
                <p className="hn-footer-mission">Built by a Minnesota Muslim for the Minnesota Muslim community.</p>
              </div>
              <div className="hn-footer-cols">
                <div className="hn-footer-col">
                  <div className="hn-footer-col-title">Products</div>
                  <Link href="/services" className="hn-fl" target="_blank" rel="noopener noreferrer">Muslim Services</Link>
                  <a href="https://mnhalal.com" className="hn-fl" target="_blank" rel="noopener noreferrer">MNHalal</a>
                </div>
                <div className="hn-footer-col">
                  <div className="hn-footer-col-title">Company</div>
                  <Link href="/contact" className="hn-fl" target="_blank" rel="noopener noreferrer">Contact</Link>
                  </div>
                <div className="hn-footer-col">
                  <div className="hn-footer-col-title">Resources</div>
                  <Link href="/submit" className="hn-fl" target="_blank" rel="noopener noreferrer">List Your Service</Link>
                  <a href="https://mnhalal.com/submit" className="hn-fl" target="_blank" rel="noopener noreferrer">Add Your Halal Food Business</a>
                </div>
                <div className="hn-footer-col">
                  <div className="hn-footer-col-title">Community</div>
                  <a href="https://www.instagram.com/mnmuslimevents/" className="hn-fl" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
              </div>
            </div>
            <div className="hn-footer-bottom">
              <div>
                <span className="hn-fb-copy">© 2026 MNMuslim</span>
                <span className="hn-fb-copy hn-fb-copy-sub">Built in Minnesota for the Minnesota Muslim community.</span>
              </div>
              <div className="hn-fb-legal">
                <Link href="/privacy" className="hn-fb-link" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
                <Link href="/terms" className="hn-fb-link" target="_blank" rel="noopener noreferrer">Terms of Use</Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
