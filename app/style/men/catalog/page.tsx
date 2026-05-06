'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/ui'
import {
  CatalogOptionCard,
  CatalogStickyActions,
  useStyleSession,
} from '@/components/style-session'
import {
  MEN_HAIR_CATEGORIES,
  findMenHairOption,
  getMenHairCategory,
  getMenHairOptionsForCategory,
  type MenHairCategoryId,
} from '@/lib/style-session/men-hair-catalog'

const PAGE_SIZE = 20

export default function MenCatalogPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<MenHairCategoryId | null>(
      (getMenHairCategory(session.hairCategory)?.id as MenHairCategoryId | undefined) ||
        null,
    )
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const selectedCategory = getMenHairCategory(selectedCategoryId)
  const selectedOption = findMenHairOption(session.hairCategory, session.hairStyle)
  const options = useMemo(
    () => getMenHairOptionsForCategory(selectedCategoryId),
    [selectedCategoryId],
  )
  const visibleOptions = options.slice(0, visibleCount)

  const chooseCategory = (categoryId: MenHairCategoryId) => {
    setSelectedCategoryId(categoryId)
    setVisibleCount(PAGE_SIZE)

    if (session.hairCategory !== categoryId) {
      session.setMenOptions({
        hairCategory: categoryId,
        hairStyle: undefined,
      })
    }
  }

  const returnToOptions = () => {
    router.push('/style/men/options')
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-[430px] flex-col">
      <div className="flex-1 space-y-6 pb-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Men catalog
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {selectedCategory ? selectedCategory.label : 'Choose hair category'}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {selectedCategory
              ? 'Pick one style, then return to choose beard options.'
              : 'Start with the category that best matches the client.'}
          </p>
        </div>

        {!selectedCategory ? (
          <div className="grid grid-cols-2 gap-3">
            {MEN_HAIR_CATEGORIES.map((category) => {
              const count = getMenHairOptionsForCategory(category.id).length

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
              {visibleOptions.map((option) => (
                <CatalogOptionCard
                  key={`${option.categoryId}-${option.name}`}
                  label={option.name}
                  description={option.description}
                  imagePath={option.imagePath}
                  selected={
                    session.hairCategory === option.categoryId &&
                    session.hairStyle === option.name
                  }
                  onClick={() =>
                    session.setMenOptions({
                      hairCategory: option.categoryId,
                      hairStyle: option.name,
                    })
                  }
                />
              ))}
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
        onBack={returnToOptions}
        onContinue={returnToOptions}
        continueDisabled={Boolean(selectedCategory && !selectedOption)}
        continueLabel={selectedCategory ? 'Done' : 'Back'}
      />
    </div>
  )
}
