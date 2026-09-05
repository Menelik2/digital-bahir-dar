import { Link } from 'react-router-dom'
import {
  LogOut, Heart, MapPin, User, Globe, Coins, Loader2, ChevronRight,
  Route, Compass, Bot, Map as MapIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PlaceCard } from '@/components/places/PlaceCard'
import { useAuth } from '@/hooks/useAuth'
import { useFavorites } from '@/hooks/useFavorites'
import { useAppStore } from '@/store'
import { useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const t = useT()
  const { user, loading, signOut, isAuthenticated } = useAuth()
  const { data: favorites = [], isLoading: favLoading } = useFavorites()
  const { language, setLanguage, currency, setCurrency } = useAppStore()

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#078930]" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f2f2f7] dark:bg-[#1c1c1e]">
          <User className="h-8 w-8 text-[#8e8e93]" />
        </div>
        <h1 className="ios-large-title mb-2 text-[#1c1c1e] dark:text-white sm:text-2xl sm:font-bold">
          {t.profile.title}
        </h1>
        <p className="mb-6 text-[15px] text-[#8e8e93]">{t.profile.signInPrompt}</p>
        <Link to="/auth?redirect=%2Fprofile">
          <Button size="lg" className="min-h-[48px] w-full max-w-xs rounded-full">
            {t.profile.loginRegister}
          </Button>
        </Link>
      </div>
    )
  }

  const displayName =
    (user?.user_metadata?.full_name as string) || user?.email?.split('@')[0] || t.profile.traveler

  return (
    <div className="mx-auto max-w-3xl bg-[#f2f2f7] px-4 py-6 pb-nav-safe dark:bg-black sm:py-8">
      {/* Large title + avatar */}
      <div className="mb-7 flex items-center gap-3.5">
        <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#078930] to-[#0b6e99] text-[22px] font-bold text-white shadow-md">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[22px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-xl">
            {displayName}
          </h1>
          <p className="truncate text-[14px] text-[#8e8e93]">{user?.email}</p>
        </div>
      </div>

      {/* Preferences */}
      <section className="ios-section">
        <p className="ios-section-label">{t.profile.preferences}</p>
        <div className="ios-group">
          <div className="ios-group-row justify-between">
            <span className="ios-group-icon bg-[#0b6e99]/12 text-[#0b6e99]">
              <Globe />
            </span>
            <span className="ios-group-label">{t.profile.language}</span>
            <div className="flex shrink-0 gap-1.5">
              {(['en', 'am'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLanguage(l)}
                  className={cn(
                    'min-h-[32px] rounded-full px-3 text-[13px] font-semibold transition',
                    language === l
                      ? 'bg-[#078930] text-white'
                      : 'bg-black/[0.05] text-[#3c3c43] dark:bg-white/10 dark:text-white/80'
                  )}
                >
                  {l === 'en' ? 'EN' : 'አማ'}
                </button>
              ))}
            </div>
          </div>
          <div className="ios-group-row justify-between">
            <span className="ios-group-icon bg-[#f5c518]/25 text-[#8a6d0b]">
              <Coins />
            </span>
            <span className="ios-group-label">{t.profile.currency}</span>
            <div className="flex shrink-0 flex-wrap justify-end gap-1">
              {(['ETB', 'USD', 'EUR', 'GBP'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={cn(
                    'min-h-[28px] rounded-full px-2.5 text-[12px] font-semibold',
                    currency === c
                      ? 'bg-[#078930] text-white'
                      : 'bg-black/[0.05] text-[#3c3c43] dark:bg-white/10 dark:text-white/80'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="ios-section">
        <p className="ios-section-label">{t.profile.quickLinks}</p>
        <div className="ios-group">
          {[
            {
              to: '/trips',
              label: t.profile.myTrips,
              icon: Route,
              tint: 'bg-[#078930]/12 text-[#078930]',
            },
            {
              to: '/map',
              label: t.nav.map,
              icon: MapIcon,
              tint: 'bg-[#0b6e99]/12 text-[#0b6e99]',
            },
            {
              to: '/explore',
              label: t.nav.explore,
              icon: Compass,
              tint: 'bg-[#0b6e99]/10 text-[#0a5a7e]',
            },
            {
              to: '/ai-guide',
              label: t.nav.aiGuide,
              icon: Bot,
              tint: 'bg-gradient-to-br from-[#078930]/15 to-[#0b6e99]/15 text-[#056b24]',
            },
          ].map((l) => (
            <Link key={l.to} to={l.to} className="ios-group-row">
              <span className={cn('ios-group-icon', l.tint)}>
                <l.icon />
              </span>
              <span className="ios-group-label font-normal">{l.label}</span>
              <ChevronRight className="ios-group-chevron" strokeWidth={2.25} />
            </Link>
          ))}
        </div>
      </section>

      {/* Saved places */}
      <section className="ios-section">
        <div className="mb-1.5 flex items-center justify-between px-4">
          <p className="ios-section-label !m-0 flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-rose-500" /> {t.profile.savedPlaces}
          </p>
          <span className="text-[13px] font-medium text-[#8e8e93]">{favorites.length}</span>
        </div>
        {favLoading && (
          <p className="py-6 text-center text-sm text-[#8e8e93]">{t.common.loading}</p>
        )}
        {!favLoading && favorites.length === 0 && (
          <div className="ios-group px-4 py-8 text-center">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-[#c7c7cc]" />
            <p className="text-[15px] text-[#8e8e93]">{t.profile.noSaved}</p>
            <Link to="/explore" className="mt-3 inline-block">
              <Button size="sm" variant="outline" className="rounded-full">
                {t.profile.explorePlaces}
              </Button>
            </Link>
          </div>
        )}
        <div className="grid gap-2.5 sm:grid-cols-2">
          {favorites.map((f) =>
            f.place ? <PlaceCard key={f.id} place={f.place} variant="compact" /> : null
          )}
        </div>
      </section>

      {/* Log out */}
      <div className="ios-group mb-2">
        <button type="button" onClick={() => signOut()} className="ios-group-row ios-group-row-destructive">
          <LogOut className="h-4 w-4" /> {t.profile.logOut}
        </button>
      </div>
    </div>
  )
}
