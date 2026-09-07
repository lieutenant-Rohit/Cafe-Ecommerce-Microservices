import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, MapPin, Clock, Phone, Mail, Coffee } from 'lucide-react'
import Reveal from '../ui/reveal'
import { Magnetic } from '../motion-primitives/magnetic'
import { BorderTrail } from '../motion-primitives/border-trail'

const footerLinks = {
  menu: [
    { to: '/menu', label: 'Full Menu' },
    { to: '/menu', label: 'Today\'s Specials' },
    { to: '/menu', label: 'Seasonal Picks' },
    { to: '/menu', label: 'Gift Cards' },
  ],
  company: [
    { to: '/', label: 'Our Story' },
    { to: '/', label: 'Sourcing' },
    { to: '/', label: 'Careers' },
    { to: '/', label: 'Press' },
  ],
}

const socials = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="relative bg-coffee-950 text-cream-200/70 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-600/5 rounded-full blur-3xl" />
      </div>

      {/* Newsletter band */}
      <div className="relative border-b border-cream-200/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Reveal>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-cream-50">
                  Join the Morning List
                </h3>
                <p className="mt-2 text-sm text-cream-200/60 max-w-md">
                  First pick of weekend bakes, loyalty rewards, and the day&apos;s batch count — before the door opens.
                </p>
              </div>
              <div className="w-full md:w-auto">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full md:w-72 bg-cream-50/10 border border-cream-200/20 rounded-full px-5 py-3 text-sm text-cream-50 placeholder:text-cream-200/40 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all"
                  />
                  <Magnetic intensity={0.2} range={60}>
                    <button className="absolute right-1 bg-primary-600 hover:bg-primary-500 text-cream-50 rounded-full p-2.5 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Magnetic>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand column */}
          <Reveal delay={0}>
            <div className="lg:col-span-1">
              <Link to="/" className="inline-flex items-center gap-2 group">
                <span className="font-display text-2xl font-semibold text-cream-50">
                  Bloom<span className="text-primary-500">s</span>
                  <span className="font-light italic">Cafe</span>
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed max-w-xs">
                Handcrafted coffees, teas, and pastries made from the finest ingredients.
                Every sip blooms with flavor.
              </p>

              {/* Social icons */}
              <div className="mt-6 flex items-center gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-cream-200/20 flex items-center justify-center text-cream-200/60 hover:text-cream-50 hover:border-primary-500/50 hover:bg-primary-600/20 transition-all duration-300"
                  >
                    {social.svg}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Links columns */}
          <Reveal delay={0.1}>
            <div>
              <h3 className="text-xs font-semibold text-cream-50 uppercase tracking-[0.2em] mb-5">
                Explore
              </h3>
              <ul className="space-y-3">
                {footerLinks.menu.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-cream-200/60 hover:text-cream-50 transition-colors duration-200 inline-flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-3 transition-all duration-200 overflow-hidden">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div>
              <h3 className="text-xs font-semibold text-cream-50 uppercase tracking-[0.2em] mb-5">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-cream-200/60 hover:text-cream-50 transition-colors duration-200 inline-flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-3 transition-all duration-200 overflow-hidden">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Contact column */}
          <Reveal delay={0.2}>
            <div>
              <h3 className="text-xs font-semibold text-cream-50 uppercase tracking-[0.2em] mb-5">
                Visit Us
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                  <span className="text-sm">17 Meadow Street<br />Brooklyn, NY 11201</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                  <span className="text-sm">(718) 555-0127</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                  <span className="text-sm">hello@bloomscafe.com</span>
                </li>
              </ul>

              {/* Hours */}
              <div className="mt-6 p-4 rounded-2xl bg-cream-50/5 border border-cream-200/10">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-accent-500" />
                  <span className="text-xs font-semibold text-cream-50 uppercase tracking-wider">Hours</span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cream-200/60">Mon — Fri</span>
                    <span className="text-cream-100">6:00 AM — 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream-200/60">Sat — Sun</span>
                    <span className="text-cream-100">7:00 AM — 9:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-cream-200/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-cream-200/40">
              <Coffee className="w-3.5 h-3.5" />
              <span>&copy; {new Date().getFullYear()} BloomsCafe. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-cream-200/40">
              <a href="#" className="hover:text-cream-100 transition-colors">Privacy</a>
              <a href="#" className="hover:text-cream-100 transition-colors">Terms</a>
              <a href="#" className="hover:text-cream-100 transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>

      {/* Large decorative text */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.p
          className="font-display text-[8rem] md:text-[12rem] lg:text-[16rem] font-semibold text-cream-50/[0.015] leading-none text-center -mb-[4rem] select-none"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Bloom
        </motion.p>
      </div>
    </footer>
  )
}
