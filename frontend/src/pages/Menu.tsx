import { useCallback, useEffect, useState } from 'react'
import type { Category, Product } from '../types'
import { fetchCategories } from '../api/categoryApi'
import { fetchProducts, fetchProductsByCategory } from '../api/productApi'
import useCartStore from '../store/cartStore'
import Pagination from '../components/ui/Pagination'
import Reveal from '../components/ui/reveal'

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [addedId, setAddedId] = useState<number | null>(null)

  const addItem = useCartStore((s) => s.addItem)

  const loadProducts = useCallback(() => {
    setLoading(true)
    setError(false)
    const load = activeCategory
      ? fetchProductsByCategory(activeCategory, page)
      : fetchProducts(page)
    load
      .then((data) => {
        setProducts(data.content)
        setTotalPages(data.totalPages)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [activeCategory, page])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    function onFocus() { loadProducts() }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [loadProducts])

  function handleCategoryClick(categoryId: number | null) {
    setActiveCategory(categoryId)
    setPage(0)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-600 mb-2">The counter</p>
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-coffee-900">Our Menu</h1>
        <p className="mt-2 text-coffee-500 max-w-md">
          Everything below was made today. If it's gray, we've run out — check the clock, come back.
        </p>
      </Reveal>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <Reveal className="w-full md:w-56 shrink-0" delay={0.1}>
          <h2 className="text-sm font-semibold text-coffee-400 uppercase tracking-wider mb-3">
            Categories
          </h2>
          <div className="flex md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`whitespace-nowrap text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === null
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-coffee-600 hover:bg-cream-100'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`whitespace-nowrap text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-coffee-600 hover:bg-cream-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-cream-200 overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-cream-200" />
                  <div className="p-5">
                    <div className="h-4 bg-cream-200 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-cream-200 rounded w-1/2 mb-4" />
                    <div className="h-8 bg-cream-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-coffee-500 mb-4">Failed to load menu. Check your connection.</p>
              <button onClick={loadProducts} className="bg-primary-600 text-cream-50 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors">
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <p className="text-coffee-500 text-center py-16">No products found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, i) => (
                  <Reveal key={product.id} delay={(i % 6) * 0.06}>
                    <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                      <div className="aspect-[4/3] bg-cream-100 overflow-hidden">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-cream-400">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="mb-1">
                          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                            {product.category.name}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-coffee-900 mt-1">
                          {product.name}
                        </h3>
                        <p className="text-2xl font-bold text-coffee-900 mt-2">
                          ${product.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-coffee-400 mt-1">
                          {product.stockQuantity > 0
                            ? `${product.stockQuantity} in stock`
                            : 'Out of stock'}
                        </p>
                        <button
                          onClick={() => {
                            addItem(product)
                            setAddedId(product.id)
                            setTimeout(() => setAddedId(null), 1500)
                          }}
                          disabled={product.stockQuantity === 0}
                          className="mt-4 w-full bg-primary-600 hover:bg-primary-500 text-cream-50 py-2 rounded-full text-sm font-medium disabled:bg-cream-300 disabled:text-coffee-400 disabled:cursor-not-allowed transition-colors"
                        >
                          {addedId === product.id ? 'Added!' : product.stockQuantity > 0 ? 'Add to Cart' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={0.1}>
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </Reveal>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

