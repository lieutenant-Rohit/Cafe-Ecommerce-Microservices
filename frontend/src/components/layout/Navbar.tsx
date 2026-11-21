import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import {
  ArrowRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu as MenuIcon,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import { useCafeStatus } from '../../hooks/useCafeStatus'
import CartDrawer from './CartDrawer'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/#story', label: 'Our story' },
  { to: '/#faq', label: 'FAQ' },
]

const menuJumps = [
  { label: 'Coffee', to: '/menu?category=1' },
  { label: 'Tea', to: '/menu?category=2' },
  { label: 'Pastries', to: '/menu?category=3' },
  { label: 'Desserts', to: '/menu?category=4' },
  { label: 'Breakfast', to: '/menu?category=5' },
  { label: 'Sandwiches', to: '/menu?category=6' },
  { label: 'Smoothies', to: '/menu?category=7' },
]

function CartBadge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.55, rotate: -18 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 520, damping: 18 }}
      className="grid h-5 min-w-5 place-items-center rounded-full bg-lemon-400 px-1 font-display text-[11px] font-bold text-coffee-900"
      aria-live="polite"
    >
      {count}
    </motion.span>
  )
}

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore()
  const totalItems = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0))
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { isOpen, statusText } = useCafeStatus()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })

  function isActiveLink(to: string) {
    const [path, hash] = to.split('#')
    if (hash) {
      return location.pathname === path && location.hash === `#${hash}`
    }
    return location.pathname === path && !location.hash
  }

  useEffect(() => {
    setMobileOpen(false)
    setCartOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen])

  return (
    <>
      <div className="relative z-[55] bg-coffee-900 px-4 py-2 text-center text-[12px] font-semibold text-cream-100 sm:text-[13px]">
        <span className="mr-2 hidden text-lemon-400 sm:inline">✦</span>
        Fresh bakes every morning
        <span className="mx-2 text-cream-200/40">·</span>
        Free delivery on orders over ₹499
        <span className="mx-2 hidden text-cream-200/40 sm:inline">·</span>
        <span className="hidden sm:inline">Rajpur Road, Dehradun</span>
      </div>

      <header className="sticky top-0 z-[60] border-b-2 border-coffee-900/10 bg-cream-50/95 backdrop-blur-xl">
        <div className="shell">
          <div className="flex h-[68px] items-center justify-between gap-4 sm:h-[76px]">
            <Link to="/" className="group relative flex items-center gap-2" aria-label="BloomsCafe home">
              <span className="font-display text-[1.65rem] font-bold leading-none tracking-tight text-primary-600 sm:text-3xl">
                Blooms<span className="text-coffee-900">Cafe</span>
              </span>
              <span className="absolute -right-3 -top-2 h-2.5 w-2.5 rotate-12 rounded-[35%] bg-accent-500 transition-transform duration-300 group-hover:rotate-[70deg]" />
            </Link>

            <nav className="hidden items-center gap-5 whitespace-nowrap xl:flex 2xl:gap-8" aria-label="Main navigation">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'link-underline whitespace-nowrap text-[15px] font-semibold transition-colors',
                    isActiveLink(link.to) ? 'text-primary-600' : 'text-coffee-800 hover:text-primary-600',
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to="/my-orders"
                  className={cn(
                    'link-underline whitespace-nowrap text-[15px] font-semibold transition-colors',
                    location.pathname === '/my-orders' ? 'text-primary-600' : 'text-coffee-800 hover:text-primary-600',
                  )}
                >
                  My orders
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-coffee-900/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-coffee-500 xl:flex">
                <span className={cn('h-2 w-2 rounded-full', isOpen ? 'bg-accent-500' : 'bg-coffee-300')} />
                <span className="whitespace-nowrap">{isOpen ? 'Open now' : 'Closed'}</span>
                <span className="hidden h-3 w-px bg-coffee-900/10 2xl:block" />
                <span className="hidden whitespace-nowrap font-normal text-coffee-400 2xl:inline">{statusText}</span>
              </div>

              {isAuthenticated ? (
                <div className="hidden items-center gap-2 md:flex">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="grid h-10 w-10 place-items-center rounded-full border-2 border-coffee-900/15 text-coffee-700 transition-colors hover:border-primary-400 hover:text-primary-600"
                      aria-label="Admin dashboard"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                    </Link>
                  )}
                  <span className="max-w-[9rem] truncate rounded-full bg-blush-100 px-3 py-1.5 text-sm font-semibold text-coffee-700">
                    {user?.sub}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="grid h-10 w-10 place-items-center rounded-full text-coffee-400 transition-colors hover:bg-blush-100 hover:text-primary-600"
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="hidden items-center gap-2 md:flex">
                  <Link
                    to="/login"
                    className="rounded-full px-3 py-2 text-sm font-semibold text-coffee-800 transition-colors hover:text-primary-600"
                  >
                    Sign in
                  </Link>
                  <Link to="/register" className="cafe-btn cafe-btn-sm cafe-btn-mint">
                    Join the list
                  </Link>
                </div>
              )}

              <button
                type="button"
                id="cart-target"
                onClick={() => setCartOpen(true)}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-coffee-900 px-4 font-display text-sm font-semibold text-cream-50 transition-transform hover:-translate-y-0.5 hover:bg-coffee-800 active:translate-y-0"
                aria-label={`Open cart, ${totalItems} items`}
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Bag</span>
                <CartBadge count={totalItems} />
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen((open) => !open)}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="grid h-11 w-11 place-items-center rounded-full border-2 border-coffee-900/15 bg-white/70 text-coffee-900 xl:hidden"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <motion.div
          className="h-[3px] origin-left bg-primary-500"
          style={{ scaleX: progress }}
          aria-hidden="true"
        />

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full max-h-[calc(100dvh-7rem)] overflow-y-auto border-b-[3px] border-coffee-900 bg-cream-50 shadow-[0_20px_40px_rgba(58,10,44,0.18)] xl:hidden"
              data-lenis-prevent
            >
              <div className="shell py-6">
                <nav className="flex flex-col" aria-label="Mobile navigation">
                  {links.map((link, index) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.045, duration: 0.3 }}
                    >
                      <Link
                        to={link.to}
                        className="flex items-center justify-between border-b border-dashed border-coffee-900/15 py-3.5 font-display text-2xl font-semibold text-coffee-900"
                      >
                        {link.label}
                        <ArrowRight className="h-4 w-4 text-primary-500" />
                      </Link>
                    </motion.div>
                  ))}
                  {isAuthenticated && (
                    <Link
                      to="/my-orders"
                      className="flex items-center justify-between border-b border-dashed border-coffee-900/15 py-3.5 font-display text-2xl font-semibold text-coffee-900"
                    >
                      My orders
                      <ClipboardList className="h-4 w-4 text-primary-500" />
                    </Link>
                  )}
                </nav>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {menuJumps.map((jump) => (
                    <Link
                      key={jump.label}
                      to={jump.to}
                      className="rounded-2xl bg-blush-100 px-4 py-3 text-sm font-semibold text-coffee-800"
                    >
                      {jump.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={logout}
                      className="cafe-btn cafe-btn-outline cafe-btn-sm w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  ) : (
                    <>
                      <Link to="/login" className="cafe-btn cafe-btn-outline cafe-btn-sm w-full">
                        Sign in
                      </Link>
                      <Link to="/register" className="cafe-btn cafe-btn-mint cafe-btn-sm w-full">
                        <Sparkles className="h-4 w-4" />
                        Join the Morning List
                      </Link>
                    </>
                  )}
                </div>

                <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs font-semibold text-coffee-400">
                  <MapPin className="h-3.5 w-3.5" />
                  42, Rajpur Road · Open {isOpen ? 'now' : 'tomorrow at 6'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
