'use client'

import {
  WomenSingleOptionPage,
  toWomenSingleOptions,
  useStyleSession,
} from '@/components/style-session'
import { SKIN_OPTIONS } from '@/lib/style-session/skin-options'

export default function WomenSkinCatalogPage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Skin Base"
      subtitle="Choose one face base or foundation finish, or keep None."
      options={toWomenSingleOptions(SKIN_OPTIONS)}
      selectedId={session.skinType}
      onSelect={(skinType) => session.setWomenOptions({ skinType })}
    />
  )
}
