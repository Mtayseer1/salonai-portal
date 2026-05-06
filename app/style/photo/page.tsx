'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Alert, Button, Card } from '@/app/components/ui'
import { useStyleSession } from '@/components/style-session'
import type { ChangeEvent } from 'react'

export default function StylePhotoPage() {
  const router = useRouter()
  const { gender, imageFile, imagePreviewUrl, setImage } = useStyleSession()
  const [message, setMessage] = useState('')

  const selectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setMessage('')
    setImage(file)
  }

  const continueToOptions = () => {
    if (!imageFile && !imagePreviewUrl) {
      setMessage('Upload a client image before continuing.')
      return
    }

    if (gender === 'men') {
      router.push('/style/men/options')
      return
    }

    if (gender === 'women') {
      router.push('/style/women/catalog/review')
      return
    }

    router.push('/style')
  }

  return (
    <Card className="max-w-3xl">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Photo
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Upload the client image
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            The selected image is kept in the style session for the next steps.
          </p>
        </div>

        {message && <Alert>{message}</Alert>}

        <label className="block rounded-3xl border border-dashed border-white/15 bg-black/20 p-5 transition hover:bg-white/[0.04]">
          <span className="block text-sm font-semibold text-white">Image upload</span>
          <span className="mt-1 block text-sm text-zinc-500">
            Choose a clear front-facing photo.
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={selectImage}
            className="mt-4 block w-full text-sm text-zinc-300 file:mr-4 file:rounded-2xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-bold file:text-zinc-950"
          />
        </label>

        {imagePreviewUrl && (
          <div className="relative h-[440px] overflow-hidden rounded-3xl border border-white/10 bg-black/30">
            <Image
              src={imagePreviewUrl}
              alt="Selected client preview"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/style/info')}
          >
            Back
          </Button>
          <Button type="button" onClick={continueToOptions}>
            Continue
          </Button>
        </div>
      </div>
    </Card>
  )
}
