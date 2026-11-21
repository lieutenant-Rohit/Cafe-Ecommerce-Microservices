import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowRight,
  Coffee,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react'
import type { Category, Product } from '@/types'
import { fetchCategories } from '@/api/categoryApi'
import { fetchProducts } from '@/api/productApi'
import ProductCard from '@/components/shop/ProductCard'
import QuickView from '@/components/shop/QuickView'
import { cn } from '@/lib/utils'

const fallbackCategories: Category[] = [
  { id: 1, name: 'Coffee' },
  { id: 2, name: 'Tea' },
  { id: 3, name: 'Pastries' },
  { id: 4, name: 'Desserts' },
  { id: 5, name: 'Breakfast' },
  { id: 6, name: 'Sandwiches' },
  { id: 7, name: 'Smoothies & Juices' },
]

function ProductSkeleton({ index }: { index: number }) {
  return (
    <div
      className={cn(
        'rounded-[26px] border-[3px] border-coffee-900/15 p-3',
        ['bg-[#FFF6EF]', 'bg-[#F8FFF0]', 'bg-[#FFF5FB]', 'bg-[#FFFDF0]'][index % 4],
      )}
    >
      <div className="aspect-square animate-pulse rounded-[19px] bg-white/70" />
      <div className="space-y-2 px-1.5 pb-1 pt-4">
        <div className="h-2.5 w-1/3 animate-pulse rounded-full bg-white/80" />
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-white/80" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-white/80" />
          <div className="h-8 w-16 animate-pulse rounded-full bg-white/80" />
        </div>
      </div>
    </div>
  )
}

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [quickView, setQuickView] = useState<Product | null>(null)

  const activeCategory = Number(searchParams.get('category') ?? 0) || null
  const activeCategoryName = categories.find((category) => category.id === activeCategory)?.name

  const load = useCallback(() => {
    setLoading(true)
    setError(false)
    Promise.allSettled([fetchProducts(0, 100), fetchCategories()])
      .then(([productResult, categoryResult]) => {
        if (productResult.status === 'rejected') {
          setError(true)
          return
        }
        setProducts(productResult.value.content)
        if (categoryResult.status === 'fulfilled' && categoryResult.value.length > 0) {
          setCategories(categoryResult.value)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const counts = useMemo(() => {
    return products.reduce<Record<number, number>>((acc, product) => {
      acc[product.category.id] = (acc[product.category.id] ?? 0) + 1
      return acc
    }, {})
  }, [products])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory = !activeCategory || product.category.id === activeCategory
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.category.name.toLowerCase().includes(term)
      return matchesCategory && matchesSearch
    })
  }, [products, activeCategory, search])

  function selectCategory(id: number | null) {
    if (id === null) {
      setSearchParams({}, { replace: true })
      return
    }
    setSearchParams({ category: String(id) }, { replace: true })
  }

  return (
    <div className="bg-cream-50">
      {/* Page header */}
      <section className="relative overflow-hidden border-b-[3px] border-coffee-900 bg-[#FFE6F4] pb-12 pt-10 sm:pb-14 sm:pt-14">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-50" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-lemon-300/60 blur-2xl" aria-hidden="true" />
        <div className="shell relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border-2 border-coffee-900 bg-white px-3.5 py-1.5 text-xs font-bold shadow-[3px_3px_0_#3a0a2c]"
            >
              <Coffee className="h-3.5 w-3.5 text-primary-500" />
              Made today, on Rajpur Road
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 font-display text-[clamp(2.8rem,7vw,4.8rem)] font-semibold leading-[0.98] tracking-tight text-coffee-900"
            >
              The counter
              <br />
              <span className="text-primary-600">is open.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 max-w-lg text-lg text-coffee-600"
            >
              Everything below was made in this building this morning. Coffee pulled to order, bakes
              straight from the oven, and no heat lamps in sight.
            </motion.p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.84, rotate: -9 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.24 }}
              className="relative min-w-[176px] animate-float-soft rounded-2xl border-[3px] border-coffee-900 bg-white px-6 py-4 shadow-[0_7px_0_rgba(58,10,44,0.16)] [animation-delay:0.8s]"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-coffee-400">On the menu</p>
              <p className="font-display text-3xl font-semibold text-coffee-900">
                {loading ? '—' : products.length}
                <span className="ml-1.5 text-sm font-semibold text-coffee-400">items</span>
              </p>
              <span className="absolute -bottom-4 -right-4 sticker h-11 w-11 rotate-12 animate-wiggle border-2 border-coffee-900 bg-accent-400 text-[9px] text-accent-900">
                Fresh
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sticky filters */}
      <div className="sticky top-[73px] z-40 border-b-2 border-coffee-900/10 bg-cream-50/95 backdrop-blur-xl sm:top-[81px]">
        <div className="shell py-3.5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative w-full lg:max-w-xs">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-coffee-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search the counter…"
                aria-label="Search the menu"
                className="cafe-input h-11 border-2 py-2 pl-10 pr-10 text-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-coffee-400 hover:bg-blush-100 hover:text-coffee-800"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="chip-scroll scrollbar-hide flex flex-1 items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <motion.button
                type="button"
                onClick={() => selectCategory(null)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.35, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={cn('cafe-chip shrink-0', activeCategory === null && 'cafe-chip-active')}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Everything
                <span className={cn('text-xs font-bold', activeCategory === null ? 'text-white/70' : 'text-coffee-400')}>
                  {products.length}
                </span>
              </motion.button>
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  type="button"
                  onClick={() => selectCategory(category.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.35, delay: 0.14 + index * 0.03, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'cafe-chip shrink-0',
                    activeCategory === category.id && 'cafe-chip-active',
                  )}
                >
                  {category.name}
                  <span className={cn('text-xs font-bold', activeCategory === category.id ? 'text-white/70' : 'text-coffee-400')}>
                    {counts[category.id] ?? 0}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="cafe-section pt-8 sm:pt-10">
        <div className="shell">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary-600">
                {search ? 'Search results' : activeCategoryName ?? 'The whole counter'}
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-coffee-900">
                {loading
                  ? 'Bringing it out…'
                  : search
                    ? `${filtered.length} ${filtered.length === 1 ? 'match' : 'matches'} for “${search}”`
                    : `${filtered.length} ${filtered.length === 1 ? 'thing' : 'things'} ready for you`}
              </h2>
            </div>
            {(search || activeCategory) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  selectCategory(null)
                }}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-700"
              >
                <X className="h-4 w-4" />
                Clear filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} index={index} />
              ))}
            </div>
          ) : error ? (
            <div className="mt-10 rounded-[28px] border-[3px] border-coffee-900 bg-white p-10 text-center shadow-[0_10px_0_rgba(58,10,44,0.12)]">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush-100 text-primary-600">
                <SlidersHorizontal className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold">The counter went quiet.</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-coffee-500">
                We could not reach the menu just now. It is probably us, not you. Give it another go.
              </p>
              <button type="button" onClick={load} className="cafe-btn mt-6">
                Try again
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-10 rounded-[28px] border-[3px] border-dashed border-coffee-900/25 bg-white/60 p-10 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lemon-200 text-coffee-800">
                <Search className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold">Nothing on this shelf.</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-coffee-500">
                {search
                  ? 'Try a shorter search, or browse the whole counter.'
                  : 'This category is empty today. The rest of the counter is still warm.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  selectCategory(null)
                }}
                className="cafe-btn mt-6"
              >
                See everything
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <motion.div
                layout
                className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {filtered.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.25) }}
                  >
                    <ProductCard
                      product={product}
                      index={index}
                      onQuickView={setQuickView}
                    />
                  </motion.div>
                ))}
              </motion.div>

              <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-[26px] border-[3px] border-coffee-900 bg-lemon-300 px-6 py-6 shadow-[0_8px_0_rgba(58,10,44,0.12)] sm:flex-row">
                <div>
                  <p className="font-display text-xl font-semibold text-coffee-900">Can&apos;t decide?</p>
                  <p className="text-sm font-medium text-coffee-700">
                    Start with a cinnamon roll. It has never let anyone down.
                  </p>
                </div>
                <Link to="/cart" className="cafe-btn cafe-btn-dark cafe-btn-sm shrink-0">
                  Review your bag
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <QuickView product={quickView} onClose={() => setQuickView(null)} toneIndex={0} />
    </div>
  )
}
