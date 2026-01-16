import { getTranslations } from 'next-intl/server'
import { ProductGrid } from '@/src/components/products/product-grid'
import { ProductFilters } from '@/src/components/products/product-filters'
import { ProductSearch } from '@/src/components/products/product-search'

export default async function ProductsPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
  params: Promise<{ locale: string }>
}) {
  const resolvedSearchParams = await searchParams
  const t = await getTranslations('common')

  return (
    <div className="bg-cosmic-gradient min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-magic-lavender rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-magic-fairy rounded-full filter blur-3xl opacity-10"></div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 font-display">{t('products')}</h1>
        <ProductSearch initialSearch={resolvedSearchParams.search} />
      <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
        <aside className="lg:col-span-1">
          <ProductFilters />
        </aside>
        <main className="lg:col-span-3">
          <ProductGrid 
            category={resolvedSearchParams.category}
            search={resolvedSearchParams.search}
          />
        </main>
      </div>
      </div>
    </div>
  )
}

