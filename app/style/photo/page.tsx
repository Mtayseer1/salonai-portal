'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { Alert, Button, Card } from '@/app/components/ui'
import { useStyleSession } from '@/components/style-session'
import type { ChangeEvent, ReactNode } from 'react'

export default function StylePhotoPage() {
  const router = useRouter()
  const { gender, mode, imageFile, imagePreviewUrl, setImage } = useStyleSession()
  const [message, setMessage] = useState('')
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

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

    const flowGender = getPhotoGender() || gender

    if (getPhotoFlow() === 'start') {
      if (flowGender === 'men') {
        router.push('/style/men/options')
        return
      }

      if (flowGender === 'women') {
        router.push('/style/women/options')
        return
      }
    }

    if (gender === 'men') {
      router.push(mode === 'catalog' ? '/style/men/catalog/review' : '/style/men/options')
      return
    }

    if (gender === 'women') {
      if (mode === 'catalog') {
        router.push('/style/women/catalog/review')
        return
      }

      if (mode === 'bridal') {
        router.push('/style/women/bridal/review')
        return
      }

      if (mode === 'smart' && imageFile) {
        router.push('/style/loading')
        return
      }

      router.push('/style/women/options')
      return
    }

    router.push('/style')
  }

  const goBack = () => {
    const photoFlow = getPhotoFlow()
    const flowGender = getPhotoGender() || gender

    if (photoFlow === 'start') {
      router.push('/style/info')
      return
    }

    if (photoFlow === 'mode') {
      router.push(flowGender === 'men' ? '/style/men/options' : '/style/women/options')
      return
    }

    if (!mode) {
      router.push('/style/info')
      return
    }

    if (gender === 'men') {
      router.push(mode === 'catalog' ? '/style/men/catalog/review' : '/style/men/options')
      return
    }

    if (gender === 'women') {
      if (mode === 'catalog') {
        router.push('/style/women/catalog/review')
        return
      }

      if (mode === 'bridal') {
        router.push('/style/women/bridal/review')
        return
      }

      router.push('/style/women/options')
      return
    }

    router.push('/style/info')
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

        <div className="grid gap-3 sm:grid-cols-2">
          <PhotoSourceButton
            title="Camera Capture"
            description="Use the camera to capture a new client photo."
            icon={<CameraIcon />}
            onClick={() => cameraInputRef.current?.click()}
          />
          <PhotoSourceButton
            title="Gallery / Studio"
            description="Choose an existing photo from the gallery or studio files."
            icon={<GalleryIcon />}
            onClick={() => galleryInputRef.current?.click()}
          />
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={selectImage}
          className="hidden"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={selectImage}
          className="hidden"
        />

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
            onClick={goBack}
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

function getPhotoFlow() {
  if (typeof window === 'undefined') {
    return null
  }

  return new URLSearchParams(window.location.search).get('flow')
}

function getPhotoGender() {
  if (typeof window === 'undefined') {
    return null
  }

  const gender = new URLSearchParams(window.location.search).get('gender')

  return gender === 'men' || gender === 'women' ? gender : null
}

function PhotoSourceButton({
  title,
  description,
  icon,
  onClick,
}: {
  title: string
  description: string
  icon: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid min-h-40 place-items-center rounded-3xl border border-white/10 bg-black/20 p-5 text-center transition hover:border-fuchsia-200/30 hover:bg-white/[0.08]"
    >
      <span className="grid h-16 w-16 place-items-center rounded-3xl bg-white text-zinc-950">
        {icon}
      </span>
      <span className="mt-3 text-lg font-semibold text-white">{title}</span>
      <span className="mt-1 text-xs leading-5 text-zinc-500">{description}</span>
    </button>
  )
}

function CameraIcon() {
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
      <path d="M14.5 4l1.2 2H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4.3l1.2-2h5Z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function GalleryIcon() {
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
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="M21 15l-4.5-4.5L7 20" />
      <path d="M14 20l-3.5-3.5" />
    </svg>
  )
}
