import { lazy, Suspense, useCallback, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { Layout } from '@/components/layout/Layout'
import { RealtimeProvider } from '@/components/realtime/RealtimeProvider'
import { StateMessage } from '@/components/feedback/StateMessage'
import { SplashScreen } from '@/components/splash/SplashScreen'
import { useT } from '@/hooks/useT'

const HomePage = lazy(() => import('@/pages/Home'))
const MapPage = lazy(() => import('@/pages/Map'))
const AuthPage = lazy(() => import('@/pages/Auth'))
const ExplorePage = lazy(() => import('@/pages/Explore'))
const DiscoverPage = lazy(() => import('@/pages/Discover'))
const CityHubPage = lazy(() => import('@/pages/City'))
const TodoPage = lazy(() => import('@/pages/Todo'))
const TodayPage = lazy(() => import('@/pages/Today'))
const HotelsPage = lazy(() => import('@/pages/Hotels'))
const RestaurantsPage = lazy(() => import('@/pages/Restaurants'))
const AttractionsPage = lazy(() => import('@/pages/Attractions'))
const BanksPage = lazy(() => import('@/pages/Banks'))
const TransportPage = lazy(() => import('@/pages/Transport'))
const EventsPage = lazy(() => import('@/pages/Events'))
const DirectoryPage = lazy(() => import('@/pages/Directory'))
const TripsPage = lazy(() => import('@/pages/Trips'))
const TripDetailPage = lazy(() => import('@/pages/Trips/TripDetail'))
const TripPlannerPage = lazy(() => import('@/pages/TripPlanner'))
const BudgetPage = lazy(() => import('@/pages/Budget'))
const SpendGuidePage = lazy(() => import('@/pages/SpendGuide'))
const ExpensesPage = lazy(() => import('@/pages/Expenses'))
const AIGuidePage = lazy(() => import('@/pages/AIGuide'))
const GuidesPage = lazy(() => import('@/pages/Guides'))
const ProfilePage = lazy(() => import('@/pages/Profile'))
const BusinessPage = lazy(() => import('@/pages/Business'))
const AdminPage = lazy(() => import('@/pages/Admin'))
const AdminEventsPage = lazy(() => import('@/pages/Admin/Events'))
const PlaceDetailsPage = lazy(() => import('@/pages/PlaceDetails'))
const NotFoundPage = lazy(() => import('@/pages/NotFound'))

function PageFallback() {
  const t = useT()
  return <StateMessage variant="loading" title={t.common.loading} />
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false)
  const onSplashDone = useCallback(() => setSplashDone(true), [])

  return (
    <QueryClientProvider client={queryClient}>
      {/* Flash animation before website opens */}
      <SplashScreen onDone={onSplashDone} />

      <div
        className={splashDone ? 'app-reveal' : 'app-hidden'}
        aria-hidden={!splashDone}
      >
        <BrowserRouter>
          <RealtimeProvider>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/city" element={<CityHubPage />} />
                  <Route path="/todo" element={<TodoPage />} />
                  <Route path="/today" element={<TodayPage />} />
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
                  <Route path="/trip-planner" element={<TripPlannerPage />} />
                  <Route path="/budget" element={<BudgetPage />} />
                  <Route path="/spend-guide" element={<SpendGuidePage />} />
                  <Route path="/expenses" element={<ExpensesPage />} />
                  <Route path="/ai-guide" element={<AIGuidePage />} />
                  <Route path="/guides" element={<GuidesPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/business" element={<BusinessPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/admin/events" element={<AdminEventsPage />} />
                  <Route path="/places/:slug" element={<PlaceDetailsPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
          </RealtimeProvider>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  )
}
