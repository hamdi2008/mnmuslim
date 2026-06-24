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
  const paths = (data || []).map((l) => ({ params: { id: String(l.id) } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .eq('approved', true)
    .single()
  if (error || !data) return { notFound: true }
  return { props: { listing: data }, revalidate: 60 }
}

function cleanUrl(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

function cleanInstagram(handle) {
  return handle.startsWith('@') ? handle : `@${handle}`
}

export default function ListingDetail({ listing }) {
  const router = useRouter()
  const cat = getCategoryById(listing.category)
  const hasBusiness = listing.business_name && listing.business_name.trim()
  const pageTitle = hasBusiness ? listing.business_name : listing.service_name

  const contactItems = [
    listing.phone && {
      icon: '📞',
      label: listing.phone,
      href: `tel:${listing.phone.replace(/[^0-9+]/g, '')}`,
      external: false,
    },
    listing.email && {
      icon: '✉️',
      label: listing.email,
      href: `mailto:${listing.email}`,
      external: false,
    },
    listing.website && {
      icon: '🌐',
      label: cleanUrl(listing.website),
      href: listing.website.startsWith('http') ? listing.website : `https://${listing.website}`,
      external: true,
    },
    listing.instagram && {
      icon: '📷',
      label: cleanInstagram(listing.instagram),
      href: `https://instagram.com/${listing.instagram.replace('@', '')}`,
      external: true,
    },
  ].filter(Boolean)

  const primaryContact = listing.email
    ? `mailto:${listing.email}`
    : listing.phone
    ? `tel:${listing.phone.replace(/[^0-9+]/g, '')}`
    : listing.website
    ? (listing.website.startsWith('http') ? listing.website : `https://${listing.website}`)
    : null

  return (
    <>
      <Head>
        <title>{pageTitle} – MNMuslim.com</title>
        <meta name="description" content={`${pageTitle} by ${listing.provider_name}. ${listing.description.slice(0, 150)}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <div className="section" style={{ paddingTop: '28px' }}>
        <button className="detail-back" onClick={() => router.back()}>
          ← Back to results
        </button>

        <div className="detail-header">
          <div className="detail-badge">{cat.icon} {cat.name}</div>
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

          <div className="detail-card">
            <h3>Contact Information</h3>
            {contactItems.length === 0 ? (
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>No contact info provided.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '4px' }}>
                {contactItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      color: 'var(--text)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      lineHeight: '1.5',
                    }}
                  >
                    <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{item.icon}</span>
                    <span style={{
                      color: 'var(--green)',
                      wordBreak: 'break-word',
                      fontWeight: 500,
                    }}>{item.label}</span>
                  </a>
                ))}
              </div>
            )}
            {primaryContact && (
              <a
                href={primaryContact}
                target={!primaryContact.startsWith('mailto') && !primaryContact.startsWith('tel') ? '_blank' : undefined}
                rel="noreferrer"
                className="big-contact-btn"
                style={{ marginTop: '24px' }}
              >
                Contact Provider
              </a>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px' }} />
      <Footer />
    </>
  )
}
