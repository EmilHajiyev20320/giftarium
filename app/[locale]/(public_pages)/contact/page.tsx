import { getTranslations } from 'next-intl/server'
import { ContactForm } from '@/src/components/contact/contact-form'

export default async function ContactPage() {
  const t = await getTranslations('contact')

  return (
    <div className="bg-cosmic-gradient min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-magic-lavender rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-magic-fairy rounded-full filter blur-3xl opacity-10"></div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">{t('title')}</h1>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              {t('description')}
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

