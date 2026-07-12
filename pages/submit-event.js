import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { EVENT_CATEGORIES } from '../lib/events'

export default function SubmitEvent() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [submitted, setSubmitted]   = useState(false)

  const [form, setForm] = useState({
    title: '', category: '', date: '', end_date: '', time_label: '',
    venue: '', city: '', link: '', flier_url: '', description: '',
    contact_email: '',
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    for (const f of ['title', 'category', 'date', 'venue', 'city', 'contact_email']) {
      if (!form[f].trim()) { setError('Please fill in all required fields.'); return }
    }

    setLoading(true)
    try {
      const res  = await fetch('/api/submit-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Something went wrong. Please try again.')
      else setSubmitted(true)
    } catch { setError('Network error. Please check your connection and try again.') }
    finally  { setLoading(false) }
  }

  return (
    <>
      <Head>
        <title>Submit Your Event | MNMuslim</title>
        <meta name="description" content="Share your Muslim community event with Minnesota. Free to submit — lectures, iftars, youth programs, fundraisers, and more." />
        <link rel="icon" href="/favicon.png" />
        <meta property="og:title" content="Submit Your Event | MNMuslim" />
        <meta property="og:description" content="Share your Muslim community event with Minnesota. Free to submit — lectures, iftars, youth programs, fundraisers, and more." />
        <meta property="og:image" content="https://mnmuslim.com/og-image.png" />
        <meta property="og:url" content="https://mnmuslim.com/submit-event" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MNMuslim" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Submit Your Event | MNMuslim" />
        <meta name="twitter:description" content="Share your Muslim community event with Minnesota. Free to submit — lectures, iftars, youth programs, fundraisers, and more." />
        <meta name="twitter:image" content="https://mnmuslim.com/og-image.png" />
      </Head>

      <div className="home-page">

        {/* NAV */}
        <nav className={`hn-nav${scrolled ? ' scrolled' : ''}`}>
          <Link href="/" className="hn-logo">
            <img src="/logo.png" alt="MNMuslim" className="hn-logo-img" />
          </Link>
          <div className="hn-pill">
            <Link href="/services" className="hn-nl">Services</Link>
            <Link href="/events" className="hn-nl">Events</Link>
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

        {/* HERO */}
        <div className="hn-dark-header">
          <section className="hn-hero" style={{ paddingBottom: '96px' }}>
            <div className="hn-g hn-g1" /><div className="hn-g hn-g2" /><div className="hn-g hn-g3" />
            <p className="hn-hero-eyebrow">Community Events</p>
            <h1 className="hn-h1" style={{ fontSize: '42px', letterSpacing: '-0.5px', wordSpacing: '4px' }}>Submit Your Event</h1>
            <p className="hn-sub" style={{ maxWidth: '460px' }}>
              Share your event with Minnesota&apos;s Muslim community. Free to submit and every event is reviewed before it goes live.
            </p>
          </section>
        </div>

        {/* FORM / SUCCESS */}
        <div className="sf-page">
          {submitted ? (
            <div className="sf-success">
              <div className="sf-success-icon">✓</div>
              <h2 className="sf-success-title">Event Received</h2>
              <p className="sf-success-sub">
                Thank you for sharing your event.<br /><br />
                We&apos;ll review it and publish approved events within 1–2 business days. If we have any questions, we&apos;ll reach out using the email you provided.
              </p>
              <div className="sf-success-btns">
                <Link href="/events" className="sf-success-btn">Browse Events →</Link>
                <button className="sf-success-btn-sec" onClick={() => setSubmitted(false)}>Submit Another Event</button>
              </div>
            </div>
          ) : (
            <div className="sf-card">
              {error && <div className="sf-error">{error}</div>}

              <form onSubmit={handleSubmit} noValidate>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="title">Event Title <span className="sf-req">*</span></label>
                  <input className="sf-input" id="title" name="title" type="text"
                    placeholder="e.g. Community Iftar Night"
                    value={form.title} onChange={handleChange} />
                </div>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="category">Category <span className="sf-req">*</span></label>
                  <select className="sf-input sf-select" id="category" name="category" value={form.category} onChange={handleChange}>
                    <option value="">Choose a category</option>
                    {EVENT_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>

                <div className="sf-row">
                  <div className="sf-group">
                    <label className="sf-label" htmlFor="date">Date <span className="sf-req">*</span></label>
                    <input className="sf-input" id="date" name="date" type="date"
                      value={form.date} onChange={handleChange} />
                  </div>
                  <div className="sf-group">
                    <label className="sf-label" htmlFor="end_date">End Date <span className="sf-opt">(multi-day events)</span></label>
                    <input className="sf-input" id="end_date" name="end_date" type="date"
                      value={form.end_date} onChange={handleChange} />
                  </div>
                </div>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="time_label">Time <span className="sf-opt">(optional)</span></label>
                  <input className="sf-input" id="time_label" name="time_label" type="text"
                    placeholder="e.g. 7:00 PM – 10:00 PM"
                    value={form.time_label} onChange={handleChange} />
                </div>

                <div className="sf-row">
                  <div className="sf-group">
                    <label className="sf-label" htmlFor="venue">Venue <span className="sf-req">*</span></label>
                    <input className="sf-input" id="venue" name="venue" type="text"
                      placeholder="e.g. Al-Ihsan Islamic Center, 955 Minnehaha Ave W"
                      value={form.venue} onChange={handleChange} />
                  </div>
                  <div className="sf-group">
                    <label className="sf-label" htmlFor="city">City <span className="sf-req">*</span></label>
                    <input className="sf-input" id="city" name="city" type="text"
                      placeholder="e.g. Saint Paul"
                      value={form.city} onChange={handleChange} />
                  </div>
                </div>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="description">Description <span className="sf-opt">(optional)</span></label>
                  <textarea className="sf-input sf-textarea" id="description" name="description"
                    placeholder="Tell people what to expect — speakers, program, who it's for."
                    value={form.description} onChange={handleChange} />
                </div>

                <div className="sf-divider" />
                <p className="sf-section-label">Links &amp; Flier — <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 500, fontSize: '12px' }}>All optional. No link yet? That&apos;s fine — venue and date are enough.</span></p>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="link">Event Link <span className="sf-opt">(Instagram post, Eventbrite, or website)</span></label>
                  <input className="sf-input" id="link" name="link" type="url"
                    placeholder="https://instagram.com/p/… or https://eventbrite.com/…"
                    value={form.link} onChange={handleChange} />
                </div>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="flier_url">Flier Image Link <span className="sf-opt">(optional)</span></label>
                  <input className="sf-input" id="flier_url" name="flier_url" type="url"
                    placeholder="Link to your flier image, if it's online"
                    value={form.flier_url} onChange={handleChange} />
                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0' }}>
                    Flier only on your computer? Submit without it, then email it to hello@mnmuslim.com — we&apos;ll attach it for you.
                  </p>
                </div>

                <div className="sf-divider" />

                <div className="sf-group">
                  <label className="sf-label" htmlFor="contact_email">Your Email <span className="sf-req">*</span> <span className="sf-opt">(private — never shown on the site)</span></label>
                  <input className="sf-input" id="contact_email" name="contact_email" type="email"
                    placeholder="you@example.com"
                    value={form.contact_email} onChange={handleChange} />
                </div>

                <button type="submit" className="sf-submit" disabled={loading}>
                  {loading ? 'Submitting…' : 'Submit Event'}
                </button>
                <p className="sf-note">Free to submit • Reviewed before publication • Past events are removed automatically</p>

              </form>
            </div>
          )}
        </div>

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
