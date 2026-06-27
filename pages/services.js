import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CATEGORIES, getCategoryById } from '../lib/categories'

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
        <span className="sv-card-badge">{cat.icon} {cat.name}</span>
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

export default function Services() {
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const [listings, setListings]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [activeCat, setActiveCat]     = useState('')
  const [catOpen, setCatOpen]         = useState(false)
  const router = useRouter()

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

  const fetchListings = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search)    params.set('search', search)
    if (activeCat) params.set('category', activeCat)
    try {
      const res  = await fetch(`/api/listings?${params.toString()}`)
      const data = await res.json()
      setListings(Array.isArray(data) ? data : [])
    } catch { setListings([]) }
    finally  { setLoading(false) }
  }, [search, activeCat])

  useEffect(() => {
    const t = setTimeout(fetchListings, 300)
    return () => clearTimeout(t)
  }, [fetchListings])

  function toggleCat(id) { setActiveCat(prev => prev === id ? '' : id) }
  function clearAll()    { setSearch(''); setActiveCat('') }

  const activeCatName = activeCat ? getCategoryById(activeCat)?.name : ''

  return (
    <>
      <Head>
        <title>Muslim Services Directory — MNMuslim</title>
        <meta name="description" content="Discover trusted Muslim-owned businesses, freelancers, and service providers across Minnesota." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="home-page">

        {/* NAV */}
        <nav className={`hn-nav${scrolled ? ' scrolled' : ''}`}>
          <Link href="/" className="hn-logo">
            <img src="/logo.png" alt="MNMuslim" className="hn-logo-img" />
          </Link>
          <div className="hn-pill">
            <Link href="/services" className={`hn-nl${router.pathname === '/services' ? ' hn-nl-active' : ''}`}>Services</Link>
            <a href="https://mnhalal.com" className="hn-nl" target="_blank" rel="noopener noreferrer">MNHalal</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/contact" className="hn-contact">Contact <span aria-hidden="true">→</span></Link>
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
                ? <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} style={{ color: '#fff', fontSize: '32px', fontWeight: '800', textDecoration: 'none', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', letterSpacing: '-1px', display: 'block' }}>{item.label}</Link>
                : <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} style={{ color: '#fff', fontSize: '32px', fontWeight: '800', textDecoration: 'none', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', letterSpacing: '-1px', display: 'block' }}>{item.label}</a>
              )}
            </div>
          </div>
        )}

        {/* HERO — compact */}
        <section className="sv-hero">
          <div className="sv-hero-glow" />
          <div className="sv-hero-inner">
            <p className="sv-eyebrow">Muslim Services Directory</p>
            <h1 className="sv-hero-h1">Find trusted Muslim<br />services in Minnesota</h1>
            <p className="sv-hero-sub">Discover Muslim-owned businesses, freelancers, and service providers across Minnesota.</p>
            <div className="sv-search-wrap">
              <div className="sv-search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  className="sv-search-input"
                  placeholder="Search for a photographer, tutor, contractor, or keyword..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button className="sv-search-clear" onClick={() => setSearch('')} aria-label="Clear">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* DIRECTORY */}
        <div className="sv-body">

          {/* Sticky sidebar — desktop */}
          <aside className="sv-sidebar">
            <div className="sv-sidebar-label">Categories</div>
            <button className={`sv-cat-btn${activeCat === '' ? ' sv-cat-active' : ''}`} onClick={() => setActiveCat('')}>
              <span className="sv-cat-icon">🗂️</span> All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button key={cat.id} className={`sv-cat-btn${activeCat === cat.id ? ' sv-cat-active' : ''}`} onClick={() => toggleCat(cat.id)}>
                <span className="sv-cat-icon">{cat.icon}</span> {cat.name}
              </button>
            ))}
          </aside>

          {/* Main */}
          <main className="sv-main">

            {/* Mobile: horizontal scrollable category chips */}
            <div className="sv-pills-mobile">
              <button className={`sv-pill${activeCat === '' ? ' sv-pill-active' : ''}`} onClick={() => setActiveCat('')}>All</button>
              {CATEGORIES.map(cat => (
                <button key={cat.id} className={`sv-pill${activeCat === cat.id ? ' sv-pill-active' : ''}`} onClick={() => toggleCat(cat.id)}>
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            {/* Toolbar — List Your Service only, no count */}
            <div className="sv-results-head">
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
                <h3 className="sv-empty-title">No services found</h3>
                <p className="sv-empty-sub">Try a different keyword or browse a category.</p>
                <button className="sv-empty-reset" onClick={clearAll}>Clear Search</button>
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

        {/* CTA */}
        <section className="sv-cta-bar">
          <div className="sv-cta-bar-inner">
            <div>
              <div className="sv-cta-bar-title">Grow your business with MNMuslim</div>
              <div className="sv-cta-bar-sub">List your service for free and help Minnesota Muslims discover what you offer.</div>
            </div>
            <Link href="/submit" className="sv-cta-bar-btn">List Your Service →</Link>
          </div>
        </section>

        {/* FOOTER */}
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
                  <Link href="/services" className="hn-fl">Muslim Services</Link>
                  <a href="https://mnhalal.com" className="hn-fl" target="_blank" rel="noopener noreferrer">MNHalal</a>
                </div>
                <div className="hn-footer-col">
                  <div className="hn-footer-col-title">Company</div>
                  <Link href="/contact" className="hn-fl">Contact</Link>
                  <Link href="/contact" className="hn-fl">Suggest a Feature</Link>
                </div>
                <div className="hn-footer-col">
                  <div className="hn-footer-col-title">Resources</div>
                  <Link href="/submit" className="hn-fl">List Your Service</Link>
                  <a href="https://mnhalal.com/submit" className="hn-fl" target="_blank" rel="noopener noreferrer">List Halal Business</a>
                </div>
                <div className="hn-footer-col">
                  <div className="hn-footer-col-title">Community</div>
                  <a href="https://instagram.com/mnmuslimevents" className="hn-fl" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
              </div>
            </div>
            <div className="hn-footer-bottom">
              <div>
                <span className="hn-fb-copy">© 2026 MNMuslim</span>
                <span className="hn-fb-copy hn-fb-copy-sub">Built in Minnesota for the Minnesota Muslim community.</span>
              </div>
              <div className="hn-fb-legal">
                <Link href="/privacy" className="hn-fb-link">Privacy Policy</Link>
                <Link href="/terms" className="hn-fb-link">Terms of Use</Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
