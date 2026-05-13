'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Brand } from './components/ui'

// ─── Constants ────────────────────────────────────────────────────────────────

const WHATSAPP_URL = 'https://wa.me/962795080561'

const SIGNATURE_MARQUEE_1 = [
  { src: '/women_signature/01_Clean_Natural_Beauty.png', label: 'Natural Beauty' },
  { src: '/women_signature/03_Bridal_Rose_Glam.png', label: 'Bridal Rose' },
  { src: '/women_signature/05_Arabic_Glam.png', label: 'Arabic Glam' },
  { src: '/women_signature/06_Red_Carpet_Red_Lip.png', label: 'Red Carpet' },
  { src: '/women_signature/07_Smokey_Evening.png', label: 'Smokey Evening' },
  { src: '/women_signature/09_Korean_Soft_Makeup.png', label: 'Korean Soft' },
  { src: '/women_signature/11_Warm_Bronze_Glam.png', label: 'Bronze Glam' },
  { src: '/women_signature/14_Mocha_Soft_Glam.png', label: 'Soft Glam' },
  { src: '/women_signature/19_Full_Glam_Salon.png', label: 'Full Glam' },
  { src: '/women_signature/25_Rosy_French_Bob.png', label: 'French Bob' },
]

const SIGNATURE_MARQUEE_2 = [
  { src: '/women_signature/02_Soft_Glam_Classic.png', label: 'Soft Classic' },
  { src: '/women_signature/04_Luxury_Bridal_Glow.png', label: 'Bridal Glow' },
  { src: '/women_signature/08_Peachy_Day_Glam.png', label: 'Peachy Glam' },
  { src: '/women_signature/10_Editorial_Berry.png', label: 'Editorial Berry' },
  { src: '/women_signature/12_Nude_Sculpted_Glam.png', label: 'Nude Sculpted' },
  { src: '/women_signature/15_High_Fashion_Matte.png', label: 'High Fashion' },
  { src: '/women_signature/17_Soft_Plum_Evening.png', label: 'Plum Evening' },
  { src: '/women_signature/20_Elegant_Mature_Glam.png', label: 'Elegant Glam' },
  { src: '/women_signature/22_Champagne_Blonde_Glam.png', label: 'Champagne Glam' },
  { src: '/women_signature/29_Golden_Bridal_Updo.png', label: 'Golden Bridal' },
]

const FEATURES = [
  {
    icon: '✦',
    title: 'AI Style Preview',
    body: 'Upload a client photo, pick a style, and get a photorealistic AI preview in under 30 seconds.',
  },
  {
    icon: '◈',
    title: 'Men & Women',
    body: '100+ styles — catalog, signature, bridal, and smart AI mode for both men and women.',
  },
  {
    icon: '◇',
    title: 'Credit-Based',
    body: 'No subscriptions. Buy credits when you need them and use them at your own pace.',
  },
]

const STATS = [
  { value: '100+', label: 'Style Options' },
  { value: '30s', label: 'Avg. Result Time' },
  { value: '2', label: 'Genders Supported' },
]

const TESTIMONIALS = [
  {
    quote: 'SalonAI changed how we consult. Clients love seeing results before committing to a look.',
    author: 'Ahmad K.',
    role: 'Salon Owner, Amman',
  },
  {
    quote: 'The previews are incredibly realistic. Far fewer clients change their mind after styling.',
    author: 'Lina S.',
    role: 'Beauty Salon, Zarqa',
  },
  {
    quote: 'Fast, easy, and the credit system fits perfectly for our daily session volume.',
    author: 'Rami T.',
    role: 'Hair Studio, Irbid',
  },
]

const TIERS = [
  {
    name: 'Bronze',
    tag: 'Starter',
    desc: 'Perfect for new salons testing AI styling with their clients.',
    featured: false,
  },
  {
    name: 'Silver',
    tag: 'Best Value',
    desc: 'Our most popular package for growing salons with daily sessions.',
    featured: true,
  },
  {
    name: 'Gold',
    tag: 'Studio',
    desc: 'For high-volume studios running multiple AI sessions every day.',
    featured: false,
  },
]

