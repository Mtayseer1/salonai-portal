import type { StyleSessionState } from './style-session-types'

export type CreateStyleSessionResult = {
  sessionId: string
}

export type GenerateStyleResult = {
  imageUrl: string
}

export async function createStyleSession(
  state: StyleSessionState,
): Promise<CreateStyleSessionResult> {
  return {
    sessionId: state.id,
  }
}

export async function generateStyleResult(
  state: StyleSessionState,
): Promise<GenerateStyleResult> {
  void state

  throw new Error('Style generation API is not implemented yet.')
}
