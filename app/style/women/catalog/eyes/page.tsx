'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@/app/components/ui'
import { isReturningToReview, useStyleSession } from '@/components/style-session'
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

      <div className="sticky bottom-0 -mx-4 border-t border-white/10 bg-[#08080b]/90 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-14 w-full"
            onClick={() => router.push('/style/women/catalog/lips')}
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
                  : '/style/women/catalog/brows',
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
            <button
              key={option.name}
              type="button"
              onClick={() => onSelect(option.name)}
              className={`w-full overflow-hidden rounded-3xl border text-left transition duration-200 ${
                active
                  ? 'scale-[1.015] border-fuchsia-300/70 bg-white text-zinc-950 shadow-2xl shadow-fuchsia-950/30'
                  : 'border-white/10 bg-white/[0.04] text-zinc-300 shadow-xl shadow-black/15 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {option.imagePath ? (
                <span className="relative block h-52 w-full bg-black/25">
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
                <span className="grid h-52 w-full place-items-center bg-black/25 px-3 text-center text-xs text-zinc-500">
                  Image not included
                </span>
              )}
              <span className="block p-4">
                <span className="block text-base font-bold">{option.name}</span>
                {option.description && (
                  <span className="mt-1 block text-sm opacity-70">
                    {option.description}
                  </span>
                )}
              </span>
            </button>
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
            <button
              key={option.name}
              type="button"
              onClick={() => onSelect(option.name)}
              className={`overflow-hidden rounded-2xl border text-left transition ${
                active
                  ? 'border-fuchsia-300/50 bg-white text-zinc-950 shadow-xl shadow-fuchsia-950/20'
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
                <span className="grid aspect-square place-items-center bg-black/25 px-3 text-center text-xs text-zinc-500">
                  Image not included
                </span>
              )}
              <span className="block p-3">
                <span className="block text-sm font-bold">{option.name}</span>
                {option.description && (
                  <span className="mt-1 block text-xs opacity-70">
                    {option.description}
                  </span>
                )}
              </span>
            </button>
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
