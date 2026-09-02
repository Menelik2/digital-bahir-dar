import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Globe,
  Navigation,
  BadgeCheck,
  Star,
  Clock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Share2,
  Lightbulb,
  Footprints,
  Backpack,
  Landmark,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { usePlace } from '@/hooks/usePlaces'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useAppStore } from '@/store'
import { distanceMeters, formatDistance, walkingMinutes, drivingMinutes } from '@/utils/geo'
import { inAppDirectionsPath } from '@/services/routing'
import { FavoriteButton } from '@/components/places/FavoriteButton'
import { isOsmPlaceId } from '@/services/osmPlaces'
import { isPersistedPlaceId } from '@/utils/placeId'
import { StarRating } from '@/components/reviews/StarRating'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { useReviews, useMyReview, useRatingSummary } from '@/hooks/useReviews'
import { placeCoverImage, placeImageAlt } from '@/utils/placeImage'
import { PlaceGoogleEmbed } from '@/components/map/PlaceGoogleEmbed'
import { similarTourismPlaces } from '@/services/curatedTourism'
import { useMemo, useState } from 'react'

function parseInfoBlocks(text: string | null | undefined) {
  if (!text) return { highlights: '', tips: '', howTo: '', bring: '', nearby: '', rest: text || '' }
  const blocks = text.split(/\n\n+/)
  let highlights = ''
  let tips = ''
  let howTo = ''
  let bring = ''
  let nearby = ''
  const rest: string[] = []
  for (const b of blocks) {
    if (b.startsWith('Highlights:')) highlights = b.replace(/^Highlights:\s*/, '')
    else if (b.startsWith('Tips:')) tips = b.replace(/^Tips:\s*/, '')
    else if (b.startsWith('How to get there:')) howTo = b.replace(/^How to get there:\s*/, '')
    else if (b.startsWith('Bring:')) bring = b.replace(/^Bring:\s*/, '')
    else if (b.startsWith('Nearby:')) nearby = b.replace(/^Nearby:\s*/, '')
    else rest.push(b)
  }
  return { highlights, tips, howTo, bring, nearby, rest: rest.join('\n\n') }
}

