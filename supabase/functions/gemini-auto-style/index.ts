/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/* ============================================================
   CONFIG
============================================================ */

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY");
}

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent";

/* ============================================================
   EXPANDED MEN HAIR CATALOG PROMPTS
============================================================ */

type MenHairCategoryId =
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

type MenHairOption = {
  categoryId: MenHairCategoryId
  categoryLabel: string
  name: string
  description: string
  imagePath: string
}

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

const MEN_HAIR_OPTIONS: MenHairOption[] = RAW_MEN_HAIR_OPTIONS.map(
  ([categoryId, categoryLabel, name, description]) => ({
    categoryId,
    categoryLabel,
    name,
    description,
    imagePath: `/men_catalog/${categoryId}/${toHairFilename(name)}`,
  }),
)

function toHairFilename(name: string) {
  return `${name.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '')}.png`
}


/* ============================================================
   EXPANDED MEN BEARD CATALOG PROMPTS
============================================================ */

type MenBeardCategoryId =
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

type MenBeardOption = {
  categoryId: MenBeardCategoryId
  categoryLabel: string
  name: string
  description: string
}

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

const MEN_BEARD_OPTIONS: MenBeardOption[] = RAW_MEN_BEARD_OPTIONS.map(
  ([categoryId, categoryLabel, name, description]) => ({
    categoryId,
    categoryLabel,
    name,
    description,
  }),
)

/* ============================================================
   LEGACY CATALOG PROMPT LIBRARIES
   These keep older payload keys working while the new catalog
   uses the expanded display names imported from the web app.
============================================================ */

