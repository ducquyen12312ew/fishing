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
      return NextResponse.json(
        { error: 'Bet not found or already resolved' },
        { status: 404 }
      )
    }

    bet.status     = result
    bet.resolvedAt = new Date()
    await bet.save()

    if (result === 'won') {
      // Only the PROFIT is credited back — stake was already deducted when placing
      const profit = Math.round(bet.amount * (bet.odds - 1))

      await Campaign.findByIdAndUpdate(bet.campaignId, {
        $inc: {
          currentCoins: profit,      // add only profit
          totalWin:     profit,
          totalLose:    -bet.amount, // reverse the deduction counted at placement
        },
      })

      await CoinHistory.create({
        campaignId: bet.campaignId,
        type:       'win',
        amount:     profit,
        note:       `Won: ${bet.name}`,
      })
    }
    // On 'lost': nothing to do — currentCoins & totalLose already updated when the bet was placed

    return NextResponse.json({
      id:          String(bet._id),
      sport_emoji: bet.sportEmoji,
      fish_image:  bet.fishImage,
      status:      bet.status,
      amount:      bet.amount,
      odds:        bet.odds,
    })
  } catch (err) {
    console.error('[PATCH /api/bets/resolve]', err)
    return NextResponse.json(
      { error: 'Failed to resolve bet', detail: String(err) },
      { status: 500 }
    )
  }
}
