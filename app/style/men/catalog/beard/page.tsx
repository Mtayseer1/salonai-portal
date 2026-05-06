'use client'

import { useRouter } from 'next/navigation'
import {
  CatalogOptionCard,
  CatalogStickyActions,
  useStyleSession,
} from '@/components/style-session'
import {
  MEN_BEARD_CATEGORIES,
  findMenBeardOption,
  getMenBeardOptionsForCategory,
} from '@/lib/style-session/men-beard-catalog'

export default function MenBeardCatalogPage() {
  const router = useRouter()
  const session = useStyleSession()
  const selectedOption = findMenBeardOption(
    session.beardCategory,
    session.beardStyle,
  )

  const returnToReview = () => {
    router.push('/style/men/catalog/review')
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-[430px] flex-col">
      <div className="flex-1 space-y-8 pb-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Men catalog
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Choose beard
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Select one beard style, then return to review.
          </p>
        </div>

        {MEN_BEARD_CATEGORIES.map((category) => {
          const options = getMenBeardOptionsForCategory(category.id)

          return (
            <section key={category.id} className="space-y-3 scroll-mt-6">
              <div className="flex items-end justify-between gap-3">
                <h3 className="text-xl font-semibold text-white">{category.label}</h3>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  {options.length}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {options.map((option) => (
                  <CatalogOptionCard
                    key={`${option.categoryId}-${option.name}`}
                    label={option.name}
                    imagePath={option.imagePath}
                    selected={
                      session.beardCategory === option.categoryId &&
                      session.beardStyle === option.name
                    }
                    onClick={() =>
                      session.setMenOptions({
                        beardCategory: option.categoryId,
                        beardStyle: option.name,
                      })
                    }
                    imageClassName="aspect-[1.15]"
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <CatalogStickyActions
        onBack={returnToReview}
        onContinue={returnToReview}
        continueDisabled={!selectedOption}
        continueLabel="Done"
      />
    </div>
  )
}
