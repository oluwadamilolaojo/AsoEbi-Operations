import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redis, KEYS } from '@/lib/redis'
import type { Groomsman } from '@/types'

interface Params { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await redis.get<Groomsman>(KEYS.groomsman(params.id))
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updates = await req.json()

  // Auto-derive payment status from amounts
  const amount_paid  = updates.amount_paid  ?? existing.amount_paid
  const amount_owed  = updates.amount_owed  ?? existing.amount_owed
  const payment_status =
    amount_paid === 0             ? 'Unpaid'  :
    amount_paid >= amount_owed    ? 'Paid'    : 'Partial'

  const updated: Groomsman = {
    ...existing,
    ...updates,
    amount_paid,
    amount_owed,
    payment_status,
    updated_at: new Date().toISOString(),
  }

  await redis.set(KEYS.groomsman(params.id), updated)
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await redis.del(KEYS.groomsman(params.id))
  await redis.lrem(KEYS.groomsmanList, 0, params.id)

  return NextResponse.json({ success: true })
}
