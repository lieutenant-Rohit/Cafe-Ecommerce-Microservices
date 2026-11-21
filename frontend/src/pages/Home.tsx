import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Cake,
  Check,
  Coffee,
  Croissant,
  CupSoda,
  Egg,
  Flame,
  Heart,
  Leaf,
  MapPin,
  Minus,
  Plus,
  Sandwich,
  ShoppingBag,
  Sparkles,
  Star,
  Timer,
  Truck,
} from 'lucide-react'
import type { Category, Product } from '@/types'
import { fetchCategories } from '@/api/categoryApi'
import { fetchProducts } from '@/api/productApi'
import useCartStore from '@/store/cartStore'
import { useCafeStatus } from '@/hooks/useCafeStatus'
import ProductCard from '@/components/shop/ProductCard'
import QuickView from '@/components/shop/QuickView'
import { confettiBurst, flyToCart, prefersReducedMotion } from '@/lib/effects'
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

const fallbackProducts: Product[] = [
  { id: 11, name: 'Cinnamon Roll', price: 140, stockQuantity: 30, imageUrl: '/images/products/cinnamon-roll.jpg', category: { id: 3, name: 'Pastries' } },
  { id: 3, name: 'Cappuccino', price: 140, stockQuantity: 50, imageUrl: '/images/products/cappuccino.jpg', category: { id: 1, name: 'Coffee' } },
  { id: 10, name: 'Croissant', price: 120, stockQuantity: 40, imageUrl: '/images/products/croissant.jpg', category: { id: 3, name: 'Pastries' } },
  { id: 15, name: 'Tiramisu', price: 250, stockQuantity: 20, imageUrl: '/images/products/tiramisu.jpg', category: { id: 4, name: 'Desserts' } },
  { id: 7, name: 'Matcha Latte', price: 180, stockQuantity: 25, imageUrl: '/images/products/matcha-latte.jpg', category: { id: 1, name: 'Coffee' } },
  { id: 12, name: 'Blueberry Muffin', price: 110, stockQuantity: 35, imageUrl: '/images/products/blueberry-muffin.jpg', category: { id: 3, name: 'Pastries' } },
  { id: 22, name: 'Avocado Toast', price: 240, stockQuantity: 25, imageUrl: '/images/products/avocado-toast.jpg', category: { id: 5, name: 'Breakfast' } },
  { id: 29, name: 'Orange Juice', price: 120, stockQuantity: 40, imageUrl: '/images/products/orange-juice.jpg', category: { id: 7, name: 'Smoothies & Juices' } },
]

const categoryStyle: Record<string, { icon: typeof Coffee; bg: string; ink: string; note: string }> = {
  Coffee: { icon: Coffee, bg: 'bg-[#FFE0CC]', ink: 'text-[#7A3410]', note: 'Pulled to order' },
  Tea: { icon: Leaf, bg: 'bg-[#C7F4E4]', ink: 'text-[#0A5E47]', note: 'Steeped fresh' },
  Pastries: { icon: Croissant, bg: 'bg-[#FFF0A8]', ink: 'text-[#7A6200]', note: 'Baked at five' },
  Desserts: { icon: Cake, bg: 'bg-[#FFD1EF]', ink: 'text-[#7A1A54]', note: 'Layered overnight' },
  Breakfast: { icon: Egg, bg: 'bg-[#E7DDFF]', ink: 'text-[#3D2670]', note: 'Served till noon' },
  Sandwiches: { icon: Sandwich, bg: 'bg-[#D8EBFF]', ink: 'text-[#134A73]', note: 'Pressed hot' },
  'Smoothies & Juices': { icon: CupSoda, bg: 'bg-[#FFE1C7]', ink: 'text-[#7A3B0E]', note: 'Blended to order' },
}

const marqueeWords = [
  'Fresh bakes every morning',
  'Beans roasted this week',
  'Free delivery over ₹499',
  'One batch of cinnamon rolls a day',
  'Rajpur Road, Dehradun',
  'Open from 6 a.m.',
]

const reviews = [
  {
    text: 'The cinnamon roll tastes like it was made for me personally. I moved my morning meeting so I could arrive before they run out.',
    name: 'Priya S.',
    meta: 'Regular since 2022',
    note: 'note-lemon',
    rotate: -2,
  },
  {
    text: 'Best cortado on Rajpur Road. You can taste that the beans were roasted this week, not last month.',
    name: 'Rahul M.',
    meta: 'Tuesday regular',
    note: 'note-mint',
    rotate: 1,
  },
  {
    text: 'I watched them roll the dough at 6:30. This place runs on a different clock — an earlier one.',
    name: 'Ananya K.',
    meta: 'Brought three friends',
    note: 'note-blush',
    rotate: -1,
  },
  {
    text: 'Cold brew that tastes like cold brew, not like a bottled apology. Every single time.',
    name: 'Deepak T.',
    meta: 'July, 18 visits',
    note: 'note-sky',
    rotate: 2,
  },
  {
    text: 'The masala chai is made from scratch — cardamom and all. My Thursday ritual for two years now.',
    name: 'Neha G.',
    meta: 'Chai loyalist',
    note: 'note-peach',
    rotate: -2,
  },
  {
    text: 'I have driven across town in the rain for their scones. Worth every red light.',
    name: 'Vikram P.',
    meta: 'Scone emergency',
    note: 'note-lilac',
    rotate: 1,
  },
]

const faqs = [
  {
    q: 'What time do the pastries come out?',
    a: 'Croissants and muffins hit the case at 5 a.m. Cinnamon rolls follow at 6 a.m., and there is exactly one batch a day. If you want one held, order ahead and we will keep it behind the counter.',
  },
  {
    q: 'Do you deliver?',
    a: 'Yes — around Rajpur Road and central Dehradun. Delivery is free on orders over ₹499, otherwise a flat ₹49. Coffee travels best within 20 minutes, so we brew it as the rider arrives.',
  },
  {
    q: 'Can I order for pickup?',
    a: 'Order here, then come to 42, Rajpur Road. We will have it bagged and waiting. Most pickup orders are ready in 15–20 minutes, and we will message you the moment it is on the counter.',
  },
  {
    q: 'Is there a dairy-free option?',
    a: 'Oat, almond, and soy milk are available for every espresso drink at no extra charge. Most of our teas are naturally dairy-free, and the kitchen can talk you through the bakes.',
  },
  {
    q: 'Do you take large orders?',
    a: 'For more than ten drinks or a full pastry box, give us a day of notice. Call the cafe or email hello@bloomscafe.in and we will build a morning around your meeting.',
  },
  {
    q: 'How do I join the Morning List?',
    a: 'Create an account and you are on it. That gets you first pick of weekend bakes, an early look at the seasonal menu, and a birthday pastry on the house.',
  },
]

