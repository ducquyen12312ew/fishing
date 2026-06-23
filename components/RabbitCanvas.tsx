'use client'

export default function Rabbit() {
  return (
    <img
      src="/rabbit.png"
      alt="fishing rabbit"
      style={{
        imageRendering: 'pixelated',
        maxHeight: '220px',
        width: 'auto',
        display: 'block',
        // bob animation is applied via the parent's absolute positioning style
      }}
      draggable={false}
    />
  )
}
