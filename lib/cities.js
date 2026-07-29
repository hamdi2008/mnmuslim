// The `listings` table has no `city` column — coverage lives in the free-text
// `service_area` ("Minneapolis, St. Paul & Remote", "Minnesota Statewide"), so
// the /services City filter is derived from that text. /events has a real
// `city` column and doesn't need any of this.

const METRO_CITIES = [
  'Andover', 'Anoka', 'Apple Valley', 'Blaine', 'Bloomington', 'Brooklyn Center',
  'Brooklyn Park', 'Burnsville', 'Champlin', 'Chanhassen', 'Chaska',
  'Columbia Heights', 'Coon Rapids', 'Cottage Grove', 'Crystal', 'Eagan',
  'Eden Prairie', 'Edina', 'Elk River', 'Farmington', 'Forest Lake', 'Fridley',
  'Golden Valley', 'Hastings', 'Hopkins', 'Inver Grove Heights', 'Lakeville',
  'Maple Grove', 'Maplewood', 'Mendota Heights', 'Minneapolis', 'Minnetonka',
  'New Brighton', 'New Hope', 'Oakdale', 'Plymouth', 'Prior Lake', 'Ramsey',
  'Richfield', 'Robbinsdale', 'Rogers', 'Rosemount', 'Roseville', 'Savage',
  'Shakopee', 'Shoreview', 'South St. Paul', 'St. Louis Park', 'St. Michael',
  'St. Paul', 'Stillwater', 'Wayzata', 'West St. Paul', 'White Bear Lake',
  'Woodbury',
]

const GREATER_MN_CITIES = [
  'Albert Lea', 'Alexandria', 'Austin', 'Bemidji', 'Brainerd', 'Duluth',
  'Faribault', 'Fergus Falls', 'Hibbing', 'Hutchinson', 'Mankato', 'Marshall',
  'Moorhead', 'New Ulm', 'Northfield', 'Owatonna', 'Red Wing', 'Rochester',
  'Sartell', 'Sauk Rapids', 'St. Cloud', 'St. Peter', 'Waite Park', 'Willmar',
  'Winona', 'Worthington',
]

export const MN_CITIES = [...METRO_CITIES, ...GREATER_MN_CITIES]

// "Saint Paul" / "St Paul" / "St. Paul" all collapse to "st paul".
function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/\bsaint\b/g, 'st')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

// normalize() leaves only [a-z0-9 ], so the city is safe to inline in a regex.
function mentions(normalizedArea, city) {
  return new RegExp(`(^| )${normalize(city)}( |$)`).test(normalizedArea)
}

const SERVES_STATEWIDE = /\b(statewide|nationwide|virtual|remote|online)\b|all of minnesota|entire state/
const SERVES_METRO = /twin cities|metro/

// Cities named in a service area, most specific only — "West St. Paul" also
// matches "St. Paul", and only the former should show up.
export function extractCities(area) {
  const hay = normalize(area)
  if (!hay) return []
  const hits = MN_CITIES.filter(c => mentions(hay, c))
  return hits.filter(c => !hits.some(o => o !== c && normalize(o).includes(normalize(c))))
}

// A provider matches a city if it names it, serves the whole state, or serves
// the metro and the city is in it — a statewide provider shouldn't disappear
// when someone filters to Minneapolis.
export function matchesCity(area, city) {
  if (!city) return true
  const hay = normalize(area)
  if (mentions(hay, city)) return true
  if (SERVES_STATEWIDE.test(hay)) return true
  if (SERVES_METRO.test(hay) && METRO_CITIES.includes(city)) return true
  return false
}

// Dropdown options — every city actually represented in the directory.
export function cityOptions(areas) {
  const set = new Set()
  for (const area of areas) for (const c of extractCities(area)) set.add(c)
  return [...set].sort((a, b) => a.localeCompare(b))
}
