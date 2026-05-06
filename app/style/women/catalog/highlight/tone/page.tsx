'use client'

import { WomenSingleOptionPage, toWomenSingleOptions, useStyleSession } from '@/components/style-session'
import { HIGHLIGHT_TONES } from '@/lib/style-session/highlight-options'

export default function HighlightTonePage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Highlight Tone"
      options={toWomenSingleOptions(HIGHLIGHT_TONES)}
      selectedId={session.highlightTone}
      onSelect={(highlightTone) => session.setWomenOptions({ highlightTone })}
    />
  )
}
