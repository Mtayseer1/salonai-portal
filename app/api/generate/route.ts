import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

type GenerateRequestBody = {
  gender?: string
  mode?: string
  generationProvider?: 'gemini' | 'openai'
  imageUrl?: string
  hairLength?: string
  beardLength?: string
  hairStyle?: string
  beardStyle?: string
  hairStyleImagePath?: string
  beardStyleImagePath?: string
  haircutId?: string
  hairStyleId?: string
  hairColorId?: string
  makeup?: boolean
  dye?: boolean
  lipstick?: string
  lipFinish?: string
  lipFinishDescription?: string
  lipStyle?: string
  lipStyleDescription?: string
  lipColor?: string
  lipColorDescription?: string
  lipsPrompt?: string
  eyeShadow?: string
  eyeLiner?: string
  eyeLashes?: string
  browStyle?: string
  skinType?: string
  blushColor?: string
  blushStyle?: string
  blushIntensity?: string
  contourType?: string
  bronzerTone?: string
  contourIntensity?: string
  highlightPlacement?: string
  highlightTone?: string
  highlightIntensity?: string
  highlightFinish?: string
  mascara?: string
  extensions?: boolean
  customerName?: string
  customerPhone?: string
}

type GenerationLogMetadata = {
  requestId: string
  userId: string
  origin: string
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const CREDIT_COST = 1
const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
}

type AdminSupabaseClient = ReturnType<typeof createServiceClient>
type AuthenticatedUser = Awaited<
  ReturnType<ReturnType<typeof createClient>['auth']['getUser']>
>['data']['user']

function noStoreJson(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      ...NO_STORE_HEADERS,
      ...(init?.headers ? Object.fromEntries(new Headers(init.headers)) : {}),
    },
  })
}

