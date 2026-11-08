// Single source of truth for site navigation (nav + footer).
// Internal links render as <Link> in-place; entries marked `external: true`
// open in a new tab with rel="noopener noreferrer".

export const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Events',   href: '/events' },
  { label: 'MNHalal',  href: 'https://mnhalal.com', external: true },
]

// Official Instagram accounts. Used by the footer and the homepage structured data.
export const INSTAGRAM_EVENTS_URL = 'https://www.instagram.com/mnmuslimevents/'
export const INSTAGRAM_BUSINESSES_URL = 'https://www.instagram.com/mnmuslimbusinesses/'

// Footer link columns.
export const FOOTER_COLS = [
  {
    title: 'Products',
    links: [
      { label: 'Muslim Services', href: '/services' },
      { label: 'Events',          href: '/events' },
      { label: 'MNHalal',         href: 'https://mnhalal.com', external: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Get Discovered',
    links: [
      { label: 'List Your Service',  href: '/submit' },
      { label: 'Submit an Event',    href: '/submit-event' },
      { label: 'Add Halal Business', href: 'https://mnhalal.com/submit', external: true },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Muslim Events',     href: INSTAGRAM_EVENTS_URL,     external: true },
      { label: 'Muslim Businesses', href: INSTAGRAM_BUSINESSES_URL, external: true },
    ],
  },
]

export const FOOTER_LEGAL = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use',   href: '/terms' },
]
