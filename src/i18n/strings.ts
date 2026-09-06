import enJson from './en.json' with { type: 'json' }
import amJson from './am.json' with { type: 'json' }

export type Lang = 'en' | 'am'

/** Full UI string pack (EN / Amharic) */
export type Strings = typeof enJson

export const strings: Record<Lang, Strings> = {
  en: enJson,
  am: amJson as unknown as Strings,
}
