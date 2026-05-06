export type LipOption = {
  id: string
  name: string
  description: string
  imagePath?: string
}

export const LIP_FINISHES: LipOption[] = [
  createLipOption('None', 'no lip finish', 'finish', false),
  createLipOption('Matte', 'no shine', 'finish'),
  createLipOption('Velvet Matte', 'soft matte', 'finish'),
  createLipOption('Satin', 'soft shine', 'finish'),
  createLipOption('Gloss', 'reflective', 'finish'),
  createLipOption('High Shine', 'very glossy', 'finish'),
  createLipOption('Lip Oil', 'wet look', 'finish'),
  createLipOption('Metallic', 'metal finish', 'finish'),
  createLipOption('Shimmer', 'sparkle', 'finish'),
  createLipOption('Tint', 'light stain', 'finish'),
  createLipOption('Vinyl', 'glass shine', 'finish'),
]

export const LIP_STYLES: LipOption[] = [
  createLipOption('None', 'no lip styling', 'style', false),
  createLipOption('Natural', 'normal lips', 'style'),
  createLipOption('Overlined', 'bigger outline', 'style'),
  createLipOption('Sharp Defined', 'clean edges', 'style'),
  createLipOption('Soft Blurred', 'blur edges', 'style'),
  createLipOption('Gradient', 'center fade', 'style'),
  createLipOption('Ombre', 'dark edges', 'style'),
]

export const LIP_COLORS: LipOption[] = [
  createLipOption('None', 'no lip color', 'color', false),
  createLipOption('Nude Porcelain', 'very light nude', 'color'),
  createLipOption('Nude Ivory', 'light neutral nude', 'color'),
  createLipOption('Nude Beige', 'classic nude', 'color'),
  createLipOption('Nude Sand', 'warm nude', 'color'),
  createLipOption('Nude Caramel', 'deep nude', 'color'),
  createLipOption('Nude Mocha', 'brown nude', 'color'),
  createLipOption('Baby Pink', 'soft pastel pink', 'color'),
  createLipOption('Blush Pink', 'natural pink', 'color'),
  createLipOption('Rose Pink', 'elegant pink', 'color'),
  createLipOption('Dusty Pink', 'muted pink', 'color'),
  createLipOption('Hot Pink', 'bright pink', 'color'),
  createLipOption('Fuchsia', 'intense pink', 'color'),
  createLipOption('Cherry Red', 'bright red', 'color'),
  createLipOption('Classic Red', 'true red', 'color'),
  createLipOption('Blue Red', 'cool red', 'color'),
  createLipOption('Orange Red', 'warm red', 'color'),
  createLipOption('Crimson', 'deep red', 'color'),
  createLipOption('Burgundy', 'dark red', 'color'),
  createLipOption('Berry', 'rich berry', 'color'),
  createLipOption('Raspberry', 'bright berry', 'color'),
  createLipOption('Wine', 'dark wine', 'color'),
  createLipOption('Plum', 'plum tone', 'color'),
  createLipOption('Deep Plum', 'very dark plum', 'color'),
  createLipOption('Taupe', 'cool brown', 'color'),
  createLipOption('Latte', 'light brown', 'color'),
  createLipOption('Cocoa', 'mid brown', 'color'),
  createLipOption('Chocolate', 'dark brown', 'color'),
  createLipOption('Espresso', 'very dark brown', 'color'),
  createLipOption('Peach', 'soft peach', 'color'),
  createLipOption('Apricot', 'warm peach', 'color'),
  createLipOption('Coral', 'coral tone', 'color'),
  createLipOption('Sunset Coral', 'strong coral', 'color'),
  createLipOption('Clear', 'transparent gloss', 'color'),
  createLipOption('Black', 'black lips', 'color'),
  createLipOption('Gold', 'gold metallic', 'color'),
  createLipOption('Silver', 'silver metallic', 'color'),
  createLipOption('Purple Neon', 'bright purple', 'color'),
  createLipOption('Blue', 'blue lips', 'color'),
]

export function findLipOption(options: LipOption[], id?: string) {
  return options.find((option) => option.id === id)
}

export function getSelectedLipPrompt(options: {
  finishId?: string
  styleId?: string
  colorId?: string
}) {
  const finish = findLipOption(LIP_FINISHES, options.finishId)
  const style = findLipOption(LIP_STYLES, options.styleId)
  const color = findLipOption(LIP_COLORS, options.colorId)

  return {
    finish,
    style,
    color,
    prompt: [finish, style, color]
      .filter(Boolean)
      .map((option) => `${option?.name}: ${option?.description}`)
      .join(', '),
  }
}

function createLipOption(
  name: string,
  description: string,
  folder: 'color' | 'finish' | 'style',
  hasImage = true,
) {
  const id = name.replace(/ /g, '_')

  return {
    id,
    name,
    description,
    imagePath: hasImage ? `/lips/${folder}/${id}.png` : undefined,
  }
}
