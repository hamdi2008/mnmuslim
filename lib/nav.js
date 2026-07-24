// Single source of truth for site navigation (nav + footer).
// Internal links render as <Link> in-place; entries marked `external: true`
// open in a new tab with rel="noopener noreferrer".

export const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Events',   href: '/events' },
  { label: 'MNHalal',  href: 'https://mnhalal.com', external: true },
]

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
      { label: 'Instagram', href: 'https://www.instagram.com/mnmuslimevents/', external: true },
    ],
  },
]

export const FOOTER_LEGAL = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use',   href: '/terms' },
]
