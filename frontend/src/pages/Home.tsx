import { Link } from 'react-router-dom'
import { Coffee, Croissant, Flame, Timer, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import { Hero2 } from '../components/ui/hero-2'
import Marquee from '../components/ui/marquee'
import Reveal from '../components/ui/reveal'
import Parallax from '../components/ui/parallax'
import Tilt from '../components/ui/tilt'
import BlobMesh from '../components/ui/blob-mesh'
import Grain from '../components/ui/grain'
import Footer from '../components/layout/Footer'
import { Spotlight } from '../components/motion-primitives/spotlight'
import { Magnetic } from '../components/motion-primitives/magnetic'
import { Badge } from '../components/ui/badge'
import { BorderTrail } from '../components/motion-primitives/border-trail'
import { NumberTicker } from '../components/motion-primitives/number-ticker'
import { WordRotate } from '../components/motion-primitives/word-rotate'
import { AnimatedGroup } from '../components/motion-primitives/animated-group'
import CoffeeMeter from '../components/ui/coffee-meter'
import { useCafeStatus } from '../hooks/useCafeStatus'

const tickerItems = [
  'Espresso pulled to order',
  'Cinnamon rolls until noon',
  'Croissants from 5 a.m.',
  'Cortados, double shot',
  'Tiramisu, layered last night',
  'Cold brew, steeped 18 hours',
  'Chai with real cardamom',
  'Blueberry muffins still warm',
  'Matcha, whisked to order',
]

const pillars = [
  {
    title: 'The Morning Bake',
    desc: 'Croissants folded to twenty-seven layers and baked at five, while the street is still dark. One batch of rolls a day — after that, the case is empty.',
  },
  {
    title: 'The Sandwich Counter',
    desc: 'Grilled cheese on thick sourdough, turkey clubs pressed and cut on the diagonal. Between 11:30 and close, it\u2019s the busiest seat in the house.',
  },
  {
    title: 'The Breakfast Shelf',
    desc: 'Blueberry muffins out of the oven by 5:30 — warm, crusty-topped, and gone before the first meeting ends.',
  },
]

const stats = [
  { value: 5, suffix: '', label: 'A.M.', caption: 'first bake hits the oven' },
  { value: 27, suffix: '', label: 'layers', caption: 'of butter in every croissant' },
  { value: 1, suffix: '', label: 'batch', caption: 'of cinnamon rolls — per day' },
  { value: 60, suffix: '°C', label: 'milk', caption: 'steamed to, never a degree more' },
]

const featuredItems = [
  { name: 'Cinnamon Roll', price: 4.25, category: 'Pastries', desc: 'Rolled at 6 a.m., glazed while still warm. One batch a day — gone by noon.', image: '/images/products/cinnamon-roll.jpg' },
  { name: 'Cortado', price: 4.0, category: 'Hot Beverages', desc: 'A double shot pulled to order, cut with a short pour of steamed milk.', image: '/images/products/espresso.jpg' },
  { name: 'Tiramisu', price: 6.5, category: 'Desserts', desc: 'Layered the night before, dusted with cocoa just before service.', image: '/images/products/tiramisu.jpg' },
  { name: 'Croissant', price: 3.75, category: 'Pastries', desc: 'Twenty-seven layers of butter. Laminated yesterday, baked this morning.', image: '/images/products/croissant.jpg' },
]

const processSteps = [
  { n: '01', icon: Coffee, title: 'Roasted this week', desc: 'Beans travel from roaster to hopper in under seven days. No aging shelf, no compromise.' },
  { n: '02', icon: Croissant, title: 'Laminated overnight', desc: 'Dough proofs slowly at 4 a.m. and bakes at five — twenty-seven layers, every single morning.' },
  { n: '03', icon: Flame, title: 'Pulled at nine bars', desc: 'Every shot weighed and timed. Milk steamed to sixty degrees — smooth, never burned.' },
  { n: '04', icon: Timer, title: 'Gone by noon', desc: 'One batch of cinnamon rolls a day. When it\u2019s gone, it\u2019s gone — tomorrow\u2019s alarm is already set.' },
]

const testimonials = [
  { text: 'The cinnamon roll tastes like it was made for me personally. I moved my morning meeting to arrive before they run out.', author: 'Sarah M., regular since 2021' },
  { text: 'Best cortado on the block. You can taste that the beans were roasted this week.', author: 'James K.' },
  { text: 'I watched them roll the dough at 6:30. This place runs on a different clock — an earlier one.', author: 'Emily R.' },
  { text: 'Cold brew that tastes like cold brew, not like a bottled apology. Every single time.', author: 'Priya S.' },
  { text: 'The chai is made from scratch — cardamom and all. My Thursday ritual for two years now.', author: 'Daniel O.' },
  { text: "I've driven across town in the rain for their scones. Worth every red light.", author: 'Maya L.' },
]

const photos = [
  { src: '/images/products/croissant.jpg', caption: 'Fig. 01 — proved overnight', note: 'twenty-seven layers of butter' },
  { src: '/images/products/grilled-cheese.jpg', caption: 'Fig. 02 — the noon counter', note: 'sourdough, pressed hot' },
  { src: '/images/products/blueberry-muffin.jpg', caption: 'Fig. 03 — the breakfast shelf', note: 'baked while you sleep' },
]

function Kicker({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-[11px] md:text-xs font-semibold uppercase tracking-[0.3em] ${
        light ? 'text-cream-200/80' : 'text-primary-600'
      }`}
    >
      {children}
    </p>
  )
}

export default function Home() {
  const { tickerLead } = useCafeStatus()

  return (
    <div>
      <Hero2 />
      <CoffeeMeter />

      {/* Masthead strip */}
      <section aria-hidden="true" className="relative z-10 bg-cream-50 text-coffee-900 border-y border-coffee-900/15 py-3.5 overflow-hidden">
        <div className="flex items-center">
          <span className="shrink-0 pl-5 pr-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-600">
            Morning edition
          </span>
          <div className="min-w-0 flex-1">
            <Marquee
              items={[tickerLead, ...tickerItems.map((i) => i.toUpperCase())]}
              duration={30}
              pauseOnHover
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-coffee-700/80"
              separatorClassName="bg-primary-500/70"
            />
          </div>
          <span className="hidden md:block shrink-0 pl-4 pr-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-coffee-400">
            24 seats · est. 2019
          </span>
        </div>
      </section>

      {/* 02 — What we make */}
      <section className="relative overflow-hidden bg-cream-50 py-20 md:py-28">
        <Grain opacity={0.04} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="max-w-2xl">
                <Kicker>What we make</Kicker>
                <h2 className="mt-4 font-display text-4xl md:text-6xl font-semibold leading-[1.02] text-coffee-900">
                  Three arts, practiced <em className="italic text-primary-600">every morning.</em>
                </h2>
              </div>
              <div className="md:text-right max-w-xs">
                <p className="text-coffee-500 leading-relaxed">
                  Every bean, batch, and bite happens in this building — today.
                </p>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-coffee-400">
                  Issue no. 041 · first bake 5:00 a.m.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Photo spread */}
          <div className="mt-14 grid md:grid-cols-12 gap-6 md:gap-8">
            <div className="md:col-span-6 lg:col-span-7 relative overflow-hidden rounded-3xl group">
              <Parallax from={0} to={-70} className="h-full w-full">
                <img
                  src={photos[0].src}
                  alt={photos[0].caption}
                  className="w-full h-[26rem] md:h-full min-h-[26rem] object-cover scale-[1.35] group-hover:scale-[1.45] transition-transform duration-700"
                />
              </Parallax>
              <figcaption className="absolute bottom-0 inset-x-0 z-[2] bg-coffee-950/75 backdrop-blur-sm text-cream-100 px-5 py-3.5 flex items-center justify-between gap-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">{photos[0].caption}</span>
                <span className="font-display italic text-cream-200/80 text-sm">{photos[0].note}</span>
              </figcaption>
            </div>
            <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-6">
              {[photos[1], photos[2]].map((photo, i) => (
                <div
                  key={photo.src}
                  className={`relative overflow-hidden rounded-3xl group ${i === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform duration-500`}
                >
                  <Parallax from={0} to={-50} className="h-full w-full">
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-56 object-cover scale-[1.3] group-hover:scale-[1.4] transition-transform duration-700"
                    />
                  </Parallax>
                  <figcaption className="absolute bottom-0 inset-x-0 z-[2] bg-cream-50/90 backdrop-blur-sm text-coffee-900 px-4 py-2.5 flex items-center justify-between gap-4 border-t border-coffee-900/10">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.22em]">{photo.caption}</span>
                    <span className="font-display italic text-coffee-500 text-[11px]">{photo.note}</span>
                  </figcaption>
                </div>
              ))}
            </div>
          </div>

          {/* Pillars */}
          <AnimatedGroup className="mt-16 md:mt-20 grid md:grid-cols-3 gap-y-12 md:gap-x-10 md:divide-x md:divide-coffee-900/10" stagger={0.12}>
            {pillars.map((p, i) => (
              <div key={p.title} className="group md:px-10 first:md:pl-0 last:md:pr-0">
                <span className="block font-display text-[5.5rem] leading-[0.75] text-coffee-900/[0.05] select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold text-coffee-900 group-hover:text-primary-700 transition-colors">
                  {p.title}
                </h3>
                <p className="mt-3 text-coffee-500 leading-relaxed">{p.desc}</p>
                <Link
                  to="/menu"
                  className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary-600"
                >
                  Keep reading
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </AnimatedGroup>
        </div>
      </section>

      {/* 03 — Fact box */}
      <section className="relative overflow-hidden bg-primary-600 text-cream-50 py-20 md:py-24 border-y border-coffee-900/10">
        <BlobMesh variant="cool" className="opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[1fr_1.3fr] gap-12 md:gap-16 items-center">
            <Reveal>
              <div>
                <Kicker light>The numbers behind the morning</Kicker>
                <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold leading-[1.05]">
                  Five o&apos;clock <em className="italic text-cream-200">sharp.</em>
                </h2>
                <p className="mt-5 text-cream-100/85 max-w-md leading-relaxed">
                  The small metrics that set the day&apos;s pace — logged every morning, stuck to every afternoon.
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-x-10 gap-y-12">
              {stats.map((s) => (
                <div key={s.label} className="group">
                  <div className="font-display text-5xl md:text-6xl font-semibold text-cream-50">
                    <NumberTicker value={s.value} suffix={s.suffix} duration={1.6} />
                  </div>
                  <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-cream-200/70">
                    {s.label}
                  </div>
                  <div className="mt-1.5 text-sm text-cream-100/75">{s.caption}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 04 — Featured */}
      <section className="relative overflow-hidden bg-cream-100 py-20 md:py-28">
        <BlobMesh variant="warm" className="opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <Reveal>
              <div className="max-w-xl">
                <Kicker>This week&apos;s staples</Kicker>
                <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold leading-[1.05] text-coffee-900">
                  Featured, <em className="italic text-primary-600">until they&apos;re gone.</em>
                </h2>
                <p className="mt-4 text-coffee-500 leading-relaxed">
                  The four things we never take off the menu — until they&apos;re gone.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Link
                to="/menu"
                className="hidden md:inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary-600 hover:text-primary-500 transition-colors"
              >
                Full menu
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>

          <AnimatedGroup className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.09}>
            {featuredItems.map((item, i) => (
              <Tilt key={item.name} intensity={7} className="h-full">
                <Link
                  to="/menu"
                  className="group relative block h-full rounded-2xl bg-white border border-cream-200 overflow-hidden hover:shadow-xl hover:shadow-primary-900/5 transition-all duration-300"
                >
                  <BorderTrail radius={16} />
                  <Spotlight size={260} />
                  <span className="absolute -bottom-1 -right-1 z-[2] font-display italic text-[7rem] leading-[0.7] text-coffee-900/[0.05] select-none pointer-events-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="relative h-44 overflow-hidden">
                    <Parallax from={0} to={-32} className="h-full w-full">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover scale-[1.36] group-hover:scale-[1.5] transition-transform duration-700"
                      />
                    </Parallax>
                    <span className="absolute top-3 right-3 bg-primary-600 text-cream-50 text-sm font-bold px-3 py-1.5 rounded-full shadow-md">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent-700">
                      {item.category}
                    </span>
                    <h3 className="font-display text-xl font-semibold text-coffee-900 mt-2 group-hover:text-primary-700 transition-colors">
                      {item.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-coffee-400 leading-relaxed">{item.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">
                        Order now
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                      <Sparkles className="w-4 h-4 text-accent-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </Link>
              </Tilt>
            ))}
          </AnimatedGroup>
          <Reveal delay={0.15}>
            <div className="flex justify-center mt-12">
              <Magnetic intensity={0.3} range={140}>
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 text-coffee-800 bg-cream-50 hover:bg-white px-8 py-3.5 rounded-full font-medium border border-cream-300 hover:border-primary-300 shadow-sm transition-all"
                >
                  View the full menu
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 05 — How it's made */}
      <section className="relative overflow-hidden bg-cream-50 py-20 md:py-28">
        <Parallax from={-28} to={28} className="absolute inset-0 h-full w-full" style={{ scale: 1.1 }}>
          <img
            src="/backgrounds/blob-section.svg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
        </Parallax>
        <Grain opacity={0.07} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <Kicker>From dark oven to open doors</Kicker>
              <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold leading-[1.05] text-coffee-900">
                The morning, <em className="italic text-primary-600">step by step.</em>
              </h2>
              <p className="mt-4 text-coffee-500 max-w-md mx-auto leading-relaxed">
                Four moves between dormant ovens and your first sip — clocked by the same crew every day.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 border-b border-coffee-900/10">
            {processSteps.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.08}>
                <div className="group md:grid md:grid-cols-[6rem_1fr_auto] gap-x-8 gap-y-3 items-start py-8 border-t border-coffee-900/10 transition-all duration-300 md:hover:pl-4">
                  <span className="font-display text-4xl md:text-5xl font-semibold text-coffee-900/15 leading-none">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-coffee-900 group-hover:text-primary-700 transition-colors">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-coffee-500 leading-relaxed max-w-xl">{step.desc}</p>
                  </div>
                  <div className="hidden md:flex w-12 h-12 rounded-full bg-white border border-coffee-900/10 items-center justify-center shadow-sm group-hover:border-primary-300 group-hover:shadow-[0_0_0_6px_rgba(211,126,88,0.08)] transition-all duration-300">
                    <step.icon className="w-5 h-5 text-primary-600 group-hover:text-accent-600 group-hover:rotate-12 transition-all duration-300" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — Testimonials */}
      <section className="relative overflow-hidden bg-cream-100 py-20 md:py-28">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <Kicker>Letters to the editor</Kicker>
              <h2 className="mt-4 font-display text-3xl md:text-5xl font-semibold leading-[1.05]">
                <WordRotate
                  words={["Regulars, in their own words.", "They set alarms for it.", "The queue agrees."]}
                  className="text-coffee-900"
                  duration={2800}
                />
              </h2>
            </div>
          </Reveal>
        </div>
        <Marquee duration={42} reverse pauseOnHover className="py-2 mt-10">
          {testimonials.map((t, i) => (
            <div
              key={t.author}
              className="w-[24rem] md:w-[27rem] shrink-0 mx-3 bg-white rounded-2xl border border-cream-200 p-8 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/5 transition-all duration-300 relative"
            >
              <span className="font-display text-7xl leading-none text-primary-300/60 select-none block absolute -top-2 left-6">
                &ldquo;
              </span>
              <span className="absolute top-6 right-7 font-display italic text-2xl text-coffee-900/15 select-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="mt-6 font-display italic text-coffee-800 leading-relaxed line-clamp-4">{t.text}</p>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-coffee-400">— {t.author}</p>
            </div>
          ))}
        </Marquee>
        <Reveal delay={0.1}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center">
            <Magnetic intensity={0.3} range={140}>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-cream-50 px-8 py-3.5 rounded-full font-medium transition-colors shadow-[0_4px_20px_rgba(211,126,88,0.3)]"
              >
                Taste it yourself
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-coffee-950 py-20 md:py-28">
        <Parallax from={0} to={90} className="absolute inset-0 h-full w-full" style={{ scale: 1.16 }}>
          <img
            src="/backgrounds/cta-bg.svg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </Parallax>
        <BlobMesh variant="deep" className="opacity-80" />
        <Grain opacity={0.1} className="z-[6]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center z-10">
          <Reveal>
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="bg-cream-100/10 text-cream-100 border-cream-100/20 backdrop-blur gap-1.5 px-3.5 py-1 text-[12px] md:text-[13px] uppercase tracking-wide">
                <Croissant className="w-3.5 h-3.5" />
                Join the Morning List
              </Badge>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-cream-50 leading-tight">
              Ready to start your <em className="italic text-accent-200">morning</em> here?
            </h2>
            <p className="mt-4 text-cream-200/80 max-w-lg mx-auto">
              Get the day&apos;s batch count, loyalty rewards, and first pick of weekend bakes — before the door opens.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Magnetic intensity={0.3} range={140}>
                <Link
                  to="/register"
                  className="relative inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-cream-50 px-8 py-3.5 rounded-full text-lg font-medium transition-colors shadow-[0_4px_24px_rgba(211,126,88,0.35)]"
                >
                  <BorderTrail radius={999} color="rgba(219,237,226,0.55)" />
                  <Spotlight size={180} />
                  Join the Morning List
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Magnetic>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-cream-100/10 hover:bg-cream-100/20 text-cream-100 px-8 py-3.5 rounded-full text-lg font-medium border border-cream-100/25 backdrop-blur transition-colors"
              >
                Browse the menu
              </Link>
            </div>
            <div className="mt-8 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-cream-200/60">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-400" />
              </span>
              Next bake · 5:00 a.m. — usually gone by noon
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}

