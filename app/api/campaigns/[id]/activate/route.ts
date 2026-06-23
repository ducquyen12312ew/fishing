import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Campaign from '@/models/Campaign'

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    // Deactivate all, then activate the target
    await Campaign.updateMany({}, { isActive: false })
    const campaign = await Campaign.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).lean()

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    return NextResponse.json(campaign)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to activate campaign' }, { status: 500 })
  }
}
