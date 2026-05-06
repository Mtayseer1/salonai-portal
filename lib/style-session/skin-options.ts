export type SkinOption = {
  name: string
  description: string
  imagePath?: string
}

export const SKIN_OPTIONS: SkinOption[] = [
  createSkinOption('None', 'no foundation or skin base', false),
  createSkinOption('Bare Skin', 'No visible foundation, natural texture.'),
  createSkinOption('Natural Skin Finish', 'Light natural base, visible pores.'),
  createSkinOption('No Makeup Base', 'Fresh natural clean skin.'),
  createSkinOption('Light Coverage', 'Soft tone correction.'),
  createSkinOption('Medium Coverage', 'Balanced smoothing.'),
  createSkinOption('Full Coverage', 'Polished even complexion.'),
  createSkinOption('Buildable Coverage', 'Layered foundation effect.'),
  createSkinOption('Sheer Coverage', 'Very light transparent base.'),
  createSkinOption('Tinted Moisturizer', 'Hydrating light base.'),
  createSkinOption('BB Cream Finish', 'Soft correction + hydration.'),
  createSkinOption('CC Cream Finish', 'Color-correcting base.'),
  createSkinOption('Matte Skin', 'No shine, controlled finish.'),
  createSkinOption('Soft Matte', 'Velvet soft matte.'),
  createSkinOption('Velvet Matte', 'Luxury matte finish.'),
  createSkinOption('Powder Matte', 'Powder-set matte.'),
  createSkinOption('Natural Matte', 'Soft oil control.'),
  createSkinOption('Dewy Skin', 'Hydrated glow.'),
  createSkinOption('Soft Dewy', 'Subtle glow.'),
  createSkinOption('Radiant Glow', 'Healthy luminous skin.'),
  createSkinOption('Glow Skin', 'Visible glow.'),
  createSkinOption('Glass Skin', 'Smooth reflective Korean glow.'),
  createSkinOption('Korean Glass Skin', 'Ultra smooth luminous skin.'),
  createSkinOption('Fresh Hydrated Skin', 'Plump hydrated look.'),
  createSkinOption('Luminous Skin', 'Elegant glow.'),
  createSkinOption('Satin Skin', 'Between matte and dewy.'),
  createSkinOption('Semi Matte', 'Balanced shine control.'),
  createSkinOption('Soft Blur', 'Soft texture smoothing.'),
  createSkinOption('Pore Blurring', 'Minimized pores.'),
  createSkinOption('Airbrushed Finish', 'Smooth polished skin.'),
  createSkinOption('Photo Ready Skin', 'Camera-ready finish.'),
  createSkinOption('HD Foundation', 'High-definition base.'),
  createSkinOption('Soft Focus Skin', 'Light diffused texture.'),
  createSkinOption('Primer Smooth', 'Smooth prep surface.'),
  createSkinOption('Oil Control Base', 'Reduce shine.'),
  createSkinOption('Shine Control', 'Controlled reflection.'),
  createSkinOption('Warm Radiant Base', 'Warm glow.'),
  createSkinOption('Cool Balanced Base', 'Cool tone balance.'),
  createSkinOption('Neutral Balanced Base', 'Neutral tone.'),
  createSkinOption('Rosy Fresh Base', 'Soft pink tone.'),
  createSkinOption('Golden Glow Base', 'Golden highlight.'),
  createSkinOption('Sunlit Skin', 'Natural sunlight glow.'),
  createSkinOption('Luxury Editorial Skin', 'High-end editorial finish.'),
]

export function findSkinOption(name?: string) {
  return SKIN_OPTIONS.find((option) => option.name === name)
}

function createSkinOption(
  name: string,
  description: string,
  hasImage = true,
): SkinOption {
  return {
    name,
    description,
    imagePath: hasImage ? `/skin/${name.replace(/ /g, '_')}.png` : undefined,
  }
}
