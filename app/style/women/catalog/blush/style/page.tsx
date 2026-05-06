'use client'

import { WomenSingleOptionPage, toWomenSingleOptions, useStyleSession } from '@/components/style-session'
import { BLUSH_STYLES } from '@/lib/style-session/blush-options'

export default function BlushStylePage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Blush Style"
      options={toWomenSingleOptions(BLUSH_STYLES)}
      selectedId={session.blushStyle}
      onSelect={(blushStyle) => session.setWomenOptions({ blushStyle })}
    />
  )
}
