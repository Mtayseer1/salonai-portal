export type MenHairCategoryId =
  | 'business'
  | 'classic'
  | 'fade'
  | 'long'
  | 'medium'
  | 'slick'
  | 'volume'
  | 'curly'
  | 'fringe'
  | 'modern'
  | 'afro'
  | 'braids'
  | 'mature'

export type MenHairCategory = {
  id: MenHairCategoryId
  label: string
}

export type MenHairOption = {
  categoryId: MenHairCategoryId
  categoryLabel: string
  name: string
  description: string
  imagePath: string
}

export const MEN_HAIR_CATEGORIES: MenHairCategory[] = [
  { id: 'business', label: 'Business Styles' },
  { id: 'classic', label: 'Classic Short Cuts' },
  { id: 'fade', label: 'Fade Styles' },
  { id: 'long', label: 'Long Hair' },
  { id: 'medium', label: 'Medium Length' },
  { id: 'slick', label: 'Slick Back' },
  { id: 'volume', label: 'Volume' },
  { id: 'curly', label: 'Curly & Wavy' },
  { id: 'fringe', label: 'Fringe' },
  { id: 'modern', label: 'Modern Edgy' },
  { id: 'afro', label: 'Afro / Coily' },
  { id: 'braids', label: 'Braids & Locs' },
  { id: 'mature', label: 'Mature / Receding' },
]

