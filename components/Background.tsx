'use client'

// Cloud shape via CSS box-shadow trick
function Cloud({
  width,
  height,
  top,
  duration,
  delay,
  opacity = 0.7,
}: {
  width: number
  height: number
  top: string
  duration: number
  delay: number
  opacity?: number
}) {
  const bumpW = Math.round(width * 0.45)
  const bumpH = Math.round(height * 1.3)
  const bump2W = Math.round(width * 0.3)
  const bump2H = Math.round(height * 1.1)

  return (
    <div
      style={{
        position: 'absolute',
        top,
        width,
        height,
        background: 'white',
        borderRadius: '50px',
        opacity,
        animation: `cloudFloat ${duration}s linear ${delay}s infinite`,
        willChange: 'transform',
      }}
    >
      {/* left dome */}
      <div
        style={{
          position: 'absolute',
          width: bumpW,
          height: bumpH,
          background: 'white',
          borderRadius: '50%',
          top: -Math.round(bumpH * 0.55),
          left: Math.round(width * 0.15),
        }}
      />
      {/* right dome */}
      <div
        style={{
          position: 'absolute',
          width: bump2W,
          height: bump2H,
          background: 'white',
          borderRadius: '50%',
          top: -Math.round(bump2H * 0.4),
          left: Math.round(width * 0.5),
        }}
      />
    </div>
  )
}

const LEAVES = [
  { left: '8%',  size: 10, duration: 14, delay: 0,   rotate: 40  },
  { left: '22%', size: 8,  duration: 18, delay: -4,  rotate: -30 },
  { left: '45%', size: 12, duration: 12, delay: -9,  rotate: 60  },
  { left: '63%', size: 9,  duration: 16, delay: -2,  rotate: -50 },
  { left: '80%', size: 11, duration: 13, delay: -7,  rotate: 35  },
  { left: '91%', size: 7,  duration: 20, delay: -13, rotate: -20 },
]

export default function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Static background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/background/bg1.png"
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          imageRendering: 'pixelated',
        }}
      />

      {/* ── Clouds ────────────────────────────────── */}
      <Cloud width={180} height={52} top="8%"  duration={60}  delay={0}   opacity={0.72} />
      <Cloud width={110} height={38} top="16%" duration={90}  delay={-28} opacity={0.65} />
      <Cloud width={240} height={68} top="5%"  duration={120} delay={-55} opacity={0.60} />
      <Cloud width={85}  height={30} top="22%" duration={75}  delay={-14} opacity={0.68} />

      {/* ── Falling leaves ────────────────────────── */}
      {LEAVES.map((l, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '-24px',
            left: l.left,
            width: l.size,
            height: l.size * 1.4,
            background: '#4a9960',
            borderRadius: '50% 0 50% 0',
            transform: `rotate(${l.rotate}deg)`,
            animation: `leafFall ${l.duration}s ease-in ${l.delay}s infinite`,
            willChange: 'transform',
          }}
        />
      ))}

      {/* ── Water surface ─────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '-5%',
          right: '-5%',
          height: '17%',
          overflow: 'hidden',
        }}
      >
        {/* back wave — darker */}
        <div
          style={{
            position: 'absolute',
            inset: '-30% 0 0 0',
            background: 'rgba(30, 80, 85, 0.60)',
            animation: 'waveSway 7s ease-in-out infinite',
          }}
        />
        {/* front wave — lighter */}
        <div
          style={{
            position: 'absolute',
            inset: '-15% 0 0 0',
            background: 'rgba(85, 165, 170, 0.40)',
            animation: 'waveSwayAlt 9s ease-in-out infinite',
          }}
        />
        {/* shimmer line at top of water */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: 0,
            right: 0,
            height: '2px',
            background: 'rgba(180, 230, 235, 0.45)',
          }}
        />
      </div>
    </div>
  )
}
