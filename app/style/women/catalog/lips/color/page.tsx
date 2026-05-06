'use client'

import { WomenSingleOptionPage, toWomenSingleOptions, useStyleSession } from '@/components/style-session'
import { LIP_COLORS } from '@/lib/style-session/lips-catalog'

export default function LipColorPage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Lip Color"
      subtitle="Choose one lip color, or keep None."
      options={toWomenSingleOptions(LIP_COLORS)}
      selectedId={session.lipColor}
      onSelect={(lipColor) =>
        session.setWomenOptions({ lipColor, lipstick: lipColor })
      }
    />
  )
}
