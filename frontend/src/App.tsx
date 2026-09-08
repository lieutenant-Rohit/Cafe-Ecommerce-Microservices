import { useEffect, useState, useCallback } from 'react'
import AppRouter from './router'
import useAuthStore from './store/authStore'
import useCartStore from './store/cartStore'
import SmoothScroll from './components/smooth-scroll'
import SplashScreen from './components/splash-screen'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const initialize = useAuthStore((s) => s.initialize)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const loadFromBackend = useCartStore((s) => s.loadFromBackend)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (isAuthenticated) {
      loadFromBackend()
    }
  }, [isAuthenticated, loadFromBackend])

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false)
  }, [])

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <SmoothScroll>
        <AppRouter />
      </SmoothScroll>
    </>
  )
}

export default App

