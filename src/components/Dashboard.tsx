'use client'
import { useState, useCallback } from 'react'
import { signOut } from 'next-auth/react'
import type { Groomsman } from '@/types'
import { TAILORING_STEPS, TAILORING_COLORS, PAYMENT_COLORS } from '@/types'
import { AddGroomsmanModal } from './AddGroomsmanModal'
import { EditGroomsmanModal } from './EditGroomsmanModal'
import { StatsBar } from './StatsBar'
import { TailoringProgress } from './TailoringProgress'

interface Props {
  groomsmen: Groomsman[]
  adminName: string
}

export function Dashboard({ groomsmen: initial, adminName }: Props) {
  const [groomsmen, setGroomsmen] = useState<Groomsman[]>(initial)
  const [showAdd,   setShowAdd]   = useState(false)
  const [editing,   setEditing]   = useState<Groomsman | null>(null)
  const [filter,    setFilter]    = useState<'all' | 'unpaid' | 'not-in-abuja'>('all')

  const refresh = useCallback(async () => {
    const res  = await fetch('/api/groomsmen')
    const data = await res.json()
    setGroomsmen(data.sort((a: Groomsman, b: Groomsman) => a.name.localeCompare(b.name)))
  }, [])

  const filtered = groomsmen.filter(g => {
    if (filter === 'unpaid')       return g.payment_status !== 'Paid'
    if (filter === 'not-in-abuja') return g.tailoring_status !== 'In Abuja ✓'
    return true
  })

  const totalOwed  = groomsmen.reduce((s, g) => s + g.amount_owed, 0)
  const totalPaid  = groomsmen.reduce((s, g) => s + g.amount_paid, 0)
  const inAbuja    = groomsmen.filter(g => g.tailoring_status === 'In Abuja ✓').length
  const allPaid    = groomsmen.filter(g => g.payment_status === 'Paid').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-gold-50">

      {/* ── Header ── */}
      <header className="bg-navy-700 shadow-luxury-lg sticky top-0 z-40"
              style={{ backgroundImage: 'linear-gradient(135deg, #1A3C5E 0%, #265D8C 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-400/40
                              flex items-center justify-center">
                <span className="text-gold-400 text-sm">♦</span>
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold text-white leading-tight">
                  AsoEbi <span className="text-gold-400">Operations</span>
                </h1>
                <p className="text-navy-200 text-xs font-body">Groomsmen Dashboard · Aug 1, 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-navy-200 text-xs hidden sm:block font-body">
                Signed in as <span className="text-white font-medium">{adminName}</span>
              </span>
              <button
                onClick={() => setShowAdd(true)}
                className="btn-gold text-xs px-4 py-2"
              >
                + Add Groomsman
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-navy-200 hover:text-white text-xs transition-colors font-body"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Stats ── */}
        <StatsBar
          total={groomsmen.length}
          allPaid={allPaid}
          totalOwed={totalOwed}
          totalPaid={totalPaid}
          inAbuja={inAbuja}
        />

        {/* ── Tailoring Pipeline ── */}
        <div className="card p-6">
          <h2 className="font-display text-xl font-semibold text-navy-800 mb-4">
            Tailoring Pipeline
          </h2>
          <TailoringProgress groomsmen={groomsmen} />
        </div>

        {/* ── Table section ── */}
        <div className="card overflow-hidden">
          {/* Table header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between
                          gap-3 px-6 py-4 border-b border-navy-100">
            <h2 className="font-display text-xl font-semibold text-navy-800">
              Groomsmen ({filtered.length})
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              {(['all','unpaid','not-in-abuja'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    filter === f
                      ? 'bg-navy-700 text-white'
                      : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'unpaid' ? 'Unpaid' : 'Not in Abuja'}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-navy-300 font-body">
              <div className="text-4xl mb-3">♦</div>
              <p className="text-sm">
                {groomsmen.length === 0 ? 'No groomsmen added yet.' : 'No results for this filter.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="bg-navy-50 border-b border-navy-100">
                    {['Name','Phone','Amount Owed','Amount Paid','Payment','Tailoring Status','Receipt','Notes','Actions']
                      .map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold
                                               text-navy-500 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50">
                  {filtered.map(g => (
                    <tr key={g.id} className="table-row-hover transition-colors">
                      <td className="px-4 py-3 font-semibold text-navy-800 whitespace-nowrap">
                        {g.name}
                      </td>
                      <td className="px-4 py-3 text-navy-500 whitespace-nowrap">{g.phone}</td>
                      <td className="px-4 py-3 text-navy-700 whitespace-nowrap font-mono text-xs">
                        ₦{g.amount_owed.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-navy-700 whitespace-nowrap font-mono text-xs">
                        ₦{g.amount_paid.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`badge ${PAYMENT_COLORS[g.payment_status]}`}>
                          {g.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`badge ${TAILORING_COLORS[g.tailoring_status]}`}>
                          {g.tailoring_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {g.receipt_url ? (
                          <a
                            href={g.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold-600 hover:text-gold-700 font-medium text-xs
                                       underline underline-offset-2"
                          >
                            View PDF
                          </a>
                        ) : (
                          <span className="text-navy-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-navy-500 text-xs max-w-[160px] truncate">
                        {g.notes || '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => setEditing(g)}
                          className="text-navy-600 hover:text-navy-800 font-medium text-xs
                                     underline underline-offset-2 transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-navy-300 text-xs font-body pb-4">
          AsoEbi Operations · Private Admin Dashboard
        </p>
      </main>

      {/* Modals */}
      {showAdd && (
        <AddGroomsmanModal
          onClose={() => setShowAdd(false)}
          onSave={async () => { await refresh(); setShowAdd(false) }}
        />
      )}
      {editing && (
        <EditGroomsmanModal
          groomsman={editing}
          onClose={() => setEditing(null)}
          onSave={async () => { await refresh(); setEditing(null) }}
        />
      )}
    </div>
  )
}
