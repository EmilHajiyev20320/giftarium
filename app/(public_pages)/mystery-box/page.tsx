import { MysteryBoxForm } from '@/src/components/mystery-box/mystery-box-form'

export default function MysteryBoxPage() {
  return (
    <div className="bg-cosmic-gradient min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-magic-lavender rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-magic-fairy rounded-full filter blur-3xl opacity-10"></div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">Mystery Gift Box</h1>
        <p className="text-neutral-200 text-lg mb-8 max-w-2xl">
          Tell us about the recipient and we'll create a special surprise gift box tailored to them.
        </p>
        <MysteryBoxForm />
      </div>
    </div>
  )
}

