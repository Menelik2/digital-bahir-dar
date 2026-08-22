import { PlaceListPage } from '@/components/places/PlaceListPage'
import { useT } from '@/hooks/useT'

export default function BanksPage() {
  const t = useT()
  return (
    <PlaceListPage
      title={t.pages.banksTitle}
      subtitle={t.pages.banksSubtitle}
      categorySlug="bank"
      osmCategories={['bank', 'atm']}
      filters={[{ id: 'atm', label: 'ATM' }]}
      emptyMessage={t.pages.banksEmpty}
    />
  )
}
