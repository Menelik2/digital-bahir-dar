import { PlaceListPage } from '@/components/places/PlaceListPage'
import { LocalTourismPanel } from '@/components/tourism/LocalTourismPanel'
import { useT } from '@/hooks/useT'

export default function AttractionsPage() {
  const t = useT()
  const isAm = typeof document !== 'undefined' && document.documentElement.lang === 'am'

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <LocalTourismPanel amharic={isAm} />
      </section>

      <PlaceListPage
        title={t.pages.attractionsTitle}
        subtitle={t.pages.attractionsSubtitle}
        categorySlug="attraction"
        osmCategories={['attraction']}
        emptyMessage={t.pages.attractionsEmpty}
      />
    </div>
  )
}
