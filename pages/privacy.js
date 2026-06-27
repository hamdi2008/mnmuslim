import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Privacy() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Head>
        <title>Privacy Policy — MNMuslim</title>
        <meta name="description" content="Privacy Policy for MNMuslim.com" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="home-page">
                <nav className={`hn-nav${scrolled ? ' scrolled' : ''}`}>
          <Link href="/" className="hn-logo">
            <img src="/logo.png" alt="MNMuslim" className="hn-logo-img" />
          </Link>
          <div className="hn-pill">
            <Link href="/services" className="hn-nl">Services</Link>
            <a href="https://mnhalal.com" className="hn-nl" target="_blank" rel="noopener noreferrer">MNHalal</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/contact" className="hn-contact">Contact <span>→</span></Link>
          </div>
        </nav>

        {/* HERO */}
        <div className="hn-dark-header">
          <section className="hn-hero" style={{ paddingBottom: '72px' }}>
            <div className="hn-g hn-g1" /><div className="hn-g hn-g2" /><div className="hn-g hn-g3" />
            <p className="hn-hero-eyebrow">MNMuslim.com</p>
            <h1 className="hn-h1" style={{ fontSize: '48px' }}>Privacy Policy</h1>
            <p className="hn-sub" style={{ maxWidth: '400px' }}>Last updated: June 2026</p>
          </section>
        </div>

        {/* CONTENT */}
        <div className="legal-page">
          <div className="legal-section">
            <h2 className="legal-h2">Information We Collect</h2>
            <p className="legal-p">MNMuslim.com collects only the information needed to operate the directory. When you submit a service listing or contact us, we collect the information you provide — such as your name, business name, email address, phone number, and website. We do not sell or share personal data with third parties.</p>
          </div>

          <div className="legal-section">
            <h2 className="legal-h2">Analytics</h2>
            <p className="legal-p">We may use analytics tools to understand how visitors use the site. Any data collected is anonymized and aggregated. You can opt out via your browser settings or a browser extension.</p>
          </div>

          <div className="legal-section">
            <h2 className="legal-h2">Service Listing Data</h2>
            <p className="legal-p">Service and business information on MNMuslim.com is sourced from owner submissions. Once approved, listing details are displayed publicly on the site. Service providers can request updates or removal by contacting us at any time.</p>
          </div>

          <div className="legal-section">
            <h2 className="legal-h2">Cookies</h2>
            <p className="legal-p">MNMuslim.com may use essential cookies to operate the site. We do not use advertising or tracking cookies.</p>
          </div>

          <div className="legal-section">
            <h2 className="legal-h2">Third-Party Links</h2>
            <p className="legal-p">Listings on MNMuslim.com may include links to external websites. We are not responsible for the privacy practices or content of those sites.</p>
          </div>

          <div className="legal-section">
            <h2 className="legal-h2">Contact</h2>
            <p className="legal-p">Questions about this policy? Contact us through the <Link href="/contact" className="legal-link">Contact page</Link>.</p>
          </div>
        </div>

        
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
                </div>
                <div className="hn-footer-col">
                  <div className="hn-footer-col-title">Resources</div>
                  <Link href="/submit" className="hn-fl">List Your Service</Link>
                  <a href="https://mnhalal.com/submit" className="hn-fl" target="_blank" rel="noopener noreferrer">List Halal Business</a>
                </div>
                <div className="hn-footer-col">
                  <div className="hn-footer-col-title">Community</div>
                  <a href="https://www.instagram.com/mnmuslimevents/" className="hn-fl" target="_blank" rel="noopener noreferrer">Instagram</a>
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
