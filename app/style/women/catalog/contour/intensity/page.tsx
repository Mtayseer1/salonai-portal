'use client'

import { WomenSingleOptionPage, toWomenSingleOptions, useStyleSession } from '@/components/style-session'
import { CONTOUR_INTENSITIES } from '@/lib/style-session/contour-options'

export default function ContourIntensityPage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Contour Intensity"
      options={toWomenSingleOptions(CONTOUR_INTENSITIES)}
      selectedId={session.contourIntensity}
      onSelect={(contourIntensity) =>
        session.setWomenOptions({ contourIntensity })
      }
    />
  )
}
