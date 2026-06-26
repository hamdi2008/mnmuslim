import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function About() {
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
      if (rect.top < window.innerHeight) { el.classList.add('hn-revealed') }
      else { obs.observe(el) }
    })
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Head>
        <title>About — MNMuslim</title>
        <meta name="description" content="Learn about MNMuslim — the trusted platform connecting Minnesota Muslims with businesses, services, and community resources." />
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
            <Link href="/about" className={`hn-nl${router.pathname==="/about" ? " hn-nl-active" : ""}`}>About</Link>
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
                { label: 'About', href: '/about', internal: true },
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

        {/* ── 1. HERO ── */}
        <section className="ab-hero">
          <div className="ab-hero-glow" />
          <div className="ab-hero-inner">
            <p className="hn-hero-eyebrow">Our Story</p>
            <h1 className="ab-hero-h1">The digital home for<br />Minnesota Muslims</h1>
            <p className="ab-hero-sub">One trusted place to discover Muslim businesses, services, and community resources in Minnesota.</p>
          </div>
        </section>

        {/* ── 2. OUR STORY ── */}
        <section className="ab-section">
          <div className="ab-story-inner">
            <div className="ab-story-left hn-reveal">
              <div className="hn-eyebrow">Why we built this</div>
              <h2 className="ab-h2">A real problem.<br />A community solution.</h2>
              <p className="ab-body">
                Minnesota has one of the most vibrant Muslim communities in the United States. Thousands of Muslim-owned businesses, professionals, halal restaurants, and community organizations call Minnesota home.
              </p>
              <p className="ab-body" style={{ marginTop: '16px' }}>
                But finding them has always been frustratingly difficult. Resources are scattered across Instagram pages, WhatsApp groups, Facebook posts, and word of mouth. There is no single trusted place to search, discover, and connect.
              </p>
              <p className="ab-body" style={{ marginTop: '16px' }}>
                MNMuslim exists to change that. We are building the central platform where Minnesota Muslims can discover trusted services, support local businesses, and stay connected to their community — all in one place.
              </p>
            </div>
            <div className="ab-story-right hn-reveal hn-reveal-d1">
              <div className="ab-stat-card">
                <div className="ab-stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0CA5A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div className="ab-stat-label">Community Built</div>
                <div className="ab-stat-desc">Built by a Minnesota Muslim for the local community.</div>
              </div>
              <div className="ab-stat-card">
                <div className="ab-stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0CA5A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                </div>
                <div className="ab-stat-label">Growing Platform</div>
                <div className="ab-stat-desc">Starting with Muslim Services and MNHalal, with more community resources coming soon.</div>
              </div>
              <div className="ab-stat-card">
                <div className="ab-stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0CA5A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div className="ab-stat-label">Minnesota Focused</div>
                <div className="ab-stat-desc">Every resource is designed specifically for Muslims living in Minnesota.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2b. WHY I STARTED MNMUSLIM ── */}
        <section className="ab-personal">
          <div className="ab-personal-inner hn-reveal">
            <div className="hn-eyebrow">Why I started MNMuslim</div>
            <div className="ab-personal-content">
              <p className="ab-personal-body">
                As someone living in Minnesota, I often found myself searching across Instagram, Facebook groups, WhatsApp chats, and word of mouth just to find trusted Muslim businesses and services.
              </p>
              <p className="ab-personal-body">
                I kept thinking there should be one place where everything is organized and easy to discover.
              </p>
              <p className="ab-personal-body">
                That&apos;s why I started building MNMuslim — one step at a time — with the goal of making everyday life a little easier for our community.
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. OUR MISSION ── */}
        <section className="ab-mission">
          <div className="ab-mission-inner hn-reveal">
            <div className="hn-eyebrow" style={{ textAlign: 'center' }}>Our mission</div>
            <blockquote className="ab-mission-quote">
              To connect Minnesota Muslims with trusted businesses, services, and community resources — all in one place.
            </blockquote>
            <p className="ab-mission-sub" style={{ maxWidth: '640px', margin: '0 auto' }}>
              We believe that when Muslim businesses are easy to find, everyone benefits. Communities grow stronger, local economies thrive, and Minnesota Muslims can support one another with confidence.
            </p>
          </div>
        </section>

        {/* ── 4. WHAT WE'RE BUILDING ── */}
        <section className="ab-section ab-building">
          <div className="ab-inner">
            <div className="hn-section-head hn-reveal">
              <div className="hn-eyebrow" style={{ textAlign: 'center' }}>What we're building</div>
              <h2 className="ab-h2 ab-center">Two products. One growing ecosystem.</h2>
            </div>
            <div className="ab-cards">
              <div className="ab-card ab-card-teal hn-reveal hn-reveal-d1">
                <div className="ab-card-badge ab-badge-neutral">Coming Soon</div>
                <h3 className="ab-card-title">Muslim Services</h3>
                <p className="ab-card-desc">A directory of trusted Muslim professionals and service providers across Minnesota — from accountants and photographers to tutors and contractors.</p>
                <Link href="/services" className="ab-card-link ab-link-teal">Explore Muslim Services →</Link>
              </div>
              <div className="ab-card ab-card-gold hn-reveal hn-reveal-d2">
                <div className="ab-card-badge ab-badge-gold">Live Now</div>
                <h3 className="ab-card-title">MNHalal</h3>
                <p className="ab-card-desc">A dedicated guide to halal restaurants, cafés, bakeries, markets, and catering across Minnesota. The go-to resource for halal dining and shopping.</p>
                <a href="https://mnhalal.com" className="ab-card-link ab-link-gold" target="_blank" rel="noopener noreferrer">Explore MNHalal →</a>
              </div>
              <div className="ab-card ab-card-neutral hn-reveal hn-reveal-d3">
                <div className="ab-card-badge ab-badge-neutral">Coming Soon</div>
                <h3 className="ab-card-title">More to Come</h3>
                <p className="ab-card-desc">Events, mosques, organizations, jobs, and more. MNMuslim is growing into the complete digital home for Minnesota Muslims.</p>
                <Link href="/contact" className="ab-card-link ab-link-neutral">Share an idea →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. OUR VALUES ── */}
        <section className="ab-values">
          <div className="ab-inner">
            <div className="hn-section-head hn-reveal">
              <div className="hn-eyebrow" style={{ textAlign: 'center' }}>Our values</div>
              <h2 className="ab-h2 ab-center">What guides everything we build</h2>
            </div>
            <div className="ab-values-grid">
              {[
                {
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0CA5A5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                  title: 'Community First', desc: 'Every decision is made with the Minnesota Muslim community in mind. We build for people, not metrics.'
                },
                {
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0CA5A5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                  title: 'Trust', desc: 'We only feature real businesses and professionals. Our community deserves accurate, reliable information.'
                },
                {
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0CA5A5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
                  title: 'Support Local', desc: 'Every listing and every visit helps a local Muslim business grow. We believe in building from within.'
                },
                {
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0CA5A5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg>,
                  title: 'Build Together', desc: 'MNMuslim is shaped by community feedback. Your ideas directly influence what we build next.'
                },
              ].map((v, i) => (
                <div key={v.title} className={`ab-value-card hn-reveal hn-reveal-d${i+1}`}>
                  <div className="ab-value-icon-svg">{v.icon}</div>
                  <h3 className="ab-value-title">{v.title}</h3>
                  <p className="ab-value-desc">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. LOOKING AHEAD ── */}
        <section className="ab-section">
          <div className="ab-ahead-inner">
            <div className="ab-ahead-left hn-reveal">
              <div className="hn-eyebrow">Looking ahead</div>
              <h2 className="ab-h2">Building the complete digital home for Minnesota Muslims</h2>
              <p className="ab-body">
                MNMuslim is just getting started. We began with MNHalal — a dedicated halal food guide for Minnesota — and are actively building Muslim Services, a directory of trusted Muslim professionals.
              </p>
              <p className="ab-body" style={{ marginTop: '16px' }}>
                Our long-term vision is a platform where every Minnesota Muslim can find anything they need — from a trusted dentist to a mosque, from a halal grocery store to a community event — all verified, all local, all in one place.
              </p>
            </div>
            <div className="ab-ahead-right hn-reveal hn-reveal-d1">
              <div className="ab-roadmap">
                <div className="ab-roadmap-label">
                  <span className="ab-dot ab-dot-live" />
                  Available Today
                </div>
                <div className="ab-roadmap-live">
                  <div className="ab-live-item"><span className="ab-check">✓</span> MNHalal</div>
                  <div className="ab-live-item ab-live-soon"><span className="ab-check-soon">🚧</span> Muslim Services (Coming Soon)</div>
                </div>
                <div className="ab-roadmap-label" style={{ marginTop: '28px' }}>
                  <span className="ab-dot ab-dot-soon" />
                  Future Vision
                </div>
                <div className="ab-soon-chips">
                  {['Community Organizations', 'Events', 'Resources', 'Additional Directories'].map(c => (
                    <span key={c} className="ab-soon-chip">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. CTA ── */}
        <section className="hn-cta">
          <div className="hn-cta-inner">
            <h2 className="hn-cta-h2">Help build Minnesota&apos;s<br />Muslim ecosystem</h2>
            <p className="hn-cta-sub">Whether you want to list your business, share an idea, or just say hello — we'd love to hear from you.</p>
            <div className="hn-cta-btns">
              <Link href="/contact" className="hn-cta-btn1">Contact Us</Link>
              <a href="https://mnhalal.com" className="hn-cta-btn2" target="_blank" rel="noopener noreferrer">Explore MNHalal</a>
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
