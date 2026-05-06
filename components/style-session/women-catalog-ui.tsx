'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button, Card } from '@/app/components/ui'
import { CatalogOptionCard, CatalogStickyActions } from './catalog-option-card'
import {
  emptyWomenCatalog,
  loadWomenCatalogManifest,
  type WomenCatalogData,
} from '@/lib/style-session/women-catalog'
import type { WomenCatalogOption } from '@/lib/style-session/style-session-types'

export function WomenCatalogStep({
  eyebrow,
  title,
  description,
  options,
  selected,
  onSelect,
  onBack,
  onContinue,
  continueDisabled,
}: {
  eyebrow: string
  title: string
  description: string
  options: WomenCatalogOption[]
  selected?: string
  onSelect: (id: string) => void
  onBack: () => void
  onContinue: () => void
  continueDisabled?: boolean
}) {
  const [visibleCount, setVisibleCount] = useState(20)
  const visibleOptions = useMemo(
    () => options.slice(0, visibleCount),
    [options, visibleCount],
  )

  return (
    <div className="space-y-6 pb-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">{description}</p>
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-3">
          {visibleOptions.map((option) => (
            <CatalogOptionCard
              key={option.id}
              label={option.label}
              description={option.description}
              imagePath={option.imagePath}
              selected={selected === option.id}
              onClick={() => onSelect(option.id)}
              imageClassName="aspect-square"
            />
          ))}
        </div>
        {options.length > visibleCount && (
          <Button
            type="button"
            variant="secondary"
            className="mt-4 h-12 w-full"
            onClick={() => setVisibleCount((count) => count + 20)}
          >
            Show More
          </Button>
        )}
      </Card>

      <CatalogStickyActions
        onBack={onBack}
        onContinue={onContinue}
        continueDisabled={continueDisabled}
      />
    </div>
  )
}

export function useWomenCatalog() {
  const [catalog, setCatalog] = useState<WomenCatalogData>(emptyWomenCatalog)

  useEffect(() => {
    let active = true

    loadWomenCatalogManifest().then((loadedCatalog) => {
      if (active) {
        console.log('catalog loaded', loadedCatalog)
        setCatalog(loadedCatalog)
      }
    })

    return () => {
      active = false
    }
  }, [])

  return catalog
}

export function isReturningToReview() {
  if (typeof window === 'undefined') {
    return false
  }

  return new URLSearchParams(window.location.search).get('returnTo') === 'review'
}
