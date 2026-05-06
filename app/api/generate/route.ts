import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

type GenerateRequestBody = {
  gender?: string
  mode?: string
  imageUrl?: string
  hairLength?: string
  beardLength?: string
  hairStyle?: string
  beardStyle?: string
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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const CREDIT_COST = 1

type AdminSupabaseClient = ReturnType<typeof createServiceClient>

export async function POST(request: Request) {
  const requestId = createRequestId()

  try {
    const body = (await request.json()) as GenerateRequestBody

    if (!SUPABASE_URL) {
      return NextResponse.json(
        { error: 'Missing Supabase URL configuration.' },
        { status: 500 },
      )
    }

    if (!SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Missing Supabase anon key configuration.' },
        { status: 500 },
      )
    }

    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Missing Supabase service configuration.' },
        { status: 500 },
      )
    }

    const accessToken = getBearerToken(request)

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Sign in before generating.', code: 'unauthenticated' },
        { status: 401 },
      )
    }

    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const supabaseAdmin = createServiceClient()
    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser(accessToken)

    if (authError || !user) {
      logGenerationFailure(requestId, 'auth', authError)

      return NextResponse.json(
        { error: 'Sign in before generating.', code: 'unauthenticated' },
        { status: 401 },
      )
    }

    if (body.gender !== 'men' && body.gender !== 'women') {
      return NextResponse.json(
        { error: 'Invalid generation gender.' },
        { status: 400 },
      )
    }

    if (
      body.mode !== 'smart' &&
      body.mode !== 'catalog' &&
      body.mode !== 'bridal'
    ) {
      return NextResponse.json(
        { error: 'Invalid generation mode.' },
        { status: 400 },
      )
    }

    if (!body.imageUrl) {
      return NextResponse.json(
        { error: 'Missing source image URL.' },
        { status: 400 },
      )
    }

    const barber = await getBarberAccount(supabaseAdmin, user.id)

    if (!barber) {
      logGenerationFailure(requestId, 'account', {
        userId: user.id,
        reason: 'missing_or_inactive_barber',
      })

      return NextResponse.json(
        { error: 'Salon account not found.', code: 'missing_account' },
        { status: 403 },
      )
    }

    if ((barber.remaining_credits || 0) < CREDIT_COST) {
      logGenerationFailure(requestId, 'credits', {
        userId: user.id,
        remainingCredits: barber.remaining_credits || 0,
      })

      return NextResponse.json(
        {
          error: 'Insufficient credits. Buy credits before generating.',
          code: 'insufficient_credits',
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

      return NextResponse.json(
        {
          error: 'Insufficient credits. Buy credits before generating.',
          code: 'insufficient_credits',
        },
        { status: 402 },
      )
    }

    const payload = createGenerationPayload(body)

    let response: Response

    try {
      response = await fetch(`${SUPABASE_URL}/functions/v1/gemini-auto-style`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    } catch (error) {
      await refundGenerationCredit(supabaseAdmin, user.id)
      logGenerationFailure(requestId, 'edge_fetch', error)

      return NextResponse.json(
        {
          error: 'Generation failed. No credit was used.',
          code: 'generation_failed',
        },
        { status: 502 },
      )
    }

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      await refundGenerationCredit(supabaseAdmin, user.id)
      logGenerationFailure(requestId, 'edge_response', {
        status: response.status,
        result,
      })

      return NextResponse.json(
        {
          error: 'Generation failed. No credit was used.',
          code: 'generation_failed',
          details: process.env.NODE_ENV === 'development' ? result : undefined,
        },
        { status: response.status },
      )
    }

    await logSuccessfulGeneration(supabaseAdmin, user.id, body)
    await logCreditUsage(supabaseAdmin, user.id, body)

    return NextResponse.json(result)
  } catch (error) {
    logGenerationFailure(requestId, 'unexpected', error)

    return NextResponse.json(
      {
        error: 'Unexpected generation error.',
        details:
          process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.message
            : undefined,
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

function createServiceClient() {
  return createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
}

function getBearerToken(request: Request) {
  const header = request.headers.get('authorization')

  if (!header?.startsWith('Bearer ')) {
    return null
  }

  return header.slice('Bearer '.length).trim()
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

function createGenerationPayload(body: GenerateRequestBody) {
  if (body.gender === 'men') {
    return body.mode === 'smart'
      ? {
          src_file_url: body.imageUrl,
          gender: 'male',
          isSmartStyle: true,
          hairLength: body.hairLength,
          beardLength: body.beardLength,
        }
      : {
          src_file_url: body.imageUrl,
          gender: 'male',
          isSmartStyle: false,
          hairStyle: body.hairStyle,
          beardStyle: body.beardStyle,
        }
  }

  if (body.mode === 'bridal') {
    return {
      src_file_url: body.imageUrl,
      gender: 'female',
      mode: 'bridal',
    }
  }

  if (body.mode === 'smart') {
    return {
      src_file_url: body.imageUrl,
      gender: 'female',
      mode: 'smart',
      hairLength: body.hairLength,
      makeup: body.makeup,
      dye: body.dye,
    }
  }

  return {
    src_file_url: body.imageUrl,
    gender: 'female',
    mode: 'catalog',
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
  }
}
