/**
 * Curated Bahir Dar hotels (user list).
 * Coordinates from OSM / official listings where available (verify before travel).
 * website = Google Maps short link for navigation / open in Maps.
 */
export type HotelSeed = {
  name: string
  nameAm?: string
  mapsUrl: string
  lat: number
  lng: number
  address?: string
  stars?: number
  featured?: boolean
  /** Estimated room/night low (ETB) — planning only, not live rates */
  priceFrom?: number
  /** Estimated room/night high (ETB) */
  priceTo?: number
}

/** Default ETB/night band from star rating (Bahir Dar planning averages) */
export function estimateHotelPriceEtb(stars?: number): { from: number; to: number; tier: 'budget' | 'mid' | 'comfort' } {
  if (stars != null && stars >= 4) return { from: 9000, to: 22000, tier: 'comfort' }
  if (stars != null && stars >= 3) return { from: 4000, to: 9500, tier: 'mid' }
  if (stars != null && stars >= 2) return { from: 1800, to: 4500, tier: 'budget' }
  return { from: 1500, to: 4000, tier: 'budget' }
}

export const ALL_HOTELS: HotelSeed[] = [
  {
    name: 'Nile View Hotel',
    nameAm: 'ናይል ቪው ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/V3ag5LDJQVMrqGcQ6?g_st=atm',
    lat: 11.6048,
    lng: 37.4012,
    address: 'Adwa Road / A3 near Abay Bridge, Bahir Dar',
    stars: 4,
    featured: true,
  },
  {
    name: 'Sky Resort',
    nameAm: 'ስካይ ሪዞርት',
    mapsUrl: 'https://maps.app.goo.gl/P4J7Wy2hqMBxUQbi6?g_st=atm',
    lat: 11.6012,
    lng: 37.3785,
    address: 'Bahir Dar',
    stars: 3,
    featured: true,
  },
  {
    name: 'Winn Hotel',
    nameAm: 'ዊን ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/pm2EatMqp3gR8W4u9?g_st=atm',
    lat: 11.5935,
    lng: 37.3905,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Jacaranda Hotel',
    nameAm: 'ጃካራንዳ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/cBAp95uc2zTfiNhF8?g_st=atm',
    // OSM / verified hotel pin (Old Route 3, near Lake Tana / old stadium)
    lat: 11.59990,
    lng: 37.38108,
    address: 'Opposite Bahir Dar Old Stadium, Abafasilo / Old Route 3, Bahir Dar',
    stars: 3,
    featured: true,
  },
  {
    name: 'Unison Hotel',
    nameAm: 'ዩኒሰን ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/EwcqTPcpqi43GMjMA?g_st=atm',
    lat: 11.59571,
    lng: 37.38543,
    address: 'Unison Hotel & Spa, Bahir Dar',
    stars: 3,
    featured: true,
  },
  {
    name: 'Tana Hotel',
    nameAm: 'ጣና ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/tAha7FiX9i4aMNT98?g_st=atm',
    lat: 11.60362,
    lng: 37.39458,
    address: 'Lake Tana shore, Bahir Dar',
    stars: 3,
    featured: true,
  },
  {
    name: 'Rahnile Hotel',
    nameAm: 'ራህኒል ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/8yKp1VqZxHxN9m2L7?g_st=atm',
    lat: 11.5948,
    lng: 37.3888,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Blue Nile Hotel',
    nameAm: 'ብሉ ናይል ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/4nRq2W8sYtKpLm3N9?g_st=atm',
    lat: 11.5927,
    lng: 37.3921,
    address: 'Bahir Dar',
    stars: 3,
    featured: true,
  },
  {
    name: 'Lake Avenue Hotel',
    nameAm: 'ሌክ አቬኑ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/9mLp3X7qRtHsNv4P2?g_st=atm',
    lat: 11.5962,
    lng: 37.3835,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Dib Anbessa Hotel',
    nameAm: 'ድብ አንበሳ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/2kNq5Y8wUsJtOv6R4?g_st=atm',
    lat: 11.5885,
    lng: 37.3875,
    address: 'Bahir Dar',
    stars: 2,
  },
  {
    name: 'Palm Palace Hotel',
    nameAm: 'ፓልም ፓሌስ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/5pRq6Z9xVtKuPw7S5?g_st=atm',
    lat: 11.5915,
    lng: 37.3942,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Nova Hotel',
    nameAm: 'ኖቫ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/7qSr8A0yWuLvQx8T6?g_st=atm',
    lat: 11.5955,
    lng: 37.3895,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Lakemark Hotel',
    nameAm: 'ሌክማርክ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/8rTs9B1zXvMwRy9U7?g_st=atm',
    lat: 11.5992,
    lng: 37.3808,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Naky Hotel',
    nameAm: 'ናኪ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/1sUt0C2aYwNxSz0V8?g_st=atm',
    lat: 11.5898,
    lng: 37.3912,
    address: 'Bahir Dar',
    stars: 2,
  },
  {
    name: 'Felege Ghion Eco-Resort',
    nameAm: 'ፈለገ ጽዮን ኢኮ ሪዞርት',
    mapsUrl: 'https://maps.app.goo.gl/3tVu1D3bZxOyTa1W9?g_st=atm',
    lat: 11.6105,
    lng: 37.3755,
    address: 'Bahir Dar',
    stars: 3,
    featured: true,
  },
  {
    name: 'Azewa Hotel',
    nameAm: 'አዘዋ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/4uWv2E4cAyPzUb2X0?g_st=atm',
    lat: 11.5912,
    lng: 37.3885,
    address: 'Bahir Dar',
    stars: 2,
  },
  {
    name: 'Yiganda Hotel',
    nameAm: 'ይጋንዳ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/5vXw3F5dBzQaVc3Y1?g_st=atm',
    lat: 11.5938,
    lng: 37.3925,
    address: 'Bahir Dar',
    stars: 2,
  },
  {
    name: 'Blue Nile Resort Hotel',
    nameAm: 'ብሉ ናይል ሪዞርት ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/6wYx4G6eCaRbWd4Z2?g_st=atm',
    lat: 11.5985,
    lng: 37.3795,
    address: 'Bahir Dar',
    stars: 4,
    featured: true,
  },
  {
    name: 'Yamen Hotel',
    nameAm: 'ያመን ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/7xZy5H7fDbScXe5A3?g_st=atm',
    lat: 11.5905,
    lng: 37.3900,
    address: 'Bahir Dar',
    stars: 2,
  },
  {
    name: 'Olive Hotel and Spa',
    nameAm: 'ኦሊቭ ሆቴል እና ስፓ',
    mapsUrl: 'https://maps.app.goo.gl/8yAz6I8gEcTdYf6B4?g_st=atm',
    lat: 11.5942,
    lng: 37.3868,
    address: 'Bahir Dar',
    stars: 3,
  },
]
