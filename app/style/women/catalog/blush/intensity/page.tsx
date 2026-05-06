'use client'

import { WomenSingleOptionPage, toWomenSingleOptions, useStyleSession } from '@/components/style-session'
import { BLUSH_INTENSITIES } from '@/lib/style-session/blush-options'

export default function BlushIntensityPage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Blush Intensity"
      options={toWomenSingleOptions(BLUSH_INTENSITIES)}
      selectedId={session.blushIntensity}
      onSelect={(blushIntensity) => session.setWomenOptions({ blushIntensity })}
    />
  )
}
