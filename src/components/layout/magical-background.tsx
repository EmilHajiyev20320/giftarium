'use client'

import { useEffect, useState } from 'react'

interface Sparkle {
  id: number
  left: number
  top: number
  delay: number
  duration: number
  size: number
}

interface Star {
  id: number
  left: number
  top: number
  delay: number
  duration: number
  fontSize: number
  opacity: number
}

interface Particle {
  id: number
  left: number
  top: number
  delay: number
  size: number
}

interface GiftBox {
  id: number
  left: number
  top: number
  delay: number
  duration: number
  size: number
}

interface Ribbon {
  id: number
  left: number
  top: number
  delay: number
  rotation: number
}

export function MagicalBackground() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const [stars, setStars] = useState<Star[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [twinkles, setTwinkles] = useState<Array<{ id: number; left: number; top: number; delay: number }>>([])
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>([])
  const [ribbons, setRibbons] = useState<Ribbon[]>([])

  useEffect(() => {
    // Generate sparkles
    setSparkles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
        size: 4,
      }))
    )

    // Generate floating stars (reduced)
    setStars(
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 3,
        fontSize: 8 + Math.random() * 12,
        opacity: 0.4 + Math.random() * 0.4,
      }))
    )

    // Generate particles
    setParticles(
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 7,
        size: 4 + Math.random() * 8,
      }))
    )

    // Generate twinkling stars (small point stars - increased)
    setTwinkles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 2,
      }))
    )

    // Generate floating gift boxes (increased, evenly distributed)
    const giftBoxCount = 18
    const cols = 6 // 6 columns for even distribution
    const rows = Math.ceil(giftBoxCount / cols)
    setGiftBoxes(
      Array.from({ length: giftBoxCount }, (_, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        // Distribute evenly: 10% margin on each side, then divide remaining 80% into columns
        const leftBase = 10 + (col * (80 / (cols - 1)))
        const topBase = 10 + (row * (80 / (rows - 1 || 1)))
        // Add some randomness but keep within the grid cell
        const left = leftBase + (Math.random() - 0.5) * 5
        const top = topBase + (Math.random() - 0.5) * 5
        return {
          id: i,
          left: Math.max(5, Math.min(95, left)), // Clamp between 5% and 95%
          top: Math.max(5, Math.min(95, top)), // Clamp between 5% and 95%
          delay: Math.random() * 6,
          duration: 8 + Math.random() * 4,
          size: 20 + Math.random() * 15,
        }
      })
    )

    // Generate magical ribbons
    setRibbons(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 8,
        rotation: Math.random() * 360,
      }))
    )
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={`sparkle-${sparkle.id}`}
          className="absolute sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        />
      ))}

      {/* Floating Stars */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="absolute text-magic-gold animate-sparkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            fontSize: `${star.fontSize}px`,
            opacity: star.opacity,
            filter: 'drop-shadow(0 0 4px rgba(255, 184, 76, 0.8))',
          }}
        >
          ✨
        </div>
      ))}

      {/* Twinkling Stars */}
      {twinkles.map((twinkle) => (
        <div
          key={`twinkle-${twinkle.id}`}
          className="absolute animate-twinkle"
          style={{
            left: `${twinkle.left}%`,
            top: `${twinkle.top}%`,
            animationDelay: `${twinkle.delay}s`,
            width: '3px',
            height: '3px',
            background: '#FFB84C',
            borderRadius: '50%',
            boxShadow: '0 0 6px #FFB84C, 0 0 12px #FFB84C',
          }}
        />
      ))}

      {/* Magical Particles */}
      {particles.map((particle) => (
        <div
          key={`particle-${particle.id}`}
          className="absolute rounded-full bg-magic-gold/30 animate-blob"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            boxShadow: `0 0 ${6 + particle.size * 0.5}px rgba(255, 184, 76, 0.6)`,
          }}
        />
      ))}

      {/* Floating Gift Boxes */}
      {giftBoxes.map((box) => (
        <div
          key={`giftbox-${box.id}`}
          className="absolute animate-float opacity-20"
          style={{
            left: `${box.left}%`,
            top: `${box.top}%`,
            animationDelay: `${box.delay}s`,
            animationDuration: `${box.duration}s`,
            fontSize: `${box.size}px`,
            filter: 'drop-shadow(0 0 8px rgba(255, 184, 76, 0.5))',
          }}
        >
          🎁
        </div>
      ))}

      {/* Magical Ribbons */}
      {ribbons.map((ribbon) => (
        <div
          key={`ribbon-${ribbon.id}`}
          className="absolute magic-ribbon animate-ribbon"
          style={{
            left: `${ribbon.left}%`,
            top: `${ribbon.top}%`,
            animationDelay: `${ribbon.delay}s`,
            transform: `rotate(${ribbon.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}

