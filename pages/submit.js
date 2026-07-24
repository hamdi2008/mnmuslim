import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { CATEGORIES } from '../lib/categories'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

export default function Submit() {
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [submitted, setSubmitted]     = useState(false)

  const [form, setForm] = useState({
    service_name: '', provider_name: '', category: '',
    description: '', service_area: '',
    email: '', phone: '', website: '', instagram: '', extra_link: '',
  })

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
        <title>List Your Service | MNMuslim</title>
        <meta name="description" content="List your Muslim-owned service on MNMuslim and reach Minnesota Muslims looking for trusted local services. Free to list." />
        <link rel="icon" href="/favicon.png" />
        {/* Open Graph */}
        <meta property="og:title" content="List Your Service | MNMuslim" />
        <meta property="og:description" content="List your Muslim-owned service on MNMuslim and reach Minnesota Muslims looking for trusted local services. Free to list." />
        <meta property="og:image" content="https://mnmuslim.com/og-image.png" />
        <meta property="og:url" content="https://mnmuslim.com/submit" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MNMuslim" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="List Your Service | MNMuslim" />
        <meta name="twitter:description" content="List your Muslim-owned service on MNMuslim and reach Minnesota Muslims looking for trusted local services. Free to list." />
        <meta name="twitter:image" content="https://mnmuslim.com/og-image.png" />
      </Head>

      <div className="home-page">

        <SiteNav />

        {/* HERO */}
        <div className="hn-dark-header">
          <section className="hn-hero" style={{ paddingBottom: '96px' }}>
            <div className="hn-g hn-g1" /><div className="hn-g hn-g2" /><div className="hn-g hn-g3" />
            <p className="hn-hero-eyebrow">Muslim Services Directory</p>
            <h1 className="hn-h1" style={{ fontSize: '42px', letterSpacing: '-0.5px', wordSpacing: '4px' }}>Submit Your Service</h1>
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
                  <label className="sf-label" htmlFor="service_name">Business or Service Name <span className="sf-req">*</span></label>
                  <input className="sf-input" id="service_name" name="service_name" type="text"
                    placeholder="e.g. Your business or service name"
                    value={form.service_name} onChange={handleChange} />
                </div>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="provider_name">Contact Person <span className="sf-req">*</span></label>
                  <input className="sf-input" id="provider_name" name="provider_name" type="text"
                    placeholder="e.g. Your full name"
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

        <SiteFooter />

      </div>
    </>
  )
}
