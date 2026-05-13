'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Brand } from './components/ui'

// ─── Catalog data ─────────────────────────────────────────────────────────────

const WHATSAPP_URL = 'https://wa.me/962795080561'

const ALL_LOOKS = [
  { src: '/women_signature/01_Clean_Natural_Beauty.png', label: 'Natural Beauty' },
  { src: '/women_signature/02_Soft_Glam_Classic.png',   label: 'Soft Glam Classic' },
  { src: '/women_signature/03_Bridal_Rose_Glam.png',    label: 'Bridal Rose Glam' },
  { src: '/women_signature/04_Luxury_Bridal_Glow.png',  label: 'Luxury Bridal Glow' },
  { src: '/women_signature/05_Arabic_Glam.png',         label: 'Arabic Glam' },
  { src: '/women_signature/06_Red_Carpet_Red_Lip.png',  label: 'Red Carpet Red Lip' },
  { src: '/women_signature/07_Smokey_Evening.png',      label: 'Smokey Evening' },
  { src: '/women_signature/08_Peachy_Day_Glam.png',     label: 'Peachy Day Glam' },
  { src: '/women_signature/09_Korean_Soft_Makeup.png',  label: 'Korean Soft Makeup' },
  { src: '/women_signature/10_Editorial_Berry.png',     label: 'Editorial Berry' },
  { src: '/women_signature/11_Warm_Bronze_Glam.png',    label: 'Warm Bronze Glam' },
  { src: '/women_signature/12_Nude_Sculpted_Glam.png',  label: 'Nude Sculpted Glam' },
  { src: '/women_signature/13_Fresh_Pink_Salon_Look.png', label: 'Fresh Pink Salon' },
  { src: '/women_signature/14_Mocha_Soft_Glam.png',    label: 'Mocha Soft Glam' },
  { src: '/women_signature/15_High_Fashion_Matte.png',  label: 'High Fashion Matte' },
  { src: '/women_signature/16_Sun-Kissed_Summer.png',   label: 'Sun-Kissed Summer' },
  { src: '/women_signature/17_Soft_Plum_Evening.png',   label: 'Soft Plum Evening' },
  { src: '/women_signature/18_Minimal_No-Makeup.png',   label: 'Minimal No-Makeup' },
  { src: '/women_signature/19_Full_Glam_Salon.png',     label: 'Full Glam Salon' },
  { src: '/women_signature/20_Elegant_Mature_Glam.png', label: 'Elegant Mature Glam' },
  { src: '/women_signature/21_Glossy_Espresso_Chic.png', label: 'Glossy Espresso Chic' },
  { src: '/women_signature/22_Champagne_Blonde_Glam.png', label: 'Champagne Blonde Glam' },
  { src: '/women_signature/23_Copper_Peach_Glow.png',  label: 'Copper Peach Glow' },
  { src: '/women_signature/24_Cool_Taupe_Smokey.png',  label: 'Cool Taupe Smokey' },
  { src: '/women_signature/25_Rosy_French_Bob.png',    label: 'Rosy French Bob' },
  { src: '/women_signature/26_Caramel_Balayage_Nude.png', label: 'Caramel Balayage' },
  { src: '/women_signature/27_Icy_Silver_Editorial.png', label: 'Icy Silver Editorial' },
  { src: '/women_signature/28_Soft_Burgundy_Waves.png', label: 'Soft Burgundy Waves' },
  { src: '/women_signature/29_Golden_Bridal_Updo.png', label: 'Golden Bridal Updo' },
  { src: '/women_signature/30_Clean_Copper_Bob.png',   label: 'Clean Copper Bob' },
]

const MARQUEE_A = ALL_LOOKS.filter((_, i) => i % 3 === 0)
const MARQUEE_B = ALL_LOOKS.filter((_, i) => i % 3 === 1)
const SPLIT_LEFT  = ALL_LOOKS.filter((_, i) => i % 2 === 0) // 15 looks
const SPLIT_RIGHT = ALL_LOOKS.filter((_, i) => i % 2 === 1) // 15 looks

