'use client'

import { WomenSingleOptionPage, toWomenSingleOptions, useStyleSession } from '@/components/style-session'
import { HIGHLIGHT_FINISHES } from '@/lib/style-session/highlight-options'

export default function HighlightFinishPage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Highlight Finish"
      options={toWomenSingleOptions(HIGHLIGHT_FINISHES)}
      selectedId={session.highlightFinish}
      onSelect={(highlightFinish) =>
        session.setWomenOptions({ highlightFinish })
      }
    />
  )
}
