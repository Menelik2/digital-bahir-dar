import { useMemo, useState } from 'react'
import {
  Loader2, Pencil, Plus, Trash2, Tags, Search, Download, ArrowUpDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAdminCategories, useAdminActions } from '@/hooks/useAdmin'
import { downloadCsv, slugify } from '@/services/admin'
import type { Category } from '@/types/place'
import { cn } from '@/lib/utils'

const ICON_SUGGESTIONS = [
  'map-pin', 'hotel', 'utensils', 'landmark', 'building-2', 'trees',
  'waves', 'shopping-bag', 'coffee', 'bus', 'banknote', 'church',
  'mountain', 'camera', 'heart', 'star',
]

export function CategoriesCmsPanel() {
  const { data: categories = [], isLoading, refetch } = useAdminCategories(true)
  const actions = useAdminActions()
  const [q, setQ] = useState('')
  const [banner, setBanner] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [name, setName] = useState('')
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

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return categories
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.slug.toLowerCase().includes(needle) ||
        c.description?.toLowerCase().includes(needle) ||
        c.icon?.toLowerCase().includes(needle)
    )
  }, [categories, q])

  const resetForm = () => {
    setName('')
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
    }
    if (editingId) {
      await run(() => actions.categoryUpdate.mutateAsync({ id: editingId, data: payload }), 'Category updated')
    } else {
      await run(() => actions.categoryCreate.mutateAsync(payload), 'Category created')
    }
    resetForm()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Tags className="h-5 w-5 text-sky-600" /> Categories
          </h2>
          <p className="text-xs text-slate-500">
            Manage place category lists — name, slug, icon, description, and sort order. Used across Explore, Map, and directories.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              downloadCsv('admin-categories.csv', [
                ['id', 'name', 'slug', 'icon', 'sort_order', 'description'],
                ...filtered.map((c) => [
                  c.id,
                  c.name,
                  c.slug,
                  c.icon ?? '',
                  String(c.sort_order ?? 0),
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
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">Name *</label>
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  placeholder="e.g. Hotels"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
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
              <div>
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Sort order <ArrowUpDown className="inline h-3 w-3" />
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">Description</label>
              <textarea
                className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                rows={3}
                placeholder="Short description shown in directories and filters…"
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
          placeholder="Search name, slug, icon, description…"
          className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
      </div>

      {isLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-sky-500" />}
      {!isLoading && filtered.length === 0 && (
        <p className="text-sm text-slate-400">No categories found. Create one to organize places.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <Card key={c.id} className={cn(editingId === c.id && 'ring-2 ring-sky-300/50')}>
            <CardContent className="space-y-2 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium">{c.name}</p>
                  <p className="font-mono text-xs text-slate-400">{c.slug}</p>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  #{c.sort_order}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                {c.icon ? (
                  <span className="rounded bg-sky-50 px-1.5 py-0.5 dark:bg-sky-950/50">icon: {c.icon}</span>
                ) : (
                  <span className="rounded bg-slate-50 px-1.5 py-0.5 dark:bg-slate-900">no icon</span>
                )}
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
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600"
                  onClick={() => {
                    if (!window.confirm(`Delete category “${c.name}”? Places linked to it may fail if not reassigned.`)) return
                    run(() => actions.categoryDelete.mutateAsync(c.id), 'Category deleted')
                    if (editingId === c.id) resetForm()
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
