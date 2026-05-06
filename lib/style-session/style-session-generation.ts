import { uploadStyleImageAndCreateSignedUrl } from './style-session-upload'
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

  const imageUrl = await uploadStyleImageAndCreateSignedUrl(
    session.imageFile,
    session.customerPhone,
  )
  const {
    data: { session: authSession },
  } = await supabase.auth.getSession()

  if (!authSession?.access_token) {
    throw new Error('Sign in before generating.')
  }

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authSession.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createGenerationRequest(session, imageUrl)),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Generation failed.')
  }

  return result
}

function validateGenerationSession(session: StyleFlowSessionState) {
  if (session.gender === 'men' && session.mode === 'smart') {
    if (!session.hairLength || !session.beardLength) {
      throw new Error('Select hair length and beard length before continuing.')
    }
  }

  if (session.gender === 'men' && session.mode === 'catalog') {
    if (!session.hairStyle || !session.beardStyle) {
      throw new Error('Select hair style and beard style before continuing.')
    }
  }

  if (session.gender === 'women' && session.mode === 'smart') {
    if (!session.hairLength) {
      throw new Error('Select hair length before continuing.')
    }
  }

  if (session.gender === 'women' && session.mode === 'catalog') {
    if (
      !session.hairStyleId ||
      !session.hairColorId ||
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

function createGenerationRequest(session: StyleFlowSessionState, imageUrl: string) {
  if (session.gender === 'men') {
    return {
      gender: 'men',
      mode: session.mode,
      imageUrl,
      hairLength: session.hairLength,
      beardLength: session.beardLength,
      hairStyle: session.hairStyle,
      beardStyle: session.beardStyle,
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
    imageUrl,
    hairLength: session.hairLength,
    makeup: session.makeup,
    dye: session.dye,
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
    customerName: session.customerName,
    customerPhone: session.customerPhone,
  }
}

function formatPromptOption(option?: { name: string; description?: string }) {
  if (!option) {
    return undefined
  }

  return option.description
    ? `${option.name}: ${option.description}`
    : option.name
}
