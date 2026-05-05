'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Alert, Button, Card } from '@/app/components/ui'
import { useStyleSession } from '@/components/style-session'
import { generateStyleFromSession } from '@/lib/style-session/style-session-generation'
import type { StyleSessionMode } from '@/lib/style-session/style-session-types'

const lengthOptions = ['Random', 'Short', 'Medium', 'Long']

export default function WomenOptionsPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [message, setMessage] = useState('')
  const [generating, setGenerating] = useState(false)
  const activeMode: StyleSessionMode =
    session.mode === 'catalog' || session.mode === 'bridal' ? session.mode : 'smart'

  const selectSmart = () => {
    setMessage('')
    session.setMode('smart')
  }

  const selectCatalog = () => {
    setMessage('')
    session.setMode('catalog')
    router.push('/style/women/catalog/style')
  }

  const selectBridal = async () => {
    session.setMode('bridal')
    await generateWomenStyle('bridal')
  }

  const continueSmart = async () => {
    await generateWomenStyle('smart')
  }

  const generateWomenStyle = async (mode: Extract<StyleSessionMode, 'smart' | 'bridal'>) => {
    if (mode === 'smart' && !session.hairLength) {
      setMessage('Select hair length before continuing.')
      return
    }

    if (!session.imageFile) {
      setMessage('Upload the client image again before generating.')
      return
    }

    try {
      setMessage('')
      setGenerating(true)

      const result = await generateStyleFromSession({
        ...session,
        gender: 'women',
        mode,
      })
      session.setGenerationResult(result)
      router.push('/style/result')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Generation failed.')
      setGenerating(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Women style
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Choose a styling mode
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Smart generates from a few controls, catalog opens the wizard, and
            bridal generates directly.
          </p>
        </div>

        {message && <Alert>{message}</Alert>}

        <div className="grid gap-4 lg:grid-cols-3">
          <ModeCard
            title="Smart Style"
            description="Choose length, makeup, and dye preferences."
            active={activeMode === 'smart'}
            disabled={generating}
            onClick={selectSmart}
          />
          <ModeCard
            title="Catalog Style"
            description="Choose style, color, lipstick, mascara, and extensions."
            active={activeMode === 'catalog'}
            disabled={generating}
            onClick={selectCatalog}
          />
          <ModeCard
            title="Bridal Style"
            description="Generate a bridal look directly from the uploaded image."
            active={activeMode === 'bridal'}
            disabled={generating}
            onClick={selectBridal}
          />
        </div>

        {activeMode === 'smart' && (
          <Card>
            <div className="space-y-6">
              <OptionGroup
                title="Hair Length"
                options={lengthOptions}
                selected={session.hairLength}
                onSelect={(hairLength) => {
                  setMessage('')
                  session.setWomenOptions({ hairLength })
                }}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <ToggleCard
                  label="Makeup"
                  checked={Boolean(session.makeup)}
                  onClick={() =>
                    session.setWomenOptions({ makeup: !session.makeup })
                  }
                />
                <ToggleCard
                  label="Hair Dye"
                  checked={Boolean(session.dye)}
                  onClick={() => session.setWomenOptions({ dye: !session.dye })}
                />
              </div>

              <Button type="button" onClick={continueSmart} disabled={generating}>
                {generating ? 'Generating...' : 'Continue'}
              </Button>
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
  disabled,
  onClick,
}: {
  title: string
  description: string
  active: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-3xl border p-5 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
        active
          ? 'border-fuchsia-300/40 bg-white/[0.08]'
          : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
      }`}
    >
      <span className="text-lg font-semibold text-white">{title}</span>
      <span className="mt-2 block text-sm text-zinc-400">{description}</span>
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
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

function ToggleCard({
  label,
  checked,
  onClick,
}: {
  label: string
  checked: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-4 text-left transition ${
        checked
          ? 'border-fuchsia-300/40 bg-white text-zinc-950'
          : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]'
      }`}
    >
      <span className="font-bold">{label}</span>
      <span className="mt-1 block text-sm opacity-70">{checked ? 'On' : 'Off'}</span>
    </button>
  )
}
