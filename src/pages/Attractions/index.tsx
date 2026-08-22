import { PlaceListPage } from '@/components/places/PlaceListPage'

export default function AttractionsPage() {
  return (
    <PlaceListPage
      title="Attractions"
      subtitle="Lake Tana, Blue Nile Falls, monasteries & city sights"
      categorySlug="attraction"
      osmCategories={['attraction']}
      emptyMessage="No attractions listed yet. Use Discover or Wikivoyage for travel ideas."
    />
  )
}
