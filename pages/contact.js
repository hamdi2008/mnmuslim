import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Contact() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
      desc: 'Have an idea for MNMuslim or something you'd like to see added?',
      link: { href: 'mailto:hello@mnmuslim.com?subject=Feature Suggestion', label: 'Suggest an idea →', external: true },
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
      title: 'Report an Issue',
      desc: 'Found a broken link, incorrect information, or something that needs fixing?',
      link: { href: 'mailto:hello@mnmuslim.com?subject=Issue Report', label: 'Report an issue →', external: true },
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
      title: 'Services Directory',
      desc: 'Offer a service in Minnesota? Our Muslim Services directory is coming soon.',
      link: { href: '/services', label: 'Learn about Services →', external: false },
    },
  ]

  return (
    <>
      <Head>
        <title>Contact — MNMuslim</title>
        <meta name="description" content="Get in touch with MNMuslim. Suggest a feature, report an issue, or share feedback about the Minnesota Muslim community platform." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="home-page">

        {/* ── NAV ── */}
        <nav className={`hn-nav${scrolled ? " scrolled" : ""}`}>
          <Link href="/" className="hn-logo">
            <img src="/logo.png" alt="MNMuslim" className="hn-logo-img" />
          </Link>
          <div className="hn-pill">
            <Link href="/services" className={`hn-nl${router.pathname==="/services" ? " hn-nl-active" : ""}`}>Services</Link>
            <a href="https://mnhalal.com" className="hn-nl" target="_blank" rel="noopener noreferrer">MNHalal</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/contact" className="hn-contact">Contact <span aria-hidden="true">→</span></Link>
            <button className="hn-mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>
                </svg>
              )}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#060D1A", zIndex: 100, display: "flex", flexDirection: "column", padding: "20px 24px", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "52px" }}>
              <Link href="/" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
                <img src="/logo-light.png" alt="MNMuslim" style={{ width: "140px", height: "auto", display: "block" }} />
              </Link>
              <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "4px" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              {[
                { label: "Services", href: "/services", internal: true },
                { label: "MNHalal", href: "https://mnhalal.com", internal: false },
                { label: "Contact", href: "/contact", internal: true },
              ].map(item => item.internal ? (
                <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} style={{ color: "#fff", fontSize: "32px", fontWeight: "800", textDecoration: "none", padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", letterSpacing: "-1px", display: "block" }}>
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} style={{ color: "#fff", fontSize: "32px", fontWeight: "800", textDecoration: "none", padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", letterSpacing: "-1px", display: "block" }}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── HERO ── */}
        <section className="ct-hero">
          <div className="ct-hero-glow" />
          <div className="ct-hero-inner">
            <p className="hn-hero-eyebrow">Contact</p>
            <h1 className="ct-hero-h1">Contact MNMuslim</h1>
            <p className="ct-hero-sub">Have a question, suggestion, or idea for the Minnesota Muslim community? We&apos;d love to hear from you.</p>
          </div>
        </section>

        {/* ── CONTACT CARD ── */}
        <section className="ct-body">
          <div className="ct-card">
            <h2 className="ct-card-title">Get in Touch</h2>
            <p className="ct-card-intro">Whether you want to suggest a resource, report an issue, share feedback, or connect about MNMuslim, this is the best place to start.</p>

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

        {/* ── FOOTER ── */}
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
