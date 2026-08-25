import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { StarRating } from './StarRating'
import { Button } from '@/components/ui/button'
import { useUpsertReview } from '@/hooks/useReviews'
import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router-dom'
import type { Review } from '@/types/social'
import { isPersistedPlaceId } from '@/utils/placeId'
import { useT } from '@/hooks/useT'
import { useAppStore } from '@/store'
import { usePlaceholders } from '@/i18n/formPlaceholders'

const schema = z.object({
  rating: z.number().min(1, 'Select a rating').max(5),
  title: z.string().max(120).optional(),
  comment: z.string().max(2000).optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  placeId: string
  existing?: Review | null
  onDone?: () => void
}

export function ReviewForm({ placeId, existing, onDone }: Props) {
  const t = useT()
  const language = useAppStore((s) => s.language)
  const placeholders = usePlaceholders(language)
  const { isAuthenticated } = useAuth()
  const canPersist = isPersistedPlaceId(placeId)
  const mut = useUpsertReview(placeId)
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: existing?.rating ?? 0,
      title: existing?.title ?? '',
      comment: existing?.comment ?? '',
    },
  })

  const rating = form.watch('rating')

  if (!canPersist) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 dark:border-slate-700">
        {language === 'am'
          ? 'ግምገማዎች ለተረጋገጡ የመረጃ ቋት ቦታዎች ብቻ ናቸው (DEMO ወይም OpenStreetMap አይደሉም)።'
          : 'Reviews are only available for verified database places (not DEMO or OpenStreetMap listings).'}
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
        <p className="mb-3 text-sm text-slate-500">{t.profile.signInPrompt}</p>
        <Link to="/auth">
          <Button size="sm">{t.nav.login}</Button>
        </Link>
      </div>
    )
  }

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await mut.mutateAsync({ rating: data.rating, title: data.title, comment: data.comment })
      onDone?.()
    } catch (e) {
      form.setError('root', { message: e instanceof Error ? e.message : t.common.error })
    }
  })

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">{t.place.writeReview}</label>
        <StarRating value={rating} onChange={(v) => form.setValue('rating', v, { shouldValidate: true })} size="lg" />
        {form.formState.errors.rating && (
          <p className="mt-1 text-xs text-red-500">{form.formState.errors.rating.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          {language === 'am' ? 'ርዕስ (አማራጭ)' : 'Title (optional)'}
        </label>
        <input
          {...form.register('title')}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
          placeholder={placeholders.reviewTitle}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          {language === 'am' ? 'አስተያየት (አማራጭ)' : 'Comment (optional)'}
        </label>
        <textarea
          {...form.register('comment')}
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
          placeholder={placeholders.reviewComment}
        />
      </div>
      {form.formState.errors.root && (
        <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
      )}
      <Button type="submit" disabled={mut.isPending} className="w-full sm:w-auto">
        {mut.isPending ? t.common.loading : t.place.writeReview}
      </Button>
    </form>
  )
}
