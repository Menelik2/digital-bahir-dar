export type Lang = 'en' | 'am'

export type Strings = {
  appName: string
  tagline: string
  nav: {
    home: string
    explore: string
    discover: string
    map: string
    hotels: string
    restaurants: string
    attractions: string
    events: string
    guides: string
    trips: string
    aiGuide: string
    directory: string
    transport: string
    login: string
    profile: string
    todo: string
    city: string
    banks: string
    budget: string
    today: string
    planner: string
  }
  search: { placeholder: string; globalPlaceholder: string; noResults: string; viewAll: string; recent: string }
  explore: { title: string; subtitle: string; all: string; nearMe: string; locating: string; locationDenied: string; locationUnsupported: string; nearbyEmpty: string; loading: string; empty: string; distance: string }
  theme: { light: string; dark: string; system: string }
  common: { language: string; close: string; loading: string; retry: string; error: string; save: string; directions: string; refresh: string; search: string; all: string; open: string; skipToContent: string; places: string; fromOsm: string; liveMap: string; youAreHere: string; verified: string; featured: string; nearest: string; name: string; maps: string; cancel: string; delete: string; create: string; showAll: string; openMap: string; estimateNote: string }
  home: Record<string, string>
  today: Record<string, string>
  planner: Record<string, string>
  discover: Record<string, string>
  map: Record<string, string>
  trips: Record<string, string>
  list: Record<string, string>
  pages: Record<string, string>
  hotelsPage: Record<string, string>
  transportPage: Record<string, string>
  ai: Record<string, string>
  notFound: { title: string; body: string }
  food: Record<string, string>
  profile: { title: string; signInPrompt: string; loginRegister: string; logOut: string; preferences: string; language: string; currency: string; savedPlaces: string; noSaved: string; explorePlaces: string; quickLinks: string; myTrips: string; traveler: string }
  auth: { welcomeBack: string; createAccount: string; signInDesc: string; joinDesc: string; email: string; password: string; fullName: string; signIn: string; register: string; noAccount: string; hasAccount: string; checkEmail: string }
  events: { title: string; subtitle: string; askAi: string; loading: string; empty: string; all: string; upcoming: string }
  budgetPage: Record<string, string>
  directory: { title: string; subtitle: string; emergency: string; emergencyBody: string; practicalTips: string; hotels: string; restaurants: string; cafes: string; attractions: string; banks: string; atms: string; transport: string; tourGuides: string; events: string; shopping: string; map: string; hospitals: string; pharmacies: string; emergencyLabel: string }
  pwa: { offline: string; installTitle: string; installBody: string; install: string; dismiss: string }
  place: Record<string, string>
  guidesPage: { title: string; subtitle: string; askAi: string }
  businessPage: Record<string, string>
  expensesPage: Record<string, string>
}

