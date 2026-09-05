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
  /** Optional tags for filtering (e.g. cuisine, amenities) */
  tags?: string[] | null
  /** Aggregate rating when available (reviews / OSM) */
  rating?: number | null
  category?: Category
  distance_m?: number
  hotel?: HotelDetails | null
  restaurant?: RestaurantDetails | null
  attraction?: AttractionDetails | null
  bank?: BankDetails | null
}

export interface HotelDetails {
  id: string
  place_id: string
  star_rating: number | null
  minimum_price: number | null
  maximum_price: number | null
  amenities: string[]
  check_in: string | null
  check_out: string | null
}

export interface RestaurantDetails {
  id: string
  place_id: string
  cuisine_type: string | null
  minimum_price: number | null
  maximum_price: number | null
  vegetarian: boolean
  traditional_food: boolean
  delivery_available: boolean
  reservation_available: boolean
}

export interface AttractionDetails {
  id: string
  place_id: string
  attraction_type: string | null
  entrance_fee: number | null
  recommended_duration: string | null
  best_time_to_visit: string | null
  historical_information: string | null
  safety_information: string | null
  accessibility: string | null
}

export interface BankDetails {
  id: string
  place_id: string
  bank_name: string | null
  has_atm: boolean
  has_foreign_exchange: boolean
  is_atm_only: boolean
}

export interface TransportService {
  id: string
  place_id: string | null
  service_type: string
  provider_name: string
  phone: string | null
  estimated_price_min: number | null
  estimated_price_max: number | null
  currency: string
  price_label: string
  route_description: string | null
  verified: boolean
  last_price_updated_at: string | null
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

export type SortOption =
  | 'distance'
  | 'name'
  | 'featured'
  | 'price_asc'
  | 'price_desc'
  | 'nearby'
  | 'rating'
