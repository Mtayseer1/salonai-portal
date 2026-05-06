'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Alert, Button, Card } from '@/app/components/ui'
import { useStyleSession, useWomenCatalog } from '@/components/style-session'
import { generateStyleFromSession } from '@/lib/style-session/style-session-generation'
import {
  LIP_COLORS,
  LIP_FINISHES,
  LIP_STYLES,
  findLipOption,
} from '@/lib/style-session/lips-catalog'
import {
  EYE_LASHES,
  EYE_LINERS,
  EYE_SHADOWS,
  findEyeOption,
} from '@/lib/style-session/eyes-options'
import { findBrowOption } from '@/lib/style-session/brow-options'
import { findSkinOption } from '@/lib/style-session/skin-options'
import {
  BLUSH_COLORS,
  BLUSH_INTENSITIES,
  BLUSH_STYLES,
  findBlushOption,
} from '@/lib/style-session/blush-options'
import {
  BRONZER_TONES,
  CONTOUR_INTENSITIES,
  CONTOUR_TYPES,
  findContourOption,
} from '@/lib/style-session/contour-options'
import {
  HIGHLIGHT_FINISHES,
  HIGHLIGHT_INTENSITIES,
  HIGHLIGHT_PLACEMENTS,
  HIGHLIGHT_TONES,
  findHighlightOption,
} from '@/lib/style-session/highlight-options'
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
  const lipFinish = findLipOption(LIP_FINISHES, session.lipFinish)
  const lipStyle = findLipOption(LIP_STYLES, session.lipStyle)
  const lipColor = findLipOption(LIP_COLORS, session.lipColor)
  const eyeShadow = findEyeOption(EYE_SHADOWS, session.eyeShadow)
  const eyeLiner = findEyeOption(EYE_LINERS, session.eyeLiner)
  const eyeLashes = findEyeOption(EYE_LASHES, session.eyeLashes)
  const brows = findBrowOption(session.browStyle)
  const skin = findSkinOption(session.skinType)
  const blushColor = findBlushOption(BLUSH_COLORS, session.blushColor)
  const blushStyle = findBlushOption(BLUSH_STYLES, session.blushStyle)
  const blushIntensity = findBlushOption(
    BLUSH_INTENSITIES,
    session.blushIntensity,
  )
  const contourType = findContourOption(CONTOUR_TYPES, session.contourType)
  const bronzerTone = findContourOption(BRONZER_TONES, session.bronzerTone)
  const contourIntensity = findContourOption(
    CONTOUR_INTENSITIES,
    session.contourIntensity,
  )
  const highlightPlacement = findHighlightOption(
    HIGHLIGHT_PLACEMENTS,
    session.highlightPlacement,
  )
  const highlightTone = findHighlightOption(
    HIGHLIGHT_TONES,
    session.highlightTone,
  )
  const highlightIntensity = findHighlightOption(
    HIGHLIGHT_INTENSITIES,
    session.highlightIntensity,
  )
  const highlightFinish = findHighlightOption(
    HIGHLIGHT_FINISHES,
    session.highlightFinish,
  )

  const generateCatalogStyle = async () => {
    if (
      !session.hairStyleId ||
      !session.hairColorId ||
      !session.lipFinish ||
      !session.lipStyle ||
      !session.lipColor ||
      !session.eyeShadow ||
      !session.eyeLiner ||
      !session.eyeLashes ||
      !session.browStyle ||
      !session.skinType ||
      !session.blushColor ||
      !session.blushStyle ||
      !session.blushIntensity ||
      !session.contourType ||
      !session.bronzerTone ||
      !session.contourIntensity ||
      !session.highlightPlacement ||
      !session.highlightTone ||
      !session.highlightIntensity ||
      !session.highlightFinish
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
              label="Lip finish"
              value={lipFinish?.name}
              imagePath={lipFinish?.imagePath}
              onClick={() => router.push('/style/women/catalog/lips?returnTo=review')}
            />
            <ReviewRow
              label="Lip style"
              value={lipStyle?.name}
              imagePath={lipStyle?.imagePath}
              onClick={() => router.push('/style/women/catalog/lips?returnTo=review')}
            />
            <ReviewRow
              label="Lip color"
              value={lipColor?.name}
              imagePath={lipColor?.imagePath}
              onClick={() => router.push('/style/women/catalog/lips?returnTo=review')}
            />
            <ReviewRow
              label="Eye shadow"
              value={eyeShadow?.name}
              imagePath={eyeShadow?.imagePath}
              onClick={() => router.push('/style/women/catalog/eyes?returnTo=review')}
            />
            <ReviewRow
              label="Liner"
              value={eyeLiner?.name}
              imagePath={eyeLiner?.imagePath}
              onClick={() => router.push('/style/women/catalog/eyes?returnTo=review')}
            />
            <ReviewRow
              label="Lashes"
              value={eyeLashes?.name}
              imagePath={eyeLashes?.imagePath}
              onClick={() => router.push('/style/women/catalog/eyes?returnTo=review')}
            />
            <ReviewRow
              label="Brows"
              value={brows?.name}
              imagePath={brows?.imagePath}
              onClick={() => router.push('/style/women/catalog/brows?returnTo=review')}
            />
            <ReviewRow
              label="Skin"
              value={skin?.name}
              imagePath={skin?.imagePath}
              onClick={() => router.push('/style/women/catalog/skin?returnTo=review')}
            />
            <ReviewRow
              label="Blush color"
              value={blushColor?.name}
              imagePath={blushColor?.imagePath}
              onClick={() => router.push('/style/women/catalog/blush?returnTo=review')}
            />
            <ReviewRow
              label="Blush style"
              value={blushStyle?.name}
              imagePath={blushStyle?.imagePath}
              onClick={() => router.push('/style/women/catalog/blush?returnTo=review')}
            />
            <ReviewRow
              label="Blush intensity"
              value={blushIntensity?.name}
              imagePath={blushIntensity?.imagePath}
              onClick={() => router.push('/style/women/catalog/blush?returnTo=review')}
            />
            <ReviewRow
              label="Contour type"
              value={contourType?.name}
              imagePath={contourType?.imagePath}
              onClick={() => router.push('/style/women/catalog/contour?returnTo=review')}
            />
            <ReviewRow
              label="Bronzer tone"
              value={bronzerTone?.name}
              imagePath={bronzerTone?.imagePath}
              onClick={() => router.push('/style/women/catalog/contour?returnTo=review')}
            />
            <ReviewRow
              label="Contour intensity"
              value={contourIntensity?.name}
              imagePath={contourIntensity?.imagePath}
              onClick={() => router.push('/style/women/catalog/contour?returnTo=review')}
            />
            <ReviewRow
              label="Highlight placement"
              value={highlightPlacement?.name}
              imagePath={highlightPlacement?.imagePath}
              onClick={() => router.push('/style/women/catalog/highlight?returnTo=review')}
            />
            <ReviewRow
              label="Highlight tone"
              value={highlightTone?.name}
              imagePath={highlightTone?.imagePath}
              onClick={() => router.push('/style/women/catalog/highlight?returnTo=review')}
            />
            <ReviewRow
              label="Highlight intensity"
              value={highlightIntensity?.name}
              imagePath={highlightIntensity?.imagePath}
              onClick={() => router.push('/style/women/catalog/highlight?returnTo=review')}
            />
            <ReviewRow
              label="Highlight finish"
              value={highlightFinish?.name}
              imagePath={highlightFinish?.imagePath}
              onClick={() => router.push('/style/women/catalog/highlight?returnTo=review')}
            />
          </div>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/style/women/catalog/highlight')}
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
