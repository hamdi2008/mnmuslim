export const CATEGORIES = [
  { id: 'edu',      name: 'Education & Tutoring',    icon: '📚' },
  { id: 'tech',     name: 'Technology & Marketing',  icon: '🖥️' },
  { id: 'biz',      name: 'Business Services',       icon: '💼' },
  { id: 'photo',    name: 'Photography & Media',     icon: '📸' },
  { id: 'legal',    name: 'Legal Services',          icon: '⚖️' },
  { id: 'fin',      name: 'Financial Services',      icon: '💰' },
  { id: 'health',   name: 'Health & Wellness',       icon: '🌿' },
  { id: 'child',    name: 'Childcare & Family',      icon: '👨‍👩‍👧' },
  { id: 'home',     name: 'Home Services',           icon: '🏠' },
  { id: 'events',   name: 'Event Services',          icon: '🎉' },
  { id: 'fitness',  name: 'Fitness & Sports',        icon: '💪' },
  { id: 'creative', name: 'Creative Services',       icon: '🎨' },
  { id: 'security', name: 'Security Services',       icon: '🔒' },
  { id: 'retail',   name: 'Retail & Products',       icon: '🛍️' },
  { id: 'food',     name: 'Food & Catering',         icon: '🍰' },
  { id: 'other',    name: 'Other',                   icon: '✨' },
]

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { name: 'Other', icon: '✨' }
}
