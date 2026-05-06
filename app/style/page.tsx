'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Button, Card } from '@/app/components/ui'
import { useStyleSession } from '@/components/style-session'
import type { StyleSessionGender } from '@/lib/style-session/style-session-types'

const genderOptions: Array<{
  value: StyleSessionGender
  label: string
  description: string
}> = [
  {
    value: 'men',
    label: 'Men',
    description: 'Start the men styling path for hair and beard options.',
  },
  {
    value: 'women',
    label: 'Women',
    description: 'Start the women styling path for catalog and beauty options.',
  },
]

export default function StylePage() {
  const router = useRouter()
  const freshSessionHandledRef = useRef(false)
  const { gender, setGender, resetSession } = useStyleSession()

  useEffect(() => {
    if (freshSessionHandledRef.current) {
      return
    }

    const searchParams = new URLSearchParams(window.location.search)

    if (searchParams.get('fresh') !== '1') {
      return
    }

    freshSessionHandledRef.current = true
    resetSession()
    router.replace('/style')
  }, [resetSession, router])

  const selectGender = (value: StyleSessionGender) => {
    setGender(value)
    router.push('/style/info')
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Style session
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Choose a client path
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Select the session type before collecting client details and photo input.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {genderOptions.map((option) => {
          const active = gender === option.value

          return (
            <Card
              key={option.value}
              className={`flex min-h-56 flex-col ${
                active ? 'border-fuchsia-300/40 bg-white/[0.08]' : ''
              }`}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  Option
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  {option.label}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">{option.description}</p>
              </div>

              <Button
                type="button"
                onClick={() => selectGender(option.value)}
                variant={active ? 'primary' : 'secondary'}
                className="mt-6 w-full"
              >
                {active ? 'Selected' : `Select ${option.label}`}
              </Button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
