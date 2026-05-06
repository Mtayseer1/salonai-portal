'use client'

import { WomenSingleOptionPage, toWomenSingleOptions, useStyleSession } from '@/components/style-session'
import { EYE_SHADOWS } from '@/lib/style-session/eyes-options'

export default function EyeShadowPage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Eye Shadow"
      subtitle="Choose one eye shadow look, or keep None."
      options={toWomenSingleOptions(EYE_SHADOWS)}
      selectedId={session.eyeShadow}
      onSelect={(eyeShadow) => session.setWomenOptions({ eyeShadow })}
      imageLayout="large-list"
    />
  )
}
