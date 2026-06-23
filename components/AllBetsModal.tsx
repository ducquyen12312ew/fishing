'use client'

import BetCard, { type Bet } from './BetCard'

interface AllBetsModalProps {
  bets: Bet[]
  onClose: () => void
  onBetClick: (bet: Bet) => void
}

export default function AllBetsModal({ bets, onClose, onBetClick }: AllBetsModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-sm mx-4 animate-modalIn flex flex-col"
        style={{
          background: 'rgba(255,255,255,0.96)',
          borderRadius: '16px',
          border: '2px solid rgba(100,180,100,0.4)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxHeight: '80vh',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '2px solid rgba(100,180,100,0.2)' }}
        >
          <h2
            className="font-pixel"
            style={{ color: '#1a2f1a', fontSize: '0.75rem', fontWeight: 700 }}
          >
            All Active Contracts ({bets.length})
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
            style={{ color: '#2d4a2d', fontSize: '1rem' }}
          >
            ✕
          </button>
        </div>

        {/* Bet list */}
        <div
          className="overflow-y-auto flex-1 p-4 space-y-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {bets.length === 0 ? (
            <p className="font-pixel text-center py-8" style={{ color: '#6b9b6b', fontSize: '0.65rem' }}>
              No active contracts
            </p>
          ) : (
            bets.map((bet) => (
              <BetCard
                key={bet.id}
                bet={bet}
                compact
                onClick={() => {
                  onBetClick(bet)
                  onClose()
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