const bundles = [
  {
    name: 'The Early Bird',
    note: 'For the 6 a.m. regular',
    items: ['Latte', 'Croissant', 'Orange Juice'],
    tone: 'bg-[#C7F4E4]',
    ink: 'text-[#06382B]',
    sticker: 'bg-lemon-400',
  },
  {
    name: 'The Long Table',
    note: 'Whoever you are meeting',
    items: ['Cappuccino', 'Cinnamon Roll', 'Fruit Salad'],
    tone: 'bg-[#FFD1EF]',
    ink: 'text-[#5C0F3E]',
    sticker: 'bg-accent-300',
  },
  {
    name: 'The Green Hour',
    note: 'A slower kind of morning',
    items: ['Matcha Latte', 'Avocado Toast', 'Green Tea'],
    tone: 'bg-[#E7DDFF]',
    ink: 'text-[#3D2670]',
    sticker: 'bg-lemon-300',
  },
]

function findProduct(products: Product[], name: string): Product {
  return (
    products.find((product) => product.name.toLowerCase() === name.toLowerCase()) ??
    fallbackProducts.find((product) => product.name.toLowerCase() === name.toLowerCase()) ?? {
      id: -1,
      name,
      price: 0,
      stockQuantity: 0,
      category: { id: 0, name: 'Cafe pick' },
    }
  )
}

function Kicker({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <p className={cn('cafe-kicker', dark && 'cafe-kicker-dark')}>{children}</p>
}

const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

const wordRise = {
  hidden: { opacity: 0, y: 24, rotate: 2 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.65, ease: revealEase },
  },
}

function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.55, delay, ease: revealEase }}
    >
      {children}
    </motion.div>
  )
}

