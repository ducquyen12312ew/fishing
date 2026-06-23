import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Campaign from '@/models/Campaign'
import Bet from '@/models/Bet'
import CoinHistory from '@/models/CoinHistory'

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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ids, name } = body as { ids: string[]; name: string }

    if (!Array.isArray(ids) || ids.length < 2) {
      return NextResponse.json({ error: 'Need at least 2 campaign ids' }, { status: 400 })
    }
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Merged campaign name is required' }, { status: 400 })
    }

    await connectDB()

    const campaigns = await Campaign.find({ _id: { $in: ids } }).lean()
    if (campaigns.length !== ids.length) {
      return NextResponse.json({ error: 'One or more campaigns not found' }, { status: 404 })
    }

    const wasActive  = campaigns.some((c) => c.isActive)
    const totalInit  = campaigns.reduce((s, c) => s + c.initialCoins, 0)
    const totalCurr  = campaigns.reduce((s, c) => s + c.currentCoins, 0)
    const totalWin   = campaigns.reduce((s, c) => s + (c.totalWin  ?? 0), 0)
    const totalLose  = campaigns.reduce((s, c) => s + (c.totalLose ?? 0), 0)

    // Deactivate everything first if merging active campaign
    if (wasActive) await Campaign.updateMany({}, { isActive: false })

    const merged = await Campaign.create({
      name:         name.trim(),
      initialCoins: totalInit,
      currentCoins: totalCurr,
      totalWin,
      totalLose,
      isActive:     wasActive,
    })

    // Reassign bets and coin history
    await Bet.updateMany(
      { campaignId: { $in: ids } },
      { $set: { campaignId: merged._id } }
    )
    await CoinHistory.updateMany(
      { campaignId: { $in: ids } },
      { $set: { campaignId: merged._id } }
    )

    // Delete old campaigns
    await Campaign.deleteMany({ _id: { $in: ids } })

    const saved = await Campaign.findById(merged._id).lean()
    return NextResponse.json(shape(saved), { status: 201 })
  } catch (err) {
    console.error('[POST /api/campaigns/merge]', err)
    return NextResponse.json(
      { error: 'Failed to merge campaigns', detail: String(err) },
      { status: 500 }
    )
  }
}
