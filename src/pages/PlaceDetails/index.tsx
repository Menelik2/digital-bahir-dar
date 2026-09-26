import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Globe,
  Navigation,
  Star,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Share2,
  ExternalLink,
  Wifi,
  Car,
  Utensils,
  Waves,
  Clock,
  BadgeCheck,
  Hotel,
  Coffee,
  Dumbbell,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { usePlace, usePlaces } from '@/hooks/usePlaces'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useAppStore } from '@/store'
import { distanceMeters, formatDistance, walkingMinutes } from '@/utils/geo'
import { inAppDirectionsPath } from '@/services/routing'
import { FavoriteButton } from '@/components/places/FavoriteButton'
import { isPersistedPlaceId } from '@/utils/placeId'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { useReviews, useMyReview, useRatingSummary } from '@/hooks/useReviews'
import { placeCoverImage, placeImageAlt } from '@/utils/placeImage'
import { PlaceCoverImage } from '@/components/places/PlaceCoverImage'
import {
  placeName,
  placeNameSecondary,
  placeDescription,
  placeShortDescription,
  categoryLabel,
} from '@/utils/placeLocale'
import { useLang } from '@/hooks/useT'
import { PlaceGoogleEmbed } from '@/components/map/PlaceGoogleEmbed'
import { CURATED_TOURISM_PLACES } from '@/services/curatedTourism'
import { CURATED_HOTELS } from '@/services/curatedHotels'
import { findSimilarPlaces, getCuratedPlaces } from '@/services/places'
import { useMemo, useState } from 'react'
import {
  resolveAmenities,
  formatEtbRange,
  googleMapsPlaceUrl,
  sharePlace,
  priceLevelDots,
} from '@/utils/placePro'

function amenityIcon(label: string) {
  const l = label.toLowerCase()
  if (l.includes('wifi') || l.includes('wi-fi') || l.includes('wi‑fi')) return Wifi
  if (l.includes('park') || l.includes('car') || l.includes('shuttle') || l.includes('airport')) return Car
  if (l.includes('restaurant') || l.includes('breakfast') || l.includes('dining') || l.includes('food'))
    return Utensils
  if (l.includes('spa') || l.includes('massage') || l.includes('wellness')) return Sparkles
  if (l.includes('pool') || l.includes('lake') || l.includes('boat')) return Waves
  if (l.includes('fitness') || l.includes('gym')) return Dumbbell
  if (l.includes('check') || l.includes('24-hour') || l.includes('security')) return Clock
  if (l.includes('bar') || l.includes('coffee')) return Coffee
  return Hotel
}

function popularForChips(place: {
  category?: { slug?: string } | null
  hotel?: { amenities?: string[] | null; star_rating?: number | null } | null
  name: string
}): string[] {
  const slug = place.category?.slug
  const chips: string[] = []
  if (slug === 'hotel') {
    chips.push('Stay', 'Lake views')
    const am = (place.hotel?.amenities ?? []).join(' ').toLowerCase()
    if (am.includes('breakfast')) chips.push('Breakfast')
    if (am.includes('spa')) chips.push('Spa')
    if (am.includes('conference') || am.includes('business')) chips.push('Meetings')
    if (place.name.toLowerCase().includes('resort') || am.includes('boat')) chips.push('Lake day trips')
  } else if (slug === 'restaurant' || slug === 'cafe') {
    chips.push('Dining', 'Local food')
  } else if (slug === 'attraction') {
    chips.push('Sightseeing', 'Photos')
  }
  return chips.slice(0, 5)
}