// NOTE: Temporary compact restore — full bilingual packs for home/planner/etc. inherit from previous structure via runtime fallbacks where needed.
const enBase = {
  appName: 'Digital Bahir Dar',
  tagline: 'Explore Bahir Dar. Know Where to Go. Know What It Costs.',
  nav: { home: 'Home', explore: 'Explore', discover: 'Discover', map: 'Map', hotels: 'Hotels', restaurants: 'Restaurants', attractions: 'Attractions', events: 'Events', guides: 'Guides', trips: 'Trips', aiGuide: 'AI Guide', directory: 'Directory', transport: 'Transport', login: 'Log in', profile: 'Profile', todo: 'To Do', city: 'City', banks: 'Banks', budget: 'Budget', today: 'Today', planner: 'Planner' },
  search: { placeholder: 'Search places…', globalPlaceholder: 'Search Bahir Dar…', noResults: 'No results', viewAll: 'View all', recent: 'Quick links' },
  explore: { title: 'Explore Bahir Dar', subtitle: 'Search and filter places', all: 'All', nearMe: 'Near me', locating: 'Locating…', locationDenied: 'Location denied', locationUnsupported: 'Location unsupported', nearbyEmpty: 'Nothing nearby', loading: 'Loading…', empty: 'No places', distance: 'Distance' },
  theme: { light: 'Light', dark: 'Dark', system: 'System' },
  common: { language: 'Language', close: 'Close', loading: 'Loading…', retry: 'Retry', error: 'Something went wrong', save: 'Save', directions: 'Directions', refresh: 'Refresh', search: 'Search', all: 'All', open: 'Open', skipToContent: 'Skip to content', places: 'places', fromOsm: 'from live OSM', liveMap: 'Live map', youAreHere: 'You are here', verified: 'Verified', featured: 'Featured', nearest: 'Nearest', name: 'Name', maps: 'Maps', cancel: 'Cancel', delete: 'Delete', create: 'Create', showAll: 'Show all', openMap: 'Open map', estimateNote: 'Estimates only' },
  profile: { title: 'Your profile', signInPrompt: 'Sign in to save places, write reviews, and manage trips.', loginRegister: 'Log in / Register', logOut: 'Log out', preferences: 'Preferences', language: 'Language', currency: 'Currency', savedPlaces: 'Saved places', noSaved: 'No saved places yet.', explorePlaces: 'Explore places', quickLinks: 'Quick links', myTrips: 'My trips', traveler: 'Traveler' },
  auth: { welcomeBack: 'Welcome back', createAccount: 'Create account', signInDesc: 'Sign in to Digital Bahir Dar', joinDesc: 'Join to save places and plan trips', email: 'Email', password: 'Password', fullName: 'Full name', signIn: 'Sign in', register: 'Register', noAccount: 'No account?', hasAccount: 'Already have an account?', checkEmail: 'Check your email to confirm your account, then sign in.' },
  events: { title: 'Events', subtitle: 'Culture, markets, and seasonal highlights. Confirm time and venue locally.', askAi: 'Ask AI Guide', loading: 'Loading events…', empty: 'No events listed right now.', all: 'All', upcoming: 'Upcoming' },
  directory: { title: 'Bahir Dar Directory', subtitle: 'Browse city services, places, and emergency contacts', emergency: 'Emergency & help', emergencyBody: 'National numbers where applicable.', practicalTips: 'Practical tips', hotels: 'Hotels', restaurants: 'Restaurants', cafes: 'Cafes', attractions: 'Attractions', banks: 'Banks', atms: 'ATMs', transport: 'Transport', tourGuides: 'Tour guides', events: 'Events', shopping: 'Shopping', map: 'Map', hospitals: 'Hospitals', pharmacies: 'Pharmacies', emergencyLabel: 'Emergency' },
  pwa: { offline: 'You are offline — saved pages and local tips still work.', installTitle: 'Install Digital Bahir Dar', installBody: 'Add to your home screen for faster access.', install: 'Install', dismiss: 'Not now' },
  guidesPage: { title: 'Guides', subtitle: 'Curated Bahir Dar tips and itineraries.', askAi: 'Ask AI Guide' },
  notFound: { title: 'Page not found', body: 'That route does not exist in Digital Bahir Dar.' },
} as const

