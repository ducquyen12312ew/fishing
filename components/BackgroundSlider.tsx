'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const BG_IMAGES = ['/background/bg1.png', '/background/bg2.png', '/background/bg3.png']

export default function BackgroundSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BG_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {BG_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt={`background ${i + 1}`}
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  )
}
