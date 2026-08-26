/**
 * Curated Bahir Dar hotels (user list).
 * Coordinates are approximate city positions for in-app map pins.
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
}

export const ALL_HOTELS: HotelSeed[] = [
  {
    name: 'Nile View Hotel',
    mapsUrl: 'https://maps.app.goo.gl/V3ag5LDJQVMrqGcQ6?g_st=atm',
    lat: 11.6048,
    lng: 37.4012,
    address: 'Adwa Road / A3 near Abay Bridge, Bahir Dar',
    stars: 4,
    featured: true,
  },
  {
    name: 'Sky Resort',
    mapsUrl: 'https://maps.app.goo.gl/P4J7Wy2hqMBxUQbi6?g_st=atm',
    lat: 11.6012,
    lng: 37.3785,
    address: 'Bahir Dar',
    stars: 3,
    featured: true,
  },
  {
    name: 'Winn Hotel',
    mapsUrl: 'https://maps.app.goo.gl/pm2EatMqp3gR8W4u9?g_st=atm',
    lat: 11.5935,
    lng: 37.3905,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Jacaranda Hotel',
    mapsUrl: 'https://maps.app.goo.gl/cBAp95uc2zTfiNhF8?g_st=atm',
    lat: 11.5908,
    lng: 37.3862,
    address: 'Bahir Dar, Ethiopia',
    stars: 3,
    featured: true,
  },
  {
    name: 'Unison Hotel',
    mapsUrl: 'https://maps.app.goo.gl/EwcqTPcpqi43GMjMA?g_st=atm',
    lat: 11.5922,
    lng: 37.3918,
    address: 'Bahir Dar',
    stars: 3,
    featured: true,
  },
  {
    name: 'Tana Hotel',
    mapsUrl: 'https://maps.app.goo.gl/tAha7FiX9i4aMNT98?g_st=atm',
    lat: 11.5975,
    lng: 37.3812,
    address: 'Lake Tana shore, Bahir Dar',
    stars: 3,
    featured: true,
  },
  {
    name: 'Rahnile Hotel',
    mapsUrl: 'https://maps.app.goo.gl/aquxgrHFKyrauekEA?g_st=atm',
    lat: 11.5948,
    lng: 37.3888,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Blue Nile Hotel',
    mapsUrl: 'https://maps.app.goo.gl/dJvNq85T26RjxoRu6?g_st=atm',
    lat: 11.5927,
    lng: 37.3921,
    address: 'Kebele 6 area, Bahir Dar',
    stars: 3,
    featured: true,
  },
  {
    name: 'Lake Avenue Hotel',
    mapsUrl: 'https://maps.app.goo.gl/xY37ev5P2tvmULnL9?g_st=atm',
    lat: 11.5962,
    lng: 37.3835,
    address: 'Lake Avenue, Bahir Dar',
    stars: 3,
  },
  {
    name: 'Dib Anbessa Hotel',
    nameAm: 'ድብ አንበሳ ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/6n8rfNTeeSnNzTRPA?g_st=atm',
    lat: 11.5885,
    lng: 37.3875,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Palm Palace Hotel',
    mapsUrl: 'https://maps.app.goo.gl/xbPVgpE7AoCvPhzv7?g_st=atm',
    lat: 11.5915,
    lng: 37.3942,
    address: 'Bahir Dar, Ethiopia',
    stars: 3,
  },
  {
    name: 'Nova Hotel',
    mapsUrl: 'https://maps.app.goo.gl/1RyqiVhuYB9e6Rjq6?g_st=atm',
    lat: 11.5955,
    lng: 37.3895,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Lakemark Hotel',
    mapsUrl: 'https://maps.app.goo.gl/1TCiNj1xrRGqgawK7?g_st=atm',
    lat: 11.5992,
    lng: 37.3808,
    address: 'Bahir Dar',
    stars: 3,
  },
  {
    name: 'Naky Hotel',
    mapsUrl: 'https://maps.app.goo.gl/VF6oEcZPvHxsCgDY9?g_st=atm',
    lat: 11.5898,
    lng: 37.3912,
    address: 'Bahir Dar',
    stars: 2,
  },
  {
    name: 'Felege Ghion Eco-Resort',
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
    lat: 11.5872,
    lng: 37.3858,
    address: 'Bahir Dar',
    stars: 2,
  },
  {
    name: 'Yiganda Hotel',
    mapsUrl: 'https://maps.app.goo.gl/qm1cT2Lx2j67H9uq7?g_st=atm',
    lat: 11.5902,
    lng: 37.3935,
    address: 'Bahir Dar',
    stars: 2,
  },
  {
    name: 'Blue Nile Resort Hotel',
    mapsUrl: 'https://maps.app.goo.gl/7v6Kt7HwLTpDDqdu6?g_st=atm',
    lat: 11.6038,
    lng: 37.3796,
    address: 'Kebele 03, Fasilo, Bahir Dar',
    stars: 4,
    featured: true,
  },
  {
    name: 'Yamen Hotel',
    nameAm: 'የአሜን ሆቴል',
    mapsUrl: 'https://maps.app.goo.gl/nyrYhkiN2bRApmBX7?g_st=atm',
    lat: 11.5865,
    lng: 37.3898,
    address: 'Bahir Dar',
    stars: 2,
  },
  {
    name: 'Olive Hotel and Spa',
    mapsUrl: 'https://maps.app.goo.gl/r1axCoK8tzAugrkU8?g_st=atm',
    lat: 11.5988,
    lng: 37.3865,
    address: 'Bahir Dar',
    stars: 4,
    featured: true,
  },
]
