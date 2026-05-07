'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Alert, Button } from '@/app/components/ui'
import { useStyleSession } from '@/components/style-session'
import { generateStyleFromSession } from '@/lib/style-session/style-session-generation'

export default function StyleLoadingPage() {
  const router = useRouter()
  const session = useStyleSession()
  const startedRef = useRef(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (startedRef.current) {
      return
    }

    startedRef.current = true

    const regenerate = async () => {
      try {
        session.setGenerationError(undefined)
        const result = await generateStyleFromSession(session)
        session.setGenerationResult(result)
        router.replace('/style/result')
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Generation failed.'
        session.setGenerationError(errorMessage)
        setMessage(errorMessage)
      }
    }

    regenerate()
  }, [router, session])

  if (!message) {
    return <GenerationLoadingScreen />
  }

  return (
    <div className="space-y-4">
      <Alert>{message}</Alert>
      <Button type="button" className="h-14 w-full" onClick={() => router.push('/style/result')}>
        Back to Result
      </Button>
    </div>
  )
}

function GenerationLoadingScreen() {
  const elapsedSeconds = useElapsedSeconds()

  return (
    <main className="flex min-h-[calc(100vh-120px)] items-center justify-center px-2">
      <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-200/80 to-transparent" />
        <div className="relative mx-auto h-40 w-40">
          <div className="absolute inset-0 animate-spin rounded-full border border-fuchsia-200/20 border-t-fuchsia-200" />
          <div className="absolute inset-5 animate-[spin_2.8s_linear_infinite_reverse] rounded-full border border-sky-200/20 border-b-sky-100" />
          <div className="absolute inset-10 rounded-full bg-gradient-to-br from-fuchsia-200 via-white to-sky-100 shadow-2xl shadow-fuchsia-950/40" />
          <div className="absolute inset-14 grid place-items-center rounded-full bg-zinc-950 text-2xl font-black text-white">
            AI
          </div>
          <div className="absolute -right-2 top-10 h-4 w-4 animate-pulse rounded-full bg-fuchsia-200" />
          <div className="absolute bottom-8 left-0 h-3 w-3 animate-bounce rounded-full bg-sky-200" />
        </div>
        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-white">
          Creating the new look
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Mixing the selected salon details into a fresh AI preview.
        </p>
        <p className="mt-2 font-mono text-xs text-zinc-600">
          {formatElapsedTime(elapsedSeconds)}
        </p>
        <div className="mt-7 grid grid-cols-3 gap-2">
          {['Reading photo', 'Styling', 'Rendering'].map((label, index) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3"
            >
              <div
                className="mx-auto h-2 w-2 animate-pulse rounded-full bg-fuchsia-100"
                style={{ animationDelay: `${index * 180}ms` }}
              />
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

function useElapsedSeconds() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return elapsedSeconds
}

function formatElapsedTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
