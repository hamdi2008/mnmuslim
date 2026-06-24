import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { CATEGORIES } from '../lib/categories'

export default function Submit() {
  const [form, setForm] = useState({
    service_name: '',
    provider_name: '',
    category: '',
    description: '',
    service_area: '',
    phone: '',
    email: '',
    website: '',
    instagram: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const required = ['service_name', 'provider_name', 'category', 'description', 'service_area', 'email']
    for (const field of required) {
      if (!form[field].trim()) {
        setError('Please fill in all required fields.')
        return
      }
    }

    setLoading(true)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Submit Your Service – MNMuslim.com</title>
        <meta
          name="description"
          content="List your service on MNMuslim.com and reach Minnesota Muslims looking for trusted community providers."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <div className="form-wrap">
        {submitted ? (
          <div className="success-box">
            <div style={{ fontSize: '40px' }}>🌿</div>
            <h2>Listing Submitted!</h2>
            <p>
              Thank you. Your listing is pending review and will appear publicly once approved,
              typically within 2–3 business days.
            </p>
            <Link href="/browse" className="btn-green" style={{ display: 'inline-block', marginTop: '4px' }}>
              Browse Listings
            </Link>
          </div>
        ) : (
          <>
            <h1>List Your Service</h1>
            <p className="form-sub">
              Submit your service to be discovered by Minnesota Muslims. All listings are reviewed
              before publishing. Free to list — always.
            </p>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="service_name">
                  Service Name <span className="req">*</span>
                </label>
                <input
                  id="service_name"
                  name="service_name"
                  type="text"
                  placeholder="e.g. Private Math Tutoring"
                  value={form.service_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="provider_name">
                  Your Name <span className="req">*</span>
                </label>
                <input
                  id="provider_name"
                  name="provider_name"
                  type="text"
                  placeholder="e.g. Fatima Hassan"
                  value={form.provider_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  Category <span className="req">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category…</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Description <span className="req">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe what you offer, your experience, and what makes your service unique…"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="service_area">
                  Service Area <span className="req">*</span>
                </label>
                <input
                  id="service_area"
                  name="service_area"
                  type="text"
                  placeholder="e.g. Twin Cities Metro, Statewide, Minneapolis"
                  value={form.service_area}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(612) 555-0100"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="req">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://yoursite.com"
                    value={form.website}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="instagram">Instagram</label>
                  <input
                    id="instagram"
                    name="instagram"
                    type="text"
                    placeholder="@yourhandle"
                    value={form.instagram}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Submitting…' : 'Submit Listing'}
              </button>
              <p className="form-note">
                ★ Free to list &nbsp;·&nbsp; Reviewed within 2–3 business days &nbsp;·&nbsp;
                Approved listings appear publicly
              </p>
            </form>
          </>
        )}
      </div>

      <Footer />
    </>
  )
}
