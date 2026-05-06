export type ContourOption = {
  name: string
  description: string
  imagePath?: string
}

export const CONTOUR_TYPES: ContourOption[] = [
  createContourOption('None', 'no contour type', 'type', false),
  createContourOption(
    'Soft Contour',
    'Very soft contour placed lightly under the cheekbone with seamless blending and natural shadow.',
    'type',
  ),
  createContourOption(
    'Natural Contour',
    'Natural everyday contour that gently defines the cheekbone and lower cheek without harsh lines.',
    'type',
  ),
  createContourOption(
    'Defined Contour',
    'Clearly visible contour under the cheekbone with professional blending and realistic face definition.',
    'type',
  ),
  createContourOption(
    'Sculpted Contour',
    'More sculpted contour with stronger cheekbone definition and polished glam structure.',
    'type',
  ),
  createContourOption(
    'Full Glam Contour',
    'High-glam contour with strong cheekbone, jawline, and side-of-face definition while remaining blended.',
    'type',
  ),
  createContourOption(
    'Cheekbone Contour',
    'Contour focused directly under the cheekbone to create a lifted cheekbone shadow.',
    'type',
  ),
  createContourOption(
    'High Cheekbone Contour',
    'Contour placed slightly higher under the cheekbone for a lifted modern makeup effect.',
    'type',
  ),
  createContourOption(
    'Low Cheek Contour',
    'Contour placed slightly lower on the cheek to create stronger face sculpting and depth.',
    'type',
  ),
  createContourOption(
    'Jawline Contour',
    'Contour focused along the jawline and lower face edge to create subtle definition.',
    'type',
  ),
  createContourOption(
    'Temple Contour',
    'Contour softly applied near the temple and outer face area for natural framing and warmth.',
    'type',
  ),
  createContourOption(
    'Side Face Contour',
    'Contour applied along the outer side of the face to add soft dimension and depth.',
    'type',
  ),
  createContourOption(
    'Lifted Contour',
    'Contour swept upward toward the temple for a lifted and elongated cheek appearance.',
    'type',
  ),
  createContourOption(
    'Diagonal Contour',
    'Diagonal contour placement under the cheekbone, blended upward for a structured sculpted look.',
    'type',
  ),
  createContourOption(
    'Soft Sculpt',
    'Soft sculpting contour with gentle shadow, polished blending, and natural beauty finish.',
    'type',
  ),
  createContourOption(
    'Sharp Sculpt',
    'Sharper contour placement with stronger definition, still blended and realistic.',
    'type',
  ),
  createContourOption(
    'Cream Contour',
    'Cream contour effect with smooth skin-like blending and natural shadow transition.',
    'type',
  ),
  createContourOption(
    'Powder Contour',
    'Powder contour effect with matte soft shadow and diffused edges.',
    'type',
  ),
  createContourOption(
    'Liquid Contour',
    'Liquid contour effect with seamless blend and skin-like depth under the cheekbone.',
    'type',
  ),
  createContourOption(
    'Subtle Nose Side Contour',
    'Very subtle contour near the visible side of the nose if present, without changing nose shape.',
    'type',
  ),
  createContourOption(
    'Full Face Sculpt',
    'Coordinated contour effect on cheekbone, jawline, temple, and side of face, blended naturally.',
    'type',
  ),
]

