'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Link } from '@/src/i18n/routing'
import NextLink from 'next/link'
import { Button } from '@/src/components/ui/button'
import { useCartStore } from '@/src/store/cart-store'
import { Logo } from '@/src/components/layout/logo'
import { LanguageSwitcher } from './language-switcher'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export function Navbar() {
  const { data: session } = useSession()
  const t = useTranslations('common')
  const getItemCount = useCartStore((state) => state.getItemCount)
  const [itemCount, setItemCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setItemCount(getItemCount())
    
    // Subscribe to cart changes
    const unsubscribe = useCartStore.subscribe((state) => {
      setItemCount(state.getItemCount())
    })
    
    return unsubscribe
  }, []) // Remove getItemCount from dependencies to avoid unnecessary re-renders

  return (
    <nav className="w-full border-b border-cosmic-500/30 bg-gradient-cosmic fixed top-0 left-0 right-0 z-50 shadow-lg backdrop-blur-md bg-cosmic-700/90">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 gap-4">
          {/* Left Section: Logo and Navigation */}
          <div className="flex items-center flex-shrink-0 gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 relative overflow-hidden">
                <Logo 
                  width={40} 
                  height={40} 
                  className="object-contain relative z-10"
                  containerClassName="relative z-10"
                  rounded={true}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-magic opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold text-gold-gradient tracking-tight hidden sm:block font-display">
                Giftarium
              </span>
            </Link>
            
            {/* Vertical Separator - LED Style */}
            <div className="hidden lg:block h-12 w-1 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-magic-gold to-transparent opacity-80"></div>
              <div className="absolute inset-0 bg-magic-gold shadow-[0_0_12px_rgba(255,215,0,0.8),0_0_24px_rgba(255,215,0,0.4)] blur-[2px]"></div>
            </div>
            
            {/* Center Section: Navigation Links */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center gap-0.5 lg:gap-1 xl:gap-2">
              <Link 
                href="/premade-boxes" 
                className="text-sm font-medium text-neutral-200 px-3 lg:px-4 py-2.5 rounded-lg hover:bg-cosmic-600/50 hover:text-magic-gold transition-all duration-300 relative group whitespace-nowrap"
              >
                {t('premadeBoxes')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-magic group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                href="/custom-box" 
                className="text-sm font-medium text-neutral-200 px-3 lg:px-4 py-2.5 rounded-lg hover:bg-cosmic-600/50 hover:text-magic-gold transition-all duration-300 relative group whitespace-nowrap"
              >
                {t('customBox')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-magic group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                href="/mystery-box" 
                className="text-sm font-medium text-neutral-200 px-3 lg:px-4 py-2.5 rounded-lg hover:bg-cosmic-600/50 hover:text-magic-gold transition-all duration-300 relative group whitespace-nowrap"
              >
                {t('mysteryBox')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-magic group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                href="/products" 
                className="text-sm font-medium text-neutral-200 px-3 lg:px-4 py-2.5 rounded-lg hover:bg-cosmic-600/50 hover:text-magic-gold transition-all duration-300 relative group whitespace-nowrap"
              >
                {t('products')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-magic group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                href="/contact" 
                className="text-sm font-medium text-neutral-200 px-3 lg:px-4 py-2.5 rounded-lg hover:bg-cosmic-600/50 hover:text-magic-gold transition-all duration-300 relative group whitespace-nowrap"
              >
                {t('contact')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-magic group-hover:w-full transition-all duration-300"></span>
              </Link>
              </div>
            </div>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <LanguageSwitcher />
            
            <Link href={session ? "/checkout" : "/login"} className="relative">
              <Button variant="outline" size="sm" className="relative gap-1.5 h-9 px-2.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="hidden sm:inline text-sm">{t('cart')}</span>
                {mounted && session && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-magic text-cosmic-800 font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-glow-gold text-[10px] leading-none">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {session ? (
              <div className="hidden sm:flex items-center gap-2">
                {session.user?.role === 'ADMIN' && (
                  <NextLink href="/admin">
                    <Button variant="outline" size="sm" className="text-magic-gold border-magic-gold/50 hover:bg-magic-gold/10 h-9 text-sm">
                      Admin Panel
                    </Button>
                  </NextLink>
                )}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 text-sm">
                      {t('profile')}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[180px] bg-cosmic-800 border border-cosmic-500/30 rounded-lg shadow-lg p-1 z-50"
                      sideOffset={5}
                    >
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/profile"
                          className="flex items-center px-3 py-2 text-sm text-neutral-200 rounded-md hover:bg-cosmic-600/50 hover:text-magic-gold outline-none cursor-pointer transition-colors"
                        >
                          {t('profile')}
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/orders"
                          className="flex items-center px-3 py-2 text-sm text-neutral-200 rounded-md hover:bg-cosmic-600/50 hover:text-magic-gold outline-none cursor-pointer transition-colors"
                        >
                          {t('orders')}
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="h-px bg-cosmic-500/30 my-1" />
                      <DropdownMenu.Item asChild>
                        <button
                          onClick={() => signOut()}
                          className="w-full flex items-center px-3 py-2 text-sm text-neutral-200 rounded-md hover:bg-cosmic-600/50 hover:text-red-400 outline-none cursor-pointer transition-colors text-left"
                        >
                          {t('logout')}
                        </button>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="h-9 text-sm">{t('login')}</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="h-9 text-sm">{t('register')}</Button>
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 rounded-lg hover:bg-cosmic-600/50 text-neutral-200 hover:text-magic-gold transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

