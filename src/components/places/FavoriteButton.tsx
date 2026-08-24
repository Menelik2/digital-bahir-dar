import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIsFavorited, useToggleFavorite } from '@/hooks/useFavorites'
import { useAuth } from '@/hooks/useAuth'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { isPersistedPlaceId } from '@/utils/placeId'

interface Props {
  placeId: string
  className?: string
  size?: 'sm' | 'default' | 'icon'
}

export function FavoriteButton({ placeId, className, size = 'default' }: Props) {
  const canPersist = isPersistedPlaceId(placeId)
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const { data: favorited, isLoading } = useIsFavorited(canPersist ? placeId : undefined)
  const toggle = useToggleFavorite(placeId)

  if (!canPersist) return null

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return (
      <Link to={`/auth?redirect=${redirect}`}>
        <Button
          variant="outline"
          size={size === 'icon' ? 'icon' : size}
          className={className}
          title="Sign in to save"
        >
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
