export type WomenSignatureLook = {
  id: string
  name: string
  imagePath: string
  prompt: string
}

type WomenSignatureManifest = {
  looks?: WomenSignatureLook[]
}

export async function loadWomenSignatureLooks(): Promise<WomenSignatureLook[]> {
  const response = await fetch(`/women_signature/manifest.json?v=${Date.now()}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    return []
  }

  const manifest = (await response.json()) as WomenSignatureManifest

  return Array.isArray(manifest.looks) ? manifest.looks : []
}

export function findWomenSignatureLook(
  looks: WomenSignatureLook[],
  id?: string,
) {
  return looks.find((look) => look.id === id)
}