const FAQS = [
  {
    q: 'What is SalonAI?',
    a: 'SalonAI is an AI-powered hairstyle and makeup preview platform for salons. Clients can see realistic previews of any style before committing.',
  },
  {
    q: 'How does the AI preview work?',
    a: 'Upload a client photo, choose a style from our catalog (or let smart AI suggest one), and receive a photorealistic preview in under 30 seconds.',
  },
  {
    q: "Is my client's photo stored?",
    a: "Photos are used only for AI generation and are not permanently stored or shared. Your clients' privacy is fully protected.",
  },
  {
    q: 'How do I pay for credits?',
    a: 'Credits are purchased via CliQ transfer or cash. Send your transfer screenshot on WhatsApp and our team confirms your top-up — usually within minutes.',
  },
  {
    q: 'Does it work for both men and women?',
    a: 'Yes. Full catalogs for men and women including signature looks, bridal styles, catalog cuts, and smart AI mode.',
  },
]

// ─── Animation helpers ─────────────────────────────────────────────────────────

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay, duration: 0.5, ease: 'easeOut' as const },
  }
}

function mount(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5, ease: 'easeOut' as const },
  }
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const close = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/10 bg-black/50 backdrop-blur-xl' : ''
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Brand />
        <nav className="hidden items-center gap-8 md:flex">
          {['#showcase', '#features', '#pricing', '#faq'].map((href) => (
            <a
              key={href}
              href={href}
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              {href.slice(1).charAt(0).toUpperCase() + href.slice(2)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-2xl bg-gradient-to-r from-fuchsia-200 via-white to-sky-100 px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-lg shadow-fuchsia-950/30 transition hover:brightness-110"
          >
            Sign In
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-sm text-zinc-400 transition hover:text-white md:hidden"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-black/70 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {[
                ['#showcase', 'Showcase'],
                ['#features', 'Features'],
                ['#pricing', 'Pricing'],
                ['#faq', 'FAQ'],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={close}
                  className="rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {label}
                </a>
              ))}
              <Link
                href="/login"
                onClick={close}
                className="mt-2 rounded-xl px-4 py-3 text-sm font-bold text-fuchsia-200 transition hover:bg-white/[0.06]"
              >
                Sign In →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ─── Before/After Slider ───────────────────────────────────────────────────────

function BeforeAfterSlider({
  left,
  right,
  leftLabel,
  rightLabel,
}: {
  left: string
  right: string
  leftLabel: string
  rightLabel: string
}) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(5, Math.min(95, pct)))
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) updatePos(e.clientX) }
    const onTouch = (e: TouchEvent) => { if (dragging.current) updatePos(e.touches[0].clientX) }
    const stop = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', stop)
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('touchend', stop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', stop)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchend', stop)
    }
  }, [updatePos])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-3xl border border-white/10 select-none cursor-ew-resize"
      style={{ aspectRatio: '3/4' }}
    >
      {/* Right image — base layer */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={right}
        alt={rightLabel}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />

      {/* Left image — clipped to left pos% */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={left}
        alt={leftLabel}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, zIndex: 10 }}
        loading="lazy"
      />

      {/* Divider */}
      <div
        className="absolute inset-y-0"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)', zIndex: 20 }}
      >
        <div className="h-full w-px bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
        <button
          type="button"
          aria-label="Drag to compare"
          className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white shadow-2xl text-zinc-900 text-base font-bold ring-2 ring-fuchsia-200/40"
          onMouseDown={() => { dragging.current = true }}
          onTouchStart={() => { dragging.current = true }}
        >
          ↔
        </button>
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute bottom-3 left-3 z-30 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
        {leftLabel}
      </span>
      <span className="pointer-events-none absolute bottom-3 right-3 z-30 rounded-full bg-fuchsia-300 px-3 py-1.5 text-xs font-bold text-zinc-950">
        {rightLabel}
      </span>
    </div>
  )
}

// ─── Infinite Marquee ──────────────────────────────────────────────────────────

