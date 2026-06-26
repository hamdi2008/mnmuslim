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
  const placeholders = ['Photographer…', 'Accountant…', 'Dentist…', 'Mosque…', 'Islamic School…', 'Halal Restaurant…']
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
    { emoji: '🎓', name: 'Scholarships' },
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

          <p className="hn-hero-eyebrow">The digital home for Muslims in Minnesota</p>

          <h1 className="hn-h1">
            Everything Minnesota<br />Muslims need
          </h1>

          <p className="hn-sub">
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
          <div className="hn-about-inner">
            <div className="hn-about-left">
              <div className="hn-eyebrow">Why MNMuslim exists</div>
              <h2 className="hn-section-h2">Minnesota has an incredible Muslim community.<br />Finding it shouldn't be this hard.</h2>
              <p className="hn-about-body">
                Resources are scattered across social media groups, word of mouth, and dozens of disconnected websites. There's no single place to find a trusted dentist, a halal restaurant, an Islamic school, or a local business that shares your values.
              </p>
              <p className="hn-about-body" style={{ marginTop: '16px' }}>
                MNMuslim changes that. One trusted platform where Minnesota Muslims can discover services, support local businesses, and stay connected to their community.
              </p>
              <p className="hn-about-human">Built by a Minnesota Muslim for the Minnesota Muslim community.</p>
              <Link href="/about" className="hn-text-link">Our Mission →</Link>
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
                    <span className="hn-principle-dot" />
                    <div>
                      <div className="hn-principle-label">{p.label}</div>
                      <div className="hn-principle-desc">{p.desc}</div>
                    </div>
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
              <div className="hn-eyebrow" style={{ textAlign: 'center' }}>Start Here</div>
              <h2 className="hn-section-h2" style={{ textAlign: 'center' }}>Explore MNMuslim</h2>
              <p className="hn-section-sub">Two focused products. One unified community platform.</p>
            </div>
            <div className="hn-eco-grid">
              <div className="hn-ecard hn-ec-teal">
                <div className="hn-ec-pat" />
                <div className="hn-ec-ico">💼</div>
                <div className="hn-ec-tag">Services Directory</div>
                <div className="hn-ec-name">Muslim Services</div>
                <p className="hn-ec-desc">Find trusted Muslim professionals and service providers across Minnesota.</p>
                <Link href="/services" className="hn-ec-btn hn-ec-btn-teal">Browse Services →</Link>
              </div>
              <div className="hn-ecard hn-ec-gold">
                <div className="hn-ec-pat" />
                <div className="hn-ec-ico">🍽️</div>
                <div className="hn-ec-tag hn-ec-tag-gold">Halal Food Guide</div>
                <div className="hn-ec-name">MNHalal</div>
                <p className="hn-ec-desc">Discover halal restaurants, markets, bakeries, and cafés across Minnesota.</p>
                <a href="https://mnhalal.com" className="hn-ec-btn hn-ec-btn-gold" target="_blank" rel="noopener noreferrer">Explore MNHalal →</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── VISION ── */}
        <section className="hn-vision">
          <div className="hn-vision-inner">
            <div className="hn-vision-intro">
              <div className="hn-eyebrow">Building the digital home for Muslims in Minnesota</div>
              <h2 className="hn-section-h2">One platform. Growing together.</h2>
              <p className="hn-vision-sub">We&apos;re just getting started — and we&apos;d love to build this together.</p>
            </div>
            <div className="hn-vg">
              <div className="hn-vcol">
                <div className="hn-vcol-hd">
                  <span className="hn-vdot-live" />
                  <span className="hn-vlbl hn-vlbl-live">Live now</span>
                </div>
                <Link href="/services" className="hn-vi hn-vi-live">
                  <div className="hn-vi-ico" style={{ background: '#E6F9F9' }}>💼</div>
                  <div>
                    <div className="hn-vi-t">Muslim Services</div>
                    <div className="hn-vi-s">Professional services directory</div>
                  </div>
                  <span className="hn-vi-arr">→</span>
                </Link>
                <a href="https://mnhalal.com" className="hn-vi hn-vi-live" target="_blank" rel="noopener noreferrer">
                  <div className="hn-vi-ico" style={{ background: '#FFFBEB' }}>🍽️</div>
                  <div>
                    <div className="hn-vi-t">MNHalal</div>
                    <div className="hn-vi-s">Halal food directory</div>
                  </div>
                  <span className="hn-vi-arr">→</span>
                </a>
              </div>
              <div className="hn-vcol">
                <div className="hn-vcol-hd">
                  <span className="hn-vdot-soon" />
                  <span className="hn-vlbl hn-vlbl-soon">Coming next</span>
                </div>
                <div className="hn-soon-grid">
                  {visionItems.map(v => (
                    <div key={v.name} className="hn-si">
                      <div className="hn-si-ico">{v.emoji}</div>
                      <div className="hn-si-name">{v.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="hn-vision-suggest">
              <p style={{ fontSize: '13px', color: '#7A8FA6', marginBottom: '16px' }}>
                We&apos;re just getting started — and we&apos;d love to build this together.
              </p>
              <Link href="/contact" className="hn-suggest-btn">✦ Make a Suggestion</Link>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="hn-cta">
          <div className="hn-cta-b1" />
          <div className="hn-cta-b2" />
          <div className="hn-cta-b3" />
          <p className="hn-cta-label">Get Listed</p>
          <h2 className="hn-cta-h2">Offer a service or halal business?</h2>
          <p className="hn-cta-sub">Help Minnesota Muslims discover and support your business.</p>
          <div className="hn-cta-btns">
            <Link href="/submit" className="hn-cta-btn1">List Your Service</Link>
            <a href="https://mnhalal.com" className="hn-cta-btn2" target="_blank" rel="noopener noreferrer">List on MNHalal</a>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="hn-footer">
          <div className="hn-footer-inner">
            <div className="hn-footer-top">
              <div className="hn-footer-brand">
                <Link href="/" className="hn-footer-logo">
                  <img src="/logo-light.png" alt="MNMuslim" className="hn-footer-logo-img" />
                </Link>
                <p className="hn-footer-tag">The digital home for Muslims in Minnesota.</p>
                <p className="hn-footer-mission">Helping Minnesota Muslims discover, connect, and support one another.</p>
              </div>
              <div className="hn-footer-links">
                <Link href="/services" className="hn-fl">Services</Link>
                <a href="https://mnhalal.com" className="hn-fl" target="_blank" rel="noopener noreferrer">MNHalal</a>
                <Link href="/about" className="hn-fl">About</Link>
                <Link href="/submit" className="hn-fl">Get Listed</Link>
                <Link href="/contact" className="hn-fl">Contact</Link>
              </div>
            </div>
            <div className="hn-footer-bottom">
              <span className="hn-fb-copy">© 2025 MNMuslim.com · All rights reserved</span>
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



