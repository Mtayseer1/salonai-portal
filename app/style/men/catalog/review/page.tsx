'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Alert, Button, Card } from '@/app/components/ui'
import { useStyleSession } from '@/components/style-session'
import { findMenBeardOption } from '@/lib/style-session/men-beard-catalog'
import { findMenHairOption } from '@/lib/style-session/men-hair-catalog'

export default function MenCatalogReviewPage() {
  const router = useRouter()
  const session = useStyleSession()
  const hair = findMenHairOption(session.hairCategory, session.hairStyle)
  const beard = findMenBeardOption(session.beardCategory, session.beardStyle)

  const generateCatalogStyle = () => {
    if (!session.imageFile) {
      session.setGenerationError('Upload the client image again before generating.')
      return
    }

    if (!hair || !beard) {
      session.setGenerationError('Choose hair and beard before generating.')
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
          <ReviewRow
            label="Hair"
            value={hair?.name}
            category={hair?.categoryLabel}
            imagePath={hair?.imagePath}
            onClick={() => router.push('/style/men/catalog')}
          />
          <ReviewRow
            label="Beard"
            value={beard?.name}
            category={beard?.categoryLabel}
            onClick={() => router.push('/style/men/catalog/beard')}
          />
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
            disabled={!session.imageFile || !hair || !beard}
          >
            Generate
          </Button>
        </div>
      </div>
    </div>
  )
}

function ReviewRow({
  label,
  value,
  category,
  imagePath,
  onClick,
}: {
  label: string
  value?: string
  category?: string
  imagePath?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-20 w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:bg-white/[0.08]"
    >
      <span>
        <span className="block text-sm font-semibold text-white">{label}</span>
        <span className="mt-1 block text-xs text-zinc-500">
          {value ? `${category ? `${category} - ` : ''}${value}` : 'Choose option'}
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
            Edit
          </span>
        )}
        <span className="text-xl text-zinc-500">&gt;</span>
      </span>
    </button>
  )
}
