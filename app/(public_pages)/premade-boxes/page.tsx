import { PreMadeBoxGrid } from '@/src/components/premade-boxes/premade-box-grid'

export default async function PreMadeBoxesPage() {
  return (
    <div className="bg-cosmic-gradient min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-magic-lavender rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-magic-fairy rounded-full filter blur-3xl opacity-10"></div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">Pre-Made Gift Boxes</h1>
        <p className="text-neutral-200 text-lg mb-8 max-w-2xl">
          Browse our curated collection of ready-made gift boxes for every occasion.
        </p>
        <PreMadeBoxGrid />
      </div>
    </div>
  )
}

