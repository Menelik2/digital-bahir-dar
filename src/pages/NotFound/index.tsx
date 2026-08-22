import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useT } from '@/hooks/useT'

export default function NotFoundPage() {
  const t = useT()
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-sky-500">404</p>
      <h1 className="mt-4 text-xl font-semibold">{t.notFound.title}</h1>
      <p className="mt-2 text-sm text-slate-500">{t.notFound.body}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/">
          <Button>{t.nav.home}</Button>
        </Link>
        <Link to="/map">
          <Button variant="outline">{t.nav.map}</Button>
        </Link>
        <Link to="/explore">
          <Button variant="outline">{t.nav.explore}</Button>
        </Link>
      </div>
    </div>
  )
}
