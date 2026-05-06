import { NextResponse } from 'next/server'

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
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function POST(request: Request) {
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

    const payload = createGenerationPayload(body)

    const response = await fetch(`${SUPABASE_URL}/functions/v1/gemini-auto-style`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Generation failed.',
          details: result,
        },
        { status: response.status },
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unexpected generation error.',
      },
      { status: 500 },
    )
  }
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
