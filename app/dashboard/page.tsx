'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  AppShell,
  Button,
  Card,
  LoadingScreen,
  StatCard,
  salonNav,
} from '../components/ui'
import { supabase } from '../../src/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState(0)
  const [shopName, setShopName] = useState('')
  const [lang, setLang] = useState<'en' | 'ar'>('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('salon_lang')
    if (savedLang === 'ar') {
      Promise.resolve().then(() => setLang('ar'))
    }

    const loadData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/')
        return
      }

      const userId = session.user.id

      const { data: barber } = await supabase
        .from('barbers')
        .select('shop_name, remaining_credits')
        .eq('id', userId)
        .maybeSingle()

      if (!barber) {
        router.replace('/')
        return
      }

      setShopName(barber.shop_name || 'My Account')
      setCredits(barber.remaining_credits || 0)
      setLoading(false)
    }

    loadData()
  }, [router])

  const changeLang = (value: 'en' | 'ar') => {
    setLang(value)
    localStorage.setItem('salon_lang', value)
  }

  if (loading) {
    return <LoadingScreen />
  }

  const isArabic = lang === 'ar'
  const active = credits > 0

  const t = {
    welcome: isArabic ? 'Welcome' : 'Welcome',
    dashboard: isArabic ? 'Dashboard' : 'Dashboard',
    credits: isArabic ? 'Remaining Credits' : 'Remaining Credits',
    status: isArabic ? 'Status' : 'Status',
    active: isArabic ? 'Active' : 'Active',
    inactive: isArabic ? 'No Credits' : 'No Credits',
    buy: isArabic ? 'Buy Credits' : 'Buy Credits',
    payments: isArabic ? 'Payment History' : 'Payment History',
  }

  return (
    <AppShell
      title={t.dashboard}
      subtitle="Track credit availability and manage the salon account workspace."
      role="Salon"
      navItems={salonNav}
      userLabel={shopName}
    >
      <div dir={isArabic ? 'rtl' : 'ltr'} className="space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400">{t.welcome}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {shopName}
            </h2>
            <p className="mt-2 text-sm text-zinc-500">Salon account overview</p>
          </div>
          <div className="flex gap-2">
            {(['en', 'ar'] as const).map((value) => (
              <button
                key={value}
                onClick={() => changeLang(value)}
                className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                  lang === value
                    ? 'bg-white text-zinc-950'
                    : 'border border-white/10 bg-white/[0.05] text-zinc-300 hover:text-white'
                }`}
              >
                {value.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label={t.credits} value={credits} detail="Available image generations" />
          <StatCard
            label={t.status}
            value={active ? t.active : t.inactive}
            tone={active ? 'success' : 'danger'}
            detail={active ? 'Account is ready to use' : 'Purchase credits to continue'}
          />
        </div>

        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Credit management</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Purchase new credit packages or review payment activity.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={() => router.push('/buy-package')}>{t.buy}</Button>
              <Button variant="secondary" onClick={() => router.push('/payments')}>
                {t.payments}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
