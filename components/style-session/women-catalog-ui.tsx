'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { Button, Card } from '@/app/components/ui'
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
    <div className="space-y-6">
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
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={`overflow-hidden rounded-2xl border text-left transition ${
                selected === option.id
                  ? 'border-fuchsia-300/40 bg-white text-zinc-950'
                  : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {option.imagePath && (
                <span className="relative block aspect-square bg-black/25">
                  <Image
                    src={option.imagePath}
                    alt={option.label}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </span>
              )}
              <span className="block p-3 font-bold">{option.label}</span>
              {option.description && (
                <span className="block px-3 pb-3 text-sm opacity-70">
                  {option.description}
                </span>
              )}
            </button>
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

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onContinue} disabled={continueDisabled}>
          Continue
        </Button>
      </div>
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
