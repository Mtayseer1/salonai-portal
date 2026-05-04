'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Alert,
  AppShell,
  Button,
  Card,
  EmptyState,
  LoadingScreen,
  salonNav,
} from '../components/ui'
import { supabase } from '../../src/lib/supabase'

type PackageItem = {
  id: string
  name: string
  images_count: number
  price_before_vat: number
  vat_percent: number
  is_active: boolean
}

type BarberProfile = {
  id: string
  country: string
}

export default function BuyPackagePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [payingId, setPayingId] = useState<string | null>(null)
  const [packages, setPackages] = useState<PackageItem[]>([])
  const [customerId, setCustomerId] = useState('')
  const [country, setCountry] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadPage = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.replace('/')
          return
        }

        setCustomerId(session.user.id)

        const { data: barber } = await supabase
          .from('barbers')
          .select('id,country')
          .eq('id', session.user.id)
          .single<BarberProfile>()

        if (!barber) {
          router.replace('/dashboard')
          return
        }

        setCountry(barber.country || '')

        const res = await fetch('/api/packages')
        const data = await res.json()

        if (Array.isArray(data)) {
          setPackages(data)
        } else {
          setPackages([])
        }

        setLoading(false)
      } catch {
        setPackages([])
        setLoading(false)
      }
    }

    loadPage()
  }, [router])

  const buyNow = async (pkg: PackageItem) => {
    try {
      setMessage('')
      setPayingId(pkg.id)

      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          packageName: pkg.name,
        }),
      })

      const data = await res.json()

      if (data.payment_url) {
        window.location.assign(data.payment_url)
        return
      }

      setMessage(data.error || 'Payment failed')
      setPayingId(null)
    } catch {
      setMessage('Unexpected error')
      setPayingId(null)
    }
  }

  if (loading) {
    return <LoadingScreen label="Loading credit packages..." />
  }

  return (
    <AppShell
      title="Buy Credits"
      subtitle="Choose the package that fits your salon volume. Prices include VAT where applicable."
      role="Salon"
      navItems={salonNav}
      userLabel={country || 'Salon account'}
    >
      <div className="space-y-6">
        {message && <Alert>{message}</Alert>}

        {packages.length === 0 ? (
          <EmptyState title="No active packages available." description="Available credit packages will appear here." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {packages.map((pkg, index) => {
              const total = (
                Number(pkg.price_before_vat) +
                (Number(pkg.price_before_vat) * Number(pkg.vat_percent)) / 100
              ).toFixed(2)

              const featured = index === 1 || pkg.name.toLowerCase().includes('silver')

              return (
                <Card
                  key={pkg.id}
                  className={`relative flex min-h-80 flex-col text-center ${
                    featured ? 'border-fuchsia-300/40 bg-white/[0.08]' : ''
                  }`}
                >
                  {featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-fuchsia-200/30 bg-fuchsia-300 px-3 py-1 text-xs font-bold text-zinc-950">
                      Best Value
                    </div>
                  )}

                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    Package
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{pkg.name}</h2>

                  <div className="my-8">
                    <p className="text-6xl font-semibold tracking-tight text-fuchsia-100">
                      {pkg.images_count}
                    </p>
                    <p className="mt-2 text-sm text-zinc-500">Credits</p>
                  </div>

                  <p className="text-3xl font-semibold text-white">{total} JOD</p>
                  <p className="mt-1 text-xs text-zinc-500">incl. VAT</p>

                  <Button
                    disabled={payingId === pkg.id}
                    onClick={() => buyNow(pkg)}
                    className="mt-auto w-full"
                  >
                    {payingId === pkg.id ? 'Processing...' : 'Buy Now'}
                  </Button>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
