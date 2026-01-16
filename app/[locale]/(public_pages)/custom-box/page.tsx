import { getTranslations } from 'next-intl/server'
import { CustomBoxBuilder } from '@/src/components/custom-box/custom-box-builder'

export default async function CustomBoxPage() {
  const t = await getTranslations('customBox')

  return (
    <div className="bg-cosmic-gradient min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-magic-lavender rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-magic-fairy rounded-full filter blur-3xl opacity-10"></div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 font-display">{t('title')}</h1>
        <CustomBoxBuilder />
      </div>
    </div>
  )
}

