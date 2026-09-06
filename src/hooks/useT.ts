import { useEffect } from 'react'
import { useAppStore } from '@/store'
import { strings, type Strings, type Lang } from '@/i18n/strings'

/**
 * Nested proxy: missing keys return another safe object / empty string
 * so `t.common.skipToContent` never throws when packs are incomplete.
 * React receives strings (or '') for leaf access patterns used in JSX.
 */
function safeStrings(input: unknown): unknown {
  if (input === null || input === undefined) {
    return emptyBranch()
  }
  if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return input
  }
  if (typeof input !== 'object') {
    return ''
  }
  return new Proxy(input as Record<string, unknown>, {
    get(target, prop) {
      if (prop === Symbol.toPrimitive) return () => ''
      if (prop === 'toString' || prop === 'valueOf') return () => ''
      if (typeof prop === 'symbol') return undefined
      const key = String(prop)
      if (key === '$$typeof' || key === 'constructor' || key === 'prototype') return undefined
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        return safeStrings(target[key])
      }
      return emptyBranch()
    },
  })
}

function emptyBranch(): unknown {
  return new Proxy(
    {},
    {
      get(_t, prop) {
        if (prop === Symbol.toPrimitive) return () => ''
        if (prop === 'toString' || prop === 'valueOf') return () => ''
        if (typeof prop === 'symbol') return undefined
        const key = String(prop)
        if (key === '$$typeof' || key === 'constructor' || key === 'prototype') return undefined
        // Intermediate missing sections stay objects; leaf reads become ''
        // Distinguish leaf vs branch by returning a string-capable proxy
        return leafOrBranch()
      },
    }
  )
}

/** Further access returns ''; string coercion returns '' */
function leafOrBranch(): unknown {
  const fn = () => ''
  return new Proxy(fn, {
    get(_t, prop) {
      if (prop === Symbol.toPrimitive) return () => ''
      if (prop === 'toString' || prop === 'valueOf') return () => ''
      if (typeof prop === 'symbol') return undefined
      const key = String(prop)
      if (key === '$$typeof' || key === 'constructor' || key === 'prototype') return undefined
      // Keep nesting safe for t.a.b.c patterns
      return leafOrBranch()
    },
    apply() {
      return ''
    },
  })
}

export function useT(): Strings {
  const language = useAppStore((s) => s.language)
  const pack = strings[language] ?? strings.en
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
