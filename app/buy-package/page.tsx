'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
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
  barber_name?: string
  shop_name?: string
}

const contactNumbers = [
  '00962795080561',
  '00962788888443',
  '00962791411697',
  '00962787575330',
]

const cliqAlias = 'NOORTECH'
const primaryContactNumber = contactNumbers[0]

export default function BuyPackagePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [packages, setPackages] = useState<PackageItem[]>([])
  const [country, setCountry] = useState('')
  const [username, setUsername] = useState('')

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

        const [{ data: barber }, packagesRes] = await Promise.all([
          supabase
            .from('barbers')
            .select('id,country,barber_name,shop_name')
            .eq('id', session.user.id)
            .single<BarberProfile>(),
          fetch('/api/packages'),
        ])

        if (!barber) {
          router.replace('/dashboard')
          return
        }

        setCountry(barber.country || '')
        setUsername(
          barber.shop_name ||
            barber.barber_name ||
            session.user.email ||
            session.user.id,
        )

        const data = await packagesRes.json()

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

  if (loading) {
    return <LoadingScreen label="Loading credit packages..." />
  }

  return (
    <AppShell
      title="Buy Credits"
      subtitle="Visa and card payments are disabled. Pay by CliQ, cash, or representative collection."
      role="Salon"
      navItems={salonNav}
      userLabel={country || 'Salon account'}
    >
      <div className="space-y-6">
        <PaymentInstructions username={username} />

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
                  <p className="mt-4 text-xs leading-5 text-zinc-500">
                    Pay this package manually by CliQ, cash, or representative collection.
                  </p>

                  <Button
                    type="button"
                    onClick={() =>
                      window.open(
                        createWhatsAppUrl(
                          primaryContactNumber,
                          createPackageMessage(pkg.name, total, username),
                        ),
                        '_blank',
                        'noopener,noreferrer',
                      )
                    }
                    className="mt-auto w-full"
                  >
                    Send Screenshot on WhatsApp
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

function PaymentInstructions({ username }: { username: string }) {
  return (
    <Card className="p-5">
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Manual payment only
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Visa and card payments are disabled
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Choose a package, transfer the exact amount, then send the transfer screenshot on WhatsApp with your username. You can also pay cash when our representative visits your salon.
          </p>
        </div>

        <div className="grid gap-3">
          <PaymentStep
            title="CliQ transfer"
            description="Transfer the exact package amount to the CliQ alias below."
          />
          <PaymentStep
            title="Screenshot confirmation"
            description="Take a screenshot of the transfer and send it on WhatsApp with your username."
          />
          <PaymentStep
            title="Cash or representative visit"
            description="Call or message us to arrange cash payment or a representative visit to your salon."
          />
        </div>

        <div className="rounded-3xl border border-fuchsia-200/20 bg-fuchsia-200/10 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-100">
                CliQ Alias
              </p>
              <p
                data-translate="no"
                className="mt-2 text-3xl font-semibold tracking-tight text-white"
              >
                {cliqAlias}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-100">
                Username to include
              </p>
              <p
                data-translate="no"
                className="mt-2 break-words text-lg font-semibold text-white"
              >
                {username || 'Your salon username'}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">WhatsApp and call numbers</h3>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Send the transfer screenshot on WhatsApp or call any number below.
          </p>
          <div className="mt-3 grid gap-3">
            {contactNumbers.map((number) => (
              <div
                key={number}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-3"
              >
                <span data-translate="no" className="font-mono text-sm text-zinc-200">
                  {number}
                </span>
                <a
                  href={createWhatsAppUrl(number)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-100 transition hover:bg-emerald-400/20"
                >
                  WhatsApp
                </a>
                <a
                  href={`tel:${toTelNumber(number)}`}
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.1]"
                >
                  Call
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

function PaymentStep({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>
    </div>
  )
}

function createPackageMessage(packageName: string, total: string, username: string) {
  return [
    'Hello, I want to buy credits.',
    `Package: ${packageName}`,
    `Amount: ${total} JOD`,
    `Username: ${username || 'My salon username'}`,
    'I will send the CliQ transfer screenshot.',
  ].join('\n')
}

function createWhatsAppUrl(number: string, message?: string) {
  const url = `https://wa.me/${toWhatsAppNumber(number)}`

  if (!message) {
    return url
  }

  return `${url}?text=${encodeURIComponent(message)}`
}

function toWhatsAppNumber(number: string) {
  return number.replace(/^00/, '').replace(/\D/g, '')
}

function toTelNumber(number: string) {
  return `+${toWhatsAppNumber(number)}`
}
