import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/src/i18n/routing'
import '../globals.css'
import { Providers } from '@/src/components/providers'
import { ConditionalNavbar } from '@/src/components/layout/conditional-navbar'
import { Footer } from '@/src/components/layout/footer'

export const metadata: Metadata = {
  title: 'GiftBoxApp - Personalized Gift Boxes',
  description: 'Create or purchase personalized gift boxes for your loved ones',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <div className="flex flex-col min-h-screen">
          <ConditionalNavbar />
          <main className="flex-1 pt-24">{children}</main>
          <Footer />
        </div>
      </Providers>
    </NextIntlClientProvider>
  )
}

