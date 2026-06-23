'use client'

interface CoinSpriteProps {
  count?: number
  size?: number
}

export default function CoinSprite({ count, size = 20 }: CoinSpriteProps) {
  return (
    <div className="flex items-center gap-1">
      <div
        style={{
          width: size,
          height: size,
          backgroundImage: "url('/coin2_20x20.png')",
          backgroundSize: `${size * 8}px ${size}px`,
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
          flexShrink: 0,
          animation: 'coinSpin 0.8s steps(8) infinite',
        }}
      />
      {count !== undefined && (
        <span className="font-pixel text-yellow-300 text-xs drop-shadow">
          {count.toLocaleString()}
        </span>
      )}
    </div>
  )
}
