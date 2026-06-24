import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found – MNMuslim.com</title>
      </Head>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--green)', fontSize: '28px', marginBottom: '12px' }}>
          Page not found
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          The page you're looking for doesn't exist or was moved.
        </p>
        <Link href="/" className="btn-green">
          Back to Home
        </Link>
      </div>
      <Footer />
    </>
  )
}
