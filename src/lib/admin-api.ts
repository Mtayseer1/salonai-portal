import { supabase } from './supabase'

export async function adminFetch<T>(path: string, init: RequestInit = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    throw new Error('Sign in before using admin tools.')
  }

  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${session.access_token}`)

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(path, {
    ...init,
    headers,
    cache: 'no-store',
  })

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.error || 'Admin request failed.')
  }

  return result as T
}