const LEGACY_HAIR_LIBRARY: Record<string, string> = {
  Quiff:
    "Modern textured quiff hairstyle. Front and top length: 8-10 cm. Shorter toward crown (6-7 cm). Hair at forehead lifted vertically upward first, then slightly swept backward. No sideways parting. Crown kept medium density without flattening. Sides and back: low taper fade starting at 0-1 mm near ears, blending smoothly into longer hair above. Parietal ridge softly blended, no visible weight line. Top cut using scissors with light layering for texture. Styling: matte clay applied to dry hair, worked from roots to tips. Finish with medium volume, flexible movement, no stiff spikes, natural airflow. Neckline tapered cleanly, not boxed.",
  SlickBack:
    "Classic slick-back hairstyle. Top length: 10-12 cm uniform from front to crown. Hair direction: combed straight backward, no side movement. No volume lift at front. Sides: low skin fade (0 mm to 6 mm). Back: tight nape taper. Natural part preserved if present. Density concentrated in frontal zone. Styling: glossy pomade applied to damp hair, combed repeatedly until smooth reflective surface appears. No loose strands. Symmetrical flow from forehead to crown. Avoid puffiness.",
  Buzz:
    "Uniform buzz cut. Entire scalp clipped using number 2 guard (approx. 6 mm). No variation in length. Temples and nape softly faded down to 1 mm. Hairline squared and sharp. Scalp tone slightly visible. Texture of follicles visible. No patches. Finish with low shine. Military-level symmetry. No styling product.",
  FrenchCrop:
    "European French crop. Top length: 4-5 cm. Textured using point-cutting. Fringe: blunt horizontal line across forehead, resting just above eyebrows. No side sweep. Sides: mid fade (0.5 mm to 9 mm). Crown blended seamlessly. Matte finish. Compact rounded silhouette. Fringe tips lightly feathered, not spiky.",
  Pompadour:
    "Traditional pompadour. Front section length: 10-12 cm. Crown: 7-8 cm. Roots blow-dried upward for lift. Hair swept up first, then backward. Sides tapered with scissors-over-comb, no harsh fade. Parietal ridge rounded. Styling cream with medium shine. Height balanced with face width. No collapsing at crown.",
  MidFade:
    "Mid skin fade starting halfway between temple and ear top. Fade gradient: 0 mm -> 3 mm -> 6 mm -> full hair. Top length: 4-6 cm textured. Crown controlled, no cowlicks. Front hairline natural. Temple points sharp. Neckline clean and tapered.",
  CurlyTop:
    "Curly top preserving natural curl pattern. Length: 6-8 cm. Curls defined individually. No straightening. Sides tapered (3-6 mm). Back blended. Frizz controlled using curl cream. Moisture-balanced finish. Crown volumized. Curl density evenly distributed.",
  Undercut:
    "Disconnected undercut. Sides and back: skin fade or shaved (0-1 mm). Top: 10+ cm. Clear separation line between top and sides, no blending. Contrast must be obvious. Top styled slicked back or side. Structured layering. High density maintained.",
  SidePart:
    "Executive side part. Top: 7-9 cm. Razor hard part shaved 1-2 mm wide. Hair combed diagonally. Sides tapered. Polished silhouette. Light pomade. Forehead partially exposed. No messy texture.",
  Caesar:
    "Roman Caesar. Top: 3-4 cm uniform. Fringe straight and short. Low fade sides. Rounded profile. Matte finish. Minimal lift. No spikes.",
  IvyLeague:
    "Ivy League. Sides: short taper. Top: 5-6 cm. Soft side part. Crown blended. Slight volume only. Conservative professional look. No extreme fades.",
  TexturedCrop:
    "Choppy layered crop. Top: 4-6 cm. Razor-cut tips. Fringe irregular. Low fade sides. Matte paste. Intentional messy look but controlled. Urban style.",
  HighFade:
    "High skin fade starting near upper parietal ridge. Fade: 0 mm -> 9 mm very fast. Top: 3-5 cm. Precision edge-up. Athletic clean look. Crisp silhouette.",
  TaperFade:
    "Low taper at temples and nape. Natural hairline preserved. Top medium length. Gradual graduation. No harsh contrast. Conservative style.",
  Spiky:
    "Short layered top: 4-5 cm. Sides tapered. Matte wax. Individual strands separated and lifted upward. Spikes soft, not sharp needles. Youthful energy.",
  ManBun:
    "Long hair gathered into bun at crown or occipital. Length: 20+ cm. Sides faded or tapered. Neckline clean. Some loose strands allowed. Medium density. Natural tension on tied hair.",
  BroFlow:
    "Medium-long length: 10-14 cm. Hair flows backward naturally. Layers added. Slight side movement. Low shine. Relaxed masculine look.",
  Shaggy:
    "Medium layered length. Feathered ends. Uneven fringe. Messy organic texture. Natural volume. Casual unstructured silhouette.",
  FlatTop:
    "Squared flat plane on top. Height: 3-5 cm. High fade sides. Sharp corners. Clipper-over-comb precision. Military geometry.",
  LongLayered:
    "Shoulder-length hair. Blended long layers. Natural waves. Soft tapered ends. Light cream. Balanced volume.",
};

