import { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

export default function Home() {
  useEffect(() => {
    const els = document.querySelectorAll('.hn-reveal')
    if (!els.length) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('hn-revealed'); obs.unobserve(e.target) } })
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
    els.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('hn-revealed')
      else obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const destinations = [
    {
      variant: 'teal',
      tag: 'Services Directory',
      name: 'Muslim Services',
      desc: 'Find Muslim professionals, businesses, and service providers across Minnesota.',
      cta: 'Find a Service',
      href: '/services',
      external: false,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    },
    {
      variant: 'blue',
      tag: 'Community Calendar',
      name: 'Community Events',
      desc: 'Discover upcoming events, programs, classes, and activities near you.',
      cta: 'Browse Events',
      href: '/events',
      external: false,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    },
    {
      variant: 'gold',
      tag: 'Halal Food Guide',
      name: 'MNHalal',
      desc: 'Explore halal restaurants, cafés, bakeries, and markets across Minnesota.',
      cta: 'Explore MNHalal',
      href: 'https://mnhalal.com',
      external: true,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2"/><path d="M5 2v20"/><path d="M13 2v20"/><path d="M13 8c0-3.3 1.8-6 4-6s4 2.7 4 6-1.8 5-4 5"/></svg>,
    },
  ]

  return (
    <>
      <Head>
        <title>MNMuslim | Digital Home for Muslims in Minnesota</title>
        <meta name="description" content="Find Muslim services, discover community events, and explore halal food across Minnesota — all in one place." />
        <link rel="icon" href="/favicon.png" />
        {/* Open Graph */}
        <meta property="og:title" content="MNMuslim | Digital Home for Muslims in Minnesota" />
        <meta property="og:description" content="Find Muslim services, discover community events, and explore halal food across Minnesota." />
        <meta property="og:image" content="https://mnmuslim.com/og-image.png" />
        <meta property="og:url" content="https://mnmuslim.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MNMuslim" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MNMuslim | Digital Home for Muslims in Minnesota" />
        <meta name="twitter:description" content="Find Muslim services, discover community events, and explore halal food across Minnesota." />
        <meta name="twitter:image" content="https://mnmuslim.com/og-image.png" />
      </Head>

      <div className="home-page">
        <div className="hn-dark-header">
          <SiteNav />

          {/* DASHBOARD HERO */}
          <section className="hn-hero hn-hero-dash">
            <div className="hn-g hn-g1" /><div className="hn-g hn-g2" /><div className="hn-g hn-g3" />
            <p className="hn-hero-eyebrow">The digital home for Muslims in Minnesota</p>
            <h1 className="hn-h1 hn-h1-dash">Everything Minnesota Muslims need</h1>
            <p className="hn-sub">
              Discover trusted Muslim services, community events, and halal food across Minnesota.
            </p>

            <div className="hn-dash-wrap">
              <div className="hn-dash-grid">
                {destinations.map((d, i) => {
                  const inner = (
                    <>
                      <div className="hn-dash-orb" />
                      <div className="hn-dash-icon">{d.icon}</div>
                      <div className="hn-dash-tag">{d.tag}</div>
                      <h2 className="hn-dash-name">{d.name}</h2>
                      <p className="hn-dash-desc">{d.desc}</p>
                      <span className="hn-dash-cta">
                        {d.cta} <span className="hn-dash-arr" aria-hidden="true">{d.external ? '↗' : '→'}</span>
                      </span>
                    </>
                  )
                  const cls = `hn-dash-card hn-dash-${d.variant} hn-reveal hn-reveal-d${i + 1}`
                  return d.external ? (
                    <a key={d.name} href={d.href} className={cls} target="_blank" rel="noopener noreferrer">{inner}</a>
                  ) : (
                    <Link key={d.name} href={d.href} className={cls}>{inner}</Link>
                  )
                })}
              </div>
            </div>
          </section>
        </div>

        {/* GET DISCOVERED */}
        <section className="hn-cta">
          <div className="hn-cta-inner">
            <h2 className="hn-cta-h2">Get discovered by<br />Minnesota Muslims</h2>
            <p className="hn-cta-sub">Help more Minnesota Muslims discover what you offer.</p>
            <div className="hn-cta-btns">
              <Link href="/submit" className="hn-cta-btn1">List Your Service</Link>
              <Link href="/submit-event" className="hn-cta-btn2">Submit an Event</Link>
              <a href="https://mnhalal.com/submit" className="hn-cta-btn2" target="_blank" rel="noopener noreferrer">Add Your Halal Business ↗</a>
            </div>
            <p className="hn-cta-trust-line">Free to list · Built for the Minnesota Muslim community</p>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="hn-newsletter-section">
          <div className="hn-newsletter-inner">
            <h2>Stay Connected</h2>
            <p className="hn-nl-sub">Get updates about community events, Muslim services, halal businesses, and new MNMuslim resources.</p>
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

        <SiteFooter />
      </div>
    </>
  )
}
