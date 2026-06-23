import { sql } from '@vercel/postgres'

export { sql }

export interface Campaign {
  id: number
  name: string
  initial_coins: number
  current_coins: number
  total_win: number
  total_lose: number
  is_active: boolean
  created_at: string
}

export interface Bet {
  id: number
  campaign_id: number
  sport_emoji: string
  name: string
  amount: number
  odds: number
  fish_image: string
  status: 'pending' | 'won' | 'lost'
  created_at: string
  resolved_at: string | null
}

export interface CoinHistory {
  id: number
  campaign_id: number
  type: 'deposit' | 'win' | 'lose'
  amount: number
  note: string | null
  created_at: string
}

export function getFishImage(amount: number): string {
  if (amount <= 50) return 'fish1.png'
  if (amount <= 70) return 'fish2.png'
  if (amount <= 100) return Math.random() < 0.5 ? 'fish3.png' : 'fish4.png'
  if (amount <= 120) return 'fish5.png'
  if (amount <= 150) return 'fish6.png'
  if (amount <= 175) return 'fish7.png'
  return 'fish8.png'
}
