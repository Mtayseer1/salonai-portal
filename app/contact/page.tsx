'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brand } from '../components/ui'

function mount(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5, ease: 'easeOut' as const },
  }
}

const CONTACTS = [
  { label: 'WhatsApp', value: '+962 79 508 0561', href: 'https://wa.me/962795080561', icon: '💬' },
  { label: 'WhatsApp', value: '+962 77 508 0561', href: 'https://wa.me/962775080561', icon: '💬' },
  { label: 'Email',    value: 'info@futurelights.tech', href: 'mailto:info@futurelights.tech', icon: '✉' },
]

export default function ContactPage() {
  return (
    <main className="page-bg flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <motion.div {...mount(0)} className="mb-10">
        <Link href="/">
          <Brand />
        </Link>
      </motion.div>

      <motion.div
        {...mount(0.05)}
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.07] p-8 text-center backdrop-blur-xl"
      >
        {/* Free trial badge */}
        <motion.div {...mount(0.1)}>
          <span className="inline-block rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-300">
            Free Trial Available
          </span>
        </motion.div>

        <motion.h1 {...mount(0.15)} className="mt-5 text-3xl font-semibold tracking-tight text-white">
          Start Your Free Trial
        </motion.h1>
        <motion.p {...mount(0.2)} className="mt-3 text-sm leading-7 text-zinc-400">
          Your first trial is completely free — no credit card, no commitment.
          Reach out on WhatsApp or email and our team will get you set up within minutes.
        </motion.p>

        <motion.div {...mount(0.25)} className="mt-8 space-y-3">
          {CONTACTS.map((c) => (
            <a
              key={c.value}
              href={c.href}
              target={c.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-left transition hover:border-fuchsia-300/30 hover:bg-fuchsia-300/5"
            >
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{c.label}</p>
                <p className="mt-0.5 text-sm font-semibold text-white">{c.value}</p>
              </div>
            </a>
          ))}
        </motion.div>

        <motion.p {...mount(0.35)} className="mt-8 text-xs text-zinc-600">
          Powered by Future Lights Technology · Jordan
        </motion.p>
      </motion.div>

      <motion.div {...mount(0.4)} className="mt-6">
        <Link href="/" className="text-xs text-zinc-600 transition hover:text-zinc-400">
          ← Back to home
        </Link>
      </motion.div>
    </main>
  )
}
