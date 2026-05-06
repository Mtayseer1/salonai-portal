'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@/app/components/ui'
import { isReturningToReview, useStyleSession } from '@/components/style-session'
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

      <div className="sticky bottom-0 -mx-4 border-t border-white/10 bg-[#08080b]/90 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-14 w-full"
            onClick={() => router.push('/style/women/catalog/eyes')}
          >
            Back
          </Button>
          <Button
            type="button"
            className="h-14 w-full"
            onClick={() =>
              router.push(
                isReturningToReview()
                  ? '/style/women/catalog/review'
                  : '/style/women/catalog/skin',
              )
            }
            disabled={!canContinue}
          >
            Continue
          </Button>
        </div>
      </div>
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
        <span className="relative block aspect-square bg-black/25">
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
        <span className="grid aspect-square place-items-center bg-black/25 px-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
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
