'use client'

import { WomenSingleOptionPage, toWomenSingleOptions, useStyleSession } from '@/components/style-session'
import { LIP_STYLES } from '@/lib/style-session/lips-catalog'

export default function LipStylePage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Lip Style"
      subtitle="Choose one lip style, or keep None."
      options={toWomenSingleOptions(LIP_STYLES)}
      selectedId={session.lipStyle}
      onSelect={(lipStyle) => session.setWomenOptions({ lipStyle })}
    />
  )
}
