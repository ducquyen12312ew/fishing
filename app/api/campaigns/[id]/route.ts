import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Campaign from '@/models/Campaign'
import Bet from '@/models/Bet'
import CoinHistory from '@/models/CoinHistory'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { current_coins } = await request.json() as { current_coins: number }

    if (typeof current_coins !== 'number' || isNaN(current_coins)) {
      return NextResponse.json({ error: 'Invalid balance value' }, { status: 400 })
    }

    await connectDB()

    const campaign = await Campaign.findById(id)
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    const diff = current_coins - campaign.currentCoins

    await Campaign.findByIdAndUpdate(id, { $set: { currentCoins: current_coins } })

    await CoinHistory.create({
      campaignId: id,
      type:       'adjustment',
      amount:     Math.abs(diff),
      note:       `Manual balance edit: ${campaign.currentCoins} → ${current_coins}`,
    })

    return NextResponse.json({ success: true, current_coins })
  } catch (err) {
    console.error('[PATCH /api/campaigns/[id]]', err)
    return NextResponse.json(
      { error: 'Failed to update balance', detail: String(err) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    const campaign = await Campaign.findById(id)
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    await Bet.deleteMany({ campaignId: id })
    await CoinHistory.deleteMany({ campaignId: id })
    await Campaign.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/campaigns/[id]]', err)
    return NextResponse.json(
      { error: 'Failed to delete campaign', detail: String(err) },
      { status: 500 }
    )
  }
}
