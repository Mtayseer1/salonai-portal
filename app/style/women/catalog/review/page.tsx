'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Alert, Button, Card } from '@/app/components/ui'
import { useStyleSession, useWomenCatalog } from '@/components/style-session'
import { generateStyleFromSession } from '@/lib/style-session/style-session-generation'
import {
  findWomenCatalogColor,
  findWomenCatalogStyle,
} from '@/lib/style-session/women-catalog'

export default function WomenCatalogReviewPage() {
  const router = useRouter()
  const session = useStyleSession()
  const catalog = useWomenCatalog()
  const [message, setMessage] = useState('')
  const [generating, setGenerating] = useState(false)

  const hairstyle = findWomenCatalogStyle(
    catalog,
    session.hairStyleId,
    session.haircutId,
  )
  const color = findWomenCatalogColor(
    catalog,
    session.hairColorId,
    session.hairStyleId,
    session.haircutId,
  )
  const lipstick = findLabel(catalog.lipsticks, session.lipstick)
  const mascara = findLabel(catalog.mascaras, session.mascara)

  const generateCatalogStyle = async () => {
    if (
      !session.hairStyleId ||
      !session.hairColorId ||
      !session.lipstick ||
      !session.mascara
    ) {
      setMessage('Complete all catalog selections before generating.')
      return
    }

    if (!session.imageFile) {
      setMessage('Upload the client image again before generating.')
      return
    }

    try {
      setMessage('')
      setGenerating(true)
      session.setMode('catalog')

      const result = await generateStyleFromSession({
        ...session,
        gender: 'women',
        mode: 'catalog',
      })
      session.setGenerationResult(result)
      router.push('/style/result')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Generation failed.')
      setGenerating(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card className="h-fit">
        <div className="space-y-5">
          <h3 className="text-xl font-semibold text-white">Image</h3>
          {session.imagePreviewUrl ? (
            <div className="relative h-80 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
              <Image
                src={session.imagePreviewUrl}
                alt="Selected client preview"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/style/photo')}
              className="w-full rounded-3xl border border-dashed border-white/10 bg-white/[0.035] p-8 text-center text-sm text-zinc-500"
            >
              No image selected
            </button>
          )}
        </div>
      </Card>

      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Women catalog
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Review selections
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Select any section to edit it, then return here to generate.
          </p>
        </div>

        {message && <Alert>{message}</Alert>}

        <Card>
          <div className="space-y-3">
            <ReviewRow
              label="Hairstyle"
              value={hairstyle?.label}
              imagePath={hairstyle?.imagePath}
              onClick={() => router.push('/style/women/catalog/style?returnTo=review')}
            />
            <ReviewRow
              label="Color"
              value={color?.label}
              imagePath={color?.imagePath}
              onClick={() => router.push('/style/women/catalog/color?returnTo=review')}
            />
            <ReviewRow
              label="Lipstick"
              value={lipstick}
              onClick={() => router.push('/style/women/catalog/makeup?returnTo=review')}
            />
            <ReviewRow
              label="Mascara"
              value={mascara}
              onClick={() => router.push('/style/women/catalog/lashes?returnTo=review')}
            />
            <ReviewRow
              label="Extensions"
              value={session.extensions ? 'On' : 'Off'}
              onClick={() => router.push('/style/women/catalog/lashes?returnTo=review')}
            />
          </div>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/style/women/catalog/lashes')}
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={generateCatalogStyle}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function findLabel(options: Array<{ id: string; label: string }>, id?: string) {
  return options.find((option) => option.id === id)?.label
}

function ReviewRow({
  label,
  value,
  imagePath,
  onClick,
}: {
  label: string
  value?: string
  imagePath?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left transition hover:bg-white/[0.08]"
    >
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="flex items-center gap-3 text-right text-sm font-semibold text-white">
        {imagePath && (
          <span className="relative block h-12 w-12 overflow-hidden rounded-xl bg-black/30">
            <Image
              src={imagePath}
              alt={value || label}
              fill
              unoptimized
              className="object-cover"
            />
          </span>
        )}
        <span>{value || 'Not selected'}</span>
      </span>
    </button>
  )
}
