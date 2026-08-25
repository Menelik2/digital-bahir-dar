import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { Place, Category } from '@/types/place'
import type { PlaceEditInput } from '@/services/admin'

type PlaceRow = Place & { staff_notes?: string | null; deleted_at?: string | null }

interface Props {
  place: PlaceRow
  categories?: Category[]
  onSave: (data: PlaceEditInput) => Promise<void>
  onCancel: () => void
  saving?: boolean
}

export function PlaceEditor({ place, categories = [], onSave, onCancel, saving }: Props) {
  const [name, setName] = useState(place.name)
  const [slug, setSlug] = useState(place.slug)
  const [categoryId, setCategoryId] = useState(place.category_id ?? '')
  const [shortDescription, setShortDescription] = useState(place.short_description ?? '')
  const [description, setDescription] = useState(place.description ?? '')
  const [address, setAddress] = useState(place.address ?? '')
  const [phone, setPhone] = useState(place.phone ?? '')
  const [email, setEmail] = useState(place.email ?? '')
  const [website, setWebsite] = useState(place.website ?? '')
  const [lat, setLat] = useState(String(place.latitude))
  const [lng, setLng] = useState(String(place.longitude))
  const [priceLevel, setPriceLevel] = useState(place.price_level != null ? String(place.price_level) : '')
  const [entranceFee, setEntranceFee] = useState(
    place.entrance_fee != null ? String(place.entrance_fee) : ''
  )
  const [status, setStatus] = useState(place.status || 'draft')
  const [verified, setVerified] = useState(!!place.verified)
  const [featured, setFeatured] = useState(!!place.featured)
  const [staffNotes, setStaffNotes] = useState(place.staff_notes ?? '')

  useEffect(() => {
    setName(place.name)
    setSlug(place.slug)
    setCategoryId(place.category_id ?? '')
    setShortDescription(place.short_description ?? '')
    setDescription(place.description ?? '')
    setAddress(place.address ?? '')
    setPhone(place.phone ?? '')
    setEmail(place.email ?? '')
    setWebsite(place.website ?? '')
    setLat(String(place.latitude))
    setLng(String(place.longitude))
    setPriceLevel(place.price_level != null ? String(place.price_level) : '')
    setEntranceFee(place.entrance_fee != null ? String(place.entrance_fee) : '')
    setStatus(place.status || 'draft')
    setVerified(!!place.verified)
    setFeatured(!!place.featured)
    setStaffNotes(place.staff_notes ?? '')
  }, [place.id])

  const field = (label: string, children: React.ReactNode) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
      {children}
    </div>
  )

  const inputClass =
    'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950'

  return (
    <form
      className="space-y-3 rounded-xl border border-sky-200 bg-sky-50/50 p-4 dark:border-sky-900 dark:bg-sky-950/30"
      onSubmit={async (e) => {
        e.preventDefault()
        await onSave({
          name,
          slug,
          category_id: categoryId || undefined,
          short_description: shortDescription || null,
          description: description || null,
          address: address || null,
          phone: phone || null,
          email: email || null,
          website: website || null,
          latitude: Number(lat),
          longitude: Number(lng),
          price_level: priceLevel ? Number(priceLevel) : null,
          entrance_fee: entranceFee ? Number(entranceFee) : null,
          status,
          verified,
          featured,
          staff_notes: staffNotes || null,
        })
      }}
    >
      <p className="text-sm font-semibold text-sky-800 dark:text-sky-200">Edit place</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {field('Name', <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />)}
        {field('Slug', <input className={inputClass} value={slug} onChange={(e) => setSlug(e.target.value)} />)}
        {field(
          'Category',
          <select className={inputClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
        {field(
          'Status',
          <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value as Place['status'])}>
            <option value="draft">draft</option>
            <option value="pending">pending</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        )}
        {field('Address', <input className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} />)}
        {field('Latitude', <input className={inputClass} type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} />)}
        {field('Longitude', <input className={inputClass} type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} />)}
        {field('Phone', <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />)}
        {field('Email', <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />)}
        {field('Website', <input className={inputClass} value={website} onChange={(e) => setWebsite(e.target.value)} />)}
        {field(
          'Price level (1–5)',
          <input className={inputClass} type="number" min={1} max={5} value={priceLevel} onChange={(e) => setPriceLevel(e.target.value)} />
        )}
        {field(
          'Entrance fee (ETB)',
          <input className={inputClass} type="number" min={0} value={entranceFee} onChange={(e) => setEntranceFee(e.target.value)} />
        )}
      </div>
      {field(
        'Short description',
        <input className={inputClass} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
      )}
      {field(
        'Description',
        <textarea className={inputClass} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      )}
      {field(
        'Staff notes (internal)',
        <textarea className={inputClass} rows={2} value={staffNotes} onChange={(e) => setStaffNotes(e.target.value)} />
      )}
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} /> Verified
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Featured
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={saving || !name.trim()}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
