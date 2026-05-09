'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  AppShell,
  Button,
  Card,
  EmptyState,
  Field,
  LoadingScreen,
  StatCard,
  adminNav,
  inputClass,
} from '../../components/ui'
import { adminFetch } from '@/src/lib/admin-api'

type Customer = {
  id: string
  barber_name?: string
  shop_name?: string
  email?: string
  phone?: string
  country?: string
  remaining_credits: number
  total_credits: number
  is_active?: boolean
}

type PackageItem = {
  id: string
  name: string
  images_count: number
  price_before_vat: number
  vat_percent: number
  is_active: boolean
}

export default function AdminCustomersPage() {
  const [loading, setLoading] = useState(true)
  const [packagesLoading, setPackagesLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [packages, setPackages] = useState<PackageItem[]>([])
  const [message, setMessage] = useState('')
  const [packageSelections, setPackageSelections] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  const loadCustomers = async (query = search) => {
    try {
      setMessage('')
      const params = new URLSearchParams()

      if (query.trim()) {
        params.set('search', query.trim())
      }

      const queryString = params.toString()
      const data = await adminFetch<{ customers: Customer[] }>(
        `/api/admin/customers${queryString ? `?${queryString}` : ''}`,
      )
      setCustomers(data.customers)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load customers.')
    } finally {
      setLoading(false)
    }
  }

  const loadPackages = async () => {
    try {
      const response = await fetch('/api/packages', { cache: 'no-store' })
      const data = await response.json()
      setPackages(Array.isArray(data) ? data : [])
    } catch {
      setPackages([])
    } finally {
      setPackagesLoading(false)
    }
  }

  useEffect(() => {
    loadPackages()
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadCustomers(search)
    }, 250)

    return () => window.clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const activeCustomers = useMemo(
    () => customers.filter((customer) => Number(customer.remaining_credits || 0) > 0).length,
    [customers],
  )

  const addCredits = async (customer: Customer) => {
    try {
      const packageId = packageSelections[customer.id]
      const selectedPackage = packages.find((pkg) => pkg.id === packageId)

      if (!packageId || !selectedPackage) {
        setMessage('Choose an active package.')
        return
      }

      setSavingId(customer.id)
      setMessage('')
      const result = await adminFetch<{
        remainingCredits: number
        totalCredits: number
        partnerId: string | null
        commissionAmount: number
      }>('/api/admin/customers/credits', {
        method: 'POST',
        body: JSON.stringify({
          customerId: customer.id,
          packageId,
          notes: `Admin added ${selectedPackage.name} package`,
        }),
      })

      setCustomers((current) =>
        current.map((item) =>
          item.id === customer.id
            ? {
                ...item,
                remaining_credits: result.remainingCredits,
                total_credits: result.totalCredits,
              }
            : item,
        ),
      )
      setPackageSelections((current) => ({ ...current, [customer.id]: '' }))
      setMessage(
        result.partnerId
          ? `Credits added successfully. Partner commission assigned: ${Number(result.commissionAmount || 0).toFixed(2)} JOD.`
          : 'Credits added successfully. No partner is linked to this customer.',
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not add credits.')
    } finally {
      setSavingId(null)
    }
  }

  if (loading || packagesLoading) {
    return <LoadingScreen />
  }

  return (
    <AppShell
      title="Customers"
      subtitle="Search salon customers and add credits by active package."
      role="Admin"
      navItems={adminNav}
      userLabel="Admin account"
    >
      <div className="space-y-6">
        {message && (
          <Alert tone={message.includes('success') ? 'success' : 'error'}>
            {message}
          </Alert>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Customers" value={customers.length} detail="Current search results" />
          <StatCard label="Active" value={activeCustomers} tone="success" detail="With available credits" />
          <StatCard
            label="Needs Attention"
            value={customers.length - activeCustomers}
            tone={customers.length - activeCustomers > 0 ? 'danger' : 'default'}
            detail="No credits remaining"
          />
        </div>

        <Card className="p-0">
          <div className="space-y-4 border-b border-white/10 p-5">
            <div>
              <h2 className="text-xl font-semibold text-white">Customer list</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Search by salon, barber, email, or phone. Credits can only be added through active packages.
              </p>
            </div>
            <Field label="Search customers">
              <input
                className={inputClass}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customers"
              />
            </Field>
          </div>

          {customers.length === 0 ? (
            <div className="p-5">
              <EmptyState title="No customers found." description="Try another search or create a customer account." />
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {customers.map((customer) => (
                <div key={customer.id} className="space-y-4 p-5">
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {customer.shop_name || customer.barber_name || customer.email}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {customer.barber_name || 'No barber name'} - {customer.email || 'No email'}
                      </p>
                      <p className="mt-1 text-xs text-zinc-600">
                        {customer.phone || 'No phone'} - {customer.country || 'No country'}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                        <p className="text-xs text-zinc-500">Available</p>
                        <p className="mt-1 text-2xl font-semibold text-fuchsia-100">
                          {customer.remaining_credits || 0}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                        <p className="text-xs text-zinc-500">Total</p>
                        <p className="mt-1 text-2xl font-semibold text-white">
                          {customer.total_credits || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <select
                      className={inputClass}
                      value={packageSelections[customer.id] || ''}
                      onChange={(event) =>
                        setPackageSelections((current) => ({
                          ...current,
                          [customer.id]: event.target.value,
                        }))
                      }
                    >
                      <option value="">Choose package</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} - {pkg.images_count} credits - {formatPackageTotal(pkg)} JOD
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      onClick={() => addCredits(customer)}
                      disabled={savingId === customer.id || packages.length === 0}
                    >
                      {savingId === customer.id ? 'Adding...' : 'Add Package'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  )
}

function formatPackageTotal(pkg: PackageItem) {
  return (
    Number(pkg.price_before_vat || 0) +
    (Number(pkg.price_before_vat || 0) * Number(pkg.vat_percent || 0)) / 100
  ).toFixed(2)
}
