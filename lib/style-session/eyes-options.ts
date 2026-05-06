export type EyeOption = {
  name: string
  description?: string
  imagePath?: string
}

export const EYE_SHADOWS: EyeOption[] = [
  createEyeOption('None', 'no eye shadow', 'shadow', false),
  createEyeOption('Natural', 'very light neutral shadow', 'shadow'),
  createEyeOption('Soft Glam', 'warm blended shadow', 'shadow'),
  createEyeOption('Bronze', 'bronze shimmer', 'shadow'),
  createEyeOption('Gold', 'gold shimmer', 'shadow'),
  createEyeOption('Pink', 'pink tones', 'shadow'),
  createEyeOption('Peach', 'peach tones', 'shadow'),
  createEyeOption('Smokey Light', 'light smokey', 'shadow'),
  createEyeOption('Smokey Medium', 'medium smokey', 'shadow'),
  createEyeOption('Smokey Dark', 'dark smokey', 'shadow'),
  createEyeOption('Cut Crease Soft', 'soft crease', 'shadow'),
  createEyeOption('Cut Crease Sharp', 'sharp crease', 'shadow'),
  createEyeOption('Halo Eye', 'bright center', 'shadow'),
  createEyeOption('Glitter', 'sparkle shadow', 'shadow'),
  createEyeOption('Arabic Dramatic', 'bold deep shadow', 'shadow'),
]

export const EYE_LINERS: EyeOption[] = [
  createEyeOption('None', 'no eyeliner', 'liner', false),
  createEyeOption('Thin', undefined, 'liner'),
  createEyeOption('Classic Wing', undefined, 'liner'),
  createEyeOption('Sharp Wing', undefined, 'liner'),
  createEyeOption('Bold', undefined, 'liner'),
  createEyeOption('Double Wing', undefined, 'liner'),
  createEyeOption('Smudged', undefined, 'liner'),
  createEyeOption('Graphic', undefined, 'liner'),
  createEyeOption('Inner Corner Liner', undefined, 'liner'),
  createEyeOption('Kitten Eye', undefined, 'liner'),
  createEyeOption('Extended Wing', undefined, 'liner'),
  createEyeOption('Reverse Cat Eye', undefined, 'liner'),
  createEyeOption('Lower Lash Liner', undefined, 'liner'),
  createEyeOption('Floating Liner', undefined, 'liner', false),
  createEyeOption('Negative Space Liner', undefined, 'liner'),
  createEyeOption('Graphic Double Wing', undefined, 'liner'),
  createEyeOption('Thick Bottom Liner', undefined, 'liner'),
  createEyeOption('Soft Pencil Liner', undefined, 'liner'),
  createEyeOption('Tightline', undefined, 'liner'),
  createEyeOption('Colored Liner Blue', undefined, 'liner'),
  createEyeOption('Colored Liner Green', undefined, 'liner'),
  createEyeOption('Colored Liner Purple', undefined, 'liner'),
  createEyeOption('White Liner', undefined, 'liner'),
  createEyeOption('Neon Liner', undefined, 'liner', false),
  createEyeOption('Smokey Liner', undefined, 'liner'),
  createEyeOption('Half Liner', undefined, 'liner'),
  createEyeOption('Inner + Outer Liner', undefined, 'liner'),
  createEyeOption('Ultra Thin Precision', undefined, 'liner'),
]

export const EYE_LASHES: EyeOption[] = [
  createEyeOption('None', 'no false lashes', 'lashes', false),
  createEyeOption('Natural', undefined, 'lashes'),
  createEyeOption('Lengthening', undefined, 'lashes'),
  createEyeOption('Volume', undefined, 'lashes'),
  createEyeOption('Volume Plus Length', undefined, 'lashes'),
  createEyeOption('Dramatic', undefined, 'lashes'),
  createEyeOption('Wispy', undefined, 'lashes'),
  createEyeOption('Cat Eye', undefined, 'lashes'),
  createEyeOption('Mega Volume', undefined, 'lashes'),
]

export function findEyeOption(options: EyeOption[], name?: string) {
  return options.find((option) => option.name === name)
}

function createEyeOption(
  name: string,
  description: string | undefined,
  folder: 'shadow' | 'liner' | 'lashes',
  hasImage = true,
) {
  return {
    name,
    description,
    imagePath: hasImage ? `/eyes/${folder}/${name.replace(/ /g, '_')}.png` : undefined,
  }
}
