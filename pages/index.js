import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const [search, setSearch] = useState('')

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

        {/* ── NAV ── */}
        <nav className="hn-nav">
          <Link href="/" className="hn-logo">
            <img src="/logo.png" alt="MNMuslim" className="hn-logo-img" />
          </Link>
          <div className="hn-pill">
            <Link href="/services" className="hn-nl">Services</Link>
            <a href="https://mnhalal.com" className="hn-nl" target="_blank" rel="noopener noreferrer">MNHalal</a>
            <Link href="/about" className="hn-nl">About</Link>
          </div>
          <Link href="/contact" className="hn-contact">Contact</Link>
        </nav>

        {/* ── HERO ── */}
        <section className="hn-hero">
          <div className="hn-g hn-g1" />
          <div className="hn-g hn-g2" />
          <div className="hn-g hn-g3" />

          <div className="hn-badge">
            <span className="hn-bp" />
            Minnesota · Muslim · Community
          </div>

          <h1 className="hn-h1">
            Everything Minnesota<br />
            Muslims need.<br />
            <em>One trusted <span className="hn-teal">place.</span></em>
          </h1>

          <p className="hn-sub">
            Discover trusted Muslim services, halal food, and community resources — all in one place.
          </p>

          <div className="hn-search-wrap">
            <div className="hn-search-box">
              <input
                className="hn-search-input"
                placeholder="Search services, halal restaurants, businesses…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="hn-search-btn">Search</button>
            </div>
          </div>

          <div className="hn-btns">
            <Link href="/services" className="hn-btn-primary">Browse Services</Link>
            <a href="https://mnhalal.com" className="hn-btn-ghost" target="_blank" rel="noopener noreferrer">Browse MNHalal</a>
          </div>
        </section>

        {/* hero → white transition */}
        <div className="hn-fade" />

        {/* ── ABOUT ── */}
        <section className="hn-about">
          <div className="hn-about-inner">
            <div className="hn-about-left">
              <div className="hn-eyebrow">What is MNMuslim?</div>
              <h2 className="hn-section-h2">One platform.<br />Built for<br />Minnesota Muslims.</h2>
              <p className="hn-about-body">
                MNMuslim connects Minnesota Muslims with trusted local resources. We&apos;re building one place to discover businesses, halal food, professionals, and future community tools — so our community can find what it needs, fast.
              </p>
              <p className="hn-about-human">Built by a Minnesota Muslim for the Minnesota Muslim community.</p>
              <Link href="/about" className="hn-text-link">Learn more about us →</Link>
            </div>
            <div className="hn-about-right">
              {[
                { ico: '🤝', bg: '#E6F9F9', t: 'Community Focused', s: 'Built for and by Minnesota Muslims' },
                { ico: '🛡️', bg: '#EEF2FF', t: 'Trusted & Reliable', s: 'Verified listings, real people' },
                { ico: '📍', bg: '#FFFBEB', t: 'Local to Minnesota', s: 'Statewide and growing' },
                { ico: '🌙', bg: '#F3F0FF', t: 'Faith-Driven Values', s: 'Rooted in our community identity' },
              ].map(v => (
                <div key={v.t} className="hn-av">
                  <div className="hn-av-ico" style={{ background: v.bg }}>{v.ico}</div>
                  <div>
                    <div className="hn-av-t">{v.t}</div>
                    <div className="hn-av-s">{v.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ECOSYSTEM ── */}
        <section className="hn-eco">
          <div className="hn-eco-inner">
            <div className="hn-section-head">
              <div className="hn-eyebrow" style={{ textAlign: 'center' }}>The MNMuslim Ecosystem</div>
              <h2 className="hn-section-h2" style={{ textAlign: 'center' }}>Explore what MNMuslim offers</h2>
              <p className="hn-section-sub">Two focused products. One unified community platform.</p>
            </div>
            <div className="hn-eco-grid">

              <div className="hn-ecard hn-ec-teal">
                <div className="hn-ec-pat" />
                <div className="hn-ec-ico">💼</div>
                <div className="hn-ec-tag">Services Directory</div>
                <div className="hn-ec-name">Muslim Services</div>
                <p className="hn-ec-desc">Find trusted Muslim professionals across Minnesota.</p>
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
              <div className="hn-eyebrow">Building the MNMuslim Ecosystem</div>
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
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="hn-cta">
          <div className="hn-cta-b1" />
          <div className="hn-cta-b2" />
          <h2 className="hn-cta-h2">Ready to explore?</h2>
          <div className="hn-cta-btns">
            <Link href="/services" className="hn-cta-btn1">Browse Services</Link>
            <a href="https://mnhalal.com" className="hn-cta-btn2" target="_blank" rel="noopener noreferrer">Browse MNHalal</a>
          </div>
          <p className="hn-cta-note">
            Own a Muslim business or service?{' '}
            <Link href="/submit" className="hn-cta-note-link">Submit your listing.</Link>
          </p>
        </section>

        {/* ── FOOTER ── */}
        <footer className="hn-footer">
          <div className="hn-footer-inner">
            <div className="hn-footer-top">
              <div className="hn-footer-brand">
                <Link href="/" className="hn-footer-logo">
                  <img src="/logo.png" alt="MNMuslim" className="hn-footer-logo-img" />
                </Link>
                <p className="hn-footer-tag">The digital home for Muslims in Minnesota.</p>
                <p className="hn-footer-mission">Helping Minnesota Muslims discover, connect, and support one another.</p>
              </div>
              <div className="hn-footer-links">
                <Link href="/services" className="hn-fl">Services</Link>
                <a href="https://mnhalal.com" className="hn-fl" target="_blank" rel="noopener noreferrer">MNHalal</a>
                <Link href="/about" className="hn-fl">About</Link>
                <Link href="/contact" className="hn-fl">Contact</Link>
                <a href="https://instagram.com/mnmuslim" className="hn-fl" target="_blank" rel="noopener noreferrer">Instagram</a>
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
