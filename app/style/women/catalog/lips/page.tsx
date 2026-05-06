'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Button, Card } from '@/app/components/ui'
import {
  CatalogOptionCard,
  CatalogStickyActions,
  isReturningToReview,
  useStyleSession,
} from '@/components/style-session'
import {
  LIP_COLORS,
  LIP_FINISHES,
  LIP_STYLES,
  type LipOption,
} from '@/lib/style-session/lips-catalog'

export default function WomenLipsCatalogPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [visibleColorCount, setVisibleColorCount] = useState(20)
  const visibleColors = useMemo(
    () => LIP_COLORS.slice(0, visibleColorCount),
    [visibleColorCount],
  )

  const canContinue = Boolean(session.lipFinish && session.lipStyle && session.lipColor)

  const continueToNext = () => {
    router.push(
      isReturningToReview()
        ? '/style/women/catalog/review'
        : '/style/women/catalog/eyes',
    )
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Women catalog
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Choose lips
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Select a finish, style, and color for the catalog look.
        </p>
      </div>

      <Card>
        <div className="space-y-7">
          <LipSection
            title="Finish"
            options={LIP_FINISHES}
            selected={session.lipFinish}
            layout="scroll"
            onSelect={(lipFinish) => session.setWomenOptions({ lipFinish })}
          />

          <LipSection
            title="Style"
            options={LIP_STYLES}
            selected={session.lipStyle}
            layout="scroll"
            onSelect={(lipStyle) => session.setWomenOptions({ lipStyle })}
          />

          <LipSection
            title="Color"
            options={visibleColors}
            selected={session.lipColor}
            layout="grid"
            onSelect={(lipColor) =>
              session.setWomenOptions({
                lipColor,
                lipstick: lipColor,
              })
            }
          />

          {LIP_COLORS.length > visibleColorCount && (
            <Button
              type="button"
              variant="secondary"
              className="h-12 w-full"
              onClick={() => setVisibleColorCount((count) => count + 20)}
            >
              Show More
            </Button>
          )}
        </div>
      </Card>

      <CatalogStickyActions
        onBack={() => router.push('/style/women/catalog/color')}
        onContinue={continueToNext}
        continueDisabled={!canContinue}
      />
    </div>
  )
}

function LipSection({
  title,
  options,
  selected,
  layout,
  onSelect,
}: {
  title: string
  options: LipOption[]
  selected?: string
  layout: 'scroll' | 'grid'
  onSelect: (id: string) => void
}) {
  return (
    <section>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div
        className={
          layout === 'scroll'
            ? 'mt-4 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]'
            : 'mt-4 grid grid-cols-2 gap-3'
        }
      >
        {options.map((option) => {
          const active = selected === option.id

          return (
            <CatalogOptionCard
              key={option.id}
              label={option.name}
              description={option.description}
              imagePath={option.imagePath}
              selected={active}
              onClick={() => onSelect(option.id)}
              imageClassName="aspect-square"
              className={layout === 'scroll' ? 'w-32 shrink-0' : ''}
            />
          )
        })}
      </div>
    </section>
  )
}
