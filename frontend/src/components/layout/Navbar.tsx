import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'

function CartBadge({ count }: { count: number }) {
  return (
    <AnimatePresence mode="popLayout">
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="absolute -top-2 -right-2 bg-primary-600 text-cream-50 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          <motion.span
            key={`num-${count}`}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            {count}
          </motion.span>
        </motion.span>
      )}
    </AnimatePresence>
  )
}

function NavLinkItem({ to, label, isActive }: { to: string; label: string; isActive: boolean }) {
  return (
    <Link to={to} className="relative py-2 text-sm font-medium transition-colors">
      <span className={isActive ? 'text-primary-600 font-semibold' : 'text-coffee-700 hover:text-primary-600'}>
        {label}
      </span>
      {isActive && (
        <motion.span
          layoutId="navbar-active-indicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </Link>
  )
}

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore()
  const totalItems = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const prevScrollY = { current: 0 }

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const delta = latest - prevScrollY.current
    if (latest > 80) {
      setHidden(delta > 20)
      setScrolled(true)
    } else {
      setHidden(false)
      setScrolled(false)
    }
    prevScrollY.current = latest
  })

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <motion.nav
      animate={hidden ? { y: '-100%' } : { y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream-50/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(42,22,14,0.06)]'
          : 'bg-cream-50/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-semibold text-coffee-900">
              BloomsCafe
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLinkItem to="/" label="Home" isActive={location.pathname === '/'} />
            <NavLinkItem to="/menu" label="Menu" isActive={location.pathname === '/menu'} />
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative text-coffee-700 hover:text-primary-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <CartBadge count={totalItems} />
            </Link>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <NavLinkItem to="/my-orders" label="My Orders" isActive={location.pathname === '/my-orders'} />
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-sm bg-accent-600 text-white px-3 py-1.5 rounded-lg hover:bg-accent-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <span className="text-coffee-700 font-medium">{user?.sub}</span>
                <button
                  onClick={logout}
                  className="text-sm text-coffee-400 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-coffee-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-cream-50 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative w-8 h-8 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5 w-5">
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="block h-0.5 bg-coffee-700 origin-center"
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.15 }}
                  className="block h-0.5 bg-coffee-700"
                />
                <motion.span
                  animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="block h-0.5 bg-coffee-700 origin-center"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:hidden overflow-hidden bg-cream-50/95 backdrop-blur-xl border-t border-cream-200"
          >
            <div className="px-4 py-4 space-y-3">
              <Link to="/" className="block py-2 text-coffee-700 hover:text-primary-600 font-medium transition-colors">
                Home
              </Link>
              <Link to="/menu" className="block py-2 text-coffee-700 hover:text-primary-600 font-medium transition-colors">
                Menu
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/my-orders" className="block py-2 text-coffee-700 hover:text-primary-600 font-medium transition-colors">
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="block py-2 text-accent-600 font-medium transition-colors">
                      Dashboard
                    </Link>
                  )}
                  <button onClick={logout} className="block py-2 text-coffee-400 hover:text-red-600 font-medium transition-colors">
                    Logout
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <div className="flex gap-3 pt-2">
                  <Link to="/login" className="flex-1 text-center py-2 border border-cream-300 rounded-lg text-coffee-700 hover:bg-cream-100 font-medium transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="flex-1 text-center py-2 bg-primary-600 text-cream-50 rounded-lg font-medium hover:bg-primary-500 transition-colors">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

