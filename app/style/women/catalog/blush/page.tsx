'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@/app/components/ui'
import {
  CatalogOptionCard,
  CatalogStickyActions,
  isReturningToReview,
  useStyleSession,
} from '@/components/style-session'
import {
  BLUSH_COLORS,
  BLUSH_INTENSITIES,
  BLUSH_STYLES,
  type BlushOption,
} from '@/lib/style-session/blush-options'

export default function WomenBlushCatalogPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [visibleColorCount, setVisibleColorCount] = useState(20)
  const [visibleStyleCount, setVisibleStyleCount] = useState(20)
  const [visibleIntensityCount, setVisibleIntensityCount] = useState(20)
  const visibleColors = useMemo(
    () => BLUSH_COLORS.slice(0, visibleColorCount),
    [visibleColorCount],
  )
  const visibleStyles = useMemo(
    () => BLUSH_STYLES.slice(0, visibleStyleCount),
    [visibleStyleCount],
  )
  const visibleIntensities = useMemo(
    () => BLUSH_INTENSITIES.slice(0, visibleIntensityCount),
    [visibleIntensityCount],
  )
  const canContinue = Boolean(
    session.blushColor && session.blushStyle && session.blushIntensity,
  )

  return (
    <div className="space-y-6 pb-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Women catalog
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Choose blush
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Select blush color, placement style, and intensity.
        </p>
      </div>

      <Card>
        <div className="space-y-8">
          <BlushSection
            title="Blush Color"
            options={visibleColors}
            selected={session.blushColor}
            onSelect={(blushColor) => session.setWomenOptions({ blushColor })}
          />
          {BLUSH_COLORS.length > visibleColorCount && (
            <ShowMore onClick={() => setVisibleColorCount((count) => count + 20)} />
          )}

          <BlushSection
            title="Blush Style"
            options={visibleStyles}
            selected={session.blushStyle}
            onSelect={(blushStyle) => session.setWomenOptions({ blushStyle })}
          />
          {BLUSH_STYLES.length > visibleStyleCount && (
            <ShowMore onClick={() => setVisibleStyleCount((count) => count + 20)} />
          )}

          <BlushSection
            title="Blush Intensity"
            options={visibleIntensities}
            selected={session.blushIntensity}
            onSelect={(blushIntensity) =>
              session.setWomenOptions({ blushIntensity })
            }
          />
          {BLUSH_INTENSITIES.length > visibleIntensityCount && (
            <ShowMore
              onClick={() => setVisibleIntensityCount((count) => count + 20)}
            />
          )}
        </div>
      </Card>

      <CatalogStickyActions
        onBack={() => router.push('/style/women/catalog/skin')}
        onContinue={() =>
          router.push(
            isReturningToReview()
              ? '/style/women/catalog/review'
              : '/style/women/catalog/contour',
          )
        }
        continueDisabled={!canContinue}
      />
    </div>
  )
}

function BlushSection({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string
  options: BlushOption[]
  selected?: string
  onSelect: (name: string) => void
}) {
  return (
    <section>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {options.map((option) => (
          <BlushCard
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

function BlushCard({
  option,
  selected,
  onSelect,
}: {
  option: BlushOption
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
