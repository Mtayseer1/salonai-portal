export type BlushOption = {
  name: string
  description: string
  imagePath?: string
}

export const BLUSH_COLORS: BlushOption[] = [
  createBlushOption('None', 'no blush color', 'color', false),
  createBlushOption(
    'Soft Pink',
    'Soft pink blush color with a fresh natural cheek tint, gently blended and wearable.',
    'color',
  ),
  createBlushOption(
    'Baby Pink',
    'Light baby pink blush with a delicate fresh tone, soft and youthful.',
    'color',
  ),
  createBlushOption(
    'Rose Pink',
    'Elegant rose-pink blush with a natural flushed cheek effect.',
    'color',
  ),
  createBlushOption(
    'Dusty Rose',
    'Muted dusty rose blush with a soft sophisticated tone, not too bright.',
    'color',
  ),
  createBlushOption(
    'Rosy',
    'Classic rosy blush color that gives the cheek a healthy natural flush.',
    'color',
  ),
  createBlushOption(
    'Peach',
    'Warm peach blush with a soft fresh glow, suitable for natural makeup.',
    'color',
  ),
  createBlushOption(
    'Soft Peach',
    'Very light peach blush with subtle warmth and gentle blending.',
    'color',
  ),
  createBlushOption(
    'Warm Peach',
    'Warm peach blush with visible warmth and fresh summer softness.',
    'color',
  ),
  createBlushOption(
    'Coral',
    'Coral blush with a warm vibrant cheek tone, polished and fresh.',
    'color',
  ),
  createBlushOption(
    'Soft Coral',
    'Soft coral blush with a gentle warm pink-orange tone.',
    'color',
  ),
  createBlushOption(
    'Apricot',
    'Apricot blush with soft orange-peach warmth and natural blending.',
    'color',
  ),
  createBlushOption(
    'Terracotta',
    'Terracotta blush with warm earthy orange-brown tone, elegant and modern.',
    'color',
  ),
  createBlushOption(
    'Nude Blush',
    'Neutral nude blush with very subtle cheek warmth and minimal color.',
    'color',
  ),
  createBlushOption(
    'Beige Blush',
    'Soft beige blush with natural muted warmth, very wearable and subtle.',
    'color',
  ),
  createBlushOption(
    'Warm Brown',
    'Warm brown blush with soft bronzed cheek color, natural and sculpting.',
    'color',
  ),
  createBlushOption(
    'Bronze Rose',
    'Bronze rose blush with warm rosy-brown tone and refined elegance.',
    'color',
  ),
  createBlushOption(
    'Berry',
    'Berry blush with rich pink-purple cheek tint, blended softly and realistically.',
    'color',
  ),
  createBlushOption(
    'Soft Berry',
    'Soft berry blush with muted berry tone, fresh but not overpowering.',
    'color',
  ),
  createBlushOption(
    'Mauve',
    'Mauve blush with muted pink-purple tone, elegant and cool-toned.',
    'color',
  ),
  createBlushOption(
    'Plum',
    'Plum blush with deeper purple-rose tone, dramatic but blended naturally.',
    'color',
  ),
  createBlushOption(
    'Red Flush',
    'Natural red flushed blush color, like a real healthy cheek flush.',
    'color',
  ),
  createBlushOption(
    'Watermelon',
    'Watermelon pink-red blush with fresh juicy brightness, softly blended.',
    'color',
  ),
  createBlushOption(
    'Sunset Orange',
    'Warm sunset-orange blush with vibrant golden-orange cheek warmth.',
    'color',
  ),
  createBlushOption(
    'Golden Peach',
    'Golden peach blush with warm peach tone and subtle golden warmth.',
    'color',
  ),
  createBlushOption(
    'Cool Pink',
    'Cool-toned pink blush with fresh blue-pink undertone and soft blending.',
    'color',
  ),
]

