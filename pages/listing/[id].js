import Head from 'next/head'
import Link from 'next/link'
import { getCategoryById } from '../../lib/categories'
import { supabase } from '../../lib/supabase'
import SiteNav from '../../components/SiteNav'
import SiteFooter from '../../components/SiteFooter'

export async function getServerSideProps({ params }) {
  const { data, error } = await supabase
    .from('listings').select('*').eq('id', params.id).eq('approved', true).single()
  if (error || !data) return { notFound: true }
  return { props: { listing: data } }
}

function cleanUrl(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}
function cleanInstagram(h) {
  return h.startsWith('@') ? h : `@${h}`
}
function fullUrl(url) {
  return url.startsWith('http') ? url : `https://${url}`
}

const DELIVERY_LABELS = { remote: 'Remote', in_person: 'In person' }

const PhoneIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const EmailIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const WebIcon      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
const IgIcon       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>

export default function ListingDetail({ listing }) {
  const cat = getCategoryById(listing.category)
  const pageTitle = listing.business_name?.trim() || listing.service_name

  const contactItems = [
    listing.phone     && { type: 'phone',     Icon: PhoneIcon, label: listing.phone,                      href: `tel:${listing.phone.replace(/[^0-9+]/g,'')}`,                                        external: false },
    listing.email     && { type: 'email',     Icon: EmailIcon, label: listing.email,                      href: `mailto:${listing.email}`,                                                             external: false },
    listing.website   && { type: 'website',   Icon: WebIcon,   label: cleanUrl(listing.website),          href: listing.website.startsWith('http') ? listing.website : `https://${listing.website}`,  external: true  },
    listing.instagram && { type: 'instagram', Icon: IgIcon,    label: cleanInstagram(listing.instagram),  href: `https://instagram.com/${listing.instagram.replace('@','')}`,                          external: true  },
  ].filter(Boolean)

  const primaryContact = listing.email
    ? `mailto:${listing.email}`
    : listing.phone   ? `tel:${listing.phone.replace(/[^0-9+]/g,'')}`
    : listing.website ? (listing.website.startsWith('http') ? listing.website : `https://${listing.website}`)
    : null

  // Structured fields (experiment) — null on most listings, so each piece
  // only renders when present.
  const services      = listing.services?.length ? listing.services : null
  const deliveryModes = listing.delivery_modes?.length ? listing.delivery_modes : null
  const hasDetails    = Boolean(services || listing.price_info || deliveryModes || listing.audience)
  // A single named service doubles as the header subtitle, so the offer is
  // visible before scrolling to Service Details — unless it's already the title.
  const primaryService = services?.length === 1 && services[0] !== listing.service_name ? services[0] : null
  const actionLabel    = listing.action_label?.trim() || 'Request This Service'
  // Blank lines in the description separate paragraphs.
  const descParagraphs = listing.description.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)

  const listingUrl = `https://mnmuslim.com/listing/${listing.id}`
  const metaDescription = listing.description?.replace(/\s+/g, ' ').slice(0,160) || `${pageTitle} — listed on MNMuslim`
  const sameAs = [
    listing.website && fullUrl(listing.website),
    listing.instagram && `https://instagram.com/${listing.instagram.replace('@','')}`,
  ].filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: listing.service_name,
    description: listing.description,
    url: listingUrl,
    category: cat.name,
    areaServed: listing.service_area,
    provider: {
      '@type': 'Person',
      name: listing.provider_name,
      ...(listing.email ? { email: listing.email } : {}),
      ...(listing.website ? { url: fullUrl(listing.website) } : {}),
      ...(sameAs.length ? { sameAs } : {}),
    },
    ...(services ? {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${listing.service_name} services`,
        itemListElement: services.map(name => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
      },
    } : {}),
    ...(listing.price_info ? { offers: { '@type': 'Offer', description: listing.price_info } } : {}),
    ...(listing.audience ? { audience: { '@type': 'Audience', audienceType: listing.audience } } : {}),
    ...(listing.action_url ? { availableChannel: { '@type': 'ServiceChannel', name: actionLabel, serviceUrl: listing.action_url } } : {}),
    ...(listing.updated_at ? { dateModified: listing.updated_at } : {}),
  }

  return (
    <>
      <Head>
        <title>{pageTitle} | MNMuslim</title>
        <meta name="description" content={metaDescription} />
        <link rel="icon" href="/favicon.png" />
        {/* Open Graph */}
        <meta property="og:title" content={`${pageTitle} | MNMuslim`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content="https://mnmuslim.com/og-image.png" />
        <meta property="og:url" content={`https://mnmuslim.com/listing/${listing.id}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MNMuslim" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${pageTitle} | MNMuslim`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content="https://mnmuslim.com/og-image.png" />
        {/* Listing text is user-submitted — escape "<" so it can't close the script tag. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      </Head>

      <div className="home-page">

        <SiteNav solid />

        {/* PAGE CONTENT */}
        <div className="ld-page">

          <div className="ld-layout">

            {/* Main */}
            <div className="ld-main">

              {/* Header card */}
              <div className="ld-header-card">
                <span className="ld-cat-badge">{cat.name}</span>
                <h1 className="ld-title">{listing.service_name}</h1>
                {listing.business_name?.trim() && (
                  <p className="ld-business">{listing.business_name}</p>
                )}
                {primaryService && !listing.business_name?.trim() && (
                  <p className="ld-business">{primaryService}</p>
                )}
                <p className="ld-provider">by {listing.provider_name}</p>
                <div className="ld-meta-row">
                  <span className="ld-meta-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {listing.service_area}
                  </span>
                </div>
              </div>

              {/* About */}
              <div className="ld-section">
                <h2 className="ld-section-title">About this Service</h2>
                {descParagraphs.map((p, i) => <p key={i} className="ld-desc">{p}</p>)}
              </div>

              {/* Service details */}
              {hasDetails && (
                <div className="ld-section">
                  <h2 className="ld-section-title">Service Details</h2>
                  <dl className="ld-facts">
                    {services && (
                      <div className="ld-fact">
                        <dt>Services</dt>
                        <dd>
                          <ul className="ld-fact-list">
                            {services.map(s => <li key={s}>{s}</li>)}
                          </ul>
                        </dd>
                      </div>
                    )}
                    {listing.price_info && (
                      <div className="ld-fact"><dt>Pricing</dt><dd>{listing.price_info}</dd></div>
                    )}
                    {deliveryModes && (
                      <div className="ld-fact">
                        <dt>Delivery</dt>
                        <dd>{deliveryModes.map(m => DELIVERY_LABELS[m] || m).join(' · ')}</dd>
                      </div>
                    )}
                    {listing.audience && (
                      <div className="ld-fact"><dt>Who it&apos;s for</dt><dd>{listing.audience}</dd></div>
                    )}
                  </dl>
                </div>
              )}

            </div>

            {/* Sidebar */}
            <aside className="ld-sidebar">

              {/* Contact card */}
              <div className="ld-contact-card">
                <div className="ld-contact-title">Contact</div>
                {contactItems.length === 0 && (
                  <p className="ld-no-contact">No contact info provided.</p>
                )}
                <div className="ld-contact-list">
                  {contactItems.map(item => (
                    <a key={item.href} href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noreferrer' : undefined}
                      className="ld-contact-row"
                    >
                      <span className="ld-contact-icon"><item.Icon /></span>
                      <span className="ld-contact-label">{item.label}</span>
                    </a>
                  ))}
                </div>
                {listing.action_url ? (
                  <a href={listing.action_url} target="_blank" rel="noreferrer" className="ld-cta-btn">
                    {actionLabel}
                  </a>
                ) : primaryContact && (
                  <a href={primaryContact}
                    target={!primaryContact.startsWith('mailto') && !primaryContact.startsWith('tel') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="ld-cta-btn"
                  >
                    Contact Provider
                  </a>
                )}
              </div>

              {/* List Your Service */}
              <div className="ld-list-prompt">
                <p className="ld-list-prompt-text">Offer a similar service?</p>
                <Link href="/submit" className="ld-list-link">List Your Service →</Link>
              </div>

              {/* Back to Services */}
              <div className="ld-back-wrap">
                <Link href="/services" className="ld-back">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                  Back to Services
                </Link>
              </div>

            </aside>
          </div>
        </div>

        <SiteFooter />

      </div>
    </>
  )
}
