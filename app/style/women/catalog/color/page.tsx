'use client'

import { useRouter } from 'next/navigation'
import {
  WomenCatalogStep,
  isReturningToReview,
  useWomenCatalog,
  useStyleSession,
} from '@/components/style-session'
import { getWomenCatalogColors } from '@/lib/style-session/women-catalog'

export default function WomenColorCatalogPage() {
  const router = useRouter()
  const session = useStyleSession()
  const catalog = useWomenCatalog()
  const colorOptions = getWomenCatalogColors(
    catalog,
    session.hairStyleId,
    session.haircutId,
  )
  const selectedColorId =
    colorOptions.find(
      (item) =>
        item.hairColorId === session.hairColorId &&
        item.parentHairStyleId === session.hairStyleId &&
        item.parentHaircutId === session.haircutId,
    )?.id ||
    session.hairColorId

  return (
    <WomenCatalogStep
      eyebrow="Women catalog"
      title="Choose hair color"
      description="Select the color for the chosen hairstyle."
      options={colorOptions}
      selected={selectedColorId}
      onSelect={(id) => {
        const option = colorOptions.find((item) => item.id === id)
        session.setWomenOptions({ hairColorId: option?.hairColorId || id })
      }}
      onBack={() => router.push('/style/women/catalog/style')}
      onContinue={() =>
        router.push(
          isReturningToReview()
            ? '/style/women/catalog/review'
            : '/style/women/catalog/lips',
        )
      }
      continueDisabled={!session.hairColorId}
      continueLabel={isReturningToReview() ? 'Done' : 'Continue'}
    />
  )
}
