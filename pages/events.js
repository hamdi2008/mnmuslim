import { useState, useEffect, useMemo, useRef } from 'react'
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

// "Today" for an event starting today, "Happening now" for a multi-day one
// already underway. Nothing otherwise — the badge only earns its place when
// it changes what you'd do.
function todayBadge(event, today) {
  if (event.date === today) return 'Today'
  if (event.date < today) return 'Happening now'
  return null
}

// Room is left here for a Featured event card if sponsored listings land —
// see the `featured` treatment on /services for the pattern to follow.
function EventCard({ event, today }) {
  const cat = getEventCategoryById(event.category)
  const badge = todayBadge(event, today)
  return (
    <Link
      href={`/events/${event.id}`}
      className="ev-card"
      aria-label={`View details for ${event.title}`}
    >
      <div className="ev-card-top">
        <span className="ev-card-badge">{cat.icon} {cat.name}</span>
        {badge && <span className="ev-today-badge">{badge}</span>}
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
  const [activeCat, setActiveCat] = useState('')
  const inited = useRef(false)
  const router = useRouter()

  // Seed from the URL once; the effect below then owns the query string.
  useEffect(() => {
    if (!router.isReady || inited.current) return
    inited.current = true
    if (router.query.category) setActiveCat(router.query.category)
  }, [router.isReady, router.query])

  // Keep the category in the URL so results can be shared or survive a refresh.
  useEffect(() => {
    if (!inited.current) return
    router.replace(
      { pathname: '/events', query: activeCat ? { category: activeCat } : {} },
      undefined,
      { shallow: true, scroll: false }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCat])

  const today = mnToday()

  // ISR regenerates every 5 min, but re-filter client-side so a long-open tab
  // doesn't keep showing an event that ended.
  const upcomingEvents = useMemo(() => events.filter(e => isUpcoming(e)), [events])

  const filteredEvents = useMemo(
    () => upcomingEvents.filter(e => !activeCat || e.category === activeCat),
    [upcomingEvents, activeCat]
  )

  // Empty date groups drop out on their own — groupUpcomingEvents only creates
  // a group when an event lands in it.
  const eventGroups = useMemo(() => groupUpcomingEvents(filteredEvents), [filteredEvents])

  // "15 upcoming events" · "4 Youth events" · "3 Conferences" · "No upcoming events"
  const countLabel = useMemo(() => {
    const n = filteredEvents.length
    if (!n) return 'No upcoming events'
    const noun = n === 1 ? 'event' : 'events'
    if (!activeCat) return `${n} upcoming ${noun}`
    const cat = getEventCategoryById(activeCat)
    // Already-plural names read wrong with "events" appended.
    return cat.plural && n !== 1 ? `${n} ${cat.name}` : `${n} ${cat.name} ${noun}`
  }, [filteredEvents.length, activeCat])

  function toggleCat(id) {
    setActiveCat(prev => (prev === id ? '' : id))
  }

  function clearAll() {
    setActiveCat('')
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

        {/* ── DIRECTORY ── */}
        <div className="ev-body">

          {/* Sticky category sidebar — desktop */}
          <aside className="ev-sidebar" aria-label="Event categories">
            <div className="ev-sidebar-label">Categories</div>
            <button
              className={`ev-cat-btn${activeCat === '' ? ' ev-cat-active' : ''}`}
              aria-pressed={activeCat === ''}
              onClick={() => setActiveCat('')}
            >
              All Categories
            </button>
            {EVENT_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`ev-cat-btn${activeCat === cat.id ? ' ev-cat-active' : ''}`}
                aria-pressed={activeCat === cat.id}
                onClick={() => toggleCat(cat.id)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </aside>

          {/* Main */}
          <main className="ev-main">

            {/* Category control — mobile only, stands in for the hidden sidebar */}
            <select
              className="ev-mobile-cat"
              aria-label="Filter by category"
              value={activeCat}
              onChange={e => setActiveCat(e.target.value)}
            >
              <option value="">All Categories</option>
              {EVENT_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Count + CTA */}
            <div className="ev-results-head">
              <span className="ev-count">{countLabel}</span>
              <Link href="/submit-event" className="ev-submit-btn">+ Submit Your Event</Link>
            </div>

            {!filteredEvents.length && (
              <div className="ev-empty">
                <div className="ev-empty-icon" aria-hidden="true">📅</div>
                <h2 className="ev-empty-title">No upcoming events found</h2>
                <p className="ev-empty-sub">
                  {activeCat
                    ? 'Try another category.'
                    : 'Nothing on the calendar right now — add your event and get it in front of the community.'}
                </p>
                {activeCat
                  ? <button className="ev-empty-reset" onClick={clearAll}>View all events</button>
                  : <Link href="/submit-event" className="ev-empty-cta">Submit Your Event →</Link>}
              </div>
            )}

            {filteredEvents.length > 0 && eventGroups.map(group => (
              <div key={group.label} className="ev-group">
                <div className="ev-group-label">{group.label}</div>
                <div className="ev-grid">
                  {group.events.map(event => <EventCard key={event.id} event={event} today={today} />)}
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
