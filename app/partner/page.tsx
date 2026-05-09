'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AppShell, Button, Card, LoadingScreen, StatCard, partnerNav } from '../components/ui'
import { supabase } from '../../src/lib/supabase'

export default function PartnerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [commissionDue, setCommissionDue] = useState(0)

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

      const { count } = await supabase
        .from('partner_customers')
        .select('*', { count: 'exact', head: true })
        .eq('partner_id', userId)

      const { data: commissions } = await supabase
        .from('partner_commissions')
        .select('commission_amount,status')
        .eq('partner_id', userId)

      setTotalCustomers(count || 0)
      setCommissionDue(
        (commissions || []).reduce(
          (sum, commission) =>
            commission.status === 'paid'
              ? sum
              : sum + Number(commission.commission_amount || 0),
          0,
        ),
      )
      setLoading(false)
    }

    checkAccess()
  }, [router])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <AppShell
      title="Partner Dashboard"
      subtitle="Manage salon accounts, monitor customer activity, and track commission performance."
      role="Partner"
      navItems={partnerNav}
      userLabel="Partner account"
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total Customers" value={totalCustomers} detail="Linked salon accounts" />
          <StatCard
            label="Commission Due"
            value={`${commissionDue.toFixed(2)} JD`}
            detail="Unpaid overall commissions"
          />
          <StatCard label="Conversion Status" value="Active" tone="success" detail="Portal is ready" />
        </div>

        <Card>
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-xl font-semibold text-white">Partner operations</h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                Add new salon customers, review credit status, and keep payout activity visible.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Button onClick={() => router.push('/partner/add-customer')}>Add Customer</Button>
              <Button variant="secondary" onClick={() => router.push('/partner/customers')}>
                View Customers
              </Button>
              <Button variant="secondary" onClick={() => router.push('/partner/payments')}>
                Payment History
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
