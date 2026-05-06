export type MenBeardCategoryId =
  | 'clean'
  | 'stubble'
  | 'short'
  | 'medium'
  | 'full'
  | 'goatee'
  | 'mustache'
  | 'jawline'
  | 'faded'
  | 'line'
  | 'rugged'

export type MenBeardCategory = {
  id: MenBeardCategoryId
  label: string
}

export type MenBeardOption = {
  categoryId: MenBeardCategoryId
  categoryLabel: string
  name: string
  description: string
}

export const MEN_BEARD_CATEGORIES: MenBeardCategory[] = [
  { id: 'clean', label: 'Clean And Minimal' },
  { id: 'stubble', label: 'Stubble' },
  { id: 'short', label: 'Short Beards' },
  { id: 'medium', label: 'Medium Beards' },
  { id: 'full', label: 'Full Beards' },
  { id: 'goatee', label: 'Goatee Styles' },
  { id: 'mustache', label: 'Mustache Styles' },
  { id: 'jawline', label: 'Jawline And Chin' },
  { id: 'faded', label: 'Faded And Tapered' },
  { id: 'line', label: 'Line And Shape' },
  { id: 'rugged', label: 'Long And Rugged' },
]

const RAW_MEN_BEARD_OPTIONS = [
  ['clean', 'Clean And Minimal', 'Clean Shaven', 'Completely clean-shaven face with no visible beard or mustache, smooth realistic skin, and natural shaving shadow only if appropriate.'],
  ['clean', 'Clean And Minimal', 'Fresh Shave', 'Freshly shaved look with extremely clean face, very slight natural skin texture, and no visible facial hair.'],
  ['clean', 'Clean And Minimal', 'Light Shaving Shadow', 'Very subtle natural shaving shadow around the jaw, chin, and upper lip, with no actual beard length.'],
  ['clean', 'Clean And Minimal', 'Five O Clock Shadow', 'Very short stubble shadow across the beard area, like facial hair beginning to grow back after shaving.'],
  ['stubble', 'Stubble', 'Light Stubble', 'Short light stubble evenly covering the jawline, chin, cheeks, and upper lip with natural density.'],
  ['stubble', 'Stubble', 'Medium Stubble', 'Medium-length stubble with visible facial hair texture and clean masculine grooming.'],
  ['stubble', 'Stubble', 'Heavy Stubble', 'Thicker heavy stubble with stronger dark facial hair coverage while still short and controlled.'],
  ['stubble', 'Stubble', 'Designer Stubble', 'Polished stubble with clean cheek line, defined neckline, and intentional barber-groomed shape.'],
  ['stubble', 'Stubble', 'Short Boxed Stubble', 'Short boxed stubble with neat cheek line, clean neckline, and defined jawline coverage.'],
  ['stubble', 'Stubble', 'Rugged Stubble', 'Slightly rougher masculine stubble with natural uneven density and realistic growth pattern.'],
  ['short', 'Short Beards', 'Short Boxed Beard', 'Short full beard trimmed close to the face with clean cheek line, sharp neckline, and neat mustache connection.'],
  ['short', 'Short Beards', 'Corporate Beard', 'Professional short beard with controlled length, clean edges, neat mustache, and polished business grooming.'],
  ['short', 'Short Beards', 'Classic Short Beard', 'Classic short beard with balanced cheek coverage, defined jawline, and natural facial hair texture.'],
  ['short', 'Short Beards', 'Rounded Short Beard', 'Short beard shaped with softer rounded edges around the chin and jaw for a clean approachable look.'],
  ['short', 'Short Beards', 'Square Short Beard', 'Short beard with more squared jawline shaping and structured lower edge.'],
  ['short', 'Short Beards', 'Sharp Line Short Beard', 'Short beard with crisp barber-defined cheek line and neckline while keeping realistic hair texture.'],
  ['short', 'Short Beards', 'Natural Short Beard', 'Short beard with natural cheek line and softer neckline, less sharply groomed but still tidy.'],
  ['short', 'Short Beards', 'Faded Short Beard', 'Short beard blended gradually into the sideburns with a clean barber fade effect.'],
  ['medium', 'Medium Beards', 'Medium Full Beard', 'Medium-length full beard with natural density across cheeks, jaw, chin, and mustache.'],
  ['medium', 'Medium Beards', 'Medium Boxed Beard', 'Medium beard with controlled rectangular shape, clean cheek line, and strong jaw definition.'],
  ['medium', 'Medium Beards', 'Rounded Medium Beard', 'Medium-length beard shaped rounder at the chin and lower jaw, with natural fullness.'],
  ['medium', 'Medium Beards', 'Tapered Medium Beard', 'Medium beard tapered gradually from sideburns down to fuller chin and jaw coverage.'],
  ['medium', 'Medium Beards', 'Structured Medium Beard', 'Medium beard with precise barber shaping, defined edges, and full but controlled volume.'],
  ['medium', 'Medium Beards', 'Natural Medium Beard', 'Medium-length beard with natural growth pattern, softer edges, and realistic density variation.'],
  ['medium', 'Medium Beards', 'Dense Medium Beard', 'Thicker medium-length beard with strong density and full cheek coverage.'],
  ['medium', 'Medium Beards', 'Soft Medium Beard', 'Medium beard with softer texture, natural edges, and less aggressive shaping.'],
  ['full', 'Full Beards', 'Full Beard', 'Full beard with complete coverage across cheeks, jawline, chin, and mustache, naturally groomed.'],
  ['full', 'Full Beards', 'Classic Full Beard', 'Traditional full beard with balanced density, connected mustache, and clean lower shape.'],
  ['full', 'Full Beards', 'Thick Full Beard', 'Thick full beard with strong density and rich facial hair texture.'],
  ['full', 'Full Beards', 'Long Full Beard', 'Longer full beard extending below the chin with natural volume and groomed shape.'],
  ['full', 'Full Beards', 'Rounded Full Beard', 'Full beard shaped with rounded lower edge and natural cheek fullness.'],
  ['full', 'Full Beards', 'Square Full Beard', 'Full beard shaped with a squared lower edge for a strong masculine jaw effect.'],
  ['full', 'Full Beards', 'Tapered Full Beard', 'Full beard tapered at the sideburns and cheeks, fuller around chin and jaw.'],
  ['full', 'Full Beards', 'Natural Full Beard', 'Full beard with natural edges and realistic density, less sharply lined.'],
  ['goatee', 'Goatee Styles', 'Goatee', 'Facial hair focused on the chin with clean cheeks and minimal or no side beard.'],
  ['goatee', 'Goatee Styles', 'Classic Goatee', 'Classic chin goatee with neat shape and realistic facial hair texture.'],
  ['goatee', 'Goatee Styles', 'Full Goatee', 'Goatee connected with mustache around the mouth, forming a complete rounded shape.'],
  ['goatee', 'Goatee Styles', 'Circle Beard', 'Mustache and chin beard connected in a circular frame around the mouth with clean cheeks.'],
  ['goatee', 'Goatee Styles', 'Anchor Beard', 'Beard shaped like an anchor with mustache, chin beard, and pointed lower shape.'],
  ['goatee', 'Goatee Styles', 'Extended Goatee', 'Goatee extended slightly along the jawline while cheeks remain mostly clean.'],
  ['goatee', 'Goatee Styles', 'Van Dyke', 'Separated pointed chin beard and mustache with clean cheeks, classic refined style.'],
  ['goatee', 'Goatee Styles', 'Balbo Beard', 'Separated mustache and beard with defined chin and lower cheek shaping, clean professional edges.'],
  ['mustache', 'Mustache Styles', 'Mustache Only', 'Mustache without beard, clean-shaven cheeks and chin, natural masculine grooming.'],
  ['mustache', 'Mustache Styles', 'Classic Mustache', 'Traditional medium mustache following the upper lip with clean grooming.'],
  ['mustache', 'Mustache Styles', 'Thin Mustache', 'Thin neatly trimmed mustache with clean upper lip definition.'],
  ['mustache', 'Mustache Styles', 'Thick Mustache', 'Thicker mustache with strong density and natural texture.'],
  ['mustache', 'Mustache Styles', 'Chevron Mustache', 'Full thick mustache covering the upper lip area with classic masculine shape.'],
  ['mustache', 'Mustache Styles', 'Handlebar Mustache', 'Mustache with ends styled outward and slightly curled, clean and realistic.'],
  ['mustache', 'Mustache Styles', 'Pencil Mustache', 'Very thin precise mustache line above the upper lip with clean edges.'],
  ['mustache', 'Mustache Styles', 'Horseshoe Mustache', 'Mustache extending downward along both sides of the mouth toward the chin.'],
  ['jawline', 'Jawline And Chin', 'Chin Strap', 'Thin beard line following the jawline from sideburn to chin with clean cheeks.'],
  ['jawline', 'Jawline And Chin', 'Thick Chin Strap', 'Thicker jawline beard following the lower face with stronger facial hair density.'],
  ['jawline', 'Jawline And Chin', 'Jawline Beard', 'Beard focused along the jawline with clean cheeks and defined lower face structure.'],
  ['jawline', 'Jawline And Chin', 'Chin Beard', 'Facial hair concentrated on the chin with cheeks and jaw mostly clean.'],
  ['jawline', 'Jawline And Chin', 'Soul Patch', 'Small patch of facial hair below the lower lip with otherwise clean or minimal beard.'],
  ['jawline', 'Jawline And Chin', 'Chin Curtain', 'Beard running along the jawline and chin without a mustache, clean upper lip.'],
  ['jawline', 'Jawline And Chin', 'Amish Beard', 'Full beard along jaw and chin without mustache, natural and dense.'],
  ['jawline', 'Jawline And Chin', 'Neckline Beard', 'Beard emphasized along the lower jaw and neckline with clean upper cheeks.'],
  ['faded', 'Faded And Tapered', 'Beard Fade', 'Beard gradually faded from the sideburns into fuller jaw and chin hair.'],
  ['faded', 'Faded And Tapered', 'Low Beard Fade', 'Subtle beard fade starting low near the jaw and sideburn area.'],
  ['faded', 'Faded And Tapered', 'High Beard Fade', 'More dramatic beard fade starting higher at the sideburns and cheek area.'],
  ['faded', 'Faded And Tapered', 'Temple Beard Fade', 'Beard blended cleanly at the temple and sideburn area with barber fade transition.'],
  ['faded', 'Faded And Tapered', 'Tapered Beard', 'Beard gradually transitions from shorter sides to fuller chin and jaw.'],
  ['faded', 'Faded And Tapered', 'Sideburn Blend Beard', 'Beard naturally blended into the sideburns with smooth length transition.'],
  ['faded', 'Faded And Tapered', 'Sharp Beard Fade', 'Crisp beard fade with clean barber lines and precise sideburn transition.'],
  ['faded', 'Faded And Tapered', 'Soft Beard Fade', 'Soft natural beard fade with gentle transition from sideburns to jaw.'],
  ['line', 'Line And Shape', 'Sharp Cheek Line', 'Beard with a very clean sharp cheek line and polished barber grooming.'],
  ['line', 'Line And Shape', 'Natural Cheek Line', 'Beard with natural softer cheek line and realistic growth pattern.'],
  ['line', 'Line And Shape', 'Low Cheek Line', 'Beard cheek line placed lower for a cleaner cheek area and defined jaw focus.'],
  ['line', 'Line And Shape', 'High Cheek Line', 'Beard cheek line placed higher for fuller cheek coverage.'],
  ['line', 'Line And Shape', 'Sharp Neckline', 'Beard with a clean sharp neckline under the jaw and chin.'],
  ['line', 'Line And Shape', 'Natural Neckline', 'Beard with softer natural neckline and less razor-sharp grooming.'],
  ['line', 'Line And Shape', 'Rounded Beard Shape', 'Beard shaped with soft rounded lower outline around the chin and jaw.'],
  ['line', 'Line And Shape', 'Square Beard Shape', 'Beard shaped with squared lower edge for stronger jaw appearance.'],
  ['rugged', 'Long And Rugged', 'Rugged Beard', 'Natural rugged beard with slightly uneven density and masculine texture.'],
  ['rugged', 'Long And Rugged', 'Lumberjack Beard', 'Thick longer full beard with strong natural density and rugged grooming.'],
  ['rugged', 'Long And Rugged', 'Garibaldi Beard', 'Wide full beard with rounded bottom and natural volume.'],
  ['rugged', 'Long And Rugged', 'Bandholz Beard', 'Large full natural beard with significant length and volume, groomed but bold.'],
  ['rugged', 'Long And Rugged', 'Ducktail Beard', 'Full beard shaped into a pointed tapered chin, resembling a ducktail silhouette.'],
  ['rugged', 'Long And Rugged', 'Viking Beard', 'Long thick beard with rugged masculine shape and natural heavy texture.'],
  ['rugged', 'Long And Rugged', 'Pointed Beard', 'Beard shaped downward into a pointed chin-focused silhouette.'],
  ['rugged', 'Long And Rugged', 'Long Tapered Beard', 'Long beard tapered neatly from cheeks into a fuller longer chin.'],
] as const

export const MEN_BEARD_OPTIONS: MenBeardOption[] = RAW_MEN_BEARD_OPTIONS.map(
  ([categoryId, categoryLabel, name, description]) => ({
    categoryId,
    categoryLabel,
    name,
    description,
  }),
)

export function getMenBeardCategory(categoryId?: string | null) {
  return MEN_BEARD_CATEGORIES.find((category) => category.id === categoryId)
}

export function getMenBeardOptionsForCategory(categoryId?: string | null) {
  return MEN_BEARD_OPTIONS.filter((option) => option.categoryId === categoryId)
}

export function findMenBeardOption(
  categoryId?: string | null,
  styleName?: string | null,
) {
  return MEN_BEARD_OPTIONS.find(
    (option) => option.categoryId === categoryId && option.name === styleName,
  )
}
