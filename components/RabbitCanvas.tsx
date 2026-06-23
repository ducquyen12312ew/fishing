'use client'

interface RabbitProps {
  src?: string
}

export default function Rabbit({ src = '/rabbit.png' }: RabbitProps) {
  return (
    <img
      src={src}
      alt="rabbit"
      style={{
        imageRendering: 'pixelated',
        maxHeight: '220px',
        width: 'auto',
        display: 'block',
      }}
      draggable={false}
    />
  )
}
