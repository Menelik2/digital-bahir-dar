export interface AdminMetrics {
  placesTotal: number
  placesPublished: number
  placesPending: number
  placesFeatured?: number
  placesDraft?: number
  placesArchived?: number
  reviewsTotal: number
  reviewsHidden: number
  reviewsPending?: number
  claimsPending: number
  businessesPending: number
  businessesApproved?: number
  businessesSuspended?: number
  reportsOpen: number
  usersApprox: number
}

export type PlaceModerationStatus = 'published' | 'pending' | 'hidden' | 'draft' | 'archived'

export type ProfileRole = 'visitor' | 'business_owner' | 'tour_guide' | 'moderator' | 'admin'

export interface AdminUserRow {
  id: string
  email: string | null
  full_name: string | null
  role: string
  created_at: string
  avatar_url?: string | null
}

export interface AdminActivityItem {
  id: string
  at: string
  action: string
  detail: string
}
