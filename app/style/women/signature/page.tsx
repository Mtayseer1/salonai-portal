'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card } from '@/app/components/ui'
import { CatalogOptionCard, useStyleSession } from '@/components/style-session'
import {
  findWomenSignatureLook,
  loadWomenSignatureLooks,
  type WomenSignatureLook,
} from '@/lib/style-session/women-signature-looks'

export default function WomenSignatureLooksPage() {
  const router = useRouter()
  const session = useStyleSession()
  const [looks, setLooks] = useState<WomenSignatureLook[]>([])
  const [visibleCount, setVisibleCount] = useState(12)
  const [message, setMessage] = useState('')
  const selectedLook = findWomenSignatureLook(looks, session.signatureLookId)
  const visibleLooks = useMemo(
    () => looks.slice(0, visibleCount),
    [looks, visibleCount],
  )

  useEffect(() => {
    let active = true

    loadWomenSignatureLooks().then((loadedLooks) => {
      if (active) {
        setLooks(loadedLooks)
      }
    })

    return () => {
      active = false
    }
  }, [])

  const selectLook = (look: WomenSignatureLook) => {
    setMessage('')
    session.setGender('women')
    session.setMode('signature')
    session.setWomenOptions({
      signatureLookId: look.id,
      signatureLookName: look.name,
      signatureLookPrompt: look.prompt,
      signatureLookImagePath: look.imagePath,
    })
  }

  const generateSignatureLook = () => {
    if (!session.imageFile) {
      setMessage('Upload the client image before generating.')
      return
    }

    if (!selectedLook) {
      setMessage('Choose a signature look before generating.')
      return
    }

    session.setGenerationError(undefined)
    session.setGender('women')
    session.setMode('signature')
    session.setWomenOptions({
      signatureLookId: selectedLook.id,
      signatureLookName: selectedLook.name,
      signatureLookPrompt: selectedLook.prompt,
      signatureLookImagePath: selectedLook.imagePath,
    })
    router.push('/style/loading')
  }

  return (
    <div className="space-y-6 pb-28">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Signature Looks
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Choose a complete look
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
            <div className="relative h-72 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
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
              onClick={() => router.push('/style/photo?flow=mode')}
              className="w-full rounded-3xl border border-dashed border-white/10 bg-white/[0.035] p-8 text-center text-sm text-zinc-500"
            >
              Upload a photo to start
            </button>
          )}
        </div>
      </Card>

      {message && <Alert>{message}</Alert>}
      {session.generationError && <Alert>{session.generationError}</Alert>}

      <Card>
        {visibleLooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {visibleLooks.map((look) => (
              <CatalogOptionCard
                key={look.id}
                label={look.name}
                imagePath={look.imagePath}
                selected={session.signatureLookId === look.id}
                onClick={() => selectLook(look)}
                imageClassName="aspect-[0.8]"
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.035] p-5 text-sm text-zinc-500">
            No signature looks available.
          </div>
        )}

        {looks.length > visibleCount && (
          <Button
            type="button"
            variant="secondary"
            className="mt-5 h-12 w-full"
            onClick={() => setVisibleCount((count) => count + 12)}
          >
            Show More
          </Button>
        )}
      </Card>

      {selectedLook && (
        <Card className="p-4">
          <p className="text-sm font-semibold text-white">{selectedLook.name}</p>
          <p className="mt-2 whitespace-pre-line text-xs leading-5 text-zinc-500">
            {selectedLook.prompt}
          </p>
        </Card>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#08080b]/95 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[430px] grid-cols-[0.8fr_1.2fr] gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-14 w-full"
            onClick={() => router.push('/style/women/options')}
          >
            Back
          </Button>
          <Button
            type="button"
            className="h-14 w-full"
            onClick={generateSignatureLook}
            disabled={!session.imageFile || !selectedLook}
          >
            Generate
          </Button>
        </div>
      </div>
    </div>
  )
}
