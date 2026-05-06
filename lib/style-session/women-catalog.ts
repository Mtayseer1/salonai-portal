import type { WomenCatalogOption } from './style-session-types'

export type WomenCatalogData = {
  styles: WomenCatalogOption[]
  colors: WomenCatalogOption[]
  lipsticks: WomenCatalogOption[]
  mascaras: WomenCatalogOption[]
  extensions: WomenCatalogOption[]
}

type WomenCatalogManifest = {
  cuts?: Array<{
    id?: string
    name?: string
    image?: string
    styles?: Array<{
      id?: string
      name?: string
      image?: string
      colors?: Array<{
        id?: string
        name?: string
        image?: string
      }>
    }>
  }>
}

const CATALOG_FULL_ROOT = '/women_catalog/full'

export const emptyWomenCatalog: WomenCatalogData = {
  styles: [],
  colors: [],
  lipsticks: [],
  mascaras: [],
  extensions: [],
}

export const fallbackWomenCatalog = emptyWomenCatalog
export const womenStyleCatalog = emptyWomenCatalog.styles
export const womenColorCatalog = emptyWomenCatalog.colors
export const womenMakeupCatalog = emptyWomenCatalog.lipsticks
export const womenLashesCatalog = emptyWomenCatalog.mascaras

export const womenCatalog = {
  style: womenStyleCatalog,
  color: womenColorCatalog,
  makeup: womenMakeupCatalog,
  lashes: womenLashesCatalog,
} as const

export async function loadWomenCatalogManifest(): Promise<WomenCatalogData> {
  const response = await fetch(`/women_catalog/manifest.json?v=${Date.now()}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    return emptyWomenCatalog
  }

  const manifest = (await response.json()) as WomenCatalogManifest
  return buildWomenCatalogFromManifest(manifest)
}

export function getWomenCatalogColors(
  catalog: WomenCatalogData,
  selectedHairStyleId?: string,
  selectedHaircutId?: string,
) {
  return catalog.colors.filter(
    (option) =>
      option.parentHairStyleId === selectedHairStyleId &&
      option.parentHaircutId === selectedHaircutId,
  )
}

export function findWomenCatalogStyle(
  catalog: WomenCatalogData,
  hairStyleId?: string,
  haircutId?: string,
) {
  return catalog.styles.find(
    (option) => option.hairStyleId === hairStyleId && option.haircutId === haircutId,
  )
}

export function findWomenCatalogColor(
  catalog: WomenCatalogData,
  hairColorId?: string,
  hairStyleId?: string,
  haircutId?: string,
) {
  return catalog.colors.find(
    (option) =>
      option.hairColorId === hairColorId &&
      option.parentHairStyleId === hairStyleId &&
      option.parentHaircutId === haircutId,
  )
}

function buildWomenCatalogFromManifest(manifest: WomenCatalogManifest): WomenCatalogData {
  const styles: WomenCatalogOption[] = []
  const colors: WomenCatalogOption[] = []

  for (const cut of manifest.cuts || []) {
    if (!cut.id) {
      continue
    }

    for (const style of cut.styles || []) {
      if (!style.id) {
        continue
      }

      const styleOption: WomenCatalogOption = {
        id: `${cut.id}__${style.id}`,
        category: 'style',
        label: `${cut.name || cut.id} - ${style.name || style.id}`,
        imagePath: manifestImageToPublicPath(style.image || cut.image),
        haircutId: cut.id,
        hairStyleId: style.id,
      }

      styles.push(styleOption)

      for (const color of style.colors || []) {
        if (!color.id) {
          continue
        }

        colors.push({
          id: `${cut.id}__${style.id}__${color.id}`,
          category: 'color',
          label: color.name || color.id,
          imagePath: manifestImageToPublicPath(color.image),
          haircutId: cut.id,
          hairStyleId: style.id,
          hairColorId: color.id,
          parentHaircutId: cut.id,
          parentHairStyleId: style.id,
        })
      }
    }
  }

  return {
    styles,
    colors,
    lipsticks: [],
    mascaras: [],
    extensions: [],
  }
}

function manifestImageToPublicPath(image?: string) {
  if (!image) {
    return undefined
  }

  const filename = image.split(/[\\/]/).pop()

  if (!filename) {
    return undefined
  }

  return `${CATALOG_FULL_ROOT}/${filename}`
}
