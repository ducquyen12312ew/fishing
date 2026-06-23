import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Campaign from '@/models/Campaign'
import CoinHistory from '@/models/CoinHistory'

export async function GET() {
  try {
    await connectDB()
    const campaigns = await Campaign.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json(campaigns)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, initial_coins } = await request.json()
    if (!name || !initial_coins) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await connectDB()

    const campaign = await Campaign.create({
      name,
      initialCoins: initial_coins,
      currentCoins: initial_coins,
    })

    await CoinHistory.create({
      campaignId: campaign._id,
      type: 'deposit',
      amount: initial_coins,
      note: 'Initial deposit',
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}
