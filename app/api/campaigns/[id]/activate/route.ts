import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await sql`UPDATE campaigns SET is_active = false`
    const { rows } = await sql`
      UPDATE campaigns SET is_active = true
      WHERE id = ${id}
      RETURNING *
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to activate campaign' }, { status: 500 })
  }
}
