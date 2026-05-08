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

const dressColorOptions = [
  'White dress',
  'Ivory dress',
  'Red dress',
  'Gold dress',
  'Blush pink dress',
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

const dressShapeOptions = [
  'Modest dress',
  'Off-shoulder',
  'Long sleeve',
  'Strapless',
  'Ball gown',
  'Mermaid',
]

const moodOptions = [
  'Elegant',
  'Luxury',
  'Romantic',
  'Royal',
  'Traditional',
  'Modern',
]

export default function WomenBridalReviewPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [message, setMessage] = useState('')

  const selectedAccessories = session.bridalAccessories ?? []

  const toggleAccessory = (value: string) => {
    setMessage('')
    const nextAccessories = selectedAccessories.includes(value)
      ? selectedAccessories.filter((item) => item !== value)
      : [...selectedAccessories, value]

    session.setWomenOptions({ bridalAccessories: nextAccessories })
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

      <OptionGroup
        title="Style / Origin"
        options={styleOriginOptions}
        selected={session.bridalStyleOrigin}
        onSelect={(bridalStyleOrigin) => {
          setMessage('')
          session.setWomenOptions({ bridalStyleOrigin })
        }}
      />

      <OptionGroup
        title="Dress Color"
        options={dressColorOptions}
        selected={session.bridalDressColor}
        onSelect={(bridalDressColor) => {
          setMessage('')
          session.setWomenOptions({ bridalDressColor })
        }}
      />

      <MultiOptionGroup
        title="Accessories"
        options={accessoryOptions}
        selected={selectedAccessories}
        onToggle={toggleAccessory}
      />

      <OptionGroup
        title="Hair"
        options={hairOptions}
        selected={session.bridalHair}
        onSelect={(bridalHair) => {
          setMessage('')
          session.setWomenOptions({ bridalHair })
        }}
      />

      <OptionGroup
        title="Makeup"
        options={makeupOptions}
        selected={session.bridalMakeup}
        onSelect={(bridalMakeup) => {
          setMessage('')
          session.setWomenOptions({ bridalMakeup })
        }}
      />

      <OptionGroup
        title="Dress Shape"
        options={dressShapeOptions}
        selected={session.bridalDressShape}
        onSelect={(bridalDressShape) => {
          setMessage('')
          session.setWomenOptions({ bridalDressShape })
        }}
      />

      <OptionGroup
        title="Mood"
        options={moodOptions}
        selected={session.bridalMood}
        onSelect={(bridalMood) => {
          setMessage('')
          session.setWomenOptions({ bridalMood })
        }}
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
    <Card className="p-4">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {options.map((option) => (
          <OptionButton
            key={option}
            label={option}
            active={selected === option}
            onClick={() => onSelect(option)}
          />
        ))}
      </div>
    </Card>
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
