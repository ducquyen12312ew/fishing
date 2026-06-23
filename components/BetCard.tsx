'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Bet {
  id: number
  sport_emoji: string
  name: string
  amount: number
  odds: number
  fish_image: string
  status: string
}

interface BetCardProps {
  bet: Bet
  isNew?: boolean
  isLeaving?: boolean
  onClick: () => void
}

export default function BetCard({ bet, isNew, isLeaving, onClick }: BetCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  const baseOpacity = isNew && !mounted ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'

  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden group
        flex items-center gap-3 w-full max-w-xs
        bg-[#0f2b2d]/92 rounded-lg px-3 py-2
        cursor-pointer text-left
        transition-all duration-300
        hover:bg-teal-dark/85
        ${baseOpacity}
        ${isLeaving ? 'animate-fishSlideOut' : ''}
      `}
      style={{
        // Pixel-art style border via box-shadow
        boxShadow:
          '0 0 0 2px #7ec8ca, 2px 2px 0 0 #000, -1px -1px 0 0 #000, 2px -1px 0 0 #000, -1px 2px 0 0 #000',
      }}
    >
      {/* Shimmer sweep on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ animation: 'none' }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '50%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
            transform: 'translateX(-100%) skewX(-20deg)',
          }}
          className="group-hover:[animation:cardShimmer_0.7s_ease_forwards]"
        />
      </div>

      {/* Sport emoji */}
      <span className="text-xl flex-shrink-0 relative z-10">{bet.sport_emoji}</span>

      {/* Name + meta */}
      <div className="flex-1 min-w-0 relative z-10">
        <p className="font-pixel text-white text-xs truncate leading-tight">{bet.name}</p>
        <p className="font-pixel text-teal-light text-xs mt-0.5">{bet.amount}k</p>
      </div>

      {/* Odds badge */}
      <span
        className="font-pixel text-yellow-300 flex-shrink-0 relative z-10"
        style={{ fontSize: '0.7rem', fontWeight: 700 }}
      >
        {bet.odds}x
      </span>

      {/* Fish — bounce-in when new, then loop gently */}
      <div
        className="flex-shrink-0 relative z-10"
        style={{
          animation: isNew && !mounted
            ? 'fishBounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards'
            : 'fishBounceLoop 1.2s ease-in-out infinite',
        }}
      >
        <Image
          src={`/fish/${bet.fish_image}`}
          alt="fish"
          width={36}
          height={36}
          className="object-contain"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </button>
  )
}