const LEGACY_BEARD_LIBRARY: Record<string, string> = {
  ShortBoxed:
    "Short boxed beard with highly controlled uniform length between 6-8 mm across cheeks, jaw, and chin. Density is consistent but slightly thicker along the jawline for structure. Cheek lines are sharply defined, following the natural cheekbone with a clean, upward curve. Neckline is precisely positioned two finger-widths above the Adam's apple, forming a clean horizontal arc. Sideburns are smoothly blended into the beard with no harsh transitions. Hair direction follows natural downward growth with slight randomness in strand angles. Edges are crisp but not overly artificial. Overall appearance is symmetrical, professional, and tightly groomed with minimal stray hairs.",
  Ducktail:
    "Ducktail beard with progressive length gradient: 10-15 mm on cheeks, increasing to 30-50 mm at the chin. Chin forms a sharp central taper with highest density concentrated at the tip. Jawline is sculpted inward to guide the taper. Cheek lines are moderately defined with soft transitions to maintain realism. Neckline is clean but slightly blended. Sideburns fade naturally into upper beard. Hair strands follow downward direction with slight inward convergence toward the chin. Subtle variation in strand thickness and length prevents artificial uniformity. Designed to elongate the lower face and emphasize the chin structure.",
  Stubble:
    "Heavy stubble with tightly controlled length of 4-5 mm. Follicles are clearly visible with slight variation in thickness and spacing. Density is intentionally uneven across cheeks and jaw, creating natural patchiness. Cheek line is softly diffused rather than sharply defined. Neckline blends gradually into skin with no hard edge. Hair direction varies slightly across regions, following natural growth patterns. Skin remains partially visible through beard, enhancing realism. Micro irregularities and subtle density gaps prevent uniform appearance.",
  Goatee:
    "Connected goatee with mustache and chin beard at 8-12 mm length. Cheeks are fully clean-shaven, creating strong contrast. Chin area is denser than mustache for visual balance. Edges around lips and chin are sharply defined with clean curvature. Mustache follows upper lip contour precisely with trimmed lower edge. Hair direction is primarily downward with slight outward spread near edges. Transition between mustache and chin beard is seamless. Symmetry is critical with minimal irregularity.",
  FullBeard:
    "Full beard with uniform coverage across cheeks, jaw, and chin, length ranging from 20-30 mm. Density is high but naturally varied, with slightly thicker growth at chin and jawline. Cheek line is soft and slightly irregular, avoiding sharp artificial edges. Neckline is blended gradually into lower beard with no abrupt cutoff. Hair strands vary in direction and thickness, forming natural clusters. Slight flyaways and micro layering add depth. Overall structure is balanced and realistic with no overly perfect symmetry.",
  Balbo:
    "Balbo beard featuring a detached mustache and defined chin beard. Chin section length ranges from 10-20 mm, shaped into a structured block or slight curve. Mustache is independently trimmed with clean alignment to upper lip. Cheeks are fully shaved with sharp separation between sections. Edges are crisp and geometric. Hair density is moderate and evenly distributed. Hair direction follows natural downward growth with minimal randomness. Emphasis on clear separation and sculpted precision.",
  Bandholz:
    "Long Bandholz beard exceeding 50 mm in length with high density and coarse texture. Growth is natural and unstructured, with strands varying significantly in length and direction. Cheek line is natural and slightly uneven. Neckline is undefined and blends into natural growth. Hair flows downward with slight outward expansion at lower sections. Visible layering and irregular clustering create depth. Minimal trimming preserves rugged authenticity.",
  Anchor:
    "Anchor beard with sharply defined chin point (10-20 mm length) connected to a thin jawline strip. Mustache is styled and slightly curved, following lip contour. Cheeks are completely shaved. Edges are razor sharp with strong contrast against skin. Hair direction follows sculpted lines with minimal deviation. Jawline strip is narrow and precise. Chin taper is symmetrical and clean.",
  Verdi:
    "Medium-length Verdi beard (20-30 mm) with rounded bottom shape and balanced volume. Mustache is prominent with slightly curled ends. Density is consistent with slight thickening at chin. Cheek lines are softly defined with natural transitions. Hair direction follows downward growth with subtle variations. Edges are clean but not overly sharp, maintaining a refined yet natural look.",
  ChinStrap:
    "Thin chin strap beard outlining the jawline with consistent width of 5-7 mm and length of 3-5 mm. Cheeks and chin are clean-shaven. Edges are extremely sharp and precise. Hair density is even with minimal variation. Hair direction follows jaw contour. No blending zones - clean separation between beard and skin.",
  Garibaldi:
    "Garibaldi beard with wide, rounded bottom and length of 30-50 mm. Density is high with natural distribution across cheeks and chin. Edges are soft and minimally shaped. Mustache is shorter and blends into beard. Hair strands vary in direction and thickness, creating organic volume. Slight irregularity enhances realism.",
  VanDyke:
    "Van Dyke beard with detached mustache and pointed chin beard. Chin section is 10-20 mm and sharply tapered. Mustache is defined and slightly curved. Cheeks are clean-shaven with strong contrast. Edges are crisp and symmetrical. Hair direction is controlled with minimal randomness.",
  MuttonChops:
    "Mutton chops with thick sideburns extending downward and connecting to mustache while chin remains clean-shaven. Density is high along sides of face. Hair follows downward growth with slight outward expansion. Edges are bold but slightly softened for realism. Strong lateral emphasis.",
  Corporate:
    "Corporate beard with uniform length of 5-7 mm. Density is moderate and evenly distributed. Cheek lines are clean but not overly sharp. Neckline is softly blended. Hair strands are controlled with minimal irregularity. Professional, clean finish with subtle natural variation.",
  Royale:
    "Royale beard combining mustache and small chin patch at 5-8 mm length. Cheeks and jaw are clean-shaven. Edges are sharp and well-defined. Hair density is moderate with slight variation. Precise placement and symmetry emphasized.",
  SoulPatch:
    "Small isolated patch below lower lip at 3-5 mm length. Surrounding skin is clean-shaven. Edges are sharp and compact. Density is moderate with slight irregularity for realism.",
  Hollywoodian:
    "Hollywoodian beard with low cheek line and strong jaw emphasis. Length ranges from 10-20 mm. Sideburns blend smoothly into beard. Cheeks are partially shaved to create contour. Density increases along jawline. Hair direction follows natural downward growth with slight variation.",
  Patchy:
    "Patchy beard with uneven density across cheeks and jaw. Length varies between 5-15 mm. Visible gaps and irregular growth patterns. Hair thickness and direction vary significantly. Realistic imperfections dominate the appearance.",
  Designer:
    "Designer beard with precise sculpting and symmetry. Length varies between 5-15 mm depending on section. Edges are razor sharp. Density is controlled and balanced. Cheek lines and neckline are perfectly aligned. Minimal irregularity for a polished look.",
  Natural:
    "Natural beard with minimal grooming and length ranging from 5-20 mm. Cheek and neckline are undefined and softly blended. Hair grows in multiple directions with visible irregularities in density and length. Organic and unstructured appearance.",
};

