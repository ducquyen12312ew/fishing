'use client'

import Image from 'next/image'
import CoinSprite from './CoinSprite'

interface GiftBoxWidgetProps {
  fishCount: number
  coinCount: number
  onCampaignClick: () => void
}

export default function GiftBoxWidget({
  fishCount,
  coinCount,
  onCampaignClick,
}: GiftBoxWidgetProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Gift box / fish basket */}
      <div className="relative">
        <Image
          src="/gift-box.png"
          alt="Giỏ cá"
          width={48}
          height={48}
          style={{ imageRendering: 'pixelated' }}
          className="drop-shadow-lg"
        />
        {fishCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-coral text-white font-pixel text-xs w-5 h-5 rounded-full flex items-center justify-center border border-white">
            {fishCount > 9 ? '9+' : fishCount}
          </span>
        )}
      </div>

      {/* Coin counter */}
      <div className="bg-[#0f2b2d]/90 border-2 border-teal-light rounded-lg px-3 py-2 flex flex-col items-center gap-1">
        <CoinSprite size={20} />
        <span className="font-pixel text-yellow-300 text-xs">
          {coinCount.toLocaleString()}
        </span>
      </div>

      {/* Nạp xu button */}
      <button
        onClick={onCampaignClick}
        className="bg-[#0f2b2d]/90 border-2 border-teal-light hover:border-yellow-300 rounded-lg px-2 py-2 font-pixel text-white text-xs transition-colors"
        title="Nạp xu / Chiến dịch"
      >
        💰
        <br />
        <span className="text-xs">Nạp</span>
      </button>
    </div>
  )
}
