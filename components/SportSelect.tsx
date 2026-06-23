'use client'

import { useState, useRef, useEffect } from 'react'

interface Sport {
  emoji: string
  keywords: string[]
}

const SPORTS: Sport[] = [
  { emoji: '⚽', keywords: ['bóng đá', 'football', 'soccer', 'bong da'] },
  { emoji: '🏀', keywords: ['bóng rổ', 'basketball', 'bong ro'] },
  { emoji: '🎾', keywords: ['tennis'] },
  { emoji: '🏈', keywords: ['american football', 'bóng bầu dục'] },
  { emoji: '⚾', keywords: ['bóng chày', 'baseball', 'bong chay'] },
  { emoji: '🏐', keywords: ['bóng chuyền', 'volleyball', 'bong chuyen'] },
  { emoji: '🏒', keywords: ['hockey', 'khúc côn cầu'] },
  { emoji: '🥊', keywords: ['boxing', 'quyền anh'] },
  { emoji: '🏇', keywords: ['đua ngựa', 'horse racing', 'dua ngua'] },
  { emoji: '🎮', keywords: ['esport', 'gaming', 'game', 'điện tử', 'dien tu'] },
  { emoji: '🏎️', keywords: ['f1', 'racing', 'đua xe', 'dua xe'] },
  { emoji: '🏋️', keywords: ['cử tạ', 'weightlifting', 'cu ta'] },
  { emoji: '🏓', keywords: ['bóng bàn', 'ping pong', 'bong ban', 'table tennis'] },
  { emoji: '🏸', keywords: ['cầu lông', 'badminton', 'cau long'] },
  { emoji: '🥋', keywords: ['mma', 'võ thuật', 'vo thuat', 'martial arts'] },
  { emoji: '🎱', keywords: ['bi-a', 'billiards', 'pool', 'bia'] },
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
          <span className="text-white/50 text-xs font-pixel">Chọn môn...</span>
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#1a3a3c] border-2 border-teal-light rounded shadow-xl">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm môn..."
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
              <span className="text-white/40 text-xs font-pixel">Không tìm thấy</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
