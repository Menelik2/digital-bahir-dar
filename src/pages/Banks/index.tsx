import { PlaceListPage } from '@/components/places/PlaceListPage'

export default function BanksPage() {
  return (
    <PlaceListPage
      title="Banks & ATMs"
      subtitle="Bank branches and cash points — app listings plus OpenStreetMap"
      categorySlug="bank"
      osmCategories={['bank', 'atm']}
      filters={[{ id: 'atm', label: 'ATMs' }]}
      emptyMessage="No bank or ATM listings yet. Try Discover or Google Maps for cash points."
    />
  )
}
