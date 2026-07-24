import Head from 'next/head'
import Link from 'next/link'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

export default function NotFound() {
  return (
    <div className="home-page">
      <Head>
        <title>Page Not Found — MNMuslim</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="hn-dark-header">
        <SiteNav />
        <section className="hn-hero" style={{ padding: '200px 24px 140px' }}>
          <div className="hn-g hn-g1" />
          <p className="hn-hero-eyebrow">404 — Page not found</p>
          <h1 className="hn-h1" style={{ fontSize: '52px' }}>This page wandered off</h1>
          <p className="hn-sub">The page you&apos;re looking for doesn&apos;t exist or was moved.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
            <Link href="/" className="hn-contact">Back to Home <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </div>
      <SiteFooter />
    </div>
  )
}
