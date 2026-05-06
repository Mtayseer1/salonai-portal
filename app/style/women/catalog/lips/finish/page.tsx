'use client'

import { WomenSingleOptionPage, toWomenSingleOptions, useStyleSession } from '@/components/style-session'
import { LIP_FINISHES } from '@/lib/style-session/lips-catalog'

export default function LipFinishPage() {
  const session = useStyleSession()

  return (
    <WomenSingleOptionPage
      title="Lip Finish"
      subtitle="Choose one lip finish, or keep None."
      options={toWomenSingleOptions(LIP_FINISHES)}
      selectedId={session.lipFinish}
      onSelect={(lipFinish) => session.setWomenOptions({ lipFinish })}
    />
  )
}
