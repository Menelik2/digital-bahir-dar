import { PlaceListPage } from '@/components/places/PlaceListPage'

export default function RestaurantsPage() {
  return (
    <PlaceListPage
      title="Restaurants"
      subtitle="Where to eat in Bahir Dar — app listings + OpenStreetMap cafés & restaurants"
      categorySlug="restaurant"
      osmCategories={['restaurant', 'cafe']}
      filters={[
        { id: 'traditional', label: 'Traditional Ethiopian' },
        { id: 'vegetarian', label: 'Vegetarian' },
      ]}
      emptyMessage="No restaurants found yet. Open Discover for live map food places."
    />
  )
}
