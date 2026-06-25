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
        <link rel="icon" href="/ChatGPT Image Jun 25, 2026, 10_18_45 AM.png" />
      </Head>


      <div className="home-page">


        {/* ── NAV ── */}
        <nav className="hn-nav">
          <Link href="/" className="hn-logo">
            <img src="/ChatGPT Image Jun 25, 2026, 10_09_38 AM.png" alt="MNMuslim" className="hn-logo-img" />
          </Link>
          <div className="hn-pill">
            <Link href="/services" className="hn-nl">Services</Link>
            <a href="https://mnhalal.com" className="hn-nl" target="_blank" rel="noopener noreferrer">MNHalal</a>
            <Link href="/about" className="hn-nl">About</Link>
          </div>
