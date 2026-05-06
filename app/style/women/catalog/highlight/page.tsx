'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@/app/components/ui'
import { CatalogOptionCard, CatalogStickyActions, useStyleSession } from '@/components/style-session'
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

      <CatalogStickyActions
        onBack={() => router.push('/style/women/catalog/contour')}
        onContinue={() => router.push('/style/women/catalog/review')}
        continueDisabled={!canContinue}
      />
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
    <CatalogOptionCard
      label={option.name}
      description={option.description}
      imagePath={option.imagePath}
      selected={selected}
      onClick={onSelect}
      imageClassName="aspect-[4/5]"
    />
  )
}

function ShowMore({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="secondary" className="h-12 w-full" onClick={onClick}>
      Show More
    </Button>
  )
}
