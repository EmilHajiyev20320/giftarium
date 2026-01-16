import { getTranslations } from 'next-intl/server'
import { Button } from '@/src/components/ui/button'
import { Logo } from '@/src/components/layout/logo'
import { Link as I18nLink } from '@/src/i18n/routing'
import { MagicalBackground } from '@/src/components/layout/magical-background'

export default async function HomePage() {
  const t = await getTranslations('home')

  return (
    <main className="min-h-screen bg-cosmic-gradient relative overflow-hidden">
      {/* Magical Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-magic-lavender rounded-full filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-magic-fairy rounded-full filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-magic-gold rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      
      {/* Sparkles and Magical Elements */}
      <MagicalBackground />
      
      {/* Hero Section */}
      <section className="relative container mx-auto px-4 pt-12 pb-12 md:pt-16 md:pb-16 text-center overflow-hidden z-10">
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 flex justify-center">
            <div className="w-52 h-52 md:w-60 md:h-60 rounded-2xl flex items-center justify-center mb-4 relative group overflow-hidden animate-pulse-glow">
              <Logo 
                width={200} 
                height={200} 
                className="object-contain relative z-10"
                containerClassName="relative z-10"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-magic opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
              {/* Light rays emanating from logo */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-1 h-1/2 origin-bottom"
                      style={{
                        transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                        background: 'linear-gradient(to top, rgba(255, 184, 76, 0.4), transparent)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-display relative">
            <span className="relative z-10">{t('title')}</span>
            <span className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none"></span>
          </h1>
          <p className="text-xl text-neutral-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
            <Button asChild variant="default" size="lg" className="w-full sm:w-auto relative overflow-hidden group/btn">
              <I18nLink href="/premade-boxes">
                <span className="relative z-10">{t('browseBoxes')}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></span>
              </I18nLink>
            </Button>
            <Button asChild variant="default" size="lg" className="w-full sm:w-auto relative overflow-hidden group/btn">
              <I18nLink href="/custom-box">
                <span className="relative z-10">{t('buildCustom')}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></span>
              </I18nLink>
            </Button>
            <Button asChild variant="default" size="lg" className="w-full sm:w-auto relative overflow-hidden group/btn">
              <I18nLink href="/mystery-box">
                <span className="relative z-10">{t('mysteryBox')}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></span>
              </I18nLink>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 font-display">{t('features.title')}</h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            {t('features.subtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-magic rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-gold relative animate-float">
              <span className="text-3xl relative z-10 group-hover:scale-110 transition-transform duration-300">🎁</span>
              <div className="absolute inset-0 rounded-full bg-gradient-magic opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300"></div>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-neutral-50">{t('features.premade.title')}</h3>
            <p className="text-neutral-300 leading-relaxed mb-6">
              {t('features.premade.description')}
            </p>
            <Button asChild variant="outline" className="mt-4">
              <I18nLink href="/premade-boxes">{t('features.premade.cta')}</I18nLink>
            </Button>
          </div>
          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-magic rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-gold relative animate-float" style={{ animationDelay: '1s' }}>
              <span className="text-3xl relative z-10 group-hover:scale-110 transition-transform duration-300">✨</span>
              <div className="absolute inset-0 rounded-full bg-gradient-magic opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300"></div>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-neutral-50">{t('features.custom.title')}</h3>
            <p className="text-neutral-300 leading-relaxed mb-6">
              {t('features.custom.description')}
            </p>
            <Button asChild variant="outline" className="mt-4">
              <I18nLink href="/custom-box">{t('features.custom.cta')}</I18nLink>
            </Button>
          </div>
          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-magic rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-gold relative animate-float" style={{ animationDelay: '2s' }}>
              <span className="text-3xl relative z-10 group-hover:scale-110 transition-transform duration-300">🎉</span>
              <div className="absolute inset-0 rounded-full bg-gradient-magic opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300"></div>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-neutral-50">{t('features.mystery.title')}</h3>
            <p className="text-neutral-300 leading-relaxed mb-6">
              {t('features.mystery.description')}
            </p>
            <Button asChild variant="outline" className="mt-4">
              <I18nLink href="/mystery-box">{t('features.mystery.cta')}</I18nLink>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Boxes Section */}
      <section className="bg-berry-gradient py-8 md:py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 font-display">{t('featured.title')}</h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              {t('featured.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl mb-4 animate-float group-hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.5s' }}>💝</div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-50">{t('featured.forHer.title')}</h3>
              <p className="text-neutral-300 text-sm mb-4">{t('featured.forHer.description')}</p>
              <Button asChild variant="ghost" size="sm">
                <I18nLink href="/premade-boxes?category=beauty">{t('featured.cta')}</I18nLink>
              </Button>
            </div>
            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl mb-4 animate-float group-hover:scale-110 transition-transform duration-300" style={{ animationDelay: '1.5s' }}>🎂</div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-50">{t('featured.birthday.title')}</h3>
              <p className="text-neutral-300 text-sm mb-4">{t('featured.birthday.description')}</p>
              <Button asChild variant="ghost" size="sm">
                <I18nLink href="/premade-boxes">{t('featured.cta')}</I18nLink>
              </Button>
            </div>
            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl mb-4 animate-float group-hover:scale-110 transition-transform duration-300" style={{ animationDelay: '2.5s' }}>🎄</div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-50">{t('featured.holiday.title')}</h3>
              <p className="text-neutral-300 text-sm mb-4">{t('featured.holiday.description')}</p>
              <Button asChild variant="ghost" size="sm">
                <I18nLink href="/premade-boxes">{t('featured.cta')}</I18nLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 py-8 md:py-12 relative z-10 overflow-hidden">
        {/* Background overlay to hide magical background elements */}
        <div className="absolute inset-0 bg-cosmic-gradient -z-10"></div>
        
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 font-display">{t('whyChoose.title')}</h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed mt-4">
            {t('whyChoose.subtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto relative z-10">
          <div className="text-center group">
            <div className="w-14 h-14 bg-gradient-magic rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-gold group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🚚</span>
            </div>
            <h3 className="font-semibold mb-2 text-neutral-50">{t('whyChoose.delivery.title')}</h3>
            <p className="text-sm text-neutral-300">{t('whyChoose.delivery.description')}</p>
          </div>
          <div className="text-center group">
            <div className="w-14 h-14 bg-gradient-magic rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-gold group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🎯</span>
            </div>
            <h3 className="font-semibold mb-2 text-neutral-50">{t('whyChoose.personalized.title')}</h3>
            <p className="text-sm text-neutral-300">{t('whyChoose.personalized.description')}</p>
          </div>
          <div className="text-center group">
            <div className="w-14 h-14 bg-gradient-magic rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-gold group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">⭐</span>
            </div>
            <h3 className="font-semibold mb-2 text-neutral-50">{t('whyChoose.quality.title')}</h3>
            <p className="text-sm text-neutral-300">{t('whyChoose.quality.description')}</p>
          </div>
          <div className="text-center group">
            <div className="w-14 h-14 bg-gradient-magic rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-gold group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🎁</span>
            </div>
            <h3 className="font-semibold mb-2 text-neutral-50">{t('whyChoose.perfect.title')}</h3>
            <p className="text-sm text-neutral-300">{t('whyChoose.perfect.description')}</p>
          </div>
        </div>
      </section>
    </main>
  )
}

