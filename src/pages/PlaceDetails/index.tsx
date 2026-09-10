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
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { language, isAm } = useLang()
  const { place, isLoading, error } = usePlace(slug)
  const { hasFix, location } = useGeolocation()
  const userPos =
    hasFix && location.latitude != null && location.longitude != null
      ? { lat: location.latitude, lng: location.longitude }
      : null

  const distM =
    place && userPos
      ? distanceMeters(userPos.lat, userPos.lng, place.latitude, place.longitude)
      : null

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
  const desc = placeDescription(place, language)
  const cat = categoryLabel(place.category, language)
  const cover = placeCoverImage(place)
  const canReview = isPersistedPlaceId(place.id)

  return (
    <div className="bg-[#f2f2f7] dark:bg-black">
      <div className="relative">
        <img
          src={cover}
          alt={placeImageAlt(place)}
          className="h-[42vh] max-h-[360px] w-full object-cover sm:h-[48vh] sm:max-h-[420px]"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const el = e.currentTarget
            el.onerror = null
            el.src =
              'https://commons.wikimedia.org/wiki/Special:FilePath/The%20city%20of%20Bahir%20Dar%2C%20Ethiopia.jpg?width=1200'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
          aria-label={isAm ? 'ተመለስ' : 'Back'}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          {cat && (
            <span className="mb-2 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
              {cat}
            </span>
          )}
          <h1 className="text-2xl font-bold text-white drop-shadow sm:text-3xl">{name}</h1>
          {secondary && <p className="mt-0.5 text-[14px] text-white/85">{secondary}</p>}
          {distM != null && (
            <p className="mt-1 text-[13px] font-medium text-white/90">
              {formatDistance(distM)} · 🚶 {walkingMinutes(distM)} {isAm ? 'ደቂቃ' : 'min'}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6">
        <div className="mb-5 flex flex-wrap gap-2">
          <Button className="rounded-full bg-[#078930] hover:bg-[#056b24]" onClick={() => goDirections('walking')}>
            <Footprints className="h-4 w-4" /> {isAm ? 'በእግር' : 'Walk'}
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => goDirections('driving')}>
            <Navigation className="h-4 w-4" /> {isAm ? 'መኪና' : 'Drive'}
          </Button>
          <FavoriteButton placeId={place.id} />
        </div>

        {desc && (
          <section className="mb-6">
            <h2 className="mb-2 text-[17px] font-bold text-[#1c1c1e] dark:text-white">
              {isAm ? 'ስለ ቦታው' : 'About'}
            </h2>
            <p className="text-[15px] leading-relaxed text-[#3c3c43] dark:text-white/80">{desc}</p>
          </section>
        )}

        {info.highlights && (
          <section className="mb-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.04] dark:bg-[#1c1c1e] dark:ring-white/10">
            <h3 className="mb-1 flex items-center gap-1.5 text-[14px] font-bold text-[#078930]">
              <Star className="h-4 w-4" /> {isAm ? 'ዋና ነጥቦች' : 'Highlights'}
            </h3>
            <p className="text-[14px] leading-relaxed text-[#3c3c43] dark:text-white/80">{info.highlights}</p>
          </section>
        )}

        {info.tips && (
          <section className="mb-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.04] dark:bg-[#1c1c1e] dark:ring-white/10">
            <h3 className="mb-1 flex items-center gap-1.5 text-[14px] font-bold text-[#d4a017]">
              <Lightbulb className="h-4 w-4" /> {isAm ? 'ጠቃሚ ምክሮች' : 'Tips'}
            </h3>
            <p className="text-[14px] leading-relaxed text-[#3c3c43] dark:text-white/80">{info.tips}</p>
          </section>
        )}

        {(place.phone || place.website) && (
          <section className="mb-6 flex flex-wrap gap-3">
            {place.phone && (
              <a href={`tel:${place.phone}`} className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0b6e99]">
                <Phone className="h-4 w-4" /> {place.phone}
              </a>
            )}
            {place.website && (
              <a href={place.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0b6e99]">
                <Globe className="h-4 w-4" /> {isAm ? 'ድረ-ገጽ' : 'Website'}
              </a>
            )}
          </section>
        )}

        <section className="mb-8">
          <h2 className="mb-3 text-[17px] font-bold text-[#1c1c1e] dark:text-white">
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
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white">
                  {isAm ? 'ተመሳሳይ ቦታዎች' : 'Similar places'}
                </h2>
                <p className="mt-0.5 text-[13px] text-[#8e8e93]">
                  {isAm ? 'በአይነት እና በርቀት የቀረቡ' : 'Nearby matches by type'}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 sm:grid sm:grid-cols-2 sm:gap-3">
              {similar.map((p) => {
                const simCat = categoryLabel(p.category, language)
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
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2.5 sm:px-3.5">
                      <div className="mb-1 flex flex-wrap items-center gap-1.5">
                        {simCat && (
                          <span className="rounded-full bg-[#0b6e99]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0a5a7e] dark:bg-sky-950 dark:text-sky-300">
                            {simCat}
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
                className="text-[13px] font-semibold text-[#078930]"
              >
                {isAm ? 'ተመሳሳይ ሁሉንም ይመልከቱ →' : 'See all in category →'}
              </Link>
            </div>
          </section>
        )}

        {canReview && (
          <section className="mb-10">
            <h2 className="mb-3 text-[17px] font-bold text-[#1c1c1e] dark:text-white">
              {isAm ? 'ግምገማዎች' : 'Reviews'}
            </h2>
            <ReviewForm placeId={place.id} />
          </section>
        )}
      </div>
    </div>
  )
}
