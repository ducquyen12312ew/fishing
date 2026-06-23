import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Bet from '@/models/Bet'
import Campaign from '@/models/Campaign'
import CoinHistory from '@/models/CoinHistory'

type Result = 'won' | 'lost' | 'refunded'

function coinDelta(status: Result, amount: number, odds: number): { currentCoins: number; totalWin: number; totalLose: number } {
  const profit = Math.round(amount * (odds - 1))
  if (status === 'won')      return { currentCoins:  amount + profit, totalWin:  profit, totalLose: 0 }
  if (status === 'lost')     return { currentCoins: -amount,          totalWin:  0,      totalLose: amount }
  /* refunded */             return { currentCoins:  amount,          totalWin:  0,      totalLose: 0 }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id }     = await params
    const { result } = await request.json() as { result: Result }

    if (!['won', 'lost', 'refunded'].includes(result)) {
      return NextResponse.json({ error: 'Invalid result' }, { status: 400 })
    }

    await connectDB()

    const bet = await Bet.findOne({ _id: id, status: { $in: ['won', 'lost', 'refunded'] } })
    if (!bet) {
      return NextResponse.json(
        { error: 'Bet not found or is still pending' },
        { status: 404 }
      )
    }

    if (bet.status === result) {
      return NextResponse.json({ message: 'No change needed' })
    }

    // Reverse the previous effect
    const prev    = coinDelta(bet.status as Result, bet.amount, bet.odds)
    const next    = coinDelta(result, bet.amount, bet.odds)
    const dCoins  = next.currentCoins - prev.currentCoins
    const dWin    = next.totalWin     - prev.totalWin
    const dLose   = next.totalLose    - prev.totalLose

    await Campaign.findByIdAndUpdate(bet.campaignId, {
      $inc: {
        currentCoins: dCoins,
        totalWin:     dWin,
        totalLose:    dLose,
      },
    })

    await CoinHistory.create({
      campaignId: bet.campaignId,
      type:       'adjustment',
      amount:     Math.abs(dCoins),
      note:       `Edit result: ${bet.name} (${bet.status} → ${result})`,
    })

    bet.status     = result
    bet.resolvedAt = new Date()
    await bet.save()

    return NextResponse.json({
      id:     String(bet._id),
      status: bet.status,
    })
  } catch (err) {
    console.error('[PATCH /api/bets/reresolve]', err)
    return NextResponse.json(
      { error: 'Failed to re-resolve bet', detail: String(err) },
      { status: 500 }
    )
  }
}
