'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@/app/components/ui'
import { CatalogOptionCard } from './catalog-option-card'
import { useStyleSession } from './style-session-provider'

export type WomenSingleOption = {
  id: string
  label: string
  description?: string
  imagePath?: string
}

export function WomenSingleOptionPage({
  title,
  subtitle,
  options,
  selectedId,
  onSelect,
  imageLayout = 'grid',
}: {
  title: string
  subtitle?: string
  options: WomenSingleOption[]
  selectedId?: string
  onSelect: (id: string) => void
  imageLayout?: 'grid' | 'large-list'
}) {
  const router = useRouter()
  const session = useStyleSession()
  const [visibleCount, setVisibleCount] = useState(20)
  const visibleOptions = useMemo(
    () => options.slice(0, visibleCount),
    [options, visibleCount],
  )

  const continueToReview = () => {
    router.push('/style/women/catalog/review')
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Women catalog
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">{subtitle}</p>
        )}
      </div>

      <Card>
        {visibleOptions.length > 0 ? (
          <div
            className={
              imageLayout === 'large-list'
                ? 'space-y-4 scroll-smooth'
                : 'grid grid-cols-2 gap-3'
            }
          >
            {visibleOptions.map((option) => (
              <CatalogOptionCard
                key={option.id}
                label={option.label}
                description={option.description}
                imagePath={option.imagePath}
                selected={selectedId === option.id}
                onClick={() => onSelect(option.id)}
                imageClassName={
                  imageLayout === 'large-list' ? 'h-52 w-full' : 'aspect-[1.15]'
                }
                className={imageLayout === 'large-list' ? 'w-full rounded-3xl' : ''}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.035] p-5 text-sm text-zinc-500">
            No options available.
          </div>
        )}

        {options.length > visibleCount && (
          <Button
            type="button"
            variant="secondary"
            className="mt-5 h-12 w-full"
            onClick={() => setVisibleCount((count) => count + 20)}
          >
            Show More
          </Button>
        )}
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#08080b]/95 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-14 w-full"
            onClick={() => router.push('/style/women/catalog/review')}
          >
            Back
          </Button>
          <Button
            type="button"
            className="h-14 w-full"
            onClick={continueToReview}
            disabled={!session.imageFile}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}

export function toWomenSingleOptions(
  options: Array<{
    id?: string
    name?: string
    label?: string
    description?: string
    imagePath?: string
  }>,
): WomenSingleOption[] {
  return options.map((option) => ({
    id: option.id || option.name || option.label || 'None',
    label: option.label || option.name || option.id || 'None',
    description: option.description,
    imagePath: option.imagePath,
  }))
}
