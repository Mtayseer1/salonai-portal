import { uploadStyleImageAndCreateSignedUrl } from './style-session-upload'
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

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
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
      !session.lipstick ||
      !session.mascara
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
    }
  }

  return {
    gender: 'women',
    mode: session.mode,
    imageUrl,
    hairLength: session.hairLength,
    makeup: session.makeup,
    dye: session.dye,
    hairStyleId: session.hairStyleId,
    hairColorId: session.hairColorId,
    lipstick: session.lipstick,
    mascara: session.mascara,
    extensions: Boolean(session.extensions),
  }
}
