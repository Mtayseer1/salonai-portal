export type HighlightOption = {
  name: string
  description: string
  imagePath?: string
}

export const HIGHLIGHT_PLACEMENTS: HighlightOption[] = [
  createHighlightOption('None', 'no highlight placement', 'placement', false),
  createHighlightOption(
    'Cheekbone Highlight',
    'Highlighter placed along the top of the cheekbone, softly blended to catch light naturally.',
    'placement',
  ),
  createHighlightOption(
    'High Cheekbone Highlight',
    'Highlighter placed higher on the cheekbone for a lifted glowing effect.',
    'placement',
  ),
  createHighlightOption(
    'Under Eye Glow',
    'Soft highlighter glow placed lightly under the outer under-eye and upper cheek area without looking shiny or oily.',
    'placement',
  ),
  createHighlightOption(
    'Inner Cheek Glow',
    'Highlighter softly applied toward the inner cheek area near the nose side for a fresh luminous look.',
    'placement',
  ),
  createHighlightOption(
    'Nose Side Highlight',
    'Subtle highlight applied to the visible side of the nose and nearby cheek area without changing nose shape.',
    'placement',
  ),
  createHighlightOption(
    'Nose Bridge Highlight',
    'Soft highlight applied along the visible nose bridge area if present, with a natural narrow glow.',
    'placement',
  ),
  createHighlightOption(
    'Nose Tip Highlight',
    'Small controlled glow on the visible nose tip area if present, subtle and realistic.',
    'placement',
  ),
  createHighlightOption(
    'Temple Glow',
    'Highlighter softly extended toward the temple area for a lifted luminous finish.',
    'placement',
  ),
  createHighlightOption(
    'C Shape Highlight',
    'Highlighter placed in a soft C-shape from upper cheekbone toward the temple area.',
    'placement',
  ),
  createHighlightOption(
    'Lifted Highlight',
    'Highlight swept upward across the cheekbone to create a lifted luminous effect.',
    'placement',
  ),
  createHighlightOption(
    'Soft Face Glow',
    'A gentle glow across the high points of the visible cheek and nose-side area.',
    'placement',
  ),
  createHighlightOption(
    'Editorial Highlight Placement',
    'More artistic highlighter placement across cheekbone and upper cheek, visible but still realistic.',
    'placement',
  ),
]

export const HIGHLIGHT_TONES: HighlightOption[] = [
  createHighlightOption('None', 'no highlight tone', 'tone', false),
  createHighlightOption(
    'Champagne Glow',
    'Classic champagne highlighter tone with soft beige-gold reflection, flattering and natural.',
    'tone',
  ),
  createHighlightOption(
    'Pearl Glow',
    'Soft pearl highlighter tone with light neutral luminous reflection.',
    'tone',
  ),
  createHighlightOption(
    'Ivory Glow',
    'Light ivory highlighter tone with delicate bright reflection suitable for fair skin looks.',
    'tone',
  ),
  createHighlightOption(
    'Vanilla Glow',
    'Warm vanilla highlighter tone with soft creamy brightness.',
    'tone',
  ),
  createHighlightOption(
    'Golden Glow',
    'Warm golden highlighter tone with sunlit reflection and luxury beauty finish.',
    'tone',
  ),
  createHighlightOption(
    'Soft Gold',
    'Subtle soft-gold highlighter tone with gentle warm luminosity.',
    'tone',
  ),
  createHighlightOption(
    'Rose Gold',
    'Rose-gold highlighter tone with soft pink-gold reflective warmth.',
    'tone',
  ),
  createHighlightOption(
    'Pink Pearl',
    'Pink-pearl highlighter tone with delicate cool-pink reflection.',
    'tone',
  ),
  createHighlightOption(
    'Peach Glow',
    'Peach-toned highlighter with warm soft radiance.',
    'tone',
  ),
  createHighlightOption(
    'Bronze Glow',
    'Bronze highlighter tone with warm deeper golden-brown reflection.',
    'tone',
  ),
  createHighlightOption(
    'Copper Glow',
    'Copper highlighter tone with rich warm metallic-orange reflection, blended naturally.',
    'tone',
  ),
  createHighlightOption(
    'Honey Glow',
    'Honey-gold highlighter tone with warm golden radiance.',
    'tone',
  ),
  createHighlightOption(
    'Silver Glow',
    'Cool silver highlighter tone with icy reflection, controlled and not too white.',
    'tone',
  ),
  createHighlightOption(
    'Icy Glow',
    'Very cool icy highlighter tone with bright reflective finish, subtle enough to avoid white streaks.',
    'tone',
  ),
  createHighlightOption(
    'Opal Glow',
    'Opal highlighter tone with soft multidimensional pearl reflection.',
    'tone',
  ),
  createHighlightOption(
    'Lavender Glow',
    'Soft lavender highlighter tone with cool luminous reflection, delicate and wearable.',
    'tone',
  ),
  createHighlightOption(
    'Neutral Glow',
    'Neutral highlighter tone that adds glow without strongly shifting warm or cool.',
    'tone',
  ),
  createHighlightOption(
    'Nude Glow',
    'Nude highlighter tone close to skin color with very natural radiance.',
    'tone',
  ),
]

