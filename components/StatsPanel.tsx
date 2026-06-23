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
        width: 24,
        height: 24,
        backgroundImage: "url('/coin2_20x20.png')",
        backgroundSize: '192px 24px',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        animation: 'coinSpin 0.8s steps(8) infinite',
        flexShrink: 0,
      }}
    />
  )
}

export default function StatsPanel({ campaign, fishCount, onTopUpClick }: StatsPanelProps) {
  const roi = campaign
    ? (((campaign.current_coins - campaign.initial_coins) / campaign.initial_coins) * 100).toFixed(1)
    : '0.0'
  const roiNum = parseFloat(roi)

  return (
    <div className="flex flex-col gap-2 w-48 sm:w-52">
      {/* Main panel */}
      <div
        className="rounded-xl border font-pixel overflow-hidden"
        style={{
          background: 'rgba(0,0,0,0.52)',
          backdropFilter: 'blur(8px)',
          borderColor: 'rgba(255,255,255,0.18)',
        }}
      >
        {/* Catch basket row */}
        <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
          <div className="flex items-center gap-2">
            <Image src="/gift-box.png" alt="basket" width={22} height={22} style={{ imageRendering: 'pixelated' }} />
            <span className="text-white text-xs">Catch Basket</span>
          </div>
          {fishCount > 0 && (
            <span className="bg-coral text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border border-white/30 flex-shrink-0">
              {fishCount > 9 ? '9+' : fishCount}
            </span>
          )}
        </div>

        {/* Campaign + coins */}
        <div className="px-3 py-3 space-y-2">
          {campaign ? (
            <>
              <p className="text-white/60 text-xs truncate">
                Campaign: <span className="text-white">{campaign.name}</span>
              </p>

              {/* Coin counter */}
              <div className="flex items-center gap-2">
                <CoinAnim />
                <span
                  className="text-yellow-300 font-bold tabular-nums"
                  style={{ fontSize: '1.25rem', lineHeight: 1 }}
                >
                  {campaign.current_coins.toLocaleString()}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.10)' }} />

              {/* Stats rows */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">✅ Profit</span>
                  <span className="text-green-400 font-bold tabular-nums">
                    +{campaign.total_win.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">❌ Loss</span>
                  <span style={{ color: '#f87171' }} className="font-bold tabular-nums">
                    -{campaign.total_lose.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">📊 ROI</span>
                  <span
                    className="font-bold tabular-nums"
                    style={{ color: roiNum >= 0 ? '#fbbf24' : '#f87171' }}
                  >
                    {roiNum >= 0 ? '+' : ''}{roi}%
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-white/40 text-xs text-center py-2">No active campaign</p>
          )}
        </div>
      </div>

      {/* Top Up button */}
      <button
        onClick={onTopUpClick}
        className="w-full py-2 bg-coral hover:bg-coral-dark text-white font-pixel text-xs rounded-xl border-2 border-coral-dark transition-colors shadow-lg"
      >
        💰 Top Up
      </button>
    </div>
  )
}
