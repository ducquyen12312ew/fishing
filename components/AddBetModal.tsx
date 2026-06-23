'use client'

import { useState } from 'react'
import CoinSprite from './CoinSprite'
import SportSelect from './SportSelect'

interface AddBetModalProps {
  onClose: () => void
  onSuccess: (bet: unknown) => void
}

export default function AddBetModal({ onClose, onSuccess }: AddBetModalProps) {
  const [emoji, setEmoji] = useState('')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [odds, setOdds] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!emoji || !name || !amount || !odds) {
      setError('Please fill in all fields!')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport_emoji: emoji,
          name,
          amount: parseInt(amount),
          odds: parseFloat(odds),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Unknown error')
        return
      }
      onSuccess(data)
      onClose()
    } catch {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md mx-4 bg-[#0f2b2d] border-4 border-teal-light rounded-lg shadow-2xl animate-modalIn">
        {/* Header */}
        <div className="bg-teal-dark px-6 py-4 border-b-4 border-teal-light flex items-center justify-between">
          <h2 className="font-pixel text-white text-sm">New Contract</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white font-pixel text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Sport */}
          <div>
            <label className="block font-pixel text-teal-light text-xs mb-2">Sport</label>
            <SportSelect value={emoji} onChange={setEmoji} />
          </div>

          {/* Name */}
          <div>
            <label className="block font-pixel text-teal-light text-xs mb-2">
              Contract Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Man City vs Arsenal"
              className="w-full px-3 py-2 bg-white/10 border-2 border-teal-light rounded text-white text-xs font-pixel placeholder:text-white/30 outline-none focus:border-yellow-300 transition-colors"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block font-pixel text-teal-light text-xs mb-2">
              Bait Cost (×1000 VND)
            </label>
            <div className="flex items-center gap-2">
              <CoinSprite size={20} />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 100"
                min="1"
                className="flex-1 px-3 py-2 bg-white/10 border-2 border-teal-light rounded text-white text-xs font-pixel placeholder:text-white/30 outline-none focus:border-yellow-300 transition-colors"
              />
            </div>
          </div>

          {/* Odds */}
          <div>
            <label className="block font-pixel text-teal-light text-xs mb-2">Odds</label>
            <input
              type="number"
              value={odds}
              onChange={(e) => setOdds(e.target.value)}
              placeholder="e.g. 1.82"
              step="0.01"
              min="1.01"
              className="w-full px-3 py-2 bg-white/10 border-2 border-teal-light rounded text-white text-xs font-pixel placeholder:text-white/30 outline-none focus:border-yellow-300 transition-colors"
            />
          </div>

          {error && (
            <p className="font-pixel text-coral text-xs text-center">{error}</p>
          )}

          {/* Preview */}
          {amount && odds && (
            <div className="bg-white/5 border border-teal-light/30 rounded p-3 text-xs font-pixel text-white/70 space-y-1">
              <div>
                Deduct:{' '}
                <span className="text-coral">{parseInt(amount || '0').toLocaleString()}k</span>
              </div>
              <div>
                If won:{' '}
                <span className="text-green-400">
                  +{Math.round(parseInt(amount || '0') * parseFloat(odds || '1')).toLocaleString()}k
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-coral hover:bg-coral-dark disabled:opacity-50 text-white font-pixel text-xs rounded border-2 border-coral-dark transition-colors"
          >
            {loading ? 'Casting...' : '🎣 Cast Bait!'}
          </button>
        </form>
      </div>
    </div>
  )
}
