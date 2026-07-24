import Head from 'next/head'
import Link from 'next/link'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — MNMuslim</title>
        <meta name="description" content="Privacy Policy for MNMuslim.com" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="home-page">
        <SiteNav />

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

        <SiteFooter />
      </div>
    </>
  )
}