function MarqueeStrip() {
  const items = [...marqueeWords, ...marqueeWords]
  return (
    <div className="relative overflow-hidden border-y-[3px] border-coffee-900 bg-coffee-900 py-3 text-cream-50">
      <div className="marquee-track">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-4 px-5 font-display text-sm font-semibold uppercase tracking-[0.16em]"
          >
            <Sparkles className="h-3.5 w-3.5 text-lemon-400" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function OutlineMarquee() {
  const words = ['Baked before sunrise', 'Poured with love', 'Rajpur Road', 'One batch a day']
  return (
    <div className="relative select-none overflow-hidden border-y-[3px] border-coffee-900 bg-cream-100 py-5" aria-hidden="true">
      <div className="marquee-track items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {words.map((word, index) => (
              <span
                key={`${word}-${copy}`}
                className={`outline-word whitespace-nowrap${index % 2 === 1 ? ' outline-word-fill' : ''}`}
              >
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const { statusText, hoursToday, greeting } = useCafeStatus()
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [quickView, setQuickView] = useState<Product | null>(null)
  const [faqOpen, setFaqOpen] = useState(0)
  const [addedBundle, setAddedBundle] = useState<string | null>(null)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterDone, setNewsletterDone] = useState(false)
  const [featuredAdded, setFeaturedAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const heroRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  const heroCopyY = useTransform(heroProgress, [0, 1], [0, -56])
  const heroCopyOpacity = useTransform(heroProgress, [0, 0.55, 1], [1, 1, 0])
  const heroLeftY = useTransform(heroProgress, [0, 1], [0, -46])
  const heroRightY = useTransform(heroProgress, [0, 1], [0, 30])
  const heroBottomY = useTransform(heroProgress, [0, 1], [0, -22])
  const heroReviewY = useTransform(heroProgress, [0, 1], [0, 54])
  const heroLeftSpread = useTransform(heroProgress, [0, 1], [0, -26])
  const heroRightSpread = useTransform(heroProgress, [0, 1], [0, 34])
  const heroBottomSpread = useTransform(heroProgress, [0, 1], [0, -14])
  const heroReviewSpread = useTransform(heroProgress, [0, 1], [0, 40])
  const heroFanScale = useTransform(heroProgress, [0, 1], [1, 0.95])
  const heroStampTurn = useTransform(heroProgress, [0, 1], [0, 55])

  const fanPointerX = useMotionValue(0)
  const fanPointerY = useMotionValue(0)
  const smoothFanX = useSpring(fanPointerX, { stiffness: 120, damping: 20, mass: 0.45 })
  const smoothFanY = useSpring(fanPointerY, { stiffness: 120, damping: 20, mass: 0.45 })

  const backCardX = useTransform(smoothFanX, [-0.5, 0.5], [-4, 4])
  const backCardY = useTransform(smoothFanY, [-0.5, 0.5], [-3, 3])
  const backCardTiltX = useTransform(smoothFanY, [-0.5, 0.5], [3, -3])
  const backCardTiltY = useTransform(smoothFanX, [-0.5, 0.5], [-4, 4])

  const rightCardX = useTransform(smoothFanX, [-0.5, 0.5], [-9, 9])
  const rightCardY = useTransform(smoothFanY, [-0.5, 0.5], [-7, 7])
  const rightCardTiltX = useTransform(smoothFanY, [-0.5, 0.5], [5, -5])
  const rightCardTiltY = useTransform(smoothFanX, [-0.5, 0.5], [-6, 6])

  const bottomCardX = useTransform(smoothFanX, [-0.5, 0.5], [-7, 7])
  const bottomCardY = useTransform(smoothFanY, [-0.5, 0.5], [-5, 5])
  const bottomCardTiltX = useTransform(smoothFanY, [-0.5, 0.5], [4, -4])
  const bottomCardTiltY = useTransform(smoothFanX, [-0.5, 0.5], [-5, 5])

  const reviewCardX = useTransform(smoothFanX, [-0.5, 0.5], [-10, 10])
  const reviewCardY = useTransform(smoothFanY, [-0.5, 0.5], [-7, 7])
  const reviewCardTiltX = useTransform(smoothFanY, [-0.5, 0.5], [5, -5])
  const reviewCardTiltY = useTransform(smoothFanX, [-0.5, 0.5], [-6, 6])

  function handleFanPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch' || prefersReducedMotion()) return
    const rect = event.currentTarget.getBoundingClientRect()
    fanPointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    fanPointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  function resetFanPointer() {
    fanPointerX.set(0)
    fanPointerY.set(0)
  }

  useEffect(() => {
    let cancelled = false
    Promise.allSettled([fetchProducts(0, 32), fetchCategories()]).then(([productResult, categoryResult]) => {
      if (cancelled) return
      if (productResult.status === 'fulfilled' && productResult.value.content.length > 0) {
        setProducts(productResult.value.content)
      }
      if (categoryResult.status === 'fulfilled' && categoryResult.value.length > 0) {
        setCategories(categoryResult.value)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const bestsellers = useMemo(() => {
    const picks = ['Cinnamon Roll', 'Cappuccino', 'Croissant', 'Tiramisu', 'Matcha Latte', 'Blueberry Muffin', 'Avocado Toast', 'Orange Juice']
    const ordered = picks
      .map((name) => products.find((product) => product.name.toLowerCase() === name.toLowerCase()))
      .filter((product): product is Product => Boolean(product))
    const extras = products.filter((product) => !ordered.some((pick) => pick.id === product.id))
    return [...ordered, ...extras].slice(0, 8)
  }, [products])

  const featured =
    products.find((product) => product.name.toLowerCase().includes('cinnamon')) ??
    fallbackProducts[0]

  const categoryCounts = useMemo(() => {
    return products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category.name] = (acc[product.category.name] ?? 0) + 1
      return acc
    }, {})
  }, [products])

  async function addBundle(bundle: (typeof bundles)[number], source?: DOMRect | null) {
    const items = bundle.items.map((name) => findProduct(products, name)).filter((product) => product.stockQuantity > 0)
    if (source) flyToCart(source, items[0]?.imageUrl)
    for (const product of items) {
      await addItem(product)
    }
    setAddedBundle(bundle.name)
    window.setTimeout(() => setAddedBundle(null), 1600)
  }

  async function addFeatured(source?: DOMRect | null) {
    if (source) flyToCart(source, featured.imageUrl)
    await addItem(featured)
    setFeaturedAdded(true)
    window.setTimeout(() => setFeaturedAdded(false), 1600)
  }

  function handleNewsletter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newsletterEmail.trim()) return
    const rect = event.currentTarget.getBoundingClientRect()
    confettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2)
    setNewsletterDone(true)
    setNewsletterEmail('')
  }

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section ref={heroRef} className="relative isolate bg-cream-50 pb-16 pt-10 sm:pt-14 lg:pb-24 lg:pt-16">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-blush-200/50 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent-200/50 blur-3xl" aria-hidden="true" />

        <div className="shell relative grid items-center gap-12 lg:grid-cols-[1.03fr_0.97fr] lg:gap-8">
          <motion.div style={{ y: heroCopyY, opacity: heroCopyOpacity }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: revealEase }}
              className="flex flex-wrap items-center gap-2.5"
            >
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-coffee-900 bg-white px-3.5 py-1.5 text-xs font-bold shadow-[3px_3px_0_#3a0a2c]">
                <span className={cn('h-2 w-2 rounded-full', statusText.startsWith('Open') ? 'bg-accent-500' : 'bg-blush-500')} />
                {statusText}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lemon-300 px-3.5 py-1.5 text-xs font-bold text-coffee-900">
                <MapPin className="h-3.5 w-3.5" />
                Rajpur Road
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: revealEase }}
              className="mt-7 font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary-600"
            >
              {greeting}, Dehradun
            </motion.p>
            <motion.h1
              aria-label="Good mornings start here."
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
              }}
              className="mt-3 font-display text-[clamp(2.9rem,7vw,5.2rem)] font-semibold leading-[0.98] tracking-tight text-coffee-900"
            >
              <span className="block">
                {['Good', 'mornings'].map((word) => (
                  <motion.span key={word} variants={wordRise} className="mr-[0.24em] inline-block last:mr-0">
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="relative inline-block overflow-visible text-primary-600">
                {['start', 'here.'].map((word) => (
                  <motion.span key={word} variants={wordRise} className="mr-[0.24em] inline-block last:mr-0">
                    {word}
                  </motion.span>
                ))}
                <motion.svg
                  aria-hidden="true"
                  viewBox="0 0 260 22"
                  className="absolute -bottom-2 left-0 w-full text-lemon-400"
                  fill="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.2 }}
                >
                  <motion.path
                    d="M4 16C58 6 194 5 256 13"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.55, duration: 0.75, ease: 'easeOut' }}
                  />
                </motion.svg>
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.38, ease: revealEase }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-coffee-500"
            >
              Small-batch coffee, pastries folded by hand at five in the morning, and a warm table on
              Rajpur Road. Order ahead and skip the queue.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.46, ease: revealEase }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link to="/menu" className="cafe-btn text-base">
                <ShoppingBag className="h-5 w-5" />
                Order something good
              </Link>
              <Link to="/#story" className="cafe-btn cafe-btn-outline text-base">
                Our story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.54, ease: revealEase }}
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-coffee-600"
            >
              <span className="flex items-center gap-2">
                <span className="flex -space-x-2">
                  {['/images/products/croissant.jpg', '/images/products/cappuccino.jpg', '/images/products/tiramisu.jpg'].map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      className="h-8 w-8 rounded-full border-2 border-cream-50 object-cover"
                    />
                  ))}
                </span>
                300+ happy regulars
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-lemon-400 text-coffee-900" />
                4.9 on Google
              </span>
              <span className="hidden items-center gap-1.5 sm:flex">
                <Timer className="h-4 w-4 text-primary-500" />
                Pickup in 15–20 min
              </span>
            </motion.div>
          </motion.div>

          {/* Fanned photo cards */}
          <motion.div
            style={{ scale: heroFanScale }}
            onPointerMove={handleFanPointerMove}
            onPointerLeave={resetFanPointer}
            className="relative mx-auto mt-2 h-[420px] w-full max-w-[500px] sm:h-[500px]"
          >
            <motion.div style={{ y: heroLeftY, x: heroLeftSpread }} className="absolute left-0 top-16 w-[52%]">
              <motion.div
                style={{
                  x: backCardX,
                  y: backCardY,
                  rotateX: backCardTiltX,
                  rotateY: backCardTiltY,
                  transformPerspective: 900,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, rotate: -15, scale: 0.94 }}
                  animate={{ opacity: 1, rotate: -9, scale: 1 }}
                  whileHover={{ scale: 1.035 }}
                  transition={{
                    opacity: { duration: 0.7, delay: 0.12, ease: revealEase },
                    rotate: { duration: 0.8, delay: 0.12, ease: revealEase },
                    scale: { type: 'spring', stiffness: 240, damping: 20 },
                  }}
                  className="animate-float-soft rounded-[26px] border-[3px] border-coffee-900 bg-white p-2.5 shadow-[0_12px_0_rgba(58,10,44,0.14)] [animation-delay:0.2s]"
                >
                  <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" aria-hidden="true" />
                  <img
                    src="/images/products/cold-brew.jpg"
                    alt="Cold brew over ice"
                    className="aspect-[4/5] w-full rounded-[18px] object-cover animate-kenburns"
                  />
                  <span className="absolute left-4 top-4 rounded-full border-2 border-coffee-900 bg-white/90 px-2.5 py-1 font-display text-[11px] font-bold text-coffee-900">
                    Cold Brew
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div style={{ y: heroRightY, x: heroRightSpread }} className="absolute right-0 top-4 w-[56%]">
              <motion.div
                style={{
                  x: rightCardX,
                  y: rightCardY,
                  rotateX: rightCardTiltX,
                  rotateY: rightCardTiltY,
                  transformPerspective: 900,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, rotate: 11, scale: 0.94 }}
                  animate={{ opacity: 1, rotate: 7, scale: 1 }}
                  whileHover={{ scale: 1.035 }}
                  transition={{
                    opacity: { duration: 0.7, delay: 0.24, ease: revealEase },
                    rotate: { duration: 0.8, delay: 0.24, ease: revealEase },
                    scale: { type: 'spring', stiffness: 240, damping: 20 },
                  }}
                  className="animate-float-soft rounded-[26px] border-[3px] border-coffee-900 bg-white p-3 shadow-[0_14px_0_rgba(58,10,44,0.16)] [animation-delay:0.7s]"
                >
                  <div className="relative">
                    <img
                      src="/images/products/cinnamon-roll.jpg"
                      alt="Fresh cinnamon roll"
                      className="aspect-square w-full rounded-[18px] object-cover animate-kenburns [animation-delay:1.2s]"
                    />
                    <span className="absolute -right-2 -top-2 z-[2] sticker h-16 w-16 rotate-6 animate-float-soft border-2 border-coffee-900 bg-lemon-300 text-[10px] leading-tight [animation-delay:1.5s]">
                      Baked
                      <br />
                      at 5 a.m.
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-1 pb-0.5 pt-3">
                    <div>
                      <p className="font-display text-base font-semibold leading-tight">Cinnamon Roll</p>
                      <p className="text-[11px] font-semibold text-coffee-400">One batch a day</p>
                    </div>
                    <span className="rounded-full bg-primary-500 px-2.5 py-1 text-xs font-bold text-white">₹140</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div style={{ y: heroBottomY, x: heroBottomSpread }} className="absolute bottom-4 left-[14%] w-[58%]">
              <motion.div
                style={{
                  x: bottomCardX,
                  y: bottomCardY,
                  rotateX: bottomCardTiltX,
                  rotateY: bottomCardTiltY,
                  transformPerspective: 900,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, rotate: 7, scale: 0.94 }}
                  animate={{ opacity: 1, rotate: -3, scale: 1 }}
                  whileHover={{ scale: 1.035 }}
                  transition={{
                    opacity: { duration: 0.7, delay: 0.36, ease: revealEase },
                    rotate: { duration: 0.8, delay: 0.36, ease: revealEase },
                    scale: { type: 'spring', stiffness: 240, damping: 20 },
                  }}
                  className="animate-float-soft rounded-[26px] border-[3px] border-coffee-900 bg-[#FFF0A8] p-2.5 shadow-[0_12px_0_rgba(58,10,44,0.14)] [animation-delay:1.1s]"
                >
                  <span className="tape -top-3 left-6 rotate-3 bg-white/80" aria-hidden="true" />
                  <div className="relative">
                    <img
                      src="/images/products/croissant.jpg"
                      alt="Butter croissant"
                      className="aspect-[5/3] w-full rounded-[18px] object-cover animate-kenburns [animation-delay:2s]"
                    />
                    <div
                      className="pointer-events-none absolute left-[80%] top-[32%] z-[1] flex -translate-x-1/2 gap-2"
                      aria-hidden="true"
                    >
                      {[0, 1, 2].map((wisp) => (
                        <span
                          key={wisp}
                          className="rounded-full bg-gradient-to-t from-white/0 via-white/90 to-white/0 blur-[3px]"
                          style={{
                            animation: 'steamDrift 4s ease-in-out infinite',
                            animationDelay: `${wisp * 0.9}s`,
                            height: `${44 + wisp * 6}px`,
                            width: `${8 + (wisp === 1 ? 3 : 0)}px`,
                            rotate: `${wisp === 1 ? 5 : wisp === 2 ? -4 : 0}deg`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-1.5 pb-0.5 pt-2.5">
                    <span className="font-display text-sm font-semibold">27 layers of butter</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div style={{ y: heroReviewY, x: heroReviewSpread }} className="absolute -right-1 bottom-16 sm:-right-4">
              <motion.div
                style={{
                  x: reviewCardX,
                  y: reviewCardY,
                  rotateX: reviewCardTiltX,
                  rotateY: reviewCardTiltY,
                  transformPerspective: 900,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, rotate: 9 }}
                  animate={{ opacity: 1, scale: 1, rotate: 3 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.55 }}
                  className="animate-float-soft rounded-2xl border-[3px] border-coffee-900 bg-white px-4 py-3 shadow-[0_7px_0_rgba(58,10,44,0.16)] [animation-delay:1.7s]"
                >
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-3 w-3 fill-lemon-400 text-coffee-900" />
                    ))}
                  </div>
                  <p className="mt-1 font-display text-sm font-semibold">“Worth the alarm.”</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-coffee-400">— Priya S.</p>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              style={{ rotate: heroStampTurn }}
              className="absolute left-[35%] top-[44%] z-[5] h-[88px] w-[88px]"
              aria-hidden="true"
            >
              <div className="relative h-full w-full animate-float-soft [animation-delay:0.6s]">
                <span className="absolute inset-0 rounded-full border-2 border-coffee-900/20 bg-cream-50/95 shadow-[0_5px_0_rgba(58,10,44,0.12)]" />
                <div className="absolute inset-0 animate-spin-stamp">
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    <defs>
                      <path id="hero-stamp-path" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
                    </defs>
                    <circle
                      cx="50"
                      cy="50"
                      r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeDasharray="2.5 3.5"
                      className="text-coffee-900/35"
                    />
                    <text
                      className="fill-coffee-900 font-display text-[8px] font-bold uppercase"
                      style={{ letterSpacing: '0.1em' }}
                    >
                      <textPath href="#hero-stamp-path" startOffset="0%">
                        Baked fresh · Rajpur Road · Est. 2021 ·
                      </textPath>
                    </text>
                  </svg>
                </div>
                <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-coffee-900 bg-accent-400 text-accent-900 shadow-[0_4px_0_rgba(58,10,44,0.18)]">
                  <Croissant className="h-5 w-5" />
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 sm:flex">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5, ease: revealEase }}
            className="flex flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-[0.26em] text-coffee-400"
            aria-hidden="true"
          >
            <span>Keep scrolling</span>
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown className="h-4 w-4" />
            </motion.span>
          </motion.div>
        </div>
      </section>

      <MarqueeStrip />

      {/* Categories */}
      <section className="cafe-section relative bg-cream-50">
        <div className="shell">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <Reveal>
              <Kicker>Pick a corner of the counter</Kicker>
              <h2 className="cafe-heading mt-3">
                Seven ways to
                <br />
                <span className="text-primary-600">start the day.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="max-w-sm text-coffee-500 md:text-right">
              <p>
                Coffee, tea, warm bakes, and proper breakfast. Everything below is made in this building,
                today.
              </p>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => {
              const style = categoryStyle[category.name] ?? {
                icon: Sparkles,
                bg: 'bg-blush-100',
                ink: 'text-coffee-800',
                note: 'A cafe favourite',
              }
              const Icon = style.icon
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={cn(index === 0 && 'sm:col-span-2 lg:col-span-2', index === 0 && 'lg:row-span-1')}
                >
                  <Link
                    to={`/menu?category=${category.id}`}
                    className={cn(
                      'group relative flex h-full items-center justify-between gap-4 overflow-hidden rounded-[26px] border-[3px] border-coffee-900 p-5 shadow-[0_8px_0_rgba(58,10,44,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_13px_0_rgba(58,10,44,0.12)]',
                      style.bg,
                      style.ink,
                    )}
                  >
                    <div className="relative z-[1]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-60">{style.note}</p>
                      <h3 className="mt-1 font-display text-2xl font-semibold leading-tight">{category.name}</h3>
                      <p className="mt-1 text-xs font-semibold opacity-60">
                        {categoryCounts[category.name] ?? '—'} items on the counter
                      </p>
                    </div>
                    <div className="relative z-[1] flex items-center gap-3">
                      <span className="grid h-14 w-14 place-items-center rounded-full border-[3px] border-coffee-900/15 bg-white/40 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
                        <Icon className="h-7 w-7" />
                      </span>
                      <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-coffee-900/20 bg-white/50 transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                    <span className="pointer-events-none absolute -bottom-8 -right-5 h-28 w-28 rounded-full border-[3px] border-coffee-900/10 bg-white/20" aria-hidden="true" />
                    <span
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[160%] -skew-x-12 bg-white/35 blur-sm transition-transform duration-700 group-hover:translate-x-[420%]"
                      aria-hidden="true"
                    />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="cafe-section relative border-y-[3px] border-coffee-900 bg-[#FFF1E7]">
        <div className="shell">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <Reveal>
              <Kicker>The usual suspects</Kicker>
              <h2 className="cafe-heading mt-3">
                What everyone
                <br />
                is <span className="text-highlight">ordering.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="flex flex-col items-start gap-3 md:items-end">
              <p className="max-w-xs text-coffee-500 md:text-right">
                Pulled, poured, and baked to order. If it is on this list, it is on the counter.
              </p>
              <Link to="/menu" className="cafe-btn cafe-btn-sm cafe-btn-dark">
                See the full menu
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bestsellers.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onQuickView={setQuickView}
                compact
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-coffee-900 py-10 text-cream-50">
        <div className="shell grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Croissant, title: 'Baked at 5 a.m.', copy: 'Still warm when the door opens.' },
            { icon: Coffee, title: 'Roasted this week', copy: 'Never an old bag in the hopper.' },
            { icon: Truck, title: 'Free over ₹499', copy: 'Around Rajpur Road and central Dehradun.' },
            { icon: Timer, title: 'Ready in 15', copy: 'Order ahead. Skip the queue.' },
          ].map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.07, ease: revealEase }}
              className="flex items-start gap-3.5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-cream-50/20 bg-cream-50/10 text-lemon-400">
                <benefit.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-base font-semibold">{benefit.title}</p>
                <p className="text-sm leading-snug text-cream-100/60">{benefit.copy}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section id="story" className="cafe-section relative scroll-mt-32 bg-cream-50">
        <div className="shell grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.65, ease: revealEase }}
            className="relative mx-auto h-[430px] w-full max-w-[470px] sm:h-[480px]"
          >
            <div className="absolute left-2 top-8 h-[72%] w-[68%] -rotate-6 overflow-hidden rounded-[26px] border-[3px] border-coffee-900 bg-white p-2.5 shadow-[0_12px_0_rgba(58,10,44,0.14)] animate-float-soft transition-shadow duration-300 hover:shadow-[0_18px_0_rgba(58,10,44,0.14)] [animation-delay:0.4s]">
              <img
                src="/images/products/croissant.jpg"
                alt="Croissants fresh from the oven"
                className="h-full w-full rounded-[18px] object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-0 h-[58%] w-[56%] rotate-6 overflow-hidden rounded-[26px] border-[3px] border-coffee-900 bg-white p-2.5 shadow-[0_12px_0_rgba(58,10,44,0.14)] animate-float-soft transition-shadow duration-300 hover:shadow-[0_18px_0_rgba(58,10,44,0.14)] [animation-delay:1s]">
              <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-2" aria-hidden="true" />
              <img
                src="/images/products/latte.jpg"
                alt="Latte with latte art"
                className="h-full w-full rounded-[18px] object-cover"
              />
            </div>
            <div className="absolute left-[6%] top-2 h-16 w-16 -rotate-6 animate-wiggle rounded-full border-[3px] border-coffee-900 bg-lemon-400 px-2 text-center font-display text-[10px] font-bold leading-tight shadow-[0_5px_0_rgba(58,10,44,0.2)]">
              <span className="grid h-full place-items-center">
                Est.
                <br />
                2021
              </span>
            </div>
            <div className="absolute -bottom-2 left-0 rotate-[-4deg] animate-float-soft rounded-2xl border-[3px] border-coffee-900 bg-white px-4 py-3 shadow-[0_7px_0_rgba(58,10,44,0.14)] [animation-delay:1.4s]">
              <p className="flex items-center gap-1.5 font-display text-sm font-semibold">
                <Heart className="h-4 w-4 fill-primary-500 text-primary-500" />
                Made on Rajpur Road
              </p>
            </div>
            <span className="absolute right-3 top-3 sticker h-20 w-20 rotate-6 animate-wiggle border-2 border-coffee-900 bg-accent-400 text-[10px] text-accent-900">
              Small
              <br />
              batch
            </span>
          </motion.div>

          <div>
            <Kicker>Our story</Kicker>
            <motion.h2
              className="cafe-heading mt-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {['We', 'bake', 'before', 'the', 'sun', 'does.'].map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.45 }}
                  className={cn(
                    'mr-[0.28em] inline-block',
                    (word === 'bake' || word === 'sun') && 'text-primary-600',
                  )}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
            <Reveal delay={0.06}>
              <p className="mt-5 max-w-lg text-coffee-500">
                BloomsCafe started with one small oven, a second-hand espresso machine, and an argument
                about how many layers a croissant really needs. Twenty-seven, it turns out.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-3 max-w-lg text-coffee-500">
                Five years later, we still make everything the slow way. Dough proves overnight. Beans are
                weighed per shot. The cinnamon rolls are rolled at dawn and gone by noon — because a batch
                made at midnight is not the same thing.
              </p>
            </Reveal>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
              className="mt-7 grid grid-cols-3 gap-3"
            >
              {[
                { value: '5 a.m.', label: 'First bake' },
                { value: '27', label: 'Butter layers' },
                { value: '1', label: 'Roll batch a day' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={{
                    hidden: { opacity: 0, y: 14, scale: 0.94 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: revealEase } },
                  }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border-2 border-coffee-900/15 bg-white px-3 py-3 text-center shadow-[0_4px_0_rgba(58,10,44,0.06)]"
                >
                  <p className="font-display text-2xl font-semibold text-primary-600">{stat.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-coffee-400">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: 0.1, ease: revealEase }}
            >
              <Link to="/menu" className="cafe-btn mt-7">
                Taste the morning
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Build your morning */}
      <section className="cafe-section relative border-y-[3px] border-coffee-900 bg-[#FFE6F4]">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" aria-hidden="true" />
        <div className="shell relative">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Kicker>Build your morning</Kicker>
            <h2 className="cafe-heading mt-3">
              Pick a set.
              <br />
              We will do the rest.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-coffee-500">
              Three morning moods, already balanced. Each set is packed together, ready in fifteen
              minutes, and comes with a smile you did not have to order.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {bundles.map((bundle, index) => {
              const bundleProducts = bundle.items.map((name) => findProduct(products, name))
              const available = bundleProducts.filter((product) => product.stockQuantity > 0)
              const total = available.reduce((sum, product) => sum + product.price, 0)
              const isAdded = addedBundle === bundle.name
              return (
                <motion.article
                  key={bundle.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: index * 0.08, ease: revealEase }}
                  className={cn(
                    'group relative flex flex-col rounded-[28px] border-[3px] border-coffee-900 p-5 shadow-[0_10px_0_rgba(58,10,44,0.14)]',
                    bundle.tone,
                    bundle.ink,
                  )}
                >
                  <span
                    className={cn(
                      'absolute -top-3 right-5 animate-float-soft rounded-full border-2 border-coffee-900 px-3 py-1 font-display text-[11px] font-bold shadow-[2px_2px_0_#3a0a2c] [animation-delay:0.8s]',
                      bundle.sticker,
                    )}
                  >
                    Set {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] opacity-60">{bundle.note}</p>
                  <h3 className="mt-1 font-display text-3xl font-semibold">{bundle.name}</h3>

                  <div className="mt-5 space-y-3">
                    {bundleProducts.map((product, productIndex) => (
                      <div key={`${bundle.name}-${product.name}`} className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 border-coffee-900/20 bg-white">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          ) : (
                            <div className="grid h-full place-items-center text-lg">☕</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-sm font-semibold">{product.name}</p>
                          <p className="text-[11px] font-semibold opacity-60">{product.category.name}</p>
                        </div>
                        <span className="font-display text-sm font-semibold">
                          ₹{product.price.toFixed(0)}
                        </span>
                        {productIndex < bundleProducts.length - 1 && (
                          <Plus className="sr-only" aria-hidden="true" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t-2 border-dashed border-coffee-900/20 pt-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-60">Together</p>
                      <p className="font-display text-2xl font-semibold">₹{total.toFixed(0)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => addBundle(bundle, event.currentTarget.getBoundingClientRect())}
                      disabled={available.length === 0 || isAdded}
                      className={cn(
                        'cafe-btn cafe-btn-sm',
                        isAdded ? 'cafe-btn-dark' : 'cafe-btn',
                      )}
                    >
                      {isAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {isAdded ? 'In your bag' : 'Add set'}
                    </button>
                  </div>
                </motion.article>
              )
            })}
          </div>

          <p className="mt-6 text-center text-xs font-semibold text-coffee-500">
            Sets are suggestions, not rules — swap anything once you are in the menu.
          </p>
        </div>
      </section>

      {/* Featured product */}
      <section className="cafe-section relative overflow-hidden bg-cream-50">
        <div className="shell">
          <div className="relative grid overflow-hidden rounded-[36px] border-[3px] border-coffee-900 bg-white shadow-[0_14px_0_rgba(58,10,44,0.12)] lg:grid-cols-2">
            <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-[#FFF0A8] p-8 sm:min-h-[420px]">
              <span className="absolute left-6 top-6 sticker h-20 w-20 -rotate-6 animate-wiggle border-2 border-coffee-900 bg-primary-500 text-[10px] text-white">
                Bake
                <br />
                of the
                <br />
                week
              </span>
              <div className="absolute inset-6 animate-spin-slow rounded-full border-[3px] border-dashed border-coffee-900/20" aria-hidden="true" />
              <motion.img
                src={featured.imageUrl ?? '/images/products/cinnamon-roll.jpg'}
                alt={featured.name}
                initial={{ scale: 0.92, rotate: -3 }}
                whileInView={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.025 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: revealEase }}
                className="relative z-[1] aspect-square w-[78%] max-w-[340px] rounded-full border-[3px] border-coffee-900 object-cover shadow-[0_12px_0_rgba(58,10,44,0.16)] animate-float-soft [animation-delay:0.4s]"
              />
              <span className="absolute bottom-7 right-7 z-[2] rotate-3 animate-float-soft rounded-2xl border-[3px] border-coffee-900 bg-white px-4 py-2 shadow-[0_5px_0_rgba(58,10,44,0.16)] [animation-delay:1.1s]">
                <span className="block font-display text-2xl font-semibold">₹{featured.price.toFixed(0)}</span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-coffee-400">each</span>
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: revealEase }}
              className="flex flex-col justify-center p-7 sm:p-10"
            >
              <Kicker>Only 30 a day</Kicker>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.03] text-coffee-900 sm:text-5xl">
                The cinnamon roll
                <br />
                <span className="text-primary-600">worth the alarm.</span>
              </h2>
              <p className="mt-4 max-w-md text-coffee-500">
                Rolled by hand at dawn, proofed slowly, and glazed while still warm. There is one batch a
                day. When the case is empty, it is genuinely empty.
              </p>

              <ul className="mt-5 space-y-2 text-sm font-semibold text-coffee-600">
                {['Hand-rolled at 6 a.m.', 'Cinnamon from the morning grind', 'Glazed while still warm'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-accent-100 text-accent-700">
                      <Check className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={(event) => addFeatured(event.currentTarget.getBoundingClientRect())}
                  disabled={featured.stockQuantity <= 0 || featuredAdded}
                  className={cn('cafe-btn', featuredAdded && 'cafe-btn-mint')}
                >
                  {featuredAdded ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
                  {featuredAdded ? 'Added to your bag' : `Add ${featured.name} · ₹${featured.price.toFixed(0)}`}
                </button>
                <Link to="/menu" className="cafe-btn cafe-btn-outline">
                  More bakes
                </Link>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-coffee-400">
                <Flame className="h-4 w-4 text-primary-500" />
                Usually sold out by noon on weekends.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <OutlineMarquee />

      {/* Gallery */}
      <section className="cafe-section relative bg-cream-50">
        <div className="shell">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <Reveal>
              <Kicker>From the counter</Kicker>
              <h2 className="cafe-heading mt-3">
                A morning,
                <br />
                <span className="text-primary-600">in pictures.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="max-w-xs text-coffee-500 md:text-right">
              <p>Shot on Rajpur Road, between the first bake and the last flat white.</p>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              { src: '/images/products/croissant.jpg', title: 'Fig. 01', note: 'Proved overnight', rotate: -2, bg: 'bg-[#FFF0A8]' },
              { src: '/images/products/grilled-cheese.jpg', title: 'Fig. 02', note: 'The noon counter', rotate: 2, bg: 'bg-[#D8EBFF]' },
              { src: '/images/products/blueberry-muffin.jpg', title: 'Fig. 03', note: 'Baked while you sleep', rotate: -1, bg: 'bg-[#FFD1EF]' },
            ].map((photo, index) => (
              <motion.figure
                key={photo.title}
                initial={{ opacity: 0, y: 34, rotate: photo.rotate - 5 }}
                whileInView={{ opacity: 1, y: 0, rotate: photo.rotate }}
                whileHover={{ rotate: 0, y: -6 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55, delay: index * 0.09, ease: revealEase }}
                className={cn(
                  'group relative rounded-[26px] border-[3px] border-coffee-900 p-2.5 shadow-[0_10px_0_rgba(58,10,44,0.13)]',
                  photo.bg,
                )}
              >
                <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-1" aria-hidden="true" />
                <img
                  src={photo.src}
                  alt={photo.note}
                  className="aspect-[4/5] w-full rounded-[18px] border-2 border-coffee-900/10 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <figcaption className="flex items-center justify-between gap-3 px-1.5 py-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-coffee-500">{photo.title}</span>
                  <span className="font-display text-sm font-semibold text-coffee-900">{photo.note}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="cafe-section relative overflow-hidden border-y-[3px] border-coffee-900 bg-[#FFF1E7]">
        <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-lemon-200/60 blur-3xl" aria-hidden="true" />
        <div className="shell relative">
          <Reveal className="mx-auto max-w-xl text-center">
            <Kicker>Notes from the regulars</Kicker>
            <h2 className="cafe-heading mt-3">Stuck to our noticeboard.</h2>
            <p className="mx-auto mt-4 max-w-md text-coffee-500">
              Real notes from real people who set alarms for pastries. We keep the originals by the till.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: -42, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  type: 'spring',
                  stiffness: 130,
                  damping: 17,
                  delay: index * 0.06,
                }}
                className="h-full"
              >
                <motion.figure
                  style={{ rotate: review.rotate }}
                  whileHover={{ rotate: 0, y: -5 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  className={cn('note-card flex h-full min-h-[210px] flex-col p-6', review.note)}
                >
                  <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-2" aria-hidden="true" />
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star key={star} className="h-3.5 w-3.5 fill-coffee-900 text-coffee-900" />
                    ))}
                  </div>
                  <blockquote className="mt-3 flex-1 font-display text-[1.05rem] font-medium leading-snug">
                    “{review.text}”
                  </blockquote>
                  <figcaption className="mt-4 flex items-center justify-between gap-3 border-t-2 border-dashed border-coffee-900/15 pt-3">
                    <span className="font-display text-sm font-semibold">{review.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-coffee-800/55">{review.meta}</span>
                  </figcaption>
                </motion.figure>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link to="/register" className="cafe-btn cafe-btn-dark">
              Join 300+ morning people
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="cafe-section scroll-mt-32 bg-cream-50">
        <div className="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <Kicker>Before you ask</Kicker>
            <h2 className="cafe-heading mt-3">
              The small
              <br />
              print.
            </h2>
            <p className="mt-4 max-w-sm text-coffee-500">
              Delivery, pickup, dairy-free milk, and the cinnamon roll situation. If your question is not
              here, the counter phone is always answered.
            </p>
            <a
              href="tel:+911352650127"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700"
            >
              Call the cafe
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <div className="mt-8 rotate-[-2deg] animate-float-soft rounded-2xl border-[3px] border-coffee-900 bg-lemon-300 p-4 shadow-[0_6px_0_rgba(58,10,44,0.14)] [animation-delay:0.9s]">
              <p className="font-display text-sm font-semibold">Today at the cafe</p>
              <p className="mt-1 text-sm text-coffee-700">{hoursToday}</p>
              <p className="mt-1 text-xs font-semibold text-coffee-600">42, Rajpur Road, Dehradun</p>
            </div>
          </Reveal>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const open = faqOpen === index
              return (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: index * 0.05, ease: revealEase }}
                  className={cn(
                    'overflow-hidden rounded-2xl border-[3px] transition-colors duration-200',
                    open ? 'border-coffee-900 bg-[#FFE6F4]' : 'border-coffee-900/15 bg-white',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpen(open ? -1 : index)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-display text-base font-semibold text-coffee-900">{faq.q}</span>
                    <span
                      className={cn(
                        'grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-coffee-900 transition-transform duration-200',
                        open ? 'rotate-180 bg-coffee-900 text-cream-50' : 'bg-white',
                      )}
                    >
                      {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-300 ease-out',
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-[15px] leading-relaxed text-coffee-600">{faq.a}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#FFD84A] py-12">
        <div className="shell flex flex-col items-center justify-between gap-6 lg:flex-row">
          <Reveal className="max-w-lg text-center lg:text-left">
            <p className="cafe-kicker cafe-kicker-dark">The Friday drop</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-coffee-900 sm:text-4xl">
              Batch counts, secret specials, no spam.
            </h2>
            <p className="mt-2 text-sm font-medium text-coffee-700">
              One email on Friday morning. Usually about pastries. Occasionally about a new espresso.
            </p>
          </Reveal>

          <div className="w-full max-w-md">
            {newsletterDone ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center gap-3 rounded-2xl border-[3px] border-coffee-900 bg-white px-5 py-4 shadow-[0_6px_0_rgba(58,10,44,0.14)]"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-700">
                  <motion.span
                    initial={{ scale: 0.4, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 15, delay: 0.1 }}
                  >
                    <Check className="h-5 w-5" />
                  </motion.span>
                </span>
                <div>
                  <p className="font-display text-base font-semibold">You are on the list.</p>
                  <p className="text-xs font-semibold text-coffee-400">See you Friday, before the rolls go.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="cafe-input border-coffee-900 bg-white shadow-[0_4px_0_rgba(58,10,44,0.14)]"
                />
                <button type="submit" className="cafe-btn cafe-btn-dark shrink-0">
                  Join the list
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
            <p className="mt-2 text-center text-[11px] font-semibold text-coffee-600 sm:text-left">
              By joining you agree to our{' '}
              <Link to="/privacy" className="underline decoration-2 underline-offset-2">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="scallop-top relative bg-coffee-900 px-5 pb-20 pt-16 text-cream-50">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-10" aria-hidden="true" />
        <div className="pointer-events-none absolute left-[8%] top-28 h-56 w-56 rounded-full bg-primary-500/20 blur-3xl animate-breathe" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-10 right-[10%] h-64 w-64 rounded-full bg-accent-500/10 blur-3xl animate-breathe [animation-delay:2.5s]" aria-hidden="true" />
        <div className="shell relative text-center">
          <span className="sticker mx-auto h-16 w-16 rotate-6 animate-wiggle border-2 border-cream-50/30 bg-primary-500 text-[10px]">
            See
            <br />
            you
            <br />
            soon
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: revealEase }}
            className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.02]"
          >
            Your table is ready.
            <br />
            <span className="text-lemon-400">Your usual is waiting.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: revealEase }}
            className="mx-auto mt-5 max-w-md text-cream-100/65"
          >
            Order ahead for pickup, get it delivered, or just come sit with us. The coffee is already on.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.18, ease: revealEase }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link to="/menu" className="cafe-btn cafe-btn-mint text-base">
              <ShoppingBag className="h-5 w-5" />
              Order now
            </Link>
            <Link
              to="/register"
              className="cafe-btn text-base"
            >
              Join the Morning List
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.2em] text-cream-100/40"
          >
            <span>42, Rajpur Road</span>
            <span className="text-primary-400">✦</span>
            <span>Open from 6 a.m.</span>
            <span className="text-primary-400">✦</span>
            <span>Est. 2021</span>
          </motion.p>
        </div>
      </section>

      <QuickView product={quickView} onClose={() => setQuickView(null)} toneIndex={0} />
    </div>
  )
}
