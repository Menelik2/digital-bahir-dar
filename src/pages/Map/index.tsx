import { useEffect } from 'react'
import { MapPin, Navigation, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'

export default function MapPage() {
  const { location, setLocation, mapCenter } = useAppStore()

  useEffect(() => {
    if (!navigator.geolocation) { setLocation({ permission: 'unsupported' }); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy, permission: 'granted', lastUpdated: Date.now() }),
      () => setLocation({ permission: 'denied' }),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [setLocation])

  return (
    <div className="relative h-[calc(100dvh-4rem)]">
      <div className="absolute left-4 right-4 top-4 z-10 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <Search className="h-5 w-5 text-slate-400" />
          <input type="search" placeholder="Search places in Bahir Dar..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" />
        </div>
        <Button size="icon" variant="outline" className="h-11 w-11 shrink-0 rounded-xl bg-white shadow-lg"><Filter className="h-5 w-5" /></Button>
      </div>
      <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="max-w-sm px-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-950"><MapPin className="h-8 w-8 text-sky-600" /></div>
          <h2 className="mb-2 text-lg font-semibold">Digital Bahir Dar Map</h2>
          <p className="mb-4 text-sm text-slate-500">Interactive Google Maps (Phase 2). Add VITE_GOOGLE_MAPS_API_KEY to enable.</p>
          <p className="mb-4 text-xs text-slate-400">Center: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</p>
          {location.permission === 'granted' && location.latitude && <p className="text-sm text-emerald-600">📍 You are here: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>}
          {location.permission === 'denied' && <p className="text-sm text-amber-600">Location denied — you can still search.</p>}
          <Button className="mt-4" size="sm"><Navigation className="h-4 w-4" /> Use my location</Button>
        </div>
      </div>
      <div className="absolute bottom-24 left-0 right-0 z-10 overflow-x-auto px-4 lg:bottom-6">
        <div className="flex gap-2 pb-2">
          {['Near Me', 'Hotels', 'Food', 'Attractions', 'Banks', 'ATM', 'Taxi'].map((c) => (
            <button key={c} className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-md dark:border-slate-700 dark:bg-slate-900">{c}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
