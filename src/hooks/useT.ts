import { useAppStore } from '@/store'
import { strings, type Strings } from '@/i18n/strings'

export function useT(): Strings {
  const language = useAppStore((s) => s.language)
  return strings[language] ?? strings.en
}

export function useLang() {
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)
  return { language, setLanguage, isAm: language === 'am' }
}
