'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Alert, Button, Card } from '@/app/components/ui'
import { useStyleSession } from '@/components/style-session'
import {
  MEN_BEARD_CATEGORIES,
  findMenBeardOption,
  getMenBeardOptionsForCategory,
  type MenBeardCategoryId,
} from '@/lib/style-session/men-beard-catalog'
import { findMenHairOption } from '@/lib/style-session/men-hair-catalog'
import { generateStyleFromSession } from '@/lib/style-session/style-session-generation'
import type { StyleSessionMode } from '@/lib/style-session/style-session-types'

const lengthOptions = ['Random', 'Short', 'Medium', 'Long']

export default function MenOptionsPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [message, setMessage] = useState('')
  const [generating, setGenerating] = useState(false)
  const [visibleBeardCategory, setVisibleBeardCategory] =
    useState<MenBeardCategoryId>(
      (session.beardCategory as MenBeardCategoryId | undefined) ||
        MEN_BEARD_CATEGORIES[0].id,
    )
  const activeMode: Extract<StyleSessionMode, 'smart' | 'catalog'> =
    session.mode === 'catalog' ? 'catalog' : 'smart'
  const selectedHairStyle = findMenHairOption(
    session.hairCategory,
    session.hairStyle,
  )
  const selectedBeardStyle = findMenBeardOption(
    session.beardCategory,
    session.beardStyle,
  )

  const selectMode = (mode: Extract<StyleSessionMode, 'smart' | 'catalog'>) => {
    setMessage('')
    session.setMode(mode)

    if (mode === 'catalog' && !session.hairStyle) {
      router.push('/style/men/catalog')
    }
  }

  const continueToResult = async () => {
    session.setMode(activeMode)

    if (activeMode === 'smart') {
      if (!session.hairLength || !session.beardLength) {
        setMessage('Select hair length and beard length before continuing.')
        return
      }
    }

    if (activeMode === 'catalog') {
      if (
        !session.hairCategory ||
        !session.hairStyle ||
        !session.beardCategory ||
        !session.beardStyle
      ) {
        setMessage(
          'Select hair category, hair style, beard category, and beard style before continuing.',
        )
        return
      }
    }

    if (!session.imageFile) {
      setMessage('Upload the client image again before generating.')
      return
    }

    try {
      setMessage('')
      session.setGenerationError(undefined)
      setGenerating(true)

      const result = await generateStyleFromSession({ ...session, mode: activeMode })
      session.setGenerationResult(result)
      router.push('/style/result')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Generation failed.'
      session.setGenerationError(errorMessage)
      setMessage(errorMessage)
      setGenerating(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Men style
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Choose styling options
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Use smart length choices or choose a real catalog hairstyle, then
            finish with beard options.
          </p>
        </div>

        {message && <Alert>{message}</Alert>}

        <div className="grid grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-2">
          <button
            type="button"
            onClick={() => selectMode('smart')}
            className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
              activeMode === 'smart'
                ? 'bg-white text-zinc-950'
                : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            Smart Style
          </button>
          <button
            type="button"
            onClick={() => selectMode('catalog')}
            className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
              activeMode === 'catalog'
                ? 'bg-white text-zinc-950'
                : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            Catalog Style
          </button>
        </div>

        {activeMode === 'smart' ? (
          <Card>
            <div className="space-y-6">
              <OptionGroup
                title="Hair Length"
                options={lengthOptions}
                selected={session.hairLength}
                onSelect={(hairLength) => {
                  setMessage('')
                  session.setMenOptions({ hairLength })
                }}
              />

              <OptionGroup
                title="Beard Length"
                options={lengthOptions}
                selected={session.beardLength}
                onSelect={(beardLength) => {
                  setMessage('')
                  session.setMenOptions({ beardLength })
                }}
              />
            </div>
          </Card>
        ) : (
          <Card>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white">Hair Style</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push('/style/men/catalog')}
                  >
                    {selectedHairStyle ? 'Change' : 'Choose'}
                  </Button>
                </div>

                {selectedHairStyle ? (
                  <button
                    type="button"
                    onClick={() => router.push('/style/men/catalog')}
                    className="mt-4 grid w-full grid-cols-[112px_minmax(0,1fr)] gap-4 rounded-3xl border border-fuchsia-300/40 bg-white/[0.06] p-3 text-left shadow-lg shadow-fuchsia-950/20"
                  >
                    <span className="relative h-28 overflow-hidden rounded-2xl bg-black/25">
                      <Image
                        src={selectedHairStyle.imagePath}
                        alt={selectedHairStyle.name}
                        fill
                        unoptimized
                        loading="lazy"
                        className="object-contain p-2"
                      />
                    </span>
                    <span className="self-center">
                      <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-200">
                        {selectedHairStyle.categoryLabel}
                      </span>
                      <span className="mt-2 block text-lg font-bold text-white">
                        {selectedHairStyle.name}
                      </span>
                      <span className="mt-2 block text-sm text-zinc-400">
                        {selectedHairStyle.description}
                      </span>
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push('/style/men/catalog')}
                    className="mt-4 w-full rounded-3xl border border-dashed border-white/15 bg-white/[0.04] px-5 py-8 text-left transition hover:border-fuchsia-300/40 hover:bg-white/[0.08]"
                  >
                    <span className="block text-base font-bold text-white">
                      Select from men hair catalog
                    </span>
                    <span className="mt-2 block text-sm text-zinc-400">
                      Browse categories like fades, business cuts, curls, braids,
                      and mature hairline styles.
                    </span>
                  </button>
                )}
              </div>

              <BeardCatalogSelector
                visibleCategory={visibleBeardCategory}
                selectedCategory={session.beardCategory}
                selectedStyle={session.beardStyle}
                onChangeCategory={(categoryId) => {
                  setVisibleBeardCategory(categoryId)
                  setMessage('')

                  if (session.beardCategory !== categoryId) {
                    session.setMenOptions({
                      beardCategory: categoryId,
                      beardStyle: undefined,
                    })
                  }
                }}
                onSelectStyle={(beardCategory, beardStyle) => {
                  setMessage('')
                  session.setMenOptions({ beardCategory, beardStyle })
                }}
              />
            </div>
          </Card>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/style/photo')}
          >
            Back
          </Button>
          <Button type="button" onClick={continueToResult} disabled={generating}>
            {generating ? 'Generating...' : 'Continue'}
          </Button>
        </div>
      </div>

      <Card className="h-fit">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Preview
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">Session summary</h3>
          </div>

          {session.imagePreviewUrl ? (
            <div className="relative h-72 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
              <Image
                src={session.imagePreviewUrl}
                alt="Selected client preview"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.035] p-8 text-center text-sm text-zinc-500">
              No image selected
            </div>
          )}

          <div className="space-y-3 text-sm">
            <PreviewRow label="Customer" value={session.customerName} />
            <PreviewRow label="Mode" value={activeMode === 'smart' ? 'Smart Style' : 'Catalog Style'} />
            {activeMode === 'smart' ? (
              <>
                <PreviewRow label="Hair Length" value={session.hairLength} />
                <PreviewRow label="Beard Length" value={session.beardLength} />
              </>
            ) : (
              <>
                {selectedHairStyle && (
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                    <div className="relative h-48 bg-black/25">
                      <Image
                        src={selectedHairStyle.imagePath}
                        alt={selectedHairStyle.name}
                        fill
                        unoptimized
                        loading="lazy"
                        className="object-contain p-3"
                      />
                    </div>
                    <div className="space-y-1 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        {selectedHairStyle.categoryLabel}
                      </p>
                      <p className="text-base font-bold text-white">
                        {selectedHairStyle.name}
                      </p>
                    </div>
                  </div>
                )}
                <PreviewRow
                  label="Hair Category"
                  value={selectedHairStyle?.categoryLabel}
                />
                <PreviewRow label="Hair Style" value={selectedHairStyle?.name} />
                <PreviewRow
                  label="Beard Category"
                  value={selectedBeardStyle?.categoryLabel}
                />
                <PreviewRow
                  label="Beard Style"
                  value={selectedBeardStyle?.name}
                />
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

function BeardCatalogSelector({
  visibleCategory,
  selectedCategory,
  selectedStyle,
  onChangeCategory,
  onSelectStyle,
}: {
  visibleCategory: MenBeardCategoryId
  selectedCategory?: string
  selectedStyle?: string
  onChangeCategory: (categoryId: MenBeardCategoryId) => void
  onSelectStyle: (categoryId: MenBeardCategoryId, styleName: string) => void
}) {
  const options = getMenBeardOptionsForCategory(visibleCategory)

  return (
    <div>
      <h3 className="text-lg font-semibold text-white">Beard Style</h3>
      <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-2">
        {MEN_BEARD_CATEGORIES.map((category) => {
          const active = visibleCategory === category.id

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChangeCategory(category.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${
                active
                  ? 'border-fuchsia-300/50 bg-white text-zinc-950'
                  : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {category.label}
            </button>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {options.map((option) => {
          const active =
            selectedCategory === option.categoryId && selectedStyle === option.name

          return (
            <button
              key={`${option.categoryId}-${option.name}`}
              type="button"
              onClick={() => onSelectStyle(option.categoryId, option.name)}
              className={`min-h-32 rounded-2xl border p-3 text-left transition ${
                active
                  ? 'scale-[1.015] border-fuchsia-300/60 bg-white text-zinc-950 shadow-xl shadow-fuchsia-950/20'
                  : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <span className="block text-sm font-bold">{option.name}</span>
              <span className="mt-2 block text-xs leading-relaxed opacity-70">
                {option.description}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function OptionGroup({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string
  options: string[]
  selected?: string
  onSelect: (value: string) => void
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((option) => {
          const active = selected === option

          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`min-h-16 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                active
                  ? 'border-fuchsia-300/40 bg-white text-zinc-950'
                  : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PreviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="text-zinc-500">{label}</span>
      <span className="text-right font-semibold text-white">{value || 'Not selected'}</span>
    </div>
  )
}
