import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownUp, Hotel, Info } from 'lucide-react'
import { CURATED_HOTELS } from '@/services/curatedHotels'
import { estimateHotelPriceEtb } from '@/data/allHotels'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

type SortKey = 'price' | 'name' | 'stars'

function fmt(n: number) {
  return n.toLocaleString('en-US')
}

export function HotelPriceCompare() {
  const lang = useAppStore((s) => s.language)
  const am = lang === 'am'
  const [sort, setSort] = useState<SortKey>('price')
  const [tier, setTier] = useState<'all' | 'budget' | 'mid' | 'comfort'>('all')

  const rows = useMemo(() => {
    let list = CURATED_HOTELS.map((p) => {
      const min = p.hotel?.minimum_price ?? estimateHotelPriceEtb(p.hotel?.star_rating ?? undefined).from
      const max = p.hotel?.maximum_price ?? estimateHotelPriceEtb(p.hotel?.star_rating ?? undefined).to
      const stars = p.hotel?.star_rating ?? 0
      const band = estimateHotelPriceEtb(stars || undefined).tier
      return {
        id: p.id,
        slug: p.slug,
        name: am && p.name_am ? p.name_am : p.name,
        stars,
        min,
        max,
        mid: Math.round((min + max) / 2),
        band,
        maps: p.website,
      }
    })
    if (tier !== 'all') list = list.filter((r) => r.band === tier)
    list.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'stars') return (b.stars || 0) - (a.stars || 0)
      return a.mid - b.mid
    })
    return list
  }, [am, sort, tier])

  const tiers = [
    { id: 'all' as const, label: am ? 'ሁሉም' : 'All' },
    { id: 'budget' as const, label: am ? 'በጀት' : 'Budget' },
    { id: 'mid' as const, label: am ? 'መካከለኛ' : 'Mid' },
    { id: 'comfort' as const, label: am ? 'ኮምፎርት' : 'Comfort' },
  ]

  return (
    <section className="mb-8 rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#1c1c1e] sm:p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-[17px] font-bold text-[#1c1c1e] dark:text-white">
            <Hotel className="h-5 w-5 text-[#078930]" />
            {am ? 'የሆቴል ዋጋ ማወዳደር' : 'Compare hotel prices'}
          </h2>
          <p className="mt-1 text-[13px] text-[#8e8e93]">
            {am
              ? 'ግምታዊ የአንድ ሌሊት ዋጋ (ብር) — ለእቅድ ብቻ፤ በቦታው ያረጋግጡ።'
              : 'Estimated per night (ETB) — for planning only; confirm on site.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSort((s) => (s === 'price' ? 'stars' : s === 'stars' ? 'name' : 'price'))}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#f2f2f7] px-3 py-1.5 text-[12px] font-semibold text-[#3c3c43] dark:bg-white/10 dark:text-white"
        >
          <ArrowDownUp className="h-3.5 w-3.5" />
          {sort === 'price' ? (am ? 'በዋጋ' : 'By price') : sort === 'stars' ? (am ? 'በኮከብ' : 'By stars') : am ? 'በስም' : 'By name'}
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {tiers.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setTier(x.id)}
            className={cn(
              'rounded-full px-3 py-1.5 text-[12px] font-semibold transition',
              tier === x.id
                ? 'bg-[#078930] text-white'
                : 'bg-[#f2f2f7] text-[#3c3c43] dark:bg-white/10 dark:text-white/80'
            )}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl ring-1 ring-black/[0.04] dark:ring-white/10">
        <table className="w-full min-w-[320px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-black/[0.06] bg-[#f8f8fa] text-[11px] uppercase tracking-wide text-[#8e8e93] dark:border-white/10 dark:bg-black/40">
              <th className="px-3 py-2 font-semibold">{am ? 'ሆቴል' : 'Hotel'}</th>
              <th className="px-3 py-2 font-semibold">★</th>
              <th className="px-3 py-2 font-semibold">{am ? 'ከ' : 'From'}</th>
              <th className="px-3 py-2 font-semibold">{am ? 'እስከ' : 'To'}</th>
              <th className="px-3 py-2 font-semibold">{am ? 'ደረጃ' : 'Tier'}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.id}
                className={cn(
                  'border-b border-black/[0.04] dark:border-white/[0.06]',
                  i % 2 === 0 ? 'bg-white dark:bg-[#1c1c1e]' : 'bg-[#fafafa] dark:bg-white/[0.03]'
                )}
              >
                <td className="px-3 py-2.5">
                  <Link
                    to={`/places/${r.slug}`}
                    className="font-semibold text-[#1c1c1e] hover:text-[#078930] dark:text-white dark:hover:text-[#30d158]"
                  >
                    {r.name}
                  </Link>
                </td>
                <td className="px-3 py-2.5 tabular-nums text-[#8e8e93]">{r.stars || '—'}</td>
                <td className="px-3 py-2.5 font-semibold tabular-nums text-[#078930] dark:text-[#30d158]">
                  {fmt(r.min)}
                </td>
                <td className="px-3 py-2.5 tabular-nums text-[#3c3c43] dark:text-white/80">{fmt(r.max)}</td>
                <td className="px-3 py-2.5">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                      r.band === 'budget' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
                      r.band === 'mid' && 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
                      r.band === 'comfort' && 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100'
                    )}
                  >
                    {r.band === 'budget' ? (am ? 'በጀት' : 'Budget') : r.band === 'mid' ? (am ? 'መካከለኛ' : 'Mid') : am ? 'ኮምፎርት' : 'Comfort'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 flex gap-2 text-[11px] leading-relaxed text-[#8e8e93]">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {am
          ? 'ዋጋዎች በኮከብ ደረጃ የተገመቱ የአንድ ሌሊት ባንዶች ናቸው (ብር)። ወቅታዊ ቅናሽ/ጭማሪ ሊኖር ይችላል። ቦታ ከመያዝዎ በፊት ሆቴሉን ወይም Booking ያረጋግጡ።'
          : 'Prices are star-based nightly bands in ETB. Season and room type change rates. Confirm with the hotel or a booking site before you pay.'}
      </p>
    </section>
  )
}
