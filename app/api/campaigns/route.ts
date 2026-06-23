import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Campaign, { ICampaign } from '@/models/Campaign'
import CoinHistory from '@/models/CoinHistory'

// Shape to snake_case for frontend compatibility
function shape(c: ICampaign & { _id: unknown }) {
  return {
    id:           String(c._id),
    _id:          String(c._id),
    name:         c.name,
    initial_coins: c.initialCoins,
    current_coins: c.currentCoins,
    total_win:    c.totalWin,
    total_lose:   c.totalLose,
    is_active:    c.isActive,
    created_at:   c.createdAt,
  }
}

export async function GET() {
  try {
    await connectDB()
    const rows = await Campaign.find().sort({ createdAt: -1 }).lean<ICampaign[]>()
    return NextResponse.json(rows.map(shape))
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name         = body.name
    const initial_coins = body.initial_coins ?? body.initialCoins

    if (!name || !initial_coins) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await connectDB()

    const campaign = await Campaign.create({
      name,
      initialCoins: initial_coins,
      currentCoins: initial_coins,
    })

    await CoinHistory.create({
      campaignId: campaign._id,
      type:       'deposit',
      amount:     initial_coins,
      note:       'Initial deposit',
    })

    const saved = await Campaign.findById(campaign._id).lean<ICampaign>()
    return NextResponse.json(shape(saved!), { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}
