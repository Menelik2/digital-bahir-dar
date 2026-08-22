import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2, Loader2, CheckCircle2, Clock, XCircle, Search, MapPin, BarChart3, Pencil,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import {
  useMyBusinessProfile,
  useMyClaims,
  useOwnedPlaces,
  useUpsertBusinessProfile,
  useSubmitClaim,
  useUpdateOwnedPlace,
  useSearchPlacesForClaim,
} from '@/hooks/useBusiness'
import { computeAnalytics } from '@/services/business'
import { cn } from '@/lib/utils'
import type { Place } from '@/types/place'

type Tab = 'overview' | 'profile' | 'claim' | 'listings'

export default function BusinessPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { data: profile, isLoading: profileLoading } = useMyBusinessProfile()
  const { data: claims = [], isLoading: claimsLoading } = useMyClaims()
  const { data: owned = [] } = useOwnedPlaces(profile?.id)
  const upsert = useUpsertBusinessProfile()
  const claimMut = useSubmitClaim()
  const updatePlace = useUpdateOwnedPlace()

  const [tab, setTab] = useState<Tab>('overview')
  const [form, setForm] = useState({
    business_name: '',
    contact_name: '',
    phone: '',
    email: '',
    website: '',
    description: '',
  })
  const [formReady, setFormReady] = useState(false)
  const [claimQuery, setClaimQuery] = useState('')
  const [claimMessage, setClaimMessage] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [editPlaceId, setEditPlaceId] = useState<string | null>(null)
  const [editPatch, setEditPatch] = useState({ phone: '', website: '', description: '' })

  const { data: searchResults = [] } = useSearchPlacesForClaim(claimQuery)

  useEffect(() => {
    if (profile && !formReady) {
      setForm({
        business_name: profile.business_name,
        contact_name: profile.contact_name ?? '',
        phone: profile.phone ?? '',
        email: profile.email ?? '',
        website: profile.website ?? '',
        description: profile.description ?? '',
      })
      setFormReady(true)
    }
  }, [profile, formReady])

  const analytics = computeAnalytics(profile ?? null, claims, owned.length)

  if (authLoading || profileLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Building2 className="mx-auto mb-4 h-12 w-12 text-slate-300" />
        <h1 className="mb-2 text-2xl font-bold">Business portal</h1>
        <p className="mb-6 text-slate-500">
          Sign in to register your business, claim listings, and update place details.
        </p>
        <Link to="/auth"><Button size="lg">Log in</Button></Link>
      </div>
    )
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.business_name.trim()) return
    try {
      await upsert.mutateAsync({
        business_name: form.business_name.trim(),
        contact_name: form.contact_name || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        website: form.website || undefined,
        description: form.description || undefined,
      })
      setTab('overview')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not save')
    }
  }

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlace) return
    try {
      await claimMut.mutateAsync({
        placeId: selectedPlace.id,
        message: claimMessage || undefined,
        businessProfileId: profile?.id,
      })
      setSelectedPlace(null)
      setClaimQuery('')
      setClaimMessage('')
      setTab('overview')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Claim failed')
    }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800',
      approved: 'bg-emerald-100 text-emerald-800',
      rejected: 'bg-red-100 text-red-800',
      suspended: 'bg-red-100 text-red-800',
    }
    return (
      <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium capitalize', map[status] ?? 'bg-slate-100')}>
        {status}
      </span>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'profile', label: 'Profile' },
    { id: 'claim', label: 'Claim place' },
    { id: 'listings', label: 'Listings' },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <Building2 className="h-7 w-7 text-sky-600" /> Business portal
        </h1>
        <p className="mt-1 text-slate-500">Manage your Bahir Dar listing on Digital Bahir Dar</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition',
              tab === t.id ? 'bg-white shadow dark:bg-slate-800' : 'text-slate-500 hover:text-slate-800'
            )}>{t.label}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Card><CardContent className="flex items-center gap-3 p-4">
              <BarChart3 className="h-8 w-8 text-sky-500" />
              <div>
                <p className="text-xs text-slate-400">Profile</p>
                <p className="font-semibold">{profile ? statusBadge(profile.status) : <span className="text-slate-500">Not registered</span>}</p>
              </div>
            </CardContent></Card>
            <Card><CardContent className="flex items-center gap-3 p-4">
              <MapPin className="h-8 w-8 text-teal-500" />
              <div><p className="text-xs text-slate-400">Owned listings</p><p className="text-xl font-bold">{analytics.ownedPlaces}</p></div>
            </CardContent></Card>
            <Card><CardContent className="flex items-center gap-3 p-4">
              <Clock className="h-8 w-8 text-amber-500" />
              <div><p className="text-xs text-slate-400">Pending claims</p><p className="text-xl font-bold">{analytics.pendingClaims}</p></div>
            </CardContent></Card>
            <Card><CardContent className="flex items-center gap-3 p-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              <div><p className="text-xs text-slate-400">Approved claims</p><p className="text-xl font-bold">{analytics.approvedClaims}</p></div>
            </CardContent></Card>
          </div>

          {!profile && (
            <Card><CardContent className="py-8 text-center">
              <p className="mb-3 text-slate-500">Register your business to claim places and update listings.</p>
              <Button onClick={() => setTab('profile')}>Create business profile</Button>
            </CardContent></Card>
          )}

          {profile && (
            <Card><CardContent className="p-4">
              <h2 className="mb-1 font-semibold">{profile.business_name}</h2>
              <p className="text-sm text-slate-500">{profile.description || 'No description yet.'}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                {profile.phone && <span>{profile.phone}</span>}
                {profile.email && <span>{profile.email}</span>}
              </div>
            </CardContent></Card>
          )}

          <section>
            <h2 className="mb-2 text-sm font-semibold text-slate-500">Recent claims</h2>
            {claimsLoading && <p className="text-sm text-slate-400">Loading…</p>}
            {!claimsLoading && claims.length === 0 && (
              <p className="text-sm text-slate-500">No claims yet. Search and claim a place from the Claim tab.</p>
            )}
            <ul className="space-y-2">
              {claims.map((c) => (
                <li key={c.id} className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800">
                  {c.status === 'approved' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  {c.status === 'pending' && <Clock className="h-4 w-4 text-amber-500" />}
                  {c.status === 'rejected' && <XCircle className="h-4 w-4 text-red-500" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.place?.name ?? c.place_id}</p>
                    <p className="text-xs text-slate-400">{c.place?.address}</p>
                  </div>
                  {statusBadge(c.status)}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {tab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">
            {profile ? 'Update your business details. Status changes require admin review.' : 'Submit a profile. Status starts as pending until an admin approves.'}
          </p>
          <input required value={form.business_name} onChange={(e) => setForm((f) => ({ ...f, business_name: e.target.value }))}
            placeholder="Business name *" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          <input value={form.contact_name} onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
            placeholder="Contact name" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Phone"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
            <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </div>
          <input value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="Website"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Short description" rows={3}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          {profile && <p className="text-xs text-slate-400">Current status: {statusBadge(profile.status)}</p>}
          <Button type="submit" disabled={upsert.isPending}>{upsert.isPending ? 'Saving…' : profile ? 'Update profile' : 'Register business'}</Button>
        </form>
      )}

      {tab === 'claim' && (
        <div className="space-y-4">
          {!profile && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Create a business profile first so claims can be linked to your business.
              <Button size="sm" variant="outline" className="ml-2" onClick={() => setTab('profile')}>Profile</Button>
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input value={claimQuery} onChange={(e) => { setClaimQuery(e.target.value); setSelectedPlace(null) }}
              placeholder="Search published places by name…"
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </div>
          {searchResults.length > 0 && !selectedPlace && (
            <ul className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-800">
              {searchResults.map((p) => (
                <li key={p.id}>
                  <button type="button" className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={() => setSelectedPlace(p)}>
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                    <span><span className="font-medium">{p.name}</span>
                      {p.address && <span className="block text-xs text-slate-400">{p.address}</span>}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {selectedPlace && (
            <form onSubmit={handleClaim} className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm">Claiming: <strong>{selectedPlace.name}</strong></p>
              <textarea value={claimMessage} onChange={(e) => setClaimMessage(e.target.value)}
                placeholder="Why are you the owner? (optional proof note)" rows={3}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
              <div className="flex gap-2">
                <Button type="submit" disabled={claimMut.isPending || !profile}>{claimMut.isPending ? 'Submitting…' : 'Submit claim'}</Button>
                <Button type="button" variant="ghost" onClick={() => setSelectedPlace(null)}>Cancel</Button>
              </div>
              <p className="text-xs text-slate-400">Claims stay pending until a moderator approves. You cannot self-approve.</p>
            </form>
          )}
        </div>
      )}

      {tab === 'listings' && (
        <div className="space-y-3">
          {owned.length === 0 && (
            <Card><CardContent className="py-10 text-center text-sm text-slate-500">
              No owned listings yet. After a claim is approved, places linked to your business appear here.
              <div className="mt-3"><Button size="sm" variant="outline" onClick={() => setTab('claim')}>Claim a place</Button></div>
            </CardContent></Card>
          )}
          {owned.map((place) => (
            <Card key={place.id}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <Link to={`/places/${place.slug}`} className="font-semibold hover:text-sky-600">{place.name}</Link>
                    <p className="text-xs text-slate-400">{place.address}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => {
                    setEditPlaceId(editPlaceId === place.id ? null : place.id)
                    setEditPatch({ phone: place.phone ?? '', website: place.website ?? '', description: place.description ?? place.short_description ?? '' })
                  }}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                </div>
                {editPlaceId === place.id && (
                  <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <input value={editPatch.phone} onChange={(e) => setEditPatch((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone"
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                    <input value={editPatch.website} onChange={(e) => setEditPatch((p) => ({ ...p, website: e.target.value }))} placeholder="Website"
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                    <textarea value={editPatch.description} onChange={(e) => setEditPatch((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={3}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                    <Button size="sm" disabled={updatePlace.isPending} onClick={async () => {
                      try {
                        await updatePlace.mutateAsync({
                          placeId: place.id,
                          patch: { phone: editPatch.phone || undefined, website: editPatch.website || undefined, description: editPatch.description || undefined },
                        })
                        setEditPlaceId(null)
                      } catch (err) {
                        alert(err instanceof Error ? err.message : 'Update failed — claim may not be approved yet')
                      }
                    }}>Save listing</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
