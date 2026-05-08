'use client'
import { useState } from 'react'

interface Props {
  onClose: () => void
  onSave:  () => Promise<void>
}

export function AddGroomsmanModal({ onClose, onSave }: Props) {
  const [form, setForm] = useState({ name: '', phone: '', amount_owed: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  function set(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/groomsmen', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        form.name,
          phone:       form.phone,
          amount_owed: Number(form.amount_owed.replace(/,/g, '')),
          notes:       form.notes,
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      await onSave()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(14,32,53,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold text-navy-800">Add Groomsman</h2>
          <button onClick={onClose} className="text-navy-300 hover:text-navy-600 text-xl transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" placeholder="Kunle Adeyemi"
              value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input className="input" placeholder="+234 801 234 5678"
              value={form.phone} onChange={e => set('phone', e.target.value)} required />
          </div>
          <div>
            <label className="label">Amount Owed (₦)</label>
            <input className="input" type="number" placeholder="45000"
              value={form.amount_owed} onChange={e => set('amount_owed', e.target.value)} required min={0} />
          </div>
          <div>
            <label className="label">Notes (measurements, size, etc.)</label>
            <textarea className="input resize-none" rows={3} placeholder="Slim fit, waist 32, height 5&apos;11&quot;"
              value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving…' : 'Add Groomsman'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
