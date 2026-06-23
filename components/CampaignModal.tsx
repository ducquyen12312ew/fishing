'use client'

import { useState, useEffect } from 'react'
import CoinSprite from './CoinSprite'

interface Campaign {
  id: string
  name: string
  initial_coins: number
  current_coins: number
  total_win: number
  total_lose: number
  is_active: boolean
}

interface CampaignModalProps {
  onClose: () => void
  onCampaignChange: () => void
}

export default function CampaignModal({ onClose, onCampaignChange }: CampaignModalProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [tab, setTab]             = useState<'list' | 'new'>('list')
  const [name, setName]           = useState('')
  const [coins, setCoins]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [fetching, setFetching]   = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    setFetching(true)
    fetch('/api/campaigns')
      .then((r) => r.json())
      .then((data) => setCampaigns(Array.isArray(data) ? data : []))
      .catch(() => setCampaigns([]))
      .finally(() => setFetching(false))
  }, [])

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const trimmedName = name.trim()
    const parsedCoins = parseInt(coins)

    if (!trimmedName) { setError('Campaign name is required'); return }
    if (!coins || isNaN(parsedCoins) || parsedCoins < 1) {
      setError('Starting coins must be at least 1')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/campaigns', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: trimmedName, initial_coins: parsedCoins }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to create'); return }
      setCampaigns((prev) => [data, ...prev])
      setName('')
      setCoins('')
      setTab('list')
      onCampaignChange()
    } catch {
      setError('Connection error — check your network')
    } finally {
      setLoading(false)
    }
  }

  async function activate(id: string) {
    try {
      const res = await fetch(`/api/campaigns/${id}/activate`, { method: 'PATCH' })
      if (res.ok) {
        setCampaigns((prev) => prev.map((c) => ({ ...c, is_active: c.id === id })))
        onCampaignChange()
      }
    } catch { /* ignore */ }
  }

  const active = campaigns.find((c) => c.is_active)
  const roi = active
    ? (((active.current_coins - active.initial_coins) / Math.max(active.initial_coins, 1)) * 100).toFixed(1)
    : '0'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md mx-4 bg-[#0f2b2d] border-4 border-teal-light rounded-lg shadow-2xl animate-modalIn max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-teal-dark px-6 py-4 border-b-4 border-teal-light flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <CoinSprite size={20} />
            <h2 className="font-pixel text-white text-sm">Top Up</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white font-pixel text-xs">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-teal-light/30 flex-shrink-0">
          {(['list', 'new'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              className={`flex-1 py-3 font-pixel text-xs transition-colors ${
                tab === t ? 'bg-teal-dark text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {t === 'list' ? 'Campaign' : '+ New'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {tab === 'new' ? (
            <form onSubmit={createCampaign} className="space-y-5">
              {/* Campaign Name */}
              <div>
                <label className="block font-pixel text-teal-light text-xs mb-2">
                  Campaign Name <span className="text-coral">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. June 2026"
                  className="w-full px-3 py-2 bg-white/10 border-2 border-teal-light rounded text-white text-xs font-pixel placeholder:text-white/30 outline-none focus:border-yellow-300 transition-colors"
                />
              </div>

              {/* Starting Coins */}
              <div>
                <label className="block font-pixel text-teal-light text-xs mb-2">
                  Starting Coins <span className="text-coral">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <CoinSprite size={20} />
                  <input
                    type="number"
                    value={coins}
                    onChange={(e) => setCoins(e.target.value)}
                    placeholder="e.g. 1000"
                    min="1"
                    step="1"
                    className="flex-1 px-3 py-2 bg-white/10 border-2 border-teal-light rounded text-white text-xs font-pixel placeholder:text-white/30 outline-none focus:border-yellow-300 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <p className="font-pixel text-coral text-xs bg-coral/10 border border-coral/30 rounded px-3 py-2">
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-coral hover:bg-coral-dark text-white font-pixel text-xs rounded border-2 border-coral-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : '✨ Create Campaign'}
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              {/* Active campaign summary */}
              {active && (
                <div className="bg-teal-dark/50 border-2 border-yellow-300 rounded p-4 space-y-2 mb-4">
                  <p className="font-pixel text-yellow-300 text-xs">⭐ {active.name}</p>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-xs font-pixel mt-2">
                    <div className="text-white/50">Starting</div>
                    <div className="text-white text-right">{active.initial_coins.toLocaleString()}</div>
                    <div className="text-white/50">Balance</div>
                    <div className="text-white text-right font-bold">{active.current_coins.toLocaleString()}</div>
                    <div className="text-white/50">Profit</div>
                    <div className="text-green-400 text-right">+{active.total_win.toLocaleString()}</div>
                    <div className="text-white/50">Loss</div>
                    <div className="text-coral text-right">-{active.total_lose.toLocaleString()}</div>
                    <div className="text-white/50">ROI</div>
                    <div className={`text-right ${parseFloat(roi) >= 0 ? 'text-yellow-300' : 'text-coral'}`}>
                      {parseFloat(roi) >= 0 ? '+' : ''}{roi}%
                    </div>
                  </div>
                </div>
              )}

              {fetching && (
                <p className="font-pixel text-white/40 text-xs text-center py-4">Loading...</p>
              )}
              {!fetching && campaigns.length === 0 && (
                <div className="text-center py-6 space-y-2">
                  <p className="font-pixel text-white/40 text-xs">No campaigns yet</p>
                  <button
                    onClick={() => setTab('new')}
                    className="font-pixel text-teal-light text-xs underline"
                  >
                    Create your first campaign →
                  </button>
                </div>
              )}

              {campaigns.map((c) => (
                <div
                  key={c.id}
                  className={`border-2 rounded-lg p-3 flex items-center justify-between gap-3 ${
                    c.is_active
                      ? 'border-yellow-300 bg-yellow-300/10'
                      : 'border-teal-light/30 bg-white/5'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-pixel text-white text-xs truncate">{c.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <CoinSprite size={12} />
                      <span className="font-pixel text-yellow-300 text-xs">
                        {c.current_coins.toLocaleString()}
                      </span>
                      <span className="font-pixel text-white/30 text-xs">
                        / {c.initial_coins.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {c.is_active ? (
                    <span className="font-pixel text-yellow-300 text-xs flex-shrink-0">⭐ Active</span>
                  ) : (
                    <button
                      onClick={() => activate(c.id)}
                      className="px-3 py-1 bg-teal-dark hover:bg-teal-DEFAULT text-white font-pixel text-xs rounded border border-teal-light transition-colors flex-shrink-0"
                    >
                      Select
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
