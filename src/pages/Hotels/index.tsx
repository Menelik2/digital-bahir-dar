import { PlaceListPage } from '@/components/places/PlaceListPage'

export default function HotelsPage() {
  return (
    <PlaceListPage
      title="Hotels"
      subtitle="Places to stay in Bahir Dar — verified app listings plus live OpenStreetMap"
      categorySlug="hotel"
      osmCategories={['hotel']}
      filters={[
        { id: 'budget', label: 'Budget' },
        { id: 'mid', label: 'Mid-range' },
        { id: 'luxury', label: 'Luxury' },
      ]}
      emptyMessage="No hotels found. Try Discover or check Google Maps for Bahir Dar lodging."
    />
  )
}
