import { Globe, Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeControls } from '@/hooks/useTheme'
import { useLang, useT } from '@/hooks/useT'

export function ThemeLangControls() {
  const t = useT()
  const { theme, cycle } = useThemeControls()
  const { language, setLanguage } = useLang()

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={cycle}
        title={`${t.theme[theme]}`}
        aria-label={`Theme: ${theme}`}
      >
        <ThemeIcon className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
        title={t.common.language}
        aria-label={t.common.language}
      >
        <span className="text-[11px] font-bold uppercase tracking-wide">
          {language === 'en' ? 'አማ' : 'EN'}
        </span>
        <Globe className="sr-only h-5 w-5" />
      </Button>
    </div>
  )
}
