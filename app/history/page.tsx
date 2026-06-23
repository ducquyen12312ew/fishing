'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CoinSprite from '@/components/CoinSprite'

interface Bet {
  id: number
  sport_emoji?: string
  name: string
  amount: number
  odds: number
  fish_image: string
  status: 'won' | 'lost' | 'refunded'
  campaign_name: string
  created_at: string
  resolved_at: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type FilterType = 'all' | 'won' | 'lost' | 'refunded'
type Result = 'won' | 'lost' | 'refunded'

export default function HistoryPage() {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editLoading, setEditLoading] = useState(false)

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
    .reduce((s, b) => s + Math.round(b.amount * (b.odds - 1)), 0)
  const totalLose = bets
    .filter((b) => b.status === 'lost')
    .reduce((s, b) => s + b.amount, 0)
  const net = totalWin - totalLose

  async function handleReresolve(bet: Bet, result: Result) {
    if (result === bet.status) { setEditingId(null); return }
    setEditLoading(true)
    try {
      const res = await fetch(`/api/bets/${bet.id}/reresolve`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ result }),
      })
      if (res.ok) {
        setBets((prev) =>
          prev.map((b) => b.id === bet.id ? { ...b, status: result } : b)
        )
      }
    } finally {
      setEditLoading(false)
      setEditingId(null)
    }
  }

  const statusStyle: Record<Result, { border: string; bg: string }> = {
    won:      { border: 'border-green-600/50', bg: 'bg-green-900/20' },
    lost:     { border: 'border-red-800/50',   bg: 'bg-red-900/20' },
    refunded: { border: 'border-blue-600/50',  bg: 'bg-blue-900/20' },
  }

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
          <span className="text-white/50">Profit: </span>
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
        {(['all', 'won', 'lost', 'refunded'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-3 font-pixel text-xs transition-colors border-b-2 ${
              filter === f
                ? 'border-teal-light text-white'
                : 'border-transparent text-white/40 hover:text-white/70'
            }`}
          >
            {f === 'all' ? 'All' : f === 'won' ? '🎣 Won' : f === 'lost' ? '💨 Lost' : '🔄 Refund'}
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
          const winAmount = Math.round(bet.amount * (bet.odds - 1))
          const isWon      = bet.status === 'won'
          const isRefunded = bet.status === 'refunded'
          const isEditing  = editingId === bet.id
          const { border, bg } = statusStyle[bet.status]

          return (
            <div key={bet.id} className="space-y-1">
              <div className={`flex items-center gap-3 p-3 rounded-lg border-2 ${border} ${bg}`}>
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
                    <p className="font-pixel text-green-400 text-sm mt-1">profit +{winAmount}k</p>
                  ) : isRefunded ? (
                    <p className="font-pixel text-blue-400 text-sm mt-1">refund {bet.amount}k</p>
                  ) : (
                    <p className="font-pixel text-red-400 text-sm mt-1">-{bet.amount}k</p>
                  )}
                  <p className="font-pixel text-xs mt-0.5">
                    {isWon ? '🎣 Caught' : isRefunded ? '🔄 Refunded' : '💨 Missed'}
                  </p>
                </div>

                {/* Edit toggle */}
                <button
                  onClick={() => setEditingId(isEditing ? null : bet.id)}
                  className="ml-1 flex-shrink-0 text-white/30 hover:text-white/70 font-pixel text-xs transition-colors"
                  title="Edit result"
                >
                  ✏️
                </button>
              </div>

              {/* Inline re-resolve buttons */}
              {isEditing && (
                <div className="flex gap-2 px-1">
                  <button
                    disabled={editLoading || bet.status === 'won'}
                    onClick={() => handleReresolve(bet, 'won')}
                    className="flex-1 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-40 text-white font-pixel text-xs rounded border border-green-500 transition-colors"
                  >
                    🎣 Won
                  </button>
                  <button
                    disabled={editLoading || bet.status === 'lost'}
                    onClick={() => handleReresolve(bet, 'lost')}
                    className="flex-1 py-2 bg-red-800 hover:bg-red-700 disabled:opacity-40 text-white font-pixel text-xs rounded border border-red-600 transition-colors"
                  >
                    💨 Lost
                  </button>
                  <button
                    disabled={editLoading || bet.status === 'refunded'}
                    onClick={() => handleReresolve(bet, 'refunded')}
                    className="flex-1 py-2 bg-blue-800 hover:bg-blue-700 disabled:opacity-40 text-white font-pixel text-xs rounded border border-blue-500 transition-colors"
                  >
                    🔄 Refund
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white/60 font-pixel text-xs rounded border border-white/20 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
