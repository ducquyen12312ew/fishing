import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { result } = await request.json() // 'won' | 'lost'
    if (!['won', 'lost'].includes(result)) {
      return NextResponse.json({ error: 'Invalid result' }, { status: 400 })
    }

    const { rows: bets } = await sql`
      SELECT * FROM bets WHERE id = ${id} AND status = 'pending'
    `
    if (bets.length === 0) {
      return NextResponse.json({ error: 'Bet not found or already resolved' }, { status: 404 })
    }
    const bet = bets[0]

    const { rows } = await sql`
      UPDATE bets
      SET status = ${result}, resolved_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result === 'won') {
      const winAmount = Math.round(bet.amount * bet.odds)
      // Return stake + profit
      await sql`
        UPDATE campaigns
        SET current_coins = current_coins + ${winAmount},
            total_win = total_win + ${winAmount},
            total_lose = total_lose - ${bet.amount}
        WHERE id = ${bet.campaign_id}
      `
      await sql`
        INSERT INTO coin_history (campaign_id, type, amount, note)
        VALUES (${bet.campaign_id}, 'win', ${winAmount}, ${`Thắng: ${bet.name}`})
      `
    }

    return NextResponse.json(rows[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to resolve bet' }, { status: 500 })
  }
}
