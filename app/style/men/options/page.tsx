'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Alert, Button, Card } from '@/app/components/ui'
import { useStyleSession } from '@/components/style-session'

const lengthOptions = ['Random', 'Short', 'Medium', 'Long']

export default function MenOptionsPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [message, setMessage] = useState('')
  const showSmartControls =
    session.mode === 'smart' && Boolean(session.imageFile || session.imagePreviewUrl)

  const selectSmart = () => {
    setMessage('')
    session.setMode('smart')
    router.push('/style/info')
  }

  const selectCatalog = () => {
    setMessage('')
    session.setMode('catalog')
    router.push('/style/info')
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

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Men style
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Choose a styling mode
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Smart creates random barber variations. Catalog lets you choose hair
            and beard from the full men catalog.
          </p>
        </div>

        {message && <Alert>{message}</Alert>}

        {!showSmartControls && (
          <div className="grid gap-4 sm:grid-cols-2">
            <ModeCard
              title="Smart Style"
              description="Pick hair and beard lengths, then generate random looks."
              active={session.mode === 'smart'}
              onClick={selectSmart}
            />
            <ModeCard
              title="Catalog Style"
              description="Take a photo, then choose hair and beard from the catalog."
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

      <Card className="h-fit">
        <div className="space-y-5">
          <h3 className="text-xl font-semibold text-white">Preview</h3>
          {session.imagePreviewUrl ? (
            <div className="relative h-72 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
              <Image
                src={session.imagePreviewUrl}
                alt="Selected client preview"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.035] p-8 text-center text-sm text-zinc-500">
              No image selected
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

function ModeCard({
  title,
  description,
  active,
  onClick,
}: {
  title: string
  description: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-48 rounded-3xl border p-5 text-left transition ${
        active
          ? 'border-fuchsia-300/40 bg-white/[0.08]'
          : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
      }`}
    >
      <span className="text-xl font-semibold text-white">{title}</span>
      <span className="mt-3 block text-sm leading-6 text-zinc-400">
        {description}
      </span>
    </button>
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
