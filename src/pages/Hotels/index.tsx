import { PlaceListPage } from '@/components/places/PlaceListPage'

export default function HotelsPage() {
  return (
    <PlaceListPage
      title="Hotels"
      subtitle="Places to stay in Bahir Dar — verified listings when available"
      categorySlug="hotel"
      filters={[
        { id: 'budget', label: 'Budget' },
        { id: 'mid', label: 'Mid-range' },
        { id: 'luxury', label: 'Luxury' },
      ]}
      emptyMessage="No hotel listings yet. Administrators will add verified hotels."
    />
  )
}
