'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Alert,
  AppShell,
  Button,
  Card,
  Field,
  LoadingScreen,
  inputClass,
  partnerNav,
} from '../../components/ui'
import { supabase } from '../../../src/lib/supabase'

export default function AddCustomerPage() {
  const router = useRouter()
  const [loadingPage, setLoadingPage] = useState(true)

  const [barberName, setBarberName] = useState('')
  const [shopName, setShopName] = useState('')
  const [country, setCountry] = useState('Jordan')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/')
        return
      }

      const userId = session.user.id

      const { data: partner } = await supabase
        .from('partners')
        .select('id')
        .eq('id', userId)
        .maybeSingle()

      if (!partner) {
        router.replace('/')
        return
      }

      setLoadingPage(false)
    }

    checkAccess()
  }, [router])

  const handleCreate = async () => {
    setLoading(true)
    setMessage('')

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const partnerId = session?.user.id

    const res = await fetch('/api/create-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        barberName,
        shopName,
        country,
        description,
        phone,
        email,
        password,
        partnerId,
      }),
    })

    const data = await res.json()

    if (data.success) {
      setMessage('Customer created successfully.')

      setTimeout(() => {
        router.push('/partner')
      }, 1000)

      return
    }

    setMessage(data.error || 'Failed to create customer')
    setLoading(false)
  }

  if (loadingPage) {
    return <LoadingScreen />
  }

  return (
    <AppShell
      title="Add Customer"
      subtitle="Create a new salon account and connect it to your partner profile."
      role="Partner"
      navItems={partnerNav}
      userLabel="Partner account"
    >
      <Card className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Customer details</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Group the account, contact, and login details before creating access.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Barber name">
            <input
              type="text"
              placeholder="Owner or barber name"
              value={barberName}
              onChange={(e) => setBarberName(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Shop name">
            <input
              type="text"
              placeholder="Salon name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Country">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputClass}
            >
              <option>Jordan</option>
              <option>Lebanon</option>
              <option>Saudi Arabia</option>
              <option>United Arab Emirates</option>
            </select>
          </Field>

          <Field label="Phone number">
            <input
              type="text"
              placeholder="+962..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Login email">
            <input
              type="email"
              placeholder="customer@salon.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Temporary password">
            <input
              type="password"
              placeholder="Set initial password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Business description">
            <textarea
              placeholder="Notes about the salon, services, or setup needs"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} min-h-32 resize-none`}
            />
          </Field>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={handleCreate} disabled={loading} className="sm:w-auto">
            {loading ? 'Creating Customer...' : 'Create Customer'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/partner')}>
            Cancel
          </Button>
        </div>

        {message && (
          <div className="mt-5">
            <Alert tone={message.includes('success') ? 'success' : 'error'}>{message}</Alert>
          </div>
        )}
      </Card>
    </AppShell>
  )
}
