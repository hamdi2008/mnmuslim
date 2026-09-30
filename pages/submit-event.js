import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { EVENT_CATEGORIES, FLYER_MAX_BYTES, FLYER_TYPES } from '../lib/events'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

const REQUIRED = {
  title: 'Event Name', category: 'Category', date: 'Date', venue: 'Venue / Location',
  city: 'City', description: 'Event Details', contact_email: 'Your Email',
}

const EMPTY_FORM = {
  title: '', category: '', date: '', end_date: '', start_time: '', end_time: '',
  venue: '', address: '', city: '', description: '', cost: '', link: '', contact_email: '',
  promotion_interest: false,
}

// Phone photos are often 5–15 MB. Redraw every flyer on a canvas so it fits
// the upload limit, and so camera metadata (e.g. GPS location) is dropped
// before it ever leaves the device.
const FLYER_MAX_EDGE = 2400

function canvasToBlob(canvas, type, quality) {
  return new Promise(resolve => canvas.toBlob(resolve, type, quality))
}

async function prepareFlyer(file) {
  const looksLikeImage = FLYER_TYPES[file.type] || (!file.type && /\.(jpe?g|png|webp)$/i.test(file.name))
  if (!looksLikeImage) throw new Error('Please choose a JPG, PNG, or WEBP image.')
  if (file.size > 25 * 1024 * 1024) throw new Error('That image is too large. Please choose one under 25 MB.')

  const src = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = src
    try { await img.decode() } catch { throw new Error('We couldn’t read that image. Please try a JPG or PNG.') }

    const scale = Math.min(1, FLYER_MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.naturalWidth * scale)
    canvas.height = Math.round(img.naturalHeight * scale)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'   // transparent PNGs → white, not black, if saved as JPEG
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    let blob = file.type === 'image/png' ? await canvasToBlob(canvas, 'image/png') : null
    if (!blob || blob.size > FLYER_MAX_BYTES) blob = await canvasToBlob(canvas, 'image/jpeg', 0.9)
    if (blob && blob.size > FLYER_MAX_BYTES) blob = await canvasToBlob(canvas, 'image/jpeg', 0.75)
    if (!blob || blob.size > FLYER_MAX_BYTES) throw new Error('That image is too large. Please try a smaller one.')

    return new File([blob], `flyer.${FLYER_TYPES[blob.type]}`, { type: blob.type })
  } finally {
    URL.revokeObjectURL(src)
  }
}

