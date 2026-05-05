'use client'

import { useRouter } from 'next/navigation'
import {
  WomenCatalogStep,
  isReturningToReview,
  useWomenCatalog,
  useStyleSession,
} from '@/components/style-session'

export default function WomenMakeupCatalogPage() {
  const router = useRouter()
  const session = useStyleSession()
  const catalog = useWomenCatalog()

  return (
    <WomenCatalogStep
      eyebrow="Women catalog"
      title="Choose lipstick"
      description="Select a lipstick direction for the catalog look."
      options={catalog.lipsticks}
      selected={session.lipstick}
      onSelect={(lipstick) => session.setWomenOptions({ lipstick })}
      onBack={() => router.push('/style/women/catalog/color')}
      onContinue={() =>
        router.push(
          isReturningToReview()
            ? '/style/women/catalog/review'
            : '/style/women/catalog/lashes',
        )
      }
      continueDisabled={!session.lipstick}
    />
  )
}
