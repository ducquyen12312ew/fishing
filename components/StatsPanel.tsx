'use client'

import Image from 'next/image'

interface Campaign {
  name: string
  current_coins: number
  initial_coins: number
  total_win: number
  total_lose: number
}

interface StatsPanelProps {
  campaign: Campaign | null
  fishCount: number
  onTopUpClick: () => void
}

function CoinAnim() {
  return (
    <div
      style={{
        display: 'inline-block',
        width: 20,
        height: 20,
        backgroundImage: "url('/coin2_20x20.png')",
        backgroundSize: '160px 20px',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        animation: 'coinSpin 0.8s steps(8) infinite',
        flexShrink: 0,
      }}
    />
  )
}

function Row({
  label,
  value,
  color = 'white',
}: {
  label: string
  value: string
  color?: string
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="font-pixel text-white/55" style={{ fontSize: '0.55rem' }}>
        {label}
      </span>
      <span className="font-pixel tabular-nums" style={{ fontSize: '0.65rem', color, fontWeight: 700 }}>
        {value}
      </span>
    </div>
  )
}

export default function StatsPanel({ campaign, fishCount, onTopUpClick }: StatsPanelProps) {
  const roi = campaign
    ? (
        ((campaign.current_coins - campaign.initial_coins) / Math.max(campaign.initial_coins, 1)) *
        100
      ).toFixed(1)
    : '0.0'
  const roiNum = parseFloat(roi)

  return (
    <div className="flex flex-col gap-2" style={{ width: '180px' }}>
      {/* ── Main panel ─────────────────────── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.18)',
        }}
      >
        {/* Catch basket */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}
        >
          <div className="flex items-center gap-2">
            <Image
              src="/gift-box.png"
              alt="basket"
              width={20}
              height={20}
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="font-pixel text-white" style={{ fontSize: '0.55rem' }}>
              Catch Basket
            </span>
          </div>
          {fishCount > 0 && (
            <span
              className="text-white font-pixel flex-shrink-0"
              style={{
                fontSize: '0.55rem',
                background: '#e05252',
                borderRadius: '10px',
                padding: '1px 5px',
              }}
            >
              {fishCount > 9 ? '9+' : fishCount}
            </span>
          )}
        </div>

        {/* Campaign content */}
        <div className="px-3 py-3 space-y-3">
          {campaign ? (
            <>
              {/* Campaign name */}
              <p
                className="font-pixel text-teal-light truncate"
                style={{ fontSize: '0.55rem' }}
                title={campaign.name}
              >
                📋 {campaign.name}
              </p>

              {/* Balance — big */}
              <div className="flex items-center gap-2">
                <CoinAnim />
                <div>
                  <div
                    className="font-pixel text-white tabular-nums"
                    style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1 }}
                  >
                    {campaign.current_coins.toLocaleString()}
                  </div>
                  <div className="font-pixel text-white/40" style={{ fontSize: '0.5rem' }}>
                    balance
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }} />

              {/* Stats rows */}
              <div className="space-y-1.5">
                <Row
                  label="Starting"
                  value={campaign.initial_coins.toLocaleString()}
                />
                <Row
                  label="✅ Profit"
                  value={`+${campaign.total_win.toLocaleString()}`}
                  color="#4ade80"
                />
                <Row
                  label="❌ Loss"
                  value={`-${campaign.total_lose.toLocaleString()}`}
                  color="#f87171"
                />
                <Row
                  label="📊 ROI"
                  value={`${roiNum >= 0 ? '+' : ''}${roi}%`}
                  color={roiNum >= 0 ? '#fbbf24' : '#f87171'}
                />
              </div>
            </>
          ) : (
            <div className="py-2 space-y-1">
              <p className="font-pixel text-white/50 text-center" style={{ fontSize: '0.55rem', lineHeight: 1.6 }}>
                No active campaign
              </p>
              <p className="font-pixel text-yellow-300/80 text-center" style={{ fontSize: '0.5rem' }}>
                Top Up to start!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Top Up button ───────────────────── */}
      <button
        onClick={onTopUpClick}
        className="w-full py-2 font-pixel text-white rounded-xl border-2 border-coral-dark transition-all hover:scale-105 active:scale-95"
        style={{ background: '#e05252', fontSize: '0.65rem' }}
      >
        💰 Top Up
      </button>
    </div>
  )
}
