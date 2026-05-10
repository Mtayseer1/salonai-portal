'use client'

import { usePathname, useRouter } from 'next/navigation'
import { AppShell } from '@/app/components/ui'
import type { StyleSessionRoute } from '@/lib/style-session/style-session-types'
import { useStyleSession } from './style-session-provider'

const styleNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'D' },
  { href: '/style', label: 'Style Session', icon: 'S' },
  { href: '/style/info', label: 'Client Info', icon: 'I' },
  { href: '/style/photo', label: 'Photo', icon: 'P' },
  { href: '/style/result', label: 'Result', icon: 'R' },
]

export function StyleSessionShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const session = useStyleSession()

  const goBack = () => {
    router.push(getStyleFlowBackRoute(pathname, session))
  }

  return (
    <AppShell
      title="Style Session"
      subtitle="Mobile app conversion workspace for guided salon image generation."
      role="Salon"
      navItems={styleNavItems}
      userLabel="Salon account"
      onBack={goBack}
    >
      {children}
    </AppShell>
  )
}

function getStyleFlowBackRoute(
  pathname: string,
  session: ReturnType<typeof useStyleSession>,
) {
  if (pathname === '/style' || pathname === '/style/info') {
    return '/dashboard'
  }

  if (pathname === '/style/photo') {
    const photoFlow = getPhotoFlow()
    const photoGender = getPhotoGender() || session.gender

    if (photoFlow === 'start') {
      return '/style/info'
    }

    if (photoFlow === 'mode' || !session.imageFile) {
      return getStyleOptionsRoute(photoGender)
    }

    return getModeReviewRoute(session.gender, session.mode)
  }

  if (pathname === '/style/men/options' || pathname === '/style/women/options') {
    return '/style/photo?flow=start'
  }

  if (pathname === '/style/men/catalog/review') {
    return '/style/men/options'
  }

  if (
    pathname === '/style/men/catalog' ||
    pathname === '/style/men/catalog/beard'
  ) {
    return '/style/men/catalog/review'
  }

  if (pathname === '/style/women/catalog/review') {
    return '/style/women/options'
  }

  if (pathname === '/style/women/bridal/review') {
    return '/style/women/options'
  }

  if (pathname === '/style/women/signature') {
    return '/style/women/options'
  }

  if (pathname.startsWith('/style/women/catalog/')) {
    return '/style/women/catalog/review'
  }

  if (pathname === '/style/loading') {
    return getModeReviewRoute(session.gender, session.mode)
  }

  if (pathname === '/style/result') {
    return '/dashboard'
  }

  return '/dashboard'
}

function getPhotoFlow() {
  if (typeof window === 'undefined') {
    return null
  }

  return new URLSearchParams(window.location.search).get('flow')
}

function getPhotoGender() {
  if (typeof window === 'undefined') {
    return null
  }

  const gender = new URLSearchParams(window.location.search).get('gender')

  return gender === 'men' || gender === 'women' ? gender : null
}

function getStyleOptionsRoute(gender: ReturnType<typeof useStyleSession>['gender']) {
  if (gender === 'men') {
    return '/style/men/options'
  }

  if (gender === 'women') {
    return '/style/women/options'
  }

  return '/style/info'
}

function getModeReviewRoute(
  gender: ReturnType<typeof useStyleSession>['gender'],
  mode: ReturnType<typeof useStyleSession>['mode'],
) {
  if (gender === 'women') {
    if (mode === 'bridal') {
      return '/style/women/bridal/review'
    }

    if (mode === 'catalog') {
      return '/style/women/catalog/review'
    }

    if (mode === 'signature') {
      return '/style/women/signature'
    }

    return '/style/women/options'
  }

  if (gender === 'men') {
    return mode === 'catalog' ? '/style/men/catalog/review' : '/style/men/options'
  }

  return '/style/info'
}

export const styleSessionRouteOrder: StyleSessionRoute[] = [
  '/style',
  '/style/info',
  '/style/photo',
  '/style/men/options',
  '/style/men/catalog',
  '/style/men/catalog/beard',
  '/style/men/catalog/review',
  '/style/women/options',
  '/style/women/catalog/style',
  '/style/women/catalog/color',
  '/style/women/catalog/lips',
  '/style/women/catalog/eyes',
  '/style/women/catalog/brows',
  '/style/women/catalog/skin',
  '/style/women/catalog/blush',
  '/style/women/catalog/contour',
  '/style/women/catalog/highlight',
  '/style/women/catalog/review',
  '/style/women/signature',
  '/style/women/bridal/review',
  '/style/loading',
  '/style/result',
]