export async function POST(request: Request) {
  const requestId = createRequestId()

  try {
    const body = (await request.json()) as GenerateRequestBody

    if (!SUPABASE_URL) {
      return noStoreJson(
        {
          error: 'Missing Supabase URL configuration.',
          debug: createDebug(requestId, 'config', {
            missing: 'NEXT_PUBLIC_SUPABASE_URL',
          }),
        },
        { status: 500 },
      )
    }

    if (!SUPABASE_ANON_KEY) {
      return noStoreJson(
        {
          error: 'Missing Supabase anon key configuration.',
          debug: createDebug(requestId, 'config', {
            missing: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
          }),
        },
        { status: 500 },
      )
    }

    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return noStoreJson(
        {
          error: 'Missing Supabase service configuration.',
          debug: createDebug(requestId, 'config', {
            missing: 'SUPABASE_SERVICE_ROLE_KEY',
          }),
        },
        { status: 500 },
      )
    }

    const accessToken = getBearerToken(request)

    if (!accessToken) {
      return noStoreJson(
        {
          error: 'Sign in before generating.',
          code: 'unauthenticated',
          debug: createDebug(requestId, 'auth', { reason: 'missing_bearer_token' }),
        },
        { status: 401 },
      )
    }

    const supabaseAdmin = createServiceClient()
    const authResult = await getAuthenticatedUser(accessToken)
    const user = authResult.user

    if (!user) {
      logGenerationFailure(requestId, 'auth', authResult.attempts)

      return noStoreJson(
        {
          error: 'Sign in before generating.',
          code: 'unauthenticated',
          debug: createDebug(requestId, 'auth', {
            authAttempts: authResult.attempts,
            hasToken: Boolean(accessToken),
            tokenPrefix: accessToken.slice(0, 12),
            clientUserId: request.headers.get('x-salon-user-id'),
          }),
        },
        { status: 401 },
      )
    }

    if (body.gender !== 'men' && body.gender !== 'women') {
      return noStoreJson(
        {
          error: 'Invalid generation gender.',
          debug: createDebug(requestId, 'validation', { gender: body.gender }),
        },
        { status: 400 },
      )
    }

    if (
      body.mode !== 'smart' &&
      body.mode !== 'catalog' &&
      body.mode !== 'bridal'
    ) {
      return noStoreJson(
        {
          error: 'Invalid generation mode.',
          debug: createDebug(requestId, 'validation', { mode: body.mode }),
        },
        { status: 400 },
      )
    }

    if (!body.imageUrl) {
      return noStoreJson(
        {
          error: 'Missing source image URL.',
          debug: createDebug(requestId, 'validation', {
            hasImageUrl: Boolean(body.imageUrl),
          }),
        },
        { status: 400 },
      )
    }

    const barber = await getBarberAccount(supabaseAdmin, user.id)

    if (!barber) {
      logGenerationFailure(requestId, 'account', {
        userId: user.id,
        reason: 'missing_or_inactive_barber',
      })

      return noStoreJson(
        {
          error: 'Salon account not found.',
          code: 'missing_account',
          debug: createDebug(requestId, 'account', {
            userId: user.id,
            reason: 'missing_or_inactive_barber',
          }),
        },
        { status: 403 },
      )
    }

    if ((barber.remaining_credits || 0) < CREDIT_COST) {
      logGenerationFailure(requestId, 'credits', {
        userId: user.id,
        remainingCredits: barber.remaining_credits || 0,
      })

      return noStoreJson(
        {
          error: 'Insufficient credits. Buy credits before generating.',
          code: 'insufficient_credits',
          debug: createDebug(requestId, 'credits', {
            userId: user.id,
            remainingCredits: barber.remaining_credits || 0,
            requiredCredits: CREDIT_COST,
          }),
        },
        { status: 402 },
      )
    }

    const reserved = await reserveGenerationCredit(
      supabaseAdmin,
      user.id,
      barber.remaining_credits,
    )

    if (!reserved) {
      logGenerationFailure(requestId, 'credit_reservation', {
        userId: user.id,
        expectedCredits: barber.remaining_credits,
      })

      return noStoreJson(
        {
          error: 'Insufficient credits. Buy credits before generating.',
          code: 'insufficient_credits',
          debug: createDebug(requestId, 'credit_reservation', {
            userId: user.id,
            expectedCredits: barber.remaining_credits,
            requiredCredits: CREDIT_COST,
          }),
        },
        { status: 402 },
      )
    }

    const payload = createGenerationPayload(body, {
      requestId,
      userId: user.id,
      origin: getRequestOrigin(request),
    })

    let response: Response

    try {
      response = await fetch(`${SUPABASE_URL}/functions/v1/${getGenerationFunctionName(body)}`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    } catch (error) {
      await refundGenerationCredit(supabaseAdmin, user.id)
      logGenerationFailure(requestId, 'edge_fetch', error)

      return noStoreJson(
        {
          error: 'Generation failed. No credit was used.',
          code: 'generation_failed',
          debug: createDebug(requestId, 'edge_fetch', serializeLogDetails(error)),
        },
        { status: 502 },
      )
    }

    const result = await parseEdgeResponse(response)

    if (!response.ok) {
      await refundGenerationCredit(supabaseAdmin, user.id)
      logGenerationFailure(requestId, 'edge_response', {
        status: response.status,
        result,
      })

      return noStoreJson(
        {
          error: 'Generation failed. No credit was used.',
          code: 'generation_failed',
          details: result,
          debug: createDebug(requestId, 'edge_response', {
            status: response.status,
            result,
          }),
        },
        { status: response.status },
      )
    }

    const logResults = await Promise.allSettled([
      logSuccessfulGeneration(supabaseAdmin, user.id, body),
      logCreditUsage(supabaseAdmin, user.id, body),
    ])

    for (const [index, logResult] of logResults.entries()) {
      if (logResult.status === 'rejected') {
        logGenerationFailure(
          requestId,
          index === 0 ? 'session_log' : 'credit_log',
          logResult.reason,
        )
      }
    }

    return noStoreJson(result)
  } catch (error) {
    logGenerationFailure(requestId, 'unexpected', error)

    return noStoreJson(
      {
        error: 'Unexpected generation error.',
        details: serializeLogDetails(error),
        debug: createDebug(requestId, 'unexpected', serializeLogDetails(error)),
      },
      { status: 500 },
    )
  }
}

