import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { CATEGORIES } from '../lib/categories'

export default function Submit() {
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [submitted, setSubmitted]     = useState(false)

  const [form, setForm] = useState({
    service_name: '', provider_name: '', category: '',
    description: '', service_area: '',
    email: '', phone: '', website: '', instagram: '', extra_link: '',
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

    // Required fields
    for (const f of ['service_name', 'provider_name', 'category', 'description']) {
      if (!form[f].trim()) { setError('Please fill in all required fields.'); return }
    }

    // At least one contact method
    if (!form.email.trim() && !form.phone.trim() && !form.website.trim() && !form.instagram.trim()) {
      setError('Please provide at least one contact method (email, phone, website, or Instagram).')
      return
    }

    setLoading(true)
    try {
      const res  = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          service_area: form.service_area.trim() || 'Minnesota',
        }),
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
        <title>List Your Service — MNMuslim</title>
        <meta name="description" content="List your Muslim-owned service on MNMuslim and reach Minnesota Muslims looking for trusted local services. Free to list." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="home-page">

        {/* NAV */}
        <nav className={`hn-nav${scrolled ? ' scrolled' : ''}`}>
          <Link href="/" className="hn-logo">
            <img src="/logo.png" alt="MNMuslim" className="hn-logo-img" />
          </Link>
          <div className="hn-pill">
            <Link href="/services" className="hn-nl">Services</Link>
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
            <p className="hn-hero-eyebrow">Muslim Services Directory</p>
            <h1 className="hn-h1" style={{ fontSize: '44px' }}>Submit Your Service</h1>
            <p className="hn-sub" style={{ maxWidth: '460px' }}>
              Reach Minnesota Muslims looking for local services. Listing is free and every submission is reviewed before publication.
            </p>
          </section>
        </div>

        {/* FORM / SUCCESS */}
        <div className="sf-page">
          {submitted ? (
            <div className="sf-success">
              <div className="sf-success-icon">✓</div>
              <h2 className="sf-success-title">Submission Received</h2>
              <p className="sf-success-sub">
                Thank you for submitting your service.<br /><br />
                We&apos;ll review your listing and publish approved submissions within 2–3 business days. If we need any additional information, we&apos;ll contact you using the details you provided.
              </p>
              <div className="sf-success-btns">
                <Link href="/services" className="sf-success-btn">Browse Services →</Link>
                <button className="sf-success-btn-sec" onClick={() => setSubmitted(false)}>Submit Another Service</button>
              </div>
            </div>
          ) : (
            <div className="sf-card">
{error && <div className="sf-error">{error}</div>}

              <form onSubmit={handleSubmit} noValidate>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="service_name">Service Name <span className="sf-req">*</span></label>
                  <input className="sf-input" id="service_name" name="service_name" type="text"
                    placeholder="e.g. Keisar Counseling, CreatorMN Studios, Four Squared Creamery"
                    value={form.service_name} onChange={handleChange} />
                </div>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="provider_name">Contact Person <span className="sf-req">*</span></label>
                  <input className="sf-input" id="provider_name" name="provider_name" type="text"
                    placeholder="e.g. Jamila Keisar"
                    value={form.provider_name} onChange={handleChange} />
                </div>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="category">Category <span className="sf-req">*</span></label>
                  <select className="sf-input sf-select" id="category" name="category" value={form.category} onChange={handleChange}>
                    <option value="">Choose a category</option>
                    {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="description">Description <span className="sf-req">*</span></label>
                  <textarea className="sf-input sf-textarea" id="description" name="description"
                    placeholder="Describe your service, who you help, and what makes your service unique."
                    value={form.description} onChange={handleChange} />
                </div>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="service_area">Areas You Serve <span className="sf-opt">(optional)</span></label>
                  <input className="sf-input" id="service_area" name="service_area" type="text"
                    placeholder="Minneapolis, Twin Cities, Minnesota Statewide, Remote"
                    value={form.service_area} onChange={handleChange} />
                </div>

                <div className="sf-divider" />
                <p className="sf-section-label">Contact Information — <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 500, fontSize: '12px' }}>At least one contact method is required.</span></p>

                <div className="sf-row">
                  <div className="sf-group">
                    <label className="sf-label" htmlFor="email">Email</label>
                    <input className="sf-input" id="email" name="email" type="email"
                      placeholder="you@example.com"
                      value={form.email} onChange={handleChange} />
                  </div>
                  <div className="sf-group">
                    <label className="sf-label" htmlFor="phone">Phone</label>
                    <input className="sf-input" id="phone" name="phone" type="tel"
                      placeholder="(612) 555-0100"
                      value={form.phone} onChange={handleChange} />
                  </div>
                </div>

                <div className="sf-row">
                  <div className="sf-group">
                    <label className="sf-label" htmlFor="website">Website <span className="sf-opt">(optional)</span></label>
                    <input className="sf-input" id="website" name="website" type="url"
                      placeholder="https://yoursite.com"
                      value={form.website} onChange={handleChange} />
                  </div>
                  <div className="sf-group">
                    <label className="sf-label" htmlFor="instagram">Instagram <span className="sf-opt">(optional)</span></label>
                    <input className="sf-input" id="instagram" name="instagram" type="text"
                      placeholder="@yourhandle"
                      value={form.instagram} onChange={handleChange} />
                  </div>
                </div>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="extra_link">Additional Link <span className="sf-opt">(optional)</span></label>
                  <input className="sf-input" id="extra_link" name="extra_link" type="text"
                    placeholder="Facebook, TikTok, LinkedIn, X, YouTube, or another website"
                    value={form.extra_link} onChange={handleChange} />
                </div>

                <button type="submit" className="sf-submit" disabled={loading}>
                  {loading ? 'Submitting…' : 'Submit Service'}
                </button>
                <p className="sf-note">Free to list • Reviewed before publication</p>

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
