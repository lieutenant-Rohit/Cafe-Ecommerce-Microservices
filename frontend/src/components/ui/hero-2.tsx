"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown, ChevronDown, Croissant, Star, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { Magnetic } from "@/components/motion-primitives/magnetic";
import { Spotlight } from "@/components/motion-primitives/spotlight";
import { BorderTrail } from "@/components/motion-primitives/border-trail";
import Parallax from "@/components/ui/parallax";
import BlobMesh from "@/components/ui/blob-mesh";
import Grain from "@/components/ui/grain";
import { useCafeStatus } from "@/hooks/useCafeStatus";

export interface NavLink {
    label: string;
    to: string;
    active?: boolean;
    hasDropdown?: boolean;
}

export interface SocialLink {
    label: string;
    href: string;
}

export interface Hero2Props {
    brand?: React.ReactNode;
    navLinks?: NavLink[];
    badge?: React.ReactNode;
    headlineAccent?: string;
    description?: string;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    socialLinks?: SocialLink[];
    signInLabel?: string;
    signInHref?: string;
    className?: string;
}

const DEFAULT_NAV: NavLink[] = [
    { label: "Menu", to: "/menu", active: true },
    { label: "My Orders", to: "/my-orders" },
    { label: "Cart", to: "/cart" },
];

const DEFAULT_SOCIAL: SocialLink[] = [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "17 Meadow St.", href: "#" },
];

function HeaderLink({ link, active, hovered, onSelect, onHover }: {
    link: NavLink;
    active: boolean;
    hovered: boolean;
    onSelect: (link: NavLink) => void;
    onHover: (label: string | null) => void;
}) {
    const linkClass = cn(
        "text-sm font-medium transition-colors flex items-center gap-1.5",
        hovered || active
            ? "text-coffee-900 font-semibold"
            : "text-coffee-500/80 hover:text-coffee-900"
    );
    const content = (
        <>
            {link.label}
            {link.hasDropdown && (
                <ChevronDown className="w-3.5 h-3.5 opacity-50 stroke-[2.5] transition-transform duration-200 group-hover:rotate-180" />
            )}
        </>
    );
    return (
        <li
            key={link.label}
            className="relative py-2 flex flex-col items-center group"
            onMouseEnter={() => onHover(link.label)}
            onMouseLeave={() => onHover(null)}
        >
            <Link to={link.to} onClick={() => onSelect(link)} className={linkClass}>
                {content}
            </Link>
            {(hovered || active) && (
                <motion.span
                    layoutId="activeDot"
                    className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-primary-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
            )}
        </li>
    );
}

