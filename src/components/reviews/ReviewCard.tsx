import { useState } from 'react'
import { Flag, Trash2 } from 'lucide-react'
import { StarRating } from './StarRating'
import { Button } from '@/components/ui/button'
import type { Review } from '@/types/social'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/hooks/useAuth'
import { useDeleteReview, useReportReview } from '@/hooks/useReviews'

interface Props {
  review: Review
  placeId: string
}

export function ReviewCard({ review, placeId }: Props) {
  const { user } = useAuth()
  const deleteMut = useDeleteReview(placeId)
  const reportMut = useReportReview()
  const [reporting, setReporting] = useState(false)
  const isOwner = user?.id === review.user_id
  const name = review.profile?.full_name || 'Visitor'
  const time = (() => {
    try {
      return formatDistanceToNow(new Date(review.created_at), { addSuffix: true })
    } catch {
      return ''
    }
  })()

  const handleReport = async () => {
    try {
      await reportMut.mutateAsync({ reviewId: review.id, reason: 'inappropriate' })
      setReporting(false)
      alert('Report submitted. Thank you.')
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not report')
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-slate-400">{time}</p>
          </div>
        </div>
        <StarRating value={review.rating} readonly size="sm" />
      </div>
      {review.title && <p className="mb-1 font-medium">{review.title}</p>}
      {review.comment && <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">{review.comment}</p>}
      <div className="mt-3 flex gap-2">
        {isOwner && (
          <Button variant="ghost" size="sm" className="text-red-600" disabled={deleteMut.isPending}
            onClick={() => { if (confirm('Delete your review?')) deleteMut.mutate(review.id) }}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        )}
        {!isOwner && user && (
          !reporting ? (
            <Button variant="ghost" size="sm" onClick={() => setReporting(true)}>
              <Flag className="h-3.5 w-3.5" /> Report
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setReporting(false)}>Cancel</Button>
              <Button size="sm" variant="destructive" disabled={reportMut.isPending} onClick={handleReport}>Confirm report</Button>
            </div>
          )
        )}
      </div>
    </div>
  )
}
