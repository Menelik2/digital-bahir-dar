import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Loader2, Pencil, Plus, Trash2, Tags, Search, Download, ArrowUpDown,
  ChevronUp, ChevronDown, MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAdminCategories, useAdminActions } from '@/hooks/useAdmin'
import { downloadCsv, slugify } from '@/services/admin'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types/place'
import { cn } from '@/lib/utils'

const ICON_SUGGESTIONS = [
  'map-pin', 'hotel', 'utensils', 'landmark', 'building-2', 'trees',
  'waves', 'shopping-bag', 'coffee', 'bus', 'banknote', 'church',
  'mountain', 'camera', 'heart', 'star',
]

/** Place counts keyed by category_id (staff can see all places). */
function useCategoryPlaceCounts(enabled: boolean) {
  return useQuery({
    queryKey: ['admin-category-place-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('places')
        .select('category_id')
        .is('deleted_at', null)
        .limit(5000)
      if (error) {
        console.warn('category place counts:', error.message)
        return {} as Record<string, number>
      }
      const counts: Record<string, number> = {}
      for (const row of data ?? []) {
        const id = (row as { category_id?: string }).category_id
        if (id) counts[id] = (counts[id] ?? 0) + 1
      }
      return counts
    },
    enabled,
    staleTime: 30_000,
  })
}

