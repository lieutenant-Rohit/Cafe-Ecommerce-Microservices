import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import PublicLayout from '../components/layout/PublicLayout'
import AdminLayout from '../pages/admin/AdminLayout'
import PageTransition from '../components/page-transition'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Menu from '../pages/Menu'
import Cart from '../pages/Cart'
import MyOrders from '../pages/MyOrders'
import Legal from '../pages/Legal'
import Dashboard from '../pages/admin/Dashboard'
import AdminProducts from '../pages/admin/Products'
import AdminCategories from '../pages/admin/Categories'
import AdminOrders from '../pages/admin/Orders'
import AdminUsers from '../pages/admin/Users'
import AdminInventory from '../pages/admin/Inventory'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      let cancelled = false
      const started = performance.now()

      const reveal = () => {
        if (cancelled) return
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
        if (performance.now() - started < 1600) {
          window.requestAnimationFrame(reveal)
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' })
        }
      }

      const timeout = window.setTimeout(reveal, 80)
      return () => {
        cancelled = true
        window.clearTimeout(timeout)
      }
    }

    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

function AppRouter() {
  const location = useLocation()

  return (
    <MotionConfig reducedMotion="never">
      <ScrollToTop />
      <PageTransition>
        <Routes location={location}>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/privacy" element={<Legal kind="privacy" />} />
            <Route path="/terms" element={<Legal kind="terms" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </PageTransition>
    </MotionConfig>
  )
}

export default AppRouter
