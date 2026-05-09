'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Alert,
  AppShell,
  Button,
  Card,
  LoadingScreen,
  StatCard,
  adminNav,
} from '../components/ui'
import { adminFetch } from '@/src/lib/admin-api'

type AdminSummary = {
  customers: number
  activeCustomers: number
  partners: number
  admins: number
}

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<AdminSummary>({
    customers: 0,
    activeCustomers: 0,
    partners: 0,
    admins: 0,
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true

    const loadSummary = async () => {
      try {
        const data = await adminFetch<AdminSummary>('/api/admin/summary')

        if (active) {
          setSummary(data)
          setLoading(false)
        }
      } catch (error) {
        if (active) {
          setMessage(error instanceof Error ? error.message : 'Admin access required.')
          setLoading(false)
        }
      }
    }

    loadSummary()

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <AppShell
      title="Admin Dashboard"
      subtitle="Create accounts, manage customers, and control credits."
      role="Admin"
      navItems={adminNav}
      userLabel="Admin account"
    >
      <div className="space-y-6">
        {message && <Alert>{message}</Alert>}

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Total Customers" value={summary.customers} detail="Salon accounts" />
          <StatCard label="Active Customers" value={summary.activeCustomers} tone="success" detail="With available credits" />
          <StatCard label="Total Partners" value={summary.partners} detail="Partner accounts" />
          <StatCard label="Admins" value={summary.admins} detail="Active admin accounts" />
        </div>

        <Card>
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-white">Admin operations</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Create admin, partner, and customer accounts, then manage customer credits from one place.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button type="button" onClick={() => router.push('/admin/create')}>
                Create Account
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/admin/customers')}
              >
                Manage Customers
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
