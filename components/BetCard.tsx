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

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 w-full max-w-xs
        bg-[#0f2b2d]/90 border-2 border-teal-light rounded-lg px-3 py-2
        hover:bg-teal-dark/80 hover:border-yellow-300 transition-all duration-200
        shadow-lg cursor-pointer text-left
        ${isNew && !mounted ? 'opacity-0 translate-y-2' : ''}
        ${isLeaving ? 'animate-fishSlideOut' : mounted ? 'opacity-100 translate-y-0' : ''}
        transition-all duration-300
      `}
    >
      {/* Sport emoji */}
      <span className="text-xl flex-shrink-0">{bet.sport_emoji}</span>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-pixel text-white text-xs truncate">{bet.name}</p>
        <p className="font-pixel text-teal-light text-xs mt-0.5">
          {bet.amount}k × {bet.odds}
        </p>
      </div>

      {/* Fish */}
      <div className={isNew ? 'animate-fishBounceIn' : ''}>
        <Image
          src={`/fish/${bet.fish_image}`}
          alt="fish"
          width={36}
          height={36}
          className="object-contain flex-shrink-0"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </button>
  )
}