export default function PlaceDetailsPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { language, isAm } = useLang()
  const { data: place, isLoading, error } = usePlace(slug)
  const { location } = useAppStore()
  useGeolocation(true)
  const canSocial = isPersistedPlaceId(place?.id)
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews(canSocial ? place?.id : undefined)
  const { data: myReview } = useMyReview(canSocial ? place?.id : undefined)
  const { data: ratingSummary } = useRatingSummary(canSocial ? place?.id : undefined)
  const [shareMsg, setShareMsg] = useState<string | null>(null)

  const userPos =
    location.latitude != null && location.longitude != null
      ? { lat: location.latitude, lng: location.longitude }
      : null

  const distM = useMemo(() => {
    if (!place || !userPos) return null
    return distanceMeters(userPos.lat, userPos.lng, place.latitude, place.longitude)
  }, [place, userPos])

  const { data: catalogPlaces = [] } = usePlaces()

  const similar = useMemo(() => {
    if (!place) return []
    const poolMap = new Map<string, (typeof catalogPlaces)[number]>()
    for (const p of [...catalogPlaces, ...getCuratedPlaces(), ...CURATED_TOURISM_PLACES, ...CURATED_HOTELS]) {
      if (!p?.id && !p?.slug) continue
      const key = (p.slug || p.id).toLowerCase()
      if (!poolMap.has(key)) poolMap.set(key, p)
    }
    return findSimilarPlaces(place, [...poolMap.values()], 6)
  }, [place, catalogPlaces])

  const amenities = useMemo(() => (place ? resolveAmenities(place) : []), [place])
  const popularChips = useMemo(() => (place ? popularForChips(place) : []), [place])
  const priceRange = place
    ? formatEtbRange(place.hotel?.minimum_price, place.hotel?.maximum_price)
    : null

  const goDirections = (mode: 'walking' | 'driving' = 'walking') => {
    if (!place) return
    navigate(inAppDirectionsPath(place, mode))
  }

  const onShare = async () => {
    if (!place) return
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const result = await sharePlace({
      title: placeName(place, language),
      text: placeShortDescription(place, language) || place.address || undefined,
      url,
    })
    setShareMsg(
      result === 'shared'
        ? isAm
          ? 'ተጋርቷል'
          : 'Shared'
        : result === 'copied'
          ? isAm
            ? 'ሊንክ ተቀድቷል'
            : 'Link copied'
          : null
    )
    if (result !== 'failed') window.setTimeout(() => setShareMsg(null), 2500)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-500">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-[#078930]" />{' '}
        {isAm ? 'ቦታ በመጫን…' : 'Loading place…'}
      </div>
    )
  }

  if (error || !place) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <p className="font-semibold">{isAm ? 'ቦታ አልተገኘም' : 'Place not found'}</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> {isAm ? 'ተመለስ' : 'Back'}
        </Button>
      </div>
    )
  }

  const name = placeName(place, language)
  const secondary = placeNameSecondary(place, language)
  const description = placeDescription(place, language)
  const category = categoryLabel(place.category, language)
  const cover = placeCoverImage(place)
  const avgRating =
    ratingSummary?.avg ??
    place.rating ??
    (place.hotel?.star_rating ? place.hotel.star_rating : null)
  const reviewCount = ratingSummary?.count ?? 0
  const stars = place.hotel?.star_rating
  const mapsUrl = googleMapsPlaceUrl(place.latitude, place.longitude, name)
  const isHotel = place.category?.slug === 'hotel'

  return (
    <div className="min-h-full bg-[#f2f2f7] pb-24 dark:bg-black">
      <div className="relative h-56 w-full overflow-hidden sm:h-72 lg:h-80 xl:h-96">
        {cover ? (
          <PlaceCoverImage place={place} className="h-full w-full object-cover" loading="eager" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-sky-400 to-teal-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="absolute right-3 top-3">
          <FavoriteButton placeId={place.id} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-6">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            {category && (
              <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur">
                {category}
              </span>
            )}
            {place.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[11px] font-semibold">
                <BadgeCheck className="h-3 w-3" /> {isAm ? 'የተረጋገጠ' : 'Verified'}
              </span>
            )}
            {place.featured && (
              <span className="rounded-full bg-amber-500/90 px-2 py-0.5 text-[11px] font-semibold">
                {isAm ? 'ተለይቶ' : 'Featured'}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{name}</h1>
          {secondary && <p className="text-sm text-white/85">{secondary}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/95">
            {avgRating != null && Number.isFinite(avgRating) && (
              <span className="inline-flex items-center gap-1 font-semibold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {Number(avgRating).toFixed(1)}
                {reviewCount > 0 && (
                  <span className="font-normal text-white/75">
                    ({reviewCount} {isAm ? 'ግምገማ' : 'reviews'})
                  </span>
                )}
              </span>
            )}
            {stars != null && (
              <span className="text-white/80">
                · {stars}★ {isAm ? 'ሆቴል' : 'hotel'}
              </span>
            )}
            {place.price_level != null && place.price_level > 0 && (
              <span className="tracking-tighter text-white/80" title="Price level">
                · {priceLevelDots(place.price_level)}
              </span>
            )}
            {distM != null && (
              <span className="text-white/80">
                · {formatDistance(distM)} · 🚶 {walkingMinutes(distM)} {isAm ? 'ደቂቃ' : 'min'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:max-w-5xl lg:px-8 lg:py-8">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => goDirections('walking')}
            className="inline-flex shrink-0 flex-col items-center gap-1 rounded-2xl bg-white px-4 py-2.5 text-[11px] font-semibold text-[#078930] shadow-sm ring-1 ring-black/[0.06] dark:bg-[#1c1c1e] dark:ring-white/10"
          >
            <Navigation className="h-5 w-5" />
            {isAm ? 'አቅጣጫ' : 'Directions'}
          </button>
          {place.phone && (
            <a
              href={`tel:${place.phone}`}
              className="inline-flex shrink-0 flex-col items-center gap-1 rounded-2xl bg-white px-4 py-2.5 text-[11px] font-semibold text-[#0b6e99] shadow-sm ring-1 ring-black/[0.06] dark:bg-[#1c1c1e] dark:ring-white/10"
            >
              <Phone className="h-5 w-5" />
              {isAm ? 'ደውል' : 'Call'}
            </a>
          )}
          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 flex-col items-center gap-1 rounded-2xl bg-white px-4 py-2.5 text-[11px] font-semibold text-slate-700 shadow-sm ring-1 ring-black/[0.06] dark:bg-[#1c1c1e] dark:text-slate-200 dark:ring-white/10"
            >
              <Globe className="h-5 w-5" />
              {isAm ? 'ድረ-ገጽ' : 'Website'}
            </a>
          )}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 flex-col items-center gap-1 rounded-2xl bg-white px-4 py-2.5 text-[11px] font-semibold text-slate-700 shadow-sm ring-1 ring-black/[0.06] dark:bg-[#1c1c1e] dark:text-slate-200 dark:ring-white/10"
          >
            <ExternalLink className="h-5 w-5" />
            {isAm ? 'ካርታ' : 'Maps'}
          </a>
          <button
            type="button"
            onClick={() => void onShare()}
            className="inline-flex shrink-0 flex-col items-center gap-1 rounded-2xl bg-white px-4 py-2.5 text-[11px] font-semibold text-slate-700 shadow-sm ring-1 ring-black/[0.06] dark:bg-[#1c1c1e] dark:text-slate-200 dark:ring-white/10"
          >
            <Share2 className="h-5 w-5" />
            {shareMsg || (isAm ? 'አጋራ' : 'Share')}
          </button>
        </div>

        {popularChips.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
              {isAm ? 'ታዋቂ ለ፡' : 'Popular for'}
            </span>
            {popularChips.map((c) => (
              <span
                key={c}
                className="rounded-full bg-[#078930]/10 px-2.5 py-1 text-[12px] font-semibold text-[#078930] dark:bg-emerald-950 dark:text-emerald-300"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {(isHotel || priceRange) && (
          <Card className="mb-4 overflow-hidden">
            <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
              {stars != null && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {isAm ? 'ደረጃ' : 'Class'}
                  </p>
                  <p className="text-lg font-bold text-[#1c1c1e] dark:text-white">
                    {'★'.repeat(stars)}
                    <span className="text-sm font-medium text-slate-400">{'☆'.repeat(Math.max(0, 5 - stars))}</span>
                  </p>
                </div>
              )}
              {priceRange && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {isAm ? 'ዋጋ / ሌሊት (ግምት)' : 'From / night (est.)'}
                  </p>
                  <p className="text-lg font-bold text-[#078930] dark:text-[#30d158]">{priceRange}</p>
                  <p className="text-[11px] text-slate-400">{isAm ? 'ለእቅድ ብቻ' : 'Planning only · not live rates'}</p>
                </div>
              )}
              {(place.hotel?.check_in || place.hotel?.check_out) && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {isAm ? 'መግቢያ / መውጫ' : 'Check-in / out'}
                  </p>
                  <p className="text-sm font-semibold text-[#1c1c1e] dark:text-white">
                    {place.hotel?.check_in || '—'} → {place.hotel?.check_out || '—'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {amenities.length > 0 && (
          <section className="mb-5">
            <h2 className="mb-2 text-[17px] font-semibold tracking-tight text-[#1c1c1e] dark:text-white">
              {isAm ? 'አገልግሎቶች' : 'Amenities & services'}
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {amenities.map((a) => {
                const Icon = amenityIcon(a)
                return (
                  <div
                    key={a}
                    className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm shadow-sm ring-1 ring-black/[0.04] dark:bg-[#1c1c1e] dark:ring-white/10"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-[#078930]" />
                    <span className="truncate font-medium text-slate-700 dark:text-slate-200">{a}</span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {description && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <h2 className="mb-2 text-[15px] font-semibold text-[#1c1c1e] dark:text-white">
                {isAm ? 'ስለ ቦታው' : 'About'}
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-[15px]">
                {description}
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="mb-4">
          <CardContent className="space-y-2 p-4">
            {place.address && (
              <p className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#078930]" />
                {place.address}
              </p>
            )}
            <PlaceGoogleEmbed lat={place.latitude} lng={place.longitude} name={name} />
          </CardContent>
        </Card>

        {canSocial && (
          <section className="mb-6">
            <h2 className="mb-3 text-[17px] font-semibold tracking-tight text-[#1c1c1e] dark:text-white">
              {isAm ? 'ግምገማዎች' : 'Reviews'}
            </h2>
            <ReviewForm placeId={place.id} existing={myReview} />
            {reviewsLoading && <Loader2 className="mx-auto my-4 h-6 w-6 animate-spin text-[#078930]" />}
            <div className="mt-3 space-y-2">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </section>
        )}

        {similar.length > 0 && (
          <section className="mb-4">
            <h2 className="mb-3 text-[17px] font-semibold tracking-tight text-[#1c1c1e] dark:text-white">
              {isAm ? 'ተመሳሳይ ቦታዎች' : 'Similar places'}
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {similar.map((p) => {
                const simCover = placeCoverImage(p)
                return (
                  <Link
                    key={p.id || p.slug}
                    to={`/places/${p.slug || encodeURIComponent(p.name)}`}
                    className="w-[160px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] dark:bg-[#1c1c1e] dark:ring-white/10"
                  >
                    <div className="aspect-[4/3] bg-slate-100">
                      <img
                        src={simCover}
                        alt={placeImageAlt(p)}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p className="truncate p-2 text-sm font-semibold text-slate-800 dark:text-white">
                      {placeName(p, language)}
                    </p>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        <div
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/[0.06] bg-white/95 p-3 backdrop-blur dark:border-white/10 dark:bg-[#1c1c1e]/95 lg:hidden"
          style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="mx-auto flex max-w-lg gap-2">
            <Button className="min-h-[48px] flex-1" onClick={() => goDirections('walking')}>
              <Navigation className="h-4 w-4" /> {isAm ? 'አቅጣጫ' : 'Directions'}
            </Button>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="outline" className="min-h-[48px] w-full">
                <ExternalLink className="h-4 w-4" /> Maps
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
