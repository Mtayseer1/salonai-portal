'use client'

import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '../../src/lib/supabase'

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
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(192,132,252,0.16),transparent_34%),linear-gradient(135deg,#07070a_0%,#101014_48%,#07070a_100%)] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-black/20 px-5 py-6 backdrop-blur-xl lg:block">
          <Brand />
          <nav className="mt-10 space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    active
                      ? 'border border-fuchsia-300/30 bg-white/[0.08] text-white shadow-lg shadow-fuchsia-950/30'
                      : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-xl border text-xs ${
                      active
                        ? 'border-fuchsia-300/30 bg-fuchsia-300/15 text-fuchsia-100'
                        : 'border-white/10 bg-white/[0.04] text-zinc-400 group-hover:text-white'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              )
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#08080b]/80 px-4 py-4 backdrop-blur-xl sm:px-6">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div className="lg:hidden">
                <Brand compact />
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                  {role} portal
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                  {title}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 text-right sm:block">
                  <p className="text-xs text-zinc-500">{role}</p>
                  <p className="text-sm font-semibold text-white">{userLabel}</p>
                </div>
                <button
                  onClick={logout}
                  className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100 transition hover:bg-red-500/20"
                >
                  Logout
                </button>
              </div>
            </div>
            <div className="mx-auto mt-4 flex max-w-7xl gap-2 overflow-x-auto lg:hidden">
              {navItems.map((item) => {
                const active = pathname === item.href
                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? 'bg-white text-zinc-950'
                        : 'border border-white/10 bg-white/[0.04] text-zinc-300'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </header>

          <motion.section
            {...pageMotion}
            className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-8"
          >
            <div className="mb-6 lg:hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                {role} portal
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {title}
              </h1>
              {subtitle && <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>}
            </div>
            <div className="hidden lg:mb-8 lg:block">
              {subtitle && <p className="max-w-2xl text-sm text-zinc-400">{subtitle}</p>}
            </div>
            {children}
          </motion.section>
        </div>
      </div>
    </main>
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
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles[tone]}`}>
      {children}
    </div>
  )
}

export function LoadingScreen({ label = 'Loading workspace...' }: { label?: string }) {
  return (
    <main className="page-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.055] p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-fuchsia-300" />
        <p className="mt-4 text-sm text-zinc-400">{label}</p>
      </div>
    </main>
  )
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
