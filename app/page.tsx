'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { Brand, Card } from './components/ui'

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

const FEATURES = [
  {
    icon: '✦',
    title: 'AI Style Preview',
    body: 'Upload a client photo and receive a realistic AI-generated preview of any hairstyle in under 30 seconds.',
  },
  {
    icon: '◈',
    title: 'Men & Women Catalog',
    body: '100+ styles including catalog looks, bridal, signature styles, and smart AI mode for both men and women.',
  },
  {
    icon: '◇',
    title: 'Credit-Based Access',
    body: 'Simple credit system. Buy what you need, use when you want. Top up anytime via CliQ or cash.',
  },
]

const STATS = [
  { value: '100+', label: 'Hairstyle Options' },
  { value: '30s', label: 'Avg. Preview Time' },
  { value: '2', label: 'Genders Supported' },
]

const TESTIMONIALS = [
  {
    quote:
      'SalonAI completely changed how we consult with clients. They love seeing the result before committing.',
    author: 'Ahmad K.',
    role: 'Salon Owner, Amman',
  },
  {
    quote:
      "The AI previews are incredibly realistic. We've seen a big drop in clients changing their mind after styling.",
    author: 'Lina S.',
    role: 'Beauty Salon, Zarqa',
  },
  {
    quote: 'Easy to use, fast results, and the credit system is very flexible for our volume.',
    author: 'Rami T.',
    role: 'Hair Studio, Irbid',
  },
]

const TIERS = [
  {
    name: 'Bronze',
    tag: 'Starter',
    desc: 'Perfect for new salons or testing the platform. A great way to get started with AI styling.',
    featured: false,
  },
  {
    name: 'Silver',
    tag: 'Best Value',
    desc: 'Our most popular package for growing salons. Ideal for daily client sessions.',
    featured: true,
  },
  {
    name: 'Gold',
    tag: 'Studio',
    desc: 'For high-volume salons running multiple styling sessions every day.',
    featured: false,
  },
]

const FAQS = [
  {
    q: 'What is SalonAI?',
    a: 'SalonAI is an AI-powered hairstyle and makeup preview tool for salons. Your clients can see realistic previews of any style before committing to it.',
  },
  {
    q: 'How does the AI preview work?',
    a: 'Upload a client photo, choose a style from our catalog or let the AI suggest one, and receive a photorealistic preview in under 30 seconds.',
  },
  {
    q: "Is my client's photo stored?",
    a: "Photos are used only for AI generation and are not permanently stored or shared. Your clients' privacy is protected.",
  },
  {
    q: 'How do I pay for credits?',
    a: 'Credits are purchased via CliQ transfer or cash. Send your transfer screenshot on WhatsApp and our team confirms your top-up — usually within minutes.',
  },
  {
    q: 'Does it work for both men and women?',
    a: 'Yes. SalonAI supports full catalogs for both men and women, including signature looks, bridal styles, and smart AI mode.',
  },
]

const WHATSAPP_URL = 'https://wa.me/962795080561'

// ─── Animation helpers ─────────────────────────────────────────────────────────

function heroProp(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5, ease: 'easeOut' as const },
  }
}

function scrollReveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay, duration: 0.45, ease: 'easeOut' as const },
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
        scrolled ? 'border-b border-white/10 bg-black/40 backdrop-blur-xl' : ''
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Brand />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              {label}
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
            aria-label="Toggle menu"
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
            className="overflow-hidden border-t border-white/10 bg-black/60 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map(({ href, label }) => (
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

// ─── FAQ item ──────────────────────────────────────────────────────────────────

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
          className={`ml-4 shrink-0 text-fuchsia-300 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
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

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="page-bg">
      <LandingNav />

      {/* ── Hero ── */}
      <section className="px-4 pb-28 pt-24 text-center">
        <div className="mx-auto max-w-3xl">
          <motion.p
            {...heroProp(0)}
            className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500"
          >
            AI-Powered Hairstyle Preview
          </motion.p>

          <motion.div
            {...heroProp(0.1)}
            className="mx-auto my-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.07]"
            style={{
              boxShadow:
                '0 0 0 1px rgba(240,171,252,0.12), 0 0 60px rgba(240,171,252,0.18), 0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/favicon.ico"
              width={56}
              height={56}
              alt="SalonAI"
              className="rounded-xl"
            />
          </motion.div>

          <motion.h1
            {...heroProp(0.2)}
            className="text-4xl font-semibold tracking-tight text-white sm:text-5xl"
          >
            See Your New Look
            <br />
            <span className="bg-gradient-to-r from-fuchsia-200 via-white to-sky-200 bg-clip-text text-transparent">
              Before You Commit
            </span>
          </motion.h1>

          <motion.p
            {...heroProp(0.3)}
            className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-400"
          >
            SalonAI lets salons show clients realistic AI previews of any hairstyle — instantly,
            before they sit in the chair.
          </motion.p>

          <motion.div
            {...heroProp(0.4)}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/login"
              className="rounded-2xl bg-gradient-to-r from-fuchsia-200 via-white to-sky-100 px-8 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-fuchsia-950/30 transition hover:brightness-110"
            >
              Get Started →
            </Link>
            <a
              href="#features"
              className="rounded-2xl border border-white/10 bg-white/[0.06] px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
            >
              How It Works ↓
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <motion.p
              {...scrollReveal(0)}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500"
            >
              What SalonAI Does
            </motion.p>
            <motion.h2
              {...scrollReveal(0.1)}
              className="mt-3 text-3xl font-semibold tracking-tight text-white"
            >
              Everything your salon needs
            </motion.h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} {...scrollReveal(i * 0.1)}>
                <Card className="h-full">
                  <p className="mb-5 text-2xl text-fuchsia-300">{f.icon}</p>
                  <h3 className="text-base font-semibold text-white">{f.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{f.body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 grid grid-cols-3 gap-6 text-center">
            {STATS.map((s, i) => (
              <motion.div key={s.label} {...scrollReveal(i * 0.1)}>
                <p className="text-4xl font-semibold tracking-tight text-fuchsia-200 sm:text-5xl">
                  {s.value}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.author} {...scrollReveal(i * 0.1)}>
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
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <motion.p
              {...scrollReveal(0)}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500"
            >
              Simple Credit Packages
            </motion.p>
            <motion.h2
              {...scrollReveal(0.1)}
              className="mt-3 text-3xl font-semibold tracking-tight text-white"
            >
              Pay Only For What You Use
            </motion.h2>
            <motion.p
              {...scrollReveal(0.2)}
              className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-400"
            >
              No subscriptions. Buy credits when you need them, use them at your own pace.
            </motion.p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {TIERS.map((tier, i) => (
              <motion.div key={tier.name} {...scrollReveal(i * 0.1)}>
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
            {...scrollReveal(0.3)}
            className="mt-8 text-center text-xs text-zinc-500"
          >
            Exact package prices are set by your account manager. Pay by CliQ transfer or cash —
            our team confirms your order.
          </motion.p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="px-4 py-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 text-center">
            <motion.p
              {...scrollReveal(0)}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500"
            >
              FAQ
            </motion.p>
            <motion.h2
              {...scrollReveal(0.1)}
              className="mt-3 text-3xl font-semibold tracking-tight text-white"
            >
              Common Questions
            </motion.h2>
          </div>
          <motion.div
            {...scrollReveal(0.2)}
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
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
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