const FEATURES = [
  { icon: '✦', title: 'AI Style Preview', body: 'Upload a client photo, pick a style, and get a photorealistic AI preview in under 30 seconds.' },
  { icon: '◈', title: 'Men & Women',       body: '100+ styles — catalog, signature, bridal, and smart AI mode for both men and women.' },
  { icon: '◇', title: 'Credit-Based',      body: 'No subscriptions. Buy credits when you need them, use them at your own pace.' },
]

const STATS = [
  { value: '100+', label: 'Style Options' },
  { value: '30s',  label: 'Avg. Result Time' },
  { value: '2',    label: 'Genders Supported' },
]

const TESTIMONIALS = [
  { quote: 'SalonAI changed how we consult. Clients love seeing results before committing to a look.',               author: 'Ahmad K.', role: 'Salon Owner, Amman' },
  { quote: "The previews are incredibly realistic. Far fewer clients change their mind after styling.",               author: 'Lina S.',  role: 'Beauty Salon, Zarqa' },
  { quote: 'Fast, easy, and the credit system fits perfectly for our daily session volume.',                         author: 'Rami T.',  role: 'Hair Studio, Irbid' },
]

const TIERS = [
  { name: 'Bronze', tag: 'Starter',    desc: 'Perfect for new salons testing AI styling with their clients.',              featured: false },
  { name: 'Silver', tag: 'Best Value', desc: 'Our most popular package for growing salons with daily sessions.',           featured: true  },
  { name: 'Gold',   tag: 'Studio',     desc: 'For high-volume studios running multiple AI sessions every day.',            featured: false },
]

