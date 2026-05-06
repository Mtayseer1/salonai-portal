'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@/app/components/ui'
import { isReturningToReview, useStyleSession } from '@/components/style-session'
import {
  BRONZER_TONES,
  CONTOUR_INTENSITIES,
  CONTOUR_TYPES,
  type ContourOption,
} from '@/lib/style-session/contour-options'

export default function WomenContourCatalogPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [visibleTypeCount, setVisibleTypeCount] = useState(20)
  const [visibleToneCount, setVisibleToneCount] = useState(20)
  const [visibleIntensityCount, setVisibleIntensityCount] = useState(20)
  const visibleTypes = useMemo(
    () => CONTOUR_TYPES.slice(0, visibleTypeCount),
    [visibleTypeCount],
  )
  const visibleTones = useMemo(
    () => BRONZER_TONES.slice(0, visibleToneCount),
    [visibleToneCount],
  )
  const visibleIntensities = useMemo(
    () => CONTOUR_INTENSITIES.slice(0, visibleIntensityCount),
    [visibleIntensityCount],
  )
  const canContinue = Boolean(
    session.contourType && session.bronzerTone && session.contourIntensity,
  )

  return (
    <div className="space-y-6 pb-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Women catalog
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Choose contour
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Select contour type, bronzer tone, and contour intensity.
        </p>
      </div>

      <Card>
        <div className="space-y-8">
          <ContourSection
            title="Contour Type"
            options={visibleTypes}
            selected={session.contourType}
            onSelect={(contourType) => session.setWomenOptions({ contourType })}
          />
          {CONTOUR_TYPES.length > visibleTypeCount && (
            <ShowMore onClick={() => setVisibleTypeCount((count) => count + 20)} />
          )}

          <ContourSection
            title="Bronzer Tone"
            options={visibleTones}
            selected={session.bronzerTone}
            onSelect={(bronzerTone) => session.setWomenOptions({ bronzerTone })}
          />
          {BRONZER_TONES.length > visibleToneCount && (
            <ShowMore onClick={() => setVisibleToneCount((count) => count + 20)} />
          )}

          <ContourSection
            title="Contour Intensity"
            options={visibleIntensities}
            selected={session.contourIntensity}
            onSelect={(contourIntensity) =>
              session.setWomenOptions({ contourIntensity })
            }
          />
          {CONTOUR_INTENSITIES.length > visibleIntensityCount && (
            <ShowMore
              onClick={() => setVisibleIntensityCount((count) => count + 20)}
            />
          )}
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-4 border-t border-white/10 bg-[#08080b]/90 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-14 w-full"
            onClick={() => router.push('/style/women/catalog/blush')}
          >
            Back
          </Button>
          <Button
            type="button"
            className="h-14 w-full"
            onClick={() =>
              router.push(
                isReturningToReview()
                  ? '/style/women/catalog/review'
                  : '/style/women/catalog/highlight',
              )
            }
            disabled={!canContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

function ContourSection({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string
  options: ContourOption[]
  selected?: string
  onSelect: (name: string) => void
}) {
  return (
    <section>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {options.map((option) => (
          <ContourCard
            key={option.name}
            option={option}
            selected={selected === option.name}
            onSelect={() => onSelect(option.name)}
          />
        ))}
      </div>
    </section>
  )
}

function ContourCard({
  option,
  selected,
  onSelect,
}: {
  option: ContourOption
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`overflow-hidden rounded-2xl border text-left transition ${
        selected
          ? 'scale-[1.015] border-fuchsia-300/60 bg-white text-zinc-950 shadow-xl shadow-fuchsia-950/20'
          : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white'
      }`}
    >
      {option.imagePath ? (
        <span className="relative block aspect-[4/5] bg-black/25">
          <Image
            src={option.imagePath}
            alt={option.name}
            fill
            unoptimized
            loading="lazy"
            className="object-cover"
          />
        </span>
      ) : (
        <span className="grid aspect-[4/5] place-items-center bg-black/25 px-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          None
        </span>
      )}
      <span className="block p-3">
        <span className="block text-sm font-bold">{option.name}</span>
        <span className="mt-1 block text-xs opacity-70">
          {option.description}
        </span>
      </span>
    </button>
  )
}

function ShowMore({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="secondary" className="h-12 w-full" onClick={onClick}>
      Show More
    </Button>
  )
}
