import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'motion/react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { Category, Product } from '../types'
import { fetchCategories } from '../api/categoryApi'
import { fetchProducts, fetchProductsByCategory } from '../api/productApi'
import useCartStore from '../store/cartStore'
import Pagination from '../components/ui/Pagination'
import Reveal from '../components/ui/reveal'
import { AnimatedGroup } from '../components/motion-primitives/animated-group'
import { Magnetic } from '../components/motion-primitives/magnetic'
import { BorderTrail } from '../components/motion-primitives/border-trail'


function BlurImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-cream-200 via-cream-100 to-cream-200 animate-pulse" />
      )}
      {error ? (
        <div className="w-full h-full flex items-center justify-center text-cream-400 bg-cream-100">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-700 ${
            loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'
          }`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  )
}

function ShimmerSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
      <div className="aspect-[4/3] bg-gradient-to-r from-cream-100 via-cream-50 to-cream-100 bg-[length:200%_100%] animate-shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 bg-[length:200%_100%] animate-shimmer rounded-full w-1/3" />
        <div className="h-5 bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 bg-[length:200%_100%] animate-shimmer rounded-full w-3/4" />
        <div className="h-7 bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 bg-[length:200%_100%] animate-shimmer rounded-full w-1/4" />
        <div className="h-3 bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 bg-[length:200%_100%] animate-shimmer rounded-full w-1/2" />
        <div className="h-9 bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 bg-[length:200%_100%] animate-shimmer rounded-full w-full" />
      </div>
    </div>
  )
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  const [added, setAdded] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleAdd() {
    onAdd(product)
    setAdded(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setAdded(false), 1200)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <div className="relative bg-white rounded-2xl border border-cream-200 overflow-hidden h-full group hover:shadow-xl hover:shadow-primary-900/5 hover:-translate-y-1 transition-all duration-500">
        <BorderTrail
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          radius={16}
          size={2}
          color="rgba(169,78,44,0.3)"
        />
        <div className="aspect-[4/3] bg-cream-100 overflow-hidden relative">
          {product.imageUrl ? (
            <BlurImage
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cream-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {/* Price badge */}
          <motion.span
            className="absolute top-3 right-3 bg-coffee-950/80 backdrop-blur-sm text-cream-50 text-sm font-bold px-3 py-1.5 rounded-full shadow-lg"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
          >
            ₹{product.price.toFixed(0)}
          </motion.span>

          {/* Stock indicator */}
          {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
            <span className="absolute top-3 left-3 bg-accent-500/90 backdrop-blur-sm text-cream-50 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Only {product.stockQuantity} left
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="mb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
              {product.category.name}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-coffee-900 group-hover:text-primary-700 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-sm text-coffee-400 mt-1.5">
            {product.stockQuantity > 0 ? (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                In stock
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-coffee-300" />
                Out of stock
              </span>
            )}
          </p>
        </div>

        {/* Circular + button bottom-right */}
        {product.stockQuantity > 0 && (
          <motion.button
            onClick={handleAdd}
            disabled={added}
            whileTap={{ scale: 0.85 }}
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-primary-600 hover:bg-primary-500 text-cream-50 flex items-center justify-center shadow-lg shadow-primary-600/25 transition-colors disabled:opacity-70"
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.svg
                  key="check"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="plus"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const categoryScrollRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { scrollY } = useScroll()
  const [headerCompact, setHeaderCompact] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setHeaderCompact(latest > 120)
  })

  const addItem = useCartStore((s) => s.addItem)

  const loadGeneration = useRef(0)

  const loadProducts = useCallback(() => {
    setLoading(true)
    setError(false)
    const gen = ++loadGeneration.current
    const load = activeCategory
      ? fetchProductsByCategory(activeCategory, page)
      : fetchProducts(page)
    load
      .then((data) => {
        if (gen !== loadGeneration.current) return
        setProducts(data.content)
        setTotalPages(data.totalPages)
      })
      .catch(() => { if (gen === loadGeneration.current) setError(true) })
      .finally(() => { if (gen === loadGeneration.current) setLoading(false) })
  }, [activeCategory, page])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  function handleCategoryClick(categoryId: number | null) {
    setActiveCategory(categoryId)
    setPage(0)
  }

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showSearch])

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Sticky header with search */}
      <div className={`sticky top-0 z-40 transition-all duration-300 ${headerCompact ? 'py-3' : 'py-5'} bg-cream-50/80 backdrop-blur-xl border-b border-cream-200/50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Reveal>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary-600">The counter</p>
                <h1 className={`font-display font-semibold text-coffee-900 transition-all duration-300 ${headerCompact ? 'text-xl' : 'text-3xl md:text-4xl'}`}>
                  Our Menu
                </h1>
              </Reveal>
            </div>

            {/* Search toggle */}
            <Magnetic intensity={0.2} range={50}>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="w-10 h-10 rounded-full border border-cream-300 flex items-center justify-center text-coffee-600 hover:bg-cream-100 transition-colors"
              >
                {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </button>
            </Magnetic>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-3 pb-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search menu items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-cream-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-coffee-900 placeholder:text-coffee-300 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-sm text-coffee-500 mb-6">
          Everything below was made today. If it&apos;s gray, we&apos;ve run out.
        </p>

        {/* Category pills - horizontal scroll */}
        <div className="relative mb-8">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-cream-50 to-transparent z-10 pointer-events-none md:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-cream-50 to-transparent z-10 pointer-events-none md:hidden" />

          <div
            ref={categoryScrollRef}
            className="flex md:flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <motion.button
              onClick={() => handleCategoryClick(null)}
              className={`snap-start shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeCategory === null
                  ? 'bg-coffee-900 text-cream-50 border-coffee-900 shadow-lg shadow-coffee-900/20'
                  : 'bg-white text-coffee-600 border-cream-200 hover:border-coffee-300 hover:bg-cream-50'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              All Items
            </motion.button>
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`snap-start shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                  activeCategory === cat.id
                    ? 'bg-coffee-900 text-cream-50 border-coffee-900 shadow-lg shadow-coffee-900/20'
                    : 'bg-white text-coffee-600 border-cream-200 hover:border-coffee-300 hover:bg-cream-50'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ShimmerSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="w-6 h-6 text-coffee-400" />
            </div>
            <p className="text-coffee-500 mb-4">Failed to load menu. Check your connection.</p>
            <button
              onClick={loadProducts}
              className="bg-primary-600 text-cream-50 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary-500 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-coffee-400" />
            </div>
            <p className="text-coffee-500 text-lg">
              {searchQuery ? `No results for "${searchQuery}"` : 'No products found.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-primary-600 text-sm font-medium hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-4 text-sm text-coffee-400">
              {searchQuery ? `${filteredProducts.length} results` : `${filteredProducts.length} items`}
            </div>

            <AnimatedGroup
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={{
                hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
              }}
              stagger={0.08}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addItem} />
              ))}
            </AnimatedGroup>

            {!searchQuery && (
              <Reveal delay={0.1}>
                <div className="mt-10">
                  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
              </Reveal>
            )}
          </>
        )}
      </div>
    </div>
  )
}