function createRequestId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `generate-${Date.now()}`
}

function logGenerationFailure(requestId: string, stage: string, details: unknown) {
  console.error({
    scope: 'generate-api',
    requestId,
    stage,
    details: serializeLogDetails(details),
  })
}

function serializeLogDetails(details: unknown) {
  if (details instanceof Error) {
    return {
      name: details.name,
      message: details.message,
    }
  }

  return details
}

function createDebug(requestId: string, stage: string, details?: unknown) {
  return {
    requestId,
    stage,
    details,
  }
}

async function parseEdgeResponse(response: Response) {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json().catch(() => null)
  }

  return {
    nonJsonResponse: true,
    contentType,
    body: await response.text().catch(() => ''),
  }
}

function createServiceClient() {
  return createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
}

async function getAuthenticatedUser(accessToken: string): Promise<{
  user: AuthenticatedUser
  attempts: Array<{ method: string; ok: boolean; error?: unknown }>
}> {
  const attempts: Array<{ method: string; ok: boolean; error?: unknown }> = []

  const publicClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
  const publicResult = await publicClient.auth.getUser(accessToken)
  attempts.push({
    method: 'publishable_key_getUser',
    ok: Boolean(publicResult.data.user) && !publicResult.error,
    error: publicResult.error ? serializeLogDetails(publicResult.error) : undefined,
  })

  if (publicResult.data.user && !publicResult.error) {
    return {
      user: publicResult.data.user,
      attempts,
    }
  }

  const serviceClient = createServiceClient()
  const serviceResult = await serviceClient.auth.getUser(accessToken)
  attempts.push({
    method: 'service_role_getUser',
    ok: Boolean(serviceResult.data.user) && !serviceResult.error,
    error: serviceResult.error
      ? serializeLogDetails(serviceResult.error)
      : undefined,
  })

  return {
    user: serviceResult.data.user,
    attempts,
  }
}

function getBearerToken(request: Request) {
  const header = request.headers.get('authorization')

  if (header?.startsWith('Bearer ')) {
    return header.slice('Bearer '.length).trim()
  }

  return request.headers.get('x-supabase-access-token')?.trim() || null
}

function getRequestOrigin(request: Request) {
  const appUrl = process.env.APP_URL?.trim()

  if (appUrl) {
    return appUrl.replace(/\/+$/, '')
  }

  return new URL(request.url).origin.replace(/\/+$/, '')
}

