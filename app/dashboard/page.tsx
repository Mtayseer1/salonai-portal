'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { LoadingScreen } from '../components/ui'
import { supabase } from '../../src/lib/supabase'
import type { StyleSessionGender } from '@/lib/style-session/style-session-types'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [credits, setCredits] = useState(0)
  const [shopName, setShopName] = useState('')
  const [lang, setLang] = useState<'en' | 'ar'>(() => {
    if (typeof window === 'undefined') {
      return 'en'
    }

    return localStorage.getItem('salon_lang') === 'ar' ? 'ar' : 'en'
  })

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/')
        return
      }

      const { data: barber } = await supabase
        .from('barbers')
        .select('shop_name, remaining_credits')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!barber) {
        router.replace('/')
        return
      }

      setShopName(barber.shop_name || 'Salon AI')
      setCredits(barber.remaining_credits || 0)
      setLoading(false)
    }

    loadData()
  }, [router])

  const changeLang = (value: 'en' | 'ar') => {
    setLang(value)
    localStorage.setItem('salon_lang', value)
  }

  const logout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.replace('/')
  }

  const startStyle = (gender: StyleSessionGender) => {
    router.push(`/style?fresh=1&gender=${gender}`)
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,rgba(240,171,252,0.20),transparent_34%),radial-gradient(circle_at_90%_16%,rgba(125,211,252,0.13),transparent_28%),linear-gradient(160deg,#07070a_0%,#121016_52%,#07070a_100%)] px-4 py-6 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-[430px] flex-col">
        <header className="mb-5 flex min-h-12 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.07] text-sm font-black text-fuchsia-100 shadow-2xl shadow-fuchsia-950/30">
              SA
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.22em] text-white">
                SALON AI
              </p>
              <p className="mt-1 text-xs text-zinc-500">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-black/25 p-1">
              {(['en', 'ar'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => changeLang(value)}
                  className={`h-9 min-w-10 rounded-xl text-xs font-bold transition ${
                    lang === value
                      ? 'bg-white text-zinc-950'
                      : 'text-zinc-400 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {value.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="h-11 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 text-xs font-bold text-red-100 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loggingOut ? '...' : 'Logout'}
            </button>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-200/80 to-transparent" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-zinc-400">Welcome back</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {shopName}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => router.push('/buy-package')}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-fuchsia-200/20 bg-fuchsia-200/15 text-3xl font-semibold leading-none text-fuchsia-100 shadow-xl shadow-fuchsia-950/30 transition hover:bg-fuchsia-200/25"
              aria-label="Buy credits"
            >
              +
            </button>
          </div>
          <p className="mt-5 text-sm leading-6 text-zinc-400">
            Create salon-ready AI style previews for every client session.
          </p>
          <div className="mt-6 flex items-end justify-between gap-4 rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
            <div>
              <p className="text-sm font-medium text-zinc-400">Available credits</p>
              <p className="mt-2 text-6xl font-semibold tracking-tight text-fuchsia-100">
                {credits}
              </p>
            </div>
            <p className="max-w-32 text-right text-xs leading-5 text-zinc-500">
              {credits > 0
                ? 'Ready for client sessions.'
                : 'Add credits to start.'}
            </p>
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/25 backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-lg font-black text-zinc-950">
              +
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Start New Style</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Upload a client photo and create a fresh AI look.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StyleStartButton
              label="Men"
              description="Hair and beard"
              icon={<ManIcon />}
              onClick={() => startStyle('men')}
            />
            <StyleStartButton
              label="Women"
              description="Hair and beauty"
              icon={<WomanIcon />}
              onClick={() => startStyle('women')}
            />
          </div>
        </section>

        <div className="min-h-6 flex-1" />
      </section>
    </main>
  )
}

function StyleStartButton({
  label,
  description,
  icon,
  onClick,
}: {
  label: string
  description: string
  icon: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-32 rounded-3xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-fuchsia-200/30 hover:bg-white/[0.08]"
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-zinc-950">
        {icon}
      </span>
      <span className="mt-4 block text-lg font-semibold text-white">{label}</span>
      <span className="mt-1 block text-xs text-zinc-500">{description}</span>
    </button>
  )
}

function ManIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      <path d="M8.5 6.5h7" />
    </svg>
  )
}

function WomanIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M5 21a7 7 0 0 1 14 0" />
      <path d="M7.5 10.5c1.1 2.2 1.1 5-.5 7.5" />
      <path d="M16.5 10.5c-1.1 2.2-1.1 5 .5 7.5" />
    </svg>
  )
}
