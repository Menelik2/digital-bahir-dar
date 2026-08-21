import { Link, useLocation } from 'react-router-dom'
import { MapPin, Menu, X, Globe } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'
import { APP_NAME } from '@/constants'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/explore', label: 'Explore' },
  { path: '/map', label: 'Map' },
  { path: '/hotels', label: 'Hotels' },
  { path: '/restaurants', label: 'Restaurants' },
  { path: '/attractions', label: 'Attractions' },
  { path: '/trips', label: 'Trips' },
  { path: '/ai-guide', label: 'AI Guide' },
]

export function Header() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { language, setLanguage } = useAppStore()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-sky-600">
          <MapPin className="h-6 w-6" />
          <span className="hidden sm:inline">{APP_NAME}</span>
          <span className="sm:hidden">DBD</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={cn('rounded-lg px-3 py-2 text-sm font-medium transition-colors', location.pathname === item.path ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-100')}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setLanguage(language === 'en' ? 'am' : 'en')} title="Language">
            <Globe className="h-5 w-5" />
          </Button>
          <Link to="/auth"><Button size="sm" className="hidden sm:inline-flex">Log in</Button></Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden dark:border-slate-800 dark:bg-slate-950">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={cn('rounded-lg px-3 py-2.5 text-sm font-medium', location.pathname === item.path ? 'bg-sky-50 text-sky-700' : 'text-slate-600')}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
