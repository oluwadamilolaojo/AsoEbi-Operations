'use client'
import { useState } from 'react'

export default function SubmitPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    amount_paid: '',
    notes: '',
  })
  const [file,      setFile]      = useState<File | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [receiptUrl,  setReceiptUrl]  = useState('')
  const [receiptName, setReceiptName] = useState('')
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState('')

  function set(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const data = new FormData()
      data.append('file', file)
      const res  = await fetch('/api/submit-upload', { method: 'POST', body: data })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Upload failed')
      setReceiptUrl(json.url)
      setReceiptName(json.name)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed. Max 8MB, PDF or image only.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!receiptUrl) { setError('Please upload your receipt first.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:         form.name,
          phone:        form.phone,
          amount_paid:  Number(form.amount_paid),
          notes:        form.notes,
          receipt_url:  receiptUrl,
          receipt_name: receiptName,
        }),
      })
      if (!res.ok) throw new Error()
      setDone(true)
    } catch {
      setError('Something went wrong. Please try again or contact Damilola.')
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
           style={{ backgroundImage: 'radial-gradient(ellipse at 60% 40%, #265D8C 0%, #1A3C5E 50%, #0E2035 100%)' }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gold-500/20 border-2 border-gold-400/40
                          flex items-center justify-center mx-auto mb-6">
            <span className="text-gold-400 text-4xl">✓</span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-white mb-3">
            You&apos;re submitted!
          </h1>
          <p className="text-navy-200 font-body text-sm max-w-xs mx-auto">
            Damilola will confirm your payment and update your tailoring status.
            Check back with him if you need an update.
          </p>
          <p className="text-gold-400 font-display text-lg mt-8">
            August 1, Abuja 🎉
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ backgroundImage: 'radial-gradient(ellipse at 60% 40%, #265D8C 0%, #1A3C5E 50%, #0E2035 100%)' }}>

      {/* Decorative rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[600px] h-[600px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[400px] h-[400px] rounded-full border border-white/5" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full
                          bg-gold-500/20 border border-gold-400/30 mb-4">
            <span className="text-gold-400 text-2xl">♦</span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-white tracking-wide">
            AsoEbi <span className="text-gold-400">Operations</span>
          </h1>
          <p className="text-navy-200 text-sm mt-1 font-body">
            Payment confirmation · August 1, 2026
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-luxury p-8">
          <h2 className="font-display text-xl font-semibold text-navy-800 mb-1">
            Submit Your Payment
          </h2>
          <p className="text-navy-400 text-sm font-body mb-6">
            Fill in your details and upload your receipt below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="label">Full Name</label>
              <input
                className="input"
                placeholder="Kunle Adeyemi"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Phone Number</label>
              <input
                className="input"
                placeholder="+234 801 234 5678"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Amount Paid (₦)</label>
              <input
                className="input"
                type="number"
                min={0}
                placeholder="45000"
                value={form.amount_paid}
                onChange={e => set('amount_paid', e.target.value)}
                required
              />
            </div>

            {/* Receipt upload */}
            <div className="bg-navy-50 rounded-xl p-4 space-y-3">
              <label className="label">Payment Receipt</label>

              {receiptUrl ? (
                <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2">
                  <span className="text-emerald-600">✓</span>
                  <span className="text-emerald-700 text-xs font-medium font-body">
                    {receiptName} uploaded
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="input text-xs"
                    onChange={e => setFile(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="btn-ghost w-full text-xs"
                  >
                    {uploading ? 'Uploading…' : 'Upload Receipt'}
                  </button>
                  <p className="text-xs text-navy-400 font-body">PDF or image, max 8MB</p>
                </div>
              )}
            </div>

            <div>
              <label className="label">Notes (optional)</label>
              <textarea
                className="input resize-none"
                rows={2}
                placeholder="Any measurements, sizing notes, or messages for Damilola…"
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg font-body">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !receiptUrl}
              className="btn-primary w-full mt-2"
            >
              {loading ? 'Submitting…' : 'Submit Payment →'}
            </button>

            {!receiptUrl && (
              <p className="text-xs text-navy-400 text-center font-body">
                Upload your receipt above to enable submission
              </p>
            )}
          </form>
        </div>

        <p className="text-center text-navy-300/60 text-xs mt-6 font-body">
          AsoEbi Operations · Private — groomsmen only
        </p>
      </div>
    </div>
  )
}
