import { PlaceListPage } from '@/components/places/PlaceListPage'
import { useT } from '@/hooks/useT'

export default function AttractionsPage() {
  const t = useT()
  return (
    <PlaceListPage
      title={t.pages.attractionsTitle}
      subtitle={t.pages.attractionsSubtitle}
      categorySlug="attraction"
      osmCategories={['attraction']}
      emptyMessage={t.pages.attractionsEmpty}
    />
  )
}
