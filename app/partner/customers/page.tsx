'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import {
  AppShell,
  Button,
  Card,
  EmptyState,
  LoadingScreen,
  StatCard,
  partnerNav,
} from '../../components/ui'
import { supabase } from '../../../src/lib/supabase'

type Customer = {
  id: string
  barber_name: string
  shop_name: string
  remaining_credits: number
}

const PAGE_SIZE = 8

export default function CustomersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/')
        return
      }

      const partnerId = session.user.id

      const { data: links } = await supabase
        .from('partner_customers')
        .select('customer_id')
        .eq('partner_id', partnerId)

      const ids = links?.map((x) => x.customer_id) || []

      if (ids.length === 0) {
        setCustomers([])
        setLoading(false)
        return
      }

      const { data: rows } = await supabase
        .from('barbers')
        .select('id, barber_name, shop_name, remaining_credits')
        .in('id', ids)
        .order('created_at', { ascending: false })

      setCustomers(rows || [])
      setLoading(false)
    }

    loadData()
  }, [router])

  const totalPages = Math.max(1, Math.ceil(customers.length / PAGE_SIZE))
  const activeCustomers = customers.filter((c) => (c.remaining_credits || 0) > 0).length

  const pagedCustomers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return customers.slice(start, start + PAGE_SIZE)
  }, [customers, page])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <AppShell
      title="Customers"
      subtitle="Review salon credit status and customer activity across your partner portfolio."
      role="Partner"
      navItems={partnerNav}
      userLabel="Partner account"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Customers" value={customers.length} detail="Total linked accounts" />
          <StatCard label="Active" value={activeCustomers} tone="success" detail="With available credits" />
          <StatCard
            label="Needs Attention"
            value={customers.length - activeCustomers}
            tone={customers.length - activeCustomers > 0 ? 'danger' : 'default'}
            detail="No credits remaining"
          />
        </div>

        <Card className="p-0">
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Customer list</h2>
              <p className="mt-1 text-sm text-zinc-500">Credits, status, and quick actions.</p>
            </div>
            <Button onClick={() => router.push('/partner/add-customer')}>Add Customer</Button>
          </div>

          {customers.length === 0 ? (
            <div className="p-5">
              <EmptyState title="No customers yet." description="Create the first customer account to start tracking activity." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-separate border-spacing-0 text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    <th className="px-5 py-4 font-semibold">Name</th>
                    <th className="px-5 py-4 text-center font-semibold">Credits</th>
                    <th className="px-5 py-4 text-center font-semibold">Last Payment</th>
                    <th className="px-5 py-4 text-center font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedCustomers.map((customer, index) => {
                    const active = (customer.remaining_credits || 0) > 0

                    return (
                      <tr
                        key={customer.id}
                        className={`transition hover:bg-white/[0.07] ${
                          index % 2 === 0 ? 'bg-white/[0.025]' : 'bg-transparent'
                        }`}
                      >
                        <td className="border-t border-white/10 px-5 py-4">
                          <p className="font-semibold text-white">
                            {customer.shop_name || customer.barber_name}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">{customer.barber_name}</p>
                        </td>
                        <td className="border-t border-white/10 px-5 py-4 text-center font-bold text-white">
                          {customer.remaining_credits || 0}
                        </td>
                        <td className="border-t border-white/10 px-5 py-4 text-center text-zinc-400">
                          --
                        </td>
                        <td className="border-t border-white/10 px-5 py-4 text-center">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              active
                                ? 'bg-emerald-400/10 text-emerald-200'
                                : 'bg-red-500/10 text-red-200'
                            }`}
                          >
                            {active ? 'Active' : 'Not Active'}
                          </span>
                        </td>
                        <td className="border-t border-white/10 px-5 py-4 text-right">
                          <button className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-white/[0.1]">
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {customers.length > 0 && (
          <div className="grid grid-cols-3 items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="text-center text-sm text-zinc-400">
              Page {page}/{totalPages}
            </div>
            <Button
              variant="secondary"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
