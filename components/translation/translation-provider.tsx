'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { arabicTranslations } from '@/lib/translation/dictionary'

export type AppLanguage = 'en' | 'ar'

type TranslationContextValue = {
  language: AppLanguage
  setLanguage: (language: AppLanguage) => void
  toggleLanguage: () => void
  t: (text: string) => string
}

const TranslationContext = createContext<TranslationContextValue | null>(null)
const originalText = new WeakMap<Text, string>()
const originalAttributes = new WeakMap<Element, Partial<Record<TranslatableAttribute, string>>>()
const translatableAttributes = ['placeholder', 'aria-label', 'alt', 'title'] as const

type TranslatableAttribute = (typeof translatableAttributes)[number]

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    if (typeof window === 'undefined') {
      return 'en'
    }

    return localStorage.getItem('salon_lang') === 'ar' ? 'ar' : 'en'
  })

  const setLanguage = useCallback((nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage)
    localStorage.setItem('salon_lang', nextLanguage)
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'ar' ? 'en' : 'ar')
  }, [language, setLanguage])

  const translate = useCallback(
    (text: string) => (language === 'ar' ? translateValue(text) : text),
    [language],
  )

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dataset.language = language

    applyTranslation(document.body, language)

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') {
          applyTranslation(mutation.target, language)
          continue
        }

        for (const node of Array.from(mutation.addedNodes)) {
          applyTranslation(node, language)
        }

        if (
          mutation.type === 'attributes' &&
          mutation.target instanceof Element
        ) {
          applyTranslation(mutation.target, language)
        }
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...translatableAttributes],
    })

    return () => observer.disconnect()
  }, [language])

  const value = useMemo<TranslationContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: translate,
    }),
    [language, setLanguage, toggleLanguage, translate],
  )

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)

  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider.')
  }

  return context
}

function applyTranslation(root: Node, language: AppLanguage) {
  if (isSkippedNode(root)) {
    return
  }

  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text, language)
    return
  }

  if (!(root instanceof Element || root instanceof Document || root instanceof DocumentFragment)) {
    return
  }

  if (root instanceof Element) {
    translateElementAttributes(root, language)
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      return isSkippedNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    },
  })

  let node = walker.nextNode()

  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      translateTextNode(node as Text, language)
    } else if (node instanceof Element) {
      translateElementAttributes(node, language)
    }

    node = walker.nextNode()
  }
}

function translateTextNode(node: Text, language: AppLanguage) {
  const current = node.nodeValue ?? ''

  if (!current.trim()) {
    return
  }

  const stored = originalText.get(node)

  if (!stored) {
    originalText.set(node, current)
  }

  let source = originalText.get(node) ?? current

  if (stored) {
    const translatedStored = translateWithWhitespace(stored)
    const reactUpdatedText =
      language === 'ar'
        ? current !== translatedStored && current !== stored
        : current !== stored

    if (reactUpdatedText) {
      source = current
      originalText.set(node, source)
    }
  }

  const nextValue = language === 'ar' ? translateWithWhitespace(source) : source

  if (node.nodeValue !== nextValue) {
    node.nodeValue = nextValue
  }
}

function translateElementAttributes(element: Element, language: AppLanguage) {
  for (const attribute of translatableAttributes) {
    const current = element.getAttribute(attribute)

    if (!current?.trim()) {
      continue
    }

    let originals = originalAttributes.get(element)

    if (!originals) {
      originals = {}
      originalAttributes.set(element, originals)
    }

    if (!originals[attribute]) {
      originals[attribute] = current
    }

    const source = originals[attribute] ?? current
    const nextValue = language === 'ar' ? translateValue(source) : source

    if (element.getAttribute(attribute) !== nextValue) {
      element.setAttribute(attribute, nextValue)
    }
  }
}

function translateWithWhitespace(value: string) {
  const match = value.match(/^(\s*)([\s\S]*?)(\s*)$/)

  if (!match) {
    return translateValue(value)
  }

  return `${match[1]}${translateValue(match[2])}${match[3]}`
}

function translateValue(value: string): string {
  const direct = arabicTranslations[value]

  if (direct) {
    return direct
  }

  for (const separator of [' - ', ': ']) {
    if (value.includes(separator)) {
      return value
        .split(separator)
        .map((part) => arabicTranslations[part] ?? part)
        .join(separator)
    }
  }

  const pageMatch = value.match(/^Page (\d+)\/(\d+)$/)

  if (pageMatch) {
    return `صفحة ${pageMatch[1]}/${pageMatch[2]}`
  }

  return value
}

function isSkippedNode(node: Node) {
  const element =
    node instanceof Element ? node : node.parentElement

  if (!element) {
    return false
  }

  return Boolean(
    element.closest(
      'script, style, code, pre, [data-translate="no"]',
    ),
  )
}
