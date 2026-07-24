import { useState, useEffect, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import {
  EVENT_CATEGORIES, getEventCategoryById, EVENT_PUBLIC_COLUMNS,
  mnToday, isUpcoming, formatEventDate, groupUpcomingEvents,
} from '../lib/events'

export async function getStaticProps() {
  let events = []
  try {
    const today = mnToday()
    const { data } = await supabase
      .from('events')
      .select(EVENT_PUBLIC_COLUMNS)
      .eq('approved', true)
      .or(`date.gte.${today},end_date.gte.${today}`)
      .order('date', { ascending: true })
    events = data || []
  } catch (err) {
    console.error('Events fetch failed:', err)
  }
  return { props: { events }, revalidate: 300 }
}

function EventCard({ event }) {
  const cat = getEventCategoryById(event.category)
  return (
    <Link href={`/events/${event.id}`} className="ev-card">
      <div className="ev-card-top">
        <span className="ev-card-badge">{cat.icon} {cat.name}</span>
      </div>
      <div className="ev-card-title">{event.title}</div>
      <div className="ev-card-meta">
        <span className="ev-card-meta-row">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {formatEventDate(event.date, event.end_date)}{event.time_label ? ` · ${event.time_label}` : ''}
        </span>
        <span className="ev-card-meta-row">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {event.venue}, {event.city}
        </span>
      </div>
      <div className="ev-card-footer">
        <span className="ev-card-cta">View details →</span>
      </div>
    </Link>
  )
}

export default function Events({ events }) {
  const [activeCat, setActiveCat]   = useState('')
  const [activeCity, setActiveCity] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    if (router.query.category) setActiveCat(router.query.category)
    if (router.query.city) setActiveCity(router.query.city)
  }, [router.isReady, router.query])

  // ISR regenerates every 5 min, but re-filter client-side so a long-open tab
  // doesn't keep showing an event that ended.
  const upcomingEvents = useMemo(() => events.filter(e => isUpcoming(e)), [events])

  const cities = useMemo(
    () => [...new Set(upcomingEvents.map(e => e.city))].sort(),
    [upcomingEvents]
  )

  const filteredEvents = useMemo(() => {
    return upcomingEvents.filter(e => {
      if (activeCat && e.category !== activeCat) return false
      if (activeCity && e.city !== activeCity) return false
      return true
    })
  }, [upcomingEvents, activeCat, activeCity])

  const eventGroups = useMemo(() => groupUpcomingEvents(filteredEvents), [filteredEvents])

  function toggleCat(id) {
    setActiveCat(prev => (prev === id ? '' : id))
  }

  function clearAll() {
    setActiveCat('')
    setActiveCity('')
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: upcomingEvents.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://mnmuslim.com/events/${e.id}`,
    })),
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <div className="home-page">

        {/* ── HERO ── */}
        <div className="hn-dark-header">
          <SiteNav />
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
        <div className="ev-mobile-submit">
          <Link href="/submit-event" className="ev-submit-btn">+ Submit Your Event</Link>
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

            {/* Toolbar — desktop only */}
            <div className="ev-results-head">
              <div />
              <Link href="/submit-event" className="ev-submit-btn">+ Submit Your Event</Link>
            </div>

            {!filteredEvents.length && (
              <div className="ev-empty">
                <div className="ev-empty-icon">📅</div>
                <h3 className="ev-empty-title">No upcoming events found</h3>
                <p className="ev-empty-sub">Try a different category or city — or add your event to the calendar.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                  <Link href="/submit-event" className="ev-empty-cta">Submit Your Event →</Link>
                  <button className="ev-empty-reset" onClick={clearAll}>Clear filters</button>
                </div>
              </div>
            )}

            {filteredEvents.length > 0 && eventGroups.map(group => (
              <div key={group.label} className="ev-group">
                <div className="ev-group-label">{group.label}</div>
                <div className="ev-grid">
                  {group.events.map(event => <EventCard key={event.id} event={event} />)}
                </div>
              </div>
            ))}
          </main>
        </div>

        <SiteFooter />

      </div>
    </>
  )
}
