'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useStyleSession } from '@/components/style-session'

export default function WomenOptionsPage() {
  const router = useRouter()
  const session = useStyleSession()

  useEffect(() => {
    if (session.gender !== 'women') {
      session.setGender('women')
    }
  }, [session])

  const selectSmart = () => {
    session.setGender('women')
    session.setMode('smart')
    session.setWomenOptions({ hairLength: session.hairLength || 'Random' })
    router.push(session.imageFile ? '/style/loading' : '/style/photo')
  }

  const selectCatalog = () => {
    session.setGender('women')
    session.setMode('catalog')
    router.push('/style/women/catalog/style')
  }

  const selectBridal = () => {
    session.setGender('women')
    session.setMode('bridal')
    router.push(session.imageFile ? '/style/loading' : '/style/photo')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-white">
        WOMEN STYLE
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <ModeCard title="Smart Style" onClick={selectSmart} />
        <ModeCard title="Catalog Style" onClick={selectCatalog} />
        <ModeCard title="Bridal Style" onClick={selectBridal} />
      </div>
    </div>
  )
}

function ModeCard({
  title,
  onClick,
}: {
  title: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid min-h-40 place-items-center rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center transition hover:bg-white/[0.08]"
    >
      <span className="text-xl font-semibold text-white">{title}</span>
    </button>
  )
}
