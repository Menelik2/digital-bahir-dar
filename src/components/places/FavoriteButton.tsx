import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIsFavorited, useToggleFavorite } from '@/hooks/useFavorites'
import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { isOsmPlaceId } from '@/services/osmPlaces'

interface Props {
  placeId: string
  className?: string
  size?: 'sm' | 'default' | 'icon'
}

export function FavoriteButton({ placeId, className, size = 'default' }: Props) {
  const osm = isOsmPlaceId(placeId)
  const { isAuthenticated } = useAuth()
  const { data: favorited, isLoading } = useIsFavorited(osm ? undefined : placeId)
  const toggle = useToggleFavorite(placeId)

  if (osm) return null

  if (!isAuthenticated) {
    return (
      <Link to="/auth">
        <Button variant="outline" size={size === 'icon' ? 'icon' : size} className={className} title="Sign in to save">
          <Heart className="h-4 w-4" />
          {size !== 'icon' && <span>Save</span>}
        </Button>
      </Link>
    )
  }

  return (
    <Button
      variant="outline"
      size={size === 'icon' ? 'icon' : size}
      className={cn(className, favorited && 'border-rose-300 text-rose-600')}
      disabled={isLoading || toggle.isPending}
      onClick={() => toggle.mutate(!!favorited)}
      title={favorited ? 'Remove from saved' : 'Save place'}
    >
      <Heart className={cn('h-4 w-4', favorited && 'fill-rose-500 text-rose-500')} />
      {size !== 'icon' && <span>{favorited ? 'Saved' : 'Save'}</span>}
    </Button>
  )
}
