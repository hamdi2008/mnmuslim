import Link from 'next/link'
import { FOOTER_COLS, FOOTER_LEGAL } from '../lib/nav'

// Shared site footer. Reuses the hn-footer-* styles; link columns are
// config-driven from lib/nav. Internal links stay in-tab.
export default function SiteFooter() {
  const renderLink = (item) =>
    item.external ? (
      <a key={item.label} href={item.href} className="hn-fl" target="_blank" rel="noopener noreferrer">{item.label}</a>
    ) : (
      <Link key={item.label} href={item.href} className="hn-fl">{item.label}</Link>
    )

  return (
    <footer className="hn-footer">
      <div className="hn-footer-inner">
        <div className="hn-footer-top">
          <div className="hn-footer-brand">
            <Link href="/" className="hn-footer-logo">
              <img src="/logo-footer.png" alt="MNMuslim" className="hn-footer-logo-img" />
            </Link>
            <p className="hn-footer-tag">The digital home for Muslims in Minnesota.</p>
            <p className="hn-footer-mission">Built by a Minnesota Muslim for the Minnesota Muslim community.</p>
          </div>
          <div className="hn-footer-cols">
            {FOOTER_COLS.map(col => (
              <div key={col.title} className="hn-footer-col">
                <div className="hn-footer-col-title">{col.title}</div>
                {col.links.map(renderLink)}
              </div>
            ))}
          </div>
        </div>
        <div className="hn-footer-bottom">
          <div>
            <span className="hn-fb-copy">© {new Date().getFullYear()} MNMuslim</span>
            <span className="hn-fb-copy hn-fb-copy-sub">
              A product by <a href="https://byhamdi.co" className="hn-fb-byhamdi" target="_blank" rel="noopener noreferrer">By Hamdi</a>
            </span>
          </div>
          <div className="hn-fb-legal">
            {FOOTER_LEGAL.map(item => (
              <Link key={item.label} href={item.href} className="hn-fb-link">{item.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
