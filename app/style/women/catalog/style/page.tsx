'use client'

import { useRouter } from 'next/navigation'
import {
  WomenCatalogStep,
  isReturningToReview,
  useWomenCatalog,
  useStyleSession,
} from '@/components/style-session'

export default function WomenStyleCatalogPage() {
  const router = useRouter()
  const session = useStyleSession()
  const catalog = useWomenCatalog()
  const selectedStyleId =
    catalog.styles.find(
      (item) =>
        item.hairStyleId === session.hairStyleId &&
        item.haircutId === session.haircutId,
    )?.id ||
    session.hairStyleId

  return (
    <WomenCatalogStep
      eyebrow="Women catalog"
      title="Choose hairstyle"
      description="Select the hairstyle that will anchor the catalog look."
      options={catalog.styles}
      selected={selectedStyleId}
      onSelect={(id) => {
        const option = catalog.styles.find((item) => item.id === id)
        session.setWomenOptions({
          haircutId: option?.haircutId,
          hairStyleId: option?.hairStyleId || id,
          hairColorId: undefined,
        })
      }}
      onBack={() => router.push('/style/women/options')}
      onContinue={() =>
        router.push(
          isReturningToReview()
            ? '/style/women/catalog/review'
            : '/style/women/catalog/color',
        )
      }
      continueDisabled={!session.hairStyleId}
      continueLabel={isReturningToReview() ? 'Done' : 'Continue'}
    />
  )
}
