import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getCategoryById } from '../../lib/categories'
import { supabase } from '../../lib/supabase'

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

const PhoneIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const EmailIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const WebIcon      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
const IgIcon       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>

export default function ListingDetail({ listing }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const cat = getCategoryById(listing.category)
  const pageTitle = listing.business_name?.trim() || listing.service_name

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  return (
    <>
      <Head>
        <title>{pageTitle} — MNMuslim</title>
        <meta name="description" content={`${pageTitle} · ${listing.description?.slice(0,150)}`} />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="home-page">

        {/* NAV */}
        <nav className={`hn-nav${scrolled ? ' scrolled' : ''}`} style={{ background: '#071423', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/" className="hn-logo">
            <img src="/logo.png" alt="MNMuslim" className="hn-logo-img" />
          </Link>
          <div className="hn-pill">
            <Link href="/services" className="hn-nl hn-nl-active">Services</Link>
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
                <p className="ld-desc">{listing.description}</p>
              </div>

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
                {primaryContact && (
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
