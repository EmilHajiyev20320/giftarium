'use client'

import Image from 'next/image'
import { useState } from 'react'

interface LogoProps {
  width?: number
  height?: number
  className?: string
  containerClassName?: string
  rounded?: boolean
}

export function Logo({ width = 80, height = 80, className = '', containerClassName = '', rounded = false }: LogoProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className={containerClassName}>
      {!imageError ? (
        <Image
          src="/giftarium_logo.jpg"
          alt="Giftarium Logo"
          width={width}
          height={height}
          className={`${className} ${rounded ? 'rounded-full' : ''}`}
          onError={() => setImageError(true)}
          priority={width >= 100}
        />
      ) : (
        <span className={width >= 100 ? "text-6xl" : width >= 80 ? "text-5xl" : width >= 40 ? "text-2xl" : "text-lg"}>🎁</span>
      )}
    </div>
  )
}

