'use client'

import { AppShell } from '@/app/components/ui'
import type { StyleSessionRoute } from '@/lib/style-session/style-session-types'

const styleNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'D' },
  { href: '/style', label: 'Style Session', icon: 'S' },
  { href: '/style/info', label: 'Client Info', icon: 'I' },
  { href: '/style/photo', label: 'Photo', icon: 'P' },
  { href: '/style/result', label: 'Result', icon: 'R' },
]

export function StyleSessionShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      title="Style Session"
      subtitle="Mobile app conversion workspace for guided salon image generation."
      role="Salon"
      navItems={styleNavItems}
      userLabel="Salon account"
    >
      {children}
    </AppShell>
  )
}

export const styleSessionRouteOrder: StyleSessionRoute[] = [
  '/style',
  '/style/info',
  '/style/photo',
  '/style/men/options',
  '/style/men/catalog',
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
  '/style/loading',
  '/style/result',
]
