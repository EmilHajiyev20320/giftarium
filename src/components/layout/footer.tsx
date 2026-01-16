'use client'

import { Link } from '@/src/i18n/routing'
import { useTranslations } from 'next-intl'
import { Logo } from '@/src/components/layout/logo'

export function Footer() {
  const t = useTranslations('common')
  const tFooter = useTranslations('footer')

  return (
    <footer className="border-t border-cosmic-500/30 bg-berry-gradient mt-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-magic-lavender rounded-full filter blur-3xl opacity-5"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-magic-fairy rounded-full filter blur-3xl opacity-5"></div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-magic rounded-lg flex items-center justify-center shadow-glow-gold relative overflow-hidden">
                <Logo 
                  width={24} 
                  height={24} 
                  className="object-contain relative z-10"
                  containerClassName="relative z-10"
                />
              </div>
              <h3 className="font-semibold text-neutral-50 font-display">Giftarium</h3>
            </div>
            <p className="text-sm text-neutral-300">
              {tFooter('description')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-neutral-50">{tFooter('shop')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/premade-boxes" className="text-neutral-300 hover:text-magic-gold transition-colors">
                  {t('premadeBoxes')}
                </Link>
              </li>
              <li>
                <Link href="/custom-box" className="text-neutral-300 hover:text-magic-gold transition-colors">
                  {t('customBox')}
                </Link>
              </li>
              <li>
                <Link href="/mystery-box" className="text-neutral-300 hover:text-magic-gold transition-colors">
                  {t('mysteryBox')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-neutral-50">{tFooter('account')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/orders" className="text-neutral-300 hover:text-magic-gold transition-colors">
                  {t('orders')}
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-neutral-300 hover:text-magic-gold transition-colors">
                  {t('login')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-neutral-50">{tFooter('support')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-neutral-300 hover:text-magic-gold transition-colors">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-cosmic-500/30 text-center text-sm text-neutral-400">
          <p>&copy; {new Date().getFullYear()} Giftarium. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