export const BLUSH_STYLES: BlushOption[] = [
  createBlushOption('None', 'no blush placement style', 'style', false),
  createBlushOption(
    'Natural Cheek',
    'Classic blush placement on the apples of the cheeks, softly blended outward.',
    'style',
  ),
  createBlushOption(
    'Apple Cheek',
    'Blush focused on the round apples of the cheeks for a youthful fresh look.',
    'style',
  ),
  createBlushOption(
    'High Placement',
    'Blush placed high on the cheekbones for a lifted face effect.',
    'style',
  ),
  createBlushOption(
    'Lifted Blush',
    'Blush swept upward toward the temples to visually lift the cheek area.',
    'style',
  ),
  createBlushOption(
    'Draped Blush',
    'Blush draped from cheekbone toward the temple with a fashion beauty style.',
    'style',
  ),
  createBlushOption(
    'Sun-Kissed',
    'Blush placed across the upper cheeks and slightly toward the nose, like natural sun-kissed warmth.',
    'style',
  ),
  createBlushOption(
    'Nose Blush',
    'Blush softly extended over the bridge and sides of the nose for a cute sun-flushed effect.',
    'style',
  ),
  createBlushOption(
    'Under-Eye Blush',
    'Blush placed slightly higher under the eyes for a soft youthful Korean-inspired effect.',
    'style',
  ),
  createBlushOption(
    'Korean Soft Blush',
    'Very soft diffused blush placed gently under the eyes and upper cheeks, pastel and natural.',
    'style',
  ),
  createBlushOption(
    'Japanese Igari Blush',
    'Soft flushed blush placed high under the eyes and across the cheek area, cute and diffused.',
    'style',
  ),
  createBlushOption(
    'Soft Diffused',
    'Blush with very diffused edges and seamless blending into the skin.',
    'style',
  ),
  createBlushOption(
    'Round Blush',
    'Rounded blush shape centered on the cheek with soft circular blending.',
    'style',
  ),
  createBlushOption(
    'Diagonal Blush',
    'Blush applied diagonally upward along the cheekbone for structure and lift.',
    'style',
  ),
  createBlushOption(
    'Temple Blush',
    'Blush extended toward the temples for a modern editorial cheek effect.',
    'style',
  ),
  createBlushOption(
    'Cheekbone Blush',
    'Blush placed along the cheekbone rather than the cheek apple, creating a sculpted soft color effect.',
    'style',
  ),
  createBlushOption(
    'Center Face Blush',
    'Blush placed closer to the center of the face for a fresh youthful look.',
    'style',
  ),
  createBlushOption(
    'Soft Glam Blush',
    'Balanced blush placement suitable for soft glam makeup, blended into the cheekbone.',
    'style',
  ),
  createBlushOption(
    'Editorial Blush',
    'Fashion-forward blush placement with visible artistic cheek color while still realistic.',
    'style',
  ),
]

export const BLUSH_INTENSITIES: BlushOption[] = [
  createBlushOption('None', 'no blush intensity', 'intensity', false),
  createBlushOption(
    'Very Sheer',
    'Extremely light blush intensity, barely visible, just a soft healthy tint.',
    'intensity',
  ),
  createBlushOption(
    'Sheer',
    'Light sheer blush intensity with subtle natural cheek color.',
    'intensity',
  ),
  createBlushOption(
    'Soft',
    'Soft blush intensity, visible but delicate and natural.',
    'intensity',
  ),
  createBlushOption(
    'Medium',
    'Medium blush intensity, clearly visible and professionally blended.',
    'intensity',
  ),
  createBlushOption(
    'Buildable',
    'Layered buildable blush intensity with smooth gradual color.',
    'intensity',
  ),
  createBlushOption(
    'Bold',
    'Bold blush intensity with strong cheek color, blended cleanly and fashionably.',
    'intensity',
  ),
  createBlushOption(
    'Heavy',
    'Heavy blush intensity with dramatic visible color, still polished and controlled.',
    'intensity',
  ),
  createBlushOption(
    'Statement',
    'Statement blush intensity for editorial beauty, strong color impact but realistic skin texture.',
    'intensity',
  ),
]

export function findBlushOption(options: BlushOption[], name?: string) {
  return options.find((option) => option.name === name)
}

function createBlushOption(
  name: string,
  description: string,
  folder: 'color' | 'style' | 'intensity',
  hasImage = true,
): BlushOption {
  return {
    name,
    description,
    imagePath: hasImage ? `/blush/${folder}/${name.replace(/ /g, '_')}.png` : undefined,
  }
}
