'use client'
import { useState } from 'react'
import type { Groomsman, TailoringStatus } from '@/types'
import { TAILORING_STEPS } from '@/types'
import { useUploadThing } from '@/lib/uploadthing-client'

interface Props {
  groomsman: Groomsman
  onClose:   () => void
  onSave:    () => Promise<void>
}

export function EditGroomsmanModal({ groomsman, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    name:             groomsman.name,
    phone:            groomsman.phone,
    amount_owed:      groomsman.amount_owed.toString(),
    amount_paid:      groomsman.amount_paid.toString(),
    tailoring_status: groomsman.tailoring_status,
    notes:            groomsman.notes ?? '',
  })
  const [loading,    setLoading]    = useState(false)
  const [uploading,  setUploading]  = useState(false)
  const [error,      setError]      = useState('')
  const [deleteConf, setDeleteConf] = useState(false)
  const [file,       setFile]       = useState<File | null>(null)
  const [receiptUrl, setReceiptUrl] = useState(groomsman.receipt_url ?? '')
  const [receiptName, setReceiptName] = useState(groomsman.receipt_filename ?? '')

  const { startUpload } = useUploadThing('receiptUploader')

  function set(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const res = await startUpload([file])
      if (res?.[0]) {
        setReceiptUrl(res[0].url)
        setReceiptName(res[0].name)
      }
    } catch {
      setError('Upload failed. Max 10MB, PDF or image only.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const body: Record<string, unknown> = {
        name:             form.name,
        phone:            form.phone,
        amount_owed:      Number(form.amount_owed),
        amount_paid:      Number(form.amount_paid),
        tailoring_status: form.tailoring_status as TailoringStatus,
        notes:            form.notes,
      }
      if (receiptUrl) {
        body.receipt_url      = receiptUrl
        body.receipt_filename = receiptName
      }
      const res = await fetch(`/api/groomsmen/${groomsman.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      await onSave()
    } catch {
      setError('Failed to save. Please try again.')
      setLoading(false)
    }
  }

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/groomsmen/${groomsman.id}`, { method: 'DELETE' })
    await onSave()
  }

  const tailoringIdx = TAILORING_STEPS.indexOf(form.tailoring_status as TailoringStatus)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
         style={{ background: 'rgba(14,32,53,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card w-full max-w-lg p-8 my-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold text-navy-800">
            Edit — {groomsman.name}
          </h2>
          <button onClick={onClose} className="text-navy-300 hover:text-navy-600 text-xl transition-colors">✕</button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">

          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={form.name}
                onChange={e => set('name', e.target.value)} required />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone}
                onChange={e => set('phone', e.target.value)} required />
            </div>
          </div>

          {/* Payment */}
          <div className="bg-navy-50 rounded-xl p-4 space-y-3">
            <h3 className="font-body font-semibold text-navy-700 text-sm">Payment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Amount Owed (₦)</label>
                <input className="input" type="number" min={0} value={form.amount_owed}
                  onChange={e => set('amount_owed', e.target.value)} required />
              </div>
              <div>
                <label className="label">Amount Paid (₦)</label>
                <input className="input" type="number" min={0} value={form.amount_paid}
                  onChange={e => set('amount_paid', e.target.value)} required />
              </div>
            </div>
            {/* Outstanding display */}
            <p className="text-xs font-body text-navy-500">
              Outstanding:{' '}
              <span className={`font-semibold ${
                Number(form.amount_owed) - Number(form.amount_paid) > 0
                  ? 'text-red-600' : 'text-emerald-600'
              }`}>
                ₦{Math.max(0, Number(form.amount_owed) - Number(form.amount_paid)).toLocaleString()}
              </span>
            </p>
          </div>

          {/* Tailoring status */}
          <div className="bg-gold-50 rounded-xl p-4 space-y-3">
            <h3 className="font-body font-semibold text-navy-700 text-sm">Tailoring Status</h3>

            {/* Progress dots */}
            <div className="flex items-center gap-1 flex-wrap">
              {TAILORING_STEPS.map((step, i) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => set('tailoring_status', step)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
                    form.tailoring_status === step
                      ? 'bg-navy-700 text-white font-semibold'
                      : i <= tailoringIdx
                        ? 'bg-navy-200 text-navy-700'
                        : 'bg-white text-navy-300 border border-navy-100'
                  }`}
                >
                  <span>{i + 1}</span>
                  <span className="hidden sm:inline">{step}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-navy-500 font-body">
              Current: <span className="font-semibold text-navy-700">{form.tailoring_status}</span>
            </p>
          </div>

          {/* Receipt upload */}
          <div className="space-y-2">
            <label className="label">Receipt / Proof of Payment</label>
            {receiptUrl && (
              <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2">
                <span className="text-emerald-600 text-xs">✓</span>
                <a href={receiptUrl} target="_blank" rel="noopener noreferrer"
                   className="text-xs text-emerald-700 underline underline-offset-2 font-medium">
                  {receiptName || 'View uploaded receipt'}
                </a>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="file"
                accept=".pdf,image/*"
                className="input text-xs flex-1"
                onChange={e => setFile(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={handleUpload}
                disabled={!file || uploading}
                className="btn-ghost text-xs px-4 whitespace-nowrap"
              >
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
            </div>
            <p className="text-xs text-navy-400 font-body">PDF or image, max 10MB</p>
          </div>

          {/* Notes */}
          <div>
            <label className="label">Notes</label>
            <textarea className="input resize-none" rows={2} value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Measurements, special instructions…" />
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>

          {/* Delete */}
          <div className="pt-2 border-t border-navy-100">
            {!deleteConf ? (
              <button
                type="button"
                onClick={() => setDeleteConf(true)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors font-body"
              >
                Remove groomsman
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs text-red-600 font-body">Are you sure?</span>
                <button type="button" onClick={handleDelete}
                  className="text-xs text-red-600 font-semibold hover:text-red-800">
                  Yes, remove
                </button>
                <button type="button" onClick={() => setDeleteConf(false)}
                  className="text-xs text-navy-400 hover:text-navy-600">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