const FAQS = [
  { q: 'What is SalonAI?',                  a: 'SalonAI is an AI-powered hairstyle and makeup preview platform for salons. Clients see realistic previews of any style before committing.' },
  { q: 'How does the AI preview work?',     a: 'Upload a client photo, choose a style from our catalog (or let smart AI suggest one), and receive a photorealistic preview in under 30 seconds.' },
  { q: "Is my client's photo stored?",      a: "Photos are used only for AI generation and are not permanently stored or shared. Your clients' privacy is fully protected." },
  { q: 'How do I pay for credits?',         a: 'Credits are purchased via CliQ transfer or cash. Send your transfer screenshot on WhatsApp and our team confirms your top-up — usually within minutes.' },
  { q: 'Does it work for both genders?',    a: 'Yes. Full catalogs for men and women including signature looks, bridal styles, catalog cuts, and smart AI mode.' },
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

// ─── Reel hook ────────────────────────────────────────────────────────────────
// Keeps track of current + previous index for crossfade

function useReel(total: number, ms: number) {
  const [state, setState] = useState({ curr: 0, prev: -1 })
  useEffect(() => {
    const t = setInterval(() => {
      setState(s => ({ curr: (s.curr + 1) % total, prev: s.curr }))
    }, ms)
    return () => clearInterval(t)
  }, [total, ms])
  return state
}

// ─── Ken-Burns crossfade engine ───────────────────────────────────────────────

function ReelFrame({
  images,
  intervalMs = 3000,
  className = '',
}: {
  images: { src: string; label: string }[]
  intervalMs?: number
  className?: string
}) {
  const { curr, prev } = useReel(images.length, intervalMs)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Previous image — fades out */}
      {prev >= 0 && (
        <motion.div
          key={`prev-${prev}`}
          className="absolute inset-0"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[prev].src} alt={images[prev].label} className="h-full w-full object-cover" loading="lazy" />
        </motion.div>
      )}

      {/* Current image — fades in with Ken Burns zoom */}
      <motion.div
        key={`curr-${curr}`}
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.0 }}
        animate={{ opacity: 1, scale: 1.07 }}
        transition={{
          opacity: { duration: 1.2, ease: 'easeInOut' },
          scale:   { duration: intervalMs / 1000 + 0.5, ease: 'linear' },
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[curr].src} alt={images[curr].label} className="h-full w-full object-cover" loading="lazy" />
      </motion.div>

      {/* Look name — bottom overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${curr}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-0 inset-x-0 flex items-end bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 pt-20"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fuchsia-300">AI Preview</p>
            <p className="mt-1 text-lg font-semibold text-white">{images[curr].label}</p>
          </div>
          {/* dot counter */}
          <div className="ml-auto flex gap-1.5">
            {images.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-500 ${
                  i === curr ? 'w-4 h-1.5 bg-fuchsia-300' : 'w-1.5 h-1.5 bg-white/30'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Style Demo (animated product walkthrough) ────────────────────────────────

type DemoPhase = 'hair' | 'color' | 'makeup' | 'merge' | 'result'

const DEMO_HAIR   = ['Natural Waves', 'Sleek Bob', 'Soft Curls', 'French Braid']
const DEMO_COLORS = [
  { hex: '#2C1810', name: 'Dark Brown' },
  { hex: '#C9993F', name: 'Blonde'     },
  { hex: '#111111', name: 'Black'      },
  { hex: '#B87878', name: 'Auburn'     },
  { hex: '#7B5230', name: 'Caramel'   },
]
const DEMO_MAKEUP = ['Soft Glam', 'Smokey Eye', 'Arabic Glam', 'Korean Glow']
const DEMO_SEQ: { phase: DemoPhase; ms: number }[] = [
  { phase: 'hair',   ms: 3000 },
  { phase: 'color',  ms: 2600 },
  { phase: 'makeup', ms: 2800 },
  { phase: 'merge',  ms: 2700 },
  { phase: 'result', ms: 3800 },
]

function HairPhase() {
  const [selected, setSelected] = useState<string | null>(null)
  useEffect(() => {
    const t = setTimeout(() => setSelected('Soft Curls'), 1800)
    return () => clearTimeout(t)
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
      className="w-full"
    >
      <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-600">Step 1 of 3</p>
      <h3 className="mb-5 text-center text-sm font-semibold text-white">Choose hairstyle</h3>
      <div className="grid grid-cols-2 gap-2.5">
        {DEMO_HAIR.map((opt, i) => {
          const active = selected === opt
          return (
            <motion.div key={opt}
              initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.13, duration: 0.35, ease: 'easeOut' as const }}
              className={`relative overflow-hidden rounded-xl border px-3 py-2.5 text-xs font-medium transition-all duration-500 ${
                active
                  ? 'border-fuchsia-300/60 bg-fuchsia-300/15 text-fuchsia-100 shadow-lg shadow-fuchsia-950/40'
                  : 'border-white/10 bg-white/[0.05] text-zinc-400'
              }`}
            >
              {active && (
                <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="mr-1 text-fuchsia-300">✓</motion.span>
              )}
              {opt}
              {active && (
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4 }}
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-fuchsia-400/60" />
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function ColorPhase() {
  const [selected, setSelected] = useState<string | null>(null)
  useEffect(() => {
    const t = setTimeout(() => setSelected('Blonde'), 1600)
    return () => clearTimeout(t)
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
      className="w-full"
    >
      <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-600">Step 2 of 3</p>
      <h3 className="mb-5 text-center text-sm font-semibold text-white">Pick hair color</h3>
      <div className="flex justify-center gap-3">
        {DEMO_COLORS.map((c, i) => {
          const active = selected === c.name
          return (
            <motion.div key={c.name}
              initial={{ opacity: 0, y: 12, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.35, ease: 'easeOut' as const }}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={`relative h-10 w-10 rounded-full transition-all duration-500 ${
                  active ? 'ring-2 ring-fuchsia-300 ring-offset-2 ring-offset-zinc-950' : 'ring-1 ring-white/10'
                }`}
                style={{ background: c.hex }}
              >
                {active && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center text-xs text-white drop-shadow">✓</motion.span>
                )}
              </div>
              <span className={`text-[9px] font-medium transition-colors ${active ? 'text-fuchsia-200' : 'text-zinc-600'}`}>{c.name}</span>
            </motion.div>
          )
        })}
      </div>
      {selected && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="mt-4 text-center text-[11px] text-zinc-500">
          Selected: <span className="font-semibold text-fuchsia-200">{selected}</span>
        </motion.p>
      )}
    </motion.div>
  )
}

function MakeupPhase() {
  const [selected, setSelected] = useState<string | null>(null)
  useEffect(() => {
    const t = setTimeout(() => setSelected('Arabic Glam'), 1900)
    return () => clearTimeout(t)
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
      className="w-full"
    >
      <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-600">Step 3 of 3</p>
      <h3 className="mb-5 text-center text-sm font-semibold text-white">Select makeup style</h3>
      <div className="grid grid-cols-2 gap-2.5">
        {DEMO_MAKEUP.map((opt, i) => {
          const active = selected === opt
          return (
            <motion.div key={opt}
              initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.13, duration: 0.35, ease: 'easeOut' as const }}
              className={`relative overflow-hidden rounded-xl border px-3 py-2.5 text-xs font-medium transition-all duration-500 ${
                active
                  ? 'border-fuchsia-300/60 bg-fuchsia-300/15 text-fuchsia-100 shadow-lg shadow-fuchsia-950/40'
                  : 'border-white/10 bg-white/[0.05] text-zinc-400'
              }`}
            >
              {active && (
                <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="mr-1 text-fuchsia-300">✓</motion.span>
              )}
              {opt}
              {active && (
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4 }}
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-fuchsia-400/60" />
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function MergePhase() {
  const [converging, setConverging] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setConverging(true), 900)
    return () => clearTimeout(t)
  }, [])

  const TAGS = [
    { label: 'Soft Curls',  x: -90, y: -55 },
    { label: '⬤ Blonde',    x: 90,  y: -55 },
    { label: 'Arabic Glam', x: 0,   y: 75  },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex w-full flex-col items-center justify-center"
      style={{ minHeight: 240 }}
    >
      {/* Central orb */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: converging ? 1 : 0.4, opacity: converging ? 1 : 0.3 }}
        transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
        className="absolute h-20 w-20 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(240,171,252,0.9) 0%, rgba(192,132,252,0.4) 50%, transparent 70%)' }}
      />
      {/* Spinning ring */}
      <AnimatePresence>
        {converging && (
          <motion.div key="ring"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 360 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              scale:   { duration: 0.3 },
              opacity: { duration: 0.3 },
              rotate:  { duration: 1.6, repeat: Infinity, ease: 'linear' },
            }}
            className="absolute h-28 w-28 rounded-full border-2 border-fuchsia-400/20 border-t-fuchsia-300/80"
          />
        )}
      </AnimatePresence>
      {/* Tags flying to center */}
      {TAGS.map((tag, i) => (
        <motion.div key={tag.label}
          initial={{ x: tag.x, y: tag.y, opacity: 1, scale: 1 }}
          animate={converging
            ? { x: 0, y: 0, opacity: 0, scale: 0.2 }
            : { x: tag.x, y: tag.y, opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.55, delay: i * 0.07, ease: 'easeIn' as const }}
          className="absolute rounded-full border border-fuchsia-300/40 bg-fuchsia-300/15 px-3 py-1.5 text-[11px] font-semibold text-fuchsia-200 backdrop-blur-sm"
        >
          {tag.label}
        </motion.div>
      ))}
      {/* Generating label */}
      <AnimatePresence>
        {converging && (
          <motion.p key="gen"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute bottom-0 text-center text-xs font-medium text-fuchsia-200"
          >
            Generating AI preview...
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ResultPhase() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="relative flex flex-col items-center"
    >
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="relative"
      >
        <div className="absolute -inset-3 rounded-[1.8rem] opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(240,171,252,0.5) 0%, transparent 70%)' }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/women_signature/05_Arabic_Glam.png" alt="Arabic Glam AI result"
          className="relative h-[240px] w-[160px] rounded-[1.4rem] object-cover shadow-2xl shadow-fuchsia-950/50" />
        <div className="absolute inset-x-0 bottom-0 rounded-b-[1.4rem] bg-gradient-to-t from-black/95 to-transparent px-3 pb-3 pt-8">
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-fuchsia-300">AI Generated</p>
          <p className="mt-0.5 text-xs font-semibold text-white">Arabic Glam</p>
        </div>
      </motion.div>
      {/* Sparkles */}
      {[{ x: -16, y: -14, d: 0.15 }, { x: 14, y: -18, d: 0.3 }, { x: 20, y: 18, d: 0.45 }].map((sp, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1.4, 0] }}
          transition={{ delay: sp.d, duration: 0.7 }}
          className="absolute text-fuchsia-300" style={{ left: `calc(50% + ${sp.x}px)`, top: sp.y, fontSize: 12 }}>
          ✦
        </motion.span>
      ))}
      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-3 text-[11px] font-semibold text-emerald-400">
        ✓ Preview ready in 24 seconds
      </motion.p>
    </motion.div>
  )
}

function StyleDemo() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setIdx(i => (i + 1) % DEMO_SEQ.length), DEMO_SEQ[idx].ms)
    return () => clearTimeout(t)
  }, [idx])

  const phase = DEMO_SEQ[idx].phase

  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 shadow-2xl shadow-black/50 backdrop-blur-xl">
      {/* Fake window chrome */}
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-red-400/60" />
        <div className="h-2 w-2 rounded-full bg-yellow-400/60" />
        <div className="h-2 w-2 rounded-full bg-green-400/60" />
        <span className="ml-2 text-[10px] text-zinc-600">SalonAI — Style Preview</span>
        <div className="ml-auto flex gap-1">
          {DEMO_SEQ.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === idx ? 'w-4 bg-fuchsia-400' : 'w-1 bg-white/20'}`} />
          ))}
        </div>
      </div>
      {/* Phase content */}
      <div className="flex min-h-[280px] items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {phase === 'hair'   && <HairPhase   key="hair" />}
          {phase === 'color'  && <ColorPhase  key="color" />}
          {phase === 'makeup' && <MakeupPhase key="makeup" />}
          {phase === 'merge'  && <MergePhase  key="merge" />}
          {phase === 'result' && <ResultPhase key="result" />}
        </AnimatePresence>
      </div>
    </div>
  )
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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-white/10 bg-black/50 backdrop-blur-xl' : ''}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Brand />
        <nav className="hidden items-center gap-8 md:flex">
          {[['#reel','Reel'],['#compare','Compare'],['#features','Features'],['#pricing','Pricing']].map(([href,label]) => (
            <a key={href} href={href} className="text-sm text-zinc-400 transition hover:text-white">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-2xl bg-gradient-to-r from-fuchsia-200 via-white to-sky-100 px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-lg shadow-fuchsia-950/30 transition hover:brightness-110">
            Sign In
          </Link>
          <button type="button" onClick={() => setMenuOpen(v => !v)} aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-sm text-zinc-400 transition hover:text-white md:hidden">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-black/70 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-1 px-4 py-4">
              {[['#reel','Reel'],['#compare','Compare'],['#features','Features'],['#pricing','Pricing']].map(([href,label]) => (
                <a key={href} href={href} onClick={close} className="rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.06] hover:text-white">{label}</a>
              ))}
              <Link href="/login" onClick={close} className="mt-2 rounded-xl px-4 py-3 text-sm font-bold text-fuchsia-200 transition hover:bg-white/[0.06]">Sign In →</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ─── Before/After slider ───────────────────────────────────────────────────────

function BeforeAfterSlider({ left, right, leftLabel, rightLabel }: { left: string; right: string; leftLabel: string; rightLabel: string }) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPos(Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100)))
  }, [])

  useEffect(() => {
    const onMove  = (e: MouseEvent)  => { if (dragging.current) updatePos(e.clientX) }
    const onTouch = (e: TouchEvent)  => { if (dragging.current) updatePos(e.touches[0].clientX) }
    const stop    = ()                => { dragging.current = false }
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
    <div ref={containerRef} className="relative overflow-hidden rounded-3xl border border-white/10 select-none cursor-ew-resize" style={{ aspectRatio: '3/4' }}>
      {/* Right image — base */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={right} alt={rightLabel} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      {/* Left image — clipped */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={left} alt={leftLabel} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, zIndex: 10 }} loading="lazy" />
      {/* Divider */}
      <div className="absolute inset-y-0" style={{ left: `${pos}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
        <div className="h-full w-px bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        <button type="button" aria-label="Drag to compare"
          className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white shadow-2xl text-zinc-900 text-base font-bold ring-2 ring-fuchsia-200/40"
          onMouseDown={() => { dragging.current = true }} onTouchStart={() => { dragging.current = true }}>
          ↔
        </button>
      </div>
      <span className="pointer-events-none absolute bottom-3 left-3 z-30 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">{leftLabel}</span>
      <span className="pointer-events-none absolute bottom-3 right-3 z-30 rounded-full bg-fuchsia-300 px-3 py-1.5 text-xs font-bold text-zinc-950">{rightLabel}</span>
    </div>
  )
}

