import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { motion } from 'motion/react'
import useAuthStore from '../store/authStore'
import AuthSplit from '../components/layout/AuthSplit'
import { Button } from '../components/ui/button'
import { Magnetic } from '../components/motion-primitives/magnetic'
import { BorderTrail } from '../components/motion-primitives/border-trail'
import { Spotlight } from '../components/motion-primitives/spotlight'

const inputClass =
  'w-full px-4 py-3 pr-11 bg-cream-50 border border-cream-300 rounded-xl text-coffee-900 placeholder:text-coffee-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors'

const labelClass =
  'block text-[11px] font-semibold uppercase tracking-[0.25em] text-coffee-700 mb-2'

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
      setShakeKey((k) => k + 1)
    }
  }

  function handleChange(fn: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      if (error) clearError()
      fn(e.target.value)
    }
  }

  return (
    <AuthSplit
      variant="login"
      headlineLine1="Welcome back,"
      headlineLine2="your usual's waiting."
      sub="Your order history, loyalty rolls, and first pick of tomorrow's batch — all behind one sign-in."
      footer={
        <p className="text-sm text-coffee-500">
          New to BloomsCafe?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium transition-colors">
            Get on the Morning List
          </Link>
        </p>
      }
    >
      <h2 className="font-display text-2xl font-semibold text-coffee-900">Sign in</h2>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-coffee-400">Try the demo:</span>
        {demoAccounts.map((acc) => (
          <button
            key={acc.label}
            type="button"
            disabled={isLoading}
            onClick={(e) => handleSubmit(e, acc)}
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600 bg-accent-50 hover:bg-accent-100 border border-accent-200 rounded-full px-3.5 py-1.5 transition-colors disabled:opacity-60"
          >
            {acc.label}
          </button>
        ))}
      </div>

      {error && (
        <motion.div
          key={shakeKey}
          initial={{ x: 0 }}
          animate={{ x: [0, -10, 10, -6, 6, 0] }}
          transition={{ duration: 0.4 }}
          className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={(e) => handleSubmit(e)} className="mt-6 space-y-5">
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
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-700 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Magnetic intensity={0.25} range={120}>
          <Button
            type="submit"
            disabled={isLoading}
            className="relative w-full rounded-full bg-primary-600 hover:bg-primary-500 text-cream-50 h-13 text-base font-medium shadow-[0_4px_16px_rgba(42,22,14,0.22)] transition-colors disabled:opacity-60"
          >
            <BorderTrail radius={999} color="rgba(246,227,210,0.55)" />
            <Spotlight size={160} springOptions={{ bounce: 0, damping: 20, stiffness: 180 }} />
            {isLoading ? 'Pouring your usual...' : 'Sign In'}
          </Button>
        </Magnetic>
      </form>
    </AuthSplit>
  )
}

