'use client'

import { useEffect, useRef, useCallback } from 'react'

type AnimationState = 'idle' | 'bite' | 'wait'

interface RabbitCanvasProps {
  state: AnimationState
  onBiteComplete?: () => void
}

const COLS = 5
const ROWS = 3
const FPS = 8

const ANIMATION = {
  idle: { start: 0, end: 4, loop: true },
  bite: { start: 5, end: 9, loop: false },
  wait: { start: 10, end: 13, loop: true },
}

export default function RabbitCanvas({ state, onBiteComplete }: RabbitCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const frameRef = useRef(0)
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef(0)
  const stateRef = useRef<AnimationState>(state)

  stateRef.current = state

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img || !img.complete) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const frameW = img.naturalWidth / COLS
    const frameH = img.naturalHeight / ROWS
    const frame = frameRef.current

    const sx = (frame % COLS) * frameW
    const sy = Math.floor(frame / COLS) * frameH

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(img, sx, sy, frameW, frameH, 0, 0, canvas.width, canvas.height)
  }, [])

  const animate = useCallback(
    (timestamp: number) => {
      if (timestamp - lastTimeRef.current >= 1000 / FPS) {
        lastTimeRef.current = timestamp
        const anim = ANIMATION[stateRef.current]
        const range = anim.end - anim.start + 1
        const localFrame = frameRef.current - anim.start

        if (localFrame >= range - 1) {
          if (anim.loop) {
            frameRef.current = anim.start
          } else {
            // bite done → back to idle
            stateRef.current = 'idle'
            frameRef.current = ANIMATION.idle.start
            onBiteComplete?.()
          }
        } else {
          frameRef.current++
        }

        draw()
      }

      rafRef.current = requestAnimationFrame(animate)
    },
    [draw, onBiteComplete]
  )

  useEffect(() => {
    const img = new window.Image()
    img.src = '/rabbit.png'
    imgRef.current = img

    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const frameW = img.naturalWidth / COLS
      const frameH = img.naturalHeight / ROWS
      const scale = Math.max(1, Math.floor(180 / frameW))
      canvas.width = frameW * scale
      canvas.height = frameH * scale
      draw()
      rafRef.current = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [animate, draw])

  // On state change, reset frame to start of new animation
  useEffect(() => {
    const anim = ANIMATION[state]
    // Only reset if we're moving to a different section
    if (frameRef.current < anim.start || frameRef.current > anim.end) {
      frameRef.current = anim.start
    }
  }, [state])

  return (
    <canvas
      ref={canvasRef}
      style={{ imageRendering: 'pixelated' }}
      className="drop-shadow-lg"
    />
  )
}
