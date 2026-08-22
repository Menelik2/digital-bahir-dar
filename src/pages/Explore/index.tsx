import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { PlaceCard } from '@/components/places/PlaceCard'
import { useFilteredPlaces } from '@/hooks/usePlaces'
import { CATEGORIES } from '@/constants'
import { cn } from '@/lib/utils'

export default function ExplorePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const { places, isLoading } = useFilteredPlaces({ search, categorySlug: category })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Explore Bahir Dar</h1>
      <p className="mb-6 text-slate-500">Search places, filter by category, and discover the city</p>

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search hotels, food, attractions, ATMs…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={cn(
            'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
            !category ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-200 bg-white dark:border-slate-700'
          )}
        >
          All
        </button>
        {CATEGORIES.slice(0, 10).map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCategory(category === c.slug ? null : c.slug)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
              category === c.slug ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-200 bg-white dark:border-slate-700'
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {isLoading && <p className="py-12 text-center text-slate-500">Loading…</p>}

      {!isLoading && places.length === 0 && (
        <p className="py-12 text-center text-slate-500">No places match your search.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { to: '/hotels', label: 'Hotels' },
          { to: '/restaurants', label: 'Restaurants' },
          { to: '/attractions', label: 'Attractions' },
          { to: '/banks', label: 'Banks & ATMs' },
          { to: '/transport', label: 'Transport' },
          { to: '/map', label: 'Map' },
          { to: '/directory', label: 'Directory' },
          { to: '/events', label: 'Events' },
        ].map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
