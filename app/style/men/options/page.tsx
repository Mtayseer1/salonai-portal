'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Alert, Button, Card } from '@/app/components/ui'
import { useStyleSession } from '@/components/style-session'
import { generateStyleFromSession } from '@/lib/style-session/style-session-generation'
import type { StyleSessionMode } from '@/lib/style-session/style-session-types'

const lengthOptions = ['Random', 'Short', 'Medium', 'Long']

const hairStyleOptions = [
  'Classic Fade',
  'Textured Crop',
  'Side Part',
  'Slick Back',
  'Curly Top',
  'Buzz Cut',
]

const beardStyleOptions = [
  'Clean Shave',
  'Stubble',
  'Short Boxed',
  'Full Beard',
  'Goatee',
  'Defined Line',
]

export default function MenOptionsPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [message, setMessage] = useState('')
  const [generating, setGenerating] = useState(false)
  const activeMode: Extract<StyleSessionMode, 'smart' | 'catalog'> =
    session.mode === 'catalog' ? 'catalog' : 'smart'

  const selectMode = (mode: Extract<StyleSessionMode, 'smart' | 'catalog'>) => {
    setMessage('')
    session.setMode(mode)
  }

  const continueToResult = async () => {
    session.setMode(activeMode)

    if (activeMode === 'smart') {
      if (!session.hairLength || !session.beardLength) {
        setMessage('Select hair length and beard length before continuing.')
        return
      }
    }

    if (activeMode === 'catalog') {
      if (!session.hairStyle || !session.beardStyle) {
        setMessage('Select hair style and beard style before continuing.')
        return
      }
    }

    if (!session.imageFile) {
      setMessage('Upload the client image again before generating.')
      return
    }

    try {
      setMessage('')
      setGenerating(true)

      const result = await generateStyleFromSession({ ...session, mode: activeMode })
      session.setGenerationResult(result)
      router.push('/style/result')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Generation failed.')
      setGenerating(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Men style
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Choose styling options
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Use smart length choices or select placeholder catalog styles for
            the temporary preview.
          </p>
        </div>

        {message && <Alert>{message}</Alert>}

        <div className="grid grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-2">
          <button
            type="button"
            onClick={() => selectMode('smart')}
            className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
              activeMode === 'smart'
                ? 'bg-white text-zinc-950'
                : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            Smart Style
          </button>
          <button
            type="button"
            onClick={() => selectMode('catalog')}
            className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
              activeMode === 'catalog'
                ? 'bg-white text-zinc-950'
                : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            Catalog Style
          </button>
        </div>

        {activeMode === 'smart' ? (
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
            </div>
          </Card>
        ) : (
          <Card>
            <div className="space-y-6">
              <OptionGroup
                title="Hair Style"
                options={hairStyleOptions}
                selected={session.hairStyle}
                onSelect={(hairStyle) => {
                  setMessage('')
                  session.setMenOptions({ hairStyle })
                }}
              />

              <OptionGroup
                title="Beard Style"
                options={beardStyleOptions}
                selected={session.beardStyle}
                onSelect={(beardStyle) => {
                  setMessage('')
                  session.setMenOptions({ beardStyle })
                }}
              />
            </div>
          </Card>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/style/photo')}
          >
            Back
          </Button>
          <Button type="button" onClick={continueToResult} disabled={generating}>
            {generating ? 'Generating...' : 'Continue'}
          </Button>
        </div>
      </div>

      <Card className="h-fit">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Preview
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">Session summary</h3>
          </div>

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

          <div className="space-y-3 text-sm">
            <PreviewRow label="Customer" value={session.customerName} />
            <PreviewRow label="Mode" value={activeMode === 'smart' ? 'Smart Style' : 'Catalog Style'} />
            {activeMode === 'smart' ? (
              <>
                <PreviewRow label="Hair Length" value={session.hairLength} />
                <PreviewRow label="Beard Length" value={session.beardLength} />
              </>
            ) : (
              <>
                <PreviewRow label="Hair Style" value={session.hairStyle} />
                <PreviewRow label="Beard Style" value={session.beardStyle} />
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
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
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((option) => {
          const active = selected === option

          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`min-h-16 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                active
                  ? 'border-fuchsia-300/40 bg-white text-zinc-950'
                  : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PreviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="text-zinc-500">{label}</span>
      <span className="text-right font-semibold text-white">{value || 'Not selected'}</span>
    </div>
  )
}
