'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/src/i18n/routing'
import { Button } from '@/src/components/ui/button'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const languages = [
    { code: 'en', flag: 'EN', title: 'English' },
    { code: 'az', flag: '🇦🇿', title: 'Azərbaycan' },
    { code: 'ru', flag: '🇷🇺', title: 'Русский' },
  ]

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-1.5 p-1 bg-cosmic-600/30 border border-cosmic-500/30 rounded-lg">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={locale === lang.code ? 'default' : 'ghost'}
          size="sm"
          onClick={() => switchLanguage(lang.code)}
          title={lang.title}
          className={`p-2 min-w-[2.5rem] h-9 flex items-center justify-center ${
            locale === lang.code
              ? 'bg-magic-gold/20 text-magic-gold border border-magic-gold/50'
              : 'text-neutral-300 hover:text-magic-gold hover:bg-cosmic-600/50 border border-transparent'
          }`}
        >
          <span className={lang.code === 'en' ? 'text-xs font-semibold leading-none' : 'text-lg leading-none'}>{lang.flag}</span>
        </Button>
      ))}
    </div>
  )
}

