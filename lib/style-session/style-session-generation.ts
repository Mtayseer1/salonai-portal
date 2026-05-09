import { uploadStyleImageForGeneration } from './style-session-upload'
import { supabase } from '@/src/lib/supabase'
import { getSelectedLipPrompt } from './lips-catalog'
import {
  EYE_LASHES,
  EYE_LINERS,
  EYE_SHADOWS,
  findEyeOption,
} from './eyes-options'
import { findBrowOption } from './brow-options'
import { findSkinOption } from './skin-options'
import {
  BLUSH_COLORS,
  BLUSH_INTENSITIES,
  BLUSH_STYLES,
  findBlushOption,
} from './blush-options'
import {
  BRONZER_TONES,
  CONTOUR_INTENSITIES,
  CONTOUR_TYPES,
  findContourOption,
} from './contour-options'
import {
  HIGHLIGHT_FINISHES,
  HIGHLIGHT_INTENSITIES,
  HIGHLIGHT_PLACEMENTS,
  HIGHLIGHT_TONES,
  findHighlightOption,
} from './highlight-options'
import { findMenHairOption } from './men-hair-catalog'
import { findMenBeardOption } from './men-beard-catalog'
import type {
  StyleFlowSessionState,
  StyleSessionGenerationResult,
} from './style-session-types'

