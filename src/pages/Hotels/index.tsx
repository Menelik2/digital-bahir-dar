import { PlaceListPage } from '@/components/places/PlaceListPage'
import { useT } from '@/hooks/useT'

export default function HotelsPage() {
  const t = useT()
  return (
    <PlaceListPage
      title={t.pages.hotelsTitle}
      subtitle={t.pages.hotelsSubtitle}
      categorySlug="hotel"
      osmCategories={['hotel']}
      filters={[
        { id: 'budget', label: t.list.budget },
        { id: 'mid', label: t.list.midRange },
        { id: 'luxury', label: t.list.luxury },
      ]}
      emptyMessage={t.pages.hotelsEmpty}
    />
  )
}
