import type { Place } from '@/types/place'

/**
 * Cover images for Bahir Dar places.
 * Prefer Wikimedia Commons (stable hotlink) + category fallbacks.
 * Not all listings have unique photos — category art is used then.
 */

const BY_SLUG: Record<string, string> = {
  // Landmarks
  'lake-tana':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Lake_Tana_from_the_air_%28Ethiopia%29.jpg/640px-Lake_Tana_from_the_air_%28Ethiopia%29.jpg',
  'blue-nile-falls-tis-issat':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Blue_Nile_Falls.jpg/640px-Blue_Nile_Falls.jpg',
  'blue-nile-falls-demo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Blue_Nile_Falls.jpg/640px-Blue_Nile_Falls.jpg',
  'bezawit-palace-viewpoint':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Bahir_Dar_Ethiopia.jpg/640px-Bahir_Dar_Ethiopia.jpg',
  'ura-kidane-mehret':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ura_Kidane_Mehret.jpg/640px-Ura_Kidane_Mehret.jpg',
  'debre-maryam-monastery':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Lake_Tana_from_the_air_%28Ethiopia%29.jpg/640px-Lake_Tana_from_the_air_%28Ethiopia%29.jpg',
  'azwa-maryam-monastery':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ura_Kidane_Mehret.jpg/640px-Ura_Kidane_Mehret.jpg',
  'bahir-dar-university':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Bahir_Dar_Ethiopia.jpg/640px-Bahir_Dar_Ethiopia.jpg',
  'martyrs-memorial-bahir-dar':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Bahir_Dar_Ethiopia.jpg/640px-Bahir_Dar_Ethiopia.jpg',
  'blue-nile-bridge-outlet':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Lake_Tana_from_the_air_%28Ethiopia%29.jpg/640px-Lake_Tana_from_the_air_%28Ethiopia%29.jpg',
  'bahir-dar-central-market':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Bahir_Dar_Ethiopia.jpg/640px-Bahir_Dar_Ethiopia.jpg',
  'lake-tana-boat-pier':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Lake_Tana_from_the_air_%28Ethiopia%29.jpg/640px-Lake_Tana_from_the_air_%28Ethiopia%29.jpg',
  'bahir-dar-bus-station':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Bahir_Dar_Ethiopia.jpg/640px-Bahir_Dar_Ethiopia.jpg',
  // Airport — city aerial (no reliable free airport photo); avoids broken Unsplash ids
  'bahir-dar-airport-bjr':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Bahir_Dar_Ethiopia.jpg/640px-Bahir_Dar_Ethiopia.jpg',
  'felege-hiwot-hospital':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Bahir_Dar_Ethiopia.jpg/640px-Bahir_Dar_Ethiopia.jpg',
  'bahir-dar-center':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Bahir_Dar_Ethiopia.jpg/640px-Bahir_Dar_Ethiopia.jpg',
  'bahir-dar-center-demo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Bahir_Dar_Ethiopia.jpg/640px-Bahir_Dar_Ethiopia.jpg',
  'lake-tana-demo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Lake_Tana_from_the_air_%28Ethiopia%29.jpg/640px-Lake_Tana_from_the_air_%28Ethiopia%29.jpg',
}

/** Category fallbacks — prefer Wikimedia; Unsplash only when stable */
const BY_CATEGORY: Record<string, string> = {
  hotel:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=640&q=80&auto=format&fit=crop',
  restaurant:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=640&q=80&auto=format&fit=crop',
  cafe:
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=640&q=80&auto=format&fit=crop',
  attraction:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Lake_Tana_from_the_air_%28Ethiopia%29.jpg/640px-Lake_Tana_from_the_air_%28Ethiopia%29.jpg',
  bank:
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=640&q=80&auto=format&fit=crop',
  atm:
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=640&q=80&auto=format&fit=crop',
  // Fixed: previous Unsplash id 1544620341-11c8b6b5b3b3 was invalid → solid gradient on cards
  transport:
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=640&q=80&auto=format&fit=crop',
  hospital:
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=640&q=80&auto=format&fit=crop',
  pharmacy:
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=640&q=80&auto=format&fit=crop',
  shopping:
    'https://images.unsplash.com/photo-1555529902-5261145633bf?w=640&q=80&auto=format&fit=crop',
  emergency:
    'https://images.unsplash.com/photo-1516574187841-cb9cc3604600?w=640&q=80&auto=format&fit=crop',
}

const DEFAULT_COVER =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Bahir_Dar_Ethiopia.jpg/640px-Bahir_Dar_Ethiopia.jpg'

export function placeCoverImage(place: {
  slug?: string
  category?: { slug?: string } | null
  category_id?: string
  name?: string
}): string {
  if (place.slug && BY_SLUG[place.slug]) return BY_SLUG[place.slug]

  const cat =
    place.category?.slug ||
    (typeof place.category_id === 'string' && place.category_id.includes('-')
      ? place.category_id.replace(/^demo-/, '')
      : undefined)

  if (cat && BY_CATEGORY[cat]) return BY_CATEGORY[cat]

  // Heuristic from name
  const n = (place.name || '').toLowerCase()
  if (n.includes('hotel') || n.includes('resort') || n.includes('guesthouse')) return BY_CATEGORY.hotel
  if (n.includes('restaurant') || n.includes('kitchen') || n.includes('grill'))
    return BY_CATEGORY.restaurant
  if (n.includes('cafe') || n.includes('coffee')) return BY_CATEGORY.cafe
  if (n.includes('bank') || n.includes('atm')) return BY_CATEGORY.bank
  if (n.includes('hospital') || n.includes('clinic')) return BY_CATEGORY.hospital
  if (
    n.includes('airport') ||
    n.includes('bus') ||
    n.includes('boat') ||
    n.includes('taxi') ||
    n.includes('pier')
  )
    return BY_CATEGORY.transport

  return DEFAULT_COVER
}

export function placeImageAlt(place: Place | { name: string }): string {
  return `${place.name.replace(' (DEMO)', '')} — Bahir Dar`
}
