// Standardized, user-facing Location filter for the Services directory.
//
// FILTERING ONLY. The stored `service_area` free text is never changed and is
// still shown verbatim on cards and detail pages — this layer only decides
// which standardized bucket(s) a listing belongs to for the dropdown filter.
// No Supabase/schema changes. Reusable later when the submit form gets a
// structured service-area input.

// The only options the dropdown ever shows (in this order).
export const SERVICE_AREAS = [
  { id: 'minneapolis', name: 'Minneapolis' },
  { id: 'stpaul',      name: 'St. Paul' },
  { id: 'metro',       name: 'Twin Cities Metro' },
  { id: 'greater',     name: 'Greater Minnesota' },
  { id: 'statewide',   name: 'Statewide' },
  { id: 'remote',      name: 'Virtual / Remote' },
]

// Keyword → standardized area. A value can earn several tags (e.g. a business
// in a metro suburb that also serves the whole state). Every rule whose
// keyword appears in the (lowercased) service_area contributes its tag.
//
// Notes on the trickier keywords:
//  - 'minnesota &' catches "Minnesota & Remote" (statewide) without catching
//    "Minneapolis, MN" (a city) or "Minnesota Metro" (the Twin Cities metro).
//  - 'nationwide' and 'serving minnesota' imply statewide reach.
//  - Minneapolis and St. Paul stay as their own filter options AND roll up into
//    Twin Cities Metro, so the metro rule also matches those city keywords.
//  - other metro-suburb names map to Twin Cities Metro; 'rochester' maps to
//    Greater Minnesota. Add new keywords here as new phrasings appear.
const RULES = [
  { id: 'remote',      keywords: ['remote', 'virtual'] },
  { id: 'statewide',   keywords: ['statewide', 'all of minnesota', 'nationwide', 'serving minnesota', 'minnesota &'] },
  { id: 'stpaul',      keywords: ['st. paul', 'saint paul', 'st paul'] },
  { id: 'minneapolis', keywords: ['minneapolis'] },
  { id: 'metro',       keywords: ['twin cities', 'metro', 'minneapolis', 'st. paul', 'saint paul', 'st paul', 'crystal', 'eagan', 'bloomington', 'burnsville', 'rosemount', 'roseville'] },
  { id: 'greater',     keywords: ['rochester', 'greater minnesota'] },
]

// The standardized area ids a free-text service_area belongs to.
// Unknown / unmappable values return [] — the listing still appears under
// "All Locations", it just won't match a specific location filter.
export function serviceAreaTags(serviceArea) {
  const s = String(serviceArea || '').toLowerCase()
  if (!s) return []
  const tags = []
  for (const rule of RULES) {
    if (rule.keywords.some(kw => s.includes(kw)) && !tags.includes(rule.id)) {
      tags.push(rule.id)
    }
  }
  return tags
}

// Whether a listing should show for the active location filter id.
// Empty filter id ("All Locations") always matches.
export function matchesServiceArea(serviceArea, filterId) {
  if (!filterId) return true
  return serviceAreaTags(serviceArea).includes(filterId)
}
