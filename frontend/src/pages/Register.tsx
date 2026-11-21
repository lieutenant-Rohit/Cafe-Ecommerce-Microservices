import { useState, useEffect, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import useAuthStore from '../store/authStore'
import AuthSplit from '../components/layout/AuthSplit'

const inputClass = 'cafe-input'
const labelClass = 'cafe-label'

export default function Register() {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError } = useAuthStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (success) {
      timeout = setTimeout(() => navigate('/login'), 2000)
    }
    return () => clearTimeout(timeout)
  }, [success, navigate])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    clearError()
    try {
      await register({ name, email, password, address })
      setSuccess(true)
    } catch {
      // handled by the store
    }
  }

  return (
    <AuthSplit
      variant="register"
      headlineLine1="Get on"
      headlineLine2="the Morning List."
      sub="Batch alerts before the rolls sell out, early access to weekend bakes, and a birthday pastry with your name on it."
      footer={
        <p>
          Already a regular?{' '}
          <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700">
            Sign in
          </Link>
        </p>
      }
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold text-coffee-900">Create your account</h2>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-100 text-accent-700">
          <Sparkles className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-1 text-sm text-coffee-400">Takes about as long as the espresso shot.</p>

      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border-2 border-accent-300 bg-accent-50 px-3.5 py-2.5 text-sm font-semibold text-accent-800">
          <Check className="h-4 w-4 shrink-0" />
          You are on the list. Taking you to sign in…
        </div>
      )}

      {error && (
        <div role="alert" className="mt-4 rounded-xl border-2 border-primary-300 bg-blush-100 px-3.5 py-2.5 text-sm font-semibold text-primary-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
            placeholder="Priya Sharma"
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
            placeholder="At least six characters"
          />
        </div>

        <div>
          <label htmlFor="address" className={labelClass}>
            Delivery address
          </label>
          <input
            id="address"
            type="text"
            autoComplete="street-address"
            required
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className={inputClass}
            placeholder="42, Rajpur Road, Dehradun"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || success}
          className="cafe-btn cafe-btn-mint w-full text-base"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-900 border-t-transparent" />
              Setting you up…
            </>
          ) : success ? (
            <>
              <Check className="h-5 w-5" />
              You are on the list
            </>
          ) : (
            <>
              Join the Morning List
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-[11px] font-semibold leading-relaxed text-coffee-400">
        By joining you agree to our{' '}
        <Link to="/privacy" className="text-primary-600 hover:underline">
          privacy policy
        </Link>{' '}
        and{' '}
        <Link to="/terms" className="text-primary-600 hover:underline">
          terms
        </Link>
        . We send one email a week, never more.
      </p>
    </AuthSplit>
  )
}