export default function SubmitEvent() {
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [submitted, setSubmitted]   = useState(false)
  const [form, setForm]             = useState(EMPTY_FORM)

  const [flyer, setFlyer]               = useState(null)   // prepared File
  const [flyerPreview, setFlyerPreview] = useState('')
  const [flyerName, setFlyerName]       = useState('')
  const [flyerBusy, setFlyerBusy]       = useState(false)
  const [flyerError, setFlyerError]     = useState('')
  const fileInput = useRef(null)
  const errorRef  = useRef(null)

  useEffect(() => () => { if (flyerPreview) URL.revokeObjectURL(flyerPreview) }, [flyerPreview])

  // On phones the error banner is far above the submit button.
  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [error])

  function handleChange(e) {
    const { name, type, value, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleFlyer(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setFlyerError('')
    setFlyerBusy(true)
    try {
      const prepared = await prepareFlyer(file)
      setFlyer(prepared)
      setFlyerName(file.name)
      setFlyerPreview(URL.createObjectURL(prepared))
    } catch (err) {
      setFlyerError(err.message)
    } finally {
      setFlyerBusy(false)
    }
  }

  function removeFlyer() {
    setFlyer(null)
    setFlyerName('')
    setFlyerPreview('')
    setFlyerError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const missing = Object.keys(REQUIRED).filter(f => !form[f].trim())
    if (missing.length) { setError(`Please fill in: ${missing.map(f => REQUIRED[f]).join(', ')}.`); return }
    if (form.end_date && form.end_date < form.date) { setError('End date can’t be before the start date.'); return }
    if (form.end_time && !form.start_time) { setError('Please add a start time, or clear the end time.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email.trim())) { setError('Please enter a valid email address.'); return }

    const body = new FormData()
    for (const [k, v] of Object.entries(form)) {
      if (k === 'promotion_interest') { if (v) body.append(k, 'yes') }
      else body.append(k, v)
    }
    if (flyer) body.append('flyer', flyer)
    body.append('website', e.target.elements.website?.value || '')

    setLoading(true)
    try {
      const res  = await fetch('/api/submit-event', { method: 'POST', body })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) setError(data.error || 'Something went wrong. Please try again.')
      else { setSubmitted(true); window.scrollTo({ top: 0 }) }
    } catch { setError('Network error. Please check your connection and try again.') }
    finally  { setLoading(false) }
  }

  function submitAnother() {
    setForm(EMPTY_FORM)
    removeFlyer()
    setSubmitted(false)
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

        <SiteNav />

        {/* HERO */}
        <div className="hn-dark-header">
          <section className="hn-hero" style={{ paddingBottom: '96px' }}>
            <div className="hn-g hn-g1" /><div className="hn-g hn-g2" /><div className="hn-g hn-g3" />
            <p className="hn-hero-eyebrow">Community Events</p>
            <h1 className="hn-h1" style={{ fontSize: '42px', letterSpacing: '-0.5px', wordSpacing: '4px' }}>Submit Your Event</h1>
            <p className="hn-sub" style={{ maxWidth: '520px' }}>
              Share your event with Minnesota&apos;s Muslim community.<br />
              Submit it free to be listed on MNMuslim Events. Every event is reviewed before publication.
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
                <button className="sf-success-btn-sec" onClick={submitAnother}>Submit Another Event</button>
              </div>
            </div>
          ) : (
            <div className="sf-card">
              {error && <div className="sf-error" ref={errorRef} role="alert">{error}</div>}

              <form onSubmit={handleSubmit} noValidate>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="title">Event Name <span className="sf-req">*</span></label>
                  <input className="sf-input" id="title" name="title" type="text" maxLength={150}
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
                    <label className="sf-label" htmlFor="end_date">End Date <span className="sf-opt">(optional, for multi-day events)</span></label>
                    <input className="sf-input" id="end_date" name="end_date" type="date" min={form.date || undefined}
                      value={form.end_date} onChange={handleChange} />
                  </div>
                </div>

                <div className="sf-row">
                  <div className="sf-group">
                    <label className="sf-label" htmlFor="start_time">Start Time <span className="sf-opt">(optional)</span></label>
                    <input className="sf-input" id="start_time" name="start_time" type="time"
                      value={form.start_time} onChange={handleChange} />
                  </div>
                  <div className="sf-group">
                    <label className="sf-label" htmlFor="end_time">End Time <span className="sf-opt">(optional)</span></label>
                    <input className="sf-input" id="end_time" name="end_time" type="time"
                      value={form.end_time} onChange={handleChange} />
                  </div>
                </div>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="venue">Venue / Location <span className="sf-req">*</span></label>
                  <input className="sf-input" id="venue" name="venue" type="text" maxLength={200}
                    placeholder="e.g. Al-Ihsan Islamic Center"
                    value={form.venue} onChange={handleChange} />
                </div>

                <div className="sf-row">
                  <div className="sf-group">
                    <label className="sf-label" htmlFor="address">Address <span className="sf-opt">(optional)</span></label>
                    <input className="sf-input" id="address" name="address" type="text" maxLength={200}
                      autoComplete="street-address"
                      placeholder="e.g. 955 Minnehaha Ave W"
                      value={form.address} onChange={handleChange} />
                  </div>
                  <div className="sf-group">
                    <label className="sf-label" htmlFor="city">City <span className="sf-req">*</span></label>
                    <input className="sf-input" id="city" name="city" type="text" maxLength={80}
                      placeholder="e.g. Saint Paul"
                      value={form.city} onChange={handleChange} />
                  </div>
                </div>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="description">Event Details <span className="sf-req">*</span></label>
                  <p className="sf-help" id="description-help">A short description is enough. What is the event, who is it for, and what should people know?</p>
                  <textarea className="sf-input sf-textarea" id="description" name="description" maxLength={2000}
                    aria-describedby="description-help"
                    placeholder="e.g. Community iftar for families featuring dinner, a short reminder, and activities for children."
                    value={form.description} onChange={handleChange} />
                </div>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="cost">Cost / Admission <span className="sf-opt">(optional)</span></label>
                  <input className="sf-input" id="cost" name="cost" type="text" maxLength={100}
                    placeholder="e.g. Free, $10, $25 per family"
                    value={form.cost} onChange={handleChange} />
                </div>

                <div className="sf-group">
                  <label className="sf-label" htmlFor="link">Event Link <span className="sf-opt">(optional)</span></label>
                  <p className="sf-help" id="link-help">Instagram post, registration page, or website</p>
                  <input className="sf-input" id="link" name="link" type="url" inputMode="url" maxLength={500}
                    aria-describedby="link-help"
                    placeholder="https://"
                    value={form.link} onChange={handleChange} />
                </div>

                <div className="sf-group">
                  <span className="sf-label" id="flyer-label">Upload Flyer <span className="sf-opt">(optional)</span></span>
                  <input ref={fileInput} id="flyer" type="file" className="sf-flyer-input" aria-labelledby="flyer-label"
                    accept="image/jpeg,image/png,image/webp" onChange={handleFlyer} disabled={flyerBusy} />
                  {flyer ? (
                    <div className="sf-flyer-selected">
                      <img src={flyerPreview} alt="Your flyer" className="sf-flyer-thumb" />
                      <div className="sf-flyer-info">
                        <span className="sf-flyer-name">{flyerName}</span>
                        <span className="sf-flyer-actions">
                          <button type="button" className="sf-flyer-link" onClick={() => fileInput.current?.click()}>Change</button>
                          <button type="button" className="sf-flyer-link" onClick={removeFlyer}>Remove</button>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <label className="sf-flyer-drop" htmlFor="flyer">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <span className="sf-flyer-drop-title">{flyerBusy ? 'Preparing image…' : 'Tap to choose your flyer'}</span>
                      <span className="sf-flyer-drop-sub">JPG, PNG, or WEBP</span>
                    </label>
                  )}
                  {flyerError && <p className="sf-help sf-help-error">{flyerError}</p>}
                </div>

                <div className="sf-divider" />

                <div className="sf-group">
                  <label className="sf-label" htmlFor="contact_email">Your Email <span className="sf-req">*</span></label>
                  <p className="sf-help" id="email-help">Private — never displayed publicly. We&apos;ll only use it if we have a question about your event.</p>
                  <input className="sf-input" id="contact_email" name="contact_email" type="email" inputMode="email" autoComplete="email" maxLength={254}
                    aria-describedby="email-help"
                    placeholder="you@example.com"
                    value={form.contact_email} onChange={handleChange} />
                </div>

                <div className="sf-promo">
                  <p className="sf-promo-title">Interested in additional visibility? <span className="sf-opt">(optional)</span></p>
                  <label className="sf-promo-check">
                    <input type="checkbox" name="promotion_interest"
                      checked={form.promotion_interest} onChange={handleChange} />
                    <span>Yes, send me more information</span>
                  </label>
                  <p className="sf-promo-sub">Get additional visibility on the MNMuslim website &amp; Instagram account.</p>
                </div>

                {/* Honeypot — hidden from people and screen readers; bots fill it in. */}
                <div className="sf-hp" aria-hidden="true">
                  <label htmlFor="website">Leave this field empty</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
                </div>

                <button type="submit" className="sf-submit" disabled={loading || flyerBusy}>
                  {loading ? 'Submitting…' : 'Submit Event'}
                </button>
                <p className="sf-note">Free to submit • Reviewed before publication</p>

              </form>
            </div>
          )}
        </div>

        <SiteFooter />

      </div>
    </>
  )
}
