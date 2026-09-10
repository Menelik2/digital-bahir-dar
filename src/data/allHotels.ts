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
    address: 'Near Lake Tana / St. George area, Bahir Dar',
    stars: 3,
    featured: true,
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
    mapsUrl: 'https://maps.app.goo.gl/dJvNq85T26RjxoRu6?g_st=atm',
    lat: 11.59266,
    lng: 37.39212,
    address: 'Beg Tera / Kebele 6, Bahir Dar',
    stars: 3,
    featured: true,
  },
  {
    name: 'Lake Avenue Hotel',
    nameAm: 'ሌክ አቬኑ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/xY37ev5P2tvmULnL9?g_st=atm',
    lat: 11.59839,
    lng: 37.38315,
    address: 'Lake Avenue, Old Route 3, Bahir Dar',
    stars: 3,
  },
  {
    name: 'Dib Anbessa Hotel',
    nameAm: 'ድብ አንበሳ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/6n8rfNTeeSnNzTRPA?g_st=atm',
    lat: 11.59451,
    lng: 37.39052,
    address: 'Old Route 3, Bahir Dar',
    stars: 3,
  },
  {
    name: 'Palm Palace Hotel',
    nameAm: 'ፓልም ፓሌስ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/xbPVgpE7AoCvPhzv7?g_st=atm',
    lat: 11.5915,
    lng: 37.3942,
    address: 'Bahir Dar, Ethiopia',
    stars: 3,
  },
  {
    name: 'Nova Hotel',
    nameAm: 'ኖቫ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/1RyqiVhuYB9e6Rjq6?g_st=atm',
    lat: 11.59395,
    lng: 37.39232,
    address: 'Beg Tera, Bahir Dar',
    stars: 3,
  },
  {
    name: 'Lakemark Hotel',
    nameAm: 'ሌክማርክ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/1TCiNj1xrRGqgawK7?g_st=atm',
    lat: 11.60615,
    lng: 37.37015,
    address: 'St. Michael area, Bahir Dar',
    stars: 3,
  },
  {
    name: 'Naky Hotel',
    nameAm: 'ናኪ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/VF6oEcZPvHxsCgDY9?g_st=atm',
    lat: 11.5937,
    lng: 37.39043,
    address: 'Beg Tera, Bahir Dar',
    stars: 2,
  },
  {
    name: 'Felege Ghion Eco-Resort',
    nameAm: 'ፍለገ ጽዮን ኢኮ-ሪዞርት',
    mapsUrl: 'https://maps.app.goo.gl/o6gobfmvcDfVHJca6?g_st=atm',
    lat: 11.6085,
    lng: 37.3725,
    address: 'Bahir Dar area',
    stars: 3,
    featured: true,
  },
  {
    name: 'Azewa Hotel',
    nameAm: 'አዝዋ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/xpsbiv1wkPpMVTYz7?g_st=atm',
    lat: 11.58729,
    lng: 37.38497,
    address: 'A3 road, Bahir Dar',
    stars: 2,
  },
  {
    name: 'Yiganda Hotel',
    nameAm: 'ይጋንዳ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/qm1cT2Lx2j67H9uq7?g_st=atm',
    lat: 11.5902,
    lng: 37.3935,
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
