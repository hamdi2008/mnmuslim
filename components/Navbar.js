import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Navbar() {
  const router = useRouter()

  return (
    <nav className="nav">
      <Link href="/" className="nav-brand">
        MN<span>Muslim</span>.com
      </Link>
      <div className="nav-links">
        <Link href="/" className={`nav-link${router.pathname === '/' ? ' active' : ''}`}>
          Home
        </Link>
        <Link href="/browse" className={`nav-link${router.pathname === '/browse' ? ' active' : ''}`}>
          Browse
        </Link>
        <Link href="/submit" className="nav-cta">
          Get Listed
        </Link>
      </div>
    </nav>
  )
}
