import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

const CATEGORIES = [
  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>, label: 'Photographer' },
  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, label: 'Accountant' },
  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>, label: 'Tutor' },
  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: 'Lawyer' },
  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>, label: 'Contractor' },
  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>, label: 'Designer' },
  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, label: 'Therapist' },
  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, label: 'Doctor' },
]

const WHY_POINTS = [
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    label: 'Verified & Trusted',
    desc: 'Every listing is reviewed to ensure you're connecting with real, reliable Muslim professionals in your community.',
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    label: 'Minnesota Local',
    desc: 'Exclusively focused on Minnesota — so every result is someone who actually serves your area, not a national listing.',
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    label: 'Community Driven',
    desc: 'Built by Minnesota Muslims for Minnesota Muslims. Every listing you visit or share strengthens our local economy.',
  },
]

export default function Services() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('.hn-reveal')
    if (!els.length) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('hn-revealed'); obs.unobserve(e.target) } })
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
    els.forEach(el => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight) el.classList.add('hn-revealed')
      else obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Head>
        <title>Muslim Services — Coming Soon | MNMuslim</title>
        <meta name="description" content="Muslim Services is a directory of trusted Muslim professionals and service providers coming soon to MNMuslim. Find photographers, lawyers, tutors, contractors, and more in Minnesota." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="home-page">

        {/* ── NAV ── */}
        <nav className={`hn-nav${scrolled ? ' scrolled' : ''}`}>
          <Link href="/" className="hn-logo">
            <img src="/logo.png" alt="MNMuslim" className="hn-logo-img" />
          </Link>
          <div className="hn-pill">
            <Link href="/services" className={`hn-nl${router.pathname === '/services' ? ' hn-nl-active' : ''}`}>Services</Link>
            <a href="https://mnhalal.com" className="hn-nl" target="_blank" rel="noopener noreferrer">MNHalal</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#060D1A', zIndex: 100, display: 'flex', flexDirection: 'column', padding: '20px 24px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '52px' }}>
              <Link href="/" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                <img src="/logo-light.png" alt="MNMuslim" style={{ width: '140px', height: 'auto', display: 'block' }} />
              </Link>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {[
                { label: 'Services', href: '/services', internal: true },
                { label: 'MNHalal', href: 'https://mnhalal.com', internal: false },
                { label: 'Contact', href: '/contact', internal: true },
              ].map(item => item.internal ? (
                <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} style={{ color: '#fff', fontSize: '32px', fontWeight: '800', textDecoration: 'none', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', letterSpacing: '-1px', display: 'block' }}>
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} style={{ color: '#fff', fontSize: '32px', fontWeight: '800', textDecoration: 'none', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', letterSpacing: '-1px', display: 'block' }}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── HERO ── */}
        <section className="sv-hero">
          <div className="sv-hero-glow" />
          <div className="sv-hero-inner">
            <p className="sv-eyebrow hn-fade-up">Coming Soon</p>
            <h1 className="sv-hero-h1 hn-fade-up-1">
              Find trusted Muslim<br />professionals across<br />Minnesota
            </h1>
            <p className="sv-hero-sub hn-fade-up-2">
              Muslim Services is a directory of trusted Muslim professionals and service providers — coming soon to MNMuslim.
            </p>
            <div className="sv-hero-btns hn-fade-up-3">
              <Link href="/contact" className="sv-btn-primary">Get Notified</Link>
              <a href="https://mnhalal.com" className="sv-btn-secondary" target="_blank" rel="noopener noreferrer">Explore MNHalal →</a>
            </div>
          </div>
        </section>

        {/* ── WHAT IS MUSLIM SERVICES ── */}
        <section className="sv-what">
          <div className="sv-what-inner">
            <div className="sv-section-head hn-reveal">
              <p className="hn-eyebrow" style={{ textAlign: 'center' }}>What is Muslim Services?</p>
              <h2 className="hn-section-h2" style={{ textAlign: 'center' }}>One directory for every<br />Muslim professional need</h2>
              <p className="sv-section-sub">
                From photographers and lawyers to tutors and contractors — Muslim Services will be your go-to resource for finding trusted Muslim professionals in Minnesota. No more asking around in WhatsApp groups.
              </p>
            </div>
            <div className="sv-chips hn-reveal">
              {CATEGORIES.map(cat => (
                <span key={cat.label} className="sv-chip">
                  <span className="sv-chip-icon">{cat.icon}</span>
                  {cat.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY IT MATTERS ── */}
        <section className="sv-why">
          <div className="sv-why-inner">
            <div className="sv-section-head hn-reveal">
              <p className="hn-eyebrow" style={{ textAlign: 'center' }}>Why it matters</p>
              <h2 className="hn-section-h2" style={{ textAlign: 'center' }}>Built on trust.<br />Rooted in community.</h2>
            </div>
            <div className="sv-pillars">
              {WHY_POINTS.map((p, i) => (
                <div key={p.label} className={`sv-pillar hn-reveal hn-reveal-d${i + 1}`}>
                  <div className="sv-pillar-icon">{p.icon}</div>
                  <div>
                    <div className="sv-pillar-label">{p.label}</div>
                    <div className="sv-pillar-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GET NOTIFIED CTA ── */}
        <section className="sv-cta">
          <div className="sv-cta-inner hn-reveal">
            <p className="sv-cta-eyebrow">Stay in the loop</p>
            <h2 className="sv-cta-h2">Be the first to know when<br />Muslim Services launches.</h2>
            <p className="sv-cta-sub">We&apos;re working hard to build the most trusted Muslim professional directory in Minnesota. Sign up and we&apos;ll let you know when it&apos;s live.</p>
            <div className="sv-cta-btns">
              <Link href="/contact" className="hn-cta-btn1">Contact Us</Link>
              <a href="https://mnhalal.com" className="hn-cta-btn2" target="_blank" rel="noopener noreferrer">Explore MNHalal →</a>
            </div>
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
