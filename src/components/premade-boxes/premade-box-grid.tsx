'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'

interface PreMadeBox {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  images: string[]
}

export function PreMadeBoxGrid() {
  const [boxes, setBoxes] = useState<PreMadeBox[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchBoxes = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/premade-boxes')
        const data = await response.json()
        // Ensure images array is present
        const boxesWithImages = (data.boxes || []).map((box: PreMadeBox) => ({
          ...box,
          images: box.images || [],
        }))
        if (isMounted) {
          setBoxes(boxesWithImages)
        }
      } catch (error) {
        console.error('Error fetching premade boxes:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchBoxes()
    
    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card overflow-hidden animate-pulse">
            <div className="w-full h-64 bg-cosmic-600"></div>
            <div className="p-6 space-y-3">
              <div className="h-6 bg-cosmic-600 rounded w-3/4"></div>
              <div className="h-4 bg-cosmic-600 rounded w-full"></div>
              <div className="h-4 bg-cosmic-600 rounded w-2/3"></div>
              <div className="h-8 bg-cosmic-600 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (boxes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-24 h-24 bg-gradient-magic rounded-full flex items-center justify-center mb-6 shadow-glow-gold">
          <span className="text-5xl">🎁</span>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-neutral-50">No boxes available</h3>
        <p className="text-neutral-300 text-center max-w-md">
          We're currently preparing new gift boxes. Check back soon!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {boxes.map((box) => (
        <div key={box.id} className="card overflow-hidden hover:-translate-y-1">
          <div className="relative w-full h-64 bg-gradient-berry overflow-hidden">
            {box.image ? (
              <Image
                src={box.image}
                alt={box.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                unoptimized={box.image.startsWith('http')}
              />
            ) : box.images && box.images.length > 0 ? (
              <Image
                src={box.images[0]}
                alt={box.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                unoptimized={box.images[0].startsWith('http')}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl opacity-30">🎁</span>
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="font-bold text-2xl mb-3 text-neutral-50">{box.name}</h3>
            <p className="text-neutral-300 text-sm mb-6 leading-relaxed line-clamp-3 min-h-[3.75rem]">
              {box.description}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="font-bold text-2xl text-gold-gradient">{box.price.toFixed(2)} AZN</p>
              <Button asChild className="w-full sm:w-auto">
                <Link href={`/premade-boxes/${box.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

