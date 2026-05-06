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
  BROW_OPTIONS,
  type BrowOption,
} from '@/lib/style-session/brow-options'

export default function WomenBrowsCatalogPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [visibleCount, setVisibleCount] = useState(20)
  const visibleBrows = useMemo(
    () => BROW_OPTIONS.slice(0, visibleCount),
    [visibleCount],
  )
  const canContinue = Boolean(session.browStyle)

  return (
    <div className="space-y-6 pb-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Women catalog
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Choose brows
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Select one brow style to complete the catalog look.
        </p>
      </div>

      <Card>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {visibleBrows.map((option) => (
              <BrowCard
                key={option.name}
                option={option}
                selected={session.browStyle === option.name}
                onSelect={() => session.setWomenOptions({ browStyle: option.name })}
              />
            ))}
          </div>

          {BROW_OPTIONS.length > visibleCount && (
            <Button
              type="button"
              variant="secondary"
              className="h-12 w-full"
              onClick={() => setVisibleCount((count) => count + 20)}
            >
              Show More
            </Button>
          )}
        </div>
      </Card>

      <CatalogStickyActions
        onBack={() => router.push('/style/women/catalog/eyes')}
        onContinue={() =>
          router.push(
            isReturningToReview()
              ? '/style/women/catalog/review'
              : '/style/women/catalog/skin',
          )
        }
        continueDisabled={!canContinue}
      />
    </div>
  )
}

function BrowCard({
  option,
  selected,
  onSelect,
}: {
  option: BrowOption
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
      imageClassName="aspect-square"
    />
  )
}
