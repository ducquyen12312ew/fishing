import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Campaign from '@/models/Campaign'
import Bet from '@/models/Bet'
import CoinHistory from '@/models/CoinHistory'

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
