import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import PublicLayout from '../components/layout/PublicLayout'
import AdminLayout from '../pages/admin/AdminLayout'
import ScrollProgress from '../components/ui/scroll-progress'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Menu from '../pages/Menu'
import Cart from '../pages/Cart'
import MyOrders from '../pages/MyOrders'
import Dashboard from '../pages/admin/Dashboard'
import AdminProducts from '../pages/admin/Products'
import AdminCategories from '../pages/admin/Categories'
import AdminOrders from '../pages/admin/Orders'
import AdminUsers from '../pages/admin/Users'
import AdminInventory from '../pages/admin/Inventory'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function AppRouter() {
  const location = useLocation()

  return (
    <MotionConfig reducedMotion="never">
      <ScrollToTop />
      <ScrollProgress />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="flex min-h-svh flex-col"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />

            <Route element={<PublicLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="inventory" element={<AdminInventory />} />
            </Route>
          </Routes>
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  )
}

export default AppRouter
