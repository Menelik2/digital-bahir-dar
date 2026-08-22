import { useEffect } from 'react'
import { useAppStore } from '@/store'
import { strings, type Strings, type Lang } from '@/i18n/strings'

export function useT(): Strings {
  const language = useAppStore((s) => s.language)
  return strings[language] ?? strings.en
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
    // Slightly larger base line-height helps Ethiopic script readability
    if (language === 'am') {
      html.classList.add('lang-am')
    } else {
      html.classList.remove('lang-am')
    }
  }, [language])
}
