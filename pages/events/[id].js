import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import {
  getEventCategoryById, EVENT_PUBLIC_COLUMNS,
  isUpcoming, formatEventDate, directionsUrl, icsCalendar,
} from '../../lib/events'

export async function getServerSideProps({ params }) {
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_PUBLIC_COLUMNS)
    .eq('id', params.id)
    .eq('approved', true)
    .single()
  if (error || !data) return { notFound: true }
  return { props: { event: data } }
}

function downloadIcs(event) {
  const blob = new Blob([icsCalendar([event])], { type: 'text/calendar' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${event.title.slice(0, 40).replace(/[^a-z0-9]+/gi, '-')}.ics`
  a.click()
  URL.revokeObjectURL(a.href)
}

const CalendarIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const ClockIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const PinIcon      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>

export default function EventDetail({ event }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [ended, setEnded] = useState(false)
  const cat = getEventCategoryById(event.category)
  const dateLabel = formatEventDate(event.date, event.end_date)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Computed client-side so the SSR-cached page can't go stale.
  useEffect(() => { setEnded(!isUpcoming(event)) }, [event])

  const metaDesc = `${event.title} — ${dateLabel}${event.time_label ? `, ${event.time_label}` : ''} at ${event.venue}, ${event.city}, MN.`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.date,
    ...(event.end_date ? { endDate: event.end_date } : {}),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.city,
        addressRegion: 'MN',
        addressCountry: 'US',
      },
    },
    ...(event.flier_url ? { image: [event.flier_url] } : {}),
    ...(event.description ? { description: event.description } : { description: metaDesc }),
    ...(event.link ? { url: event.link } : {}),
    organizer: { '@type': 'Organization', name: 'See event listing', url: `https://mnmuslim.com/events/${event.id}` },
  }

  return (
    <>
      <Head>
        <title>{event.title} | MNMuslim Events</title>
        <meta name="description" content={metaDesc} />
        <link rel="icon" href="/favicon.png" />
        <meta property="og:title" content={`${event.title} | MNMuslim Events`} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={event.flier_url || 'https://mnmuslim.com/og-image.png'} />
        <meta property="og:url" content={`https://mnmuslim.com/events/${event.id}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MNMuslim" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${event.title} | MNMuslim Events`} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={event.flier_url || 'https://mnmuslim.com/og-image.png'} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <div className="home-page">

        {/* NAV */}
        <nav className={`hn-nav${scrolled ? ' scrolled' : ''}`} style={{ background: '#071423', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/" className="hn-logo">
            <img src="/logo.png" alt="MNMuslim" className="hn-logo-img" />
          </Link>
          <div className="hn-pill">
            <Link href="/services" className="hn-nl">Services</Link>
            <Link href="/events" className="hn-nl hn-nl-active">Events</Link>
            <a href="https://mnhalal.com" className="hn-nl" target="_blank" rel="noopener noreferrer">MNHalal</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/contact" className="hn-contact">Contact <span>→</span></Link>
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
                <img src="/logo-light.png" alt="MNMuslim" style={{ width: '140px', height: 'auto' }} />
              </Link>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
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

        {/* PAGE CONTENT */}
        <div className="ev-detail-page">

          <div className="ev-detail-breadcrumb">
            <Link href="/events" className="ev-back">← All events</Link>
          </div>

          {ended && (
            <div className="ev-ended-banner">
              This event has ended. <Link href="/events">See upcoming events →</Link>
            </div>
          )}

          <div className="ev-detail-layout">

            {/* Main column */}
            <div className="ev-detail-main">
              <div className="ev-detail-header">
                <span className="ev-card-badge">{cat.icon} {cat.name}</span>
                <h1 className="ev-detail-title">{event.title}</h1>
                <div className="ev-detail-meta">
                  <span className="ev-detail-meta-item"><CalendarIcon /> {dateLabel}</span>
                  {event.time_label && <span className="ev-detail-meta-item"><ClockIcon /> {event.time_label}</span>}
                  <span className="ev-detail-meta-item"><PinIcon /> {event.venue}, {event.city}, MN</span>
                </div>
              </div>

              {event.flier_url && (
                <div className="ev-detail-flier">
                  <img src={event.flier_url} alt={`${event.title} flier`} />
                </div>
              )}

              {event.description && (
                <div className="ev-detail-section">
                  <div className="ev-detail-section-title">About this event</div>
                  <p className="ev-detail-desc">{event.description}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="ev-detail-sidebar">
              <div className="ev-detail-card">
                <div className="ev-detail-card-title">Event Details</div>
                <div className="ev-detail-rows">
                  <div className="ev-detail-row">
                    <div className="ev-detail-row-icon"><CalendarIcon /></div>
                    <div>
                      <div className="ev-detail-row-label">Date</div>
                      <div className="ev-detail-row-value">{dateLabel}</div>
                    </div>
                  </div>
                  {event.time_label && (
                    <div className="ev-detail-row">
                      <div className="ev-detail-row-icon"><ClockIcon /></div>
                      <div>
                        <div className="ev-detail-row-label">Time</div>
                        <div className="ev-detail-row-value">{event.time_label}</div>
                      </div>
                    </div>
                  )}
                  <div className="ev-detail-row">
                    <div className="ev-detail-row-icon"><PinIcon /></div>
                    <div>
                      <div className="ev-detail-row-label">Location</div>
                      <div className="ev-detail-row-value">{event.venue}<br />{event.city}, MN</div>
                    </div>
                  </div>
                </div>

                {!ended && (
                  <div className="ev-detail-actions">
                    <a href={directionsUrl(event)} className="ev-action-btn ev-action-primary" target="_blank" rel="noopener noreferrer">Get Directions</a>
                    <button className="ev-action-btn ev-action-secondary" onClick={() => downloadIcs(event)}>Add to Calendar</button>
                    {event.link && (
                      <a href={event.link} className="ev-action-btn ev-action-secondary" target="_blank" rel="noopener noreferrer">
                        {event.link.includes('instagram.com') ? 'View Original Post' : 'Event Page'} ↗
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="ev-detail-prompt">
                <p className="ev-detail-prompt-text">Hosting a community event?</p>
                <Link href="/submit-event" className="ev-detail-prompt-link">Submit your event →</Link>
              </div>
            </aside>
          </div>
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
                  <Link href="/services" className="hn-fl">Muslim Services</Link>
                  <Link href="/events" className="hn-fl">Events</Link>
                  <a href="https://mnhalal.com" className="hn-fl" target="_blank" rel="noopener noreferrer">MNHalal</a>
                </div>
                <div className="hn-footer-col">
                  <div className="hn-footer-col-title">Company</div>
                  <Link href="/contact" className="hn-fl">Contact</Link>
                </div>
                <div className="hn-footer-col">
                  <div className="hn-footer-col-title">Resources</div>
                  <Link href="/submit" className="hn-fl">List Your Service</Link>
                  <Link href="/submit-event" className="hn-fl">Submit Your Event</Link>
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
