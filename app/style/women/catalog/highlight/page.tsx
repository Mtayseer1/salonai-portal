'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@/app/components/ui'
import { useStyleSession } from '@/components/style-session'
import {
  HIGHLIGHT_FINISHES,
  HIGHLIGHT_INTENSITIES,
  HIGHLIGHT_PLACEMENTS,
  HIGHLIGHT_TONES,
  type HighlightOption,
} from '@/lib/style-session/highlight-options'

export default function WomenHighlightCatalogPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [visiblePlacementCount, setVisiblePlacementCount] = useState(20)
  const [visibleToneCount, setVisibleToneCount] = useState(20)
  const [visibleIntensityCount, setVisibleIntensityCount] = useState(20)
  const [visibleFinishCount, setVisibleFinishCount] = useState(20)
  const visiblePlacements = useMemo(
    () => HIGHLIGHT_PLACEMENTS.slice(0, visiblePlacementCount),
    [visiblePlacementCount],
  )
  const visibleTones = useMemo(
    () => HIGHLIGHT_TONES.slice(0, visibleToneCount),
    [visibleToneCount],
  )
  const visibleIntensities = useMemo(
    () => HIGHLIGHT_INTENSITIES.slice(0, visibleIntensityCount),
    [visibleIntensityCount],
  )
  const visibleFinishes = useMemo(
    () => HIGHLIGHT_FINISHES.slice(0, visibleFinishCount),
    [visibleFinishCount],
  )
  const canContinue = Boolean(
    session.highlightPlacement &&
      session.highlightTone &&
      session.highlightIntensity &&
      session.highlightFinish,
  )

  return (
    <div className="space-y-6 pb-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Women catalog
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Choose highlight
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Select placement, tone, intensity, and finish.
        </p>
      </div>

      <Card>
        <div className="space-y-8">
          <HighlightSection
            title="Placement"
            options={visiblePlacements}
            selected={session.highlightPlacement}
            onSelect={(highlightPlacement) =>
              session.setWomenOptions({ highlightPlacement })
            }
          />
          {HIGHLIGHT_PLACEMENTS.length > visiblePlacementCount && (
            <ShowMore
              onClick={() => setVisiblePlacementCount((count) => count + 20)}
            />
          )}

          <HighlightSection
            title="Tone"
            options={visibleTones}
            selected={session.highlightTone}
            onSelect={(highlightTone) => session.setWomenOptions({ highlightTone })}
          />
          {HIGHLIGHT_TONES.length > visibleToneCount && (
            <ShowMore onClick={() => setVisibleToneCount((count) => count + 20)} />
          )}

          <HighlightSection
            title="Intensity"
            options={visibleIntensities}
            selected={session.highlightIntensity}
            onSelect={(highlightIntensity) =>
              session.setWomenOptions({ highlightIntensity })
            }
          />
          {HIGHLIGHT_INTENSITIES.length > visibleIntensityCount && (
            <ShowMore
              onClick={() => setVisibleIntensityCount((count) => count + 20)}
            />
          )}

          <HighlightSection
            title="Finish"
            options={visibleFinishes}
            selected={session.highlightFinish}
            onSelect={(highlightFinish) =>
              session.setWomenOptions({ highlightFinish })
            }
          />
          {HIGHLIGHT_FINISHES.length > visibleFinishCount && (
            <ShowMore onClick={() => setVisibleFinishCount((count) => count + 20)} />
          )}
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-4 border-t border-white/10 bg-[#08080b]/90 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-14 w-full"
            onClick={() => router.push('/style/women/catalog/contour')}
          >
            Back
          </Button>
          <Button
            type="button"
            className="h-14 w-full"
            onClick={() => router.push('/style/women/catalog/review')}
            disabled={!canContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

function HighlightSection({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string
  options: HighlightOption[]
  selected?: string
  onSelect: (name: string) => void
}) {
  return (
    <section>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {options.map((option) => (
          <HighlightCard
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

function HighlightCard({
  option,
  selected,
  onSelect,
}: {
  option: HighlightOption
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
