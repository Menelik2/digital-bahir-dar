import { Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGeolocation } from '@/hooks/useGeolocation'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  onLocated?: (lat: number, lng: number) => void
}

export function LocationButton({ className, onLocated }: Props) {
  const { location, request, hasFix } = useGeolocation(false)

  const handleClick = () => {
    request()
    if (hasFix && location.latitude && location.longitude) {
      onLocated?.(location.latitude, location.longitude)
    }
  }

  return (
    <Button
      size="icon"
      variant="outline"
      className={cn('h-11 w-11 rounded-xl bg-white shadow-lg dark:bg-slate-900', className)}
      onClick={handleClick}
      title="My location"
      aria-label="Use my location"
    >
      <Navigation className={cn('h-5 w-5', hasFix && 'text-sky-600')} />
    </Button>
  )
}
