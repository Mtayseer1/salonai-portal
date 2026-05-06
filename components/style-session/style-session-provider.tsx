'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createStyleFlowSessionState } from '@/lib/style-session/session-state'
import {
  clearStyleFlowSessionState,
  loadStyleFlowSessionState,
  saveStyleFlowSessionState,
} from '@/lib/style-session/style-session-storage'
import type {
  MenStyleSessionOptions,
  StyleFlowSessionState,
  StyleSessionGenerationResult,
  StyleSessionCustomerInfo,
  StyleSessionGender,
  StyleSessionMode,
  WomenStyleSessionOptions,
} from '@/lib/style-session/style-session-types'

type StyleSessionContextValue = StyleFlowSessionState & {
  setGender: (gender: StyleSessionGender) => void
  setMode: (mode: StyleSessionMode) => void
  setImage: (imageFile: File | null) => void
  setMenOptions: (options: MenStyleSessionOptions) => void
  setWomenOptions: (options: WomenStyleSessionOptions) => void
  setCustomerInfo: (info: StyleSessionCustomerInfo) => void
  setGenerationResult: (result: StyleSessionGenerationResult) => void
  setGenerationError: (message?: string) => void
  markGenerationCreditDeducted: (resultId: string) => void
  resetSession: () => void
}

const StyleSessionContext = createContext<StyleSessionContextValue | null>(null)

export function StyleSessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StyleFlowSessionState>(() => {
    const initialState = createStyleFlowSessionState()
    const persistedState = loadStyleFlowSessionState()

    if (!persistedState) {
      return initialState
    }

    return {
      ...initialState,
      ...persistedState,
      imageFile: null,
    }
  })
  const previewUrlRef = useRef<string | null>(state.imagePreviewUrl)

  useEffect(() => {
    saveStyleFlowSessionState(state)
  }, [state])

  useEffect(() => {
    return () => {
      if (previewUrlRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrlRef.current)
      }
    }
  }, [])

  const setGender = useCallback((gender: StyleSessionGender) => {
    setState((current) => ({ ...current, gender }))
  }, [])

  const setMode = useCallback((mode: StyleSessionMode) => {
    setState((current) => ({ ...current, mode }))
  }, [])

  const setImage = useCallback((imageFile: File | null) => {
    setState((current) => {
      if (previewUrlRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrlRef.current)
      }

      const imagePreviewUrl = imageFile ? URL.createObjectURL(imageFile) : null
      previewUrlRef.current = imagePreviewUrl

      return {
        ...current,
        imageFile,
        imagePreviewUrl,
      }
    })
  }, [])

  const setMenOptions = useCallback((options: MenStyleSessionOptions) => {
    setState((current) => ({ ...current, ...options }))
  }, [])

  const setWomenOptions = useCallback((options: WomenStyleSessionOptions) => {
    setState((current) => ({ ...current, ...options }))
  }, [])

  const setCustomerInfo = useCallback((info: StyleSessionCustomerInfo) => {
    setState((current) => ({ ...current, ...info }))
  }, [])

  const setGenerationResult = useCallback((result: StyleSessionGenerationResult) => {
    const generatedImageUrl =
      result.image_url ||
      result.imageUrl ||
      result.generated_image_url ||
      result.generatedImageUrl ||
      result.result?.image_url ||
      result.result?.imageUrl ||
      result.result?.generated_image_url ||
      result.result?.generatedImageUrl ||
      result.data?.image_url ||
      result.data?.imageUrl ||
      result.data?.generated_image_url ||
      result.data?.generatedImageUrl
    const generatedImageBase64 =
      result.image_base64 ||
      result.imageBase64 ||
      result.generated_image_base64 ||
      result.generatedImageBase64 ||
      result.result?.image_base64 ||
      result.result?.imageBase64 ||
      result.result?.generated_image_base64 ||
      result.result?.generatedImageBase64 ||
      result.data?.image_base64 ||
      result.data?.imageBase64 ||
      result.data?.generated_image_base64 ||
      result.data?.generatedImageBase64

    setState((current) => ({
      ...current,
      generatedImageUrl,
      generatedImageBase64,
      generationResponse: result,
      generationResultId: createGenerationResultId(),
      generationError: undefined,
    }))
  }, [])

  const setGenerationError = useCallback((message?: string) => {
    setState((current) => ({
      ...current,
      generationError: message,
    }))
  }, [])

  const markGenerationCreditDeducted = useCallback((resultId: string) => {
    setState((current) => ({
      ...current,
      creditDeductedForResultId: resultId,
    }))
  }, [])

  const resetSession = useCallback(() => {
    if (previewUrlRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrlRef.current)
    }

    previewUrlRef.current = null
    clearStyleFlowSessionState()
    setState(createStyleFlowSessionState())
  }, [])

  const value = useMemo<StyleSessionContextValue>(
    () => ({
      ...state,
      setGender,
      setMode,
      setImage,
      setMenOptions,
      setWomenOptions,
      setCustomerInfo,
      setGenerationResult,
      setGenerationError,
      markGenerationCreditDeducted,
      resetSession,
    }),
    [
      markGenerationCreditDeducted,
      resetSession,
      setCustomerInfo,
      setGenerationError,
      setGender,
      setGenerationResult,
      setImage,
      setMenOptions,
      setMode,
      setWomenOptions,
      state,
    ],
  )

  return (
    <StyleSessionContext.Provider value={value}>
      {children}
    </StyleSessionContext.Provider>
  )
}

export function useStyleSession() {
  const context = useContext(StyleSessionContext)

  if (!context) {
    throw new Error('useStyleSession must be used within StyleSessionProvider.')
  }

  return context
}

function createGenerationResultId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `result-${Date.now()}`
}
