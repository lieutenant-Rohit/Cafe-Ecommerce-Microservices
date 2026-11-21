import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import useAuthStore from '../store/authStore'
import AuthSplit from '../components/layout/AuthSplit'

const inputClass =
  'cafe-input pr-11'
const labelClass = 'cafe-label'

const demoAccounts = [
  { label: 'Customer', email: 'customer1@example.com', password: 'customer123' },
  { label: 'Admin', email: 'admin@bloomscafe.com', password: 'admin123' },
]

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  async function handleSubmit(e: FormEvent, demo?: { email: string; password: string }) {
    e.preventDefault()
    clearError()
    try {
      await login(demo ?? { email, password })
      const { isAdmin } = useAuthStore.getState()
      navigate(isAdmin ? '/admin' : '/menu')
    } catch {
      setShakeKey((key) => key + 1)
    }
  }

  function handleChange(fn: (value: string) => void) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      if (error) clearError()
      fn(event.target.value)
    }
  }

  return (
    <AuthSplit
      variant="login"
      headlineLine1="Welcome back,"
      headlineLine2="your usual's waiting."
      sub="Your order history, saved favourites, and first pick of tomorrow's batch — all behind one sign-in."
      footer={
        <p>
          New to BloomsCafe?{' '}
          <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700">
            Get on the Morning List
          </Link>
        </p>
      }
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold text-coffee-900">Sign in</h2>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-blush-100 text-primary-600">
          <Sparkles className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-1 text-sm text-coffee-400">The counter remembers your order.</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-coffee-400">Try the demo</span>
        {demoAccounts.map((account) => (
          <button
            key={account.label}
            type="button"
            disabled={isLoading}
            onClick={(event) => handleSubmit(event, account)}
            className="rounded-full border-2 border-coffee-900/15 bg-cream-50 px-3.5 py-1.5 text-[11px] font-bold text-coffee-700 transition-colors hover:border-coffee-900/30 hover:bg-lemon-200 disabled:opacity-60"
          >
            {account.label}
          </button>
        ))}
      </div>

      {error && (
        <motion.div
          key={shakeKey}
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: [0, -8, 8, -5, 5, 0], opacity: 1 }}
          transition={{ duration: 0.4 }}
          role="alert"
          className="mt-4 rounded-xl border-2 border-primary-300 bg-blush-100 px-3.5 py-2.5 text-sm font-semibold text-primary-800"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={(event) => handleSubmit(event)} className="mt-5 space-y-4">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={handleChange(setEmail)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={handleChange(setPassword)}
              className={inputClass}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-coffee-400 transition-colors hover:bg-blush-100 hover:text-coffee-800"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="cafe-btn w-full text-base"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Pouring your usual…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-xs font-semibold text-coffee-400">
        Trouble signing in? Call the cafe on{' '}
        <a href="tel:+911352650127" className="text-primary-600 hover:underline">
          +91 135 265 0127
        </a>
        .
      </p>
    </AuthSplit>
  )
}
