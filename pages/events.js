import { useState, useEffect, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { EVENT_CATEGORIES, getEventCategoryById, EVENTS } from '../lib/events'

function EventCard({ event }) {
  const cat = getEventCategoryById(event.category)
  return (
    <a href={event.link} target="_blank" rel="noopener noreferrer" className="ev-card">
      <div className="ev-card-top">
        <span className="ev-card-badge">{cat.icon} {cat.name}</span>
      </div>
      <div className="ev-card-title">{event.title}</div>
      <div className="ev-card-meta">
        <span className="ev-card-meta-row">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {event.dateLabel} · {event.time}
        </span>
        <span className="ev-card-meta-row">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {event.venue}, {event.city}
        </span>
      </div>
      <div className="ev-card-footer">
        <span className="ev-card-cta">View Event →</span>
      </div>
    </a>
  )
}

export default function Events() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [activeCat, setActiveCat]   = useState('')
  const [activeCity, setActiveCity] = useState('')
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!router.isReady) return
    if (router.query.category) setActiveCat(router.query.category)
    if (router.query.city) setActiveCity(router.query.city)
  }, [router.isReady, router.query])

  const cities = useMemo(
    () => [...new Set(EVENTS.map(e => e.city))].sort(),
    []
  )

  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return EVENTS
      .filter(e => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [])

  const filteredEvents = useMemo(() => {
    return upcomingEvents.filter(e => {
      if (activeCat && e.category !== activeCat) return false
      if (activeCity && e.city !== activeCity) return false
      return true
    })
  }, [upcomingEvents, activeCat, activeCity])

  function toggleCat(id) {
    setActiveCat(prev => (prev === id ? '' : id))
  }

  function clearAll() {
    setActiveCat('')
    setActiveCity('')
  }

  return (
    <>
      <Head>
        <title>Muslim Community Events | MNMuslim</title>
        <meta name="description" content="Discover Muslim community events across Minnesota — lectures, iftars, youth programs, fundraisers, and more." />
        <link rel="icon" href="/favicon.png" />
        <meta property="og:title" content="Muslim Community Events | MNMuslim" />
        <meta property="og:description" content="Discover Muslim community events across Minnesota — lectures, iftars, youth programs, fundraisers, and more." />
        <meta property="og:image" content="https://mnmuslim.com/og-image.png" />
        <meta property="og:url" content="https://mnmuslim.com/events" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MNMuslim" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Muslim Community Events | MNMuslim" />
        <meta name="twitter:description" content="Discover Muslim community events across Minnesota — lectures, iftars, youth programs, fundraisers, and more." />
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
            <Link href="/events" className={`hn-nl${router.pathname === '/events' ? ' hn-nl-active' : ''}`}>Events</Link>
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
                { label: 'Events', href: '/events', internal: true },
                { label: 'MNHalal', href: 'https://mnhalal.com', internal: false },
                { label: 'Contact', href: '/contact', internal: true },
              ].map(item => item.internal
                ? <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} style={{ color: '#fff', fontSize: '32px', fontWeight: '800', textDecoration: 'none', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', letterSpacing: '-1px', display: 'block' }}>{item.label}</Link>
                : <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} style={{ color: '#fff', fontSize: '32px', fontWeight: '800', textDecoration: 'none', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', letterSpacing: '-1px', display: 'block' }}>{item.label}</a>
              )}
            </div>
          </div>
        )}

        {/* ── HERO ── */}
        <div className="hn-dark-header">
          <section className="hn-hero">
            <div className="hn-g hn-g1" /><div className="hn-g hn-g2" /><div className="hn-g hn-g3" />
            <p className="hn-hero-eyebrow">Community Events</p>
            <h1 className="hn-h1">Find Muslim Events in Minnesota</h1>
            <p className="hn-sub">
              Lectures, iftars, youth programs, fundraisers, and more from Minnesota&apos;s Muslim community.
            </p>
          </section>
        </div>

        {/* Mobile filter row */}
        <div className="ev-mobile-filter">
          <select className="ev-select" value={activeCat} onChange={e => setActiveCat(e.target.value)}>
            <option value="">All Categories</option>
            {EVENT_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select className="ev-select" value={activeCity} onChange={e => setActiveCity(e.target.value)}>
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* ── DIRECTORY ── */}
        <div className="ev-body">

          {/* Sticky sidebar — categories */}
          <aside className="ev-sidebar">
            <div className="ev-sidebar-label">Categories</div>
            <button className={`ev-cat-btn${activeCat === '' ? ' ev-cat-active' : ''}`} onClick={() => setActiveCat('')}>
              All Categories
            </button>
            {EVENT_CATEGORIES.map(cat => (
              <button key={cat.id} className={`ev-cat-btn${activeCat === cat.id ? ' ev-cat-active' : ''}`} onClick={() => toggleCat(cat.id)}>
                {cat.icon} {cat.name}
              </button>
            ))}

            <div className="ev-sidebar-label" style={{ marginTop: '24px' }}>City</div>
            <button className={`ev-cat-btn${activeCity === '' ? ' ev-cat-active' : ''}`} onClick={() => setActiveCity('')}>
              All Cities
            </button>
            {cities.map(city => (
              <button key={city} className={`ev-cat-btn${activeCity === city ? ' ev-cat-active' : ''}`} onClick={() => setActiveCity(prev => prev === city ? '' : city)}>
                {city}
              </button>
            ))}
          </aside>

          {/* Main */}
          <main className="ev-main">

            {!filteredEvents.length && (
              <div className="ev-empty">
                <div className="ev-empty-icon">📅</div>
                <h3 className="ev-empty-title">No upcoming events found</h3>
                <p className="ev-empty-sub">Try a different category or city.</p>
                <button className="ev-empty-reset" onClick={clearAll}>Clear filters</button>
              </div>
            )}

            {filteredEvents.length > 0 && (
              <div className="ev-grid">
                {filteredEvents.map(event => <EventCard key={event.id} event={event} />)}
              </div>
            )}
          </main>
        </div>

        {/* NEWSLETTER */}
        <section className="hn-newsletter-section">
          <div className="hn-newsletter-inner">
            <h2>Stay Connected</h2>
            <p className="hn-nl-sub">Stay up to date with community events, Muslim services, halal businesses, local resources, opportunities, and new MNMuslim updates.</p>
            <form
              action="https://app.kit.com/forms/9625003/subscriptions"
              method="post"
              target="_blank"
              className="hn-newsletter-row"
            >
              <input type="email" name="email_address" placeholder="Email Address" required />
              <button type="submit">Stay Connected</button>
            </form>
            <p className="hn-newsletter-fine">We won&apos;t send you spam. Unsubscribe at any time.</p>
          </div>
        </section>

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
                  <Link href="/events" className="hn-fl">Events</Link>
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
