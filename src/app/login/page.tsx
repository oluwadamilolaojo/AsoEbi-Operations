'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', {
      username, password, redirect: false,
    })
    setLoading(false)
    if (res?.ok) {
      router.push('/')
    } else {
      setError('Invalid credentials. Try again.')
    }
  }

  return (
    <div className="min-h-screen bg-navy-700 flex items-center justify-center p-4"
         style={{ backgroundImage: 'radial-gradient(ellipse at 60% 40%, #265D8C 0%, #1A3C5E 50%, #0E2035 100%)' }}>

      {/* Decorative ring */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/20 border border-gold-400/30 mb-4">
            <span className="text-gold-400 text-2xl">♦</span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-white tracking-wide">
            AsoEbi <span className="text-gold-400">Operations</span>
          </h1>
          <p className="text-navy-200 text-sm mt-1 font-body">Groomsmen Dashboard · August 1, 2026</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h2 className="font-display text-xl font-semibold text-navy-800 mb-6 text-center">
            Admin Access
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Username</label>
              <input
                className="input"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : '→'}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-navy-300/60 text-xs mt-6 font-body">
          Private — authorised personnel only
        </p>
      </div>
    </div>
  )
}
