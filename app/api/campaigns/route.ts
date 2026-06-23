import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Campaign from '@/models/Campaign'
import CoinHistory from '@/models/CoinHistory'

// lean() returns plain objects — use 'any' to avoid Mongoose generic type issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shape(c: any) {
  return {
    id:            String(c._id),
    _id:           String(c._id),
    name:          c.name          as string,
    initial_coins: c.initialCoins  as number,
    current_coins: c.currentCoins  as number,
    total_win:     (c.totalWin     ?? 0) as number,
    total_lose:    (c.totalLose    ?? 0) as number,
    is_active:     (c.isActive     ?? false) as boolean,
    created_at:    c.createdAt,
  }
}

export async function GET() {
  try {
    await connectDB()
    const rows = await Campaign.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json(rows.map(shape))
  } catch (err) {
    console.error('[GET /api/campaigns]', err)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns', detail: String(err) },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body          = await request.json()
    const name          = body.name
    const initial_coins = body.initial_coins ?? body.initialCoins

    if (!name || !initial_coins) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await connectDB()

    const campaign = await Campaign.create({
      name,
      initialCoins: Number(initial_coins),
      currentCoins: Number(initial_coins),
    })

    await CoinHistory.create({
      campaignId: campaign._id,
      type:       'deposit',
      amount:     Number(initial_coins),
      note:       'Initial deposit',
    })

    const saved = await Campaign.findById(campaign._id).lean()
    return NextResponse.json(shape(saved), { status: 201 })
  } catch (err) {
    console.error('[POST /api/campaigns]', err)
    return NextResponse.json(
      { error: 'Failed to create campaign', detail: String(err) },
      { status: 500 }
    )
  }
}