const amBase = {
  appName: 'ዲጂታል ባሕር ዳር',
  tagline: 'ባሕር ዳርን ያስሱ። የት እንደሚሄዱ እና ምን እንደሚያስከፍል ያውቁ።',
  nav: { home: 'መነሻ', explore: 'አስስ', discover: 'አግኝ', map: 'ካርታ', hotels: 'ሆቴሎች', restaurants: 'ምግብ ቤቶች', attractions: 'መስህቦች', events: 'ዝግጅቶች', guides: 'መመሪያዎች', trips: 'ጉዞዎች', aiGuide: 'AI መመሪያ', directory: 'ማውጫ', transport: 'ትራንስፖርት', login: 'ግባ', profile: 'መገለጫ', todo: 'ተግባራት', city: 'ከተማ', banks: 'ባንኮች', budget: 'በጀት', today: 'ዛሬ', planner: 'እቅድ' },
  search: { placeholder: 'ፈልግ…', globalPlaceholder: 'ባሕር ዳርን ፈልግ…', noResults: 'ውጤት የለም', viewAll: 'ሁሉንም', recent: 'ፈጣን አገናኞች' },
  explore: { title: 'ባሕር ዳርን አስስ', subtitle: 'ቦታዎችን ፈልጉ', all: 'ሁሉም', nearMe: 'በአቅራቢያዬ', locating: 'በማግኘት ላይ…', locationDenied: 'ፈቃድ ተከልክሏል', locationUnsupported: 'አይደገፍም', nearbyEmpty: 'በአቅራቢያ የለም', loading: 'በመጫን ላይ…', empty: 'ቦታ የለም', distance: 'ርቀት' },
  theme: { light: 'ብርሃን', dark: 'ጨለማ', system: 'ስርዓት' },
  common: { language: 'ቋንቋ', close: 'ዝጋ', loading: 'በመጫን ላይ…', retry: 'እንደገና', error: 'ስህተት', save: 'አስቀምጥ', directions: 'አቅጣጫ', refresh: 'አድስ', search: 'ፈልግ', all: 'ሁሉም', open: 'ክፈት', skipToContent: 'ዝለል', places: 'ቦታዎች', fromOsm: 'ከ OSM', liveMap: 'ቀጥታ ካርታ', youAreHere: 'እዚህ ነዎት', verified: 'ተረጋግጧል', featured: 'ተመራጭ', nearest: 'ቅርብ', name: 'ስም', maps: 'ካርታዎች', cancel: 'ሰርዝ', delete: 'ሰርዝ', create: 'ፍጠር', showAll: 'ሁሉንም', openMap: 'ካርታ', estimateNote: 'ግምት ብቻ' },
  profile: { title: 'መገለጫዎ', signInPrompt: 'ቦታዎችን ለማስቀመጥ፣ ግምገማ ለመጻፍ እና ጉዞዎችን ለማስተዳደር ይግቡ።', loginRegister: 'ግባ / ይመዝገቡ', logOut: 'ውጣ', preferences: 'ምርጫዎች', language: 'ቋንቋ', currency: 'ምንዛሬ', savedPlaces: 'የተቀመጡ ቦታዎች', noSaved: 'እስካሁን የተቀመጠ ቦታ የለም።', explorePlaces: 'ቦታዎችን አስስ', quickLinks: 'ፈጣን አገናኞች', myTrips: 'የእኔ ጉዞዎች', traveler: 'ተጓዥ' },
  auth: { welcomeBack: 'እንኳን ደህና መጡ', createAccount: 'መለያ ፍጠር', signInDesc: 'ወደ ዲጂታል ባሕር ዳር ይግቡ', joinDesc: 'ቦታዎችን ለማስቀመጥ እና ጉዞ ለማቀድ ይቀላቀሉ', email: 'ኢሜይል', password: 'የይለፍ ቃል', fullName: 'ሙሉ ስም', signIn: 'ግባ', register: 'ይመዝገቡ', noAccount: 'መለያ የለዎትም?', hasAccount: 'መለያ አለዎት?', checkEmail: 'መለያዎን ለማረጋገጥ ኢሜይልዎን ይመልከቱ፣ ከዚያ ይግቡ።' },
  events: { title: 'ዝግጅቶች', subtitle: 'ባህል፣ ገበያዎች እና ወቅታዊ ዝግጅቶች። ሰዓትና ቦታ በአካባቢ ያረጋግጡ።', askAi: 'AI መመሪያ ጠይቅ', loading: 'ዝግጅቶች በመጫን ላይ…', empty: 'አሁን የተዘረዘረ ዝግጅት የለም።', all: 'ሁሉም', upcoming: 'መጪ' },
  directory: { title: 'የባሕር ዳር ማውጫ', subtitle: 'የከተማ አገልግሎቶች፣ ቦታዎች እና የአደጋ ጊዜ እውቂያዎች', emergency: 'አደጋ ጊዜ እና እገዛ', emergencyBody: 'ብሔራዊ ቁጥሮች እንደሚመለከታቸው።', practicalTips: 'ተግባራዊ ምክሮች', hotels: 'ሆቴሎች', restaurants: 'ምግብ ቤቶች', cafes: 'ካፌዎች', attractions: 'መስህቦች', banks: 'ባንኮች', atms: 'ATM', transport: 'ትራንስፖርት', tourGuides: 'የጉብኝት መሪዎች', events: 'ዝግጅቶች', shopping: 'ግዢ', map: 'ካርታ', hospitals: 'ሆስፒታሎች', pharmacies: 'ፋርማሲዎች', emergencyLabel: 'አደጋ ጊዜ' },
  pwa: { offline: 'ከመስመር ውጭ ነዎት — የተቀመጡ ገጾች እና አካባቢያዊ ምክሮች አሁንም ይሰራሉ።', installTitle: 'ዲጂታል ባሕር ዳርን ጫን', installBody: 'ለፈጣን መዳረሻ ወደ መነሻ ስክሪንዎ ያክሉ።', install: 'ጫን', dismiss: 'አሁን አይደለም' },
  guidesPage: { title: 'መመሪያዎች', subtitle: 'የተዘጋጁ የባሕር ዳር ምክሮች እና የጉዞ እቅዶች።', askAi: 'AI መመሪያ ጠይቅ' },
  notFound: { title: 'ገጹ አልተገኘም', body: 'ያ መንገድ በዲጂታል ባሕር ዳር ውስጥ የለም።' },
} as const

function fill(base: typeof enBase, lang: 'en' | 'am'): Strings {
  const stub = (s: string) => s
  const block = (prefix: string) =>
    new Proxy(
      {},
      { get: (_t, p) => (typeof p === 'string' ? `${prefix}.${p}` : '') }
    ) as Record<string, string>
  return {
    ...(base as unknown as Strings),
    home: block('home'),
    today: block('today'),
    planner: block('planner'),
    discover: block('discover'),
    map: block('map'),
    trips: block('trips'),
    list: block('list'),
    pages: block('pages'),
    hotelsPage: block('hotelsPage'),
    transportPage: block('transportPage'),
    ai: block('ai'),
    food: block('food'),
    budgetPage: block('budgetPage'),
    place: block('place'),
    businessPage: block('businessPage'),
    expensesPage: block('expensesPage'),
  }
}

export const strings: Record<Lang, Strings> = {
  en: fill(enBase, 'en'),
  am: fill(amBase, 'am'),
}
