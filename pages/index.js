import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ListingCard from '../components/ListingCard'
import { CATEGORIES } from '../lib/categories'

const CAT_COLORS = {
  edu: '#EFF6FF', tech: '#F0FDFA', marketing: '#FFF7ED', biz: '#F5F3FF',
  photo: '#FDF4FF', legal: '#FFF1F2', fin: '#FFFBEB', health: '#F0FDF4',
  child: '#FFF7ED', home: '#F8FAFC', events: '#FFF1F2', fitness: '#F0FDF4',
  creative: '#FDF4FF', security: '#EFF6FF', retail: '#FFF7ED', food: '#FFFBEB', other: '#F8FAFC'
}

export default function Home({ listings }) {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('')
  const [activeTag, setActiveTag] = useState('')

  const quickTags = [
    { label: '📚 Education', cat: 'edu' },
    { label: '🌿 Health', cat: 'health' },
    { label: '🖥️ Technology', cat: 'tech' },
    { label: '🍰 Food', cat: 'food' },
    { label: '⚖️ Legal', cat: 'legal' },
    { label: '📸 Photography', cat: 'photo' },
    { label: '💼 Business', cat: 'biz' },
  ]

  function handleTagClick(cat) {
    if (activeTag === cat) {
      setActiveTag('')
      setSelectedCat('')
    } else {
      setActiveTag(cat)
      setSelectedCat(cat)
    }
  }

  function handleCatClick(catId) {
    if (selectedCat === catId) {
      setSelectedCat('')
      setActiveTag('')
    } else {
      setSelectedCat(catId)
      setActiveTag(catId)
    }
  }

  const filtered = listings.filter(l => {
    const q = search.toLowerCase()
    const matchSearch = !search || 
      l.service_name?.toLowerCase().includes(q) ||
      l.business_name?.toLowerCase().includes(q) ||
      l.provider_name?.toLowerCase().includes(q) ||
      l.description?.toLowerCase().includes(q)
    const matchCat = !selectedCat || l.category === selectedCat
    return matchSearch && matchCat
  })

  return (
    <div className="page-wrapper">
      <Head>
        <title>MNMuslim — Minnesota Muslim Services Directory</title>
        <meta name="description" content="Find trusted Muslim service providers across Minnesota." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Navbar />

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero-bg-dot" style={{ width: 80, height: 80, background: '#FDE68A', top: 24, left: 48, opacity: 0.4, animationDelay: '0s' }} />
          <div className="hero-bg-dot" style={{ width: 50, height: 50, background: '#A5F3FC', top: 48, right: 100, opacity: 0.35, animationDelay: '1.2s' }} />
          <div className="hero-bg-dot" style={{ width: 30, height: 30, background: '#FCA5A5', bottom: 48, left: 150, opacity: 0.3, animationDelay: '2.4s' }} />
          <div className="hero-bg-dot" style={{ width: 40, height: 40, background: '#C4B5FD', bottom: 36, right: 180, opacity: 0.3, animationDelay: '0.6s' }} />

          <div className="hero-badge">★ Minnesota Muslim Community</div>

          <h1>
            Find <span className="teal">Trusted</span><br />
            <span className="gold">Muslim Services</span><br />
            in Minnesota
          </h1>

          <p className="hero-sub">
            Discover verified Muslim service providers across Minnesota — from tutors and photographers to accountants, web designers, and more.
          </p>

          <div className="hero-search-wrap">
            <div className="hero-search-box">
              <span className="hero-search-icon">🔍</span>
              <input
                className="hero-search-input"
                placeholder="Search services, providers, or keywords…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="hero-search-divider" />
              <select
                className="hero-search-select"
                value={selectedCat}
                onChange={e => { setSelectedCat(e.target.value); setActiveTag(e.target.value) }}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
              <button className="hero-search-btn" onClick={() => {}}>Search</button>
            </div>
          </div>

          <div className="hero-tags">
            {quickTags.map(t => (
              <button
                key={t.cat}
                className={`hero-tag${activeTag === t.cat ? ' active' : ''}`}
                onClick={() => handleTagClick(t.cat)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="categories-section">
          <div className="categories-inner">
            <div className="section-header">
              <div>
                <div className="section-title">Browse by Category</div>
                <div className="section-sub">Find exactly the type of service you need</div>
              </div>
              <Link href="/browse" className="section-link">View all →</Link>
            </div>
            <div className="categories-grid">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`category-card${selectedCat === cat.id ? ' active' : ''}`}
                  onClick={() => handleCatClick(cat.id)}
                >
                  <div className="category-circle" style={{ background: CAT_COLORS[cat.id] || '#F8FAFC' }}>
                    {cat.icon}
                  </div>
                  <div className="category-label">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ALL LISTINGS */}
        <section className="listings-section">
          <div className="listings-inner">
            <div className="section-header">
              <div>
                <div className="section-title">
                  {selectedCat
                    ? CATEGORIES.find(c => c.id === selectedCat)?.name + ' Providers'
                    : 'Service Providers'}
                </div>
                <div className="section-sub">
                  {filtered.length} {filtered.length === 1 ? 'listing' : 'listings'} in the community
                </div>
              </div>
              {(search || selectedCat) && (
                <button
                  className="section-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  onClick={() => { setSearch(''); setSelectedCat(''); setActiveTag('') }}
                >
                  Clear filters ✕
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: 40 }}>🔍</div>
                <p>No listings found. Try a different search or category.</p>
              </div>
            ) : (
              <div className="listings-grid">
                {filtered.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-band">
          <h2>Offer a service to the community?</h2>
          <p>List your business or service for free and connect with Minnesota Muslims looking for trusted providers.</p>
          <Link href="/submit" className="cta-band-btn">
            Submit Your Service <span>→</span>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mnmuslim.vercel.app'
    const res = await fetch(`${baseUrl}/api/listings`)
    const listings = await res.json()
    return { props: { listings: Array.isArray(listings) ? listings : [] } }
  } catch {
    return { props: { listings: [] } }
  }
              }
