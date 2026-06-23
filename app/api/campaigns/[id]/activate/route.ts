import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Campaign from '@/models/Campaign'

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
    ).lean()

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    return NextResponse.json(shape(campaign))
  } catch (err) {
    console.error('[PATCH /api/campaigns/activate]', err)
    return NextResponse.json(
      { error: 'Failed to activate campaign', detail: String(err) },
      { status: 500 }
    )
  }
}
