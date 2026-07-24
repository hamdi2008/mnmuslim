import Head from 'next/head'
import Link from 'next/link'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

export default function About() {
  const ecosystem = [
    { variant: 'teal',    badge: 'Services Directory', title: 'Muslim Services',
      desc: 'Find Muslim professionals, businesses, and service providers across Minnesota.',
      cta: 'Explore Services →', href: '/services', external: false, link: 'ab-link-teal' },
    { variant: 'neutral', badge: 'Community Calendar', title: 'Community Events',
      desc: 'Discover upcoming events, programs, classes, and activities across the community.',
      cta: 'Browse Events →', href: '/events', external: false, link: 'ab-link-neutral' },
    { variant: 'gold',    badge: 'Halal Food Guide', title: 'MNHalal',
      desc: 'Explore halal restaurants, cafés, bakeries, and markets across Minnesota.',
      cta: 'Visit MNHalal ↗', href: 'https://mnhalal.com', external: true, link: 'ab-link-gold' },
  ]

  const values = [
    { icon: '🤝', title: 'Community Built',  desc: 'Created by a Minnesota Muslim for the local community.' },
    { icon: '📍', title: 'Minnesota First',  desc: 'Focused entirely on Minnesota — locally rooted, statewide reach.' },
    { icon: '🔍', title: 'Easy to Discover', desc: 'Helping Muslims find businesses and services with confidence.' },
    { icon: '🌱', title: 'Growing Together', desc: 'Every listing strengthens the local Muslim community.' },
  ]

  return (
    <div className="home-page">
      <Head>
        <title>About MNMuslim | The Digital Home for Muslims in Minnesota</title>
        <meta name="description" content="Why MNMuslim exists — one platform where Minnesota Muslims can discover services, support local businesses, and stay connected to their community." />
        <link rel="icon" href="/favicon.png" />
        <meta property="og:title" content="About MNMuslim" />
        <meta property="og:description" content="Why MNMuslim exists — bringing Minnesota's Muslim services, events, and halal food together in one place." />
        <meta property="og:image" content="https://mnmuslim.com/og-image.png" />
        <meta property="og:url" content="https://mnmuslim.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MNMuslim" />
      </Head>

      <div className="hn-dark-header">
        <SiteNav />
        <section className="ab-hero">
          <div className="ab-hero-glow" />
          <div className="ab-hero-inner">
            <p className="hn-hero-eyebrow">About MNMuslim</p>
            <h1 className="ab-hero-h1">Why MNMuslim exists</h1>
            <p className="ab-hero-sub">The digital home for Muslims in Minnesota.</p>
          </div>
        </section>
      </div>

      {/* OUR STORY */}
      <section className="ab-section">
        <div className="ab-story-inner">
          <div>
            <div className="hn-eyebrow">Our story</div>
            <h2 className="ab-h2">Finding Muslim businesses shouldn&apos;t be this hard.</h2>
            <p className="ab-body">
              Minnesota has amazing Muslim businesses, professionals, halal restaurants, and community
              resources — but they&apos;re scattered across Instagram, WhatsApp groups, Facebook posts,
              and word of mouth.
            </p>
            <p className="ab-body" style={{ marginTop: '18px' }}>
              MNMuslim brings everything together. One platform where Minnesota Muslims can discover
              services, support local businesses, and stay connected to their community.
            </p>
          </div>
          <div className="ab-story-right">
            <div className="ab-stat-card">
              <div className="ab-stat-num">3</div>
              <div className="ab-stat-label">Directories</div>
              <div className="ab-stat-desc">Services, Events, and halal food — all in one place.</div>
            </div>
            <div className="ab-stat-card">
              <div className="ab-stat-num">1</div>
              <div className="ab-stat-label">Community</div>
              <div className="ab-stat-desc">Built by and for Minnesota Muslims.</div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="ab-mission">
        <div className="ab-mission-inner">
          <div className="hn-eyebrow" style={{ color: '#2FD4D4', textAlign: 'center' }}>Our mission</div>
          <p className="ab-mission-quote">One platform where Minnesota Muslims can discover services, support local businesses, and stay connected to their community.</p>
          <p className="ab-mission-sub">Built by a Minnesota Muslim for the Minnesota Muslim community.</p>
        </div>
      </section>

      {/* HOW THE ECOSYSTEM WORKS */}
      <section className="ab-section ab-building">
        <div className="ab-inner">
          <div className="ab-center">
            <div className="hn-eyebrow" style={{ textAlign: 'center' }}>The ecosystem</div>
            <h2 className="ab-h2 ab-center">How the ecosystem works</h2>
          </div>
          <div className="ab-cards">
            {ecosystem.map(c => {
              const inner = (
                <>
                  <span className={`ab-card-badge ab-badge-${c.variant}`}>{c.badge}</span>
                  <div className="ab-card-title">{c.title}</div>
                  <p className="ab-card-desc">{c.desc}</p>
                  <span className={`ab-card-link ${c.link}`}>{c.cta}</span>
                </>
              )
              return c.external ? (
                <a key={c.title} href={c.href} className={`ab-card ab-card-${c.variant}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{inner}</a>
              ) : (
                <Link key={c.title} href={c.href} className={`ab-card ab-card-${c.variant}`} style={{ textDecoration: 'none' }}>{inner}</Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="ab-values">
        <div className="ab-inner">
          <div className="ab-center">
            <div className="hn-eyebrow" style={{ textAlign: 'center' }}>What we stand for</div>
            <h2 className="ab-h2 ab-center">Our values</h2>
          </div>
          <div className="ab-values-grid">
            {values.map(v => (
              <div key={v.title} className="ab-value-card">
                <div className="ab-value-icon">{v.icon}</div>
                <div className="ab-value-title">{v.title}</div>
                <div className="ab-value-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOOKING AHEAD */}
      <section className="ab-section">
        <div className="ab-ahead-inner">
          <div>
            <div className="hn-eyebrow">Looking ahead</div>
            <h2 className="ab-h2">This is just the beginning.</h2>
            <p className="ab-body">
              MNMuslim starts with services, events, and halal food — but the vision is bigger. Over
              time, we&apos;re building out a fuller map of Muslim life in Minnesota, from mosques and
              Islamic schools to the everyday resources families rely on.
            </p>
            <p className="ab-body" style={{ marginTop: '18px' }}>
              Every listing, event, and business added makes the community easier to find and stronger
              together.
            </p>
          </div>
          <div className="ab-roadmap">
            <div className="ab-roadmap-label"><span className="ab-dot ab-dot-live" /> Live now</div>
            <div className="ab-roadmap-live">
              <div className="ab-live-item"><span className="ab-check">✓</span> Muslim Services</div>
              <div className="ab-live-item"><span className="ab-check">✓</span> Community Events</div>
              <div className="ab-live-item"><span className="ab-check">✓</span> MNHalal — Halal Food</div>
            </div>
            <div className="ab-roadmap-label" style={{ marginTop: '24px' }}><span className="ab-dot ab-dot-soon" /> Coming soon</div>
            <div className="ab-soon-chips">
              <span className="ab-soon-chip">Mosques</span>
              <span className="ab-soon-chip">Islamic Schools</span>
              <span className="ab-soon-chip">Community Resources</span>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
