import { NextRequest, NextResponse } from 'next/server'
import { redis, KEYS } from '@/lib/redis'
import { v4 as uuid } from 'uuid'
import type { Groomsman } from '@/types'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, phone, amount_paid, notes, receipt_url, receipt_name } = body

  if (!name || !phone || amount_paid === undefined || !receipt_url) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const id  = uuid()

  const groomsman: Groomsman = {
    id,
    name:             name.trim(),
    phone:            phone.trim(),
    amount_owed:      0,           // Admin fills this in later
    amount_paid:      Number(amount_paid),
    payment_status:   'Partial',   // Admin confirms to Paid
    receipt_url,
    receipt_filename: receipt_name ?? '',
    tailoring_status: 'Awaiting Measurements',
    notes:            notes?.trim() ?? '',
    created_at:       now,
    updated_at:       now,
  }

  await redis.set(KEYS.groomsman(id), groomsman)
  await redis.lpush(KEYS.groomsmanList, id)

  return NextResponse.json({ success: true }, { status: 201 })
}
