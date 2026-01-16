'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface ProductSearchProps {
  initialSearch?: string
}

export function ProductSearch({ initialSearch }: ProductSearchProps) {
  const t = useTranslations('products.search')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(initialSearch || '')

  useEffect(() => {
    setSearchQuery(initialSearch || '')
  }, [initialSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    } else {
      params.delete('search')
    }
    
    // Reset to page 1 when searching
    params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  const handleClear = () => {
    setSearchQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    router.push(`/products?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg
            className="w-5 h-5 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('placeholder')}
          className="input-field w-full pl-12 pr-24"
        />
        <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-magic text-cosmic-800 rounded-lg font-semibold hover:shadow-glow-gold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-magic-gold/50"
          >
            {t('button')}
          </button>
        </div>
      </div>
    </form>
  )
}

