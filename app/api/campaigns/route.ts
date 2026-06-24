import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Campaign from '@/models/Campaign'
import CoinHistory from '@/models/CoinHistory'
import Bet from '@/models/Bet'

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

    const ids = rows.map((c) => c._id)
    const betStats = await Bet.aggregate([
      { $match: { campaignId: { $in: ids }, status: { $in: ['won', 'lost', 'pending'] } } },
      { $group: { _id: { campaignId: '$campaignId', status: '$status' }, n: { $sum: 1 } } },
    ])

    type StatKey = `${string}:${'won' | 'lost' | 'pending'}`
    const statMap = new Map<StatKey, number>()
    for (const s of betStats) {
      statMap.set(`${String(s._id.campaignId)}:${s._id.status}` as StatKey, s.n)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shaped = rows.map((c: any) => {
      const cid = String(c._id)
      return {
        ...shape(c),
        won_count:     statMap.get(`${cid}:won`)     ?? 0,
        lost_count:    statMap.get(`${cid}:lost`)    ?? 0,
        pending_count: statMap.get(`${cid}:pending`) ?? 0,
      }
    })

    return NextResponse.json(shaped, {
      headers: { 'Cache-Control': 'no-store' },
    })
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

    // Delete all bets from the currently active campaign before starting fresh
    const prevActive = await Campaign.findOne({ isActive: true }).lean()
    if (prevActive) {
      await Bet.deleteMany({ campaignId: prevActive._id })
    }

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
