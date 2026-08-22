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
  }
  search: {
    placeholder: string
    globalPlaceholder: string
    noResults: string
    viewAll: string
    recent: string
  }
  explore: {
    title: string
    subtitle: string
    all: string
    nearMe: string
    locating: string
    locationDenied: string
    locationUnsupported: string
    nearbyEmpty: string
    loading: string
    empty: string
    distance: string
  }
  theme: { light: string; dark: string; system: string }
  common: {
    language: string
    close: string
    loading: string
    retry: string
    error: string
    save: string
    directions: string
    refresh: string
    search: string
    all: string
    open: string
    skipToContent: string
    places: string
    fromOsm: string
    liveMap: string
    youAreHere: string
    verified: string
    featured: string
    nearest: string
    name: string
    maps: string
    cancel: string
    delete: string
    create: string
  }
  home: {
    badge: string
    title: string
    thingsToDo: string
    smartCity: string
    cityServices: string
    happening: string
    allEvents: string
    featured: string
    lakeTana: string
    lakeTanaDesc: string
    blueNileFalls: string
    blueNileFallsDesc: string
    checklist: string
    checklistDone: string
    travelSmart: string
    fullDirectory: string
    fares: string
    emergency: string
    budget: string
    map: string
    ctaTitle: string
    ctaBody: string
    startChecklist: string
    openSmartCity: string
  }
  discover: {
    title: string
    subtitle: string
    osmCredit: string
    refresh: string
    searchPlaceholder: string
    placesCount: string
    updatingOsm: string
    fromLiveOsm: string
    guideSites: string
    guideSitesBody: string
    googleMapsCat: string
    osmSearch: string
    loadFail: string
    loadFailPartial: string
    empty: string
    hotels: string
    restaurants: string
    cafes: string
    sights: string
    transport: string
    banks: string
    atms: string
    health: string
  }
  map: {
    searchPlaceholder: string
    liveMap: string
    mapboxTiles: string
    osmOn: string
    osmOff: string
    places: string
    osmSlow: string
    osmSlowBody: string
    retryOsm: string
    loadFail: string
    loading: string
    footer: string
  }
  trips: {
    title: string
    subtitle: string
    readyMade: string
    readyMadeBody: string
    yourTrips: string
    newTrip: string
    loginToSave: string
    loginBody: string
    noTrips: string
    guide: string
  }
  list: {
    includesOsm: string
    discoverLive: string
    refreshMaps: string
    searchPrefix: string
    loadingPlaces: string
    loadFail: string
    tryDiscover: string
    fromOsmCount: string
    budget: string
    midRange: string
    luxury: string
    traditional: string
    vegetarian: string
  }
  pages: {
    hotelsTitle: string
    hotelsSubtitle: string
    hotelsEmpty: string
    restaurantsTitle: string
    restaurantsSubtitle: string
    restaurantsEmpty: string
    attractionsTitle: string
    attractionsSubtitle: string
    attractionsEmpty: string
    banksTitle: string
    banksSubtitle: string
    banksEmpty: string
    transportTitle: string
    transportSubtitle: string
    transportEmpty: string
    typicalFares: string
    findRoutes: string
    googleTransport: string
    liveOsmTransport: string
  }
  ai: {
    title: string
    demoMode: string
    liveMode: string
    thinking: string
    placeholder: string
    welcome: string
    error: string
    reset: string
  }
  notFound: {
    title: string
    body: string
  }
  food: {
    localGuide: string
    whatToEat: string
    whatToEatBody: string
    neighborhoods: string
    recommended: string
    etiquette: string
    foodSafety: string
    allPicks: string
    allPicksBody: string
    mustTry: string
    tip: string
    openInApp: string
  }
}

