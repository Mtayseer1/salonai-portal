import { createStyleSessionState } from './session-state'
import type {
  StyleFlowSessionPersistedState,
  StyleFlowSessionState,
  StyleSessionState,
} from './style-session-types'

const STORAGE_KEY = 'salonai_style_session'
const FLOW_STORAGE_KEY = 'salonai_style_flow_session'

export function loadStyleSessionState(): StyleSessionState {
  if (typeof window === 'undefined') {
    return createStyleSessionState()
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    return createStyleSessionState()
  }

  try {
    return JSON.parse(stored) as StyleSessionState
  } catch {
    return createStyleSessionState()
  }
}

export function saveStyleSessionState(state: StyleSessionState) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearStyleSessionState() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}

export function loadStyleFlowSessionState():
  | StyleFlowSessionPersistedState
  | null {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = window.localStorage.getItem(FLOW_STORAGE_KEY)

  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored) as StyleFlowSessionPersistedState
  } catch {
    return null
  }
}

export function saveStyleFlowSessionState(state: StyleFlowSessionState) {
  if (typeof window === 'undefined') {
    return
  }

  const { imageFile, ...persistedState } = state
  void imageFile

  if (persistedState.gender === 'women') {
    persistedState.generatedImageUrl = undefined
    persistedState.generatedImageBase64 = undefined
    persistedState.generationResponse = undefined
  }

  window.localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(persistedState))
}

export function clearStyleFlowSessionState() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(FLOW_STORAGE_KEY)
}
