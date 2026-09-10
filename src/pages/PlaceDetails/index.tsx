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
  Lightbulb,
  Footprints,
  Landmark,
  ChevronRight,
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
import { placeName, placeNameSecondary, placeDescription, placeShortDescription, categoryLabel } from '@/utils/placeLocale'
import { useLang } from '@/hooks/useT'
import { PlaceGoogleEmbed } from '@/components/map/PlaceGoogleEmbed'
import { CURATED_TOURISM_PLACES } from '@/services/curatedTourism'
import { CURATED_HOTELS } from '@/services/curatedHotels'
import { findSimilarPlaces, getCuratedPlaces } from '@/services/places'
import { useMemo } from 'react'

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
  const { language, isAm } = useLang()
  const { data: place, isLoading, error } = usePlace(slug)
  const { location } = useAppStore()
  useGeolocation(true)
  const canSocial = isPersistedPlaceId(place?.id)
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews(canSocial ? place?.id : undefined)
  const { data: myReview } = useMyReview(canSocial ? place?.id : undefined)
  const { data: ratingSummary } = useRatingSummary(canSocial ? place?.id : undefined)

  const userPos =
    location.latitude != null && location.longitude != null
      ? { lat: location.latitude, lng: location.longitude }
      : null

  const distM = useMemo(() => {
    if (!place || !userPos) return null
    return distanceMeters(userPos.lat, userPos.lng, place.latitude, place.longitude)
  }, [place, userPos])

  const info = useMemo(
    () => parseInfoBlocks(place?.attraction?.historical_information),
    [place?.attraction?.historical_information]
  )

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

  const goDirections = (mode: 'walking' | 'driving' = 'walking') => {
    if (!place) return
    navigate(inAppDirectionsPath(place, mode))
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

  return (
    <div className="min-h-full bg-[#f2f2f7] dark:bg-black">
      <div className="relative h-56 w-full overflow-hidden sm:h-72">
        {cover ? (
          <img src={cover} alt={placeImageAlt(place)} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-sky-400 to-teal-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          {category && (
            <span className="mb-1 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur">
              {category}
            </span>
          )}
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{name}</h1>
          {secondary && <p className="text-sm text-white/80">{secondary}</p>}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <Button onClick={() => goDirections('walking')}>
            <Navigation className="h-4 w-4" /> {isAm ? 'አቅጣጫ' : 'Directions'}
          </Button>
          <FavoriteButton placeId={place.id} />
          {distM != null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm shadow-sm dark:bg-[#1c1c1e]">
              <MapPin className="h-3.5 w-3.5 text-[#078930]" />
              {formatDistance(distM)} · 🚶 {walkingMinutes(distM)} {isAm ? 'ደቂቃ' : 'min'}
            </span>
          )}
        </div>

        {description && (
          <Card className="mb-4">
            <CardContent className="p-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {description}
            </CardContent>
          </Card>
        )}

        {(info.highlights || info.tips || info.howTo) && (
          <section className="mb-6 space-y-3">
            {info.highlights && (
              <Card>
                <CardContent className="p-4">
                  <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
                    <Landmark className="h-4 w-4 text-[#078930]" /> {isAm ? 'ዋና ነጥቦች' : 'Highlights'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{info.highlights}</p>
                </CardContent>
              </Card>
            )}
            {info.tips && (
              <Card>
                <CardContent className="p-4">
                  <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
                    <Lightbulb className="h-4 w-4 text-amber-500" /> {isAm ? 'ምክሮች' : 'Tips'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{info.tips}</p>
                </CardContent>
              </Card>
            )}
            {info.howTo && (
              <Card>
                <CardContent className="p-4">
                  <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
                    <Footprints className="h-4 w-4 text-sky-600" /> {isAm ? 'እንዴት መድረስ' : 'How to get there'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{info.howTo}</p>
                </CardContent>
              </Card>
            )}
          </section>
        )}

        <section className="mb-6">
          <Card>
            <CardContent className="space-y-2 p-4">
              {place.address && (
                <p className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#078930]" />
                  {place.address}
                </p>
              )}
              {place.phone && (
                <a href={`tel:${place.phone}`} className="flex items-center gap-2 text-sm text-sky-600 hover:underline">
                  <Phone className="h-4 w-4" />
                  {place.phone}
                </a>
              )}
              {place.website && (
                <a href={place.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-sky-600 hover:underline">
                  <Globe className="h-4 w-4" />
                  {isAm ? 'ድረ-ገጽ' : 'Website'}
                </a>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-[17px] font-semibold tracking-tight text-[#1c1c1e] dark:text-white">
            {isAm ? 'ካርታ እና ርቀት' : 'Map & distance'}
          </h2>
          <PlaceGoogleEmbed
            lat={place.latitude}
            lng={place.longitude}
            name={name}
            origin={userPos}
            distanceM={distM}
            isAm={isAm}
          />
        </section>

        {similar.length > 0 && (
          <section className="mb-10">
            <div className="mb-4">
              <h2 className="text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white">
                {isAm ? 'ተመሳሳይ ቦታዎች' : 'Similar places'}
              </h2>
              <p className="mt-0.5 text-[13px] text-[#8e8e93]">
                {isAm ? 'በአይነት እና በርቀት የቀረቡ' : 'Nearby matches by type'}
              </p>
            </div>
            <div className="flex flex-col gap-2.5 sm:grid sm:grid-cols-2 sm:gap-3">
              {similar.map((p) => {
                const cat = categoryLabel(p.category, language)
                const short = placeShortDescription(p, language) || p.short_description
                const simCover = placeCoverImage(p)
                const dist =
                  Number.isFinite(p.distance_m) && p.distance_m != null
                    ? formatDistance(p.distance_m)
                    : null
                const walk =
                  Number.isFinite(p.distance_m) && p.distance_m != null && p.distance_m < 3000
                    ? walkingMinutes(p.distance_m)
                    : null
                return (
                  <Link
                    key={p.id}
                    to={`/places/${encodeURIComponent(p.slug || p.id)}`}
                    className="group flex overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition duration-200 active:scale-[0.99] hover:shadow-md dark:bg-[#1c1c1e] dark:ring-white/10"
                  >
                    <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden sm:h-[100px] sm:w-[100px]">
                      <img
                        src={simCover}
                        alt={placeImageAlt(p)}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          const el = e.currentTarget
                          el.onerror = null
                          el.src =
                            'https://commons.wikimedia.org/wiki/Special:FilePath/The%20city%20of%20Bahir%20Dar%2C%20Ethiopia.jpg?width=400'
                        }}
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2.5 sm:px-3.5">
                      <div className="mb-1 flex flex-wrap items-center gap-1.5">
                        {cat && (
                          <span className="rounded-full bg-[#0b6e99]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0a5a7e] dark:bg-sky-950 dark:text-sky-300">
                            {cat}
                          </span>
                        )}
                        {dist && (
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#078930] dark:text-[#30d158]">
                            <MapPin className="h-3 w-3" strokeWidth={2.5} />
                            {dist}
                            {walk != null ? ` · ${walk}${isAm ? ' ደቂቃ' : ' min'}` : ''}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[15px] font-bold leading-tight text-[#1c1c1e] dark:text-white">
                        {placeName(p, language)}
                      </p>
                      {short && (
                        <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-[#8e8e93]">
                          {short}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center pr-2.5 text-[#c7c7cc] transition group-hover:text-[#078930]">
                      <ChevronRight className="h-5 w-5" strokeWidth={2} />
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={
                  place.category?.slug === 'attraction'
                    ? '/attractions'
                    : place.category?.slug === 'hotel'
                      ? '/hotels'
                      : place.category?.slug === 'restaurant'
                        ? '/restaurants'
                        : '/explore'
                }
                className="text-sm font-semibold text-[#078930] hover:underline dark:text-[#30d158]"
              >
                {isAm ? 'ተመሳሳይ ምድብ ይመልከቱ →' : 'Browse same category →'}
              </Link>
              <Link to="/map" className="text-sm font-semibold text-[#0b6e99] hover:underline dark:text-sky-300">
                {isAm ? 'ካርታ ላይ ይመልከቱ →' : 'View on map →'}
              </Link>
            </div>
          </section>
        )}

        {canSocial && (
          <section className="mb-10">
            <h2 className="mb-3 text-lg font-semibold">{isAm ? 'ግምገማዎች' : 'Reviews'}</h2>
            {ratingSummary && (
              <p className="mb-3 text-sm text-slate-500">
                <Star className="mr-1 inline h-4 w-4 text-amber-400" />
                {ratingSummary.avg?.toFixed?.(1) ?? '—'} · {ratingSummary.count ?? 0}
              </p>
            )}
            <ReviewForm placeId={place.id} existing={myReview} />
            <div className="mt-4 space-y-3">
              {reviewsLoading && <p className="text-sm text-slate-400">…</p>}
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} placeId={place.id} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