export const BRONZER_TONES: ContourOption[] = [
  createContourOption('None', 'no bronzer tone', 'tone', false),
  createContourOption(
    'Soft Warm Bronze',
    'Soft warm bronzer tone that adds gentle warmth to the cheek and side of face without orange color.',
    'tone',
  ),
  createContourOption(
    'Golden Bronze',
    'Golden bronze tone with warm sunlit warmth and natural golden-brown color.',
    'tone',
  ),
  createContourOption(
    'Neutral Bronze',
    'Neutral bronze tone balanced between warm and cool, suitable for natural cheek definition.',
    'tone',
  ),
  createContourOption(
    'Caramel Bronze',
    'Caramel bronze shade with warm medium-brown tone and soft blended warmth.',
    'tone',
  ),
  createContourOption(
    'Honey Bronze',
    'Honey bronze tone with golden warmth and a fresh summer complexion effect.',
    'tone',
  ),
  createContourOption(
    'Terracotta Bronze',
    'Terracotta bronze tone with earthy warm orange-brown depth, blended naturally.',
    'tone',
  ),
  createContourOption(
    'Mocha Bronze',
    'Mocha bronze tone with rich brown warmth and smooth cheek definition.',
    'tone',
  ),
  createContourOption(
    'Cocoa Bronze',
    'Cocoa bronze shade with deeper brown warmth and refined natural sculpting.',
    'tone',
  ),
  createContourOption(
    'Sun-Kissed Bronze',
    'Sun-kissed bronzer effect with natural warmth across the cheekbone and side of face.',
    'tone',
  ),
  createContourOption(
    'Beach Bronze',
    'Soft beachy bronze tone with warm vacation-like glow and natural blending.',
    'tone',
  ),
  createContourOption(
    'Warm Brown Contour',
    'Warm brown contour shade with visible warmth and soft sculpting effect.',
    'tone',
  ),
  createContourOption(
    'Neutral Brown Contour',
    'Neutral brown contour shade that creates realistic shadow and natural dimension.',
    'tone',
  ),
  createContourOption(
    'Cool Taupe Contour',
    'Cool taupe contour shade that mimics natural facial shadow without warmth or orange tones.',
    'tone',
  ),
  createContourOption(
    'Ash Brown Contour',
    'Ash-brown contour tone with cool sculpting shadow and realistic depth.',
    'tone',
  ),
  createContourOption(
    'Deep Brown Contour',
    'Deep brown contour tone for stronger definition and sculpted glam depth.',
    'tone',
  ),
  createContourOption(
    'Soft Beige Contour',
    'Soft beige-brown contour shade with very natural subtle sculpting.',
    'tone',
  ),
  createContourOption(
    'Olive Brown Contour',
    'Olive-brown contour tone with muted earthy depth and natural shadow effect.',
    'tone',
  ),
  createContourOption(
    'Rosy Bronze',
    'Rosy bronze tone combining soft bronze warmth with a subtle rose-brown undertone.',
    'tone',
  ),
  createContourOption(
    'Nude Bronze',
    'Neutral nude bronze shade with very soft warmth and understated definition.',
    'tone',
  ),
  createContourOption(
    'Luxury Warm Bronze',
    'High-end warm bronze tone with refined brown-gold warmth and polished salon finish.',
    'tone',
  ),
]

export const CONTOUR_INTENSITIES: ContourOption[] = [
  createContourOption('None', 'no contour or bronzer intensity', 'intensity', false),
  createContourOption(
    'Barely There',
    'Extremely subtle contour or bronzer intensity, almost invisible, only a gentle hint of dimension.',
    'intensity',
  ),
  createContourOption(
    'Very Soft',
    'Very soft intensity with delicate shadow and warmth, suitable for natural makeup.',
    'intensity',
  ),
  createContourOption(
    'Soft',
    'Soft contour intensity, visible enough to define the cheek but still natural and understated.',
    'intensity',
  ),
  createContourOption(
    'Medium',
    'Medium contour intensity with clear cheek definition and professional blending.',
    'intensity',
  ),
  createContourOption(
    'Buildable',
    'Layered buildable intensity with gradual color depth and smooth transition.',
    'intensity',
  ),
  createContourOption(
    'Defined',
    'Defined contour intensity with noticeable sculpting and stronger cheekbone shadow.',
    'intensity',
  ),
  createContourOption(
    'Strong',
    'Strong contour intensity with bold sculpting effect, blended cleanly and realistically.',
    'intensity',
  ),
  createContourOption(
    'Full Glam',
    'Full glam contour intensity with high-impact cheekbone definition and polished beauty finish.',
    'intensity',
  ),
  createContourOption(
    'Editorial Sculpt',
    'Editorial-level contour intensity with dramatic shadow and fashion beauty structure, still realistic.',
    'intensity',
  ),
  createContourOption(
    'Stage Glam',
    'Very strong stage-glam contour intensity designed to be highly visible while preserving realistic skin texture.',
    'intensity',
  ),
]

export function findContourOption(options: ContourOption[], name?: string) {
  return options.find((option) => option.name === name)
}

function createContourOption(
  name: string,
  description: string,
  folder: 'type' | 'tone' | 'intensity',
  hasImage = true,
): ContourOption {
  return {
    name,
    description,
    imagePath: hasImage
      ? `/contour/${folder}/${name.replace(/ /g, '_')}.png`
      : undefined,
  }
}
