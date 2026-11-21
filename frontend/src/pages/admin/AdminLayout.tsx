import { useState } from 'react'
import { Link, NavLink, Outlet, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowUpRight,
  Box,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/inventory', label: 'Inventory', icon: Box },
]

export default function AdminLayout() {
  const { isAdmin, isAuthenticated, user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  const current = navItems.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
  )

  const sidebar = (
    <div className="flex h-full flex-col bg-coffee-900 text-cream-50">
      <div className="border-b-2 border-cream-50/10 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <Link to="/admin" className="group flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-cream-50/20 bg-primary-500 text-cream-50 transition-transform group-hover:rotate-6">
              <Sparkles className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-xl font-semibold leading-none">
                Blooms<span className="text-primary-400">Cafe</span>
              </span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.24em] text-cream-100/40">
                Back office
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-full bg-cream-50/10 text-cream-100 lg:hidden"
            aria-label="Close admin menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin navigation">
        <p className="px-3 pb-2 pt-1 text-[9px] font-bold uppercase tracking-[0.24em] text-cream-100/35">
          The counter
        </p>
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-lemon-400 text-coffee-900 shadow-[0_3px_0_rgba(0,0,0,0.25)]'
                    : 'text-cream-100/65 hover:bg-cream-50/10 hover:text-cream-50',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn('h-[18px] w-[18px]', isActive ? 'text-coffee-900' : 'text-cream-100/45')} />
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="admin-active"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border-2 border-dashed border-cream-50/15 bg-cream-50/5 p-3.5">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-lemon-400">
            <Sparkles className="h-3 w-3" />
            Storefront
          </p>
          <p className="mt-1.5 text-xs leading-snug text-cream-100/55">
            Check how the menu looks to customers.
          </p>
          <Link
            to="/"
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-cream-50 hover:text-lemon-300"
          >
            Open BloomsCafe
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      <div className="border-t-2 border-cream-50/10 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-500 font-display text-sm font-bold text-white">
            {user?.sub?.charAt(0).toUpperCase() || 'A'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-cream-50">{user?.sub || 'Admin'}</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-cream-100/40">Administrator</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="grid h-8 w-8 place-items-center rounded-full text-cream-100/50 transition-colors hover:bg-primary-500/20 hover:text-primary-300"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-cream-50">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            type="button"
            aria-label="Close admin menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-coffee-950/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[268px] shrink-0 border-r-[3px] border-coffee-950 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {sidebar}
      </aside>

      <main className="min-w-0 flex-1">
        <div className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b-2 border-coffee-900/10 bg-cream-50/95 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-full border-2 border-coffee-900/15 bg-white text-coffee-800 lg:hidden"
            aria-label="Open admin menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-primary-600">Admin panel</p>
            <h1 className="truncate font-display text-lg font-semibold leading-tight text-coffee-900">
              {current?.label ?? 'Dashboard'}
            </h1>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full border-2 border-coffee-900/10 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-coffee-500 sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-accent-500" />
            Live data
          </span>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-coffee-900 px-3.5 py-2 text-xs font-bold text-cream-50 transition-colors hover:bg-coffee-800"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View store</span>
            <span className="sm:hidden">Store</span>
          </Link>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
