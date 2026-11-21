import { Link } from 'react-router-dom'
import { Camera, Clock, Mail, MapPin, Phone, Send } from 'lucide-react'

const letters = [...'BLOOMSCAFE']
const letterColors = ['#FF5FB7', '#25D3A0', '#FFD84A', '#6FB8FF', '#FF9A4A']

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="block py-1 text-[15px] font-medium text-cream-100/65 transition-colors hover:text-cream-50">
      {children}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="scallop-top scallop-top-lg relative mt-16 bg-coffee-900 px-5 pb-8 pt-14 text-cream-100 sm:px-8">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1fr_0.9fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="font-display text-3xl font-semibold text-primary-400">
                Blooms<span className="text-cream-50">Cafe</span>
              </span>
              <span className="h-2.5 w-2.5 rotate-12 rounded-[35%] bg-accent-500" />
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-cream-100/60">
              Small batch coffee, pastries folded by hand, and a warm table on Rajpur Road. Open early,
              always.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BloomsCafe on Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-cream-100/15 text-cream-100/70 transition-colors hover:border-primary-400 hover:bg-primary-500/10 hover:text-cream-50"
              >
                <Camera className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@bloomscafe.in"
                aria-label="Email BloomsCafe"
                className="grid h-10 w-10 place-items-center rounded-full border border-cream-100/15 text-cream-100/70 transition-colors hover:border-primary-400 hover:bg-primary-500/10 hover:text-cream-50"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="tel:+911352650127"
                aria-label="Call BloomsCafe"
                className="grid h-10 w-10 place-items-center rounded-full border border-cream-100/15 text-cream-100/70 transition-colors hover:border-primary-400 hover:bg-primary-500/10 hover:text-cream-50"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-cream-50">Shop</h4>
            <div className="mt-3">
              <FooterLink to="/menu">Full menu</FooterLink>
              <FooterLink to="/menu?category=1">Coffee</FooterLink>
              <FooterLink to="/menu?category=3">Pastries</FooterLink>
              <FooterLink to="/menu?category=5">Breakfast</FooterLink>
              <FooterLink to="/menu?category=7">Cold drinks</FooterLink>
            </div>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-cream-50">Visit</h4>
            <div className="mt-3 space-y-3 text-[15px] text-cream-100/65">
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary-400" />
                42, Rajpur Road
                <br />
                Dehradun, Uttarakhand 248001
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-accent-400" />
                Mon–Fri 6 a.m. – 8 p.m.
              </p>
              <p className="pl-6 text-cream-100/55">Sat–Sun 7 a.m. – 9 p.m.</p>
            </div>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-cream-50">Help</h4>
            <div className="mt-3">
              <FooterLink to="/#faq">FAQ</FooterLink>
              <FooterLink to="/my-orders">My orders</FooterLink>
              <FooterLink to="/register">Join the Morning List</FooterLink>
              <FooterLink to="/cart">Your bag</FooterLink>
              <FooterLink to="/privacy">Privacy</FooterLink>
              <FooterLink to="/terms">Terms</FooterLink>
            </div>
            <Link to="/register" className="cafe-btn cafe-btn-sm cafe-btn-mint mt-5 w-full">
              <Send className="h-3.5 w-3.5" />
              Get the Friday drop
            </Link>
          </div>
        </div>

        <div className="mt-10 flex select-none justify-center overflow-hidden" aria-hidden="true">
          {letters.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="font-display text-[clamp(3rem,12vw,9rem)] font-bold leading-[0.8] tracking-[-0.03em] transition-transform duration-300 hover:-translate-y-2 hover:rotate-[-5deg]"
              style={{ color: letterColors[index % letterColors.length] }}
            >
              {letter}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-cream-100/10 pt-5 text-xs text-cream-100/40 sm:flex-row">
          <p>© {new Date().getFullYear()} BloomsCafe. Made on Rajpur Road.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="transition-colors hover:text-cream-100/80">
              Privacy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-cream-100/80">
              Terms
            </Link>
            <span>Est. 2021</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
