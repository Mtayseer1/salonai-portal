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
  SKIN_OPTIONS,
  type SkinOption,
} from '@/lib/style-session/skin-options'

export default function WomenSkinCatalogPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [visibleCount, setVisibleCount] = useState(20)
  const visibleSkinOptions = useMemo(
    () => SKIN_OPTIONS.slice(0, visibleCount),
    [visibleCount],
  )
  const canContinue = Boolean(session.skinType)

  return (
    <div className="space-y-6 pb-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Women catalog
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Choose skin
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Select one face base or foundation finish for the catalog look.
        </p>
      </div>

      <Card>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {visibleSkinOptions.map((option) => (
              <SkinCard
                key={option.name}
                option={option}
                selected={session.skinType === option.name}
                onSelect={() => session.setWomenOptions({ skinType: option.name })}
              />
            ))}
          </div>

          {SKIN_OPTIONS.length > visibleCount && (
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
        onBack={() => router.push('/style/women/catalog/brows')}
        onContinue={() =>
          router.push(
            isReturningToReview()
              ? '/style/women/catalog/review'
              : '/style/women/catalog/blush',
          )
        }
        continueDisabled={!canContinue}
      />
    </div>
  )
}

function SkinCard({
  option,
  selected,
  onSelect,
}: {
  option: SkinOption
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
