import { PlaceListPage } from '@/components/places/PlaceListPage'

export default function AttractionsPage() {
  return (
    <PlaceListPage
      title="Attractions"
      subtitle="Things to do and see in Bahir Dar"
      categorySlug="attraction"
      filters={[
        { id: 'nature', label: 'Nature' },
        { id: 'culture', label: 'Culture' },
        { id: 'history', label: 'History' },
      ]}
      emptyMessage="No attractions listed yet. Lake Tana and Blue Nile Falls will appear once verified."
    />
  )
}