export function CategoriesCmsPanel() {
  const { data: categories = [], isLoading, refetch } = useAdminCategories(true)
  const { data: placeCounts = {} } = useCategoryPlaceCounts(true)
  const actions = useAdminActions()
  const [q, setQ] = useState('')
  const [banner, setBanner] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [nameAm, setNameAm] = useState('')
  const [slug, setSlug] = useState('')
  const [icon, setIcon] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [slugTouched, setSlugTouched] = useState(false)

  const flash = (msg: string) => {
    setBanner(msg)
    window.setTimeout(() => setBanner(null), 3500)
  }
  const run = async (fn: () => Promise<unknown>, okMsg?: string) => {
    try {
      await fn()
      if (okMsg) flash(okMsg)
      refetch()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Action failed — check RLS / staff role')
    }
  }

  const sorted = useMemo(
    () => [...categories].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name)),
    [categories]
  )

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return sorted
    return sorted.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.slug.toLowerCase().includes(needle) ||
        c.description?.toLowerCase().includes(needle) ||
        c.icon?.toLowerCase().includes(needle) ||
        (c.name_am ?? '').toLowerCase().includes(needle)
    )
  }, [sorted, q])

  const resetForm = () => {
    setName('')
    setNameAm('')
    setSlug('')
    setIcon('')
    setDescription('')
    setSortOrder(String((categories.length + 1) * 10))
    setSlugTouched(false)
    setShowCreate(false)
    setEditingId(null)
  }

  const startEdit = (c: Category) => {
    setEditingId(c.id)
    setShowCreate(false)
    setName(c.name)
    setNameAm(c.name_am ?? '')
    setSlug(c.slug)
    setIcon(c.icon ?? '')
    setDescription(c.description ?? '')
    setSortOrder(String(c.sort_order ?? 0))
    setSlugTouched(true)
  }

  const onNameChange = (v: string) => {
    setName(v)
    if (!slugTouched) setSlug(slugify(v))
  }

  const submit = async () => {
    if (!name.trim() || name.trim().length < 2) {
      alert('Name is required (min 2 characters)')
      return
    }
    const s = (slug || slugify(name)).trim().toLowerCase().replace(/\s+/g, '-')
    if (!s) {
      alert('Slug is required')
      return
    }
    const payload = {
      name: name.trim(),
      slug: s,
      icon: icon.trim() || null,
      description: description.trim() || null,
      sort_order: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 99,
      name_am: nameAm.trim() || null,
    }
    if (editingId) {
      await run(() => actions.categoryUpdate.mutateAsync({ id: editingId, data: payload }), 'Category updated')
    } else {
      await run(() => actions.categoryCreate.mutateAsync(payload), 'Category created')
    }
    resetForm()
  }

  const moveSort = async (c: Category, dir: -1 | 1) => {
    const idx = sorted.findIndex((x) => x.id === c.id)
    const neighbor = sorted[idx + dir]
    if (!neighbor) return
    const a = c.sort_order ?? idx * 10
    const b = neighbor.sort_order ?? (idx + dir) * 10
    await run(async () => {
      await actions.categoryUpdate.mutateAsync({ id: c.id, data: { sort_order: b } })
      await actions.categoryUpdate.mutateAsync({ id: neighbor.id, data: { sort_order: a } })
    }, 'Order updated')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Tags className="h-5 w-5 text-sky-600" /> Categories
          </h2>
          <p className="text-xs text-slate-500">
            Full CRUD for place category lists — name, Amharic label, slug, icon, description, sort order, and place counts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              downloadCsv('admin-categories.csv', [
                ['id', 'name', 'name_am', 'slug', 'icon', 'sort_order', 'places', 'description'],
                ...filtered.map((c) => [
                  c.id,
                  c.name,
                  c.name_am ?? '',
                  c.slug,
                  c.icon ?? '',
                  String(c.sort_order ?? 0),
                  String(placeCounts[c.id] ?? 0),
                  (c.description ?? '').replace(/\n/g, ' '),
                ]),
              ])
              flash(`Exported ${filtered.length} categories`)
            }}
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (showCreate || editingId) resetForm()
              else {
                setSortOrder(String((categories.length + 1) * 10))
                setShowCreate(true)
              }
            }}
          >
            <Plus className="h-3.5 w-3.5" /> {showCreate || editingId ? 'Cancel' : 'New category'}
          </Button>
        </div>
      </div>

      {banner && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
          {banner}
        </div>
      )}

      {(showCreate || editingId) && (
        <Card className="border-sky-200 dark:border-sky-900">
          <CardContent className="space-y-3 p-4">
            <p className="text-sm font-semibold">{editingId ? 'Edit category' : 'Create category'}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">Name (EN) *</label>
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  placeholder="e.g. Hotels"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">Name (Amharic)</label>
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  placeholder="ሆቴሎች"
                  value={nameAm}
                  onChange={(e) => setNameAm(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">Slug *</label>
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm font-mono dark:border-slate-700 dark:bg-slate-950"
                  placeholder="hotels"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    setSlug(e.target.value)
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">Icon key</label>
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  placeholder="hotel, utensils, landmark…"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  list="category-icon-suggestions"
                />
                <datalist id="category-icon-suggestions">
                  {ICON_SUGGESTIONS.map((i) => (
                    <option key={i} value={i} />
                  ))}
                </datalist>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Sort order <ArrowUpDown className="inline h-3 w-3" />
                </label>
                <input
                  type="number"
                  className="w-full max-w-xs rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
                <p className="mt-1 text-[11px] text-slate-400">Lower numbers appear first in filters and directories.</p>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">Description / details</label>
              <textarea
                className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                rows={3}
                placeholder="What this category covers — shown in directories and admin lists…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => run(submit)}>{editingId ? 'Save changes' : 'Create category'}</Button>
              <Button size="sm" variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, Amharic, slug, icon, description…"
          className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
      </div>

      <p className="text-xs text-slate-400">
        {filtered.length} categor{filtered.length === 1 ? 'y' : 'ies'}
        {Object.keys(placeCounts).length > 0 && (
          <> · {Object.values(placeCounts).reduce((a, b) => a + b, 0)} places linked</>
        )}
      </p>

      {isLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
      {!isLoading && filtered.length === 0 && (
        <p className="text-sm text-slate-400">No categories found. Create one to organize places.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => {
          const count = placeCounts[c.id] ?? 0
          const idx = sorted.findIndex((x) => x.id === c.id)
          return (
            <Card key={c.id} className={cn(editingId === c.id && 'ring-2 ring-sky-300/50')}>
              <CardContent className="space-y-2 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium">{c.name}</p>
                    {c.name_am && <p className="text-sm text-slate-600 dark:text-slate-300">{c.name_am}</p>}
                    <p className="font-mono text-xs text-slate-400">{c.slug}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      #{c.sort_order}
                    </span>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-800 dark:bg-sky-950 dark:text-sky-200">
                      <MapPin className="h-3 w-3" /> {count}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                  {c.icon ? (
                    <span className="rounded bg-sky-50 px-1.5 py-0.5 dark:bg-sky-950/50">icon: {c.icon}</span>
                  ) : (
                    <span className="rounded bg-slate-50 px-1.5 py-0.5 dark:bg-slate-900">no icon</span>
                  )}
                  <span className="rounded bg-slate-50 px-1.5 py-0.5 dark:bg-slate-900">
                    {count} place{count === 1 ? '' : 's'}
                  </span>
                </div>
                {c.description ? (
                  <p className="line-clamp-3 text-xs text-slate-500">{c.description}</p>
                ) : (
                  <p className="text-xs italic text-slate-400">No description</p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Button size="sm" variant="outline" onClick={() => startEdit(c)}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" disabled={idx <= 0} title="Move up" onClick={() => moveSort(c, -1)}>
                    <ChevronUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" disabled={idx < 0 || idx >= sorted.length - 1} title="Move down" onClick={() => moveSort(c, 1)}>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600"
                    onClick={() => {
                      if (count > 0) {
                        if (!window.confirm(`Delete “${c.name}”? ${count} place(s) still use this category.`)) return
                      } else if (!window.confirm(`Delete category “${c.name}”?`)) {
                        return
                      }
                      run(() => actions.categoryDelete.mutateAsync(c.id), 'Category deleted')
                      if (editingId === c.id) resetForm()
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
