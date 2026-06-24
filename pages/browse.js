import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ListingCard from '../components/ListingCard'
import { CATEGORIES } from '../lib/categories'

export default function Browse() {
  const router = useRouter()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  // Sync URL params on mount
  useEffect(() => {
    if (!router.isReady) return
    if (router.query.search) setSearch(router.query.search)
    if (router.query.category) setCategory(router.query.category)
  }, [router.isReady, router.query])

  const fetchListings = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)

    try {
      const res = await fetch(`/api/listings?${params.toString()}`)
      const data = await res.json()
      setListings(Array.isArray(data) ? data : [])
    } catch {
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [search, category])

  useEffect(() => {
    const timer = setTimeout(fetchListings, 300)
    return () => clearTimeout(timer)
  }, [fetchListings])

  function setActiveCat(id) {
    setCategory((prev) => (prev === id ? '' : id))
  }

  return (
    <>
      <Head>
        <title>Browse Services – MNMuslim.com</title>
        <meta
          name="description"
          content="Browse Muslim service providers across Minnesota. Filter by category or search by name."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <div className="page-header">
        <h1>Browse Services</h1>
        <p>Find Muslim service providers across Minnesota</p>
      </div>
      <hr className="gold-divider" />

      <div className="section" style={{ paddingTop: '28px' }}>
        {/* Category pills */}
        <div className="cat-pills">
          <button
            className={`cat-pill${category === '' ? ' active' : ''}`}
            onClick={() => setCategory('')}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`cat-pill${category === cat.id ? ' active' : ''}`}
              onClick={() => setActiveCat(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search services, names, keywords…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="results-count">
            {listings.length === 0
              ? 'No services found'
              : `${listings.length} service${listings.length === 1 ? '' : 's'} found`}
          </p>
        )}

        {/* Grid */}
        <div className="listings-grid">
          {loading && <div className="loading">Loading services…</div>}
          {!loading && listings.length === 0 && (
            <div className="empty-state">
              <h3>No services found</h3>
              <p>Try a different search term or browse all categories.</p>
            </div>
          )}
          {!loading &&
            listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
        </div>
      </div>

      <Footer />
    </>
  )
}
