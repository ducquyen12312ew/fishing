'use client'

import { useState } from 'react'
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

interface ConfirmBetModalProps {
  bet: Bet
  onClose: () => void
  onResolved: (id: number, result: 'won' | 'lost') => void
}

export default function ConfirmBetModal({ bet, onClose, onResolved }: ConfirmBetModalProps) {
  const [loading, setLoading] = useState(false)

  async function resolve(result: 'won' | 'lost') {
    setLoading(true)
    try {
      const res = await fetch(`/api/bets/${bet.id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result }),
      })
      if (res.ok) {
        onResolved(bet.id, result)
        onClose()
      }
    } finally {
      setLoading(false)
    }
  }

  const winAmount = Math.round(bet.amount * bet.odds)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-sm mx-4 bg-[#0f2b2d] border-4 border-teal-light rounded-lg shadow-2xl animate-modalIn">
        <div className="bg-teal-dark px-6 py-4 border-b-4 border-teal-light flex items-center justify-between">
          <h2 className="font-pixel text-white text-sm">Result?</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white font-pixel text-xs">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 text-center">
          <div className="text-4xl">{bet.sport_emoji}</div>
          <p className="font-pixel text-white text-xs leading-relaxed">{bet.name}</p>

          <div className="flex justify-center">
            <Image
              src={`/fish/${bet.fish_image}`}
              alt="fish"
              width={64}
              height={64}
              className="object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          <div className="bg-white/5 rounded p-3 space-y-1 text-xs font-pixel">
            <div className="text-white/60">
              Stake: <span className="text-white">{bet.amount}k</span>
            </div>
            <div className="text-white/60">
              Odds: <span className="text-yellow-300">{bet.odds}x</span>
            </div>
            <div className="text-white/60">
              Win: <span className="text-green-400">+{winAmount}k</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => resolve('won')}
              disabled={loading}
              className="flex-1 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-pixel text-xs rounded border-2 border-green-400 transition-colors"
            >
              🎣 Caught!
            </button>
            <button
              onClick={() => resolve('lost')}
              disabled={loading}
              className="flex-1 py-3 bg-coral hover:bg-coral-dark disabled:opacity-50 text-white font-pixel text-xs rounded border-2 border-coral-dark transition-colors"
            >
              💨 Missed...
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
