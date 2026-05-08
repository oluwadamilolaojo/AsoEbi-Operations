import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { redis, KEYS } from '@/lib/redis'
import type { Groomsman } from '@/types'
import { Dashboard } from '@/components/Dashboard'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  // Load all groomsmen
  const ids = await redis.lrange<string>(KEYS.groomsmanList, 0, -1)

  let groomsmen: Groomsman[] = []
  if (ids.length > 0) {
    const pipeline = redis.pipeline()
    ids.forEach(id => pipeline.get(KEYS.groomsman(id)))
    const results = await pipeline.exec()
    groomsmen = (results as (Groomsman | null)[])
      .filter(Boolean)
      .map(g => g as Groomsman)
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  return <Dashboard groomsmen={groomsmen} adminName={session.user?.name ?? 'Admin'} />
}
