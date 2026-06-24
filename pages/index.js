import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ListingCard from '../components/ListingCard'
import { CATEGORIES } from '../lib/categories'
import { supabase } from '../lib/supabase'

export async function getStaticProps() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(6)

  const { count } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('approved', true)

  return {
    props: {
      recentListings: listings || [],
      totalCount: count || 0,
    },
    revalidate: 60, // ISR: revalidate every 60s
  }
}

export default function Home({ recentListings, totalCount }) {
  const router = useRouter()
  const [search, setSearch] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/browse?search=${encodeURIComponent(search.trim())}`)
    } else {
      router.push('/browse')
    }
  }

  return (
    <>
      <Head>
        <title>MNMuslim.com – Find Muslim Services in Minnesota</title>
        <meta
          name="description"
          content="Discover trusted Muslim service providers across Minnesota — tutors, photographers, accountants, web designers, lawyers, and more."
        />
        <meta property="og:title" content="MNMuslim.com – Find Muslim Services in Minnesota" />
        <meta
          property="og:description"
          content="A community directory connecting Minnesota Muslims with trusted service providers."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-eyebrow">Minnesota Muslim Community</div>
        <h1>
          Find <em>Muslim Services</em>
          <br />
          in Minnesota
        </h1>
        <p className="hero-sub">
          Discover trusted service providers across Minnesota — from tutors and photographers to
          accountants, web designers, and more.
        </p>
        <form className="hero-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by service, name, or keyword…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search services"
          />
          <button type="submit">Search</button>
        </form>
        <div className="hero-actions">
          <Link href="/browse" className="btn-primary">
            Browse Services
          </Link>
          <Link href="/submit" className="btn-outline">
            Submit Your Service
          </Link>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-num">{totalCount}</span> Services Listed
        </div>
        <div className="stat-item">
          <span className="stat-num">17</span> Categories
        </div>
        <div className="stat-item">
          <span className="stat-num">MN</span> Statewide
        </div>
      </div>
      <hr className="gold-divider" />

      {/* CATEGORIES */}
      <div className="section">
        <div className="section-header">
          <h2>Browse by Category</h2>
          <p>Find exactly the type of service you need</p>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/browse?category=${cat.id}`}
              className="cat-card"
            >
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-name">{cat.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* RECENT LISTINGS */}
      {recentListings.length > 0 && (
        <div style={{ background: 'var(--bg-alt)', padding: '48px 0' }}>
          <div className="section" style={{ padding: '0 24px' }}>
            <div className="section-header">
              <h2>Recent Listings</h2>
              <p>Newly added service providers in the community</p>
            </div>
            <div className="listings-grid">
              {recentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Link href="/browse" className="btn-green">
                View All Services
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CTA BAND */}
      <div className="cta-band">
        <h2>Offer a service to the community?</h2>
        <p>
          Submit your listing for free. Reach Minnesota Muslims looking for trusted providers.
        </p>
        <Link href="/submit" className="btn-primary">
          Submit Your Service →
        </Link>
      </div>

      <Footer />
    </>
  )
}
