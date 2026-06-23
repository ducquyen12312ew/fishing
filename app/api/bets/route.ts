import { NextResponse } from 'next/server'
import { sql, getFishImage } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let rows
    if (status === 'pending') {
      ;({ rows } = await sql`
        SELECT b.*, c.name as campaign_name
        FROM bets b
        JOIN campaigns c ON b.campaign_id = c.id
        WHERE b.status = 'pending'
        ORDER BY b.created_at DESC
      `)
    } else if (status === 'resolved') {
      ;({ rows } = await sql`
        SELECT b.*, c.name as campaign_name
        FROM bets b
        JOIN campaigns c ON b.campaign_id = c.id
        WHERE b.status IN ('won', 'lost')
        ORDER BY b.resolved_at DESC
      `)
    } else {
      ;({ rows } = await sql`
        SELECT b.*, c.name as campaign_name
        FROM bets b
        JOIN campaigns c ON b.campaign_id = c.id
        ORDER BY b.created_at DESC
      `)
    }

    return NextResponse.json(rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch bets' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { sport_emoji, name, amount, odds } = await request.json()
    if (!sport_emoji || !name || !amount || !odds) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Get active campaign
    const { rows: campaigns } = await sql`
      SELECT * FROM campaigns WHERE is_active = true LIMIT 1
    `
    if (campaigns.length === 0) {
      return NextResponse.json({ error: 'No active campaign' }, { status: 400 })
    }
    const campaign = campaigns[0]

    if (campaign.current_coins < amount) {
      return NextResponse.json({ error: 'Không đủ xu' }, { status: 400 })
    }

    const fish_image = getFishImage(amount)

    const { rows } = await sql`
      INSERT INTO bets (campaign_id, sport_emoji, name, amount, odds, fish_image, status)
      VALUES (${campaign.id}, ${sport_emoji}, ${name}, ${amount}, ${odds}, ${fish_image}, 'pending')
      RETURNING *
    `

    // Deduct coins
    await sql`
      UPDATE campaigns
      SET current_coins = current_coins - ${amount},
          total_lose = total_lose + ${amount}
      WHERE id = ${campaign.id}
    `

    await sql`
      INSERT INTO coin_history (campaign_id, type, amount, note)
      VALUES (${campaign.id}, 'lose', ${amount}, ${`Mua mồi: ${name}`})
    `

    return NextResponse.json(rows[0], { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create bet' }, { status: 500 })
  }
}
