export const EVENT_CATEGORIES = [
  { id: 'lectures',    name: 'Lectures',     icon: '🎙️' },
  { id: 'iftars',      name: 'Iftars',       icon: '🌙' },
  { id: 'youth',       name: 'Youth',        icon: '🧑‍🎓' },
  { id: 'matrimonial', name: 'Matrimonial',  icon: '💍' },
  { id: 'fundraisers', name: 'Fundraisers',  icon: '🤝' },
  { id: 'community',   name: 'Community',    icon: '🕌' },
]

export function getEventCategoryById(id) {
  return EVENT_CATEGORIES.find((c) => c.id === id) || { name: 'Community', icon: '🕌' }
}

// Seeded from @mnmuslimevents on Instagram — update manually until the submit-event
// pipeline (Phase 2) replaces this with a live Supabase table.
export const EVENTS = [
  {
    id: 'quran-competition-closing-2026',
    title: '12th Annual Imam Al-Shatibi Quran Competition — Closing Ceremony',
    date: '2026-07-11',
    dateLabel: 'Saturday, July 11, 2026',
    time: '4:00 PM',
    venue: 'Minneapolis Convention Center',
    city: 'Minneapolis',
    category: 'community',
    link: 'https://www.instagram.com/p/DamKAHFRRR_/',
  },
  {
    id: 'surah-al-hujurat-code-of-conduct',
    title: 'Surah Al-Hujurat: The Code of Conduct',
    date: '2026-07-25',
    dateLabel: 'Saturday, July 25, 2026',
    time: '7:00 PM – 10:00 PM',
    venue: 'MAS-SMIC, 15400 S Robert Trail',
    city: 'Rosemount',
    category: 'lectures',
    link: 'https://www.instagram.com/p/DajqDUjRSsT/',
  },
  {
    id: 'career-exploration-evening',
    title: 'Career Exploration Evening',
    date: '2026-07-26',
    dateLabel: 'Sunday, July 26, 2026',
    time: '6:00 PM',
    venue: 'Al-Ihsan Islamic Center, 955 Minnehaha Ave W',
    city: 'Saint Paul',
    category: 'youth',
    link: 'https://www.instagram.com/p/DajqA7kRf3m/',
  },
  {
    id: 'majlis-al-sama-2026',
    title: 'Majlis Al-Sama (2nd Annual) — Hadith Dawrah',
    date: '2026-08-07',
    dateLabel: 'August 7–9, 2026',
    time: 'All day',
    venue: 'Al Itqaan Center, 12119 16th Ave S',
    city: 'Burnsville',
    category: 'lectures',
    link: 'https://www.instagram.com/p/Daows3TRoCl/',
  },
  {
    id: 'youth-career-fair-2026',
    title: 'Youth Career Fair',
    date: '2026-08-09',
    dateLabel: 'Sunday, August 9, 2026',
    time: '2:00 PM – 6:00 PM',
    venue: 'Diamondhead Education Center, 200 W Burnsville Pkwy',
    city: 'Burnsville',
    category: 'youth',
    link: 'https://www.instagram.com/p/DamJ9qOReV1/',
  },
]
