import { Suspense } from 'react'
import { PreMadeBoxDetails } from '@/src/components/premade-boxes/premade-box-details'

export default async function PreMadeBoxDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  return (
    <div className="bg-background-main min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<div className="text-center py-8">Loading box details...</div>}>
          <PreMadeBoxDetails boxId={id} />
        </Suspense>
      </div>
    </div>
  )
}

