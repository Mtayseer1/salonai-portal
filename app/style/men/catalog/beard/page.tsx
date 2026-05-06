'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/ui'
import { CatalogStickyActions, useStyleSession } from '@/components/style-session'
import {
  MEN_BEARD_CATEGORIES,
  findMenBeardOption,
  getMenBeardCategory,
  getMenBeardOptionsForCategory,
  type MenBeardCategoryId,
} from '@/lib/style-session/men-beard-catalog'

const PAGE_SIZE = 20

export default function MenBeardCatalogPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<MenBeardCategoryId | null>(
      (getMenBeardCategory(session.beardCategory)?.id as
        | MenBeardCategoryId
        | undefined) || null,
    )
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const selectedCategory = getMenBeardCategory(selectedCategoryId)
  const selectedOption = findMenBeardOption(
    session.beardCategory,
    session.beardStyle,
  )
  const options = useMemo(
    () => getMenBeardOptionsForCategory(selectedCategoryId),
    [selectedCategoryId],
  )
  const visibleOptions = options.slice(0, visibleCount)

  const chooseCategory = (categoryId: MenBeardCategoryId) => {
    setSelectedCategoryId(categoryId)
    setVisibleCount(PAGE_SIZE)

    if (session.beardCategory !== categoryId) {
      session.setMenOptions({
        beardCategory: categoryId,
        beardStyle: undefined,
      })
    }
  }

  const returnToReview = () => {
    router.push('/style/men/catalog/review')
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-[430px] flex-col">
      <div className="flex-1 space-y-6 pb-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Men catalog
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {selectedCategory ? selectedCategory.label : 'Choose beard category'}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {selectedCategory
              ? 'Pick one beard style, then return to review.'
              : 'Choose the grooming family first.'}
          </p>
        </div>

        {!selectedCategory ? (
          <div className="grid grid-cols-2 gap-3">
            {MEN_BEARD_CATEGORIES.map((category) => {
              const count = getMenBeardOptionsForCategory(category.id).length

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => chooseCategory(category.id)}
                  className="min-h-32 rounded-3xl border border-white/10 bg-white/[0.05] p-4 text-left shadow-lg shadow-black/20 transition hover:border-fuchsia-300/40 hover:bg-white/[0.08]"
                >
                  <span className="block text-base font-bold text-white">
                    {category.label}
                  </span>
                  <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    {count} styles
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setSelectedCategoryId(null)
                  setVisibleCount(PAGE_SIZE)
                }}
              >
                Categories
              </Button>
              {selectedOption && (
                <p className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-200">
                  Selected
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {visibleOptions.map((option) => {
                const active =
                  session.beardCategory === option.categoryId &&
                  session.beardStyle === option.name

                return (
                  <button
                    key={`${option.categoryId}-${option.name}`}
                    type="button"
                    onClick={() =>
                      session.setMenOptions({
                        beardCategory: option.categoryId,
                        beardStyle: option.name,
                      })
                    }
                    className={`min-h-36 rounded-2xl border p-3 text-left transition ${
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

            {visibleCount < options.length && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Show More
              </Button>
            )}
          </div>
        )}
      </div>

      <CatalogStickyActions
        onBack={returnToReview}
        onContinue={returnToReview}
        continueDisabled={Boolean(selectedCategory && !selectedOption)}
        continueLabel={selectedCategory ? 'Done' : 'Back'}
      />
    </div>
  )
}
