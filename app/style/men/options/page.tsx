'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Alert, Button, Card } from '@/app/components/ui'
import { useStyleSession } from '@/components/style-session'

const lengthOptions = ['Random', 'Short', 'Medium', 'Long']

export default function MenOptionsPage() {
  const router = useRouter()
  const session = useStyleSession()
  const freshSessionHandledRef = useRef(false)
  const [handlingFreshSession, setHandlingFreshSession] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return new URLSearchParams(window.location.search).get('fresh') === '1'
  })
  const [message, setMessage] = useState('')
  const showSmartControls =
    session.mode === 'smart' && Boolean(session.imageFile || session.imagePreviewUrl)

  useEffect(() => {
    if (!handlingFreshSession || freshSessionHandledRef.current) {
      return
    }

    freshSessionHandledRef.current = true
    session.resetSession()
    session.setGender('men')
    router.replace('/style/men/options')
    setHandlingFreshSession(false)
  }, [handlingFreshSession, router, session])

  const selectSmart = () => {
    setMessage('')
    session.setGender('men')
    session.setMode('smart')

    if (!session.imageFile && !session.imagePreviewUrl) {
      router.push('/style/photo?flow=mode')
    }
  }

  const selectCatalog = () => {
    setMessage('')
    session.setGender('men')
    session.setMode('catalog')
    router.push(
      session.imageFile || session.imagePreviewUrl
        ? '/style/men/catalog/review'
        : '/style/photo?flow=mode',
    )
  }

  const generateSmartStyle = () => {
    if (!session.hairLength || !session.beardLength) {
      setMessage('Select hair length and beard length before continuing.')
      return
    }

    if (!session.imageFile) {
      setMessage('Upload the client image again before generating.')
      return
    }

    setMessage('')
    session.setGenerationError(undefined)
    session.setMode('smart')
    router.push('/style/loading')
  }

  if (handlingFreshSession) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          MEN STYLE
        </h1>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-white">
        MEN STYLE
      </h1>

      {message && <Alert>{message}</Alert>}

      {!showSmartControls && (
        <div className="grid gap-4 sm:grid-cols-2">
          <ModeCard
            title="Smart Style"
            icon={<SmartIcon />}
            active={session.mode === 'smart'}
            onClick={selectSmart}
          />
          <ModeCard
            title="Catalog Style"
            icon={<CatalogIcon />}
            active={session.mode === 'catalog'}
            onClick={selectCatalog}
          />
        </div>
      )}

      {showSmartControls && (
        <Card>
          <div className="space-y-6">
            <OptionGroup
              title="Hair Length"
              options={lengthOptions}
              selected={session.hairLength}
              onSelect={(hairLength) => {
                setMessage('')
                session.setMenOptions({ hairLength })
              }}
            />

            <OptionGroup
              title="Beard Length"
              options={lengthOptions}
              selected={session.beardLength}
              onSelect={(beardLength) => {
                setMessage('')
                session.setMenOptions({ beardLength })
              }}
            />

            <div className="grid grid-cols-[0.8fr_1.2fr] gap-3">
              <Button
                type="button"
                variant="secondary"
                className="h-14 w-full"
                onClick={() => router.push('/style/photo')}
              >
                Back
              </Button>
              <Button
                type="button"
                className="h-14 w-full"
                onClick={generateSmartStyle}
              >
                Generate
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

function ModeCard({
  title,
  icon,
  active,
  onClick,
}: {
  title: string
  icon: ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid min-h-40 place-items-center rounded-3xl border p-5 text-center transition ${
        active
          ? 'border-fuchsia-300/40 bg-white/[0.08]'
          : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
      }`}
    >
      <span className="grid h-16 w-16 place-items-center rounded-3xl bg-white text-zinc-950">
        {icon}
      </span>
      <span className="mt-3 text-xl font-semibold text-white">{title}</span>
    </button>
  )
}

function SmartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-9 w-9"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="M5 17l.9 2.1L8 20l-2.1.9L5 23l-.9-2.1L2 20l2.1-.9L5 17Z" />
      <path d="M19 2l.7 1.6L21 4l-1.3.4L19 6l-.7-1.6L17 4l1.3-.4L19 2Z" />
    </svg>
  )
}

function CatalogIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-9 w-9"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </svg>
  )
}

function OptionGroup({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string
  options: string[]
  selected?: string
  onSelect: (value: string) => void
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`min-h-16 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
              selected === option
                ? 'border-fuchsia-300/40 bg-white text-zinc-950'
                : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
