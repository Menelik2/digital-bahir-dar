import { PlaceListPage } from '@/components/places/PlaceListPage'

export default function TransportPage() {
  return (
    <PlaceListPage
      title="Transport"
      subtitle="Taxi, minibus, boat and other options — prices are estimates unless verified"
      categorySlug="transport"
      emptyMessage="No transport providers listed yet. Contact verified local operators."
    />
  )
}
