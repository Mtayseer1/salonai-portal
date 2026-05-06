'use client'

import { WomenSingleOptionPage, toWomenSingleOptions, useStyleSession } from '@/components/style-session'
import { HIGHLIGHT_INTENSITIES } from '@/lib/style-session/highlight-options'

export default function HighlightIntensityPage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Highlight Intensity"
      options={toWomenSingleOptions(HIGHLIGHT_INTENSITIES)}
      selectedId={session.highlightIntensity}
      onSelect={(highlightIntensity) =>
        session.setWomenOptions({ highlightIntensity })
      }
    />
  )
}
