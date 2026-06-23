'use client'

import { useState, useRef } from 'react'

export default function SoundToggle() {
  const [on, setOn] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  function toggle() {
    // AudioContext must be created after user gesture
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    const ctx = ctxRef.current

    if (on) {
      gainRef.current?.gain.setTargetAtTime(0, ctx.currentTime, 0.4)
      setOn(false)
      return
    }

    // Build noise → lowpass → gain chain on first play
    if (!sourceRef.current) {
      const SR = ctx.sampleRate
      const buf = ctx.createBuffer(1, SR * 3, SR)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

      const src = ctx.createBufferSource()
      src.buffer = buf
      src.loop = true

      const lpf = ctx.createBiquadFilter()
      lpf.type = 'lowpass'
      lpf.frequency.value = 380
      lpf.Q.value = 0.8

      const gain = ctx.createGain()
      gain.gain.value = 0

      src.connect(lpf)
      lpf.connect(gain)
      gain.connect(ctx.destination)
      src.start()

      sourceRef.current = src
      gainRef.current = gain
    }

    gainRef.current?.gain.setTargetAtTime(0.07, ctx.currentTime, 0.6)
    setOn(true)
  }

  return (
    <button
      onClick={toggle}
      title={on ? 'Mute ambient sound' : 'Play ambient sound'}
      className="w-9 h-9 flex items-center justify-center rounded-full font-pixel text-sm transition-all hover:scale-110 active:scale-95"
      style={{
        background: on ? 'rgba(95,158,160,0.7)' : 'rgba(0,0,0,0.45)',
        border: '2px solid rgba(255,255,255,0.3)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {on ? '🔊' : '🔇'}
    </button>
  )
}