type CatalogPromptOption = {
  name: string;
  categoryLabel?: string;
  description: string;
};

const HAIR_LIBRARY = createCatalogLibrary([
  ...Object.entries(LEGACY_HAIR_LIBRARY).map(([name, description]) => ({
    name,
    description,
  })),
  ...MEN_HAIR_OPTIONS.map((option) => ({
    name: option.name,
    categoryLabel: option.categoryLabel,
    description: option.description,
  })),
]);

const BEARD_LIBRARY = createCatalogLibrary([
  ...Object.entries(LEGACY_BEARD_LIBRARY).map(([name, description]) => ({
    name,
    description,
  })),
  ...MEN_BEARD_OPTIONS.map((option) => ({
    name: option.name,
    categoryLabel: option.categoryLabel,
    description: option.description,
  })),
]);

/* ============================================================
   HELPERS
============================================================ */

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
}

async function fetchImageBase64(url: string): Promise<string> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch image");
  }

  const buffer = await res.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
}

function createCatalogLibrary(options: CatalogPromptOption[]) {
  const library = new Map<string, CatalogPromptOption>();

  for (const option of options) {
    library.set(normalizeKey(option.name), option);
  }

  return library;
}

function normalizeKey(value?: string | null) {
  return String(value ?? "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

function lookupCatalogOption(
  library: Map<string, CatalogPromptOption>,
  selected?: string | null,
) {
  return library.get(normalizeKey(selected));
}

function formatCatalogPromptOption(
  label: string,
  selectedValue: string,
  option: CatalogPromptOption,
) {
  const category = option.categoryLabel ? ` (${option.categoryLabel})` : "";

  return [
    `${label}: ${selectedValue}${category}`,
    `${label} technical prompt: ${option.description}`,
  ].join("\n");
}

/* ============================================================
   PROMPTS (SMART PROMPT UNCHANGED)
============================================================ */

function buildSmartPrompt(hairLength: string, beardLength: string) {
  return `
You are a professional barber and photorealistic portrait editor.

TASK:
Generate ONE ultra-high-resolution image containing EXACTLY 10 different hairstyle and beard variations of THE SAME PERSON.

CRITICAL IDENTITY RULES (MANDATORY):
- Preserve exact facial identity from input image.
- Do NOT change face shape, eyes, nose, lips, jawline, skin tone, age, or expression.
- Do NOT beautify, enhance, smooth, or filter the face.
- Keep natural skin texture and imperfections.

BEARD RULE:
- If the original image has NO beard, do NOT generate beard.
- If a beard exists, preserve natural density and coverage.

STYLE RULES:
- Hair length: ${hairLength}
- Beard length: ${beardLength}

- Generate 10 UNIQUE styles.
- Never repeat hair or beard.
- Each variation must be clearly different.

OUTPUT:
- Single image.
- Grid layout: 2 rows × 5 columns.
- Same camera angle.
- Same lighting.
- Same head position.

QUALITY:
- Ultra photorealistic.
- 8K detail.
- DSLR portrait look.
- No CGI.
- No illustration.
- No painting.

BACKGROUND:
Neutral studio background.

FINAL CHECK:
If identity changes, regenerate.
If beautified, regenerate.
If any style repeats, regenerate.

Return final image only.
`;
}

const BASE_CATALOG_RULES = `
You are a professional barber and photorealistic portrait editor.

IDENTITY RULES:
- Preserve exact facial identity.
- Do NOT beautify.
- Do NOT smooth skin.
- Do NOT change age.
- Do NOT modify facial structure.
- Keep natural imperfections.

BEARD RULE:
- If no beard exists in original image, do NOT generate beard.
- If beard exists, preserve density.

CAMERA:
- Same angle as original.
- Same lighting.
- Same expression.

QUALITY:
- Ultra realistic.
- 8K detail.
- No filters.
- No CGI.
`;

function buildCatalogPrompt(
  hairStyle: string,
  hairOption: CatalogPromptOption,
  beardStyle: string,
  beardOption: CatalogPromptOption,
) {
  return `
${BASE_CATALOG_RULES}

TASK:
Generate ONE ultra-realistic portrait of the SAME PERSON.

${formatCatalogPromptOption("Hairstyle", hairStyle, hairOption)}

${formatCatalogPromptOption("Beard style", beardStyle, beardOption)}

RULES:
- Only ONE variation.
- No grid.
- No artistic effects.
- Follow the selected catalog prompt text exactly.
- Preserve realistic barber grooming and natural hair texture.

BACKGROUND:
Neutral studio background.

FINAL CHECK:
If identity changes, regenerate.
If beautified, regenerate.

Return final image only.
`;
}

/* ============================================================
   GEMINI 3 CLIENT
============================================================ */

async function callGemini(prompt: string, imageBase64: string) {
  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
    },
  };

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(result));
  }

  const part = result.candidates?.[0]?.content?.parts?.find(
    (p: any) => p.inlineData,
  );

  const resultBase64 = part?.inlineData?.data;

  if (!resultBase64) {
    throw new Error("No image returned");
  }

  return resultBase64;
}

