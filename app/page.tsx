import { redirect } from 'next/navigation'
import { routing } from '@/src/i18n/routing'

// Root page - redirect to default locale
// The middleware should handle this, but this is a fallback
export default function HomePage() {
  redirect(`/${routing.defaultLocale}`)
}
