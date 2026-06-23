import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM campaigns ORDER BY created_at DESC`
    return NextResponse.json(rows)
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

    const { rows } = await sql`
      INSERT INTO campaigns (name, initial_coins, current_coins, is_active)
      VALUES (${name}, ${initial_coins}, ${initial_coins}, false)
      RETURNING *
    `

    await sql`
      INSERT INTO coin_history (campaign_id, type, amount, note)
      VALUES (${rows[0].id}, 'deposit', ${initial_coins}, 'Nạp ban đầu')
    `

    return NextResponse.json(rows[0], { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}
