'use client'

import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../../src/lib/supabase'
import { useTranslation } from '@/components/translation/translation-provider'

type NavItem = {
  href: string
  label: string
  icon: string
}

type AppShellProps = {
  children: React.ReactNode
  title: string
  subtitle?: string
  role: 'Salon' | 'Partner' | 'Admin'
  navItems: NavItem[]
  userLabel?: string
}

export const salonNav: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: 'D' },
  { href: '/style', label: 'Style Session', icon: 'S' },
  { href: '/buy-package', label: 'Buy Credits', icon: 'C' },
]

export const partnerNav: NavItem[] = [
  { href: '/partner', label: 'Overview', icon: 'O' },
  { href: '/partner/add-customer', label: 'Add Customer', icon: '+' },
  { href: '/partner/customers', label: 'Customers', icon: 'U' },
  { href: '/partner/payments', label: 'Payments', icon: '$' },
]

export const adminNav: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: 'A' },
]

export const pageMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: 'easeOut' },
} as const

export function AppShell({
  children,
  title,
  subtitle,
  role,
  navItems,
  userLabel = 'Account',
}: AppShellProps) {
  void role
  void navItems
  void userLabel

  const pathname = usePathname()
  const router = useRouter()
  const showBack = pathname !== '/dashboard'
  const goBack = () => {
    if (pathname === '/style/result') {
      router.push('/dashboard')
      return
    }

    router.back()
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(192,132,252,0.16),transparent_34%),linear-gradient(135deg,#07070a_0%,#101014_48%,#07070a_100%)] text-white">
      <motion.section
        {...pageMotion}
        className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 py-5"
      >
        <AppBar title={title} subtitle={subtitle} showBack={showBack} onBack={goBack} />
        <div className="flex-1">{children}</div>
      </motion.section>
    </main>
  )
}

export function AppBar({
  title,
  subtitle,
  showBack = false,
  onBack,
}: {
  title: string
  subtitle?: string
  showBack?: boolean
  onBack?: () => void
}) {
  const router = useRouter()
  const { language, setLanguage, t } = useTranslation()
  const [loggingOut, setLoggingOut] = useState(false)

  const logout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <header className="mb-5 flex min-h-12 items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-xl font-semibold text-white"
            aria-label="Back"
          >
            {'<'}
          </button>
        ) : (
          <Brand compact />
        )}
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 line-clamp-1 text-xs text-zinc-500">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-black/25 p-1">
          {(['en', 'ar'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setLanguage(value)}
              data-translate="no"
              aria-label={value === 'ar' ? 'Switch to Arabic' : 'Switch to English'}
              className={`h-9 min-w-9 rounded-xl text-xs font-bold transition ${
                language === value
                  ? 'bg-white text-zinc-950'
                  : 'text-zinc-400 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {value === 'ar' ? 'ع' : 'EN'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="h-11 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 text-xs font-bold text-red-100 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loggingOut ? '...' : t('Logout')}
        </button>
      </div>
    </header>
  )
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.07] text-sm font-black text-fuchsia-100 shadow-2xl shadow-fuchsia-950/30">
        SA
      </div>
      {!compact && (
        <div>
          <p className="text-sm font-bold tracking-[0.26em] text-white">SALON AI</p>
          <p className="mt-1 text-xs text-zinc-500">Management Portal</p>
        </div>
      )}
    </div>
  )
}

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  )
}

export function StatCard({
  label,
  value,
  tone = 'default',
  detail,
}: {
  label: string
  value: string | number
  tone?: 'default' | 'success' | 'danger'
  detail?: string
}) {
  const color =
    tone === 'success'
      ? 'text-emerald-300'
      : tone === 'danger'
        ? 'text-red-300'
        : 'text-fuchsia-200'

  return (
    <Card>
      <p className="text-sm font-medium text-zinc-400">{label}</p>
      <p className={`mt-4 text-4xl font-semibold tracking-tight ${color}`}>{value}</p>
      {detail && <p className="mt-3 text-sm text-zinc-500">{detail}</p>}
    </Card>
  )
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">{label}</span>
      {children}
      {hint && <span className="mt-2 block text-xs text-zinc-500">{hint}</span>}
    </label>
  )
}

export const inputClass =
  'w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-fuchsia-300/60 focus:bg-white/[0.06]'

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger'
}) {
  const styles = {
    primary:
      'bg-gradient-to-r from-fuchsia-200 via-white to-sky-100 text-zinc-950 shadow-lg shadow-fuchsia-950/30 hover:brightness-110',
    secondary:
      'border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]',
    danger:
      'border border-red-400/20 bg-red-500/10 text-red-100 hover:bg-red-500/20',
  }

  return (
    <button
      className={`rounded-2xl px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Alert({
  children,
  tone = 'error',
}: {
  children: React.ReactNode
  tone?: 'error' | 'success' | 'info'
}) {
  const styles = {
    error: 'border-red-400/20 bg-red-500/10 text-red-100',
    success: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100',
    info: 'border-sky-300/20 bg-sky-400/10 text-sky-100',
  }

  return (
    <div className={`whitespace-pre-wrap break-words rounded-2xl border px-4 py-3 text-sm ${styles[tone]}`}>
      {children}
    </div>
  )
}

export function LoadingScreen({ label = 'Loading workspace...' }: { label?: string }) {
  const elapsedSeconds = useElapsedSeconds()

  return (
    <main className="page-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.055] p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-fuchsia-300" />
        <p className="mt-4 text-sm text-zinc-400">{label}</p>
        <p className="mt-2 font-mono text-xs text-zinc-600">
          {formatElapsedTime(elapsedSeconds)}
        </p>
      </div>
    </main>
  )
}

function useElapsedSeconds() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return elapsedSeconds
}

function formatElapsedTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function EmptyState({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.035] p-10 text-center">
      <p className="font-semibold text-white">{title}</p>
      {description && <p className="mt-2 text-sm text-zinc-500">{description}</p>}
    </div>
  )
}
