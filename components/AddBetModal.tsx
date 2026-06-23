'use client'

import { useState } from 'react'
import CoinSprite from './CoinSprite'

interface AddBetModalProps {
  onClose: () => void
  onSuccess: (bet: unknown) => void
}

export default function AddBetModal({ onClose, onSuccess }: AddBetModalProps) {
  const [name, setName]       = useState('')
  const [amount, setAmount]   = useState('')
  const [odds, setOdds]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !amount || !odds) {
      setError('MISSING FIELDS')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bets', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name,
          amount: parseInt(amount),
          odds:   parseFloat(odds),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'UNKNOWN ERROR'); return }
      onSuccess(data)
      onClose()
    } catch {
      setError('CONNECTION ERROR')
    } finally {
      setLoading(false)
    }
  }

  const amtNum  = parseInt(amount  || '0')
  const oddsNum = parseFloat(odds  || '1')
  const profit  = amtNum > 0 && oddsNum > 1 ? Math.round(amtNum * (oddsNum - 1)) : 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-md mx-4 animate-modalIn"
        style={{
          background:  'rgba(10,20,30,0.95)',
          border:      '2px solid #00ff88',
          boxShadow:   '0 0 20px rgba(0,255,136,0.3), 0 0 60px rgba(0,255,136,0.1)',
          borderRadius: '8px',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding:      '14px 20px',
            borderBottom: '1px solid #00ff8844',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 900, color: '#00ff88', letterSpacing: '0.1em' }}>
            [ NEW CONTRACT ]
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#00ff8888', fontFamily: 'monospace', fontSize: '1rem' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00ff88')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#00ff8888')}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Contract Name */}
          <div>
            <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '0.7rem', color: '#88ffcc', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Contract Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Man City vs Arsenal"
              style={{
                width:       '100%',
                padding:     '8px 12px',
                background:  '#1a2a1a',
                border:      '1px solid #00ff88',
                borderRadius: '4px',
                color:       '#00ff88',
                fontFamily:  'monospace',
                fontSize:    '0.85rem',
                outline:     'none',
                boxSizing:   'border-box',
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 8px rgba(0,255,136,0.4)')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>

          {/* Bait Cost */}
          <div>
            <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '0.7rem', color: '#88ffcc', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Bait Cost (K)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CoinSprite size={20} />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 100"
                min="1"
                style={{
                  flex:        1,
                  padding:     '8px 12px',
                  background:  '#1a2a1a',
                  border:      '1px solid #00ff88',
                  borderRadius: '4px',
                  color:       '#00ff88',
                  fontFamily:  'monospace',
                  fontSize:    '0.85rem',
                  outline:     'none',
                }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 8px rgba(0,255,136,0.4)')}
                onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
              />
            </div>
          </div>

          {/* Odds */}
          <div>
            <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '0.7rem', color: '#88ffcc', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Odds
            </label>
            <input
              type="number"
              value={odds}
              onChange={(e) => setOdds(e.target.value)}
              placeholder="e.g. 1.82"
              step="0.01"
              min="1.01"
              style={{
                width:       '100%',
                padding:     '8px 12px',
                background:  '#1a2a1a',
                border:      '1px solid #00ff88',
                borderRadius: '4px',
                color:       '#00ff88',
                fontFamily:  'monospace',
                fontSize:    '0.85rem',
                outline:     'none',
                boxSizing:   'border-box',
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 8px rgba(0,255,136,0.4)')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>

          {error && (
            <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#ff4444', textAlign: 'center', margin: 0 }}>
              ⚠ {error}
            </p>
          )}

          {/* Preview */}
          {amtNum > 0 && oddsNum > 1 && (
            <div style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid #00ff8833', borderRadius: '4px', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                <span style={{ color: '#88ffcc88' }}>Deduct now</span>
                <span style={{ color: '#ff6666' }}>-{amtNum}K</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                <span style={{ color: '#88ffcc88' }}>If won → profit</span>
                <span style={{ color: '#00ff88' }}>+{profit}K</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width:        '100%',
              padding:      '12px',
              background:   loading ? '#004422' : '#00ff88',
              color:        '#000',
              fontFamily:   'monospace',
              fontSize:     '0.9rem',
              fontWeight:   900,
              border:       'none',
              borderRadius: '4px',
              cursor:       loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.1em',
              transition:   'box-shadow 0.2s, transform 0.1s',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.boxShadow = '0 0 16px rgba(0,255,136,0.6)'
            }}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            onMouseDown={(e) => { if (!loading) e.currentTarget.style.transform = 'scale(0.98)' }}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {loading ? '[ PROCESSING... ]' : '[ EXECUTE CONTRACT ]'}
          </button>
        </form>
      </div>
    </div>
  )
}
