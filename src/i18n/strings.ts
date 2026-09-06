import enJson from './en.json'
import amJson from './am.json'

export type Lang = 'en' | 'am'

/** Full UI string pack (EN / Amharic) */
export type Strings = typeof enJson

export const strings: Record<Lang, Strings> = {
  en: enJson,
  am: amJson,
}