export function Hero2({
    brand = "BloomsCafe",
    navLinks = DEFAULT_NAV,
    badge = (
        <Badge variant="secondary" className="bg-accent-50 text-accent-700 border-accent-200/70 gap-1.5 px-3.5 py-1 text-[12px] md:text-[13px] uppercase tracking-wide">
            <Croissant className="w-3.5 h-3.5" />
            One batch a day &mdash; gone by noon
        </Badge>
    ),
    headlineAccent = "blooms with flavor.",
    description = "Hand-pulled espresso, oat-milk lattes, and cinnamon rolls still warm from the 5 a.m. oven. When a batch is gone, it's gone — everything small-batch, everything this morning.",
    primaryCtaLabel = "See the Menu",
    primaryCtaHref = "/menu",
    secondaryCtaLabel = "Join the Morning List",
    secondaryCtaHref = "/register",
    socialLinks = DEFAULT_SOCIAL,
    signInLabel = "Sign in",
    signInHref = "/login",
    className,
}: Hero2Props) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const [activeLink, setActiveLink] = useState<string | null>(
        navLinks.find((link) => link.active)?.label || navLinks[0]?.label || null
    );

    const { isOpen, statusText, hoursToday } = useCafeStatus();

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    return (
        <section
            className={cn(
                "relative w-full min-h-svh flex flex-col overflow-hidden bg-cream-50 selection:bg-primary-100 selection:text-coffee-900",
                className
            )}
        >
            {/* Soft living backdrop */}
            <BlobMesh variant="warm" blend="multiply" className="opacity-50" />
            <Grain opacity={0.05} className="z-[60]" />

            {/* Header / Navbar */}
            <div className="w-full max-w-[1440px] mx-auto relative z-50">
                <header className="flex items-center justify-between px-6 md:px-10 lg:px-16 xl:px-24 py-6 md:py-8">
                    <Link to="/" className="flex items-center gap-1 group">
                        {typeof brand === "string" ? (
                            <span className="relative font-display text-coffee-900 font-semibold text-2xl tracking-tight select-none">
                                {brand}
                                <span className="absolute top-1.5 -right-1.5 w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                            </span>
                        ) : (
                            brand
                        )}
                    </Link>

                    <nav className="hidden md:block">
                        <ul className="flex items-center gap-10 lg:gap-14" onMouseLeave={() => setHoveredLink(null)}>
                            {navLinks.map((link) => (
                                <HeaderLink
                                    key={link.label}
                                    link={link}
                                    active={activeLink === link.label}
                                    hovered={hoveredLink === link.label}
                                    onSelect={(l) => setActiveLink(l.label)}
                                    onHover={setHoveredLink}
                                />
                            ))}
                        </ul>
                    </nav>

                    <div className="hidden md:block">
                        <Button variant="outline" asChild className="rounded-full px-7 h-10 text-sm font-medium bg-cream-50/70 backdrop-blur-md shadow-sm hover:bg-cream-100 hover:text-coffee-900 text-coffee-800 border-coffee-200">
                            <Link to={signInHref}>{signInLabel}</Link>
                        </Button>
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden z-50 p-2"
                        aria-label="Toggle menu"
                    >
                        <div className="w-5 flex flex-col gap-1.5">
                            <span className={cn("h-0.5 bg-coffee-900 transition-transform", isMobileMenuOpen ? "rotate-45 translate-y-2" : "")} />
                            <span className={cn("h-0.5 bg-coffee-900 transition-opacity", isMobileMenuOpen ? "opacity-0" : "")} />
                            <span className={cn("h-0.5 bg-coffee-900 transition-transform", isMobileMenuOpen ? "-rotate-45 -translate-y-2" : "")} />
                        </div>
                    </button>
                </header>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute inset-0 bg-cream-50 z-40 flex flex-col pt-24 px-6 pb-6 h-full"
                    >
                        <nav className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.to}
                                    onClick={() => {
                                        setActiveLink(link.label);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={cn(
                                        "font-display text-3xl flex items-center gap-2",
                                        activeLink === link.label ? "text-coffee-900" : "text-coffee-400"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-auto">
                            <Button asChild className="w-full rounded-full bg-primary-600 hover:bg-primary-500 text-cream-50 h-12 text-base">
                                <Link to={signInHref} onClick={() => setIsMobileMenuOpen(false)}>
                                    {signInLabel}
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Editorial split */}
            <div className="relative z-10 flex-1 flex flex-col w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-24 pt-10 md:pt-16 pb-10">
                <div className="grid lg:grid-cols-2 gap-14 lg:gap-8 items-center flex-1">
                    {/* Left — copy */}
                    <Parallax from={0} to={-70} className="max-w-2xl">
                        <motion.div variants={itemVariants} className="mb-6">
                            {badge}
                        </motion.div>

                        <h1 className="font-display text-coffee-900 text-[2.6rem] leading-[1.06] tracking-tight sm:text-6xl xl:text-7xl">
                            <span className="block">
                                <TextEffect per="word" preset="fade-in-blur" as="span" speedReveal={0.8} speedSegment={0.5}>
                                    Where every sip
                                </TextEffect>
                            </span>
                            <span className="block italic font-light">
                                {headlineAccent.split(' ').map((word, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
                                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                        transition={{ delay: 0.4 + i * 0.12, duration: 0.5, ease: 'easeOut' }}
                                        className="inline-block whitespace-pre bg-gradient-to-r from-[#A94E2C] via-[#C2643A] to-[#D37E58] bg-clip-text text-transparent"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </span>
                        </h1>

                        <motion.p
                            variants={itemVariants}
                            className="mt-5 text-base md:text-lg text-coffee-500/90 leading-relaxed max-w-xl"
                        >
                            {description}
                        </motion.p>

                        <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <Magnetic intensity={0.3} range={140}>
                                <Button asChild className="relative rounded-full px-8 bg-primary-600 hover:bg-primary-500 text-cream-50 h-13 md:h-14 text-base font-medium shadow-[0_4px_20px_rgba(169,78,44,0.35)] border-0 transition-colors group">
                                    <Link to={primaryCtaHref}>
                                        <BorderTrail radius={999} color="rgba(246,227,210,0.55)" />
                                        <Spotlight size={160} springOptions={{ bounce: 0, damping: 20, stiffness: 180 }} />
                                        {primaryCtaLabel}
                                        <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </Magnetic>

                            <Button variant="secondary" asChild className="rounded-full px-8 bg-white/70 hover:bg-white text-coffee-800 h-13 md:h-14 text-base font-medium border border-cream-300 transition-colors">
                                <Link to={secondaryCtaHref}>
                                    {secondaryCtaLabel}
                                    <ArrowRight className="w-4 h-4 ml-1.5" />
                                </Link>
                            </Button>
                        </motion.div>

                        <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-coffee-500/90">
                            <span className="inline-flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-70", isOpen ? "bg-accent-500" : "bg-coffee-400")} />
                                    <span className={cn("relative inline-flex rounded-full h-2 w-2", isOpen ? "bg-accent-500" : "bg-coffee-400")} />
                                </span>
                                {statusText}
                            </span>
                            <span className="hidden sm:block w-px h-4 bg-cream-300" />
                            <span>{hoursToday}</span>
                            <span className="hidden sm:block w-px h-4 bg-cream-300" />
                            <span>Fresh batch every 40 min</span>
                        </motion.div>
                    </Parallax>

                    {/* Right — visual */}
                    <div className="relative hidden sm:block lg:h-[620px]">
                        <div className="relative h-full max-w-[540px] ml-auto w-full">
                            {/* organic offset frame */}
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 rounded-[3.5rem] bg-gradient-to-br from-primary-100 via-cream-200 to-accent-100 rotate-[3deg]"
                            />
                            {/* main photo */}
                            <Parallax from={0} to={80} className="absolute inset-0">
                                <div className="group relative h-full w-full overflow-hidden rounded-[3.5rem] border-4 border-cream-50 shadow-[0_30px_80px_rgba(42,22,14,0.28)]">
                                    <img
                                        src="/images/products/cinnamon-roll.jpg"
                                        alt="Cinnamon roll, glazed while still warm"
                                        className="h-full w-full object-cover scale-[1.12] group-hover:scale-[1.18] transition-transform duration-[1200ms]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-coffee-950/55 via-transparent to-transparent" />
                                    <div className="absolute top-0 inset-x-0 p-6">
                                        <p className="text-xs uppercase tracking-[0.2em] text-cream-200/85">Shot at 6:40 a.m.</p>
                                        <p className="font-display text-2xl text-cream-50 mt-1 max-w-[80%]">
                                            Cinnamon roll, glazed while warm
                                        </p>
                                    </div>
                                    {/* steam */}
                                    <div className="absolute top-8 right-8 flex flex-col items-center gap-3 opacity-80" aria-hidden="true">
                                        {[0, 1, 2].map((i) => (
                                            <span
                                                key={i}
                                                className="w-1 h-8 rounded-full bg-cream-100/70 blur-[2px] animate-[steamDrift_4s_ease-in-out_infinite]"
                                                style={{ animationDelay: `${i * 1.2}s` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </Parallax>

                            {/* floating chips */}
                            <div className="absolute -left-10 -top-6 hidden lg:block animate-float" style={{ animationDuration: '9s' }}>
                                <div className="bg-cream-50/95 backdrop-blur rounded-2xl px-4 py-3 shadow-lg border border-cream-200">
                                    <p className="text-[11px] uppercase tracking-wider text-coffee-400 font-medium">Today&apos;s batch</p>
                                    <p className="font-display text-lg text-coffee-900 font-semibold mt-0.5">12 rolls left</p>
                                </div>
                            </div>
                            <div className="absolute -right-4 top-1/3 hidden lg:block animate-float" style={{ animationDuration: '11s' }}>
                                <div className="bg-primary-600 text-cream-50 rounded-2xl px-4 py-3 shadow-lg shadow-primary-600/30">
                                    <p className="font-display text-lg font-semibold">$4.25</p>
                                    <p className="text-[11px] text-cream-100/80">fresh &amp; warm</p>
                                </div>
                            </div>
                            <div className="absolute -left-10 bottom-20 hidden md:block animate-float" style={{ animationDuration: '10s' }}>
                                <div className="flex items-center gap-2 bg-white/95 backdrop-blur rounded-full pl-2 pr-4 py-1.5 shadow-lg border border-cream-200">
                                    <Star className="w-4 h-4 fill-accent-500 text-accent-500" />
                                    <p className="text-sm font-medium text-coffee-800">4.9 &middot; 300+ regulars</p>
                                </div>
                            </div>

                            {/* secondary photo collage */}
                            <div className="absolute -bottom-10 -left-12 hidden md:block w-44 h-44 overflow-hidden rounded-[2rem] border-4 border-cream-50 shadow-xl rotate-[-6deg] animate-float" style={{ animationDuration: '13s', animationDelay: '1.2s' }}>
                                <img
                                    src="/images/products/latte.jpg"
                                    alt="Oat-milk latte with latte art"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* rotating badge */}
                            <div className="absolute -bottom-8 -right-6 lg:-right-10 z-10">
                                <div className="relative w-24 h-24 md:w-28 md:h-28 animate-float" style={{ animationDuration: '12s', animationDelay: '0.6s' }}>
                                    <svg
                                        viewBox="0 0 100 100"
                                        className="absolute inset-0 w-full h-full animate-[spin_16s_linear_infinite]"
                                        aria-hidden="true"
                                    >
                                        <defs>
                                            <path id="heroCirclePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                                        </defs>
                                        <text fill="#6F4E37" fontSize="8.5" letterSpacing="2.6" className="uppercase">
                                            <textPath href="#heroCirclePath">Fresh every morning &middot; one batch a day &middot; </textPath>
                                        </text>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="bg-primary-600 text-cream-50 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg shadow-primary-600/30">
                                            <Croissant className="w-5 h-5" />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* drifting bean motes */}
                            <Coffee
                                aria-hidden="true"
                                className="absolute -left-16 top-1/2 w-4 h-4 text-primary-400/80 animate-float"
                                style={{ animationDuration: '8s' }}
                            />
                            <Croissant
                                aria-hidden="true"
                                className="absolute -right-12 top-1/4 w-4 h-4 text-coffee-400/70 animate-float"
                                style={{ animationDuration: '10s', animationDelay: '1.5s' }}
                            />
                            <span
                                aria-hidden="true"
                                className="absolute left-[58%] -top-7 w-2 h-2 rounded-full bg-accent-500/80 shadow-[0_0_10px_rgba(59,130,104,0.8)] animate-float"
                                style={{ animationDuration: '7s', animationDelay: '0.8s' }}
                            />
                            <span
                                aria-hidden="true"
                                className="absolute -right-6 bottom-1/4 w-2.5 h-2.5 rounded-full bg-primary-400/70 shadow-[0_0_10px_rgba(211,126,88,0.8)] animate-float"
                                style={{ animationDuration: '9s', animationDelay: '2s' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="relative z-10 flex flex-col md:flex-row items-center justify-between pt-10 gap-y-6 gap-x-6"
                >
                    <div className="flex items-center gap-8 lg:gap-14 w-full md:w-auto justify-center md:justify-start">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                className="text-coffee-500/80 hover:text-coffee-900 text-sm md:text-base transition-colors"
                            >
                                {social.label}
                            </a>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-coffee-500/80 text-sm md:text-base cursor-pointer group w-full md:w-auto justify-center md:justify-end">
                        <span>Scroll for the menu</span>
                        <motion.span
                            animate={{ y: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" strokeWidth={1.5} />
                        </motion.span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

