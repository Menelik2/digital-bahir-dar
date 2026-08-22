import { PlaceListPage } from '@/components/places/PlaceListPage'

export default function RestaurantsPage() {
  return (
    <PlaceListPage
      title="Restaurants"
      subtitle="Where to eat in Bahir Dar"
      categorySlug="restaurant"
      filters={[
        { id: 'traditional', label: 'Traditional Ethiopian' },
        { id: 'vegetarian', label: 'Vegetarian' },
      ]}
      emptyMessage="No restaurant listings yet. Verified places will appear here."
    />
  )
}