const en: Strings = {
  appName: 'Digital Bahir Dar',
  tagline: 'Explore Bahir Dar. Know Where to Go. Know What It Costs.',
  nav: {
    home: 'Home',
    explore: 'Explore',
    discover: 'Discover',
    map: 'Map',
    hotels: 'Hotels',
    restaurants: 'Restaurants',
    attractions: 'Attractions',
    events: 'Events',
    guides: 'Guides',
    trips: 'Trips',
    aiGuide: 'AI Guide',
    directory: 'Directory',
    transport: 'Transport',
    login: 'Log in',
    profile: 'Profile',
    todo: 'To Do',
    city: 'City',
    banks: 'Banks',
    budget: 'Budget',
  },
  search: {
    placeholder: 'Search places, hotels, food, ATMs…',
    globalPlaceholder: 'Search Bahir Dar…',
    noResults: 'No results',
    viewAll: 'View all results',
    recent: 'Quick links',
  },
  explore: {
    title: 'Explore Bahir Dar',
    subtitle: 'Search places, filter by category, or find what’s nearby',
    all: 'All',
    nearMe: 'Near me',
    locating: 'Getting your location…',
    locationDenied: 'Location permission denied. Enable it in browser settings.',
    locationUnsupported: 'Geolocation is not supported on this device.',
    nearbyEmpty: 'No places within range. Try a wider search or turn off Near me.',
    loading: 'Loading…',
    empty: 'No places match your search.',
    distance: 'Distance',
  },
  theme: { light: 'Light', dark: 'Dark', system: 'System' },
  common: {
    language: 'Language',
    close: 'Close',
    loading: 'Loading…',
    retry: 'Retry',
    error: 'Something went wrong',
    save: 'Save',
    directions: 'Directions',
    refresh: 'Refresh',
    search: 'Search',
    all: 'All',
    open: 'Open',
    skipToContent: 'Skip to content',
    places: 'places',
    fromOsm: 'from live OSM',
    liveMap: 'Live map · OpenStreetMap',
    youAreHere: 'You are here',
    verified: 'Verified',
    featured: 'Featured',
    nearest: 'Nearest',
    name: 'Name',
    maps: 'Maps',
    cancel: 'Cancel',
    delete: 'Delete',
    create: 'Create',
  },
  home: {
    badge: 'Bahir Dar Smart Digital City 🇪🇹',
    title: 'To Do Bahir Dar',
    thingsToDo: 'Things to Do',
    smartCity: 'Smart City hub',
    cityServices: 'City services',
    happening: 'Happening around town',
    allEvents: 'All events',
    featured: 'Featured experiences',
    lakeTana: 'Lake Tana',
    lakeTanaDesc: "Ethiopia's largest lake & monasteries",
    blueNileFalls: 'Blue Nile Falls',
    blueNileFallsDesc: 'Tissisat — the smoking water',
    checklist: 'Your city checklist',
    checklistDone: 'things done — keep exploring',
    travelSmart: 'Travel smart',
    fullDirectory: 'Full directory',
    fares: 'Fares',
    emergency: 'Emergency',
    budget: 'Budget',
    map: 'Map',
    ctaTitle: 'Your smart city in one app',
    ctaBody:
      'Checklist, map, live places, AI guide, trips, budgets, events, and local services — for Bahir Dar.',
    startChecklist: 'Start checklist',
    openSmartCity: 'Open Smart City',
  },
  discover: {
    title: 'Discover Bahir Dar',
    subtitle:
      'Real places on the ground — hotels, restaurants, cafés, sights, and services from OpenStreetMap, plus key Bahir Dar landmarks.',
    osmCredit: 'Map data © OpenStreetMap contributors (ODbL)',
    refresh: 'Refresh live data',
    searchPlaceholder: 'Search hotels, restaurants, sights…',
    placesCount: 'places',
    updatingOsm: 'Updating from OpenStreetMap…',
    fromLiveOsm: 'from live OSM',
    guideSites: 'Travel guides',
    guideSitesBody: 'Research Bahir Dar, then open a place below for Google Maps directions.',
    googleMapsCat: 'Google Maps',
    osmSearch: 'OSM search',
    loadFail: 'Could not reach OpenStreetMap.',
    loadFailPartial: 'Live OSM update failed — showing landmarks.',
    empty: 'No places match this filter. Try All or another category.',
    hotels: 'Hotels',
    restaurants: 'Restaurants',
    cafes: 'Cafés',
    sights: 'Sights',
    transport: 'Transport',
    banks: 'Banks',
    atms: 'ATMs',
    health: 'Health',
  },
  map: {
    searchPlaceholder: 'Search real places…',
    liveMap: 'Live map · OpenStreetMap',
    mapboxTiles: 'Mapbox tiles',
    osmOn: 'OSM on',
    osmOff: 'OSM off',
    places: 'places',
    osmSlow: 'Live places slow to load',
    osmSlowBody: 'Showing landmarks. Retry OpenStreetMap.',
    retryOsm: 'Retry OSM',
    loadFail: 'Could not load places',
    loading: 'Loading map…',
    footer: 'Real places from OpenStreetMap · Tap locate for GPS · Layers: Streets / Satellite',
  },
  trips: {
    title: 'My Trips',
    subtitle: 'Itineraries and plans for Bahir Dar',
    readyMade: 'Ready-made Bahir Dar plans',
    readyMadeBody:
      'Hand-built day plans using Lake Tana, monasteries, Blue Nile Falls, markets, and viewpoints.',
    yourTrips: 'Your saved trips',
    newTrip: 'New trip',
    loginToSave: 'Log in to save trips',
    loginBody: 'Browse guide plans freely. Sign in to create private itineraries and track expenses.',
    noTrips: 'No personal trips yet. Create one or open a guide plan above.',
    guide: 'GUIDE',
  },
  list: {
    includesOsm: 'Includes OpenStreetMap data',
    discoverLive: 'Discover live map',
    refreshMaps: 'Refresh maps',
    searchPrefix: 'Search',
    loadingPlaces: 'Loading places…',
    loadFail: 'Could not load data.',
    tryDiscover: 'Try Discover (live OpenStreetMap) →',
    fromOsmCount: 'from OpenStreetMap',
    budget: 'Budget',
    midRange: 'Mid-range',
    luxury: 'Luxury',
    traditional: 'Traditional Ethiopian',
    vegetarian: 'Vegetarian',
  },
  pages: {
    hotelsTitle: 'Hotels',
    hotelsSubtitle: 'Places to stay in Bahir Dar — app listings plus live OpenStreetMap',
    hotelsEmpty: 'No hotels found. Try Discover or check Google Maps for Bahir Dar lodging.',
    restaurantsTitle: 'Restaurants & cafés',
    restaurantsSubtitle: 'App listings + live OpenStreetMap food places in Bahir Dar',
    restaurantsEmpty: 'No restaurants yet — use recommendations above or Discover for live food places.',
    attractionsTitle: 'Attractions',
    attractionsSubtitle: 'Sights and landmarks in Bahir Dar',
    attractionsEmpty: 'No attractions found. Try Discover.',
    banksTitle: 'Banks & ATMs',
    banksSubtitle: 'Banks and cash points in Bahir Dar',
    banksEmpty: 'No bank listings yet. Try Discover.',
    transportTitle: 'Transport',
    transportSubtitle: 'Bus stops, taxi points, airport & ferry terminals from OpenStreetMap',
    transportEmpty: 'No transport POIs loaded. See fares below or open Google Maps.',
    typicalFares: 'Typical fares (estimates)',
    findRoutes: 'Find routes online',
    googleTransport: 'Google Maps transport',
    liveOsmTransport: 'Live OSM transport',
  },
  ai: {
    title: 'AI Guide',
    demoMode: 'Local knowledge · offline-safe',
    liveMode: 'Live model',
    thinking: 'Thinking…',
    placeholder: 'Ask about Bahir Dar…',
    welcome:
      "Selam! I'm the Digital Bahir Dar AI guide.\n\nAsk about Lake Tana, Blue Nile Falls, food, hotels, transport, safety, or a multi-day plan.\n\nPrices are estimates only; always verify locally.",
    error: 'Something went wrong. Please try again or use Map / Budget / Trips.',
    reset: 'Reset chat',
  },
  notFound: {
    title: 'Page not found',
    body: 'That route does not exist in Digital Bahir Dar.',
  },
  food: {
    localGuide: 'Local food guide',
    whatToEat: 'What to eat in Bahir Dar',
    whatToEatBody:
      'Lake fish, injera houses, coffee culture, and budget kitchens — practical picks for visitors. Prices are estimates; confirm on site.',
    neighborhoods: 'Neighborhoods',
    recommended: 'Recommended experiences',
    etiquette: 'Etiquette',
    foodSafety: 'Food safety',
    allPicks: 'All picks',
    allPicksBody: 'More ideas below, then live listings from the app and OpenStreetMap.',
    mustTry: 'Must try',
    tip: 'Tip',
    openInApp: 'Open in app →',
  },
}

