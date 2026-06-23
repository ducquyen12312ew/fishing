'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Background from '@/components/Background'
import Rabbit from '@/components/RabbitCanvas'
import BetCard from '@/components/BetCard'
import AddBetModal from '@/components/AddBetModal'
import ConfirmBetModal from '@/components/ConfirmBetModal'
import CampaignModal from '@/components/CampaignModal'
import StatsPanel from '@/components/StatsPanel'

interface Bet {
  id: number
  sport_emoji: string
  name: string
  amount: number
  odds: number
  fish_image: string
  status: 'pending' | 'won' | 'lost'
  created_at: string
  resolved_at: string | null
}

interface Campaign {
  id: number
  name: string
  initial_coins: number
  current_coins: number
  total_win: number
  total_lose: number
  is_active: boolean
}

const MAX_VISIBLE = 5
const FISH_TTL_MS = 10 * 60 * 60 * 1000

export default function HomePage() {
  const [bets, setBets] = useState<Bet[]>([])
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [showAddBet, setShowAddBet] = useState(false)
  const [showCampaign, setShowCampaign] = useState(false)
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null)
  const [leavingIds, setLeavingIds] = useState<Set<number>>(new Set())
  const [basketFish, setBasketFish] = useState<number[]>([])
  const newBetIdRef = useRef<number | null>(null)

  const fetchData = useCallback(async () => {
    const [betsRes, campaignsRes] = await Promise.all([
      fetch('/api/bets?status=pending'),
      fetch('/api/campaigns'),
    ])
    const betsData = await betsRes.json()
    const campaignsData = await campaignsRes.json()

    setBets(Array.isArray(betsData) ? betsData : [])
    const active = Array.isArray(campaignsData)
      ? campaignsData.find((c: Campaign) => c.is_active) ?? null
      : null
    setCampaign(active)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      setBasketFish((prev) => prev.filter((ts) => now - ts < FISH_TTL_MS))
    }, 60_000)
    return () => clearInterval(timer)
  }, [])

  function handleBetSuccess(newBet: unknown) {
    const bet = newBet as Bet
    newBetIdRef.current = bet.id
    setBets((prev) => [bet, ...prev])
  }

  function handleBetResolved(id: number, result: 'won' | 'lost') {
    if (result === 'won') {
      setBasketFish((prev) => [...prev, Date.now()])
    }
    setLeavingIds((prev) => new Set(prev).add(id))
    setTimeout(() => {
      setBets((prev) => prev.filter((b) => b.id !== id))
      setLeavingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 600)
    fetchData()
  }

  const visibleBets = bets.slice(0, MAX_VISIBLE)
  const hiddenCount = bets.length - MAX_VISIBLE

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none">
      {/* ── Background (bg1.png + clouds + waves + leaves) ── */}
      <Background />

      {/* ── Title ─────────────────────────────────────────── */}
      <div className="absolute top-10 left-0 right-0 flex flex-col items-center z-10 pointer-events-none">
        <h1
          className="font-pixel font-bold text-[#2d6a6f] drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          A Fishing Day
        </h1>
        <p
          className="font-pixel text-[#3d8a8e] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-2"
          style={{ fontSize: 'clamp(0.55rem, 1.5vw, 0.9rem)', opacity: 0.85 }}
        >
          by Watermelon
        </p>
      </div>

      {/* ── Action buttons ─────────────────────────────────── */}
      <div className="absolute top-32 sm:top-36 left-0 right-0 flex justify-center gap-4 z-10">
        <button
          onClick={() => setShowAddBet(true)}
          className="px-5 py-2 bg-coral hover:bg-coral-dark text-white font-pixel text-xs rounded border-2 border-coral-dark shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          + New Contract
        </button>
        <Link
          href="/history"
          className="px-5 py-2 bg-transparent hover:bg-white/15 text-white font-pixel text-xs rounded border-2 border-white/60 hover:border-white shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          Old Contracts
        </Link>
      </div>

      {/* ── Bet cards floating above rabbit ────────────────── */}
      <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 z-10 flex flex-col-reverse items-center gap-2 w-full max-w-sm px-4">
        {visibleBets.map((bet) => (
          <BetCard
            key={bet.id}
            bet={bet}
            isNew={bet.id === newBetIdRef.current}
            isLeaving={leavingIds.has(bet.id)}
            onClick={() => setSelectedBet(bet)}
          />
        ))}
        {hiddenCount > 0 && (
          <span className="font-pixel text-white/60 text-xs">
            +{hiddenCount} more...
          </span>
        )}
      </div>

      {/* ── Rabbit ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '50%',
          animation: 'rabbitBob 2s ease-in-out infinite',
          zIndex: 10,
        }}
      >
        <Rabbit />
      </div>

      {/* ── Stats panel — top right ─────────────────────────── */}
      <div className="fixed top-4 right-4 z-20">
        <StatsPanel
          campaign={campaign}
          fishCount={basketFish.length}
          onTopUpClick={() => setShowCampaign(true)}
        />
      </div>

      {/* ── No campaign nudge ───────────────────────────────── */}
      {!campaign && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
          <button
            onClick={() => setShowCampaign(true)}
            className="font-pixel text-yellow-300 text-xs bg-black/50 px-4 py-2 rounded border border-yellow-300/50 hover:bg-black/70 transition-colors animate-pulse"
          >
            ⚠️ No campaign → Create one!
          </button>
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────── */}
      {showAddBet && (
        <AddBetModal onClose={() => setShowAddBet(false)} onSuccess={handleBetSuccess} />
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
