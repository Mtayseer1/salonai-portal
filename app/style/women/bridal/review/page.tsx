'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Alert, Button, Card } from '@/app/components/ui'
import { useStyleSession } from '@/components/style-session'

const styleOriginOptions = [
  'Indian style',
  'Middle Eastern style',
  'European style',
  'Turkish style',
  'Pakistani style',
  'Moroccan style',
]

const accessoryOptions = [
  'Veil',
  'Tiara',
  'Earrings',
  'Necklace',
  'Head jewelry',
  'Hair accessories',
  'Nose ring',
]

const hairOptions = [
  'Low bun',
  'Updo bun',
  'Hollywood waves',
  'Soft curls',
  'Braided style',
  'Covered hair',
  'Dupatta over head',
]

const makeupOptions = [
  'Natural bridal',
  'Soft glam',
  'Full glam',
  'Smokey bridal',
  'Arabian glam',
  'Dewy glow',
]

const moodOptions = [
  'Elegant',
  'Luxury',
  'Romantic',
  'Royal',
  'Traditional',
  'Modern',
]

type BridalSelectionKey =
  | 'bridalStyleOrigin'
  | 'bridalAccessories'
  | 'bridalHair'
  | 'bridalMakeup'
  | 'bridalMood'

export default function WomenBridalReviewPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [message, setMessage] = useState('')

  const selectedStyleOrigins = toSelectionArray(session.bridalStyleOrigin)
  const selectedAccessories = toSelectionArray(session.bridalAccessories)
  const selectedHair = toSelectionArray(session.bridalHair)
  const selectedMakeup = toSelectionArray(session.bridalMakeup)
  const selectedMoods = toSelectionArray(session.bridalMood)

  const toggleSelection = (
    key: BridalSelectionKey,
    selectedValues: string[],
    value: string,
  ) => {
    setMessage('')
    const nextValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value]

    session.setWomenOptions({ [key]: nextValues })
  }

  const generateBridalStyle = () => {
    session.setGender('women')
    session.setMode('bridal')

    if (!session.imageFile) {
      setMessage('Upload the client image before generating.')
      return
    }

    setMessage('')
    session.setGenerationError(undefined)
    router.push('/style/loading')
  }

  return (
    <div className="space-y-5 pb-28">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              BRIDAL STYLE
            </h1>
            <Button
              type="button"
              variant="secondary"
              className="px-4 py-2"
              onClick={() => router.push('/style/photo')}
            >
              Photo
            </Button>
          </div>

          {session.imagePreviewUrl ? (
            <div className="relative h-80 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
              <Image
                src={session.imagePreviewUrl}
                alt="Selected client preview"
                fill
                unoptimized
                priority
                className="object-contain"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/style/photo')}
              className="w-full rounded-3xl border border-dashed border-white/10 bg-white/[0.035] p-8 text-center text-sm font-semibold text-zinc-400"
            >
              Upload Photo
            </button>
          )}
        </div>
      </Card>

      {message && <Alert>{message}</Alert>}

      <MultiOptionGroup
        title="Style / Origin"
        options={styleOriginOptions}
        selected={selectedStyleOrigins}
        onToggle={(value) =>
          toggleSelection('bridalStyleOrigin', selectedStyleOrigins, value)
        }
      />

      <MultiOptionGroup
        title="Accessories"
        options={accessoryOptions}
        selected={selectedAccessories}
        onToggle={(value) =>
          toggleSelection('bridalAccessories', selectedAccessories, value)
        }
      />

      <MultiOptionGroup
        title="Hair"
        options={hairOptions}
        selected={selectedHair}
        onToggle={(value) => toggleSelection('bridalHair', selectedHair, value)}
      />

      <MultiOptionGroup
        title="Makeup"
        options={makeupOptions}
        selected={selectedMakeup}
        onToggle={(value) =>
          toggleSelection('bridalMakeup', selectedMakeup, value)
        }
      />

      <MultiOptionGroup
        title="Mood"
        options={moodOptions}
        selected={selectedMoods}
        onToggle={(value) => toggleSelection('bridalMood', selectedMoods, value)}
      />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#08080b]/95 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-[0.8fr_1.2fr] gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-14 w-full"
            onClick={() => router.push('/style/women/options')}
          >
            Back
          </Button>
          <Button
            type="button"
            className="h-14 w-full"
            onClick={generateBridalStyle}
          >
            Generate
          </Button>
        </div>
      </div>
    </div>
  )
}

function MultiOptionGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {options.map((option) => (
          <OptionButton
            key={option}
            label={option}
            active={selected.includes(option)}
            onClick={() => onToggle(option)}
          />
        ))}
      </div>
    </Card>
  )
}

function toSelectionArray(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value
  }

  return value ? [value] : []
}

function OptionButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-14 rounded-2xl border px-3 py-3 text-sm font-bold transition ${
        active
          ? 'border-fuchsia-300/40 bg-white text-zinc-950'
          : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}
