'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Alert, Button, Card } from '@/app/components/ui'
import { useStyleSession, useWomenCatalog } from '@/components/style-session'
import { findLipOption, LIP_COLORS, LIP_FINISHES, LIP_STYLES } from '@/lib/style-session/lips-catalog'
import { EYE_LASHES, EYE_LINERS, EYE_SHADOWS, findEyeOption } from '@/lib/style-session/eyes-options'
import { findBrowOption } from '@/lib/style-session/brow-options'
import { findSkinOption } from '@/lib/style-session/skin-options'
import { BLUSH_COLORS, BLUSH_INTENSITIES, BLUSH_STYLES, findBlushOption } from '@/lib/style-session/blush-options'
import { BRONZER_TONES, CONTOUR_INTENSITIES, CONTOUR_TYPES, findContourOption } from '@/lib/style-session/contour-options'
import { HIGHLIGHT_FINISHES, HIGHLIGHT_INTENSITIES, HIGHLIGHT_PLACEMENTS, HIGHLIGHT_TONES, findHighlightOption } from '@/lib/style-session/highlight-options'
import { findWomenCatalogColor, findWomenCatalogStyle } from '@/lib/style-session/women-catalog'

export default function WomenCatalogReviewPage() {
  const router = useRouter()
  const session = useStyleSession()
  const catalog = useWomenCatalog()

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
  const rows = [
    {
      label: 'Hair Style',
      value: hairstyle?.label,
      imagePath: hairstyle?.imagePath,
      href: '/style/women/catalog/style?returnTo=review',
    },
    {
      label: 'Hair Color',
      value: color?.label,
      imagePath: color?.imagePath,
      href: '/style/women/catalog/color?returnTo=review',
    },
    optionRow('Lip Finish', findLipOption(LIP_FINISHES, session.lipFinish), '/style/women/catalog/lips/finish'),
    optionRow('Lip Style', findLipOption(LIP_STYLES, session.lipStyle), '/style/women/catalog/lips/style'),
    optionRow('Lip Color', findLipOption(LIP_COLORS, session.lipColor), '/style/women/catalog/lips/color'),
    optionRow('Eye Shadow', findEyeOption(EYE_SHADOWS, session.eyeShadow), '/style/women/catalog/eyes/shadow'),
    optionRow('Eye Liner', findEyeOption(EYE_LINERS, session.eyeLiner), '/style/women/catalog/eyes/liner'),
    optionRow('Eye Lashes', findEyeOption(EYE_LASHES, session.eyeLashes), '/style/women/catalog/eyes/lashes'),
    optionRow('Brows', findBrowOption(session.browStyle), '/style/women/catalog/brows'),
    optionRow('Skin Base', findSkinOption(session.skinType), '/style/women/catalog/skin'),
    optionRow('Blush Color', findBlushOption(BLUSH_COLORS, session.blushColor), '/style/women/catalog/blush/color'),
    optionRow('Blush Style', findBlushOption(BLUSH_STYLES, session.blushStyle), '/style/women/catalog/blush/style'),
    optionRow('Blush Intensity', findBlushOption(BLUSH_INTENSITIES, session.blushIntensity), '/style/women/catalog/blush/intensity'),
    optionRow('Contour Type', findContourOption(CONTOUR_TYPES, session.contourType), '/style/women/catalog/contour/type'),
    optionRow('Bronzer Tone', findContourOption(BRONZER_TONES, session.bronzerTone), '/style/women/catalog/contour/tone'),
    optionRow('Contour Intensity', findContourOption(CONTOUR_INTENSITIES, session.contourIntensity), '/style/women/catalog/contour/intensity'),
    optionRow('Highlight Placement', findHighlightOption(HIGHLIGHT_PLACEMENTS, session.highlightPlacement), '/style/women/catalog/highlight/placement'),
    optionRow('Highlight Tone', findHighlightOption(HIGHLIGHT_TONES, session.highlightTone), '/style/women/catalog/highlight/tone'),
    optionRow('Highlight Intensity', findHighlightOption(HIGHLIGHT_INTENSITIES, session.highlightIntensity), '/style/women/catalog/highlight/intensity'),
    optionRow('Highlight Finish', findHighlightOption(HIGHLIGHT_FINISHES, session.highlightFinish), '/style/women/catalog/highlight/finish'),
  ]

  const generateCatalogStyle = () => {
    if (!session.imageFile) {
      session.setGenerationError('Upload the client image again before generating.')
      return
    }

    session.setGenerationError(undefined)
    session.setMode('catalog')
    router.push('/style/loading')
  }

  return (
    <div className="space-y-6 pb-28">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Review
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Choose the look
              </h2>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="px-4 py-2"
              onClick={() => router.push('/style/photo')}
            >
              Photo
            </Button>
          </div>

          {session.imagePreviewUrl ? (
            <div className="relative h-80 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
              <Image
                src={session.imagePreviewUrl}
                alt="Selected client preview"
                fill
                unoptimized
                priority
                className="object-contain"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/style/photo')}
              className="w-full rounded-3xl border border-dashed border-white/10 bg-white/[0.035] p-8 text-center text-sm text-zinc-500"
            >
              Upload a photo to start
            </button>
          )}
        </div>
      </Card>

      {session.generationError && <Alert>{session.generationError}</Alert>}

      <Card className="p-4">
        <div className="space-y-3">
          {rows.map((row) => (
            <ReviewRow key={row.label} {...row} onClick={() => router.push(row.href)} />
          ))}
        </div>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#08080b]/95 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-[0.8fr_1.2fr] gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-14 w-full"
            onClick={() => router.push('/style/photo')}
          >
            Back
          </Button>
          <Button
            type="button"
            className="h-14 w-full"
            onClick={generateCatalogStyle}
            disabled={!session.imageFile}
          >
            Generate
          </Button>
        </div>
      </div>
    </div>
  )
}

function optionRow(
  label: string,
  option: { name?: string; label?: string; imagePath?: string } | undefined,
  href: string,
) {
  return {
    label,
    value: option?.label || option?.name,
    imagePath: option?.imagePath,
    href,
  }
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
  href: string
  onClick: () => void
}) {
  const isNone = value === 'None'

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-20 w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:bg-white/[0.08]"
    >
      <span>
        <span className="block text-sm font-semibold text-white">{label}</span>
        <span className="mt-1 block text-xs text-zinc-500">
          {value || 'Choose option'}
        </span>
      </span>
      <span className="flex items-center gap-3">
        {imagePath ? (
          <span className="relative block h-14 w-14 overflow-hidden rounded-xl bg-black/30 p-1">
            <Image
              src={imagePath}
              alt={value || label}
              fill
              unoptimized
              className="object-contain p-1"
            />
          </span>
        ) : (
          <span className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
            {isNone ? 'None' : 'Edit'}
          </span>
        )}
        <span className="text-xl text-zinc-500">&gt;</span>
      </span>
    </button>
  )
}