const RAW_MEN_HAIR_OPTIONS = [
  ['classic', 'Classic Short Cuts', 'Buzz Cut', 'Very short even haircut all over the head with clean masculine finish and natural hairline.'],
  ['classic', 'Classic Short Cuts', 'Crew Cut', 'Short classic haircut with slightly longer hair on top and shorter sides, neat and masculine.'],
  ['classic', 'Classic Short Cuts', 'Ivy League', 'Polished short haircut with enough length on top for a neat side part and refined finish.'],
  ['classic', 'Classic Short Cuts', 'Caesar Cut', 'Short haircut with a small straight fringe across the forehead and clean masculine texture.'],
  ['classic', 'Classic Short Cuts', 'French Crop', 'Short textured crop with a defined forward fringe and clean sides.'],
  ['classic', 'Classic Short Cuts', 'Textured Crop', 'Short modern crop with choppy texture on top and neat sides.'],
  ['classic', 'Classic Short Cuts', 'High and Tight', 'Military-inspired haircut with very short sides and a slightly longer top.'],
  ['classic', 'Classic Short Cuts', 'Butch Cut', 'Uniform short haircut slightly longer than a buzz cut with simple masculine shape.'],
  ['classic', 'Classic Short Cuts', 'Flat Top', 'Short sides with top hair shaped flat and squared, clean and structured.'],
  ['classic', 'Classic Short Cuts', 'Short Taper Cut', 'Clean short haircut with gradually tapered sides and neckline while keeping natural top length.'],
  ['fade', 'Fade Styles', 'Low Fade', 'Hair gradually fades low around the ears and neckline while keeping natural length on top.'],
  ['fade', 'Fade Styles', 'Mid Fade', 'Balanced fade starting around the middle of the sides for a modern clean look.'],
  ['fade', 'Fade Styles', 'High Fade', 'Fade starts high on the sides for a sharp bold appearance.'],
  ['fade', 'Fade Styles', 'Skin Fade', 'Sides fade down to the skin with a clean sharp transition and natural top.'],
  ['fade', 'Fade Styles', 'Low Skin Fade', 'Subtle skin fade starting low near the ears with clean barber finish.'],
  ['fade', 'Fade Styles', 'Mid Skin Fade', 'Skin fade starting around the middle of the sides with balanced contrast.'],
  ['fade', 'Fade Styles', 'High Skin Fade', 'Strong skin fade starting high on the sides with bold clean contrast.'],
  ['fade', 'Fade Styles', 'Drop Fade', 'Fade curves downward behind the ear following the natural head shape.'],
  ['fade', 'Fade Styles', 'Burst Fade', 'Rounded fade around the ear, often paired with textured or mohawk-inspired top.'],
  ['fade', 'Fade Styles', 'Temple Fade', 'Fade focused around the temples with clean side edges and natural top.'],
  ['fade', 'Fade Styles', 'Taper Fade', 'Gradual fade around sideburns and neckline while keeping natural side length.'],
  ['fade', 'Fade Styles', 'Low Taper Fade', 'Subtle taper fade around the temples and neckline with clean natural finish.'],
  ['fade', 'Fade Styles', 'Mid Taper Fade', 'Balanced taper fade with clean side transition and natural top volume.'],
  ['fade', 'Fade Styles', 'High Taper Fade', 'More visible taper fade placed higher on the sides with clean edges.'],
  ['fade', 'Fade Styles', 'Bald Fade', 'Very clean fade down to bald skin on the sides with sharp barber transition.'],
  ['fade', 'Fade Styles', 'Shadow Fade', 'Soft fade that keeps some darkness and does not go fully skin-bald.'],
  ['business', 'Business Styles', 'Classic Side Part', 'Traditional side-part haircut with clean combed styling and professional finish.'],
  ['business', 'Business Styles', 'Modern Side Part', 'Updated side part with cleaner sides and more natural volume on top.'],
  ['business', 'Business Styles', 'Hard Part', 'Side part hairstyle with a shaved razor line for sharp definition.'],
  ['business', 'Business Styles', 'Business Cut', 'Professional neat haircut with controlled length and clean styling.'],
  ['business', 'Business Styles', 'Executive Cut', 'Polished office-ready haircut with side part and refined finish.'],
  ['business', 'Business Styles', 'Gentleman Cut', 'Elegant classic haircut with smooth styling and clean sides.'],
  ['business', 'Business Styles', 'Comb Over', 'Hair combed to one side with a smooth professional finish.'],
  ['business', 'Business Styles', 'Comb Over Fade', 'Side-combed top paired with faded sides for modern professional look.'],
  ['business', 'Business Styles', 'Side Swept', 'Top hair swept naturally to one side with soft volume and movement.'],
  ['business', 'Business Styles', 'Short Side Part Fade', 'Short side-part hairstyle combined with a clean fade.'],
  ['volume', 'Volume Styles', 'Pompadour', 'Voluminous front hair swept upward and backward with clean sides.'],
  ['volume', 'Volume Styles', 'Modern Pompadour', 'Contemporary pompadour with textured volume and faded sides.'],
  ['volume', 'Volume Styles', 'Classic Pompadour', 'Smooth vintage pompadour with controlled shine and height.'],
  ['volume', 'Volume Styles', 'Short Pompadour', 'Smaller pompadour with moderate height and neat finish.'],
  ['volume', 'Volume Styles', 'Quiff', 'Front hair styled upward and slightly back with natural volume.'],
  ['volume', 'Volume Styles', 'Textured Quiff', 'Quiff with messy texture and movement on top.'],
  ['volume', 'Volume Styles', 'Short Quiff', 'Shorter version of quiff with clean everyday styling.'],
  ['volume', 'Volume Styles', 'Messy Quiff', 'Relaxed quiff with loose textured volume and natural movement.'],
  ['volume', 'Volume Styles', 'Side Quiff', 'Quiff styled slightly to one side for a modern look.'],
  ['volume', 'Volume Styles', 'Volume Top', 'Haircut focused on height and fullness on top with cleaner sides.'],
  ['slick', 'Slick Back Styles', 'Slick Back', 'Hair combed backward smoothly with a polished masculine finish.'],
  ['slick', 'Slick Back Styles', 'Slick Back Fade', 'Slicked-back top paired with faded sides.'],
  ['slick', 'Slick Back Styles', 'Classic Slick Back', 'Traditional smooth slick-back hairstyle with controlled shine.'],
  ['slick', 'Slick Back Styles', 'Textured Slick Back', 'Slicked-back shape with more natural texture and movement.'],
  ['slick', 'Slick Back Styles', 'Wet Look Slick Back', 'Glossy wet-look slicked-back hairstyle with realistic shine.'],
  ['slick', 'Slick Back Styles', 'Brush Back', 'Hair brushed backward naturally without heavy shine.'],
  ['slick', 'Slick Back Styles', 'Short Brush Back', 'Short neat brush-back style for everyday wear.'],
  ['slick', 'Slick Back Styles', 'Disconnected Slick Back', 'Slicked-back top with strong contrast from shorter sides.'],
  ['medium', 'Medium Length Styles', 'Medium Layered Hair', 'Medium-length hair with natural layers and movement.'],
  ['medium', 'Medium Length Styles', 'Medium Flow', 'Medium-length hair flowing naturally backward or to the sides.'],
  ['medium', 'Medium Length Styles', 'Bro Flow', 'Relaxed medium hairstyle swept back with natural movement.'],
  ['medium', 'Medium Length Styles', 'Curtains', 'Medium hair parted in the center with curtain-like front sections.'],
  ['medium', 'Medium Length Styles', 'Middle Part', 'Hair parted down the center with balanced sides and natural shape.'],
  ['medium', 'Medium Length Styles', 'Side Part Medium', 'Medium-length hair with a soft side part and natural movement.'],
  ['medium', 'Medium Length Styles', 'Surfer Hair', 'Relaxed medium hair with beachy texture and casual flow.'],
  ['medium', 'Medium Length Styles', 'Layered Side Sweep', 'Medium hair with layers swept to one side.'],
  ['medium', 'Medium Length Styles', 'Medium Messy Hair', 'Medium-length hair with loose messy texture.'],
  ['medium', 'Medium Length Styles', 'Textured Medium Cut', 'Medium haircut with layered texture and natural shape.'],
  ['long', 'Long Hair Styles', 'Long Layered Hair', 'Long male hairstyle with layers and natural movement.'],
  ['long', 'Long Hair Styles', 'Shoulder Length Hair', 'Hair reaching around the shoulders with natural flow.'],
  ['long', 'Long Hair Styles', 'Long Flow', 'Long hair flowing naturally backward with soft movement.'],
  ['long', 'Long Hair Styles', 'Man Bun', 'Long hair tied into a bun at the back or crown.'],
  ['long', 'Long Hair Styles', 'Top Knot', 'Hair tied into a small knot on top with shorter or cleaner sides.'],
  ['long', 'Long Hair Styles', 'Half Up Man Bun', 'Long hair partly tied back while some hair remains down.'],
  ['long', 'Long Hair Styles', 'Long Middle Part', 'Long hair parted in the center with balanced flow.'],
  ['long', 'Long Hair Styles', 'Long Side Part', 'Long hair with a side part and natural sweeping movement.'],
  ['long', 'Long Hair Styles', 'Long Wavy Hair', 'Long hair with natural waves and relaxed texture.'],
  ['long', 'Long Hair Styles', 'Long Slick Back', 'Long hair combed back smoothly with controlled shape.'],
  ['curly', 'Curly And Wavy Hair', 'Short Curly Hair', 'Short haircut that keeps natural curls defined and controlled.'],
  ['curly', 'Curly And Wavy Hair', 'Curly Top Fade', 'Curly hair on top with clean faded sides.'],
  ['curly', 'Curly And Wavy Hair', 'Curly Fringe', 'Curly hair styled forward with curls falling near the forehead.'],
  ['curly', 'Curly And Wavy Hair', 'Medium Curly Hair', 'Medium-length curly hair with natural volume and definition.'],
  ['curly', 'Curly And Wavy Hair', 'Long Curly Hair', 'Long curly hairstyle with natural curl pattern and movement.'],
  ['curly', 'Curly And Wavy Hair', 'Wavy Crop', 'Short crop with natural wave texture.'],
  ['curly', 'Curly And Wavy Hair', 'Wavy Side Part', 'Wavy hair styled with a clean side part.'],
  ['curly', 'Curly And Wavy Hair', 'Wavy Slick Back', 'Wavy hair brushed back while keeping natural wave texture.'],
  ['curly', 'Curly And Wavy Hair', 'Textured Waves', 'Wavy textured hairstyle with relaxed movement.'],
  ['curly', 'Curly And Wavy Hair', 'Messy Waves', 'Loose messy wavy hair with casual styling.'],
  ['fringe', 'Fringe Styles', 'Textured Fringe', 'Forward fringe with choppy texture and natural movement.'],
  ['fringe', 'Fringe Styles', 'Short Fringe', 'Short front fringe with clean simple styling.'],
  ['fringe', 'Fringe Styles', 'Long Fringe', 'Longer fringe falling forward for a modern look.'],
  ['fringe', 'Fringe Styles', 'Angular Fringe', 'Fringe cut at an angle across the forehead.'],
  ['fringe', 'Fringe Styles', 'Side Swept Fringe', 'Fringe swept to one side with soft texture.'],
  ['fringe', 'Fringe Styles', 'Messy Fringe', 'Loose messy fringe with casual textured finish.'],
  ['fringe', 'Fringe Styles', 'French Crop Fringe', 'Short textured crop with defined forward fringe.'],
  ['fringe', 'Fringe Styles', 'Curly Fringe Style', 'Curly fringe falling naturally toward the forehead.'],
  ['modern', 'Modern Edgy Styles', 'Undercut', 'Short or shaved sides with longer hair on top for strong contrast.'],
  ['modern', 'Modern Edgy Styles', 'Disconnected Undercut', 'Strong separation between long top and short sides.'],
  ['modern', 'Modern Edgy Styles', 'Modern Undercut', 'Clean undercut with contemporary textured top.'],
  ['modern', 'Modern Edgy Styles', 'Faux Hawk', 'Hair styled upward toward the center without full mohawk shaving.'],
  ['modern', 'Modern Edgy Styles', 'Mohawk', 'Central strip of longer hair with very short or shaved sides.'],
  ['modern', 'Modern Edgy Styles', 'Burst Fade Mohawk', 'Mohawk-inspired style with burst fade around the ears.'],
  ['modern', 'Modern Edgy Styles', 'Spiky Hair', 'Short hair styled upward into defined spikes.'],
  ['modern', 'Modern Edgy Styles', 'Textured Spikes', 'Modern spiky hairstyle with softer texture and movement.'],
  ['modern', 'Modern Edgy Styles', 'Messy Top Fade', 'Messy textured top paired with clean faded sides.'],
  ['modern', 'Modern Edgy Styles', 'Disconnected Crop', 'Textured crop with strong contrast from shorter sides.'],
  ['afro', 'Afro Coily Hair', 'Short Afro', 'Short rounded afro with natural coily texture.'],
  ['afro', 'Afro Coily Hair', 'Medium Afro', 'Medium-size afro with rounded shape and natural volume.'],
  ['afro', 'Afro Coily Hair', 'Afro Fade', 'Afro top paired with faded sides.'],
  ['afro', 'Afro Coily Hair', 'High Top Fade', 'Tall structured afro top with clean faded sides.'],
  ['afro', 'Afro Coily Hair', 'Low Afro Fade', 'Subtle fade with natural afro texture on top.'],
  ['afro', 'Afro Coily Hair', 'Temple Fade Afro', 'Afro hairstyle with clean temple fade edges.'],
  ['afro', 'Afro Coily Hair', 'Twist Out', 'Defined twist-out texture with natural volume.'],
  ['afro', 'Afro Coily Hair', 'Short Twists', 'Short twisted hair sections with neat texture.'],
  ['afro', 'Afro Coily Hair', 'Medium Twists', 'Medium-length twists with controlled shape.'],
  ['afro', 'Afro Coily Hair', 'Sponge Twists', 'Short coily sponge-twist texture.'],
  ['braids', 'Braids And Locs', 'Cornrows', 'Hair braided close to the scalp in neat straight rows.'],
  ['braids', 'Braids And Locs', 'Box Braids', 'Individual square-section braids with clean parting.'],
  ['braids', 'Braids And Locs', 'Short Braids', 'Short braided hairstyle with neat sections.'],
  ['braids', 'Braids And Locs', 'Man Bun Braids', 'Braids gathered into a bun at the back or crown.'],
  ['braids', 'Braids And Locs', 'Two Strand Twists', 'Two-strand twist hairstyle with defined texture.'],
  ['braids', 'Braids And Locs', 'Dreadlocks', 'Loc hairstyle with natural locked sections.'],
  ['braids', 'Braids And Locs', 'Short Locs', 'Short dreadlocks with neat shape.'],
  ['braids', 'Braids And Locs', 'Medium Locs', 'Medium-length locs with natural movement.'],
  ['braids', 'Braids And Locs', 'Loc Bun', 'Locs tied into a bun.'],
  ['braids', 'Braids And Locs', 'Loc Fade', 'Locs on top with faded sides.'],
  ['mature', 'Mature Receding Hairline', 'Receding Hairline Buzz Cut', 'Short buzz cut that works naturally with a receding hairline.'],
  ['mature', 'Mature Receding Hairline', 'Short Taper For Receding Hairline', 'Short taper haircut that keeps a clean style while respecting a receding hairline.'],
  ['mature', 'Mature Receding Hairline', 'Textured Crop For Receding Hairline', 'Textured forward crop that softens the appearance of a receding hairline.'],
  ['mature', 'Mature Receding Hairline', 'Crew Cut For Receding Hairline', 'Classic short crew cut suitable for mature or receding hairlines.'],
  ['mature', 'Mature Receding Hairline', 'Clean Shaved Head', 'Completely shaved head with smooth clean finish.'],
  ['mature', 'Mature Receding Hairline', 'Bald With Fade Beard Blend', 'Shaved or bald head blended cleanly with existing facial hair if present.'],
] as const

export const MEN_HAIR_OPTIONS: MenHairOption[] = RAW_MEN_HAIR_OPTIONS.map(
  ([categoryId, categoryLabel, name, description]) => ({
    categoryId,
    categoryLabel,
    name,
    description,
    imagePath: `/men_catalog/${categoryId}/${toFilename(name)}`,
  }),
)

export function getMenHairCategory(categoryId?: string | null) {
  return MEN_HAIR_CATEGORIES.find((category) => category.id === categoryId)
}

export function getMenHairOptionsForCategory(categoryId?: string | null) {
  return MEN_HAIR_OPTIONS.filter((option) => option.categoryId === categoryId)
}

export function findMenHairOption(
  categoryId?: string | null,
  styleName?: string | null,
) {
  return MEN_HAIR_OPTIONS.find(
    (option) => option.categoryId === categoryId && option.name === styleName,
  )
}

function toFilename(name: string) {
  return `${name.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '')}.png`
}
