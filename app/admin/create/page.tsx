'use client'

import { useEffect, useState } from 'react'
import {
  Alert,
  AppShell,
  Button,
  Card,
  Field,
  LoadingScreen,
  adminNav,
  inputClass,
} from '../../components/ui'
import { adminFetch } from '@/src/lib/admin-api'

type AccountRole = 'admin' | 'partner' | 'customer'

type Partner = {
  id: string
  name?: string
  email?: string
}

const countryOptions = ['Jordan', 'Lebanon', 'Saudi Arabia', 'United Arab Emirates']

export default function AdminCreatePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [partners, setPartners] = useState<Partner[]>([])
  const [role, setRole] = useState<AccountRole>('customer')
  const [name, setName] = useState('')
  const [shopName, setShopName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('Jordan')
  const [description, setDescription] = useState('')
  const [partnerId, setPartnerId] = useState('')

  useEffect(() => {
    let active = true

    const loadPartners = async () => {
      try {
        const data = await adminFetch<{ partners: Partner[] }>('/api/admin/partners')

        if (active) {
          setPartners(data.partners)
          setLoading(false)
        }
      } catch (error) {
        if (active) {
          setMessage(error instanceof Error ? error.message : 'Admin access required.')
          setLoading(false)
        }
      }
    }

    loadPartners()

    return () => {
      active = false
    }
  }, [])

  const createAccount = async () => {
    try {
      setSaving(true)
      setMessage('')
      await adminFetch('/api/admin/create-user', {
        method: 'POST',
        body: JSON.stringify({
          role,
          name,
          shopName,
          email,
          password,
          phone,
          country,
          description,
          partnerId: partnerId || null,
        }),
      })
      setMessage('Account created successfully.')
      setName('')
      setShopName('')
      setEmail('')
      setPassword('')
      setPhone('')
      setDescription('')
      setPartnerId('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to create account.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <AppShell
      title="Create Account"
      subtitle="Create admins, partners, and customer salon accounts."
      role="Admin"
      navItems={adminNav}
      userLabel="Admin account"
    >
      <Card className="max-w-3xl">
        <div className="space-y-6">
          {message && (
            <Alert tone={message.includes('success') ? 'success' : 'error'}>
              {message}
            </Alert>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            {(['customer', 'partner', 'admin'] as AccountRole[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`min-h-14 rounded-2xl border px-4 py-3 text-sm font-bold capitalize transition ${
                  role === value
                    ? 'border-fuchsia-300/40 bg-white text-zinc-950'
                    : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]'
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={role === 'customer' ? 'Barber name' : 'Name'}>
              <input
                className={inputClass}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={role === 'customer' ? 'Owner or barber name' : 'Full name'}
              />
            </Field>

            {role === 'customer' && (
              <Field label="Shop name">
                <input
                  className={inputClass}
                  value={shopName}
                  onChange={(event) => setShopName(event.target.value)}
                  placeholder="Salon name"
                />
              </Field>
            )}

            <Field label="Login email">
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="account@salon.com"
                autoComplete="email"
              />
            </Field>

            <Field label="Temporary password">
              <input
                type="password"
                className={inputClass}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Set initial password"
                autoComplete="new-password"
              />
            </Field>

            <Field label="Phone number">
              <input
                className={inputClass}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+962..."
                inputMode="tel"
              />
            </Field>

            <Field label="Country">
              <select
                className={inputClass}
                value={country}
                onChange={(event) => setCountry(event.target.value)}
              >
                {countryOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>

            {role === 'customer' && (
              <Field label="Partner">
                <select
                  className={inputClass}
                  value={partnerId}
                  onChange={(event) => setPartnerId(event.target.value)}
                >
                  <option value="">No partner</option>
                  {partners.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                      {partner.name || partner.email || partner.id}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </div>

          {role === 'customer' && (
            <Field label="Business description">
              <textarea
                className={`${inputClass} min-h-28 resize-none`}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Notes about the salon, services, or setup needs"
              />
            </Field>
          )}

          <Button
            type="button"
            onClick={createAccount}
            disabled={saving}
            className="w-full"
          >
            {saving ? 'Creating...' : 'Create Account'}
          </Button>
        </div>
      </Card>
    </AppShell>
  )
}
