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

const profileFixes = {
  en: {
    signInPrompt:
      'Sign in to save places, write reviews, and manage trips.',
    subtitle:
      'Sign in to save places, write reviews, and manage trips.',
  },
  am: {
    signInPrompt: 'ቦታዎችን ለማስቀመጥ፣ ግምገማ ለመጻፍ እና ጉዞዎችን ለማስተዳደር ይግቡ።',
    subtitle: 'ቦታዎችን ለማስቀመጥ፣ ግምገማ ለመጻፍ እና ጉዞዎችን ለማስተዳደር ይግቡ።',
  },
} as const

function withProfileFixes(lang: Lang, pack: Record<string, unknown>): Strings {
  const profile = {
    ...((pack.profile as Record<string, unknown>) ?? {}),
    ...profileFixes[lang],
  }
  return { ...pack, profile }
}

export const strings: Record<Lang, Strings> = {
  en: withProfileFixes('en', enJson as Record<string, unknown>),
  am: withProfileFixes('am', amJson as Record<string, unknown>),
}
