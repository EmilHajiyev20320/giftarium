'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ProductCategory } from '@prisma/client'

export function ProductFilters() {
  const t = useTranslations('products.filters')
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category') || 'all'

  const categories: { value: ProductCategory | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: t('allCategories'), icon: '📦' },
    { value: 'TOYS', label: t('categories.toys'), icon: '🧸' },
    { value: 'ACCESSORIES', label: t('categories.accessories'), icon: '💍' },
    { value: 'COSMETICS', label: t('categories.cosmetics'), icon: '💄' },
    { value: 'SWEETS', label: t('categories.sweets'), icon: '🍬' },
    { value: 'HYGIENE', label: t('categories.hygiene'), icon: '🧴' },
    { value: 'OTHER', label: t('categories.other'), icon: '🎁' },
  ]

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl text-neutral-50 mb-4">{t('title')}</h2>
      <div>
        <label className="block text-sm font-medium mb-3 text-neutral-200">{t('category')}</label>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                selectedCategory === cat.value
                  ? 'bg-gradient-magic text-cosmic-800 shadow-glow-gold border-2 border-magic-gold'
                  : 'bg-cosmic-700/50 text-neutral-200 border-2 border-cosmic-500/30 hover:bg-cosmic-600 hover:border-magic-gold/50'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="font-medium">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

