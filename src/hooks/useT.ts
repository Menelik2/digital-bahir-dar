import { useEffect } from 'react'
import { useAppStore } from '@/store'
import { strings, type Strings, type Lang } from '@/i18n/strings'

/**
 * Safe i18n access: never throw on missing keys.
 * - Existing objects are wrapped
 * - Missing sections return a branch proxy so `t.common.skipToContent` works
 * - Missing leaves return '' (safe as React children)
 */
function safeStrings(input: unknown): unknown {
  if (input === null || input === undefined) return missingSection()
  if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return input
  }
  if (typeof input !== 'object') return ''

  return new Proxy(input as Record<string, unknown>, {
    get(target, prop) {
      if (prop === Symbol.toPrimitive) return () => ''
      if (prop === 'toString' || prop === 'valueOf') return () => ''
      if (typeof prop === 'symbol') return undefined
      const key = String(prop)
      if (key === '$$typeof' || key === 'constructor' || key === 'prototype') return undefined

      if (Object.prototype.hasOwnProperty.call(target, key)) {
        const val = target[key]
        if (val !== null && typeof val === 'object') return safeStrings(val)
        return val ?? ''
      }

      // Missing key under a real object → treat as leaf
      return ''
    },
  })
}

/** Missing top-level section (e.g. t.common when common is absent) */
function missingSection(): unknown {
  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === Symbol.toPrimitive) return () => ''
        if (prop === 'toString' || prop === 'valueOf') return () => ''
        if (typeof prop === 'symbol') return undefined
        const key = String(prop)
        if (key === '$$typeof' || key === 'constructor' || key === 'prototype') return undefined
        return ''
      },
    }
  )
}

export function useT(): Strings {
  const language = useAppStore((s) => s.language)
  const pack = strings[language] ?? strings.en
  // If pack is empty {}, still wrap so t.common.skipToContent → ''
  if (!pack || (typeof pack === 'object' && Object.keys(pack as object).length === 0)) {
    return safeStrings({}) as Strings
  }
  return safeStrings(pack) as Strings
}

export function useLang() {
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)
  return { language, setLanguage, isAm: language === 'am' }
}

/** Keep <html lang> and dir in sync with app language */
export function useDocumentLang() {
  const language = useAppStore((s) => s.language) as Lang
  useEffect(() => {
    const html = document.documentElement
    html.lang = language === 'am' ? 'am' : 'en'
    html.dir = 'ltr'
    if (language === 'am') {
      html.classList.add('lang-am')
    } else {
      html.classList.remove('lang-am')
    }
  }, [language])
}
