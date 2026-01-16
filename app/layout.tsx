import './globals.css'
import { Providers } from '@/src/components/providers'

// Root layout - this should not redirect
// The middleware handles redirecting / to /en
// This layout is only used for routes that don't match [locale] (like /admin)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
