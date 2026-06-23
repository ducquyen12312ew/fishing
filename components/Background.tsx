'use client'

import { useEffect, useState, useRef } from 'react'

export type Theme = 'fishing' | 'football'

function getDayNightColor(): string {
  const h = new Date().getHours()
  if (h >= 5  && h < 10) return 'rgba(255,200,100,0.05)'
  if (h >= 10 && h < 17) return 'transparent'
  if (h >= 17 && h < 20) return 'rgba(255,100,50,0.08)'
  return 'rgba(50,30,100,0.10)'
}

const BIRDS = [
  { top: '8%',  size: 22, duration: 18, delay: 0 },
  { top: '12%', size: 16, duration: 26, delay: -9 },
  { top: '6%',  size: 20, duration: 22, delay: -16 },
]

function Bird({ top, size, duration, delay }: typeof BIRDS[number]) {
  return (
    <div style={{ position: 'absolute', top, left: 0, width: size, height: size * 0.45, animation: `birdFly ${duration}s linear ${delay}s infinite`, willChange: 'transform' }}>
      <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.85)', animation: `birdWing ${duration / 8}s ease-in-out infinite`, clipPath: 'polygon(0% 60%, 25% 0%, 50% 50%, 75% 0%, 100% 60%)' }} />
    </div>
  )
}

const BUTTERFLIES = [
  { top: '28%', duration: 30, delay: 0,   color: '#ff9eb5' },
  { top: '38%', duration: 38, delay: -14, color: '#ffd166' },
]

