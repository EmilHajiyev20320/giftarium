import { ProductDetails } from '@/src/components/products/product-details'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails productId={id} />
    </div>
  )
}