/* ============================================================
   MAIN HANDLER
============================================================ */

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return json(200, { ok: true });
    }

    const body = await req.json();

    const {
      src_file_url,
      gender,
      isSmartStyle,
      hairLength,
      beardLength,
      hairStyle,
      beardStyle,
    } = body;

    if (!src_file_url) {
      return json(400, { ok: false, error: "Missing src_file_url" });
    }

    if (gender !== "male") {
      return json(400, { ok: false, error: "Men only endpoint" });
    }

    const imageBase64 = await fetchImageBase64(src_file_url);
    let prompt = "";

    if (isSmartStyle === true) {
      if (!hairLength || !beardLength) {
        return json(400, {
          ok: false,
          error: "Missing hairLength or beardLength",
        });
      }

      prompt = buildSmartPrompt(hairLength, beardLength);
    } else {
      if (!hairStyle || !beardStyle) {
        return json(400, {
          ok: false,
          error: "Missing hairStyle or beardStyle",
        });
      }

      const hairOption = lookupCatalogOption(HAIR_LIBRARY, hairStyle);
      const beardOption = lookupCatalogOption(BEARD_LIBRARY, beardStyle);

      if (!hairOption || !beardOption) {
        return json(400, {
          ok: false,
          error: "Invalid hairStyle or beardStyle",
          debug: {
            hairStyle,
            beardStyle,
            hairFound: Boolean(hairOption),
            beardFound: Boolean(beardOption),
          },
        });
      }

      prompt = buildCatalogPrompt(hairStyle, hairOption, beardStyle, beardOption);
    }

    const image = await callGemini(prompt, imageBase64);

    return json(200, {
      ok: true,
      image_base64: image,
    });
  } catch (e) {
    console.error("MEN EDGE ERROR:", e);

    return json(500, {
      ok: false,
      error: String(e),
    });
  }
});
