export interface Review {
  id: string
  place_id: string
  user_id: string
  rating: number
  title: string | null
  comment: string | null
  status: 'published' | 'hidden' | 'pending'
  created_at: string
  updated_at: string
  profile?: {
    full_name: string | null
    avatar_url: string | null
  }
}

export interface Favorite {
  id: string
  user_id: string
  place_id: string
  created_at: string
  place?: import('./place').Place
}

export interface ReviewReport {
  id: string
  review_id: string
  reporter_id: string
  reason: string
  details: string | null
  status: 'open' | 'resolved' | 'dismissed'
  created_at: string
}

export interface ReviewInput {
  place_id: string
  rating: number
  title?: string
  comment?: string
}
