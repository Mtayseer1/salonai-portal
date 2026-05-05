import type {
  StyleFlowSessionState,
  StyleCatalogSelection,
  StyleSessionClientInfo,
  StyleSessionGender,
  StyleSessionPhoto,
  StyleSessionState,
  StyleSessionStatus,
  StyleSessionStep,
} from './style-session-types'

export const STYLE_SESSION_VERSION = 1

export const initialStyleFlowSessionState: StyleFlowSessionState = {
  gender: null,
  mode: null,
  imageFile: null,
  imagePreviewUrl: null,
}

export function createStyleFlowSessionState(): StyleFlowSessionState {
  return { ...initialStyleFlowSessionState }
}

export function createStyleSessionState(): StyleSessionState {
  const now = new Date().toISOString()

  return {
    id: createSessionId(),
    status: 'draft',
    currentStep: 'start',
    client: {},
    selections: [],
    createdAt: now,
    updatedAt: now,
  }
}

export function updateStyleSessionState(
  state: StyleSessionState,
  patch: Partial<Omit<StyleSessionState, 'id' | 'createdAt' | 'updatedAt'>>,
): StyleSessionState {
  return {
    ...state,
    ...patch,
    updatedAt: new Date().toISOString(),
  }
}

export function setStyleSessionStep(
  state: StyleSessionState,
  currentStep: StyleSessionStep,
): StyleSessionState {
  return updateStyleSessionState(state, { currentStep })
}

export function setStyleSessionStatus(
  state: StyleSessionState,
  status: StyleSessionStatus,
): StyleSessionState {
  return updateStyleSessionState(state, { status })
}

export function setStyleSessionGender(
  state: StyleSessionState,
  gender: StyleSessionGender,
): StyleSessionState {
  return updateStyleSessionState(state, { gender })
}

export function setStyleSessionClient(
  state: StyleSessionState,
  client: StyleSessionClientInfo,
): StyleSessionState {
  return updateStyleSessionState(state, { client: { ...state.client, ...client } })
}

export function setStyleSessionPhoto(
  state: StyleSessionState,
  photo: StyleSessionPhoto,
): StyleSessionState {
  return updateStyleSessionState(state, { photo })
}

export function upsertStyleSessionSelection(
  state: StyleSessionState,
  selection: StyleCatalogSelection,
): StyleSessionState {
  const selections = state.selections.filter(
    (item) => item.category !== selection.category,
  )

  return updateStyleSessionState(state, {
    selections: [...selections, selection],
  })
}

function createSessionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `style-session-${Date.now()}`
}
