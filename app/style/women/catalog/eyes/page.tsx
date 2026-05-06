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
  EYE_LASHES,
  EYE_LINERS,
  EYE_SHADOWS,
  type EyeOption,
} from '@/lib/style-session/eyes-options'

export default function WomenEyesCatalogPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [visibleShadowCount, setVisibleShadowCount] = useState(20)
  const [visibleLinerCount, setVisibleLinerCount] = useState(20)
  const [visibleLashesCount, setVisibleLashesCount] = useState(20)
  const visibleShadows = useMemo(
    () => EYE_SHADOWS.slice(0, visibleShadowCount),
    [visibleShadowCount],
  )
  const visibleLiners = useMemo(
    () => EYE_LINERS.slice(0, visibleLinerCount),
    [visibleLinerCount],
  )
  const visibleLashes = useMemo(
    () => EYE_LASHES.slice(0, visibleLashesCount),
    [visibleLashesCount],
  )
  const canContinue = Boolean(
    session.eyeShadow && session.eyeLiner && session.eyeLashes,
  )

  return (
    <div className="space-y-6 pb-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Women catalog
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Choose eyes
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Select eye shadow, liner, and lashes for the final catalog look.
        </p>
      </div>

      <Card>
        <div className="space-y-7">
          <EyeShadowSection
            title="Eyes Shadow"
            options={visibleShadows}
            selected={session.eyeShadow}
            onSelect={(eyeShadow) => session.setWomenOptions({ eyeShadow })}
          />
          {EYE_SHADOWS.length > visibleShadowCount && (
            <ShowMore onClick={() => setVisibleShadowCount((count) => count + 20)} />
          )}

          <EyeSection
            title="Liner"
            options={visibleLiners}
            selected={session.eyeLiner}
            onSelect={(eyeLiner) => session.setWomenOptions({ eyeLiner })}
          />
          {EYE_LINERS.length > visibleLinerCount && (
            <ShowMore onClick={() => setVisibleLinerCount((count) => count + 20)} />
          )}

          <EyeSection
            title="Lashes"
            options={visibleLashes}
            selected={session.eyeLashes}
            onSelect={(eyeLashes) =>
              session.setWomenOptions({
                eyeLashes,
                mascara: eyeLashes,
              })
            }
          />
          {EYE_LASHES.length > visibleLashesCount && (
            <ShowMore onClick={() => setVisibleLashesCount((count) => count + 20)} />
          )}
        </div>
      </Card>

      <CatalogStickyActions
        onBack={() => router.push('/style/women/catalog/lips')}
        onContinue={() =>
          router.push(
            isReturningToReview()
              ? '/style/women/catalog/review'
              : '/style/women/catalog/brows',
          )
        }
        continueDisabled={!canContinue}
      />
    </div>
  )
}

function EyeShadowSection({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string
  options: EyeOption[]
  selected?: string
  onSelect: (name: string) => void
}) {
  return (
    <section>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 space-y-4 scroll-smooth">
        {options.map((option) => {
          const active = selected === option.name

          return (
            <CatalogOptionCard
              key={option.name}
              label={option.name}
              description={option.description}
              imagePath={option.imagePath}
              selected={active}
              onClick={() => onSelect(option.name)}
              imageClassName="h-52 w-full"
              className="w-full rounded-3xl"
            />
          )
        })}
      </div>
    </section>
  )
}

function EyeSection({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string
  options: EyeOption[]
  selected?: string
  onSelect: (name: string) => void
}) {
  return (
    <section>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {options.map((option) => {
          const active = selected === option.name

          return (
            <CatalogOptionCard
              key={option.name}
              label={option.name}
              description={option.description}
              imagePath={option.imagePath}
              selected={active}
              onClick={() => onSelect(option.name)}
              imageClassName="aspect-square"
            />
          )
        })}
      </div>
    </section>
  )
}

function ShowMore({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="secondary" className="h-12 w-full" onClick={onClick}>
      Show More
    </Button>
  )
}
