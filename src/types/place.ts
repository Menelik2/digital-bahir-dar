export type PlaceStatus = 'draft' | 'pending' | 'published' | 'archived'

export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  sort_order: number
}

export interface Place {
  id: string
  name: string
  slug: string
  category_id: string
  description: string | null
  short_description: string | null
  address: string | null
  latitude: number
  longitude: number
  phone: string | null
  email: string | null
  website: string | null
  price_level: number | null
  entrance_fee: number | null
  currency: string
  verified: boolean
  featured: boolean
  status: PlaceStatus
  created_at: string
  updated_at: string
  category?: Category
  distance_m?: number
}

export interface PlaceWithDistance extends Place {
  distance_m: number
}

export type MapFilter =
  | 'near_me'
  | 'open_now'
  | 'verified'
  | 'highly_rated'
  | 'cheap'
  | 'free'
  | 'family'
  | 'accessible'
  | 'popular'

export type CategorySlug =
  | 'hotel'
  | 'restaurant'
  | 'cafe'
  | 'attraction'
  | 'historical'
  | 'religious'
  | 'museum'
  | 'park'
  | 'bank'
  | 'atm'
  | 'taxi'
  | 'transport'
  | 'hospital'
  | 'pharmacy'
  | 'shopping'
  | 'market'
  | 'entertainment'
  | 'event'
  | 'government'
  | 'emergency'
