'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CoinSprite from '@/components/CoinSprite'

interface Bet {
  id: number
  sport_emoji: string
  name: string
  amount: number
  odds: number
  fish_image: string
  status: 'won' | 'lost'
  campaign_name: string
  created_at: string
  resolved_at: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function HistoryPage() {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'won' | 'lost'>('all')

  useEffect(() => {
    fetch('/api/bets?status=resolved')
      .then((r) => r.json())
      .then((data) => {
        setBets(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  const filtered = bets.filter((b) => filter === 'all' || b.status === filter)

  const totalWin = bets
    .filter((b) => b.status === 'won')
    .reduce((s, b) => s + Math.round(b.amount * b.odds), 0)
  const totalLose = bets
    .filter((b) => b.status === 'lost')
    .reduce((s, b) => s + b.amount, 0)
  const net = totalWin - totalLose

  return (
    <div className="min-h-screen bg-[#0a1f21] text-white">
      {/* Header */}
      <div className="bg-[#0f2b2d] border-b-4 border-teal-light px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-pixel text-teal-light text-xs hover:text-white transition-colors"
          >
            ← Back
          </Link>
          <h1 className="font-pixel text-white text-sm">Old Contracts</h1>
        </div>
        <CoinSprite size={16} />
      </div>

      {/* Stats bar */}
      <div className="bg-[#0f2b2d]/80 border-b border-teal-light/30 px-6 py-3 flex gap-6 flex-wrap">
        <div className="font-pixel text-xs">
          <span className="text-white/50">Total bets: </span>
          <span className="text-white">{bets.length}</span>
        </div>
        <div className="font-pixel text-xs">
          <span className="text-white/50">Won: </span>
          <span className="text-green-400">+{totalWin.toLocaleString()}k</span>
        </div>
        <div className="font-pixel text-xs">
          <span className="text-white/50">Lost: </span>
          <span style={{ color: '#f87171' }}>-{totalLose.toLocaleString()}k</span>
        </div>
        <div className="font-pixel text-xs">
          <span className="text-white/50">Net: </span>
          <span className={net >= 0 ? 'text-green-400' : 'text-red-400'}>
            {net >= 0 ? '+' : ''}{net.toLocaleString()}k
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-teal-light/20 px-6">
        {(['all', 'won', 'lost'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-3 font-pixel text-xs transition-colors border-b-2 ${
              filter === f
                ? 'border-teal-light text-white'
                : 'border-transparent text-white/40 hover:text-white/70'
            }`}
          >
            {f === 'all' ? 'All' : f === 'won' ? '🎣 Won' : '💨 Lost'}
          </button>
        ))}
      </div>

      {/* Bet list */}
      <div className="p-4 space-y-2 max-w-2xl mx-auto">
        {loading && (
          <p className="font-pixel text-white/40 text-xs text-center py-8">Loading...</p>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <p className="text-4xl">🎣</p>
            <p className="font-pixel text-white/40 text-xs">No bets yet</p>
            <Link href="/" className="font-pixel text-teal-light text-xs underline">
              Start fishing!
            </Link>
          </div>
        )}

        {filtered.map((bet) => {
          const winAmount = Math.round(bet.amount * bet.odds)
          const isWon = bet.status === 'won'

          return (
            <div
              key={bet.id}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                isWon
                  ? 'border-green-600/50 bg-green-900/20'
                  : 'border-red-800/50 bg-red-900/20'
              }`}
            >
              {/* Sport + Fish */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <span className="text-xl">{bet.sport_emoji}</span>
                <Image
                  src={`/fish/${bet.fish_image}`}
                  alt="fish"
                  width={28}
                  height={28}
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-pixel text-white text-xs truncate">{bet.name}</p>
                <p className="font-pixel text-white/40 text-xs mt-0.5">{bet.campaign_name}</p>
                <p className="font-pixel text-white/30 text-xs mt-0.5">
                  {formatDate(bet.resolved_at)}
                </p>
              </div>

              {/* Result */}
              <div className="text-right flex-shrink-0">
                <p className="font-pixel text-xs text-white/50">
                  {bet.amount}k × {bet.odds}
                </p>
                {isWon ? (
                  <p className="font-pixel text-green-400 text-sm mt-1">+{winAmount}k</p>
                ) : (
                  <p className="font-pixel text-red-400 text-sm mt-1">-{bet.amount}k</p>
                )}
                <p className="font-pixel text-xs mt-0.5">
                  {isWon ? '🎣 Caught' : '💨 Missed'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
