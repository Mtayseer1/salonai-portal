export type BrowOption = {
  name: string
  description: string
  imagePath?: string
}

export const BROW_OPTIONS: BrowOption[] = [
  createBrowOption('None', 'no brow styling', false),
  createBrowOption('Natural Brows', 'Soft natural eyebrows with minimal grooming.'),
  createBrowOption('Natural Untouched Brows', 'Almost no makeup, natural unevenness.'),
  createBrowOption('Clean Groomed Brows', 'Neatly groomed with slight cleaning.'),
  createBrowOption('Soft Fill Brows', 'Light fill, soft edges.'),
  createBrowOption('Medium Fill Brows', 'Balanced density and color.'),
  createBrowOption('Full Fill Brows', 'Strong fill, fuller look.'),
  createBrowOption('Defined Brows', 'Clean defined shape.'),
  createBrowOption('Light Defined Brows', 'Subtle shaping.'),
  createBrowOption('Sharp Defined Brows', 'Precise outline.'),
  createBrowOption('Sculpted Brows', 'Polished salon look.'),
  createBrowOption('Clean Sculpted Brows', 'Refined edges, clean structure.'),
  createBrowOption('Soft Glam Brows', 'Soft glam balance.'),
  createBrowOption('Full Glam Brows', 'Bold glam brows.'),
  createBrowOption('Bold Brows', 'Strong dark brows.'),
  createBrowOption('Soft Bold Brows', 'Bold but softened.'),
  createBrowOption('Feathered Brows', 'Upward brushed hairs.'),
  createBrowOption('Soft Feathered Brows', 'Subtle feathering.'),
  createBrowOption('Strong Feathered Brows', 'Dramatic lifted hairs.'),
  createBrowOption('Fluffy Brows', 'Airy full brows.'),
  createBrowOption('Laminated Brows', 'Glossy lifted brows.'),
  createBrowOption('Soft Laminated Brows', 'Light lamination.'),
  createBrowOption('Lifted Brows', 'Lifted eye effect.'),
  createBrowOption('Straight Brows', 'Minimal arch.'),
  createBrowOption('Straight Korean Brows', 'Soft straight Korean style.'),
  createBrowOption('Soft Arch Brows', 'Gentle curve.'),
  createBrowOption('Medium Arch Brows', 'Balanced arch.'),
  createBrowOption('High Arch Brows', 'Elegant high arch.'),
  createBrowOption('Rounded Arch Brows', 'Smooth curved arch.'),
  createBrowOption('Angled Brows', 'Sharp angled shape.'),
  createBrowOption('Soft Angled Brows', 'Soft angled shape.'),
  createBrowOption('Thin Brows', 'Slim brows.'),
  createBrowOption('Soft Thin Brows', 'Delicate thin brows.'),
  createBrowOption('Thick Brows', 'Dense brows.'),
  createBrowOption('Bushy Brows', 'Full natural brows.'),
  createBrowOption('Tamed Bushy Brows', 'Controlled bushy look.'),
  createBrowOption('Sparse Natural Brows', 'Visible gaps.'),
  createBrowOption('Sparse Filled Brows', 'Light gap filling.'),
  createBrowOption('Hair Stroke Brows', 'Fine hair strokes.'),
  createBrowOption('Microbladed Brows', 'Microblading effect.'),
  createBrowOption('Powder Brows', 'Soft powder finish.'),
  createBrowOption('Ombre Brows', 'Gradient brows.'),
  createBrowOption('Gradient Brows', 'Light to dark transition.'),
  createBrowOption('Pencil Brows', 'Defined pencil look.'),
  createBrowOption('Pomade Brows', 'Bold structured fill.'),
  createBrowOption('Tinted Brows', 'Subtle color tint.'),
  createBrowOption('Bleached Brows', 'Lightened brows.'),
  createBrowOption('Light Brown Brows', 'Light brown tone.'),
  createBrowOption('Medium Brown Brows', 'Balanced brown.'),
  createBrowOption('Dark Brown Brows', 'Dark tone.'),
  createBrowOption('Black Brows', 'Strong black brows.'),
  createBrowOption('Ash Brown Brows', 'Cool tone.'),
  createBrowOption('Warm Brown Brows', 'Warm tone.'),
]

export function findBrowOption(name?: string) {
  return BROW_OPTIONS.find((option) => option.name === name)
}

function createBrowOption(
  name: string,
  description: string,
  hasImage = true,
): BrowOption {
  return {
    name,
    description,
    imagePath: hasImage ? `/brows/${name.replace(/ /g, '_')}.png` : undefined,
  }
}