function Butterfly({ top, duration, delay, color }: typeof BUTTERFLIES[number]) {
  return (
    <div style={{ position: 'absolute', top, left: '-70px', animation: `butterflyFly ${duration}s linear ${delay}s infinite`, willChange: 'transform' }}>
      <div style={{ position: 'relative', width: 24, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', left: 0, width: 12, height: 14, background: color, borderRadius: '60% 0 60% 40%', opacity: 0.85, animation: `butterflyWing 0.25s ease-in-out infinite`, transformOrigin: 'right center' }} />
        <div style={{ position: 'absolute', right: 0, width: 12, height: 14, background: color, borderRadius: '0 60% 40% 60%', opacity: 0.85, animation: `butterflyWing 0.25s ease-in-out 0.125s infinite`, transformOrigin: 'left center' }} />
        <div style={{ position: 'absolute', width: 3, height: 10, background: '#4a2c0a', borderRadius: '2px', zIndex: 1 }} />
      </div>
    </div>
  )
}

const BUBBLES = [
  { left: '12%', size: 5, duration: 2.8, delay: 0    },
  { left: '23%', size: 4, duration: 3.5, delay: -1.2 },
  { left: '35%', size: 6, duration: 2.5, delay: -0.8 },
  { left: '48%', size: 4, duration: 3.8, delay: -2.1 },
  { left: '58%', size: 5, duration: 3.0, delay: -0.5 },
  { left: '67%', size: 7, duration: 2.6, delay: -1.8 },
  { left: '78%', size: 4, duration: 3.3, delay: -0.3 },
  { left: '88%', size: 5, duration: 2.9, delay: -2.5 },
]

const LEAVES = [
  { left: '3%',  size: 10, duration: 8,  delay: 0,   rotate: 30  },
  { left: '6%',  size: 8,  duration: 10, delay: -3,  rotate: -20 },
  { left: '8%',  size: 11, duration: 7,  delay: -6,  rotate: 50  },
  { left: '4%',  size: 9,  duration: 9,  delay: -2,  rotate: -40 },
  { left: '88%', size: 10, duration: 8,  delay: -1,  rotate: -35 },
  { left: '92%', size: 8,  duration: 11, delay: -5,  rotate: 25  },
  { left: '95%', size: 11, duration: 7,  delay: -4,  rotate: -55 },
  { left: '90%', size: 9,  duration: 9,  delay: -7,  rotate: 40  },
]

/* Deterministic rain drop positions */
const RAIN_DROPS = Array.from({ length: 45 }, (_, i) => ({
  left:     `${((i * 2.3 + (i % 7) * 1.7) % 100).toFixed(1)}%`,
  height:   12 + (i % 6) * 3,
  duration: (0.55 + (i % 9) * 0.08).toFixed(2),
  delay:    (-(i % 13) * 0.14).toFixed(2),
  opacity:  0.18 + (i % 5) * 0.04,
}))

interface BackgroundProps {
  theme: Theme
}

interface JumpFish {
  x: number
  src: string
  key: number
}

export default function Background({ theme }: BackgroundProps) {
  const [dayNightColor, setDayNightColor] = useState('transparent')
  const [jumpFish, setJumpFish] = useState<JumpFish | null>(null)
  const jumpKeyRef = useRef(0)

  useEffect(() => {
    setDayNightColor(getDayNightColor())
    const t = setInterval(() => setDayNightColor(getDayNightColor()), 60_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (theme !== 'fishing') return
    let timer: ReturnType<typeof setTimeout>
    function scheduleJump() {
      const delay = 8000 + Math.random() * 4000
      timer = setTimeout(() => {
        const fish = Math.random() < 0.5 ? 'fish1.png' : 'fish2.png'
        setJumpFish({ x: 20 + Math.random() * 60, src: fish, key: jumpKeyRef.current++ })
        setTimeout(() => setJumpFish(null), 1600)
        scheduleJump()
      }, delay)
    }
    scheduleJump()
    return () => clearTimeout(timer)
  }, [theme])

  const isFishing = theme === 'fishing'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Fishing background — crossfade via opacity */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/background/bg1.png"
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', imageRendering: 'pixelated',
          transition: 'opacity 0.8s ease',
          opacity: isFishing ? 1 : 0,
        }}
      />
      {/* Football background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/background/bg2.jpg"
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          transition: 'opacity 0.8s ease',
          opacity: isFishing ? 0 : 1,
        }}
      />

      {/* Day/night overlay */}
      <div className="day-night-overlay absolute inset-0" style={{ backgroundColor: dayNightColor }} />

      {/* ── Fishing effects ── */}
      <div style={{ transition: 'opacity 0.5s ease', opacity: isFishing ? 1 : 0 }}>
        {BIRDS.map((b, i) => <Bird key={i} {...b} />)}
        {BUTTERFLIES.map((b, i) => <Butterfly key={i} {...b} />)}
        {LEAVES.map((l, i) => (
          <div key={i} style={{ position: 'absolute', top: '-20px', left: l.left, width: l.size, height: l.size * 1.4, background: '#4a9960', borderRadius: '50% 0 50% 0', transform: `rotate(${l.rotate}deg)`, animation: `leafFall ${l.duration}s ease-in ${l.delay}s infinite` }} />
        ))}
        {jumpFish && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={jumpFish.key}
            src={`/fish/${jumpFish.src}`}
            alt=""
            style={{ position: 'absolute', bottom: '16%', left: `${jumpFish.x}%`, width: 32, imageRendering: 'pixelated', animation: 'fishJump 1.5s ease-out forwards' }}
          />
        )}
        {/* Water surface */}
        <div style={{ position: 'absolute', bottom: 0, left: '-5%', right: '-5%', height: '17%', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: '-30% 0 0 0', background: 'rgba(30,80,85,0.60)', animation: 'waveSway 7s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', inset: '-15% 0 0 0', background: 'rgba(85,165,170,0.40)', animation: 'waveSwayAlt 9s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '40%', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)', animation: 'waterShimmer 4s linear infinite' }} />
          </div>
          <div style={{ position: 'absolute', top: '6%', left: 0, right: 0, height: '2px', background: 'rgba(200,240,245,0.45)' }} />
          {BUBBLES.map((b, i) => (
            <div key={i} style={{ position: 'absolute', bottom: '70%', left: b.left, width: b.size, height: b.size, borderRadius: '50%', background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.3)', animation: `bubbleRise ${b.duration}s ease-in ${b.delay}s infinite` }} />
          ))}
          <div style={{ position: 'absolute', top: '5%', left: '50%', width: 20, height: 20 }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(180,230,235,0.6)', animation: 'rippleExpand 2s ease-out infinite' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(180,230,235,0.4)', animation: 'rippleExpand 2s ease-out 1s infinite' }} />
          </div>
        </div>
      </div>

      {/* ── Football effects ── */}
      <div style={{ transition: 'opacity 0.5s ease', opacity: isFishing ? 0 : 1 }}>
        {/* Rain drops */}
        {RAIN_DROPS.map((r, i) => (
          <div
            key={i}
            style={{
              position:   'absolute',
              top:        '-20px',
              left:       r.left,
              width:      '1px',
              height:     r.height,
              background: 'rgba(180,215,255,0.7)',
              animation:  `rainFall ${r.duration}s linear ${r.delay}s infinite`,
              opacity:    r.opacity,
            }}
          />
        ))}
        {/* Drifting leaves */}
        {LEAVES.slice(0, 4).map((l, i) => (
          <div key={i} style={{ position: 'absolute', top: '-20px', left: l.left, width: l.size * 0.7, height: l.size * 0.7, background: 'rgba(100,155,75,0.55)', borderRadius: '50% 0 50% 0', transform: `rotate(${l.rotate}deg)`, animation: `leafFall ${l.duration * 1.6}s ease-in ${l.delay}s infinite` }} />
        ))}
        {/* Puddle shimmer at ground */}
        <div style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          right:      0,
          height:     '5%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(100,160,220,0.12) 100%)',
          animation:  'puddleShimmer 3s ease-in-out infinite',
        }} />
      </div>
    </div>
  )
}
