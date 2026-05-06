'use client'

import { WomenSingleOptionPage, toWomenSingleOptions, useStyleSession } from '@/components/style-session'
import { EYE_LINERS } from '@/lib/style-session/eyes-options'

export default function EyeLinerPage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Eye Liner"
      subtitle="Choose one liner style, or keep None."
      options={toWomenSingleOptions(EYE_LINERS)}
      selectedId={session.eyeLiner}
      onSelect={(eyeLiner) => session.setWomenOptions({ eyeLiner })}
      imageLayout="large-list"
    />
  )
}
