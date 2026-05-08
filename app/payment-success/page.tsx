'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Alert, AppShell, Button, Card, LoadingScreen, salonNav } from '../components/ui'
import { supabase } from '../../src/lib/supabase'

function PaymentSuccessContent() {
  const router = useRouter()
  const params = useSearchParams()

  const orderId = params.get('order_id')
  const responseCode = params.get('response_code')

  const [message, setMessage] = useState('Finalizing payment...')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const finalize = async () => {
      if (!orderId) {
        setMessage('Missing payment reference.')
        return
      }

      if (responseCode !== '000') {
        setMessage('Payment not approved.')
        return
      }

      const { data: payment } = await supabase
        .from('customer_payments')
        .select('*')
        .eq('id', orderId)
        .single()

      if (!payment) {
        setMessage('Payment not found.')
        return
      }

      if (payment.status === 'paid') {
        setMessage('Payment already completed.')
        setDone(true)
        return
      }

      const { data: barber } = await supabase
        .from('barbers')
        .select('remaining_credits,total_credits')
        .eq('id', payment.customer_id)
        .single()

      const newRemaining = (barber?.remaining_credits || 0) + payment.credits
      const newTotal = (barber?.total_credits || 0) + payment.credits

      await supabase
        .from('barbers')
        .update({
          remaining_credits: newRemaining,
          total_credits: newTotal,
        })
        .eq('id', payment.customer_id)

      await supabase
        .from('customer_payments')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('id', payment.id)

      await supabase.from('credit_transactions').insert({
        customer_id: payment.customer_id,
        change_amount: payment.credits,
        transaction_type: 'purchase',
        notes: payment.package_name + ' package purchase',
        payment_id: payment.id,
      })

      setMessage('Payment successful. Credits added.')
      setDone(true)
    }

    finalize()
  }, [orderId, responseCode])

  return (
    <AppShell title="Payment Status" role="Salon" navItems={salonNav}>
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <div
          className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl border ${
            done
              ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-200'
              : 'border-sky-300/20 bg-sky-400/10 text-sky-200'
          }`}
        >
          {done ? 'OK' : '...'}
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white">
          Payment Status
        </h1>

        <div className="mt-5">
          <Alert tone={done ? 'success' : 'info'}>{message}</Alert>
        </div>

        {done && (
          <Button onClick={() => router.push('/dashboard')} className="mt-6 w-full">
            Go To Dashboard
          </Button>
        )}
      </Card>
      </div>
    </AppShell>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingScreen label="Loading payment status..." />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
