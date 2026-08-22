import { PlaceListPage } from '@/components/places/PlaceListPage'

export default function BanksPage() {
  return (
    <PlaceListPage
      title="Banks & ATMs"
      subtitle="Bank branches and cash points"
      categorySlug="bank"
      filters={[{ id: 'atm', label: 'ATMs' }]}
      emptyMessage="No bank or ATM listings yet. Verified locations will appear here."
    />
  )
}
