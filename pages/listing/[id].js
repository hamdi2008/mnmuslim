import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getCategoryById } from '../../lib/categories'
import { supabase } from '../../lib/supabase'

export async function getStaticPaths() {
  const { data } = await supabase
    .from('listings')
    .select('id')
    .eq('approved', true)

  const paths = (data || []).map((l) => ({
    params: { id: String(l.id) },
  }))

  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .eq('approved', true)
    .single()

  if (error || !data) {
    return { notFound: true }
  }

  return {
    props: { listing: data },
    revalidate: 60,
  }
}

export default function ListingDetail({ listing }) {
  const router = useRouter()
  const cat = getCategoryById(listing.category)
  const hasBusiness = listing.business_name && listing.business_name.trim()
  const pageTitle = hasBusiness ? listing.business_name : listing.service_name

  const contacts = [
    listing.phone && { label: 'Phone', value: listing.phone, href: `tel:${listing.phone}` },
    listing.email && { label: 'Email', value: listing.email, href: `mailto:${listing.email}` },
    listing.website && {
      label: 'Website',
      value: listing.website.replace(/^https?:\/\//, ''),
      href: listing.website,
    },
    listing.instagram && {
      label: 'Instagram',
      value: listing.instagram,
      href: `https://instagram.com/${listing.instagram.replace('@', '')}`,
    },
  ].filter(Boolean)

  return (
    <>
      <Head>
        <title>{pageTitle} – MNMuslim.com</title>
        <meta
          name="description"
          content={`${pageTitle} by ${listing.provider_name}. ${listing.description.slice(0, 150)}`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <div className="section" style={{ paddingTop: '28px' }}>
        <button className="detail-back" onClick={() => router.back()}>
          ← Back to results
        </button>

        <div className="detail-header">
          <div className="detail-badge">
            {cat.icon} {cat.name}
          </div>
          {hasBusiness ? (
            <>
              <h1 className="detail-title">{listing.business_name}</h1>
              <p className="detail-service-sub">{listing.service_name}</p>
              <p className="detail-provider">By {listing.provider_name}</p>
            </>
          ) : (
            <>
              <h1 className="detail-title">{listing.service_name}</h1>
              <p className="detail-provider">By {listing.provider_name}</p>
            </>
          )}
          <p className="detail-area">📍 {listing.service_area}</p>
        </div>

        <div className="detail-body">
          <div className="detail-card">
            <h3>About this Service</h3>
            <p className="detail-desc">{listing.description}</p>
          </div>

          <div>
            <div className="detail-card">
              <h3>Contact Information</h3>
              {contacts.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  No contact info provided.
                </p>
              ) : (
                contacts.map((c) => (
                  <div key={c.label} className="contact-row">
                    <span className="contact-label">{c.label}</span>
                    <span className="contact-val">
                      <a
                        href={c.href}
                        target={c.label === 'Website' || c.label === 'Instagram' ? '_blank' : undefined}
                        rel="noreferrer"
                      >
                        {c.value}
                      </a>
                    </span>
                  </div>
                ))
              )}
              {listing.email && (
                <a href={`mailto:${listing.email}`} className="big-contact-btn">
                  Send a Message
                </a>
              )}
            </div>

            <div className="disclaimer-card">
              This provider is a community member. Please verify credentials independently before hiring.
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px' }} />
      <Footer />
    </>
  )
}
