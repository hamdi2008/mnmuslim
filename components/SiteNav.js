import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NAV_LINKS } from '../lib/nav'

// Shared site navigation. Reuses the hn-* nav styles. Owns its own scroll-glass
// and mobile-menu state so every page gets identical behavior for free.
// Pass `solid` on light-background pages (e.g. detail pages) so the nav keeps a
// dark background instead of being transparent over light content.
export default function SiteNav({ solid = false }) {
  const router = useRouter()
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const renderLink = (item, className, onClick) =>
    item.external ? (
      <a key={item.label} href={item.href} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {item.label}
      </a>
    ) : (
      <Link key={item.label} href={item.href} className={className} onClick={onClick}>
        {item.label}
      </Link>
    )

  return (
    <>
      <nav className={`hn-nav${scrolled ? ' scrolled' : ''}`} style={solid ? { background: '#071423', borderBottom: '1px solid rgba(255,255,255,0.07)' } : undefined}>
        <Link href="/" className="hn-logo">
          <img src="/logo.png" alt="MNMuslim" className="hn-logo-img" />
        </Link>
        <div className="hn-pill">
          {NAV_LINKS.map(item =>
            renderLink(
              item,
              `hn-nl${!item.external && router.pathname === item.href ? ' hn-nl-active' : ''}`
            )
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/contact" className="hn-contact">Contact <span aria-hidden="true">→</span></Link>
          <button className="hn-mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
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
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {[...NAV_LINKS, { label: 'Contact', href: '/contact' }].map(item => {
              const style = { color: '#fff', fontSize: '32px', fontWeight: '800', textDecoration: 'none', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', letterSpacing: '-1px', display: 'block' }
              return item.external ? (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} style={style}>{item.label}</a>
              ) : (
                <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} style={style}>{item.label}</Link>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
