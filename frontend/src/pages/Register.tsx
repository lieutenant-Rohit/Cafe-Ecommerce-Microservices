import { useState, useEffect, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import AuthSplit from '../components/layout/AuthSplit'
import { Button } from '../components/ui/button'
import { Magnetic } from '../components/motion-primitives/magnetic'

const inputClass =
  'w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-coffee-900 placeholder:text-coffee-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors'

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    clearError()
    try {
      await register({ name, email, password, address })
      setSuccess(true)
    } catch {
      // error is set in store
    }
  }

  return (
    <AuthSplit
      variant="register"
      headlineLine1="Get on"
      headlineLine2="the Morning List."
      sub="Batch alerts before the rolls sell out, loyalty points on every cup, and weekend bakes with your name on them."
      footer={
        <p className="text-sm text-coffee-500">
          Already a regular?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      }
    >
      <h2 className="font-display text-2xl font-semibold text-coffee-900">Create your account</h2>

      {success && (
        <div className="mt-4 p-3 bg-accent-50 border border-accent-200 text-accent-700 rounded-xl text-sm">
          Account created! Redirecting to sign in...
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-coffee-700 mb-1.5">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-coffee-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-coffee-700 mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-coffee-700 mb-1.5">
            Address
          </label>
          <input
            id="address"
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={inputClass}
            placeholder="123 Main St"
          />
        </div>

        <Magnetic intensity={0.25} range={120}>
          <Button
            type="submit"
            disabled={isLoading || success}
            className="w-full rounded-full bg-primary-600 hover:bg-primary-500 text-cream-50 h-12 text-base font-medium shadow-[0_4px_16px_rgba(42,22,14,0.22)] transition-all disabled:opacity-60"
          >
            {isLoading ? 'Creating your account...' : 'Join the Morning List'}
          </Button>
        </Magnetic>
      </form>
    </AuthSplit>
  )
}

