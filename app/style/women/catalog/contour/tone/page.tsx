'use client'

import { WomenSingleOptionPage, toWomenSingleOptions, useStyleSession } from '@/components/style-session'
import { BRONZER_TONES } from '@/lib/style-session/contour-options'

export default function BronzerTonePage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Bronzer Tone"
      options={toWomenSingleOptions(BRONZER_TONES)}
      selectedId={session.bronzerTone}
      onSelect={(bronzerTone) => session.setWomenOptions({ bronzerTone })}
    />
  )
}
