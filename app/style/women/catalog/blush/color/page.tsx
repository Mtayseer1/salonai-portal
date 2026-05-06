'use client'

import { WomenSingleOptionPage, toWomenSingleOptions, useStyleSession } from '@/components/style-session'
import { BLUSH_COLORS } from '@/lib/style-session/blush-options'

export default function BlushColorPage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Blush Color"
      options={toWomenSingleOptions(BLUSH_COLORS)}
      selectedId={session.blushColor}
      onSelect={(blushColor) => session.setWomenOptions({ blushColor })}
    />
  )
}
