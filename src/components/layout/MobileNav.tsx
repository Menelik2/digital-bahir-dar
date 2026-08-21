import { Link, useLocation } from 'react-router-dom'
import { Home, Compass, Map, Calendar, User, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Compass, label: 'Explore' },
  { path: '/map', icon: Map, label: 'Map' },
  { path: '/trips', icon: Calendar, label: 'Trips' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export function MobileNav() {
  const location = useLocation()
  return (
    <>
      <Link to="/ai-guide" className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-teal-600 text-white shadow-lg lg:hidden" aria-label="AI Guide">
        <Sparkles className="h-6 w-6" />
      </Link>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-950/95">
        <div className="flex items-center justify-around px-2 py-1">
          {items.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path
            return (
              <Link key={path} to={path} className={cn('flex flex-1 flex-col items-center gap-0.5 rounded-lg py-2 text-xs font-medium', active ? 'text-sky-600' : 'text-slate-500')}>
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
