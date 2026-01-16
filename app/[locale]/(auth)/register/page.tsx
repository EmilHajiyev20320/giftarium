import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { RegisterForm } from '@/src/components/auth/register-form'

export default async function RegisterPage() {
  const t = await getTranslations('auth')

  return (
    <div className="bg-cosmic-gradient min-h-screen flex items-center py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-magic-lavender rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-magic-fairy rounded-full filter blur-3xl opacity-10"></div>
      <div className="container mx-auto px-4 w-full relative z-10">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center font-display">{t('createAccount')}</h1>
          <Suspense fallback={<div className="text-center py-8 text-neutral-200">{t('loading')}</div>}>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

