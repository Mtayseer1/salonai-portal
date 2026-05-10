'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, EmptyState } from '@/app/components/ui'
import { useStyleSession } from '@/components/style-session'
import { persistMenSessionImages } from '@/lib/style-session/style-session-upload'
import { supabase } from '@/src/lib/supabase'

export default function StyleResultPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [viewerOpen, setViewerOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const persistedMenResultIdsRef = useRef(new Set<string>())
  const resultImageSrc = getResultImageSrc(
    session.generatedImageUrl,
    session.generatedImageBase64,
  )
  const regenerateRoute = getRegenerateRoute(session.gender, session.mode)

  useEffect(() => {
    if (
      !resultImageSrc ||
      !session.generationResultId ||
      session.gender !== 'men' ||
      !session.imageFile
    ) {
      return
    }

    const resultId = session.generationResultId
    const originalImageFile = session.imageFile

    if (persistedMenResultIdsRef.current.has(resultId)) {
      return
    }

    persistedMenResultIdsRef.current.add(resultId)

    let active = true

    const persistMenImages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user || !active) {
        return
      }

      try {
        const generatedImageBlob = await imageSourceToBlob(resultImageSrc)
        await persistMenSessionImages({
          userId: user.id,
          styleType: session.mode || 'unknown',
          originalImageFile,
          generatedImageBlob,
        })
      } catch {
        // Men image persistence is best-effort and should not block result UX.
      }
    }

    persistMenImages()

    return () => {
      active = false
    }
  }, [resultImageSrc, session])

  const downloadResult = async () => {
    if (!resultImageSrc) {
      return
    }

    try {
      setSaving(true)
      setMessage('')
      const blob = await imageSourceToBlob(resultImageSrc)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `salon-ai-result-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      setMessage('Image downloaded.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not download image.')
    } finally {
      setSaving(false)
    }
  }

  const shareResult = async () => {
    if (!resultImageSrc) {
      return
    }

    try {
      setMessage('')
      const blob = await imageSourceToBlob(resultImageSrc)
      const file = new File([blob], `salon-ai-result-${Date.now()}.png`, {
        type: blob.type || 'image/png',
      })

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'Salon AI Result',
          files: [file],
        })
        return
      }

      if (session.generatedImageUrl && navigator.clipboard) {
        await navigator.clipboard.writeText(session.generatedImageUrl)
        setMessage('Image link copied.')
        return
      }

      await downloadResult()
    } catch {
      await downloadResult()
    }
  }

  return (
    <div className="space-y-5 overflow-hidden">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Result
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Generated style
        </h2>
      </div>

      {message && <Alert tone="info">{message}</Alert>}
      {session.generationError && <Alert>{session.generationError}</Alert>}

      {resultImageSrc ? (
        <Card className="p-3">
          <button
            type="button"
            onClick={() => setViewerOpen(true)}
            className="relative h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/30"
            aria-label="Open image fullscreen"
          >
            <Image
              src={resultImageSrc}
              alt="Generated style result"
              fill
              unoptimized
              priority
              className="object-contain"
            />
          </button>
        </Card>
      ) : (
        <EmptyState
          title="No generated result yet."
          description="Complete the style flow to generate an image."
        />
      )}

      <div className="space-y-3 pb-4">
        <Button
          type="button"
          className="h-14 w-full text-base"
          onClick={downloadResult}
          disabled={!resultImageSrc || saving}
        >
          {saving ? 'Saving...' : 'Save Image'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="h-14 w-full text-base"
          onClick={shareResult}
          disabled={!resultImageSrc}
        >
          Share
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="h-14 w-full text-base"
          onClick={() => router.push(regenerateRoute)}
          disabled={!session.imageFile}
        >
          Regenerate
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="h-14 w-full text-base"
          onClick={() => router.push('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>

      {viewerOpen && resultImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          <button
            type="button"
            onClick={() => setViewerOpen(false)}
            className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white text-2xl font-semibold text-zinc-950"
            aria-label="Close fullscreen image"
          >
            ×
          </button>
          <div className="relative h-full max-h-[92vh] w-full max-w-[430px] animate-[imageZoom_160ms_ease-out]">
            <Image
              src={resultImageSrc}
              alt="Generated style result fullscreen"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function getResultImageSrc(imageUrl?: string, imageBase64?: string) {
  if (imageUrl) {
    return imageUrl
  }

  if (imageBase64?.startsWith('data:image/')) {
    return imageBase64
  }

  if (imageBase64) {
    return `data:image/png;base64,${imageBase64}`
  }

  return null
}

function getRegenerateRoute(
  gender: ReturnType<typeof useStyleSession>['gender'],
  mode: ReturnType<typeof useStyleSession>['mode'],
) {
  if (gender === 'women') {
    if (mode === 'bridal') {
      return '/style/women/bridal/review'
    }

    if (mode === 'catalog') {
      return '/style/women/catalog/review'
    }

    if (mode === 'signature') {
      return '/style/women/signature'
    }

    return '/style/women/options'
  }

  if (gender === 'men') {
    return mode === 'catalog' ? '/style/men/catalog/review' : '/style/men/options'
  }

  return '/style'
}

async function imageSourceToBlob(src: string) {
  if (src.startsWith('data:image/')) {
    const response = await fetch(src)
    return response.blob()
  }

  const response = await fetch(src, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error('Could not load image.')
  }

  return response.blob()
}
