'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button, LoadingScreen } from '../components/ui'
import { supabase } from '../../src/lib/supabase'

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

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,rgba(240,171,252,0.20),transparent_34%),radial-gradient(circle_at_90%_16%,rgba(125,211,252,0.13),transparent_28%),linear-gradient(160deg,#07070a_0%,#121016_52%,#07070a_100%)] px-4 py-6 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-[430px] flex-col">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-200/80 to-transparent" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-zinc-400">Welcome back</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {shopName}
              </h1>
            </div>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-fuchsia-200/20 bg-fuchsia-200/15 text-sm font-black text-fuchsia-100 shadow-xl shadow-fuchsia-950/30">
              SA
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-zinc-400">
            Create salon-ready AI style previews for every client session.
          </p>
        </header>

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.045))] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-zinc-400">Available credits</p>
              <p className="mt-3 text-7xl font-semibold tracking-tight text-fuchsia-100">
                {credits}
              </p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-[1.4rem] border border-white/10 bg-black/25 text-2xl font-black text-fuchsia-100 shadow-inner shadow-black/30">
              AI
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-emerald-300/15 bg-emerald-400/10 px-4 py-3">
            <p className="text-sm font-semibold text-emerald-100">
              {credits > 0 ? 'Ready for sessions' : 'Buy credits to start'}
            </p>
            <p className="mt-1 text-xs text-emerald-100/60">
              Each successful result uses one credit.
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
          <Button
            type="button"
            className="h-14 w-full text-base"
            onClick={() => router.push('/style?fresh=1')}
          >
            Start New Style
          </Button>
        </section>

        <section className="mt-4 rounded-[2rem] border border-white/10 bg-black/20 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => router.push('/account')}
            className="flex min-h-16 w-full items-center justify-between gap-4 rounded-2xl text-left"
          >
            <span className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.07] text-sm font-bold text-fuchsia-100">
                AC
              </span>
              <span>
                <span className="block text-lg font-semibold text-white">Account</span>
                <span className="mt-1 block text-sm text-zinc-500">
                  Language, credits, and sign out
                </span>
              </span>
            </span>
            <span className="text-2xl text-zinc-500">&gt;</span>
          </button>
        </section>

        <div className="min-h-6 flex-1" />
      </section>
    </main>
  )
}
