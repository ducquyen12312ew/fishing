'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import BackgroundSlider from '@/components/BackgroundSlider'
import RabbitCanvas from '@/components/RabbitCanvas'
import BetCard from '@/components/BetCard'
import AddBetModal from '@/components/AddBetModal'
import ConfirmBetModal from '@/components/ConfirmBetModal'
import CampaignModal from '@/components/CampaignModal'
import GiftBoxWidget from '@/components/GiftBoxWidget'

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
  current_coins: number
  total_win: number
  total_lose: number
  is_active: boolean
}

const MAX_VISIBLE = 5
// Fish stay in basket for 10 hours
const FISH_TTL_MS = 10 * 60 * 60 * 1000

export default function HomePage() {
  const [bets, setBets] = useState<Bet[]>([])
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [showAddBet, setShowAddBet] = useState(false)
  const [showCampaign, setShowCampaign] = useState(false)
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null)
  const [rabbitState, setRabbitState] = useState<'idle' | 'bite' | 'wait'>('idle')
  const [leavingIds, setLeavingIds] = useState<Set<number>>(new Set())
  // Track fish caught in last 10h for gift box
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

  // Rabbit state based on pending bets
  useEffect(() => {
    if (bets.length === 0) {
      setRabbitState('wait')
    } else {
      setRabbitState('idle')
    }
  }, [bets.length])

  // Clean up basket fish older than 10h
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      setBasketFish((prev) => prev.filter((ts) => now - ts < FISH_TTL_MS))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  function handleBetSuccess(newBet: unknown) {
    const bet = newBet as Bet
    newBetIdRef.current = bet.id
    setBets((prev) => [bet, ...prev])
  }

  function handleBetResolved(id: number, result: 'won' | 'lost') {
    if (result === 'won') {
      setRabbitState('bite')
      setBasketFish((prev) => [...prev, Date.now()])
    }

    // Animate out
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
  const coinCount = campaign?.current_coins ?? 0

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Background */}
      <BackgroundSlider />

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />

      {/* Title */}
      <div className="absolute top-6 left-0 right-0 flex flex-col items-center z-10 pointer-events-none">
        <h1
          className="font-pixel text-[#2d6a6f] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-shadow"
          style={{ fontSize: 'clamp(14px, 3vw, 28px)' }}
        >
          Một Ngày Đi Câu
        </h1>
        <p
          className="font-pixel text-[#3d8a8e] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-1"
          style={{ fontSize: 'clamp(8px, 1.5vw, 14px)' }}
        >
          Của Dưa Hấu
        </p>
      </div>

      {/* Action buttons below title */}
      <div className="absolute top-24 left-0 right-0 flex justify-center gap-4 z-10 pointer-events-auto">
        <button
          onClick={() => setShowAddBet(true)}
          className="px-4 py-2 bg-coral hover:bg-coral-dark text-white font-pixel text-xs rounded border-2 border-coral-dark shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          + Thêm hợp đồng
        </button>
        <Link
          href="/history"
          className="px-4 py-2 bg-transparent hover:bg-white/10 text-white font-pixel text-xs rounded border-2 border-white/60 hover:border-white shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          Hợp đồng cũ
        </Link>
      </div>

      {/* Bet cards above rabbit */}
      <div className="absolute bottom-[220px] left-1/2 -translate-x-1/2 z-10 flex flex-col-reverse items-center gap-2 w-full max-w-sm px-4">
        {visibleBets.map((bet, i) => (
          <BetCard
            key={bet.id}
            bet={bet}
            isNew={bet.id === newBetIdRef.current && i === 0}
            isLeaving={leavingIds.has(bet.id)}
            onClick={() => setSelectedBet(bet)}
          />
        ))}
        {hiddenCount > 0 && (
          <div className="font-pixel text-white/60 text-xs">
            +{hiddenCount} kèo khác...
          </div>
        )}
      </div>

      {/* Rabbit */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <RabbitCanvas
          state={rabbitState}
          onBiteComplete={() => setRabbitState(bets.length > 0 ? 'idle' : 'wait')}
        />
      </div>

      {/* Right sidebar widget */}
      <div className="absolute right-4 bottom-20 z-10">
        <GiftBoxWidget
          fishCount={basketFish.length}
          coinCount={coinCount}
          onCampaignClick={() => setShowCampaign(true)}
        />
      </div>

      {/* No campaign notice */}
      {!campaign && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
          <button
            onClick={() => setShowCampaign(true)}
            className="font-pixel text-yellow-300 text-xs bg-black/50 px-4 py-2 rounded border border-yellow-300/50 hover:bg-black/70 transition-colors animate-pulse"
          >
            ⚠️ Chưa có chiến dịch → Tạo ngay!
          </button>
        </div>
      )}

      {/* Modals */}
      {showAddBet && (
        <AddBetModal
          onClose={() => setShowAddBet(false)}
          onSuccess={handleBetSuccess}
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
