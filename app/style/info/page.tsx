'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, Field, inputClass } from '@/app/components/ui'
import { useStyleSession } from '@/components/style-session'

export default function StyleInfoPage() {
  const router = useRouter()
  const { customerName, customerPhone, setCustomerInfo } = useStyleSession()
  const [name, setName] = useState(customerName ?? '')
  const [phone, setPhone] = useState(customerPhone ?? '')

  const continueToPhoto = () => {
    setCustomerInfo({
      customerName: name.trim() || undefined,
      customerPhone: phone.trim() || undefined,
    })
    router.push('/style/photo')
  }

  return (
    <Card className="max-w-2xl">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Client info
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Add optional customer details
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            These details stay with the current style session while moving through
            the flow.
          </p>
        </div>

        <div className="space-y-4">
          <Field label="Customer Name" hint="Optional">
            <input
              className={inputClass}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Customer name"
              autoComplete="name"
            />
          </Field>

          <Field label="Customer Phone" hint="Optional">
            <input
              className={inputClass}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Customer phone"
              autoComplete="tel"
              inputMode="tel"
            />
          </Field>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/style')}
          >
            Back
          </Button>
          <Button type="button" onClick={continueToPhoto}>
            Continue
          </Button>
        </div>
      </div>
    </Card>
  )
}
