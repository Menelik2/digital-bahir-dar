export type BusinessStatus = 'pending' | 'approved' | 'suspended'
export type ClaimStatus = 'pending' | 'approved' | 'rejected'

export interface BusinessProfile {
  id: string
  user_id: string
  business_name: string
  contact_name: string | null
  phone: string | null
  email: string | null
  website: string | null
  description: string | null
  city: string | null
  status: BusinessStatus
  created_at: string
  updated_at: string
}

export interface PlaceClaim {
  id: string
  place_id: string
  user_id: string
  business_profile_id: string | null
  message: string | null
  status: ClaimStatus
  reviewed_at: string | null
  created_at: string
  place?: {
    id: string
    name: string
    slug: string
    address: string | null
  } | null
}

export interface BusinessProfileInput {
  business_name: string
  contact_name?: string
  phone?: string
  email?: string
  website?: string
  description?: string
}

export interface BusinessAnalytics {
  ownedPlaces: number
  pendingClaims: number
  approvedClaims: number
  profileStatus: BusinessStatus | null
  /** Published owned listings */
  publishedPlaces?: number
  /** Sum of published reviews on owned places */
  totalReviews?: number
  /** Average rating across owned places (1–5), null if none */
  avgRating?: number | null
  /** Verified owned places */
  verifiedPlaces?: number
}
