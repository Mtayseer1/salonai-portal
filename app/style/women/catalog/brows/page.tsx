'use client'

import {
  WomenSingleOptionPage,
  toWomenSingleOptions,
  useStyleSession,
} from '@/components/style-session'
import { BROW_OPTIONS } from '@/lib/style-session/brow-options'

export default function WomenBrowsCatalogPage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Brows"
      subtitle="Choose one brow style, or keep None."
      options={toWomenSingleOptions(BROW_OPTIONS)}
      selectedId={session.browStyle}
      onSelect={(browStyle) => session.setWomenOptions({ browStyle })}
      imageLayout="large-list"
    />
  )
}
