import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redis, KEYS } from '@/lib/redis'
import { v4 as uuid } from 'uuid'
import type { Groomsman } from '@/types'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ids = await redis.lrange<string>(KEYS.groomsmanList, 0, -1)
  if (!ids.length) return NextResponse.json([])

  const pipeline = redis.pipeline()
  ids.forEach(id => pipeline.get(KEYS.groomsman(id)))
  const results = await pipeline.exec()
  const groomsmen = (results as (Groomsman | null)[]).filter(Boolean)

  return NextResponse.json(groomsmen)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, phone, amount_owed, notes } = body

  if (!name || !phone || amount_owed === undefined) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const id  = uuid()

  const groomsman: Groomsman = {
    id,
    name:             name.trim(),
    phone:            phone.trim(),
    amount_owed:      Number(amount_owed),
    amount_paid:      0,
    payment_status:   'Unpaid',
    tailoring_status: 'Awaiting Measurements',
    notes:            notes?.trim() ?? '',
    created_at:       now,
    updated_at:       now,
  }

  await redis.set(KEYS.groomsman(id), groomsman)
  await redis.lpush(KEYS.groomsmanList, id)

  return NextResponse.json(groomsman, { status: 201 })
}
