import { Link } from 'react-router-dom'
import { LogOut, Heart, MapPin, User, Globe, Coins, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PlaceCard } from '@/components/places/PlaceCard'
import { useAuth } from '@/hooks/useAuth'
import { useFavorites } from '@/hooks/useFavorites'
import { useAppStore } from '@/store'
import { useT } from '@/hooks/useT'

export default function ProfilePage() {
  const t = useT()
  const { user, loading, signOut, isAuthenticated } = useAuth()
  const { data: favorites = [], isLoading: favLoading } = useFavorites()
  const { language, setLanguage, currency, setCurrency } = useAppStore()

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <User className="mx-auto mb-4 h-12 w-12 text-slate-300" />
        <h1 className="mb-2 text-2xl font-bold">{t.profile.title}</h1>
        <p className="mb-6 text-slate-500">{t.profile.signInPrompt}</p>
        <Link to="/auth?redirect=%2Fprofile">
          <Button size="lg">{t.profile.loginRegister}</Button>
        </Link>
      </div>
    )
  }

  const displayName =
    (user?.user_metadata?.full_name as string) || user?.email?.split('@')[0] || t.profile.traveler

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-2xl font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold">{displayName}</h1>
          <p className="truncate text-sm text-slate-500">{user?.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          <LogOut className="h-4 w-4" /> {t.profile.logOut}
        </Button>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">{t.profile.preferences}</h2>
        <Card>
          <CardContent className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-slate-400" /> {t.profile.language}
              </span>
              <div className="flex gap-2">
                {(['en', 'am'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLanguage(l)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                      language === l ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    {l === 'en' ? 'English' : 'አማርኛ'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Coins className="h-4 w-4 text-slate-400" /> {t.profile.currency}
              </span>
              <div className="flex gap-1">
                {(['ETB', 'USD', 'EUR', 'GBP'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                      currency === c ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Heart className="h-5 w-5 text-rose-500" /> {t.profile.savedPlaces}
          </h2>
          <span className="text-sm text-slate-400">{favorites.length}</span>
        </div>
        {favLoading && <p className="text-sm text-slate-500">{t.common.loading}</p>}
        {!favLoading && favorites.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center py-10 text-center">
              <MapPin className="mb-2 h-8 w-8 text-slate-300" />
              <p className="text-sm text-slate-500">{t.profile.noSaved}</p>
              <Link to="/explore" className="mt-3">
                <Button size="sm" variant="outline">
                  {t.profile.explorePlaces}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {favorites.map((f) =>
            f.place ? <PlaceCard key={f.id} place={f.place} variant="compact" /> : null
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">{t.profile.quickLinks}</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { to: '/trips', label: t.profile.myTrips },
            { to: '/map', label: t.nav.map },
            { to: '/explore', label: t.nav.explore },
            { to: '/ai-guide', label: t.nav.aiGuide },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
