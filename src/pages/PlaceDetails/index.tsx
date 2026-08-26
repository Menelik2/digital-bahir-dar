import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  MapPin, Phone, Globe, Navigation, BadgeCheck, Star, Clock,
  ArrowLeft, Loader2, AlertCircle, Share2,
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
import { useMemo, useState } from 'react'

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
          <Link to="/discover"><Button variant="outline">Discover</Button></Link>
          <Link to="/explore"><Button variant="outline">Explore</Button></Link>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    )
  }

  const isDemo = place.name.includes('(DEMO)') || place.id.startsWith('demo-')
  const isOsm = isOsmPlaceId(place.id)
  const name = place.name.replace(' (DEMO)', '')
  const cover = placeCoverImage(place)

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: name, url }) } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link copied')
    }
  }

  return (
    <div className="min-h-full">
      <div className="relative h-56 overflow-hidden bg-slate-800 sm:h-72">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
        <div className="absolute left-4 top-4 z-10">
          <Link to="/explore">
            <Button size="icon" variant="outline" className="rounded-full bg-white/90 backdrop-blur">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2">
            {place.category && (
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur">{place.category.name}</span>
            )}
            {place.verified && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-xs font-medium text-white">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            )}
            {isDemo && <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold text-amber-950">DEMO</span>}
            {isOsm && !isDemo && (
              <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-slate-800">OpenStreetMap</span>
            )}
          </div>
          <h1 className="mx-auto mt-2 max-w-3xl text-2xl font-bold text-white sm:text-3xl">{name}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {distanceM != null && (
            <span className="flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="h-4 w-4" />
              {formatDistance(distanceM)} · 🚶 {walkingMinutes(distanceM)} min · 🚗 {drivingMinutes(distanceM)} min
            </span>
          )}
          <div className="ml-auto flex flex-wrap gap-2">
            <Button size="sm" onClick={() => goDirections('walking')}>
              <Navigation className="h-4 w-4" /> Directions
            </Button>
            <Button size="sm" variant="outline" onClick={share}><Share2 className="h-4 w-4" /> Share</Button>
            {canSocial && <FavoriteButton placeId={place.id} size="sm" />}
          </div>
        </div>

        {isDemo && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            This is <strong>DEMO</strong> development data. Prices, phones, and hours are not real. Favorites and reviews require database places.
          </div>
        )}

        {(place.short_description || place.description) && (
          <section className="mb-8">
            <h2 className="mb-2 text-lg font-semibold">About</h2>
            <p className="whitespace-pre-line text-slate-600 dark:text-slate-300">{place.description || place.short_description}</p>
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
                {(place.hotel.minimum_price != null || place.hotel.maximum_price != null) && (
                  <p className="text-sm">
                    <span className="font-medium text-slate-500">Est. night: </span>
                    {place.hotel.minimum_price ?? '—'}–{place.hotel.maximum_price ?? '—'} {place.currency}
                  </p>
                )}
                {place.hotel.amenities?.length > 0 && (
                  <div className="sm:col-span-2">
                    <p className="mb-1 text-sm font-medium text-slate-500">Amenities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {place.hotel.amenities.map((a) => (
                        <span key={a} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs dark:bg-slate-800">{a}</span>
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
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-sm text-orange-800">{place.restaurant.cuisine_type}</span>
                )}
                {place.restaurant.traditional_food && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-800">Traditional Ethiopian</span>
                )}
                {place.restaurant.vegetarian && (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-800">Vegetarian options</span>
                )}
                {(place.restaurant.minimum_price != null || place.restaurant.maximum_price != null) && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800">
                    ~{place.restaurant.minimum_price ?? '—'}-{place.restaurant.maximum_price ?? '—'} {place.currency}/meal
                  </span>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {place.attraction && (
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">Attraction details</h2>
            <Card>
              <CardContent className="space-y-3 p-4 text-sm">
                {place.attraction.attraction_type && (
                  <p><span className="font-medium text-slate-500">Type:</span> <span className="capitalize">{place.attraction.attraction_type}</span></p>
                )}
                {place.attraction.recommended_duration && (
                  <p><span className="font-medium text-slate-500">Duration:</span> {place.attraction.recommended_duration}</p>
                )}
                {place.attraction.best_time_to_visit && (
                  <p><span className="font-medium text-slate-500">Best time:</span> {place.attraction.best_time_to_visit}</p>
                )}
                {place.attraction.entrance_fee != null && (
                  <p><span className="font-medium text-slate-500">Entry (est.):</span> {place.attraction.entrance_fee} {place.currency}</p>
                )}
                {place.attraction.historical_information && (
                  <p className="text-slate-600 dark:text-slate-300">{place.attraction.historical_information}</p>
                )}
                {place.attraction.safety_information && (
                  <p className="rounded-lg bg-amber-50 p-3 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                    <strong>Safety:</strong> {place.attraction.safety_information}
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {place.bank && (
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">Bank / ATM</h2>
            <Card>
              <CardContent className="flex flex-wrap gap-2 p-4">
                {place.bank.bank_name && <span className="font-medium">{place.bank.bank_name}</span>}
                {place.bank.has_atm && <span className="rounded-full bg-sky-50 px-3 py-1 text-sm">ATM</span>}
                {place.bank.has_foreign_exchange && <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm">Foreign exchange</span>}
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
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => setShowReviewForm(false)}>Cancel</Button>
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
          <Card>
            <CardContent className="space-y-3 p-4">
              {place.address && (
                <p className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />{place.address}
                </p>
              )}
              <p className="text-xs text-slate-400">{place.latitude.toFixed(5)}, {place.longitude.toFixed(5)}</p>
              {place.phone && (
                <a href={`tel:${place.phone}`} className="flex items-center gap-2 text-sm text-sky-600 hover:underline">
                  <Phone className="h-4 w-4" />{place.phone}
                </a>
              )}
              {place.website && (
                <a href={place.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-sky-600 hover:underline">
                  <Globe className="h-4 w-4" /> Website
                </a>
              )}
              <Button className="mt-2 w-full sm:w-auto" onClick={() => goDirections('driving')}>
                <Navigation className="h-4 w-4" /> Show route on map
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
