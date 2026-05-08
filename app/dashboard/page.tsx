'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AppBar, LoadingScreen } from '../components/ui'
import { supabase } from '../../src/lib/supabase'
import type { StyleSessionGender } from '@/lib/style-session/style-session-types'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState(0)
  const [shopName, setShopName] = useState('')

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

  const startStyle = (gender: StyleSessionGender) => {
    router.push(
      gender === 'men'
        ? '/style/men/options?fresh=1'
        : '/style/info?fresh=1&gender=women',
    )
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,rgba(240,171,252,0.20),transparent_34%),radial-gradient(circle_at_90%_16%,rgba(125,211,252,0.13),transparent_28%),linear-gradient(160deg,#07070a_0%,#121016_52%,#07070a_100%)] px-4 py-6 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-[430px] flex-col">
        <AppBar title="SALON AI" subtitle="Dashboard" />

        <section className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-200/80 to-transparent" />
          <p className="text-xs font-medium text-zinc-500">Welcome back</p>
          <h1 className="mt-1 truncate text-xl font-semibold tracking-tight text-white">
            {shopName}
          </h1>
          <div className="mt-3">
            <p className="text-xs font-medium text-zinc-500">
              Available credits
            </p>
            <div className="mt-1 flex items-center gap-3">
              <p className="text-4xl font-semibold tracking-tight text-fuchsia-100">
                {credits}
              </p>
              <button
                type="button"
                onClick={() => router.push('/buy-package')}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-fuchsia-200/20 bg-fuchsia-200/15 text-2xl font-semibold leading-none text-fuchsia-100 shadow-xl shadow-fuchsia-950/30 transition hover:bg-fuchsia-200/25"
                aria-label="Buy credits"
              >
                +
              </button>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[1.6rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/25 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-3">
            <StyleStartButton
              label="Men"
              icon={<ManIcon />}
              onClick={() => startStyle('men')}
            />
            <StyleStartButton
              label="Women"
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
  icon,
  onClick,
}: {
  label: string
  icon: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid min-h-36 place-items-center rounded-3xl border border-white/10 bg-black/20 p-4 text-center transition hover:border-fuchsia-200/30 hover:bg-white/[0.08]"
    >
      <span className="grid h-16 w-16 place-items-center rounded-3xl bg-white text-zinc-950">
        {icon}
      </span>
      <span className="mt-3 block text-lg font-semibold text-white">{label}</span>
    </button>
  )
}

function ManIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-9 w-9"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M7 9c0-3.5 2-5.5 5-5.5s5 2 5 5.5" />
      <path d="M8 8.5h8" />
      <path d="M8.5 10.5a3.5 3.5 0 0 0 7 0" />
      <path d="M5 21a7 7 0 0 1 14 0" />
      <path d="M10 14.5h4" />
    </svg>
  )
}

function WomanIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-9 w-9"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M7 10c0-4 2-6.5 5-6.5s5 2.5 5 6.5" />
      <path d="M8.5 10.5a3.5 3.5 0 0 0 7 0" />
      <path d="M5.5 20.5a6.5 6.5 0 0 1 13 0" />
      <path d="M7 9c-.5 3.5-1.2 5.8-2.4 8" />
      <path d="M17 9c.5 3.5 1.2 5.8 2.4 8" />
      <path d="M9 6.5c1.8 1 4.2 1 6 0" />
    </svg>
  )
}
