'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Button, Card } from '@/app/components/ui'
import { isReturningToReview, useStyleSession } from '@/components/style-session'
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

      <div className="sticky bottom-0 -mx-4 border-t border-white/10 bg-[#08080b]/90 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-14 w-full"
            onClick={() => router.push('/style/women/catalog/color')}
          >
            Back
          </Button>
          <Button
            type="button"
            className="h-14 w-full"
            onClick={continueToNext}
            disabled={!canContinue}
          >
            Continue
          </Button>
        </div>
      </div>
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
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={`overflow-hidden rounded-2xl border text-left transition ${
                layout === 'scroll' ? 'w-32 shrink-0' : ''
              } ${
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
        })}
      </div>
    </section>
  )
}
