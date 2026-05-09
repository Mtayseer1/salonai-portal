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

type PartnerPayment = {
  id: string
  name?: string
  email?: string
  phone?: string
  country?: string
  is_active?: boolean
  dueCommission: number
  pendingCommissionCount: number
  totalPaid: number
  lastPaidAt?: string | null
}

export default function AdminPartnersPage() {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [partners, setPartners] = useState<PartnerPayment[]>([])
  const [savingId, setSavingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const loadPartners = async (query = search) => {
    try {
      setMessage('')
      const params = new URLSearchParams()

      if (query.trim()) {
        params.set('search', query.trim())
      }

      const queryString = params.toString()
      const data = await adminFetch<{ partners: PartnerPayment[] }>(
        `/api/admin/partners/payments${queryString ? `?${queryString}` : ''}`,
      )
      setPartners(data.partners)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load partners.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadPartners(search)
    }, 250)

    return () => window.clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const totalDue = useMemo(
    () => partners.reduce((sum, partner) => sum + Number(partner.dueCommission || 0), 0),
    [partners],
  )

  const partnersWithDue = useMemo(
    () => partners.filter((partner) => Number(partner.dueCommission || 0) > 0).length,
    [partners],
  )

  const markPaid = async (partner: PartnerPayment) => {
    try {
      if (Number(partner.dueCommission || 0) <= 0) {
        setMessage('No unpaid commission found for this partner.')
        return
      }

      setSavingId(partner.id)
      setMessage('')

      const result = await adminFetch<{
        paidAmount: number
        paidCount: number
        paidAt: string | null
      }>('/api/admin/partners/payments', {
        method: 'POST',
        body: JSON.stringify({
          partnerId: partner.id,
          notes: `Paid all pending commissions for ${partner.name || partner.email || 'partner'}`,
        }),
      })

      setPartners((current) =>
        current.map((item) =>
          item.id === partner.id
            ? {
                ...item,
                dueCommission: 0,
                pendingCommissionCount: 0,
                totalPaid: Number(item.totalPaid || 0) + Number(result.paidAmount || 0),
                lastPaidAt: result.paidAt,
              }
            : item,
        ),
      )
      setMessage(
        `Partner paid successfully. ${Number(result.paidAmount || 0).toFixed(2)} JOD recorded in payment history.`,
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not mark partner as paid.')
    } finally {
      setSavingId(null)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <AppShell
      title="Partner Payments"
      subtitle="Review unpaid commissions and record partner payouts."
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
          <StatCard label="Partners" value={partners.length} detail="Current search results" />
          <StatCard label="With Due" value={partnersWithDue} tone="danger" detail="Awaiting payout" />
          <StatCard label="Total Due" value={`${totalDue.toFixed(2)} JD`} tone="success" detail="Unpaid overall commission" />
        </div>

        <Card className="p-0">
          <div className="space-y-4 border-b border-white/10 p-5">
            <div>
              <h2 className="text-xl font-semibold text-white">Partner list</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Search partners, check unpaid commission, and record payout when paid.
              </p>
            </div>
            <Field label="Search partners">
              <input
                className={inputClass}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search partners"
              />
            </Field>
          </div>

          {partners.length === 0 ? (
            <div className="p-5">
              <EmptyState title="No partners found." description="Try another search or create a partner account." />
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {partners.map((partner) => {
                const due = Number(partner.dueCommission || 0)

                return (
                  <div key={partner.id} className="space-y-4 p-5">
                    <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {partner.name || partner.email || 'Partner'}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {partner.email || 'No email'} - {partner.phone || 'No phone'}
                        </p>
                        <p className="mt-1 text-xs text-zinc-600">
                          {partner.country || 'No country'} - Last paid: {formatDate(partner.lastPaidAt)}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                          <p className="text-xs text-zinc-500">Due</p>
                          <p className="mt-1 text-2xl font-semibold text-fuchsia-100">
                            {due.toFixed(2)}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                          <p className="text-xs text-zinc-500">Paid</p>
                          <p className="mt-1 text-2xl font-semibold text-white">
                            {Number(partner.totalPaid || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                      <p className="text-sm text-zinc-500">
                        {partner.pendingCommissionCount || 0} unpaid commission records
                      </p>
                      <Button
                        type="button"
                        onClick={() => markPaid(partner)}
                        disabled={savingId === partner.id || due <= 0}
                      >
                        {savingId === partner.id ? 'Recording...' : 'Mark Paid'}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  )
}

function formatDate(value?: string | null) {
  if (!value) {
    return 'Never'
  }

  return new Date(value).toLocaleDateString()
}
