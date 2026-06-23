'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export interface Bet {
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
  compact?: boolean
}

export default function BetCard({ bet, isNew, isLeaving, onClick, compact }: BetCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden group
        flex items-center gap-3 w-full
        rounded-xl cursor-pointer text-left
        transition-all duration-300
        hover:scale-[1.02] active:scale-[0.98]
        ${compact ? 'px-3 py-2' : 'px-4 py-3'}
        ${isNew && !mounted ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
        ${isLeaving ? 'animate-fishSlideOut' : ''}
      `}
      style={{
        background: 'rgba(255,255,255,0.88)',
        border: '2px solid rgba(100,180,100,0.5)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      {/* Hover shimmer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
          animation: 'cardShimmer 0.7s ease forwards',
        }}
      />

      {/* Sport emoji */}
      <span className="text-xl flex-shrink-0 relative z-10">{bet.sport_emoji}</span>

      {/* Name + amount */}
      <div className="flex-1 min-w-0 relative z-10">
        <p
          className="font-pixel text-xs truncate leading-tight"
          style={{ color: '#1a2f1a', fontWeight: 700 }}
        >
          {bet.name}
        </p>
        <p
          className="font-pixel text-xs mt-0.5"
          style={{ color: '#2d4a2d', fontWeight: 600 }}
        >
          {bet.amount}k
        </p>
      </div>

      {/* Odds */}
      <span
        className="font-pixel flex-shrink-0 relative z-10"
        style={{ color: '#e8a000', fontWeight: 800, fontSize: '0.72rem' }}
      >
        {bet.odds}x
      </span>

      {/* Fish */}
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
          width={compact ? 28 : 34}
          height={compact ? 28 : 34}
          className="object-contain"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </button>
  )
}
