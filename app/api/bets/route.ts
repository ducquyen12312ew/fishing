import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Campaign from '@/models/Campaign'
import Bet from '@/models/Bet'
import CoinHistory from '@/models/CoinHistory'
import { getFishImage } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    await connectDB()

    let query: Record<string, unknown> = {}
    if (status === 'pending') {
      query = { status: 'pending' }
    } else if (status === 'resolved') {
      query = { status: { $in: ['won', 'lost'] } }
    }

    const bets = await Bet.find(query)
      .populate('campaignId', 'name')
      .sort(status === 'resolved' ? { resolvedAt: -1 } : { createdAt: -1 })
      .lean()

    // Flatten campaignId → campaign_name for frontend compatibility
    const shaped = bets.map((b) => ({
      ...b,
      id: b._id,
      campaign_name:
        b.campaignId && typeof b.campaignId === 'object' && 'name' in b.campaignId
          ? (b.campaignId as { name: string }).name
          : '',
      sport_emoji: b.sportEmoji,
      fish_image: b.fishImage,
    }))

    return NextResponse.json(shaped)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch bets' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { sport_emoji, name, amount, odds } = await request.json()
    if (!sport_emoji || !name || !amount || !odds) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await connectDB()

    const campaign = await Campaign.findOne({ isActive: true })
    if (!campaign) {
      return NextResponse.json({ error: 'No active campaign' }, { status: 400 })
    }
    if (campaign.currentCoins < amount) {
      return NextResponse.json({ error: 'Not enough coins' }, { status: 400 })
    }

    const fishImage = getFishImage(amount)

    const bet = await Bet.create({
      campaignId: campaign._id,
      sportEmoji: sport_emoji,
      name,
      amount,
      odds,
      fishImage,
    })

    await Campaign.findByIdAndUpdate(campaign._id, {
      $inc: { currentCoins: -amount, totalLose: amount },
    })

    await CoinHistory.create({
      campaignId: campaign._id,
      type: 'lose',
      amount,
      note: `Bait: ${name}`,
    })

    // Return shaped for frontend
    return NextResponse.json(
      {
        ...bet.toObject(),
        id: bet._id,
        sport_emoji: bet.sportEmoji,
        fish_image: bet.fishImage,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create bet' }, { status: 500 })
  }
}
