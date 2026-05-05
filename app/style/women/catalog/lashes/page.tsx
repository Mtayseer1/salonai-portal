'use client'

import { useRouter } from 'next/navigation'
import { Button, Card } from '@/app/components/ui'
import {
  isReturningToReview,
  useStyleSession,
  useWomenCatalog,
} from '@/components/style-session'
import Image from 'next/image'
import { useMemo, useState } from 'react'

export default function WomenLashesCatalogPage() {
  const router = useRouter()
  const session = useStyleSession()
  const catalog = useWomenCatalog()
  const [visibleCount, setVisibleCount] = useState(20)
  const visibleMascaras = useMemo(
    () => catalog.mascaras.slice(0, visibleCount),
    [catalog.mascaras, visibleCount],
  )

  const continueToNext = () => {
    router.push('/style/women/catalog/review')
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Women catalog
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Choose lashes
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Select mascara and whether extensions should be included.
        </p>
      </div>

      <Card>
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {visibleMascaras.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => session.setWomenOptions({ mascara: option.id })}
                className={`overflow-hidden rounded-2xl border text-left transition ${
                  session.mascara === option.id
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
              </button>
            ))}
          </div>
          {catalog.mascaras.length > visibleCount && (
            <Button
              type="button"
              variant="secondary"
              className="h-12 w-full"
              onClick={() => setVisibleCount((count) => count + 20)}
            >
              Show More
            </Button>
          )}

          <button
            type="button"
            onClick={() =>
              session.setWomenOptions({ extensions: !session.extensions })
            }
            className={`rounded-2xl border px-4 py-4 text-left transition ${
              session.extensions
                ? 'border-fuchsia-300/40 bg-white text-zinc-950'
                : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]'
            }`}
          >
            <span className="font-bold">Extensions</span>
            <span className="mt-1 block text-sm opacity-70">
              {session.extensions ? 'On' : 'Off'}
            </span>
          </button>
        </div>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/style/women/catalog/makeup')}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={continueToNext}
          disabled={!session.mascara}
        >
          {isReturningToReview() ? 'Continue' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}
