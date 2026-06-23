import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Campaign from '@/models/Campaign'
import Bet from '@/models/Bet'
import CoinHistory from '@/models/CoinHistory'
import { getFishImage } from '@/lib/db'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shapeBet(b: any) {
  const campaignName =
    b.campaignId && typeof b.campaignId === 'object' && 'name' in b.campaignId
      ? (b.campaignId as { name: string }).name
      : ''

  return {
    id:            String(b._id),
    _id:           String(b._id),
    campaign_id:   String(b.campaignId?._id ?? b.campaignId),
    campaign_name: campaignName,
    sport_emoji:   b.sportEmoji  as string,
    name:          b.name        as string,
    amount:        b.amount      as number,
    odds:          b.odds        as number,
    fish_image:    b.fishImage   as string,
    status:        b.status      as string,
    created_at:    b.createdAt,
    resolved_at:   b.resolvedAt ?? null,
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    await connectDB()

    let filter: Record<string, unknown> = {}
    if (status === 'pending')  filter = { status: 'pending' }
    if (status === 'resolved') filter = { status: { $in: ['won', 'lost', 'refunded'] } }

    const bets = await Bet.find(filter)
      .populate('campaignId', 'name')
      .sort(status === 'resolved' ? { resolvedAt: -1 } : { createdAt: -1 })
      .lean()

    return NextResponse.json(bets.map(shapeBet))
  } catch (err) {
    console.error('[GET /api/bets]', err)
    return NextResponse.json(
      { error: 'Failed to fetch bets', detail: String(err) },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, amount, odds } = body

    if (!name || !amount || !odds) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await connectDB()

    const campaign = await Campaign.findOne({ isActive: true }).lean()
    if (!campaign) {
      return NextResponse.json({ error: 'No active campaign' }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const camp = campaign as any

    const fishImage = getFishImage(Number(amount))

    // Check available coins = current minus all pending bets already running
    const pendingBets = await Bet.find({ campaignId: camp._id, status: 'pending' }).lean()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pendingTotal = pendingBets.reduce((sum: number, b: any) => sum + b.amount, 0)
    if (camp.currentCoins - pendingTotal < Number(amount)) {
      return NextResponse.json({ error: 'Not enough coins' }, { status: 400 })
    }

    const bet = await Bet.create({
      campaignId: camp._id,
      name,
      amount:     Number(amount),
      odds:       Number(odds),
      fishImage,
    })

    // Coins are NOT deducted on placement — only when the bet is resolved as lost

    const saved = await Bet.findById(bet._id).lean()
    return NextResponse.json(shapeBet(saved), { status: 201 })
  } catch (err) {
    console.error('[POST /api/bets]', err)
    return NextResponse.json(
      { error: 'Failed to create bet', detail: String(err) },
      { status: 500 }
    )
  }
}
