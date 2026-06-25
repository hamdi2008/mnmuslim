import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="footer-brand">
        <div className="footer-logo">
          <Image src="/logo.png" alt="MNMuslim" width={110} height={32} />
        </div>
        <div className="footer-text">
          Connecting Minnesota Muslims with trusted service providers
          <br />
          <span style={{ fontSize: '11px' }}>A community directory · Not affiliated with any organization</span>
        </div>
      </div>
      <div className="footer-links">
        <Link href="/browse">Browse</Link>
        <Link href="/submit">Get Listed</Link>
      </div>
    </footer>
  )
}
