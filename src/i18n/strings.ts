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
  theme: {
    light: string
    dark: string
    system: string
  }
  common: {
    language: string
    close: string
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
  theme: {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
  common: {
    language: 'Language',
    close: 'Close',
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
  theme: {
    light: 'ብርሃን',
    dark: 'ጨለማ',
    system: 'ስርዓት',
  },
  common: {
    language: 'ቋንቋ',
    close: 'ዝጋ',
  },
}

export const strings: Record<Lang, Strings> = { en, am }
