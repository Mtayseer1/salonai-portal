'use client'

import { WomenSingleOptionPage, toWomenSingleOptions, useStyleSession } from '@/components/style-session'
import { HIGHLIGHT_PLACEMENTS } from '@/lib/style-session/highlight-options'

export default function HighlightPlacementPage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Highlight Placement"
      options={toWomenSingleOptions(HIGHLIGHT_PLACEMENTS)}
      selectedId={session.highlightPlacement}
      onSelect={(highlightPlacement) =>
        session.setWomenOptions({ highlightPlacement })
      }
    />
  )
}
