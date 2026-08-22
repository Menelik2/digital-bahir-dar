import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { Layout } from '@/components/layout/Layout'
import { RealtimeProvider } from '@/components/realtime/RealtimeProvider'
import HomePage from '@/pages/Home'
import MapPage from '@/pages/Map'
import AuthPage from '@/pages/Auth'
import ExplorePage from '@/pages/Explore'
import DiscoverPage from '@/pages/Discover'
import CityHubPage from '@/pages/City'
import TodoPage from '@/pages/Todo'
import HotelsPage from '@/pages/Hotels'
import RestaurantsPage from '@/pages/Restaurants'
import AttractionsPage from '@/pages/Attractions'
import BanksPage from '@/pages/Banks'
import TransportPage from '@/pages/Transport'
import EventsPage from '@/pages/Events'
import DirectoryPage from '@/pages/Directory'
import TripsPage from '@/pages/Trips'
import TripDetailPage from '@/pages/Trips/TripDetail'
import BudgetPage from '@/pages/Budget'
import AIGuidePage from '@/pages/AIGuide'
import GuidesPage from '@/pages/Guides'
import ProfilePage from '@/pages/Profile'
import BusinessPage from '@/pages/Business'
import AdminPage from '@/pages/Admin'
import PlaceDetailsPage from '@/pages/PlaceDetails'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RealtimeProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/city" element={<CityHubPage />} />
              <Route path="/todo" element={<TodoPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/hotels" element={<HotelsPage />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route path="/attractions" element={<AttractionsPage />} />
              <Route path="/banks" element={<BanksPage />} />
              <Route path="/transport" element={<TransportPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/trips/:tripId" element={<TripDetailPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/ai-guide" element={<AIGuidePage />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/business" element={<BusinessPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/places/:slug" element={<PlaceDetailsPage />} />
              <Route path="/auth" element={<AuthPage />} />
            </Route>
          </Routes>
        </RealtimeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
