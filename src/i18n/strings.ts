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
    showAll: string
    openMap: string
    estimateNote: string
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
    heroHint: string
    whatNeed: string
    whatNeedSub: string
    stay: string
    stayBody: string
    eat: string
    eatBody: string
    go: string
    goBody: string
    see: string
    seeBody: string
    todayTitle: string
    todayBody: string
    openPlan: string
    moreTools: string
    planMultiDay: string
    startWithToday: string
    multiDayPlanner: string
  }
  today: {
    badge: string
    title: string
    subtitle: string
    dayCost: string
    dayCostHint: string
    map: string
    multiDay: string
    morning: string
    midday: string
    afternoon: string
    evening: string
    free: string
    placeDetails: string
    openMap: string
    secondDayTitle: string
    secondDayBody: string
    openPlanner: string
    quickTips: string
    checklist: string
    morePlans: string
    foodPrices: string
  }
  planner: {
    title: string
    subtitle: string
    howManyDays: string
    travelers: string
    budgetStyle: string
    budgetBudget: string
    budgetBudgetHint: string
    budgetMid: string
    budgetMidHint: string
    budgetComfort: string
    budgetComfortHint: string
    pace: string
    paceRelaxed: string
    paceModerate: string
    paceActive: string
    interests: string
    nature: string
    culture: string
    food: string
    shopping: string
    photos: string
    family: string
    includeBoat: string
    includeFalls: string
    buildPlan: string
    offlineNote: string
    editChoices: string
    copy: string
    copied: string
    estimatedTotal: string
    pricingBreakdown: string
    pricingHint: string
    category: string
    amount: string
    share: string
    perPerson: string
    total: string
    activityCosts: string
    day: string
    focus: string
    stopCosts: string
    sumStops: string
    stopCostsNote: string
    tripStory: string
    generateAi: string
    writing: string
    storyHint: string
    tips: string
    openMap: string
    adjustBudget: string
    readyMade: string
    askAi: string
    similarGuide: string
    viewGuide: string
    regenerate: string
    stopsAcross: string
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
    plannerCta: string
    plannerCtaBody: string
    openPlanner: string
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
  hotelsPage: {
    whereToStay: string
    title: string
    intro: string
    priceTier: string
    areaFocus: string
    nearLake: string
    nearLakeBody: string
    nearCenter: string
    nearCenterBody: string
    nearAirport: string
    nearAirportBody: string
    preferPlan: string
    tierBudget: string
    tierBudgetRange: string
    tierBudgetBody: string
    tierMid: string
    tierMidRange: string
    tierMidBody: string
    tierComfort: string
    tierComfortRange: string
    tierComfortBody: string
    tapChip: string
  }
  transportPage: {
    howDoI: string
    howDoISub: string
    qAirport: string
    aAirport: string
    pAirport: string
    qBoat: string
    aBoat: string
    pBoat: string
    qFalls: string
    aFalls: string
    pFalls: string
    qTown: string
    aTown: string
    pTown: string
    qBus: string
    aBus: string
    pBus: string
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
    moodTitle: string
    modeTraditional: string
    modeTraditionalBody: string
    modeFish: string
    modeFishBody: string
    modeCoffee: string
    modeCoffeeBody: string
    showing: string
    shortList: string
    neighborhoods: string
    recommended: string
    etiquette: string
    foodSafety: string
    tipsToggle: string
    liveListings: string
    liveListingsBody: string
    allPicks: string
    allPicksBody: string
    mustTry: string
    tip: string
    openInApp: string
    moreIdeas: string
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
    today: 'Today',
    planner: 'Planner',
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
    showAll: 'Show all',
    openMap: 'Open map',
    estimateNote: 'Estimates only — confirm on site',
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
    heroHint: 'Start with one question: where to sleep, eat, get around, or what to do today.',
    whatNeed: 'What do you need?',
    whatNeedSub: 'Four clear paths — the rest is optional',
    stay: 'Stay',
    stayBody: 'Hotels by budget · near lake or center',
    eat: 'Eat',
    eatBody: 'Injera, lake fish, coffee · price bands',
    go: 'Go',
    goBody: 'Airport, bajaj, boats, falls day trip',
    see: 'See',
    seeBody: 'Today’s plan · lake, viewpoint, market',
    todayTitle: 'Today in Bahir Dar',
    todayBody: 'Morning lake → viewpoint → market → sunset dinner. Roughly ~1,200 ETB/person.',
    openPlan: 'Open plan →',
    moreTools: 'More tools',
    planMultiDay: 'Plan 2–5 days',
    startWithToday: 'Start with today',
    multiDayPlanner: 'Multi-day planner',
  },
  today: {
    badge: 'One day · clear plan',
    title: 'Today in Bahir Dar',
    subtitle: 'One simple day: lake, viewpoint, market, good food — no overwhelm.',
    dayCost: 'Rough day cost (1 person)',
    dayCostHint: 'Food + local hops + light activities · confirm on site',
    map: 'Map',
    multiDay: 'Multi-day plan',
    morning: 'Morning',
    midday: 'Midday',
    afternoon: 'Afternoon',
    evening: 'Evening',
    free: 'Free',
    placeDetails: 'Place details',
    openMap: 'Open map',
    secondDayTitle: 'Have a second day?',
    secondDayBody: 'Add a Lake Tana monastery boat in the morning, or a Blue Nile Falls day trip.',
    openPlanner: 'Open AI Trip Planner →',
    quickTips: 'Quick tips',
    checklist: 'Checklist',
    morePlans: 'More plans',
    foodPrices: 'Food prices',
  },
  planner: {
    title: 'AI Trip Planner',
    subtitle: 'Answer a few easy questions — get a clear day-by-day Bahir Dar plan',
    howManyDays: 'How many days?',
    travelers: 'Travelers',
    budgetStyle: 'Budget style',
    budgetBudget: 'Budget',
    budgetBudgetHint: 'Guesthouse · local food · shared boats',
    budgetMid: 'Mid',
    budgetMidHint: 'Comfortable hotel · mix of local & lakeside',
    budgetComfort: 'Comfort',
    budgetComfortHint: 'Lakeside stay · easier transport',
    pace: 'Pace',
    paceRelaxed: 'Relaxed',
    paceModerate: 'Moderate',
    paceActive: 'Active',
    interests: 'What do you care about?',
    nature: 'Nature',
    culture: 'Culture',
    food: 'Food',
    shopping: 'Shopping',
    photos: 'Photos',
    family: 'Family',
    includeBoat: 'Include Lake Tana boat / monasteries',
    includeFalls: 'Include Blue Nile Falls',
    buildPlan: 'Build my plan',
    offlineNote: 'Works offline with local Bahir Dar knowledge. Optional AI story after you generate.',
    editChoices: 'Edit choices',
    copy: 'Copy',
    copied: 'Copied',
    estimatedTotal: 'Estimated total',
    pricingBreakdown: 'Pricing breakdown',
    pricingHint: 'All figures in ETB · planning estimates',
    category: 'Category',
    amount: 'Amount',
    share: 'Share',
    perPerson: '/ person',
    total: 'Total',
    activityCosts: 'Activity costs on the plan (from stops)',
    day: 'Day',
    focus: 'Focus',
    stopCosts: 'Stop costs',
    sumStops: 'Sum of stop estimates',
    stopCostsNote:
      'Stop costs are a day-level view. The category table is the full group budget including lodging.',
    tripStory: 'Trip story',
    generateAi: 'Generate with AI',
    writing: 'Writing…',
    storyHint:
      'Optional: turn this plan into a short friendly narrative (uses AI when configured, otherwise a local summary).',
    tips: 'Tips',
    openMap: 'Open map',
    adjustBudget: 'Adjust budget',
    readyMade: 'Ready-made trips',
    askAi: 'Ask AI guide',
    similarGuide: 'Similar curated plan:',
    viewGuide: 'View full guide →',
    regenerate: 'Regenerate plan',
    stopsAcross: 'stops across',
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
    plannerCta: 'Build a custom plan in 30 seconds',
    plannerCtaBody:
      'Pick days, budget, and interests — get a clear day-by-day Bahir Dar itinerary with ETB estimates.',
    openPlanner: 'Open planner →',
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
  hotelsPage: {
    whereToStay: 'Where to stay',
    title: 'Hotels in Bahir Dar',
    intro:
      'Filter by price tier below. Rates are planning estimates — confirm current prices and availability with the hotel.',
    priceTier: 'Price tier',
    areaFocus: 'Area focus',
    nearLake: 'Near lake',
    nearLakeBody: 'Boat pier access · sunsets',
    nearCenter: 'Near center',
    nearCenterBody: 'Markets · bajaj · cafés',
    nearAirport: 'Near airport',
    nearAirportBody: 'Early flights · quieter nights',
    preferPlan: 'Prefer a full day plan first?',
    tierBudget: 'Budget',
    tierBudgetRange: '~1,500–4,000 ETB/night',
    tierBudgetBody: 'Guesthouses & simple hotels',
    tierMid: 'Mid',
    tierMidRange: '~4,000–9,000 ETB/night',
    tierMidBody: 'Comfortable mid-range stays',
    tierComfort: 'Comfort',
    tierComfortRange: '~9,000+ ETB/night',
    tierComfortBody: 'Lakeside & higher-end hotels',
    tapChip: 'Use the filter chips under the list',
  },
  transportPage: {
    howDoI: 'How do I…?',
    howDoISub: 'Plain answers first. Fares are planning estimates in ETB — confirm on site.',
    qAirport: 'Airport (BJR) → city?',
    aAirport:
      'Bahir Dar Airport is about 15–40 minutes from the center. Hotel pickup is easiest after landing. Bajaj or taxi work if you negotiate on the spot.',
    pAirport: '~300–1,500 ETB / trip',
    qBoat: 'Boat to the monasteries?',
    aBoat:
      'Go to the Lake Tana pier in the morning. Compare shared vs private boats. Agree islands, return time, and whether entry is included before boarding.',
    pBoat: '~800–15,000 ETB (shared → private half day)',
    qFalls: 'Day trip to Blue Nile Falls?',
    aFalls:
      'Tis Issat is about 30 km toward Tis Abay. Private car is simplest for a group; bus is cheaper. Entry and guide are separate from the vehicle.',
    pFalls: 'Car ~800–3,500 ETB vehicle round trip (est.)',
    qTown: 'Short ride in town (bajaj / taxi)?',
    aTown:
      'Bajaj for short hops; taxi for longer trips. Always agree the price before you start. Minibuses are cheapest on fixed routes.',
    pTown: 'Bajaj ~50–200 · Taxi ~150–500 ETB',
    qBus: 'Bus to Gondar / Addis / other cities?',
    aBus:
      'Use the main bus station for intercity routes. Prices depend on distance. Buy early on busy days and keep valuables close.',
    pBus: '~100–800+ ETB / seat (route-dependent)',
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
      'Pick one path below — traditional, lake fish, or coffee. Short lists first; full map listings further down.',
    moodTitle: 'What are you in the mood for?',
    modeTraditional: 'Traditional',
    modeTraditionalBody: 'Injera, shiro, tibs — local houses',
    modeFish: 'Lake fish',
    modeFishBody: 'Tilapia & Nile perch by the shore',
    modeCoffee: 'Coffee & light',
    modeCoffeeBody: 'Bunna, macchiato, snacks, juice',
    showing: 'Showing',
    shortList: 'Your short list',
    neighborhoods: 'Neighborhoods',
    recommended: 'Recommended experiences',
    etiquette: 'Etiquette',
    foodSafety: 'Food safety',
    tipsToggle: 'Tips for eating here (etiquette & safety)',
    liveListings: 'Live listings',
    liveListingsBody: 'App + OpenStreetMap restaurants and cafés in Bahir Dar.',
    allPicks: 'All picks',
    allPicksBody: 'More ideas below, then live listings from the app and OpenStreetMap.',
    mustTry: 'Must try',
    tip: 'Tip',
    openInApp: 'Open in app →',
    moreIdeas: 'More ideas',
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
    today: 'ዛሬ',
    planner: 'እቅድ',
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
    showAll: 'ሁሉንም አሳይ',
    openMap: 'ካርታ ክፈት',
    estimateNote: 'ግምቶች ብቻ — በአካባቢ ያረጋግጡ',
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
    heroHint: 'በአንድ ጥያቄ ይጀምሩ፡ የት መተኛት፣ መብላት፣ መንቀሳቀስ፣ ወይም ዛሬ ምን ማድረግ።',
    whatNeed: 'ምን ያስፈልግዎታል?',
    whatNeedSub: 'አራት ግልጽ መንገዶች — ቀሪው አማራጭ ነው',
    stay: 'መኝታ',
    stayBody: 'ሆቴሎች በበጀት · በሐይቅ ወይም በመሃል',
    eat: 'ምግብ',
    eatBody: 'እንጀራ፣ የሐይቅ አሳ፣ ቡና · የዋጋ ቡድኖች',
    go: 'መንቀሳቀስ',
    goBody: 'አውሮፕላን ማረፊያ፣ ባጃጅ፣ ጀልባ፣ ፏፏቴ',
    see: 'ይመልከቱ',
    seeBody: 'የዛሬ እቅድ · ሐይቅ፣ እይታ፣ ገበያ',
    todayTitle: 'ዛሬ በባሕር ዳር',
    todayBody: 'ጠዋት ሐይቅ → እይታ → ገበያ → ፀሐይ ስትጠልቅ እራት። በግምት ~1,200 ብር/ሰው።',
    openPlan: 'እቅድ ክፈት →',
    moreTools: 'ተጨማሪ መሳሪያዎች',
    planMultiDay: '2–5 ቀናት እቅድ',
    startWithToday: 'በዛሬ ይጀምሩ',
    multiDayPlanner: 'የብዙ ቀን እቅድ',
  },
  today: {
    badge: 'አንድ ቀን · ግልጽ እቅድ',
    title: 'ዛሬ በባሕር ዳር',
    subtitle: 'አንድ ቀላል ቀን፡ ሐይቅ፣ እይታ፣ ገበያ፣ ጥሩ ምግብ — ያለ ጭንቀት።',
    dayCost: 'የቀን ወጪ ግምት (1 ሰው)',
    dayCostHint: 'ምግብ + አካባቢያዊ ጉዞ + ቀላል እንቅስቃሴ · በአካባቢ ያረጋግጡ',
    map: 'ካርታ',
    multiDay: 'የብዙ ቀን እቅድ',
    morning: 'ጠዋት',
    midday: 'ቀትር',
    afternoon: 'ከሰዓት',
    evening: 'ማታ',
    free: 'ነጻ',
    placeDetails: 'የቦታ ዝርዝር',
    openMap: 'ካርታ ክፈት',
    secondDayTitle: 'ሁለተኛ ቀን አለዎት?',
    secondDayBody: 'በጠዋት የጣና ገዳም ጀልባ ወይም የአባይ ፏፏቴ ቀን ጉዞ ይጨምሩ።',
    openPlanner: 'AI የጉዞ እቅድ ክፈት →',
    quickTips: 'ፈጣን ምክሮች',
    checklist: 'ዝርዝር',
    morePlans: 'ተጨማሪ እቅዶች',
    foodPrices: 'የምግብ ዋጋዎች',
  },
  planner: {
    title: 'AI የጉዞ እቅድ',
    subtitle: 'ጥቂት ቀላል ጥያቄዎች — ግልጽ የቀን በቀን የባሕር ዳር እቅድ',
    howManyDays: 'ስንት ቀናት?',
    travelers: 'ተጓዦች',
    budgetStyle: 'የበጀት ዓይነት',
    budgetBudget: 'በጀት',
    budgetBudgetHint: 'ጎስት ሃውስ · የአካባቢ ምግብ · የጋራ ጀልባ',
    budgetMid: 'መካከለኛ',
    budgetMidHint: 'ምቹ ሆቴል · አካባቢያዊ እና የሐይቅ ድብልቅ',
    budgetComfort: 'ምቾት',
    budgetComfortHint: 'በሐይቅ አጠገብ · ቀላል ትራንስፖርት',
    pace: 'ፍጥነት',
    paceRelaxed: 'ዝግጁ',
    paceModerate: 'መካከለኛ',
    paceActive: 'ንቁ',
    interests: 'ምን ያስብዎታል?',
    nature: 'ተፈጥሮ',
    culture: 'ባህል',
    food: 'ምግብ',
    shopping: 'ግዢ',
    photos: 'ፎቶ',
    family: 'ቤተሰብ',
    includeBoat: 'የጣና ጀልባ / ገዳማት አካትት',
    includeFalls: 'አባይ ፏፏቴ አካትት',
    buildPlan: 'እቅዴን ግንባ',
    offlineNote: 'ከመስመር ውጭ በአካባቢያዊ እውቀት ይሰራል። ከተገነባ በኋላ አማራጭ AI ታሪክ።',
    editChoices: 'ምርጫዎችን አርትዕ',
    copy: 'ቅዳ',
    copied: 'ተቀድቷል',
    estimatedTotal: 'የተገመተ ጠቅላላ',
    pricingBreakdown: 'የዋጋ ክፍፍል',
    pricingHint: 'ሁሉም በብር · የእቅድ ግምቶች',
    category: 'ምድብ',
    amount: 'መጠን',
    share: 'ድርሻ',
    perPerson: '/ ሰው',
    total: 'ድምር',
    activityCosts: 'በእቅዱ ላይ የእንቅስቃሴ ወጪዎች',
    day: 'ቀን',
    focus: 'ትኩረት',
    stopCosts: 'የማቆሚያ ወጪ',
    sumStops: 'የማቆሚያ ግምቶች ድምር',
    stopCostsNote: 'የማቆሚያ ወጪዎች የቀን እይታ ናቸው። የምድብ ሰንጠረዥ ሙሉ የቡድን በጀት ነው።',
    tripStory: 'የጉዞ ታሪክ',
    generateAi: 'በAI ፍጠር',
    writing: 'በመጻፍ ላይ…',
    storyHint: 'አማራጭ፡ ይህን እቅድ ወደ አጭር ወዳጃዊ ትረካ ቀይር።',
    tips: 'ምክሮች',
    openMap: 'ካርታ ክፈት',
    adjustBudget: 'በጀት አስተካክል',
    readyMade: 'ዝግጁ ጉዞዎች',
    askAi: 'AI መመሪያ ጠይቅ',
    similarGuide: 'ተመሳሳይ የተዘጋጀ እቅድ፡',
    viewGuide: 'ሙሉ መመሪያ →',
    regenerate: 'እቅድ እንደገና ፍጠር',
    stopsAcross: 'ማቆሚያዎች በ',
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
    plannerCta: 'በ30 ሰከንድ ብጁ እቅድ ይገንቡ',
    plannerCtaBody: 'ቀናት፣ በጀት እና ፍላጎቶችን ይምረጡ — ግልጽ የቀን በቀን እቅድ ከብር ግምት ጋር።',
    openPlanner: 'እቅድ ክፈት →',
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
  hotelsPage: {
    whereToStay: 'የት መቆየት',
    title: 'በባሕር ዳር ሆቴሎች',
    intro: 'ከታች በዋጋ ደረጃ ያጣሩ። ዋጋዎች የእቅድ ግምቶች ናቸው — ከሆቴሉ ጋር ያረጋግጡ።',
    priceTier: 'የዋጋ ደረጃ',
    areaFocus: 'የአካባቢ ትኩረት',
    nearLake: 'በሐይቅ አጠገብ',
    nearLakeBody: 'የጀልባ ማረፊያ · ፀሐይ መጥለቂያ',
    nearCenter: 'በመሃል አጠገብ',
    nearCenterBody: 'ገበያዎች · ባጃጅ · ካፌዎች',
    nearAirport: 'በአውሮፕላን ማረፊያ አጠገብ',
    nearAirportBody: 'ቀደምት በረራዎች · ጸጥታ',
    preferPlan: 'መጀመሪያ ሙሉ የቀን እቅድ?',
    tierBudget: 'በጀት',
    tierBudgetRange: '~1,500–4,000 ብር/ለሌት',
    tierBudgetBody: 'ጎስት ሃውስ እና ቀላል ሆቴሎች',
    tierMid: 'መካከለኛ',
    tierMidRange: '~4,000–9,000 ብር/ለሌት',
    tierMidBody: 'ምቹ መካከለኛ ማረፊያዎች',
    tierComfort: 'ምቾት',
    tierComfortRange: '~9,000+ ብር/ለሌት',
    tierComfortBody: 'በሐይቅ እና ከፍተኛ ሆቴሎች',
    tapChip: 'ከዝርዝሩ ስር ያሉትን ማጣሪያ ቺፖች ይጠቀሙ',
  },
  transportPage: {
    howDoI: 'እንዴት…?',
    howDoISub: 'መጀመሪያ ግልጽ መልሶች። ታሪፎች በብር የእቅድ ግምቶች ናቸው — በአካባቢ ያረጋግጡ።',
    qAirport: 'ከአውሮፕላን ማረፊያ (BJR) ወደ ከተማ?',
    aAirport:
      'የባሕር ዳር አውሮፕላን ማረፊያ ከመሃል በግምት 15–40 ደቂቃ ነው። ከሆቴል መውሰድ ቀላል ነው። ባጃጅ ወይም ታክሲ ይቻላል።',
    pAirport: '~300–1,500 ብር / ጉዞ',
    qBoat: 'ወደ ገዳማት ጀልባ?',
    aBoat:
      'በጠዋት ወደ ጣና ጀልባ ማረፊያ ይሂዱ። የጋራ እና የግል ጀልባዎችን ያወዳድሩ። ደሴቶችን፣ መመለሻ ጊዜን እና መግቢያን ከመሄድዎ በፊት ይስማሙ።',
    pBoat: '~800–15,000 ብር (የጋራ → የግል ግማሽ ቀን)',
    qFalls: 'ወደ አባይ ፏፏቴ የቀን ጉዞ?',
    aFalls:
      'ጢስ ኢሳት ወደ ጢስ አባይ በግምት 30 ኪ.ሜ ነው። ለቡድን የግል መኪና ቀላል ነው፤ አውቶቡስ ርካሽ ነው። መግቢያ እና መመሪያ ከመኪናው የተለየ ነው።',
    pFalls: 'መኪና ~800–3,500 ብር ዙር (ግምት)',
    qTown: 'በከተማ ውስጥ አጭር ጉዞ (ባጃጅ / ታክሲ)?',
    aTown:
      'ለአጭር ርቀት ባጃጅ፤ ለረጅም ታክሲ። ዋጋውን ከመጀመርዎ በፊት ይስማሙ። በተወሰኑ መስመሮች ሚኒባስ ርካሽ ነው።',
    pTown: 'ባጃጅ ~50–200 · ታክሲ ~150–500 ብር',
    qBus: 'ወደ ጎንደር / አዲስ አበባ / ሌሎች ከተሞች አውቶቡስ?',
    aBus:
      'ለከተማ-ከተማ መስመሮች ዋናውን የአውቶቡስ ጣቢያ ይጠቀሙ። ዋጋ በርቀት ይለያያል። በተጨናነቁ ቀናት ቀድመው ይግዙ።',
    pBus: '~100–800+ ብር / መቀመጫ (በመስመር)',
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
      'ከታች አንድ መንገድ ይምረጡ — ባህላዊ፣ የሐይቅ አሳ፣ ወይም ቡና። መጀመሪያ አጭር ዝርዝር፤ ከዚያ ሙሉ ካርታ ዝርዝሮች።',
    moodTitle: 'ምን ይፈልጋሉ?',
    modeTraditional: 'ባህላዊ',
    modeTraditionalBody: 'እንጀራ፣ ሽሮ፣ ጥብስ — የአካባቢ ቤቶች',
    modeFish: 'የሐይቅ አሳ',
    modeFishBody: 'ጥሉፒያ እና ናይል ፐርች በባሕር ዳር ዳር',
    modeCoffee: 'ቡና እና ቀላል',
    modeCoffeeBody: 'ቡና፣ ማኪያቶ፣ መክሰስ፣ ጭማቂ',
    showing: 'በማሳየት ላይ',
    shortList: 'አጭር ዝርዝርዎ',
    neighborhoods: 'አካባቢዎች',
    recommended: 'የሚመከሩ ተሞክሮዎች',
    etiquette: 'ስነ ምግባር',
    foodSafety: 'የምግብ ደህንነት',
    tipsToggle: 'ለመመገብ ምክሮች (ስነ ምግባር እና ደህንነት)',
    liveListings: 'ቀጥታ ዝርዝሮች',
    liveListingsBody: 'መተግበሪያ + OpenStreetMap ምግብ ቤቶች እና ካፌዎች በባሕር ዳር።',
    allPicks: 'ሁሉም ምርጫዎች',
    allPicksBody: 'ተጨማሪ ሀሳቦች ከታች፣ ከዚያ ከመተግበሪያ እና OpenStreetMap ቀጥታ ዝርዝሮች።',
    mustTry: 'መሞከር ያለብዎት',
    tip: 'ምክር',
    openInApp: 'በመተግበሪያ ውስጥ ክፈት →',
    moreIdeas: 'ተጨማሪ ሀሳቦች',
  },
}

export const strings: Record<Lang, Strings> = { en, am }