export async function generateStyleFromSession(
  session: StyleFlowSessionState,
): Promise<StyleSessionGenerationResult> {
  if (!session.gender) {
    throw new Error('Choose a client path before generating.')
  }

  if (!session.mode) {
    throw new Error('Choose a style mode before generating.')
  }

  if (!session.imageFile) {
    throw new Error('Upload the client image again before generating.')
  }

  validateGenerationSession(session)

  const imageInput =
    session.gender === 'women'
      ? await createInlineImageInput(session.imageFile)
      : {
          imageUrl: (
            await uploadStyleImageForGeneration(
              session.imageFile,
              session.customerPhone,
            )
          ).signedUrl,
        }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  const {
    data: { session: authSession },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (userError || !user || sessionError || !authSession?.access_token) {
    throw new Error(
      [
        'Sign in before generating.',
        '',
        'Client auth debug:',
        stringifyDebug({
          hasUser: Boolean(user),
          userId: user?.id,
          userError: userError?.message,
          hasSession: Boolean(authSession),
          sessionError: sessionError?.message,
          hasAccessToken: Boolean(authSession?.access_token),
        }),
      ].join('\n'),
    )
  }

  const response = await fetch('/api/generate', {
    method: 'POST',
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${authSession.access_token}`,
      'X-Supabase-Access-Token': authSession.access_token,
      'X-Salon-User-Id': user.id,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createGenerationRequest(session, imageInput)),
  })

  const result = await parseGenerationResponse(response)

  if (!response.ok) {
    throw new Error(formatGenerationError(response.status, result))
  }

  return result
}

async function parseGenerationResponse(response: Response) {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return {
    error: 'Generation returned a non-JSON response.',
    details: await response.text(),
  }
}

function formatGenerationError(status: number, result: unknown) {
  if (!result || typeof result !== 'object') {
    return `Generation failed.\n\nStatus: ${status}\nResponse: ${String(result)}`
  }

  const errorResult = result as {
    error?: string
    code?: string
    details?: unknown
    debug?: unknown
  }
  const lines = [
    errorResult.error || 'Generation failed.',
    '',
    `Status: ${status}`,
  ]

  if (errorResult.code) {
    lines.push(`Code: ${errorResult.code}`)
  }

  if (errorResult.debug) {
    lines.push('', 'Debug:', stringifyDebug(errorResult.debug))
  }

  if (errorResult.details) {
    lines.push('', 'Details:', stringifyDebug(errorResult.details))
  }

  return lines.join('\n')
}

function stringifyDebug(value: unknown) {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function validateGenerationSession(session: StyleFlowSessionState) {
  if (session.gender === 'men' && session.mode === 'smart') {
    if (!session.hairLength || !session.beardLength) {
      throw new Error('Select hair length and beard length before continuing.')
    }
  }

  if (session.gender === 'men' && session.mode === 'catalog') {
    if (
      !session.hairCategory ||
      !session.hairStyle ||
      !session.beardCategory ||
      !session.beardStyle
    ) {
      throw new Error(
        'Select hair category, hair style, beard category, and beard style before continuing.',
      )
    }
  }

  if (session.gender === 'women' && session.mode === 'smart') {
    if (!session.hairLength) {
      throw new Error('Select hair length before continuing.')
    }
  }

  if (session.gender === 'women' && session.mode === 'catalog') {
    if (
      !session.lipFinish ||
      !session.lipStyle ||
      !session.lipColor ||
      !session.eyeShadow ||
      !session.eyeLiner ||
      !session.eyeLashes ||
      !session.browStyle ||
      !session.skinType ||
      !session.blushColor ||
      !session.blushStyle ||
      !session.blushIntensity ||
      !session.contourType ||
      !session.bronzerTone ||
      !session.contourIntensity ||
      !session.highlightPlacement ||
      !session.highlightTone ||
      !session.highlightIntensity ||
      !session.highlightFinish
    ) {
      throw new Error('Complete all catalog selections before generating.')
    }
  }
}

type GenerationImageInput = {
  imageUrl?: string
  imageBase64?: string
  imageMimeType?: string
}

function createGenerationRequest(
  session: StyleFlowSessionState,
  imageInput: GenerationImageInput,
) {
  if (session.gender === 'men') {
    if (!imageInput.imageUrl) {
      throw new Error('Could not prepare image URL for generation.')
    }

    const hairOption =
      session.mode === 'catalog'
        ? findMenHairOption(session.hairCategory, session.hairStyle)
        : undefined
    const beardOption =
      session.mode === 'catalog'
        ? findMenBeardOption(session.beardCategory, session.beardStyle)
        : undefined

    return {
      gender: 'men',
      mode: session.mode,
      generationProvider: 'gemini',
      imageUrl: imageInput.imageUrl,
      hairLength: session.hairLength,
      beardLength: session.beardLength,
      hairStyle: session.hairStyle,
      beardStyle: session.beardStyle,
      hairStyleImagePath: hairOption?.imagePath,
      beardStyleImagePath: beardOption?.imagePath,
      customerName: session.customerName,
      customerPhone: session.customerPhone,
    }
  }

  const selectedLips = getSelectedLipPrompt({
    finishId: session.lipFinish,
    styleId: session.lipStyle,
    colorId: session.lipColor,
  })
  const eyeShadow = formatPromptOption(
    findEyeOption(EYE_SHADOWS, session.eyeShadow),
  )
  const eyeLiner = formatPromptOption(findEyeOption(EYE_LINERS, session.eyeLiner))
  const eyeLashes = formatPromptOption(
    findEyeOption(EYE_LASHES, session.eyeLashes),
  )
  const browStyle = formatPromptOption(findBrowOption(session.browStyle))
  const skinType = formatPromptOption(findSkinOption(session.skinType))
  const blushColor = formatPromptOption(
    findBlushOption(BLUSH_COLORS, session.blushColor),
  )
  const blushStyle = formatPromptOption(
    findBlushOption(BLUSH_STYLES, session.blushStyle),
  )
  const blushIntensity = formatPromptOption(
    findBlushOption(BLUSH_INTENSITIES, session.blushIntensity),
  )
  const contourType = formatPromptOption(
    findContourOption(CONTOUR_TYPES, session.contourType),
  )
  const bronzerTone = formatPromptOption(
    findContourOption(BRONZER_TONES, session.bronzerTone),
  )
  const contourIntensity = formatPromptOption(
    findContourOption(CONTOUR_INTENSITIES, session.contourIntensity),
  )
  const highlightPlacement = formatPromptOption(
    findHighlightOption(HIGHLIGHT_PLACEMENTS, session.highlightPlacement),
  )
  const highlightTone = formatPromptOption(
    findHighlightOption(HIGHLIGHT_TONES, session.highlightTone),
  )
  const highlightIntensity = formatPromptOption(
    findHighlightOption(HIGHLIGHT_INTENSITIES, session.highlightIntensity),
  )
  const highlightFinish = formatPromptOption(
    findHighlightOption(HIGHLIGHT_FINISHES, session.highlightFinish),
  )

  return {
    gender: 'women',
    mode: session.mode,
    imageBase64: imageInput.imageBase64,
    imageMimeType: imageInput.imageMimeType,
    hairLength: session.hairLength,
    makeup: session.makeup,
    dye: session.dye,
    haircutId: session.haircutId,
    hairStyleId: session.hairStyleId,
    hairColorId: session.hairColorId,
    lipstick: selectedLips.color?.name || session.lipColor || session.lipstick,
    lipFinish: selectedLips.finish?.name,
    lipFinishDescription: selectedLips.finish?.description,
    lipStyle: selectedLips.style?.name,
    lipStyleDescription: selectedLips.style?.description,
    lipColor: selectedLips.color?.name,
    lipColorDescription: selectedLips.color?.description,
    lipsPrompt: selectedLips.prompt,
    eyeShadow,
    eyeLiner,
    eyeLashes,
    browStyle,
    skinType,
    blushColor,
    blushStyle,
    blushIntensity,
    contourType,
    bronzerTone,
    contourIntensity,
    highlightPlacement,
    highlightTone,
    highlightIntensity,
    highlightFinish,
    mascara: eyeLashes || session.mascara,
    extensions: Boolean(session.extensions),
    bridalStyleOrigin: session.bridalStyleOrigin,
    customerName: session.customerName,
    customerPhone: session.customerPhone,
  }
}

async function createInlineImageInput(imageFile: File): Promise<GenerationImageInput> {
  const dataUrl = await readFileAsDataUrl(imageFile)
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)

  if (!match?.[2]) {
    throw new Error('Could not prepare image data for generation.')
  }

  return {
    imageBase64: match[2],
    imageMimeType: match[1] || imageFile.type || 'image/jpeg',
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Could not read image file.'))
    }
    reader.onerror = () => reject(reader.error || new Error('Could not read image file.'))
    reader.readAsDataURL(file)
  })
}

function formatPromptOption(option?: { name: string; description?: string }) {
  if (!option) {
    return undefined
  }

  return option.description
    ? `${option.name}: ${option.description}`
    : option.name
}
