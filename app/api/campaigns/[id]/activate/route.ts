import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Campaign, { ICampaign } from '@/models/Campaign'

function shape(c: ICampaign & { _id: unknown }) {
  return {
    id:            String(c._id),
    _id:           String(c._id),
    name:          c.name,
    initial_coins: c.initialCoins,
    current_coins: c.currentCoins,
    total_win:     c.totalWin,
    total_lose:    c.totalLose,
    is_active:     c.isActive,
    created_at:    c.createdAt,
  }
}

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    await Campaign.updateMany({}, { isActive: false })
    const campaign = await Campaign.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).lean<ICampaign>()

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    return NextResponse.json(shape(campaign))
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to activate campaign' }, { status: 500 })
  }
}
