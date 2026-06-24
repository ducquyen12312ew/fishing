import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Bet from '@/models/Bet'
import Campaign from '@/models/Campaign'
import CoinHistory from '@/models/CoinHistory'

export async function POST() {
  try {
    await connectDB()
    await Promise.all([
      Bet.deleteMany({}),
      Campaign.deleteMany({}),
      CoinHistory.deleteMany({}),
    ])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/reset]', err)
    return NextResponse.json({ error: 'Reset failed', detail: String(err) }, { status: 500 })
  }
}
