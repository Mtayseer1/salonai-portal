'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Alert, Brand, Button, Field, LoadingScreen, inputClass } from './components/ui'
import { supabase } from '../src/lib/supabase'

async function getDashboardPath(userId: string) {
  const { data: partner } = await supabase
    .from('partners')
    .select('id')
    .eq('id', userId)
    .maybeSingle()

  if (partner) {
    return '/partner'
  }

  return '/dashboard'
}

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let isActive = true

    const redirectAuthenticatedUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!isActive) {
        return
      }

      if (!user) {
        setCheckingSession(false)
        return
      }

      const dashboardPath = await getDashboardPath(user.id)

      if (isActive) {
        router.replace(dashboardPath)
      }
    }

    redirectAuthenticatedUser()

    return () => {
      isActive = false
    }
  }, [router])

  const handleLogin = async () => {
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    const dashboardPath = await getDashboardPath(data.user.id)
    router.replace(dashboardPath)
  }

  if (checkingSession) {
    return <LoadingScreen label="Checking session..." />
  }

  return (
    <main className="page-bg flex items-center justify-center px-4 py-8">
      <motion.section
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="container-card relative overflow-hidden p-7 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-200/70 to-transparent" />
          <div className="mb-8 flex justify-center">
            <Brand />
          </div>

          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-500">
              Secure access
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Sign in to Salon AI
            </h1>
            <p className="text-soft mt-3">Manage credits, salons, and partner activity.</p>
          </div>

          <div className="space-y-4">
            <Field label="Email address">
              <input
                type="email"
                placeholder="you@salon.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                autoComplete="email"
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                autoComplete="current-password"
              />
            </Field>

            <Button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Signing In...' : 'Login'}
            </Button>
          </div>

          {message && (
            <div className="mt-4">
              <Alert>{message}</Alert>
            </div>
          )}
        </div>
      </motion.section>
    </main>
  )
}
