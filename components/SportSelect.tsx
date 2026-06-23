'use client'

import { useState, useRef, useEffect } from 'react'

interface Sport {
  emoji: string
  keywords: string[]
}

const SPORTS: Sport[] = [
  { emoji: '⚽', keywords: ['football', 'soccer', 'bong da'] },
  { emoji: '🏀', keywords: ['basketball', 'bong ro'] },
  { emoji: '🎾', keywords: ['tennis'] },
  { emoji: '🏈', keywords: ['american football', 'rugby'] },
  { emoji: '⚾', keywords: ['baseball', 'bong chay'] },
  { emoji: '🏐', keywords: ['volleyball', 'bong chuyen'] },
  { emoji: '🏒', keywords: ['hockey', 'ice hockey'] },
  { emoji: '🥊', keywords: ['boxing', 'quyen anh'] },
  { emoji: '🏇', keywords: ['horse racing', 'dua ngua'] },
  { emoji: '🎮', keywords: ['esport', 'gaming', 'game'] },
  { emoji: '🏎️', keywords: ['f1', 'racing', 'dua xe'] },
  { emoji: '🏋️', keywords: ['weightlifting', 'cu ta'] },
  { emoji: '🏓', keywords: ['ping pong', 'table tennis', 'bong ban'] },
  { emoji: '🏸', keywords: ['badminton', 'cau long'] },
  { emoji: '🥋', keywords: ['mma', 'martial arts', 'vo thuat'] },
  { emoji: '🎱', keywords: ['billiards', 'pool', 'bia'] },
]

interface SportSelectProps {
  value: string
  onChange: (emoji: string) => void
}

export default function SportSelect({ value, onChange }: SportSelectProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const filtered = query
    ? SPORTS.filter((s) =>
        s.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase()))
      )
    : SPORTS

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-white/10 border-2 border-teal-light rounded text-left hover:bg-white/20 transition-colors"
      >
        {value ? (
          <span className="text-2xl">{value}</span>
        ) : (
          <span className="text-white/50 text-xs font-pixel">Select sport...</span>
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#1a3a3c] border-2 border-teal-light rounded shadow-xl">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sport..."
            className="w-full px-3 py-2 bg-transparent text-white text-xs font-pixel border-b border-teal-light outline-none placeholder:text-white/40"
          />
          <div className="flex flex-wrap gap-2 p-3 max-h-40 overflow-y-auto">
            {filtered.map((s) => (
              <button
                key={s.emoji}
                type="button"
                onClick={() => {
                  onChange(s.emoji)
                  setOpen(false)
                  setQuery('')
                }}
                className={`text-2xl hover:scale-125 transition-transform p-1 rounded ${
                  value === s.emoji ? 'bg-teal-light/30 ring-2 ring-teal-light' : ''
                }`}
                title={s.keywords[0]}
              >
                {s.emoji}
              </button>
            ))}
            {filtered.length === 0 && (
              <span className="text-white/40 text-xs font-pixel">Not found</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
