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
  phone?: string
  website?: string
  /** Longer About text for pro place detail (EN) */
  about?: string
  aboutAm?: string
  /** Guest rating 1–5 (e.g. from Tripadvisor) when known */
  rating?: number
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
    lat: 11.6055,
    lng: 37.4008,
    address: 'Adwa Road / A3 near Abay Bridge, Bahir Dar',
    stars: 4,
    featured: true,
  },
  {
    name: 'Sky Resort',
    nameAm: 'ስካይ ሪዞርት',
    mapsUrl: 'https://maps.app.goo.gl/P4J7Wy2hqMBxUQbi6?g_st=atm',
    lat: 11.59606,
    lng: 37.38686,
    address: 'St. George Church Sefere Selam Sub City · Lake Tana shore, Bahir Dar',
    stars: 4,
    featured: true,
    priceFrom: 3500,
    priceTo: 12000,
    phone: '+251 91 834 0025',
    website: 'https://skyresortbahirdar.com/',
    rating: 4.3,
    about:
      'Modern lakeside resort on the southern shore of Lake Tana, steps from the ferry port. Spacious rooms with lake views, outdoor dining, spa & massage, conference facilities, free Wi‑Fi, parking, and airport shuttle. Ideal base for Blue Nile Falls, Zege monasteries, and city exploring.',
    aboutAm:
      'በጣና ሐይቅ ደቡባዊ ዳርቻ ላይ ያለ ዘመናዊ ሪዞርት፣ ከፌሪ ወደብ አቅራቢያ። ሰፊ ክፍሎች ከሐይቅ እይታ ጋር፣ ከቤት ውጭ መመገቢያ፣ ስፓ እና ማሣጅ፣ ኮንፈረንስ አገልግሎት፣ ነፃ ዋይፋይ፣ ፓርኪንግ እና የአውሮፕላን ማረፊያ ሻትል። ለብሉ ናይል ፏፏቴ፣ ዘጌ ገዳማት እና ከተማ ጉብኝት ተመራጭ።',
  },
  {
    name: 'Winn Hotel',
    nameAm: 'ዊን ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/pm2EatMqp3gR8W4u9?g_st=atm',
    lat: 11.59348,
    lng: 37.38783,
    address: 'Giorgis Road, Bahir Dar',
    stars: 3,
  },
  {
    name: 'Jacaranda Hotel',
    nameAm: 'ጃካራንዳ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/cBAp95uc2zTfiNhF8?g_st=atm',
    // OSM verified — Old Route 3 near old stadium / Lake Tana
    lat: 11.5999,
    lng: 37.38108,
    address: 'Opposite Bahir Dar Old Stadium, Old Route 3, Bahir Dar',
    stars: 3,
    featured: true,
  },
  {
    name: 'Unison Hotel',
    nameAm: 'ዩኒሰን ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/EwcqTPcpqi43GMjMA?g_st=atm',
    lat: 11.59571,
    lng: 37.38543,
    address: 'Unison Hotel & Spa, Old Route 3, Bahir Dar',
    stars: 3,
    featured: true,
  },
  {
    name: 'Tana Hotel',
    nameAm: 'ጣና ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/tAha7FiX9i4aMNT98?g_st=atm',
    lat: 11.60362,
    lng: 37.39458,
    address: 'Lake Tana shore / Old Route 3, Bahir Dar',
    stars: 3,
    featured: true,
  },
  {
    name: 'Rahnile Hotel',
    nameAm: 'ራህናይል ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/aquxgrHFKyrauekEA?g_st=atm',
    lat: 11.59364,
    lng: 37.39002,
    address: 'Old Route 3, Bahir Dar',
    stars: 3,
  },
  {
    name: 'Blue Nile Hotel',
    nameAm: 'ብሉ ናይል ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/example-blue-nile',
    lat: 11.598,
    lng: 37.39,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Lake Avenue Hotel',
    nameAm: 'ሌክ አቬኑ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/example-lake-ave',
    lat: 11.597,
    lng: 37.388,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Dib Anbessa Hotel',
    nameAm: 'ድብ አንበሳ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/example-dib',
    lat: 11.594,
    lng: 37.392,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Palm Palace Hotel',
    nameAm: 'ፓልም ፓሌስ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/example-palm',
    lat: 11.591,
    lng: 37.387,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Nova Hotel',
    nameAm: 'ኖቫ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/example-nova',
    lat: 11.595,
    lng: 37.393,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Lakemark Hotel',
    nameAm: 'ሌክማርክ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/example-lakemark',
    lat: 11.6,
    lng: 37.385,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Naky Hotel',
    nameAm: 'ናኪ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/example-naky',
    lat: 11.589,
    lng: 37.39,
    address: 'Bahir Dar',
    stars: 2,
  },
  {
    name: 'Felege Ghion Eco-Resort',
    nameAm: 'ፈለገ ጽዮን ኢኮ-ሪዞርት',
    mapsUrl: 'https://maps.app.goo.gl/example-felege',
    lat: 11.61,
    lng: 37.4,
    address: 'Bahir Dar',
    stars: 3,
    featured: true,
  },
  {
    name: 'Azewa Hotel',
    nameAm: 'አዘዋ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/example-azewa',
    lat: 11.5925,
    lng: 37.3885,
    address: 'Bahir Dar',
    stars: 2,
  },
  {
    name: 'Yiganda Hotel',
    nameAm: 'ይጋንዳ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/example-yiganda',
    lat: 11.588,
    lng: 37.391,
    address: 'Bahir Dar',
    stars: 2,
  },
  {
    name: 'Blue Nile Resort Hotel',
    nameAm: 'ብሉ ናይል ሪዞርት ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/7v6Kt7HwLTpDDqdu6?g_st=atm',
    lat: 11.6038,
    lng: 37.37964,
    address: 'Kebele 03, Fasilo, Lake Tana shore, Bahir Dar',
    stars: 4,
    featured: true,
  },
  {
    name: 'Yamen Hotel',
    nameAm: 'ያመን ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/nyrYhkiN2bRApmBX7?g_st=atm',
    lat: 11.5865,
    lng: 37.3898,
    address: 'Bahir Dar',
    stars: 2,
  },
  {
    name: 'Olive Hotel and Spa',
    nameAm: 'ኦሊቭ ሆቴል እና ስፓ',
    mapsUrl: 'https://maps.app.goo.gl/r1axCoK8tzAugrkU8?g_st=atm',
    lat: 11.59321,
    lng: 37.38225,
    address: 'Fasilo Sub City, Kebele 15, Bahir Dar',
    stars: 4,
    featured: true,
  },
]
