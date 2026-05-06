'use client'

import { WomenSingleOptionPage, toWomenSingleOptions, useStyleSession } from '@/components/style-session'
import { EYE_LASHES } from '@/lib/style-session/eyes-options'

export default function EyeLashesPage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Eye Lashes"
      subtitle="Choose one lashes style, or keep None."
      options={toWomenSingleOptions(EYE_LASHES)}
      selectedId={session.eyeLashes}
      onSelect={(eyeLashes) =>
        session.setWomenOptions({ eyeLashes, mascara: eyeLashes })
      }
      imageLayout="large-list"
    />
  )
}
