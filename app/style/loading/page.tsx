'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Alert, Button, LoadingScreen } from '@/app/components/ui'
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
    return <LoadingScreen label="Generating your style..." />
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
