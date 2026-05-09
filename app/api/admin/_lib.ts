import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export type AdminContext = {
  supabaseAdmin: any
  user: {
    id: string
    email?: string
  }
}

export function adminJson(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      'Cache-Control': 'no-store',
      ...(init?.headers ? Object.fromEntries(new Headers(init.headers)) : {}),
    },
  })
}

export async function requireAdmin(request: Request) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    return {
      error: adminJson(
        { error: 'Missing Supabase admin configuration.' },
        { status: 500 },
      ),
    }
  }

  const accessToken = getBearerToken(request)

  if (!accessToken) {
    return {
      error: adminJson({ error: 'Sign in before using admin tools.' }, { status: 401 }),
    }
  }

  const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const {
    data: { user },
    error: userError,
  } = await supabaseAuth.auth.getUser(accessToken)

  if (userError || !user) {
    return {
      error: adminJson({ error: 'Invalid admin session.' }, { status: 401 }),
    }
  }

  const { data: admin } = await supabaseAdmin
    .from('admins')
    .select('id,is_active')
    .eq('id', user.id)
    .maybeSingle()

  if (admin?.is_active !== false && admin?.id) {
    return {
      context: {
        supabaseAdmin,
        user: { id: user.id, email: user.email },
      } satisfies AdminContext,
    }
  }

  if (await canBootstrapAdmin(supabaseAdmin, user.id)) {
    return {
      context: {
        supabaseAdmin,
        user: { id: user.id, email: user.email },
      } satisfies AdminContext,
    }
  }

  return {
    error: adminJson({ error: 'Admin access required.' }, { status: 403 }),
  }
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get('authorization') || ''

  if (!authorization.toLowerCase().startsWith('bearer ')) {
    return null
  }

  return authorization.slice(7).trim()
}

async function canBootstrapAdmin(
  supabaseAdmin: any,
  userId: string,
) {
  const { count } = await supabaseAdmin
    .from('admins')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true)

  if ((count ?? 0) > 0) {
    return false
  }

  const [{ data: partner }, { data: barber }] = await Promise.all([
    supabaseAdmin.from('partners').select('id').eq('id', userId).maybeSingle(),
    supabaseAdmin.from('barbers').select('id').eq('id', userId).maybeSingle(),
  ])

  return !partner && !barber
}

export function requiredString(value: unknown) {
  return String(value ?? '').trim()
}

export function optionalString(value: unknown) {
  const text = String(value ?? '').trim()
  return text || null
}

export function parsePositiveInteger(value: unknown) {
  const number = Number(value)

  if (!Number.isInteger(number) || number <= 0) {
    return null
  }

  return number
}
