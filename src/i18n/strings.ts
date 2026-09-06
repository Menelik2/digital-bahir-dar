import enJson from './en.json' with { type: 'json' }
import amJson from './am.json' with { type: 'json' }

export type Lang = 'en' | 'am'

/**
 * UI string pack. Typed loosely so pages can use keys that are still being
 * restored into en.json / am.json without blocking production builds.
 * Runtime access is also guarded by the safe proxy in useT().
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Strings = any

export const strings: Record<Lang, Strings> = {
  en: enJson,
  am: amJson,
}