const am: Strings = {
  appName: 'ዲጂታል ባሕር ዳር',
  tagline: 'ባሕር ዳርን ያስሱ። የት እንደሚሄዱ እና ምን እንደሚያስከፍል ያውቁ።',
  nav: {
    home: 'መነሻ',
    explore: 'አስስ',
    discover: 'አግኝ',
    map: 'ካርታ',
    hotels: 'ሆቴሎች',
    restaurants: 'ምግብ ቤቶች',
    attractions: 'መስህቦች',
    events: 'ዝግጅቶች',
    guides: 'መመሪያዎች',
    trips: 'ጉዞዎች',
    aiGuide: 'AI መመሪያ',
    directory: 'ማውጫ',
    transport: 'ትራንስፖርት',
    login: 'ግባ',
    profile: 'መገለጫ',
    todo: 'ተግባራት',
    city: 'ከተማ',
    banks: 'ባንኮች',
    budget: 'በጀት',
  },
  search: {
    placeholder: 'ሆቴል፣ ምግብ፣ መስህብ፣ ATM ፈልግ…',
    globalPlaceholder: 'ባሕር ዳርን ፈልግ…',
    noResults: 'ውጤት የለም',
    viewAll: 'ሁሉንም ውጤቶች',
    recent: 'ፈጣን አገናኞች',
  },
  explore: {
    title: 'ባሕር ዳርን አስስ',
    subtitle: 'ቦታዎችን ፈልጉ፣ በምድብ ያጣሩ፣ ወይም በአቅራቢያ ያሉትን ይመልከቱ',
    all: 'ሁሉም',
    nearMe: 'በአቅራቢያዬ',
    locating: 'አካባቢዎን በማግኘት ላይ…',
    locationDenied: 'የአካባቢ ፈቃድ ተከልክሏል። በአሳሽ ቅንብሮች ያንቁ።',
    locationUnsupported: 'በዚህ መሣሪያ ጂኦሎኬሽን አይደገፍም።',
    nearbyEmpty: 'በክልሉ ውስጥ ቦታ የለም። ሰፊ ፍለጋ ይሞክሩ ወይም «በአቅራቢያዬ»ን ያጥፉ።',
    loading: 'በመጫን ላይ…',
    empty: 'ከፍለጋዎ ጋር የሚዛመድ ቦታ የለም።',
    distance: 'ርቀት',
  },
  theme: { light: 'ብርሃን', dark: 'ጨለማ', system: 'ስርዓት' },
  common: {
    language: 'ቋንቋ',
    close: 'ዝጋ',
    loading: 'በመጫን ላይ…',
    retry: 'እንደገና ይሞክሩ',
    error: 'ስህተት ተከስቷል',
    save: 'አስቀምጥ',
    directions: 'አቅጣጫ',
    refresh: 'አድስ',
    search: 'ፈልግ',
    all: 'ሁሉም',
    open: 'ክፈት',
    skipToContent: 'ወደ ይዘት ዝለል',
    places: 'ቦታዎች',
    fromOsm: 'ከቀጥታ OSM',
    liveMap: 'ቀጥታ ካርታ · OpenStreetMap',
    youAreHere: 'እርስዎ እዚህ ነዎት',
    verified: 'የተረጋገጠ',
    featured: 'ተመራጭ',
    nearest: 'ቅርብ',
    name: 'ስም',
    maps: 'ካርታዎች',
    cancel: 'ሰርዝ',
    delete: 'ሰርዝ',
    create: 'ፍጠር',
  },
  home: {
    badge: 'ባሕር ዳር ብልጥ ዲጂታል ከተማ 🇪🇹',
    title: 'ባሕር ዳር ተግባራት',
    thingsToDo: 'የሚደረጉ ነገሮች',
    smartCity: 'ብልጥ ከተማ ማዕከል',
    cityServices: 'የከተማ አገልግሎቶች',
    happening: 'በከተማው ዙሪያ የሚከሰቱ',
    allEvents: 'ሁሉም ዝግጅቶች',
    featured: 'ተመራጭ ተሞክሮዎች',
    lakeTana: 'ጣና ሐይቅ',
    lakeTanaDesc: 'የኢትዮጵያ ትልቁ ሐይቅ እና ገዳማት',
    blueNileFalls: 'አባይ ፏፏቴ',
    blueNileFallsDesc: 'ጢስ ኢሳት — የሚያጨስ ውሃ',
    checklist: 'የከተማዎ ዝርዝር',
    checklistDone: 'ተጠናቀዋል — መፈለግዎን ቀጥሉ',
    travelSmart: 'በብልጥ ይጓዙ',
    fullDirectory: 'ሙሉ ማውጫ',
    fares: 'ታሪፍ',
    emergency: 'አደጋ ጊዜ',
    budget: 'በጀት',
    map: 'ካርታ',
    ctaTitle: 'ብልጥ ከተማዎ በአንድ መተግበሪያ',
    ctaBody:
      'ዝርዝር፣ ካርታ፣ ቀጥታ ቦታዎች፣ AI መመሪያ፣ ጉዞዎች፣ በጀቶች፣ ዝግጅቶች እና የአካባቢ አገልግሎቶች — ለባሕር ዳር።',
    startChecklist: 'ዝርዝር ጀምር',
    openSmartCity: 'ብልጥ ከተማ ክፈት',
  },
  discover: {
    title: 'ባሕር ዳርን አግኝ',
    subtitle:
      'እውነተኛ ቦታዎች — ሆቴሎች፣ ምግብ ቤቶች፣ ካፌዎች፣ መስህቦች እና አገልግሎቶች ከ OpenStreetMap፣ ከባሕር ዳር ቁልፍ መስህቦች ጋር።',
    osmCredit: 'የካርታ ውሂብ © OpenStreetMap አበርካቾች (ODbL)',
    refresh: 'ቀጥታ ውሂብ አድስ',
    searchPlaceholder: 'ሆቴል፣ ምግብ ቤት፣ መስህብ ፈልግ…',
    placesCount: 'ቦታዎች',
    updatingOsm: 'ከ OpenStreetMap በማደስ ላይ…',
    fromLiveOsm: 'ከቀጥታ OSM',
    guideSites: 'የጉዞ መመሪያዎች',
    guideSitesBody: 'ባሕር ዳርን ያጥኑ፣ ከዚያ ከታች ባለ ቦታ ላይ የGoogle Maps አቅጣጫ ይክፈቱ።',
    googleMapsCat: 'Google Maps',
    osmSearch: 'OSM ፍለጋ',
    loadFail: 'OpenStreetMap ሊደረስ አልቻለም።',
    loadFailPartial: 'የቀጥታ OSM ማደስ አልተሳካም — መስህቦች ይታያሉ።',
    empty: 'ከዚህ ማጣሪያ ጋር የሚዛመድ ቦታ የለም። «ሁሉም»ን ይሞክሩ።',
    hotels: 'ሆቴሎች',
    restaurants: 'ምግብ ቤቶች',
    cafes: 'ካፌዎች',
    sights: 'መስህቦች',
    transport: 'ትራንስፖርት',
    banks: 'ባንኮች',
    atms: 'ATM',
    health: 'ጤና',
  },
  map: {
    searchPlaceholder: 'እውነተኛ ቦታዎችን ፈልግ…',
    liveMap: 'ቀጥታ ካርታ · OpenStreetMap',
    mapboxTiles: 'Mapbox ንጣፎች',
    osmOn: 'OSM በርቷል',
    osmOff: 'OSM ጠፍቷል',
    places: 'ቦታዎች',
    osmSlow: 'ቀጥታ ቦታዎች ለመጫን ቀርፋፋ ናቸው',
    osmSlowBody: 'መስህቦች ይታያሉ። OpenStreetMapን እንደገና ይሞክሩ።',
    retryOsm: 'OSM እንደገና',
    loadFail: 'ቦታዎችን መጫን አልተቻለም',
    loading: 'ካርታ በመጫን ላይ…',
    footer: 'እውነተኛ ቦታዎች ከ OpenStreetMap · ለGPS አካባቢ ይጫኑ · ንጣፎች፡ ጎዳና / ሳተላይት',
  },
  trips: {
    title: 'የእኔ ጉዞዎች',
    subtitle: 'ለባሕር ዳር የጉዞ እቅዶች',
    readyMade: 'ዝግጁ የባሕር ዳር እቅዶች',
    readyMadeBody: 'ጣና ሐይቅ፣ ገዳማት፣ አባይ ፏፏቴ፣ ገበያዎች እና እይታዎችን የሚጠቀሙ የቀን እቅዶች።',
    yourTrips: 'የተቀመጡ ጉዞዎችዎ',
    newTrip: 'አዲስ ጉዞ',
    loginToSave: 'ጉዞዎችን ለማስቀመጥ ይግቡ',
    loginBody: 'መመሪያ እቅዶችን በነፃ ይመልከቱ። የግል ጉዞዎችን ለመፍጠር ይግቡ።',
    noTrips: 'እስካሁን የግል ጉዞ የለም። አዲስ ይፍጠሩ ወይም ከላይ መመሪያ ይክፈቱ።',
    guide: 'መመሪያ',
  },
  list: {
    includesOsm: 'የOpenStreetMap ውሂብን ያካትታል',
    discoverLive: 'ቀጥታ ካርታ አግኝ',
    refreshMaps: 'ካርታዎችን አድስ',
    searchPrefix: 'ፈልግ',
    loadingPlaces: 'ቦታዎች በመጫን ላይ…',
    loadFail: 'ውሂብ መጫን አልተቻለም።',
    tryDiscover: 'አግኝን ይሞክሩ (ቀጥታ OpenStreetMap) →',
    fromOsmCount: 'ከ OpenStreetMap',
    budget: 'በጀት',
    midRange: 'መካከለኛ',
    luxury: 'ላክሸሪ',
    traditional: 'ባህላዊ ኢትዮጵያዊ',
    vegetarian: 'ቬጀቴሪያን',
  },
  pages: {
    hotelsTitle: 'ሆቴሎች',
    hotelsSubtitle: 'በባሕር ዳር የመኝታ ቦታዎች — የመተግበሪያ ዝርዝሮች እና ቀጥታ OpenStreetMap',
    hotelsEmpty: 'ሆቴል አልተገኘም። አግኝን ይሞክሩ ወይም Google Maps ይመልከቱ።',
    restaurantsTitle: 'ምግብ ቤቶች እና ካፌዎች',
    restaurantsSubtitle: 'የመተግበሪያ ዝርዝሮች + ቀጥታ OpenStreetMap ምግብ ቤቶች',
    restaurantsEmpty: 'ምግብ ቤት እስካሁን የለም — ከላይ ያሉ ምክሮችን ወይም አግኝን ይጠቀሙ።',
    attractionsTitle: 'መስህቦች',
    attractionsSubtitle: 'በባሕር ዳር መስህቦች እና ታሪካዊ ቦታዎች',
    attractionsEmpty: 'መስህብ አልተገኘም። አግኝን ይሞክሩ።',
    banksTitle: 'ባንኮች እና ATM',
    banksSubtitle: 'በባሕር ዳር ባንኮች እና ጥሬ ገንዘብ ነጥቦች',
    banksEmpty: 'የባንክ ዝርዝር እስካሁን የለም። አግኝን ይሞክሩ።',
    transportTitle: 'ትራንስፖርት',
    transportSubtitle: 'የአውቶቡስ ማቆሚያዎች፣ ታክሲ፣ አውሮፕላን ማረፊያ እና ጀልባ ከ OpenStreetMap',
    transportEmpty: 'የትራንስፖርት ቦታ አልተጫነም። ከታች ያለውን ታሪፍ ይመልከቱ።',
    typicalFares: 'መደበኛ ታሪፎች (ግምት)',
    findRoutes: 'መንገዶችን በመስመር ላይ ያግኙ',
    googleTransport: 'Google Maps ትራንስፖርት',
    liveOsmTransport: 'ቀጥታ OSM ትራንስፖርት',
  },
  ai: {
    title: 'AI መመሪያ',
    demoMode: 'አካባቢያዊ እውቀት · ከመስመር ውጭ',
    liveMode: 'ቀጥታ ሞዴል',
    thinking: 'በማሰብ ላይ…',
    placeholder: 'ስለ ባሕር ዳር ይጠይቁ…',
    welcome:
      'ሰላም! የዲጂታል ባሕር ዳር AI መመሪያ ነኝ።\n\nስለ ጣና ሐይቅ፣ አባይ ፏፏቴ፣ ምግብ፣ ሆቴል፣ ትራንስፖርት፣ ደህንነት ወይም የብዙ ቀን እቅድ ይጠይቁ።\n\nዋጋዎች ግምት ብቻ ናቸው፤ በአካባቢ ያረጋግጡ።',
    error: 'ስህተት ተከስቷል። እንደገና ይሞክሩ ወይም ካርታ / በጀት / ጉዞዎችን ይጠቀሙ።',
    reset: 'ውይይት አድስ',
  },
  notFound: {
    title: 'ገጹ አልተገኘም',
    body: 'ያ መንገድ በዲጂታል ባሕር ዳር ውስጥ የለም።',
  },
  food: {
    localGuide: 'የአካባቢ ምግብ መመሪያ',
    whatToEat: 'በባሕር ዳር ምን መብላት',
    whatToEatBody:
      'የሐይቅ አሳ፣ እንጀራ ቤቶች፣ ቡና ባህል እና በጀት ምግብ ቤቶች — ለጎብኚዎች ተግባራዊ ምርጫዎች። ዋጋዎች ግምት ናቸው።',
    neighborhoods: 'አካባቢዎች',
    recommended: 'የሚመከሩ ተሞክሮዎች',
    etiquette: 'ስነ ምግባር',
    foodSafety: 'የምግብ ደህንነት',
    allPicks: 'ሁሉም ምርጫዎች',
    allPicksBody: 'ተጨማሪ ሀሳቦች ከታች፣ ከዚያ ከመተግበሪያ እና OpenStreetMap ቀጥታ ዝርዝሮች።',
    mustTry: 'መሞከር ያለብዎት',
    tip: 'ምክር',
    openInApp: 'በመተግበሪያ ውስጥ ክፈት →',
  },
}

export const strings: Record<Lang, Strings> = { en, am }
