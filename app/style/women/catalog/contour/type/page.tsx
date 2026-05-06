'use client'

import { WomenSingleOptionPage, toWomenSingleOptions, useStyleSession } from '@/components/style-session'
import { CONTOUR_TYPES } from '@/lib/style-session/contour-options'

export default function ContourTypePage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Contour Type"
      options={toWomenSingleOptions(CONTOUR_TYPES)}
      selectedId={session.contourType}
      onSelect={(contourType) => session.setWomenOptions({ contourType })}
    />
  )
}
