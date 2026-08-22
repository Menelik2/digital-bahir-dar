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
