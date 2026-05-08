'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useStyleSession } from '@/components/style-session'

export default function StylePage() {
  const router = useRouter()
  const handledRef = useRef(false)
  const { resetSession, setGender } = useStyleSession()

  useEffect(() => {
    if (handledRef.current) {
      return
    }

    handledRef.current = true
    const searchParams = new URLSearchParams(window.location.search)

    if (searchParams.get('fresh') === '1') {
      const genderParam = searchParams.get('gender')

      resetSession()

      if (genderParam === 'men') {
        setGender('men')
        router.replace('/style/men/options')
        return
      }

      if (genderParam === 'women') {
        setGender('women')
        router.replace('/style/info')
        return
      }
    }

    router.replace('/dashboard')
  }, [resetSession, router, setGender])

  return null
}
