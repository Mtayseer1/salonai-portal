'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AppShell, Card, EmptyState, LoadingScreen, StatCard, partnerNav } from '../../components/ui'
import { supabase } from '../../../src/lib/supabase'

type Payment = {
  id: string
  amount: number
  notes: string
  paid_at: string
}

export default function PaymentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState<Payment[]>([])

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

      const { data } = await supabase
        .from('partner_payouts')
        .select('*')
        .eq('partner_id', partnerId)
        .order('paid_at', { ascending: false })

      setPayments(data || [])
      setLoading(false)
    }

    loadData()
  }, [router])

  if (loading) {
    return <LoadingScreen />
  }

  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)

  return (
    <AppShell
      title="Payment History"
      subtitle="Track partner payout activity and commission notes."
      role="Partner"
      navItems={partnerNav}
      userLabel="Partner account"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Total Paid" value={`${totalPaid} JD`} detail="All recorded payouts" />
          <StatCard label="Payments" value={payments.length} detail="Payout records" />
        </div>

        <Card className="p-0">
          <div className="border-b border-white/10 p-5">
            <h2 className="text-xl font-semibold text-white">Payouts</h2>
            <p className="mt-1 text-sm text-zinc-500">Most recent payments appear first.</p>
          </div>

          {payments.length === 0 ? (
            <div className="p-5">
              <EmptyState title="No payments yet." description="Partner payout records will appear here." />
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-white/[0.045] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm text-zinc-500">
                      {new Date(payment.paid_at).toLocaleDateString()}
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      {payment.notes || 'Partner Payment'}
                    </p>
                  </div>

                  <div className="text-2xl font-semibold text-fuchsia-100">
                    {payment.amount} JD
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
