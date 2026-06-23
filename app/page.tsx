'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Background from '@/components/Background'
import Rabbit from '@/components/RabbitCanvas'
import BetCard, { type Bet } from '@/components/BetCard'
import AllBetsModal from '@/components/AllBetsModal'
import AddBetModal from '@/components/AddBetModal'
import ConfirmBetModal from '@/components/ConfirmBetModal'
import CampaignModal from '@/components/CampaignModal'
import StatsPanel from '@/components/StatsPanel'
import SoundToggle from '@/components/SoundToggle'

interface Campaign {
  id: string
  name: string
  initial_coins: number
  current_coins: number
  total_win: number
  total_lose: number
  is_active: boolean
}

const MAX_VISIBLE  = 4
const FISH_TTL_MS  = 10 * 60 * 60 * 1000
const IDLE_TIMEOUT = 30_000

export default function HomePage() {
  const [bets, setBets]                 = useState<Bet[]>([])
  const [campaign, setCampaign]         = useState<Campaign | null>(null)
  const [showAddBet, setShowAddBet]     = useState(false)
  const [showCampaign, setShowCampaign] = useState(false)
  const [showAllBets, setShowAllBets]   = useState(false)
  const [selectedBet, setSelectedBet]   = useState<Bet | null>(null)
  const [leavingIds, setLeavingIds]     = useState<Set<number>>(new Set())
  const [basketFish, setBasketFish]     = useState<number[]>([])
  const [isIdle, setIsIdle]             = useState(false)
  const [isShaking, setIsShaking]       = useState(false)
  const newBetIdRef = useRef<number | null>(null)
  const idleTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ── Data fetching ────────────────────────────── */
  const fetchData = useCallback(async () => {
    try {
      const [betsRes, campsRes] = await Promise.all([
        fetch('/api/bets?status=pending'),
        fetch('/api/campaigns'),
      ])
      const betsData  = await betsRes.json()
      const campsData = await campsRes.json()

      setBets(Array.isArray(betsData) ? betsData : [])
      const active = Array.isArray(campsData)
        ? campsData.find((c: Campaign) => c.is_active) ?? null
        : null
      setCampaign(active)
    } catch { /* keep previous state on network error */ }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  /* ── Fish basket TTL ──────────────────────────── */
  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now()
      setBasketFish((prev) => prev.filter((ts) => now - ts < FISH_TTL_MS))
    }, 60_000)
    return () => clearInterval(t)
  }, [])

  /* ── Idle detection ───────────────────────────── */
  const resetIdle = useCallback(() => {
    setIsIdle(false)
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT)
  }, [])

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'] as const
    events.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }))
    resetIdle()
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdle))
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [resetIdle])

  /* ── Rabbit shake on click ────────────────────── */
  function handleRabbitClick() {
    if (isShaking) return
    resetIdle()
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 380)
  }

  /* ── Bet handlers ─────────────────────────────── */
  function handleBetSuccess(newBet: unknown) {
    const bet = newBet as Bet
    newBetIdRef.current = bet.id
    setBets((prev) => [bet, ...prev])
  }

  function handleBetResolved(id: number, result: 'won' | 'lost') {
    if (result === 'won') setBasketFish((prev) => [...prev, Date.now()])

    setLeavingIds((prev) => new Set(prev).add(id))
    setTimeout(() => {
      setBets((prev) => prev.filter((b) => b.id !== id))
      setLeavingIds((prev) => {
        const s = new Set(prev)
        s.delete(id)
        return s
      })
    }, 600)
    fetchData()
  }

  const visibleBets = bets.slice(0, MAX_VISIBLE)
  const hiddenCount = bets.length - MAX_VISIBLE

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none">

      {/* ── Animated background ─────────────────── */}
      <Background />

      {/* ── Title card ──────────────────────────── */}
      <div className="absolute top-6 left-0 right-0 flex justify-center z-10 px-4">
        <div
          className="flex flex-col items-center gap-3"
          style={{
            background:     'rgba(255,255,255,0.35)',
            backdropFilter: 'blur(4px)',
            borderRadius:   '16px',
            padding:        'clamp(12px,2.5vw,22px) clamp(18px,4vw,36px)',
            border:         '1px solid rgba(255,255,255,0.60)',
          }}
        >
          <h1
            className="font-pixel font-bold text-center leading-tight"
            style={{
              fontSize:      'clamp(1.4rem,3.5vw,3.5rem)',
              fontWeight:    700,
              color:         '#2d5a27',
              letterSpacing: '0.05em',
            }}
          >
            DuaHau&apos;s Fishing Day
          </h1>
          <p
            className="font-pixel text-center"
            style={{ fontSize: 'clamp(0.45rem, 1.3vw, 0.9rem)', color: '#3a5a3a' }}
          >
            Cast your line, make your bet
          </p>

          <div className="flex gap-3 mt-1">
            <button
              onClick={() => { setShowAddBet(true); resetIdle() }}
              className="px-4 py-2 bg-coral hover:bg-coral-dark text-white font-pixel rounded border-2 border-coral-dark shadow transition-all hover:scale-105 active:scale-95"
              style={{ fontSize: 'clamp(0.42rem, 1.1vw, 0.7rem)' }}
            >
              + New Contract
            </button>
            <Link
              href="/history"
              className="px-4 py-2 bg-transparent hover:bg-white/20 font-pixel rounded border-2 shadow transition-all hover:scale-105 active:scale-95"
              style={{ fontSize: 'clamp(0.42rem, 1.1vw, 0.7rem)', color: '#2d5a27', borderColor: '#2d5a27' }}
            >
              Old Contracts
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bet cards — positioned above rabbit ─────
          Rabbit is at bottom:15%, ~180px tall → cards bottom ≈ 15% + 200px
      ─────────────────────────────────────────────── */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10 w-full px-4"
        style={{
          bottom:        'calc(15% + 200px)',
          maxWidth:      '360px',
          maxHeight:     '50vh',
          overflowY:     'auto',
          scrollbarWidth: 'none',
          display:       'flex',
          flexDirection: 'column-reverse',
          alignItems:    'center',
          gap:           '8px',
        }}
      >
        {visibleBets.map((bet) => (
          <BetCard
            key={bet.id}
            bet={bet}
            isNew={bet.id === newBetIdRef.current}
            isLeaving={leavingIds.has(bet.id)}
            onClick={() => { setSelectedBet(bet); resetIdle() }}
          />
        ))}

        {/* "+X more" → open AllBetsModal */}
        {hiddenCount > 0 && (
          <button
            onClick={() => { setShowAllBets(true); resetIdle() }}
            className="font-pixel text-white text-xs transition-all hover:scale-105 active:scale-95"
            style={{
              background:     'rgba(255,255,255,0.3)',
              backdropFilter: 'blur(4px)',
              border:         '1px solid rgba(255,255,255,0.5)',
              borderRadius:   '8px',
              padding:        '4px 12px',
            }}
          >
            +{hiddenCount} more...
          </button>
        )}
      </div>

      {/* ── Rabbit ──────────────────────────────── */}
      <div
        style={{
          position:  'absolute',
          bottom:    '15%',
          left:      '50%',
          transform: 'translateX(-50%)',
          zIndex:    10,
          cursor:    'pointer',
        }}
        onClick={handleRabbitClick}
      >
        {/* Zzz bubble */}
        {isIdle && (
          <div
            style={{
              position:   'absolute',
              top:        '-44px',
              right:      '-28px',
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '12px 12px 12px 2px',
              padding:    '4px 8px',
              fontFamily: 'var(--font-silkscreen), monospace',
              fontSize:   '0.6rem',
              fontWeight: 700,
              color:      '#4a7c59',
              animation:  'zzzFloat 2.5s ease-in-out infinite',
              whiteSpace: 'nowrap',
              boxShadow:  '0 2px 6px rgba(0,0,0,0.2)',
              zIndex:     11,
            }}
          >
            Zzz...
          </div>
        )}

        <div
          style={{
            animation: isShaking
              ? 'rabbitShake 0.38s ease'
              : 'rabbitBobInner 2s ease-in-out infinite',
          }}
        >
          <Rabbit />
        </div>
      </div>

      {/* ── Stats panel — top right ──────────────── */}
      <div className="fixed top-4 right-4 z-20">
        <StatsPanel
          campaign={campaign}
          fishCount={basketFish.length}
          onTopUpClick={() => { setShowCampaign(true); resetIdle() }}
        />
      </div>

      {/* ── Sound toggle — bottom left ────────────── */}
      <div className="fixed bottom-4 left-4 z-20">
        <SoundToggle />
      </div>

      {/* ── No campaign nudge ─────────────────────── */}
      {!campaign && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
          <button
            onClick={() => { setShowCampaign(true); resetIdle() }}
            className="font-pixel text-yellow-300 text-xs bg-black/50 px-4 py-2 rounded border border-yellow-300/50 hover:bg-black/70 transition-colors animate-pulse"
          >
            ⚠️ No campaign → Create one!
          </button>
        </div>
      )}

      {/* ── Modals ───────────────────────────────── */}
      {showAddBet && (
        <AddBetModal onClose={() => setShowAddBet(false)} onSuccess={handleBetSuccess} />
      )}

      {showAllBets && (
        <AllBetsModal
          bets={bets}
          onClose={() => setShowAllBets(false)}
          onBetClick={(bet) => { setSelectedBet(bet); setShowAllBets(false) }}
        />
      )}

      {selectedBet && (
        <ConfirmBetModal
          bet={selectedBet}
          onClose={() => setSelectedBet(null)}
          onResolved={handleBetResolved}
        />
      )}

      {showCampaign && (
        <CampaignModal
          onClose={() => setShowCampaign(false)}
          onCampaignChange={fetchData}
        />
      )}
    </main>
  )
}
