import Head from 'next/head'
import Link from 'next/link'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

export default function Contact() {
  const rows = [
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
      title: 'Email',
      desc: 'The best way to reach us directly.',
      link: { href: 'mailto:hello@mnmuslim.com', label: 'hello@mnmuslim.com', external: true },
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
      title: 'Suggest a Feature',
      desc: "Help shape MNMuslim by sharing your ideas and suggestions.",
      link: { href: 'mailto:hello@mnmuslim.com?subject=Feature Suggestion', label: 'Suggest an idea →', external: true },
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
      title: 'Report an Issue',
      desc: "Found incorrect information or something that isn't working? Let us know so we can fix it.",
      link: { href: 'mailto:hello@mnmuslim.com?subject=Issue Report', label: 'Report an issue →', external: true },
    },
  ]

  return (
    <>
      <Head>
        <title>Contact | MNMuslim</title>
        <meta name="description" content="Get in touch with MNMuslim. Suggest a feature, report an issue, or share feedback about the Minnesota Muslim community platform." />
        <link rel="icon" href="/favicon.png" />
        {/* Open Graph */}
        <meta property="og:title" content="Contact | MNMuslim" />
        <meta property="og:description" content="Get in touch with MNMuslim. Suggest a feature, report an issue, or share feedback about the Minnesota Muslim community platform." />
        <meta property="og:image" content="https://mnmuslim.com/og-image.png" />
        <meta property="og:url" content="https://mnmuslim.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MNMuslim" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact | MNMuslim" />
        <meta name="twitter:description" content="Get in touch with MNMuslim. Suggest a feature, report an issue, or share feedback about the Minnesota Muslim community platform." />
        <meta name="twitter:image" content="https://mnmuslim.com/og-image.png" />
      </Head>

      <div className="home-page">

        <SiteNav />

        {/* ── HERO ── */}
        <section className="ct-hero">
          <div className="ct-hero-glow" />
          <div className="ct-hero-inner">
            <p className="hn-hero-eyebrow">Contact</p>
            <h1 className="ct-hero-h1">Contact MNMuslim</h1>
            <p className="ct-hero-sub">Questions, feedback, or ideas? We&apos;d love to hear from you.</p>
          </div>
        </section>

        {/* ── CONTACT CARD ── */}
        <section className="ct-body">
          <div className="ct-card">
            <h2 className="ct-card-title">Get in Touch</h2>
            <p className="ct-card-intro">Whether you're reporting an issue, suggesting a feature, or simply saying hello, this is the best place to reach us.</p>

            <div className="ct-rows">
              {rows.map((row, i) => (
                <div key={i} className="ct-row">
                  <div className="ct-row-icon">{row.icon}</div>
                  <div className="ct-row-content">
                    <div className="ct-row-title">{row.title}</div>
                    <div className="ct-row-desc">{row.desc}</div>
                    {row.link.external ? (
                      <a href={row.link.href} className="ct-row-link">{row.link.label}</a>
                    ) : (
                      <Link href={row.link.href} className="ct-row-link">{row.link.label}</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="ct-note">We typically respond within 1–2 business days.</p>
          </div>
        </section>

        <SiteFooter />

      </div>
    </>
  )
}
