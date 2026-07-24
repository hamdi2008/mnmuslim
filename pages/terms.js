import Head from 'next/head'
import Link from 'next/link'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Use — MNMuslim</title>
        <meta name="description" content="Terms of Use for MNMuslim.com" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="home-page">
        <SiteNav />

        {/* HERO */}
        <div className="hn-dark-header">
          <section className="hn-hero" style={{ paddingBottom: '72px' }}>
            <div className="hn-g hn-g1" /><div className="hn-g hn-g2" /><div className="hn-g hn-g3" />
            <p className="hn-hero-eyebrow">MNMuslim.com</p>
            <h1 className="hn-h1" style={{ fontSize: '48px' }}>Terms of Use</h1>
            <p className="hn-sub" style={{ maxWidth: '400px' }}>Last updated: June 2026</p>
          </section>
        </div>

        {/* CONTENT */}
        <div className="legal-page">
          <div className="legal-section">
            <h2 className="legal-h2">Use of the Site</h2>
            <p className="legal-p">MNMuslim.com is a community directory connecting Minnesota Muslims with trusted service providers. You may use this site to discover, share, and support Muslim-owned services and businesses across Minnesota.</p>
          </div>

          <div className="legal-section">
            <h2 className="legal-h2">Accuracy of Information</h2>
            <p className="legal-p">We strive to keep listings accurate, but service details, contact information, and availability can change. Always verify directly with the provider before making a decision. MNMuslim.com is not responsible for outdated or incorrect information.</p>
          </div>

          <div className="legal-section">
            <h2 className="legal-h2">Submitted Listings</h2>
            <p className="legal-p">By submitting a service listing, you confirm that the information is accurate to the best of your knowledge. We review all submissions before publishing. We reserve the right to edit, decline, or remove any listing that contains false, misleading, or inappropriate information.</p>
          </div>

          <div className="legal-section">
            <h2 className="legal-h2">No Endorsement</h2>
            <p className="legal-p">Listings on MNMuslim.com are not endorsements or recommendations. We do not independently verify the quality or credentials of listed service providers. Users are responsible for their own due diligence before engaging with any provider.</p>
          </div>

          <div className="legal-section">
            <h2 className="legal-h2">Intellectual Property</h2>
            <p className="legal-p">The MNMuslim name, logo, and site design are the property of MNMuslim.com. You may not reproduce or use them without written permission. Business names, logos, and content submitted by service providers remain the property of their respective owners.</p>
          </div>

          <div className="legal-section">
            <h2 className="legal-h2">Changes to These Terms</h2>
            <p className="legal-p">We may update these terms from time to time. Continued use of the site after changes are posted constitutes acceptance of the updated terms.</p>
          </div>

          <div className="legal-section">
            <h2 className="legal-h2">Contact</h2>
            <p className="legal-p">Questions about these terms? Contact us through the <Link href="/contact" className="legal-link">Contact page</Link>.</p>
          </div>
        </div>

        <SiteFooter />
      </div>
    </>
  )
}