function toAbsolutePublicAssetUrl(path: string | undefined, origin: string) {
  if (!path) {
    return undefined
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  if (!origin) {
    return undefined
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${origin}${normalizedPath}`
}

async function getBarberAccount(
  supabaseAdmin: AdminSupabaseClient,
  userId: string,
) {
  const { data, error } = await supabaseAdmin
    .from('barbers')
    .select('id, remaining_credits, is_active')
    .eq('id', userId)
    .maybeSingle()

  if (error || !data || data.is_active === false) {
    return null
  }

  return data as { id: string; remaining_credits: number; is_active?: boolean }
}

async function reserveGenerationCredit(
  supabaseAdmin: AdminSupabaseClient,
  userId: string,
  currentCredits: number,
) {
  const nextCredits = currentCredits - CREDIT_COST

  if (nextCredits < 0) {
    return false
  }

  const { data, error } = await supabaseAdmin
    .from('barbers')
    .update({ remaining_credits: nextCredits })
    .eq('id', userId)
    .eq('remaining_credits', currentCredits)
    .gte('remaining_credits', CREDIT_COST)
    .select('id')
    .maybeSingle()

  return !error && Boolean(data)
}

async function refundGenerationCredit(
  supabaseAdmin: AdminSupabaseClient,
  userId: string,
) {
  const barber = await getBarberAccount(supabaseAdmin, userId)

  if (!barber) {
    return
  }

  await supabaseAdmin
    .from('barbers')
    .update({ remaining_credits: (barber.remaining_credits || 0) + CREDIT_COST })
    .eq('id', userId)
}

async function logSuccessfulGeneration(
  supabaseAdmin: AdminSupabaseClient,
  userId: string,
  body: GenerateRequestBody,
) {
  await supabaseAdmin.from('session_logs').insert({
    user_id: userId,
    gender: body.gender || 'unknown',
    style_type: body.mode || 'unknown',
    customer_name: body.customerName || null,
    customer_phone: body.customerPhone?.trim() || null,
    created_at: new Date().toISOString(),
  })
}

async function logCreditUsage(
  supabaseAdmin: AdminSupabaseClient,
  userId: string,
  body: GenerateRequestBody,
) {
  await supabaseAdmin.from('credit_transactions').insert({
    customer_id: userId,
    change_amount: -CREDIT_COST,
    transaction_type: 'generation',
    notes: `${body.gender || 'unknown'} ${body.mode || 'unknown'} style generation`,
  })
}

function createGenerationPayload(
  body: GenerateRequestBody,
  metadata: GenerationLogMetadata,
) {
  const logContext = {
    request_id: metadata.requestId,
    user_id: metadata.userId,
    gender: body.gender || null,
    mode: body.mode || null,
    customer_name: body.customerName || null,
    customer_phone: body.customerPhone?.trim() || null,
  }

  const withLogContext = <T extends Record<string, unknown>>(payload: T) => ({
    ...payload,
    log_context: logContext,
  })

  if (body.gender === 'men') {
    return body.mode === 'smart'
      ? withLogContext({
          src_file_url: body.imageUrl,
          gender: 'male',
          isSmartStyle: true,
          hairLength: body.hairLength,
          beardLength: body.beardLength,
        })
      : withLogContext({
          src_file_url: body.imageUrl,
          gender: 'male',
          isSmartStyle: false,
          hairStyle: body.hairStyle,
          beardStyle: body.beardStyle,
          hairStyleImageUrl: toAbsolutePublicAssetUrl(
            body.hairStyleImagePath,
            metadata.origin,
          ),
          beardStyleImageUrl: toAbsolutePublicAssetUrl(
            body.beardStyleImagePath,
            metadata.origin,
          ),
        })
  }

  if (body.mode === 'bridal') {
    return withLogContext({
      src_file_url: body.imageUrl,
      gender: 'female',
      mode: 'bridal',
    })
  }

  if (body.mode === 'smart') {
    return withLogContext({
      src_file_url: body.imageUrl,
      gender: 'female',
      mode: 'smart',
      hairLength: body.hairLength,
      makeup: body.makeup,
      dye: body.dye,
    })
  }

  return withLogContext({
    src_file_url: body.imageUrl,
    gender: 'female',
    mode: 'catalog',
    haircutId: body.haircutId,
    hairStyleId: body.hairStyleId,
    hairColorId: body.hairColorId,
    lipstick: body.lipstick,
    lipFinish: body.lipFinish,
    lipFinishDescription: body.lipFinishDescription,
    lipStyle: body.lipStyle,
    lipStyleDescription: body.lipStyleDescription,
    lipColor: body.lipColor,
    lipColorDescription: body.lipColorDescription,
    lipsPrompt: body.lipsPrompt,
    eyeShadow: body.eyeShadow,
    eyeLiner: body.eyeLiner,
    eyeLashes: body.eyeLashes,
    browStyle: body.browStyle,
    skinType: body.skinType,
    blushColor: body.blushColor,
    blushStyle: body.blushStyle,
    blushIntensity: body.blushIntensity,
    contourType: body.contourType,
    bronzerTone: body.bronzerTone,
    contourIntensity: body.contourIntensity,
    highlightPlacement: body.highlightPlacement,
    highlightTone: body.highlightTone,
    highlightIntensity: body.highlightIntensity,
    highlightFinish: body.highlightFinish,
    mascara: body.mascara,
    extensions: body.extensions,
  })
}

function getGenerationFunctionName(body: GenerateRequestBody) {
  if (body.gender === 'women') {
    return 'gemini-women-style'
  }

  return body.generationProvider === 'gemini'
    ? 'gemini-auto-style'
    : 'openai-auto-style'
}