// ─── Infinite marquee ──────────────────────────────────────────────────────────

function InfiniteMarquee({ items, speed = 35, reverse = false }: { items: { src: string; label: string }[]; speed?: number; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden">
      <motion.div className="flex gap-4" animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }} style={{ width: 'max-content' }}>
        {doubled.map((item, i) => (
          <div key={i} className="group relative shrink-0 overflow-hidden rounded-2xl border border-white/10" style={{ width: '180px', aspectRatio: '3/4' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.label} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-8">
              <p className="truncate text-xs font-semibold text-white">{item.label}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/10 last:border-0">
      <button type="button" onClick={() => setOpen(v => !v)} className="flex w-full items-center justify-between py-5 text-left">
        <span className="text-sm font-semibold text-white">{q}</span>
        <span className={`ml-4 shrink-0 text-fuchsia-300 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>↓</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }} className="overflow-hidden">
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
            <motion.p {...mount(0)} className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
              AI-Powered Hairstyle &amp; Makeup Preview
            </motion.p>
            <motion.h1 {...mount(0.1)} className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              See the Look{' '}
              <span className="bg-gradient-to-r from-fuchsia-200 via-white to-sky-200 bg-clip-text text-transparent">Before</span>
              <br />the Chair
            </motion.h1>
            <motion.p {...mount(0.2)} className="mx-auto mt-5 max-w-md text-base leading-7 text-zinc-400 lg:mx-0">
              SalonAI generates photorealistic AI previews of hairstyles and makeup for your clients — in seconds, before they commit.
            </motion.p>
            <motion.div {...mount(0.3)} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/contact" className="rounded-2xl bg-gradient-to-r from-fuchsia-200 via-white to-sky-100 px-8 py-3.5 text-sm font-bold text-zinc-950 shadow-xl shadow-fuchsia-950/30 transition hover:brightness-110">
                Start Free Trial →
              </Link>
              <a href="#reel" className="rounded-2xl border border-white/10 bg-white/[0.06] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.1]">
                See the Reel ↓
              </a>
            </motion.div>
            <motion.div {...mount(0.4)} className="mt-10 flex items-center justify-center gap-8 lg:justify-start">
              {STATS.map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-xl font-semibold tracking-tight text-fuchsia-200">{s.value}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Floating image stack */}
          <motion.div {...mount(0.15)} className="relative mx-auto h-[420px] w-full max-w-md lg:max-w-none lg:h-[500px]">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-0 top-8 h-[280px] w-[180px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40" style={{ rotate: -8, zIndex: 1 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/women_signature/07_Smokey_Evening.png" alt="Smokey Evening" className="h-full w-full object-cover" />
            </motion.div>
            <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              className="absolute left-1/2 top-0 h-[340px] w-[210px] -translate-x-1/2 overflow-hidden rounded-3xl border border-fuchsia-200/20 shadow-2xl shadow-fuchsia-950/30" style={{ zIndex: 3 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/women_signature/05_Arabic_Glam.png" alt="Arabic Glam" className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-200">AI Preview</p>
                <p className="mt-0.5 text-sm font-semibold text-white">Arabic Glam</p>
              </div>
            </motion.div>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="absolute right-0 top-12 h-[260px] w-[170px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40" style={{ rotate: 7, zIndex: 2 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/women_signature/06_Red_Carpet_Red_Lip.png" alt="Red Carpet" className="h-full w-full object-cover" />
            </motion.div>
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(240,171,252,0.5) 0%, transparent 70%)', zIndex: 0 }} />
          </motion.div>
        </div>
      </section>

      {/* ── AI Reel (the "video") ── */}
      <section id="reel" className="relative overflow-hidden">
        {/* Full-width Ken-Burns reel behind the section */}
        <div className="absolute inset-0">
          <ReelFrame images={ALL_LOOKS} intervalMs={3200} className="h-full w-full" />
          {/* Gradient vignette so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#07070a]/80 via-transparent to-[#07070a]/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07070a]/60 via-transparent to-[#07070a]/60" />
        </div>

        {/* Content on top */}
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-36 text-center">
          <motion.p {...reveal(0)} className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-300">
            30 Signature AI Looks
          </motion.p>
          <motion.h2 {...reveal(0.1)} className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Every look your clients dream of
          </motion.h2>
          <motion.p {...reveal(0.2)} className="mx-auto mt-5 max-w-lg text-base leading-7 text-zinc-300">
            From natural beauty to high-fashion editorial — our AI catalog covers every style, every occasion, every client.
          </motion.p>
          <motion.div {...reveal(0.3)} className="mt-9">
            <Link href="/contact" className="rounded-2xl bg-gradient-to-r from-fuchsia-200 via-white to-sky-100 px-10 py-4 text-sm font-bold text-zinc-950 shadow-2xl shadow-fuchsia-950/50 transition hover:brightness-110">
              Try It Free →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Style Demo ── */}
      <section id="demo" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Copy */}
            <div>
              <motion.p {...reveal(0)} className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">How It Works</motion.p>
              <motion.h2 {...reveal(0.1)} className="mt-4 text-4xl font-semibold tracking-tight text-white">
                Pick a style.<br/>See it on your client.
              </motion.h2>
              <motion.p {...reveal(0.2)} className="mt-5 max-w-sm text-base leading-7 text-zinc-400">
                Choose hairstyle, hair color, and makeup in seconds. Our AI merges all your selections into a photorealistic preview — before anyone sits in the chair.
              </motion.p>
              <motion.ul {...reveal(0.25)} className="mt-6 space-y-3 text-sm text-zinc-400">
                {['Select hairstyle from 100+ catalog options', 'Choose hair color from a full swatch palette', 'Layer on any makeup look — glam, natural, or editorial', 'AI merges everything into one photorealistic result'].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-fuchsia-300">✦</span>
                    {step}
                  </li>
                ))}
              </motion.ul>
              <motion.div {...reveal(0.35)} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="rounded-2xl bg-gradient-to-r from-fuchsia-200 via-white to-sky-100 px-7 py-3.5 text-center text-sm font-bold text-zinc-950 shadow-xl shadow-fuchsia-950/30 transition hover:brightness-110">
                  Try It Free →
                </Link>
              </motion.div>
            </div>
            {/* Demo animation */}
            <motion.div {...reveal(0.1)}>
              <StyleDemo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Marquee showcase ── */}
      <section className="py-16">
        <div className="mb-10 text-center">
          <motion.p {...reveal(0)} className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">Browse the Catalog</motion.p>
          <motion.h2 {...reveal(0.1)} className="mt-3 text-3xl font-semibold tracking-tight text-white">Every style, instantly</motion.h2>
        </div>
        <div className="space-y-4">
          <InfiniteMarquee items={MARQUEE_A} speed={45} />
          <InfiniteMarquee items={MARQUEE_B} speed={38} reverse />
        </div>
      </section>

      {/* ── Split Morph — images merging ── */}
      <section className="overflow-hidden py-4">
        <div className="relative">
          {/* Two panels cycling independently */}
          <div className="flex h-[70vh] min-h-[500px]">
            {/* Left panel */}
            <div className="relative flex-1 overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 82% 100%, 0 100%)' }}>
              <ReelFrame images={SPLIT_LEFT} intervalMs={2800} className="h-full w-full" />
            </div>
            {/* Right panel */}
            <div className="relative flex-1 overflow-hidden" style={{ clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)' }}>
              <ReelFrame images={SPLIT_RIGHT} intervalMs={3400} className="h-full w-full" />
            </div>
          </div>

          {/* Center merge overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div {...reveal(0)} className="relative z-10 rounded-3xl border border-white/10 bg-black/60 px-10 py-8 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-300">AI Transformation</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">One photo.<br/>Any look imaginable.</h2>
              <p className="mt-3 text-sm text-zinc-400">Every style, generated in real time.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Before / After slider ── */}
      <section id="compare" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <motion.p {...reveal(0)} className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">See The Difference</motion.p>
            <motion.h2 {...reveal(0.1)} className="mt-3 text-3xl font-semibold tracking-tight text-white">Drag to compare looks</motion.h2>
            <motion.p {...reveal(0.2)} className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">Slide the handle to reveal any look side by side.</motion.p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <motion.div {...reveal(0)}>
              <BeforeAfterSlider left="/women_signature/01_Clean_Natural_Beauty.png" right="/women_signature/05_Arabic_Glam.png" leftLabel="Natural Beauty" rightLabel="Arabic Glam" />
            </motion.div>
            <motion.div {...reveal(0.1)}>
              <BeforeAfterSlider left="/women_signature/09_Korean_Soft_Makeup.png" right="/women_signature/06_Red_Carpet_Red_Lip.png" leftLabel="Korean Soft" rightLabel="Red Carpet" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <motion.p {...reveal(0)} className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">Platform Features</motion.p>
            <motion.h2 {...reveal(0.1)} className="mt-3 text-3xl font-semibold tracking-tight text-white">Everything your salon needs</motion.h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} {...reveal(i * 0.1)} whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl">
                <p className="mb-5 text-3xl text-fuchsia-300">{f.icon}</p>
                <h3 className="text-base font-semibold text-white">{f.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
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
            <motion.p {...reveal(0)} className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">Simple Credit Packages</motion.p>
            <motion.h2 {...reveal(0.1)} className="mt-3 text-3xl font-semibold tracking-tight text-white">Pay Only For What You Use</motion.h2>
            <motion.p {...reveal(0.2)} className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-400">No subscriptions. Buy credits when you need them, use them at your own pace.</motion.p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {TIERS.map((tier, i) => (
              <motion.div key={tier.name} {...reveal(i * 0.1)}>
                <div className={`relative flex h-full flex-col rounded-3xl border p-6 ${tier.featured ? 'border-fuchsia-300/40 bg-white/[0.08]' : 'border-white/10 bg-white/[0.055]'}`}>
                  {tier.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-fuchsia-200/30 bg-fuchsia-300 px-3 py-1 text-xs font-bold text-zinc-950">{tier.tag}</div>
                  )}
                  {!tier.featured && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{tier.tag}</p>}
                  <h3 className="mt-3 text-2xl font-semibold text-white">{tier.name}</h3>
                  <p className="mt-4 flex-1 text-sm leading-6 text-zinc-400">{tier.desc}</p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                    className="mt-6 block w-full rounded-2xl border border-emerald-300/20 bg-emerald-400/10 py-3 text-center text-sm font-bold text-emerald-100 transition hover:bg-emerald-400/20">
                    Contact via WhatsApp
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p {...reveal(0.3)} className="mt-8 text-center text-xs text-zinc-500">
            Exact package prices set by your account manager. Pay by CliQ transfer or cash.
          </motion.p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="px-4 py-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 text-center">
            <motion.p {...reveal(0)} className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">FAQ</motion.p>
            <motion.h2 {...reveal(0.1)} className="mt-3 text-3xl font-semibold tracking-tight text-white">Common Questions</motion.h2>
          </div>
          <motion.div {...reveal(0.2)} className="rounded-3xl border border-white/10 bg-white/[0.04] px-6">
            {FAQS.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <Brand />
          <p className="text-xs text-zinc-500">© 2025 SalonAI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 transition hover:text-white">WhatsApp</a>
            <Link href="/login" className="text-xs text-zinc-500 transition hover:text-white">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
