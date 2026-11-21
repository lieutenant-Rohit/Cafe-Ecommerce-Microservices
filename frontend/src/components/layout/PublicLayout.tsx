import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-coffee-900 focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-cream-50"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
