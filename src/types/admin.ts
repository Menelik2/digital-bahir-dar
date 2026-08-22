export interface AdminMetrics {
  placesTotal: number
  placesPublished: number
  placesPending: number
  reviewsTotal: number
  reviewsHidden: number
  claimsPending: number
  businessesPending: number
  reportsOpen: number
  usersApprox: number
}

export type PlaceModerationStatus = 'published' | 'pending' | 'hidden' | 'draft'

export type ProfileRole = 'visitor' | 'user' | 'business' | 'moderator' | 'admin'

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
