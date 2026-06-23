import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Bet from '@/models/Bet'
import Campaign from '@/models/Campaign'
import CoinHistory from '@/models/CoinHistory'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { result } = await request.json()

    if (!['won', 'lost'].includes(result)) {
      return NextResponse.json({ error: 'Invalid result' }, { status: 400 })
    }

    await connectDB()

    const bet = await Bet.findOne({ _id: id, status: 'pending' })
    if (!bet) {
      return NextResponse.json({ error: 'Bet not found or already resolved' }, { status: 404 })
    }

    bet.status = result
    bet.resolvedAt = new Date()
    await bet.save()

    if (result === 'won') {
      const winAmount = Math.round(bet.amount * bet.odds)

      await Campaign.findByIdAndUpdate(bet.campaignId, {
        $inc: {
          currentCoins: winAmount,
          totalWin: winAmount,
          totalLose: -bet.amount,
        },
      })

      await CoinHistory.create({
        campaignId: bet.campaignId,
        type: 'win',
        amount: winAmount,
        note: `Won: ${bet.name}`,
      })
    }

    return NextResponse.json({
      ...bet.toObject(),
      id: bet._id,
      sport_emoji: bet.sportEmoji,
      fish_image: bet.fishImage,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to resolve bet' }, { status: 500 })
  }
}