function InfiniteMarquee({
  items,
  speed = 35,
  reverse = false,
}: {
  items: { src: string; label: string }[]
  speed?: number
  reverse?: boolean
}) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-4"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        style={{ width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="group relative shrink-0 overflow-hidden rounded-2xl border border-white/10"
            style={{ width: '180px', aspectRatio: '3/4' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.label}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-8">
              <p className="truncate text-xs font-semibold text-white">{item.label}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-sm font-semibold text-white">{q}</span>
        <span
          className={`ml-4 shrink-0 text-fuchsia-300 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          ↓
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-6 text-zinc-400">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="page-bg overflow-x-hidden">
      <LandingNav />

      {/* ── Hero ── */}
      <section className="relative px-4 py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">

          {/* Text */}
          <div className="text-center lg:text-left">
            <motion.p
              {...mount(0)}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500"
            >
              AI-Powered Hairstyle &amp; Makeup Preview
            </motion.p>

            <motion.h1
              {...mount(0.1)}
              className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              See the Look{' '}
              <span className="bg-gradient-to-r from-fuchsia-200 via-white to-sky-200 bg-clip-text text-transparent">
                Before
              </span>
              <br />
              the Chair
            </motion.h1>

            <motion.p
              {...mount(0.2)}
              className="mx-auto mt-5 max-w-md text-base leading-7 text-zinc-400 lg:mx-0"
            >
              SalonAI generates photorealistic AI previews of hairstyles and makeup for your
              clients — in seconds, before they commit.
            </motion.p>

            <motion.div
              {...mount(0.3)}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <Link
                href="/login"
                className="rounded-2xl bg-gradient-to-r from-fuchsia-200 via-white to-sky-100 px-8 py-3.5 text-sm font-bold text-zinc-950 shadow-xl shadow-fuchsia-950/30 transition hover:brightness-110"
              >
                Get Started →
              </Link>
              <a
                href="#compare"
                className="rounded-2xl border border-white/10 bg-white/[0.06] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                See It In Action ↓
              </a>
            </motion.div>

            {/* Mini stats */}
            <motion.div
              {...mount(0.4)}
              className="mt-10 flex items-center justify-center gap-8 lg:justify-start"
            >
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-xl font-semibold tracking-tight text-fuchsia-200">{s.value}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Floating image stack */}
          <motion.div
            {...mount(0.15)}
            className="relative mx-auto h-[420px] w-full max-w-md lg:max-w-none lg:h-[500px]"
          >
            {/* Back card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-0 top-8 h-[280px] w-[180px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40"
              style={{ rotate: -8, zIndex: 1 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/women_signature/07_Smokey_Evening.png"
                alt="Smokey Evening"
                className="h-full w-full object-cover"
              />
            </motion.div>

            {/* Center card (largest, front) */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              className="absolute left-1/2 top-0 h-[340px] w-[210px] -translate-x-1/2 overflow-hidden rounded-3xl border border-fuchsia-200/20 shadow-2xl shadow-fuchsia-950/30"
              style={{ zIndex: 3 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/women_signature/05_Arabic_Glam.png"
                alt="Arabic Glam"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-200">AI Preview</p>
                <p className="mt-0.5 text-sm font-semibold text-white">Arabic Glam</p>
              </div>
            </motion.div>

            {/* Right card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="absolute right-0 top-12 h-[260px] w-[170px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40"
              style={{ rotate: 7, zIndex: 2 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/women_signature/06_Red_Carpet_Red_Lip.png"
                alt="Red Carpet"
                className="h-full w-full object-cover"
              />
            </motion.div>

            {/* Glow behind center card */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
              style={{
                background: 'radial-gradient(circle, rgba(240,171,252,0.6) 0%, transparent 70%)',
                zIndex: 0,
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── Before / After Comparison ── */}
      <section id="compare" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <motion.p
              {...reveal(0)}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500"
            >
              See The Difference
            </motion.p>
            <motion.h2
              {...reveal(0.1)}
              className="mt-3 text-3xl font-semibold tracking-tight text-white"
            >
              Drag to compare looks
            </motion.h2>
            <motion.p
              {...reveal(0.2)}
              className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400"
            >
              Explore the transformation — slide the handle to compare styles side by side.
            </motion.p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <motion.div {...reveal(0)}>
              <BeforeAfterSlider
                left="/women_signature/01_Clean_Natural_Beauty.png"
                right="/women_signature/05_Arabic_Glam.png"
                leftLabel="Natural Beauty"
                rightLabel="Arabic Glam"
              />
            </motion.div>
            <motion.div {...reveal(0.1)}>
              <BeforeAfterSlider
                left="/women_signature/09_Korean_Soft_Makeup.png"
                right="/women_signature/06_Red_Carpet_Red_Lip.png"
                leftLabel="Korean Soft"
                rightLabel="Red Carpet"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Showcase Marquee ── */}
      <section id="showcase" className="py-16">
        <div className="mb-10 text-center">
          <motion.p
            {...reveal(0)}
            className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500"
          >
            30+ Signature Looks
          </motion.p>
          <motion.h2
            {...reveal(0.1)}
            className="mt-3 text-3xl font-semibold tracking-tight text-white"
          >
            Every style, instantly
          </motion.h2>
        </div>

        <div className="space-y-4">
          <InfiniteMarquee items={SIGNATURE_MARQUEE_1} speed={40} />
          <InfiniteMarquee items={SIGNATURE_MARQUEE_2} speed={35} reverse />
        </div>
      </section>

      {/* ── Lips & Makeup Gallery ── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <motion.p
              {...reveal(0)}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500"
            >
              Makeup Details
            </motion.p>
            <motion.h2
              {...reveal(0.1)}
              className="mt-3 text-3xl font-semibold tracking-tight text-white"
            >
              Lips. Eyes. Brows. All covered.
            </motion.h2>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {[
              { src: '/lips/style/Gradient.png', label: 'Gradient Lip' },
              { src: '/lips/style/Ombre.png', label: 'Ombre Lip' },
              { src: '/lips/style/Sharp_Defined.png', label: 'Sharp Lip' },
              { src: '/lips/style/Soft_Blurred.png', label: 'Soft Lip' },
              { src: '/eyes/shadow/Arabic_Dramatic.png', label: 'Arabic Eyes' },
              { src: '/eyes/shadow/Bronze.png', label: 'Bronze Eyes' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                {...reveal(i * 0.07)}
                className="group relative overflow-hidden rounded-2xl border border-white/10"
                style={{ aspectRatio: '1/1' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-2 pt-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="truncate text-center text-xs font-semibold text-white">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <motion.p
              {...reveal(0)}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500"
            >
              Platform Features
            </motion.p>
            <motion.h2
              {...reveal(0.1)}
              className="mt-3 text-3xl font-semibold tracking-tight text-white"
            >
              Everything your salon needs
            </motion.h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                {...reveal(i * 0.1)}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl"
              >
                <p className="mb-5 text-3xl text-fuchsia-300">{f.icon}</p>
                <h3 className="text-base font-semibold text-white">{f.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.author} {...reveal(i * 0.1)}>
                <div className="h-full rounded-3xl border border-fuchsia-200/20 bg-fuchsia-200/10 p-6">
                  <p className="text-sm leading-6 text-zinc-300">"{t.quote}"</p>
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-white">{t.author}</p>
                    <p className="mt-1 text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <motion.p
              {...reveal(0)}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500"
            >
              Simple Credit Packages
            </motion.p>
            <motion.h2
              {...reveal(0.1)}
              className="mt-3 text-3xl font-semibold tracking-tight text-white"
            >
              Pay Only For What You Use
            </motion.h2>
            <motion.p
              {...reveal(0.2)}
              className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-400"
            >
              No subscriptions. Buy credits when you need them, use them at your own pace.
            </motion.p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {TIERS.map((tier, i) => (
              <motion.div key={tier.name} {...reveal(i * 0.1)}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl border p-6 ${
                    tier.featured
                      ? 'border-fuchsia-300/40 bg-white/[0.08]'
                      : 'border-white/10 bg-white/[0.055]'
                  }`}
                >
                  {tier.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-fuchsia-200/30 bg-fuchsia-300 px-3 py-1 text-xs font-bold text-zinc-950">
                      {tier.tag}
                    </div>
                  )}
                  {!tier.featured && (
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      {tier.tag}
                    </p>
                  )}
                  <h3 className="mt-3 text-2xl font-semibold text-white">{tier.name}</h3>
                  <p className="mt-4 flex-1 text-sm leading-6 text-zinc-400">{tier.desc}</p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 block w-full rounded-2xl border border-emerald-300/20 bg-emerald-400/10 py-3 text-center text-sm font-bold text-emerald-100 transition hover:bg-emerald-400/20"
                  >
                    Contact via WhatsApp
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            {...reveal(0.3)}
            className="mt-8 text-center text-xs text-zinc-500"
          >
            Exact package prices set by your account manager. Pay by CliQ transfer or cash.
          </motion.p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="px-4 py-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 text-center">
            <motion.p
              {...reveal(0)}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500"
            >
              FAQ
            </motion.p>
            <motion.h2
              {...reveal(0.1)}
              className="mt-3 text-3xl font-semibold tracking-tight text-white"
            >
              Common Questions
            </motion.h2>
          </div>
          <motion.div
            {...reveal(0.2)}
            className="rounded-3xl border border-white/10 bg-white/[0.04] px-6"
          >
            {FAQS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <Brand />
          <p className="text-xs text-zinc-500">© 2025 SalonAI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 transition hover:text-white"
            >
              WhatsApp
            </a>
            <Link href="/login" className="text-xs text-zinc-500 transition hover:text-white">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
