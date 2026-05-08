'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
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
    router.push('/style/women/bridal/review')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-white">
        WOMEN STYLE
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <ModeCard title="Smart Style" icon={<SmartIcon />} onClick={selectSmart} />
        <ModeCard
          title="Catalog Style"
          icon={<CatalogIcon />}
          onClick={selectCatalog}
        />
        <ModeCard title="Bridal Style" icon={<BridalIcon />} onClick={selectBridal} />
      </div>
    </div>
  )
}

function ModeCard({
  title,
  icon,
  onClick,
}: {
  title: string
  icon: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid min-h-40 place-items-center rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center transition hover:bg-white/[0.08]"
    >
      <span className="grid h-16 w-16 place-items-center rounded-3xl bg-white text-zinc-950">
        {icon}
      </span>
      <span className="mt-3 text-xl font-semibold text-white">{title}</span>
    </button>
  )
}

function SmartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-9 w-9"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="M5 17l.9 2.1L8 20l-2.1.9L5 23l-.9-2.1L2 20l2.1-.9L5 17Z" />
      <path d="M19 2l.7 1.6L21 4l-1.3.4L19 6l-.7-1.6L17 4l1.3-.4L19 2Z" />
    </svg>
  )
}

function CatalogIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-9 w-9"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </svg>
  )
}

function BridalIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-9 w-9"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M7 9l5-5 5 5" />
      <path d="M5 10h14l-2 10H7L5 10Z" />
      <path d="M9 10l3 10 3-10" />
      <path d="M8.5 15h7" />
    </svg>
  )
}
