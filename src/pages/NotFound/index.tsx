import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-sky-500">404</p>
      <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">
        That route does not exist in Digital Bahir Dar.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/"><Button>Home</Button></Link>
        <Link to="/map"><Button variant="outline">Map</Button></Link>
        <Link to="/explore"><Button variant="outline">Explore</Button></Link>
      </div>
    </div>
  )
}