export default function PlaceDetailsPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: place, isLoading, error, refetch } = usePlace(slug)
  const { location } = useAppStore()
  useGeolocation(true)
  const canSocial = isPersistedPlaceId(place?.id)
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews(canSocial ? place?.id : undefined)
  const { data: myReview } = useMyReview(canSocial ? place?.id : undefined)
  const { data: ratingSummary } = useRatingSummary(canSocial ? place?.id : undefined)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

  const userPos =
    location.permission === 'granted' && location.latitude != null && location.longitude != null
      ? { lat: location.latitude, lng: location.longitude }
      : null

  const distanceM = useMemo(() => {
    if (!place || !userPos) return null
    return distanceMeters(userPos.lat, userPos.lng, place.latitude, place.longitude)
  }, [place, userPos])

  const info = useMemo(
    () => parseInfoBlocks(place?.attraction?.historical_information),
    [place?.attraction?.historical_information]
  )

  const similar = useMemo(() => (slug ? similarTourismPlaces(slug, 4) : []), [slug])

  const goDirections = (mode: 'walking' | 'driving' = 'walking') => {
    if (!place) return
    navigate(inAppDirectionsPath(place, mode))
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-500">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-sky-500" /> Loading place…
      </div>
    )
  }

  if (error || !place) {
    const isOsmSlug = !!slug?.startsWith('osm-')
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-400" />
        <h1 className="mb-2 text-xl font-semibold">Place not found</h1>
        <p className="mb-6 text-slate-500">
          {isOsmSlug
            ? 'This OpenStreetMap listing is only available after loading Discover or a category list. Open Discover and try again.'
            : 'This place may not exist or is not published yet.'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/attractions">
            <Button variant="outline">Attractions</Button>
          </Link>
          <Link to="/discover">
            <Button variant="outline">Discover</Button>
          </Link>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    )
  }

  const isDemo = place.name.includes('(DEMO)') || place.id.startsWith('demo-')
  const isOsm = isOsmPlaceId(place.id)
  const name = place.name.replace(' (DEMO)', '').split(' · ')[0]
  const cover = placeCoverImage(place)

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: name, url })
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link copied')
    }
  }

  return (
    <div className="min-h-full bg-[#f2f2f7] dark:bg-black">
      <div className="relative h-56 overflow-hidden bg-slate-800 sm:h-72 lg:h-80">
        {!imgFailed ? (
          <img
            src={cover}
            alt={placeImageAlt(place)}
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-sky-600 to-teal-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
        <div className="absolute left-4 top-4 z-10">
          <button type="button" onClick={() => navigate(-1)}>
            <Button size="icon" variant="outline" className="rounded-full bg-white/90 backdrop-blur">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2">
            {place.category && (
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur">
                {place.category.name}
              </span>
            )}
            {place.verified && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-xs font-medium text-white">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            )}
            {isDemo && (
              <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold text-amber-950">
                DEMO
              </span>
            )}
            {isOsm && !isDemo && (
              <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                OpenStreetMap
              </span>
            )}
          </div>
          <h1 className="mx-auto mt-2 max-w-3xl text-2xl font-bold text-white sm:text-3xl">{name}</h1>
          {place.name.includes(' · ') && (
            <p className="mx-auto mt-1 max-w-3xl text-sm text-white/80">{place.name.split(' · ')[1]}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {distanceM != null && (
            <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
              <MapPin className="h-4 w-4" />
              {formatDistance(distanceM)} · 🚶 {walkingMinutes(distanceM)} min · 🚗{' '}
              {drivingMinutes(distanceM)} min
            </span>
          )}
          <div className="ml-auto flex flex-wrap gap-2">
            <Button size="sm" onClick={() => goDirections('walking')}>
              <Navigation className="h-4 w-4" /> Directions
            </Button>
            <Button size="sm" variant="outline" onClick={share}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
            {canSocial && <FavoriteButton placeId={place.id} size="sm" />}
          </div>
        </div>

        {isDemo && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            This is <strong>DEMO</strong> development data. Prices, phones, and hours are not real.
          </div>
        )}

        {(place.short_description || place.description) && (
          <section className="mb-8">
            <h2 className="mb-2 text-lg font-semibold">About</h2>
            <p className="whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-300">
              {place.description || place.short_description}
            </p>
          </section>
        )}

        {info.highlights && (
          <section className="mb-8">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Landmark className="h-5 w-5 text-emerald-600" /> Highlights
            </h2>
            <div className="flex flex-wrap gap-2">
              {info.highlights.split(' · ').map((h) => (
                <span
                  key={h}
                  className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
                >
                  {h.trim()}
                </span>
              ))}
            </div>
          </section>
        )}

        {place.attraction && (
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">Attraction details</h2>
            <Card className="border-black/[0.04] shadow-sm dark:border-white/[0.08]">
              <CardContent className="grid gap-3 p-4 text-sm sm:grid-cols-2">
                {place.attraction.attraction_type && (
                  <p>
                    <span className="font-medium text-slate-500">Type:</span>{' '}
                    <span className="capitalize">{place.attraction.attraction_type}</span>
                  </p>
                )}
                {place.attraction.recommended_duration && (
                  <p>
                    <span className="font-medium text-slate-500">Duration:</span>{' '}
                    {place.attraction.recommended_duration}
                  </p>
                )}
                {place.attraction.best_time_to_visit && (
                  <p>
                    <span className="font-medium text-slate-500">Best time:</span>{' '}
                    {place.attraction.best_time_to_visit}
                  </p>
                )}
                {(place.attraction.entrance_fee != null || place.entrance_fee != null) && (
                  <p>
                    <span className="font-medium text-slate-500">Entry (est.):</span>{' '}
                    {place.attraction.entrance_fee ?? place.entrance_fee ?? 0} {place.currency}
                  </p>
                )}
                {place.attraction.safety_information && (
                  <p className="sm:col-span-2 rounded-lg bg-amber-50 p-3 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                    <strong>Notes:</strong> {place.attraction.safety_information}
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {(info.howTo || place.attraction?.accessibility) && (
          <section className="mb-8">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Footprints className="h-5 w-5 text-sky-600" /> How to get there
            </h2>
            <Card className="border-black/[0.04] shadow-sm dark:border-white/[0.08]">
              <CardContent className="p-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {info.howTo || place.attraction?.accessibility}
              </CardContent>
            </Card>
          </section>
        )}

        {info.tips && (
          <section className="mb-8">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Lightbulb className="h-5 w-5 text-amber-500" /> Visitor tips
            </h2>
            <ul className="space-y-2">
              {info.tips.split(' · ').map((tip) => (
                <li
                  key={tip}
                  className="flex gap-2 rounded-xl bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm dark:bg-[#1c1c1e] dark:text-slate-200"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {tip.trim()}
                </li>
              ))}
            </ul>
          </section>
        )}

        {info.bring && (
          <section className="mb-8">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Backpack className="h-5 w-5 text-violet-600" /> What to bring
            </h2>
            <div className="flex flex-wrap gap-2">
              {info.bring.split(',').map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-[#1c1c1e]"
                >
                  {item.trim()}
                </span>
              ))}
            </div>
          </section>
        )}

        {place.hotel && (
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">Hotel details</h2>
            <Card>
              <CardContent className="grid gap-3 p-4 sm:grid-cols-2">
                {place.hotel.star_rating && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{place.hotel.star_rating} star</span>
                  </div>
                )}
                {place.hotel.check_in && (
                  <p className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" /> Check-in {place.hotel.check_in}
                    {place.hotel.check_out && ` · Check-out ${place.hotel.check_out}`}
                  </p>
                )}
                {place.hotel.amenities?.length > 0 && (
                  <div className="sm:col-span-2">
                    <div className="flex flex-wrap gap-1.5">
                      {place.hotel.amenities.map((a) => (
                        <span key={a} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs dark:bg-slate-800">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {place.restaurant && (
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">Restaurant details</h2>
            <Card>
              <CardContent className="flex flex-wrap gap-2 p-4">
                {place.restaurant.cuisine_type && (
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-sm text-orange-800">
                    {place.restaurant.cuisine_type}
                  </span>
                )}
                {place.restaurant.traditional_food && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-800">
                    Traditional Ethiopian
                  </span>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {canSocial && (
          <section className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Reviews
                {ratingSummary && ratingSummary.count > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    {ratingSummary.avg}★ · {ratingSummary.count}
                  </span>
                )}
              </h2>
              {ratingSummary && ratingSummary.count > 0 && (
                <StarRating value={Math.round(ratingSummary.avg)} readonly size="sm" />
              )}
            </div>
            {!showReviewForm && (
              <Button variant="outline" size="sm" className="mb-4" onClick={() => setShowReviewForm(true)}>
                {myReview ? 'Edit your review' : 'Write a review'}
              </Button>
            )}
            {showReviewForm && (
              <div className="mb-4">
                <ReviewForm placeId={place.id} existing={myReview} onDone={() => setShowReviewForm(false)} />
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </Button>
              </div>
            )}
            {reviewsLoading && <p className="text-sm text-slate-500">Loading reviews…</p>}
            {!reviewsLoading && reviews.length === 0 && !showReviewForm && (
              <p className="text-sm text-slate-500">No reviews yet. Be the first to share your experience.</p>
            )}
            <div className="space-y-3">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} placeId={place.id} />
              ))}
            </div>
          </section>
        )}

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Location & contact</h2>
          <Card className="border-black/[0.04] shadow-sm dark:border-white/[0.08]">
            <CardContent className="space-y-3 p-4">
              {place.address && (
                <p className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  {place.address}
                </p>
              )}
              <p className="text-xs text-slate-400">
                {place.latitude.toFixed(5)}, {place.longitude.toFixed(5)}
              </p>
              {place.phone && (
                <a href={`tel:${place.phone}`} className="flex items-center gap-2 text-sm text-sky-600 hover:underline">
                  <Phone className="h-4 w-4" />
                  {place.phone}
                </a>
              )}
              {place.website && (
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-sky-600 hover:underline"
                >
                  <Globe className="h-4 w-4" /> Website
                </a>
              )}
              <Button className="mt-2 w-full sm:w-auto" onClick={() => goDirections('driving')}>
                <Navigation className="h-4 w-4" /> Show route on map
              </Button>
              <div className="pt-2">
                <PlaceGoogleEmbed lat={place.latitude} lng={place.longitude} name={name} />
              </div>
            </CardContent>
          </Card>
        </section>

        {similar.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-lg font-semibold">Similar places</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {similar.map((p) => (
                <Link
                  key={p.id}
                  to={`/places/${p.slug}`}
                  className="rounded-2xl border border-black/[0.04] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/[0.08] dark:bg-[#1c1c1e]"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                    {p.attraction?.attraction_type || p.category?.name}
                  </p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {p.name.split(' · ')[0]}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{p.short_description}</p>
                </Link>
              ))}
            </div>
            <Link
              to="/attractions"
              className="mt-4 inline-block text-sm font-semibold text-[#078930] hover:underline dark:text-[#30d158]"
            >
              See all attractions →
            </Link>
          </section>
        )}
      </div>
    </div>
  )
}
