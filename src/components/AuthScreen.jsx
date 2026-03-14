import { useState } from 'react'
import { Eye, Mail, Loader2, Check, ArrowLeft } from 'lucide-react'
import { sendMagicLink } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { authEvents } from '../lib/analytics'

export default function AuthScreen({ onBack }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError(null)

    try {
      if (!supabase) {
        throw new Error('Supabase not configured. Please add your API keys to .env')
      }
      await sendMagicLink(email)
      authEvents.magicLinkRequested()
      setSent(true)
    } catch (err) {
      authEvents.signInFailed(err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-amber-50 flex flex-col">
        <div className="p-6">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <Check className="text-emerald-500" size={40} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">Check your email!</h1>

          <p className="text-gray-600 max-w-sm mb-6">
            We sent a magic link to <strong>{email}</strong>. Click the link to sign in.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-sm">
            <p className="text-sm text-amber-800">
              <strong>Tip:</strong> Check your spam folder if you don't see it within a minute.
            </p>
          </div>

          <button
            onClick={() => { setSent(false); setEmail('') }}
            className="mt-6 text-violet-600 font-medium"
          >
            Try a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-amber-50 flex flex-col">
      <div className="p-6">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-200">
          <Eye className="text-white" size={28} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Sign in to Peekaboo</h1>
        <p className="text-gray-600 mb-8 text-center">We'll send you a magic link - no password needed</p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="relative mb-4">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              autoComplete="email"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              email.trim() && !loading
                ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-200'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail size={20} />
                Send Magic Link
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-xs text-gray-400 text-center max-w-xs">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