export const HIGHLIGHT_INTENSITIES: HighlightOption[] = [
  createHighlightOption('None', 'no highlight intensity', 'intensity', false),
  createHighlightOption(
    'Barely There',
    'Extremely subtle highlight intensity, almost invisible, just a small natural light catch.',
    'intensity',
  ),
  createHighlightOption(
    'Very Soft Glow',
    'Very soft glow intensity with delicate reflection and natural skin finish.',
    'intensity',
  ),
  createHighlightOption(
    'Soft Glow',
    'Soft highlighter intensity, visible but natural and wearable.',
    'intensity',
  ),
  createHighlightOption(
    'Medium Glow',
    'Medium highlighter intensity with clear luminous reflection and professional blending.',
    'intensity',
  ),
  createHighlightOption(
    'Buildable Glow',
    'Layered buildable glow intensity with gradual luminosity and smooth transition.',
    'intensity',
  ),
  createHighlightOption(
    'Strong Glow',
    'Strong highlighter intensity with visible shine and glam effect, still blended realistically.',
    'intensity',
  ),
  createHighlightOption(
    'Full Glam Glow',
    'Full glam highlight intensity with high-impact reflection and polished beauty finish.',
    'intensity',
  ),
  createHighlightOption(
    'Wet Look Glow',
    'Wet-look highlighter intensity with glossy hydrated reflection, controlled and not oily.',
    'intensity',
  ),
  createHighlightOption(
    'Glass Glow',
    'Glass-like highlighter intensity with smooth reflective glow and high-end editorial finish.',
    'intensity',
  ),
  createHighlightOption(
    'Editorial Glow',
    'Editorial-level highlighter intensity with dramatic visible shine, fashion beauty style, still realistic.',
    'intensity',
  ),
]

export const HIGHLIGHT_FINISHES: HighlightOption[] = [
  createHighlightOption('None', 'no highlight finish', 'finish', false),
  createHighlightOption(
    'Powder Highlight',
    'Powder highlighter texture with soft diffused shimmer and natural dry finish.',
    'finish',
  ),
  createHighlightOption(
    'Cream Highlight',
    'Cream highlighter texture with smooth skin-like blend and soft luminous finish.',
    'finish',
  ),
  createHighlightOption(
    'Liquid Highlight',
    'Liquid highlighter texture with seamless glow and fluid reflective finish.',
    'finish',
  ),
  createHighlightOption(
    'Balm Highlight',
    'Balm highlighter texture with hydrated glossy skin effect and very smooth blend.',
    'finish',
  ),
  createHighlightOption(
    'Stick Highlight',
    'Stick highlighter effect with controlled placement and creamy reflective finish.',
    'finish',
  ),
  createHighlightOption(
    'Gel Highlight',
    'Gel highlighter finish with transparent wet-looking radiance and lightweight texture.',
    'finish',
  ),
  createHighlightOption(
    'Fine Shimmer Highlight',
    'Fine shimmer finish with tiny refined reflective particles, elegant and not chunky.',
    'finish',
  ),
  createHighlightOption(
    'Micro Glitter Highlight',
    'Very fine micro-glitter highlight finish with visible sparkle, controlled and premium.',
    'finish',
  ),
  createHighlightOption(
    'Metallic Highlight',
    'Metallic highlighter finish with stronger reflective sheen, polished and blended.',
    'finish',
  ),
  createHighlightOption(
    'Dewy Highlight',
    'Dewy highlighter finish with fresh hydrated radiance and no powdery texture.',
    'finish',
  ),
  createHighlightOption(
    'Natural Skin Highlight',
    'Very natural skin-like highlight finish that looks like healthy light reflection, not makeup.',
    'finish',
  ),
  createHighlightOption(
    'Soft Focus Highlight',
    'Soft-focus highlighter finish with diffused glow and smooth light reflection.',
    'finish',
  ),
]

export function findHighlightOption(options: HighlightOption[], name?: string) {
  return options.find((option) => option.name === name)
}

function createHighlightOption(
  name: string,
  description: string,
  folder: 'placement' | 'tone' | 'intensity' | 'finish',
  hasImage = true,
): HighlightOption {
  return {
    name,
    description,
    imagePath: hasImage
      ? `/highlight/${folder}/${name.replace(/ /g, '_')}.png`
      : undefined,
  }
}
