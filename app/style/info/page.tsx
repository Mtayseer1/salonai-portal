'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, Field, inputClass } from '@/app/components/ui'
import { useStyleSession } from '@/components/style-session'

export default function StyleInfoPage() {
  const router = useRouter()
  const session = useStyleSession()
  const { customerName, customerPhone, setCustomerInfo } = session
  const freshSessionHandledRef = useRef(false)
  const [handlingFreshSession, setHandlingFreshSession] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return new URLSearchParams(window.location.search).get('fresh') === '1'
  })
  const [name, setName] = useState(customerName ?? '')
  const [phone, setPhone] = useState(customerPhone ?? '')

  useEffect(() => {
    if (!handlingFreshSession || freshSessionHandledRef.current) {
      return
    }

    freshSessionHandledRef.current = true
    const genderParam = new URLSearchParams(window.location.search).get('gender')

    session.resetSession()
    setName('')
    setPhone('')

    if (genderParam === 'men' || genderParam === 'women') {
      session.setGender(genderParam)
    }

    router.replace('/style/info')
    setHandlingFreshSession(false)
  }, [handlingFreshSession, router, session])

  const continueToPhoto = () => {
    setCustomerInfo({
      customerName: name.trim() || undefined,
      customerPhone: phone.trim() || undefined,
    })

    router.push('/style/photo')
  }

  const goBack = () => {
    router.push('/dashboard')
  }

  if (handlingFreshSession) {
    return null
  }

  return (
    <Card className="max-w-2xl">
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          CLIENT INFO
        </h1>

        <div className="space-y-4">
          <Field label="Customer Name">
            <input
              className={inputClass}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Customer name"
              autoComplete="name"
            />
          </Field>

          <Field label="Customer Phone">
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
            onClick={goBack}
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
