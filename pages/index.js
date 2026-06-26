import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
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
    }, { threshold: 0.12 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
  const placeholders = ['Halal Restaurant…', 'Halal Market…', 'Bakery…', 'Café…', 'Photographer…', 'Accountant…', 'Tutor…', 'Contractor…']
  const [phIdx, setPhIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setPhIdx(i => (i + 1) % placeholders.length), 3000)
    return () => clearInterval(t)
  }, [])

  const visionItems = [
    { emoji: '📅', name: 'Events' },
    { emoji: '💼', name: 'Jobs' },
    { emoji: '🕌', name: 'Mosques' },
    { emoji: '🏢', name: 'Organizations' },
    { emoji: '🤲', name: 'Resources' },
  ]

  return (
    <>
      <Head>
        <title>MNMuslim — The Digital Home for Muslims in Minnesota</title>
        <meta name="description" content="Discover trusted Muslim services, halal food, and community resources — all in one place." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="home-page">

        <div className="hn-dark-header">
        {/* ── NAV ── */}
        <nav className={`hn-nav${scrolled ? " scrolled" : ""}`}>
          <Link href="/" className="hn-logo">
            <img src="/logo.png" alt="MNMuslim" className="hn-logo-img" />
          </Link>
          <div className="hn-pill">
            <Link href="/services" className="hn-nl">Services</Link>
            <a href="https://mnhalal.com" className="hn-nl" target="_blank" rel="noopener noreferrer">MNHalal</a>
            <Link href="/about" className="hn-nl">About</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/contact" className="hn-contact">Contact <span aria-hidden="true">→</span></Link>
            <button
              className="hn-mobile-menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
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
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: '#060D1A', zIndex: 100,
            display: 'flex', flexDirection: 'column', padding: '20px 24px',
            overflowY: 'auto',
          }}>
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
                { label: 'About', href: '/about', internal: true },
                { label: 'Contact', href: '/contact', internal: true },
              ].map(item => item.internal ? (
                <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} style={{
                  color: '#fff', fontSize: '32px', fontWeight: '800', textDecoration: 'none',
                  padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.07)',
                  letterSpacing: '-1px', display: 'block',
                }}>
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} style={{
                  color: '#fff', fontSize: '32px', fontWeight: '800', textDecoration: 'none',
                  padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.07)',
                  letterSpacing: '-1px', display: 'block',
                }}>
                  {item.label}
                </a>
              ))}
            </div>

          </div>
        )}

        {/* ── HERO ── */}
        <section className="hn-hero">
          <div className="hn-g hn-g1" />
          <div className="hn-g hn-g2" />
          <div className="hn-g hn-g3" />

          <p className="hn-hero-eyebrow hn-reveal">The digital home for Muslims in Minnesota</p>

          <h1 className="hn-h1 hn-reveal hn-reveal-d1">
            Everything Minnesota<br />Muslims need
          </h1>

          <p className="hn-sub hn-reveal hn-reveal-d2">
            Discover trusted Muslim services, halal food, businesses, and community resources across Minnesota—all in one place.
          </p>

          <div className="hn-search-wrap">
            <div className="hn-search-box">
              <svg className="hn-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                className="hn-search-input"
                placeholder={placeholders[phIdx]}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="hn-search-btn">Search</button>
            </div>
          </div>

          <div className="hn-chips">
            <Link href="/services" className="hn-chip">Services</Link>
            <a href="https://mnhalal.com" className="hn-chip" target="_blank" rel="noopener noreferrer">Halal Food</a>
            <Link href="/services" className="hn-chip">Businesses</Link>
          </div>
        </section>
        </div>

        {/* ── ABOUT ── */}
        <section className="hn-about">
          <div className="hn-about-glow" />
          <div className="hn-about-inner">
            <div className="hn-about-left">
              <div className="hn-eyebrow hn-reveal">Why MNMuslim exists</div>
              <h2 className="hn-section-h2 hn-reveal hn-reveal-d1">Minnesota has an incredible<br />Muslim community.<br /><span className="hn-about-h2-sub">Finding it shouldn't be this hard.</span></h2>
              <p className="hn-about-body hn-reveal hn-reveal-d2">
                Minnesota is home to trusted Muslim businesses, professionals, halal restaurants, and community resources. But everything is scattered—across social media, word of mouth, and dozens of disconnected websites.
              </p>
              <p className="hn-about-body hn-reveal hn-reveal-d3" style={{ marginTop: '18px' }}>
                MNMuslim changes that. One trusted platform to discover services, support local businesses, and stay connected to your community.
              </p>
              <p className="hn-about-human hn-reveal hn-reveal-d4">
                Built by a Minnesota Muslim<br />for the Minnesota Muslim community.
              </p>
              <Link href="/about" className="hn-about-cta hn-reveal hn-reveal-d4">Our Mission →</Link>
            </div>
            <div className="hn-about-right">
              <div className="hn-principles">
                {[
                  { label: 'Community Built', desc: 'Created by and for Minnesota Muslims.' },
                  { label: 'Minnesota Focused', desc: 'Locally rooted, statewide reach.' },
                  { label: 'Faith Driven', desc: 'Grounded in our shared values.' },
                  { label: 'Growing Together', desc: 'Built alongside the community.' },
                ].map(p => (
                  <div key={p.label} className="hn-principle">
                    <div className="hn-principle-label">{p.label}</div>
                    <div className="hn-principle-desc">{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── ECOSYSTEM ── */}
        <section className="hn-eco">
          <div className="hn-eco-inner">
            <div className="hn-section-head">
              <h2 className="hn-section-h2" style={{ textAlign: 'center' }}>Explore the MNMuslim ecosystem</h2>
              <p className="hn-section-sub">Two focused products. One growing community platform. Everything you need starts here.</p>
            </div>
            <div className="hn-eco-grid">
              <Link href="/services" className="hn-ecard hn-ec-teal" style={{ textDecoration: 'none' }}>
                <div className="hn-ec-pat" />
                <div className="hn-ec-tag">Services Directory</div>
                <div className="hn-ec-name">Muslim Services</div>
                <p className="hn-ec-desc">Find trusted Muslim professionals and businesses across Minnesota — from accountants and tutors to photographers and contractors.</p>
                <span className="hn-ec-btn hn-ec-btn-teal">Find a Service <span className="hn-ec-arr">→</span></span>
              </Link>
              <a href="https://mnhalal.com" className="hn-ecard hn-ec-gold" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div className="hn-ec-pat" />
                <div className="hn-ec-tag hn-ec-tag-gold">Halal Food Guide</div>
                <div className="hn-ec-name">MNHalal</div>
                <p className="hn-ec-desc">Discover halal restaurants, cafés, bakeries, and markets across Minnesota.</p>
                <span className="hn-ec-btn hn-ec-btn-gold">Find Halal Food <span className="hn-ec-arr">→</span></span>
              </a>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="hn-how">
          <div className="hn-how-inner">
            <div className="hn-section-head hn-reveal">
              <div className="hn-eyebrow" style={{ textAlign: 'center' }}>How it works</div>
              <h2 className="hn-section-h2" style={{ textAlign: 'center' }}>Simple. Trusted. Community-first.</h2>
            </div>
            <div className="hn-how-grid">
              {[
                { num: '01', title: 'Discover', desc: 'Search trusted Muslim services and halal businesses across Minnesota—all in one place.' },
                { num: '02', title: 'Support', desc: 'Choose local Muslim professionals and businesses. Every visit helps strengthen our community.' },
                { num: '03', title: 'Grow', desc: 'List your business and get discovered by thousands of Minnesota Muslims looking for trusted services.' },
              ].map((s, i) => (
                <div key={s.num} className={`hn-how-card hn-reveal hn-reveal-d${i+1}`}>
                  <div className="hn-how-num">{s.num}</div>
                  <div className="hn-how-title">{s.title}</div>
                  <p className="hn-how-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST ── */}
        <section className="hn-trust">
          <div className="hn-trust-inner">
            {[
              { label: 'Community Built', sub: 'By and for Minnesota Muslims' },
              { label: 'Minnesota Focused', sub: 'Locally rooted, statewide reach' },
              { label: 'Growing Directory', sub: 'New listings added regularly' },
              { label: 'Free to List', sub: 'No cost to join the platform' },
            ].map((t, i) => (
              <div key={t.label} className={`hn-trust-item hn-reveal hn-reveal-d${i+1}`}>
                <div className="hn-trust-label">{t.label}</div>
                <div className="hn-trust-sub">{t.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="hn-cta">
          <div className="hn-cta-inner">
            <h2 className="hn-cta-h2">Get discovered by<br />Minnesota Muslims</h2>
            <p className="hn-cta-sub">Join the growing directory and make it easier for Minnesota Muslims to discover and support your business or professional service.</p>
            <div className="hn-cta-btns">
              <Link href="/submit" className="hn-cta-btn1">List Your Service</Link>
              <a href="https://mnhalal.com/submit" className="hn-cta-btn2" target="_blank" rel="noopener noreferrer">List Halal Business</a>
            </div>
            <p className="hn-cta-trust-line">Free to list · Built for the Minnesota Muslim community</p>
            <Link href="/about" className="hn-cta-learn">Learn how listing works →</Link>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="hn-footer">
          <div className="hn-footer-inner">
            <div className="hn-footer-top">
              <div className="hn-footer-brand">
                <Link href="/" className="hn-footer-logo">
                  <img src="/logo.png" alt="MNMuslim" className="hn-footer-logo-img" />
                </Link>
                <p className="hn-footer-tag">The trusted platform connecting Minnesota Muslims with businesses, services, and community resources.</p>
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
                  <Link href="/about" className="hn-fl">About</Link>
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
                  <a href="https://instagram.com/mnmuslim" className="hn-fl" target="_blank" rel="noopener noreferrer">Instagram</a>
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



