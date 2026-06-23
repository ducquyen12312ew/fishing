import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'

export async function GET() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    return NextResponse.json(
      { status: 'error', reason: 'MONGODB_URI env var is missing' },
      { status: 500 }
    )
  }

  try {
    await connectDB()
    return NextResponse.json({
      status: 'ok',
      db: 'connected',
      uri_prefix: uri.slice(0, 30) + '…',
    })
  } catch (err) {
    return NextResponse.json(
      { status: 'error', reason: String(err) },
      { status: 500 }
    )
  }
}
