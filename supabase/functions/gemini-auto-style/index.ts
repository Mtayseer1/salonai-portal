/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/* ============================================================
   CONFIG
============================================================ */

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const GEMINI_MODEL = "gemini-3.1-flash-image-preview";
const USE_CATALOG_REFERENCE_IMAGES =
  Deno.env.get("USE_CATALOG_REFERENCE_IMAGES") === "true";

if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY");
}

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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
  ["classic", "Classic Short Cuts", "Buzz Cut", "Uniform buzz cut with the entire scalp clipped very short at approximately 3-6 mm, depending on natural density. Length must stay even across top, crown,\n  sides, and back with only a subtle taper around temples and nape. Hairline should remain natural and realistic, lightly cleaned but not artificially reshaped. Scalp visibility is acceptable and should look\n  natural. Finish is matte with visible follicle texture. Avoid patchy clipping, fake painted hairlines, excessive shine, or wig-like uniformity."],
  ["classic", "Classic Short Cuts", "Crew Cut", "Classic crew cut with short tapered sides and a slightly longer top around 2-4 cm. Front is the longest point and may be lightly lifted or brushed forward/\n  upward with controlled texture. Crown is shorter and blended smoothly so there is no shelf or weight line. Sides and back use a clean low to mid taper, not a dramatic skin fade unless naturally suited.\n  Neckline is tapered and neat. Finish should be masculine, practical, and low shine. Avoid spiky gel, exaggerated volume, or changing the natural hairline."],
  ["classic", "Classic Short Cuts", "Ivy League", "Polished Ivy League haircut with top length around 4-6 cm, long enough to comb into a soft side part. Front is gently swept to one side with slight lift,\n  while crown remains controlled and conservative. Sides and back are scissor-tapered or clipper-tapered around 6-12 mm, blending smoothly into the top. Edges are clean but natural, with a tapered neckline.\n  Finish should be professional with light natural shine. Avoid hard razor parts, aggressive fades, messy texture, or artificial helmet-like styling."],
  ["classic", "Classic Short Cuts", "Caesar Cut", "Short Caesar cut with top length around 2.5-4 cm and a short straight fringe resting high on the forehead. Hair is directed forward from crown to hairline\n  with compact, even texture. Sides and back use a low taper or low fade blended softly into the top. Fringe should be controlled and horizontal but not overly sharp or cartoonish. Finish is matte and natural\n  with minimal volume. Preserve the natural hairline and avoid long bangs, side sweeping, spikes, or exaggerated Roman costume styling."],
  ["classic", "Classic Short Cuts", "French Crop", "Modern French crop with top length around 3.5-5 cm, textured through the top and pushed forward toward a defined fringe. Fringe sits near the upper\n  forehead with a soft blunt edge and light separation. Sides and back use a mid fade or tight taper starting around 0.5-2 mm and blending cleanly upward. Crown stays compact with no excessive height. Finish\n  is matte, textured, and barber-clean. Avoid spiky tips, glossy gel, heavy bowl-cut shape, or an unnaturally straight hairline."],
  ["classic", "Classic Short Cuts", "Textured Crop", "Short textured crop with top length around 4-6 cm, cut with choppy layers and point-cut texture for movement. Hair direction is mostly forward with\n  irregular separation through the fringe and top. Sides and back use a low or mid fade, starting close around 0.5-2 mm and blending smoothly into the upper section. Neckline is clean and tapered. Finish is\n  dry matte paste with controlled messy texture. Avoid flat helmet shape, wet shine, stiff spikes, or excessive fringe length."],
  ["classic", "Classic Short Cuts", "High and Tight", "Military-inspired high and tight with very short sides and back clipped close at 0-1.5 mm, rising high above the temples. Top remains short, around 1.5-\n  3 cm, with simple forward or slightly upward texture. The transition should be clean and masculine, with a clear but realistic blend into the top. Hairline and temple edges may be cleaned but not unnaturally\n  drawn. Neckline is tight and tapered. Avoid long top styling, soft business tapering, artificial shine, or extreme cartoon-like contrast."],
  ["classic", "Classic Short Cuts", "Butch Cut", "Simple butch cut with uniform short length around 6-10 mm across the top, sides, and crown. Sides and back may taper slightly shorter near ears and nape for\n  a cleaner barber finish. The head shape should remain natural with visible hair texture and realistic density variations. Hairline is lightly cleaned while preserving its original shape. Finish is matte and\n  product-free. Avoid scalp painting, perfectly fake density, aggressive fades, or styling the hair into spikes or a part."],
  ["classic", "Classic Short Cuts", "Flat Top", "Structured flat top with top hair cut into a level horizontal plane around 2.5-5 cm high, depending on density and head shape. Sides and back are clipped\n  short with a high taper or high fade, blending into squared upper corners. Front and crown must maintain geometric balance without looking artificial. Texture should be dense and upright with controlled\n  matte finish. Neckline is sharp but natural. Avoid rounded pompadour shape, messy top, exaggerated cartoon height, or plastic-looking hair."],
  ["classic", "Classic Short Cuts", "Short Taper Cut", "Clean short taper cut with top length around 3-5 cm, softly textured and styled naturally forward or slightly to the side. Sides and back gradually\n  taper from short around the ears and neckline into longer upper sides without exposing too much skin. The parietal area is blended smoothly with no harsh weight line. Neckline is tapered rather than boxed.\n  Finish is natural matte or low shine. Avoid aggressive skin fade, heavy product, stiff spikes, or reshaping the natural hairline."],
  ["fade", "Fade Styles", "Low Fade", "Low fade haircut with the fade starting just above the ears and low around the nape. Base length begins around 0.5-1 mm near the edges and gradually blends into longer\n  side hair before reaching the top. Top length may remain natural around 4-7 cm with light texture or controlled styling. The fade curve should follow the head shape and stay subtle. Neckline is clean and\n  tapered. Avoid pushing the fade too high, leaving a harsh weight line, or making the hairline look artificial."],
  ["fade", "Fade Styles", "Mid Fade", "Balanced mid fade beginning around the middle of the sides, roughly between the ear top and temple. Fade starts close at 0-1 mm near the lower section and blends\n  through 3-6 mm into the top. Top remains medium-short with natural texture and controlled volume. The transition must be smooth with no visible banding. Edges are barber-clean but realistic. Neckline is\n  tapered. Avoid high-fade placement, patchy gradients, excessive shine, or changing the client\u0027s natural hairline."],
  ["fade", "Fade Styles", "High Fade", "High fade with the shortest section starting near the lower sides and rising high toward the upper parietal ridge. Base begins around 0-1 mm and blends quickly but\n  smoothly into the longer top. Top length should remain around 3-6 cm with compact texture or natural direction. Temple and neckline are crisp while respecting the original hairline. The style should look\n  bold and clean. Avoid disconnected shelves unless requested, uneven fade bands, exaggerated top volume, or AI-painted edges."],
  ["fade", "Fade Styles", "Skin Fade", "Clean skin fade where the lower sides and nape fade down to visible skin at 0 mm, then transition gradually through 1-3 mm into longer hair above. Fade height should\n  suit the head shape and selected top style, with no harsh banding. Top remains natural and connected unless the style requires contrast. Edges are sharp but realistic, and neckline is fully cleaned. Avoid\n  plastic skin texture, overly dark hairline fill, uneven gradient, or cartoon barber lines."],
  ["fade", "Fade Styles", "Low Skin Fade", "Low skin fade starting at 0 mm around the lower temple, ears, and nape, staying below the temple ridge. The fade gradually builds through 1-3 mm into natural side\n  length, preserving a conservative silhouette. Top hair should retain its selected shape and natural density. The blend must be smooth around the ear curve and neckline. Finish is clean and modern. Avoid\n  raising the fade too high, creating a disconnected top, or drawing an unnatural lineup."],
  ["fade", "Fade Styles", "Mid Skin Fade", "Mid skin fade with the bald section beginning near the lower side and transitioning upward around the middle of the head. Start at 0 mm near ears and nape, then\n  blend through 1-6 mm into the upper sides and top. Top remains textured and masculine with no forced direction unless already styled. Temple corners are clean but natural. Avoid visible fade steps, overly\n  sharp artificial edges, excessive scalp shine, or changing head shape."],
  ["fade", "Fade Styles", "High Skin Fade", "High skin fade with a bold bald base at 0 mm rising close to the upper parietal area. Blend quickly but smoothly from skin into the top, keeping the transition\n  clean and barber-precise. Top length should remain structured and proportional, usually 3-6 cm unless the original hair allows more. Edges and neckline are crisp. Avoid harsh ledges, unrealistic contrast,\n  painted hair density, or making the style look like a wig cap."],
  ["fade", "Fade Styles", "Drop Fade", "Drop fade following a curved path that dips lower behind the ear and around the occipital area. Fade starts close at 0-1 mm near the ear and neckline, then blends\n  upward while preserving the drop shape. Top can remain textured, curly, cropped, or medium depending on original hair. The curve must follow natural skull structure. Neckline is tapered cleanly. Avoid a\n  straight horizontal fade, hard bands, exaggerated curves, or artificial edge enhancement."],
  ["fade", "Fade Styles", "Burst Fade", "Burst fade centered around the ear, radiating in a rounded semicircle from sideburn to behind the ear. Base starts at 0-1 mm around the ear and blends into longer\n  hair toward the back and top. Works well with textured tops, curls, faux hawk, or mohawk-inspired shapes. The fade should look rounded and precise but not painted. Neckline may remain slightly fuller\n  depending on top style. Avoid full side fade flattening, harsh disconnection, or unrealistic circular patches."],
  ["fade", "Fade Styles", "Temple Fade", "Temple fade focused at the temples and sideburn area, starting around 0-1 mm and blending into the surrounding side hair. The rest of the sides and back remain more\n  natural or lightly tapered. Top shape should stay unchanged with realistic density. Temple points are clean and sharp without creating an artificial hairline. Neckline is softly tapered. Avoid turning it\n  into a full high fade, over-darkening the front line, or removing too much side hair."],
  ["fade", "Fade Styles", "Taper Fade", "Classic taper fade concentrated around sideburns and neckline, starting around 1-2 mm at the edges and gradually blending into natural side length. Top remains\n  medium-short or natural, with no extreme contrast. The fade should be subtle, wearable, and clean, especially around ears and nape. Neckline is tapered smoothly. Finish is natural and low shine. Avoid bald\n  skin exposure too high, harsh fade bands, exaggerated lineup, or overly trendy contrast."],
  ["fade", "Fade Styles", "Low Taper Fade", "Low taper fade with very subtle shortening at the sideburns and lower nape only. Base length begins around 1-2 mm and softly blends into the natural side hair.\n  Top remains untouched or lightly shaped, preserving the client\u0027s original direction and density. The result should look clean but conservative. Neckline is tapered, not boxed. Avoid high fade placement,\n  visible scalp exposure above the ears, hard lines, or artificial hairline correction."],
  ["fade", "Fade Styles", "Mid Taper Fade", "Mid taper fade with the taper rising slightly higher around the temples and back neckline while keeping a natural overall silhouette. Start around 0.5-2 mm at\n  sideburns and nape, blending into 6-12 mm upper sides. Top can be styled naturally with light texture. The transition must be smooth and professional. Avoid turning it into a skin fade, creating harsh\n  disconnection, or adding fake density along the hairline."],
  ["fade", "Fade Styles", "High Taper Fade", "High taper fade with a visible taper around temples and neckline that rises higher than a classic taper but does not become a full high fade. Start close around\n  0.5-1 mm at the edges and blend smoothly upward. Top remains connected and proportional with natural texture. Temple edges are clean but realistic. Neckline is tight and tapered. Avoid overly bald sides,\n  hard weight lines, exaggerated edge-up, or glossy artificial finish."],
  ["fade", "Fade Styles", "Bald Fade", "Bald fade with the lower sides and back shaved to true skin at 0 mm, then blended upward through a smooth gradient into the top. Fade height should suit the selected\n  style but must have no visible banding. Top hair remains natural and clearly connected unless the haircut requires contrast. Edges are precise and barber-clean. Avoid patchy fade transitions, excessive scalp\n  shine, fake hairline filling, or making the side shape look digitally painted."],
  ["fade", "Fade Styles", "Shadow Fade", "Shadow fade that keeps a dark soft shadow rather than fading fully to bald skin. Base length starts around 2-4 mm near ears and nape, blending gradually into longer\n  side hair. The gradient should be smooth but retain visible hair density throughout. Top remains natural with controlled shape. Neckline and temples are clean but not overly sharp. Avoid bald patches, high\n  contrast skin fade, harsh weight lines, or artificial edge coloring."],
  ["business", "Business Styles", "Classic Side Part", "Traditional classic side part with top length around 6-8 cm, combed neatly from a natural side part across the head. Front has slight controlled lift,\n  not a pompadour. Sides and back are scissor-over-comb tapered or clipper tapered around 6-12 mm, blending softly into the top. Finish is polished with natural low shine pomade or cream. Neckline is tapered\n  cleanly. Avoid hard shaved parts, messy texture, high fades, helmet hair, or artificial glossy shine."],
  ["business", "Business Styles", "Modern Side Part", "Modern side part with top length around 6-9 cm, styled diagonally from a clean side part with moderate volume and softer texture. Sides and back are\n  tighter than a classic business cut, using a low taper or low fade that blends smoothly into the top. Crown remains controlled without flattening. Finish is natural matte or low shine. Neckline is neat and\n  tapered. Avoid overly wet slicking, exaggerated height, hard disconnection, or changing the natural hairline."],
  ["business", "Business Styles", "Hard Part", "Hard part hairstyle with top length around 5-8 cm and a narrow razor-defined part line, approximately 1-2 mm wide, following the natural side part. Hair is\n  combed cleanly away from the part with controlled direction. Sides and back use a taper or fade depending on face shape, blending into the top without a heavy shelf. Finish is polished and barber-sharp.\n  Avoid making the part too wide, crooked, overly dramatic, or pairing it with messy fringe."],
  ["business", "Business Styles", "Business Cut", "Professional business cut with top length around 4-7 cm, neatly shaped for everyday office styling. Hair may be brushed to the side or slightly back with\n  controlled natural movement. Sides and back are conservative tapered, around 6-15 mm, with smooth scissor-over-comb blending. Neckline is clean and natural. Finish is low shine and tidy. Avoid trendy high\n  fades, messy spikes, heavy gel, exaggerated volume, or an unnaturally sharp hairline."],
  ["business", "Business Styles", "Executive Cut", "Executive cut with refined side part styling, top length around 6-9 cm, and clean professional contour. Front is lightly lifted then combed back and to the\n  side. Sides are scissor-tapered or softly clipper-tapered, maintaining enough density for a mature polished silhouette. Crown lies smooth without looking flat. Finish is controlled with natural shine.\n  Neckline is tapered. Avoid extreme fades, wet helmet effect, messy texture, or fake hairline enhancement."],
  ["business", "Business Styles", "Gentleman Cut", "Elegant gentleman cut with top length around 5-8 cm, softly combed back or side-swept with a refined natural part. Sides and back are medium-short with\n  scissor-over-comb tapering, preserving a classic masculine shape. Top has smooth flow, mild volume, and subtle texture. Edges are clean but not aggressively lined. Finish is premium low shine cream. Avoid\n  hard fades, spiky styling, greasy shine, or overly perfect artificial density."],
  ["business", "Business Styles", "Comb Over", "Classic comb over with top length around 6-9 cm, directed cleanly from one side across the top while preserving natural volume. Part line may be soft and\n  natural rather than shaved. Sides and back are tapered short, blending into the top without obvious disconnection. Finish is smooth with low to medium natural shine. Neckline is clean and tapered. Avoid\n  covering bald areas unnaturally, helmet-like sheets of hair, excessive gel, or fake hairline filling."],
  ["business", "Business Styles", "Comb Over Fade", "Modern comb over fade with top length around 6-8 cm, combed diagonally across from a defined part. Sides and back use a low to mid fade starting around\n  0.5-2 mm and blending smoothly into the top. The parietal ridge should be softened to avoid a shelf. Finish is polished with light hold and low shine. Neckline is tight. Avoid high disconnected sides, overly\n  wide hard part, wet plastic shine, or artificial edge-up."],
  ["business", "Business Styles", "Side Swept", "Side swept hairstyle with top length around 7-10 cm, brushed naturally to one side with soft movement and slight front lift. Sides and back are tapered or\n  lightly faded to keep the style professional but modern. Crown blends smoothly with no flat spot. Texture should be touchable and natural, using light cream or matte paste. Neckline is clean. Avoid stiff\n  comb lines, heavy gel, extreme volume, or hair falling fully into the eyes."],
  ["business", "Business Styles", "Short Side Part Fade", "Short side part fade with top length around 4-6 cm and a compact side-combed shape. Part is clean but not overly wide. Sides and back use a low or\n  mid fade starting around 0.5-1 mm, blended smoothly into the top. Front has minimal lift and a tidy professional finish. Neckline is tapered sharply. Avoid high fade placement, messy fringe, exaggerated\n  pomade shine, or an unnatural drawn-in hairline."],
  ["volume", "Volume Styles", "Pompadour", "Classic pompadour with front length around 9-12 cm, styled upward from the forehead and then swept backward into a rounded high shape. Crown length around 6-8 cm\n  supports volume without collapsing. Sides and back are tapered or softly faded, staying clean but not overly disconnected. Top is blow-dried with volume cream or light pomade for controlled natural shine.\n  Neckline is tapered. Avoid stiff spikes, hollow exaggerated height, helmet hair, or wig-like density."],
  ["volume", "Volume Styles", "Modern Pompadour", "Modern pompadour with top length around 8-11 cm, front lifted high and swept back with visible texture rather than a perfectly smooth shell. Sides and back\n  use a low to mid fade or tight taper, blending into the longer top with softened parietal edges. Crown keeps enough density for shape. Finish is matte or low shine with flexible hold. Avoid greasy vintage\n  slicking, extreme cartoon height, hard shelf lines, or artificial hairline reshaping."],
  ["volume", "Volume Styles", "Classic Pompadour", "Classic polished pompadour with long front section around 10-12 cm, rolled upward and backward into a smooth rounded silhouette. Sides are scissor-tapered\n  or conservatively clipped, not aggressively faded. Crown is controlled and slightly lower than the front. Finish uses medium shine pomade or cream for a refined vintage look. Neckline is tapered cleanly.\n  Avoid messy texture, dry spikes, flat front, excessive height, or plastic-looking shine."],
  ["volume", "Volume Styles", "Short Pompadour", "Short pompadour with front length around 6-8 cm, lifted upward and brushed back into a compact volume shape. Crown is shorter around 4-6 cm and blended\n  naturally. Sides and back are tapered or low faded, keeping the look clean and wearable. Finish is matte to low shine with controlled hold. Neckline is neat. Avoid making it a quiff with sideways movement,\n  overinflated volume, stiff spikes, or overly glossy helmet texture."],
  ["volume", "Volume Styles", "Quiff", "Modern quiff with front and top length around 8-10 cm, shorter toward the crown around 6-7 cm. Hair at the forehead is lifted upward first, then slightly swept\n  backward with natural airflow. Sides and back use a low taper fade starting around 0-1 mm near ears, blending smoothly into longer hair above. Top is lightly layered for texture and styled with matte clay.\n  Neckline is tapered cleanly. Avoid sideways parting, stiff spikes, helmet hair, or artificial shine."],
  ["volume", "Volume Styles", "Textured Quiff", "Textured quiff with top length around 7-10 cm, front lifted and pushed back with separated, choppy movement. Crown remains medium density and slightly shorter\n  to support shape. Sides and back use a low or mid taper fade, blended softly without a harsh weight line. Styling uses matte clay or texture powder for dry volume. Finish should look flexible and touchable.\n  Avoid glossy pomade, needle spikes, exaggerated height, or flat compressed crown."],
  ["volume", "Volume Styles", "Short Quiff", "Short quiff with front length around 5-7 cm, lifted slightly upward and backward into a compact everyday shape. Top is lightly textured while crown stays\n  controlled. Sides and back are tapered short or low faded around the ears and neckline. Finish is matte and natural with moderate hold. Neckline is clean. Avoid tall pompadour height, sideways comb-over\n  direction, wet gel shine, stiff spikes, or changing the natural hairline."],
  ["volume", "Volume Styles", "Messy Quiff", "Messy quiff with top length around 7-10 cm, front lifted upward and loosely pushed back with intentional irregular texture. Sides and back are cleanly tapered or\n  low faded to balance the loose top. Crown should remain full but not chaotic. Use matte paste for piecey separation and natural movement. Neckline is tapered. Avoid unwashed frizz, stiff gel spikes,\n  excessive height, helmet clumps, or a fake perfectly symmetrical shape."],
  ["volume", "Volume Styles", "Side Quiff", "Side quiff with front length around 7-9 cm, lifted at the forehead and angled slightly to one side while still maintaining upward volume. Top is layered for\n  movement, crown medium-short and controlled. Sides and back use a taper or low fade that blends into the top. Finish is matte or low shine with flexible hold. Avoid turning it into a flat side part, extreme\n  pompadour height, stiff spikes, or unnatural glossy texture."],
  ["volume", "Volume Styles", "Volume Top", "Volume top haircut with top length around 7-11 cm, styled upward and back or naturally lifted depending on hair direction. Crown keeps enough density for fullness\n  while sides and back are cut shorter with a taper or fade to emphasize height. Top texture should be airy and realistic, using blow-dry volume and matte product. Neckline is cleanly tapered. Avoid\n  exaggerated cartoon volume, flat crown, sticky gel shine, or wig-like thickness."],
  ["slick", "Slick Back Styles", "Slick Back", "Slick back hairstyle with top length around 9-12 cm, combed straight backward from the forehead toward the crown. No fringe should fall forward and no strong\n  side part should dominate. Sides and back are tapered or faded cleanly, blending into the longer top. Finish may be natural low shine or medium shine depending on hair type, with smooth comb lines. Neckline\n  is clean. Avoid messy front pieces, puffed pompadour height, greasy wet overload, or artificial hair density."],
  ["slick", "Slick Back Styles", "Slick Back Fade", "Slick back fade with top length around 9-12 cm, combed backward cleanly over a tight faded side structure. Sides and back use a low to mid fade beginning\n  around 0-1 mm and blending into the upper sides without a harsh shelf. Top is smooth with controlled direction and no loose fringe. Finish is low to medium shine pomade. Neckline is sharp and tapered. Avoid\n  disconnected undercut unless visible in the original style, messy texture, or helmet shine."],
  ["slick", "Slick Back Styles", "Classic Slick Back", "Classic slick back with uniform top length around 10-12 cm, combed directly backward with smooth continuous flow from hairline to crown. Sides and back\n  are scissor-tapered or conservatively clipped, keeping a traditional silhouette. Crown lies controlled and not overly lifted. Finish uses medium shine pomade for a refined barber look. Neckline is tapered.\n  Avoid dry messy texture, sideways parting, exaggerated volume, greasy clumps, or changing the natural hairline."],
  ["slick", "Slick Back Styles", "Textured Slick Back", "Textured slick back with top length around 8-11 cm, brushed backward while preserving visible strand separation and natural movement. Sides and back\n  are tapered or low faded, softly blended into the top. Crown should remain controlled but not flat. Finish is matte cream or low shine paste, not wet gel. Neckline is clean. Avoid messy forward fringe,\n  overly polished helmet surface, stiff product buildup, or artificial shine."],
  ["slick", "Slick Back Styles", "Wet Look Slick Back", "Wet look slick back with top length around 9-12 cm, combed backward from the forehead with glossy controlled shine. Sides and back are cleanly tapered\n  or faded to support the sleek top. The wet finish should look like premium styling product, not greasy or dripping. Comb direction is consistent and no fringe falls forward. Neckline is neat. Avoid dry matte\n  texture, excessive puffiness, oily skin shine, or plastic-looking hair."],
  ["slick", "Slick Back Styles", "Brush Back", "Natural brush back with top length around 7-10 cm, brushed backward using fingers or a vent brush for soft movement rather than slick comb lines. Sides and\n  back are tapered, keeping a masculine everyday shape. Crown has natural lift and flow without becoming a pompadour. Finish is matte or natural low shine with light hold. Neckline is tapered cleanly. Avoid\n  wet slicking, messy forward fringe, exaggerated height, or stiff separated spikes."],
  ["slick", "Slick Back Styles", "Short Brush Back", "Short brush back with top length around 5-7 cm, directed backward from the forehead with compact volume. Sides and back are short tapered or low faded,\n  blending smoothly into the top. Crown stays controlled and natural. Styling uses light matte paste or cream for flexible hold. Neckline is clean and conservative. Avoid long slick-back flow, greasy shine,\n  hard parting, stiff spikes, or artificially squared hairline."],
  ["slick", "Slick Back Styles", "Disconnected Slick Back", "Disconnected slick back with long top around 10-13 cm combed backward over very short sides. Sides and back are clipped close around 0-2 mm with a\n  clear contrast line under the longer top. The disconnection should be intentional and sharp but still realistic. Top finish can be smooth low shine or medium shine. Neckline is tight. Avoid blending away the\n  contrast, messy fringe, excessive puff height, or wig-like top thickness."],
  ["medium", "Medium Length Styles", "Medium Layered Hair", "Medium layered men\u0027s haircut with length around 8-14 cm, sitting around the ears and upper neck depending on natural hair. Layers are cut through\n  the top and sides to create movement without thinning the ends too much. Hair flows naturally backward, sideways, or with a soft part. Back is shaped cleanly at the nape with light tapering. Finish is\n  natural and touchable. Avoid bowl shape, artificial extensions, overly glossy product, or flat helmet texture."],
  ["medium", "Medium Length Styles", "Medium Flow", "Medium flow hairstyle with length around 10-15 cm, brushed back or slightly away from the face with natural movement. Sides are long enough to tuck or\n  flow around the ears, while the back reaches the upper nape. Layers should encourage movement and avoid bulky triangular shape. Finish is low shine cream with soft control. Neckline is lightly cleaned. Avoid\n  forced slick-back, unnatural added length, stiff product, or exaggerated windblown volume."],
  ["medium", "Medium Length Styles", "Bro Flow", "Bro flow hairstyle with medium-long length around 12-16 cm, swept backward naturally from the forehead and around the ears. Hair should look grown out but\n  shaped, with soft layers and movement through the sides and back. Neckline sits near the nape and remains lightly groomed. Finish is natural, low shine, and relaxed. Avoid formal slicking, fake extensions,\n  messy untrimmed ends, excessive volume, or changing the hairline."],
  ["medium", "Medium Length Styles", "Curtains", "Curtains hairstyle with medium length around 9-14 cm and a center or slightly off-center part. Front sections fall like soft curtains to each side of the\n  forehead, usually reaching brow to cheekbone level. Sides blend into the front with layered movement, and back is shaped around the nape. Finish is natural matte or low shine. Avoid heavy bowl shape, greasy\n  middle part, perfectly fake symmetry, or strands covering the eyes unnaturally."],
  ["medium", "Medium Length Styles", "Middle Part", "Middle part hairstyle with top and side length around 8-14 cm, parted cleanly down the center and falling evenly to both sides. Front should frame the\n  forehead naturally without becoming long bangs. Sides and back remain medium and layered for movement, with nape lightly shaped. Finish is natural low shine. Avoid flat lifeless panels, artificial\n  extensions, wet greasy parting, or overly perfect mirrored symmetry."],
  ["medium", "Medium Length Styles", "Side Part Medium", "Medium side part with length around 9-14 cm, styled from a soft natural side part with relaxed flow across the top. Sides are longer than a business\n  cut and blend into the back with layers. Hair can fall around the ears while remaining groomed. Finish is natural cream or light paste with movement. Neckline is lightly cleaned. Avoid hard razor part, tight\n  fade, stiff comb lines, or fake dense hair."],
  ["medium", "Medium Length Styles", "Surfer Hair", "Surfer hair with medium length around 10-16 cm, loose layered movement, and relaxed beachy texture. Hair falls naturally around the forehead, ears, and\n  nape with soft bends or waves. Ends are lightly textured and not blunt. Finish is matte, airy, and slightly tousled, as if salt spray was used. Avoid greasy product, formal combing, artificial highlights\n  unless selected, excessive frizz, or unnatural extensions."],
  ["medium", "Medium Length Styles", "Layered Side Sweep", "Layered side sweep with medium length around 9-15 cm, directed diagonally across the forehead and to one side. Front has soft movement while the\n  sides and back are layered to reduce bulk. The sweep should look natural and controlled, not like a heavy fringe. Neckline is shaped around the nape. Finish is low shine cream or matte paste. Avoid covering\n  the entire face, stiff gel, hard parting, or fake added length."],
  ["medium", "Medium Length Styles", "Medium Messy Hair", "Medium messy hairstyle with length around 8-14 cm and intentionally loose texture throughout the top, sides, and back. Layers create separation and\n  natural movement while preserving density. Hair direction can be irregular but should still frame the face attractively. Finish is matte and touchable, like light clay or texture spray. Neckline remains\n  lightly groomed. Avoid dirty unkempt appearance, stiff spikes, exaggerated volume, or AI frizz."],
  ["medium", "Medium Length Styles", "Textured Medium Cut", "Textured medium cut with length around 8-13 cm, layered through the top and sides for controlled separation. Front may move forward, back, or\n  sideways depending on natural growth, but should show defined texture. Sides are shaped around the ears and back tapers lightly at the nape. Finish is matte or natural low shine with flexible hold. Avoid\n  helmet shape, overly thin ends, artificial extensions, or plastic-looking strands."],
  ["long", "Long Hair Styles", "Long Layered Hair", "Long men\u0027s layered hair reaching below the ears to shoulder level or longer, depending on the original hair. Layers are blended through mid-lengths and\n  ends to create movement while preserving masculine density. Hair flows naturally back, to the sides, or with a soft part. Ends should look healthy and tapered, not blunt or stringy. Finish is natural low\n  shine. Avoid unnatural extensions, overly feminine blowout, plastic shine, or changing the hairline."],
  ["long", "Long Hair Styles", "Shoulder Length Hair", "Shoulder length hairstyle with hair falling around the shoulders and collar area, shaped with subtle layers for movement. Front pieces may frame the\n  face while sides cover or tuck behind the ears. Back length reaches near the shoulders with natural density and clean ends. Finish is relaxed, realistic, and low shine. Avoid sudden unrealistic length gain\n  if original hair is very short, wig-like thickness, frizzy unshaped ends, or glossy artificial texture."],
  ["long", "Long Hair Styles", "Long Flow", "Long flow hairstyle with length reaching the neck, shoulders, or upper back depending on source hair, brushed naturally backward away from the face. Layers create\n  smooth movement and prevent heavy bulk around the sides. Hair should look masculine, relaxed, and healthy, with natural bends. Finish is light cream or natural low shine. Neckline blends into length. Avoid\n  fake extensions, stiff slicking, excessive volume, or plastic-perfect strands."],
  ["long", "Long Hair Styles", "Man Bun", "Man bun using long hair gathered into a bun at the crown or back of the head. Hair length should appear sufficient, generally 20 cm or more, with natural tension\n  pulling hair backward from the hairline. Sides may remain long or be cleaner depending on original style, but scalp and hairline must stay realistic. Bun should have natural volume and loose strand detail.\n  Avoid tiny fake knot, unrealistic length creation, overly tight plastic surface, or changing the face shape."],
  ["long", "Long Hair Styles", "Top Knot", "Top knot with longer top hair gathered into a compact knot high on the crown, often paired with shorter sides or an undercut. Top length should appear at least 15-\n  20 cm when tied. Sides and back may be tapered, faded, or shorter for contrast. Hair is pulled back with natural tension and a few realistic loose strands. Avoid oversized bun, artificial extensions,\n  feminine updo styling, plastic shine, or unnatural scalp exposure."],
  ["long", "Long Hair Styles", "Half Up Man Bun", "Half up man bun with upper hair gathered into a small bun while lower length remains loose. Total hair length should reach at least the neck or shoulders.\n  The top section is pulled back naturally, leaving sides and back flowing with layered movement. Finish is relaxed and masculine with natural texture. Avoid fake sudden length, oversized bun, overly polished\n  bridal look, stiff strands, or hiding the natural hairline."],
  ["long", "Long Hair Styles", "Long Middle Part", "Long middle part with hair parted down the center and falling evenly to both sides, reaching neck, shoulder, or longer length. Layers should frame the face\n  and keep the sides from looking heavy. Back flows naturally with clean ends and realistic density. Finish is natural low shine with soft movement. Avoid perfectly symmetrical wig panels, greasy part line,\n  artificial extensions, excessive volume, or changing forehead shape."],
  ["long", "Long Hair Styles", "Long Side Part", "Long side part with hair length reaching the neck or shoulders, parted naturally to one side and sweeping across with soft flow. Layers reduce weight around\n  the face and sides while preserving length in the back. Hair should look masculine, healthy, and realistic. Finish is light cream or natural shine. Avoid hard business-style parting, fake added length,\n  overly glossy strands, heavy face coverage, or wig-like density."],
  ["long", "Long Hair Styles", "Long Wavy Hair", "Long wavy hair with length reaching neck, shoulders, or longer, preserving natural wave movement through mid-lengths and ends. Waves should be defined but\n  not curled into ringlets unless naturally present. Layers create flow and reduce bulk around the sides and back. Finish is moisturized low shine with realistic texture. Avoid straightening the waves, fake\n  extensions, frizzy AI strands, exaggerated beach volume, or plastic shine."],
  ["long", "Long Hair Styles", "Long Slick Back", "Long slick back with hair length reaching the neck or shoulders, combed backward smoothly away from the forehead. The top and sides flow back into the\n  longer back length with controlled direction. Finish can be natural shine or medium shine depending on product, but should not look greasy. Hairline remains natural and visible. Avoid short slick-back shape,\n  messy forward pieces, artificial extensions, excessive wet shine, or helmet surface."],
  ["curly", "Curly And Wavy Hair", "Short Curly Hair", "Short curly hairstyle preserving natural curl pattern at around 3-6 cm on top. Curls are defined individually with controlled volume, not brushed out\n  or straightened. Sides and back are tapered short while maintaining a soft blend into the curly top. Edges are clean but natural. Finish uses curl cream with low shine and hydrated texture. Avoid frizz halo,\n  straightened top, fake spiral uniformity, or overly sharp artificial hairline."],
  ["curly", "Curly And Wavy Hair", "Curly Top Fade", "Curly top fade with curls kept around 5-8 cm on top, defined and hydrated with natural spring. Sides and back use a low to mid fade starting around 0-1\n  mm, blending smoothly into the curl mass without a harsh shelf. Crown volume is balanced and rounded. Neckline is clean. Avoid straightening curls, cutting curls into flat blocks, excessive frizz, plastic\n  curl repetition, or artificial edge enhancement."],
  ["curly", "Curly And Wavy Hair", "Curly Fringe", "Curly fringe style with top curls around 5-9 cm directed forward so curls fall naturally toward the forehead. Fringe should sit around the upper forehead\n  or brow area without covering the eyes too heavily. Sides and back are tapered or faded to balance volume. Curl definition remains authentic with hydrated texture. Avoid straight bangs, fake identical\n  ringlets, excessive forehead coverage, dry frizz, or reshaping the hairline."],
  ["curly", "Curly And Wavy Hair", "Medium Curly Hair", "Medium curly hair with length around 8-14 cm, allowing natural curl volume and rounded shape around the head. Layers should manage bulk while\n  preserving curl pattern and density. Sides and back remain medium and shaped around ears and nape. Finish uses curl cream or leave-in product for definition and low shine. Avoid straightening, triangular\n  bulk, artificial spiral uniformity, frizz explosion, or fake extensions."],
  ["curly", "Curly And Wavy Hair", "Long Curly Hair", "Long curly hairstyle with curls extending to the neck, shoulders, or longer depending on original hair. Layers are shaped to prevent heaviness while\n  preserving natural curl pattern, bounce, and density. Curls should vary naturally in size and direction. Finish is hydrated with soft definition and low shine. Avoid straightening curls, adding unrealistic\n  length, plastic ringlets, excessive frizz, or flattening the crown."],
  ["curly", "Curly And Wavy Hair", "Wavy Crop", "Short wavy crop with top length around 4-6 cm, preserving natural wave bends through the top and fringe. Hair is lightly textured and directed forward or\n  slightly messy. Sides and back are low to mid tapered or faded, blending softly into the wavy top. Finish is matte or low shine with controlled movement. Avoid straightening waves, sharp spikes, heavy bowl\n  shape, wet gel, or fake hairline edges."],
  ["curly", "Curly And Wavy Hair", "Wavy Side Part", "Wavy side part with top length around 6-9 cm, using natural waves to create soft movement away from a side part. Sides and back are tapered, not overly\n  tight, so the waves transition naturally. Crown remains controlled with visible texture. Finish is low shine cream for flexible hold. Avoid flattening the waves, hard razor part, glossy slick surface, high\n  skin fade unless suited, or artificial wave repetition."],
  ["curly", "Curly And Wavy Hair", "Wavy Slick Back", "Wavy slick back with top length around 8-11 cm, brushed backward while keeping natural wave texture visible. Sides and back are tapered or lightly\n  faded, blended into the wavy top. Finish is low to medium shine cream or pomade, controlled but not flat. Waves should flow backward naturally. Avoid straightening the hair, greasy wet overload, messy\n  forward fringe, plastic shine, or eliminating natural volume."],
  ["curly", "Curly And Wavy Hair", "Textured Waves", "Textured waves hairstyle with medium-short to medium length around 6-12 cm, emphasizing natural wave bends and separated movement. Sides and back are\n  shaped with a taper or soft fade while preserving texture. Top is styled with matte cream or sea-salt texture for flexible definition. Neckline is clean. Avoid uniform fake waves, straightening, excessive\n  frizz, stiff gel, or exaggerated volume."],
  ["curly", "Curly And Wavy Hair", "Messy Waves", "Messy waves with length around 7-13 cm, loose irregular wave texture, and relaxed movement through the top and sides. Hair should look intentionally tousled\n  but still groomed, with controlled volume and natural direction. Sides and back are lightly shaped, not overly tight. Finish is matte or low shine texture spray. Avoid dirty unkempt look, frizz overload,\n  fake identical waves, heavy wet product, or artificial extensions."],
  ["fringe", "Fringe Styles", "Textured Fringe", "Textured fringe with top length around 5-8 cm, directed forward so the front falls naturally onto the forehead with choppy separation. Fringe should sit\n  around the upper to mid forehead, not fully cover the eyes. Sides and back use a taper or fade, blended into the textured top. Finish is dry matte paste with visible movement. Avoid straight bowl bangs,\n  stiff spikes, wet shine, overly heavy forehead coverage, or fake hairline fill."],
  ["fringe", "Fringe Styles", "Short Fringe", "Short fringe haircut with top length around 3-5 cm and a compact front fringe resting high on the forehead. Hair is directed forward with light texture and\n  controlled density. Sides and back are tapered or faded cleanly, keeping the silhouette sharp. Finish is matte and natural. Neckline is clean. Avoid long bangs, bowl-cut heaviness, glossy gel, spiky top, or\n  an unnaturally straight artificial fringe line."],
  ["fringe", "Fringe Styles", "Long Fringe", "Long fringe with top/front length around 8-12 cm, falling forward toward the brow or slightly below while remaining styled and intentional. Sides and back are\n  tapered or undercut depending on the desired contrast, but must blend naturally with the top. Fringe texture should be layered and piecey, not one solid sheet. Finish is matte with movement. Avoid covering\n  the eyes completely, greasy strands, wig-like density, or changing the hairline."],
  ["fringe", "Fringe Styles", "Angular Fringe", "Angular fringe with front length around 6-10 cm cut diagonally across the forehead. Hair falls forward and to one side with clear angled direction and\n  textured ends. Sides and back are faded or tapered, often mid fade for contrast, blending into the top without a harsh shelf. Finish is matte and modern. Avoid straight horizontal bangs, extreme cartoon\n  angle, glossy gel, stiff spikes, or artificial hairline shaping."],
  ["fringe", "Fringe Styles", "Side Swept Fringe", "Side swept fringe with top length around 7-11 cm, falling forward then sweeping naturally to one side. Fringe should frame the forehead without covering\n  the face too heavily. Sides and back are tapered or softly faded, preserving balance with the longer front. Texture is soft and layered with low shine finish. Avoid hard business side part, wet slicking,\n  heavy eye coverage, fake extensions, or stiff comb lines."],
  ["fringe", "Fringe Styles", "Messy Fringe", "Messy fringe with top/front length around 6-9 cm, directed forward with irregular piecey texture and natural separation. Sides and back are cleanly tapered or\n  faded to keep the loose fringe intentional. Crown should remain textured but not chaotic. Finish is matte paste or clay. Avoid dirty frizz, overly long bangs, wet gel shine, straight bowl fringe, or\n  artificial density at the hairline."],
  ["fringe", "Fringe Styles", "French Crop Fringe", "French crop fringe with top length around 3.5-5 cm and a defined forward fringe sitting above or near the eyebrows. Fringe edge is compact and slightly\n  textured, not perfectly fake. Sides and back use a mid fade or tight taper, blended into the crop. Finish is matte with controlled texture. Avoid long sweeping bangs, spiky top, glossy product, harsh bowl\n  shape, or overdrawn lineup."],
  ["fringe", "Fringe Styles", "Curly Fringe Style", "Curly fringe style with curls around 6-10 cm directed forward so natural curls fall over the forehead. Sides and back are tapered or faded to balance the\n  curly front. Curl pattern must stay authentic, hydrated, and varied, with controlled volume. Fringe should not fully hide the eyes. Finish uses curl cream with low shine. Avoid straightening curls, fake\n  identical ringlets, dry frizz, or artificial hairline correction."],
  ["modern", "Modern Edgy Styles", "Undercut", "Undercut with top length around 8-12 cm or longer and sides/back clipped very short around 0-3 mm. The top is clearly separated from the short sides with\n  intentional contrast, while the top may be slicked back, textured, or side styled. Disconnection should be sharp but realistic. Neckline is tight and clean. Avoid blending it into a taper, making the top\n  look like a wig, excessive shine unless slicked, or unrealistic scalp edges."],
  ["modern", "Modern Edgy Styles", "Disconnected Undercut", "Disconnected undercut with a strong visible separation between long top hair around 9-13 cm and very short sides at 0-1.5 mm. No soft blend at the\n  parietal ridge; the contrast line is intentional and clean. Top is styled back or to the side with density preserved. Finish can be matte or low shine. Neckline is sharp. Avoid fading away the disconnection,\n  cartoon contrast, fake hair thickness, or messy fringe unless selected."],
  ["modern", "Modern Edgy Styles", "Modern Undercut", "Modern undercut with top length around 7-11 cm, textured or brushed back, paired with short sides and back around 0.5-3 mm. The transition may be\n  slightly softened but should retain strong contrast. Top has natural movement and controlled styling with matte paste or cream. Neckline and sideburns are clean. Avoid old-fashioned bowl undercut, greasy\n  helmet finish, extreme artificial volume, or unnatural hairline reshaping."],
  ["modern", "Modern Edgy Styles", "Faux Hawk", "Faux hawk with top length around 5-9 cm styled upward and inward toward the center line without fully shaved mohawk sides. Sides and back are faded or tapered\n  short, blending into the central top ridge. Texture is piecey and matte, with controlled height through the front and crown. Neckline is clean. Avoid extreme punk spikes, overly narrow strip, glossy gel\n  needles, or cartoonish height."],
  ["modern", "Modern Edgy Styles", "Mohawk", "Mohawk with a central strip of longer hair running from forehead to nape, length around 5-10 cm depending on source hair. Sides are clipped very short or faded\n  close, creating strong contrast. The central hair may be textured upward or naturally shaped but should remain realistic. Edges are clean and sharp. Avoid impossible height, plastic spikes, uneven strip\n  placement, or changing head shape unnaturally."],
  ["modern", "Modern Edgy Styles", "Burst Fade Mohawk", "Burst fade mohawk with a rounded fade around each ear starting at 0-1 mm and blending into a longer central mohawk shape. Top and back keep length\n  around 5-9 cm with textured upward or forward movement. The burst fade should curve naturally behind the ear, not become a full side fade. Finish is matte and controlled. Avoid exaggerated punk height, harsh\n  fade bands, fake hairline edges, or plastic texture."],
  ["modern", "Modern Edgy Styles", "Spiky Hair", "Spiky hair with short layered top around 4-6 cm, styled upward into separated soft spikes. Sides and back are tapered or faded short for a clean outline.\n  Spikes should have flexible matte texture, not hard gel needles. Crown remains controlled and proportional. Neckline is clean. Avoid wet glossy product, extreme anime spikes, overly sharp artificial points,\n  or changing the natural front hairline."],
  ["modern", "Modern Edgy Styles", "Textured Spikes", "Textured spikes with top length around 4-7 cm, cut in layers and styled upward with irregular piecey separation. Sides and back are low to mid faded or\n  tapered, blended smoothly into the top. Finish is dry matte clay with flexible hold and natural movement. Spikes should look modern and soft. Avoid stiff gel clumps, wet shine, cartoon spikes, excessive\n  height, or painted density."],
  ["modern", "Modern Edgy Styles", "Messy Top Fade", "Messy top fade with top length around 5-8 cm, styled into loose textured movement while sides and back use a clean low or mid fade. Fade starts around\n  0.5-1 mm and blends smoothly upward. Top texture is matte and intentionally imperfect but controlled. Neckline is tapered and sharp. Avoid dirty frizz, uneven fade bands, stiff spikes, excessive volume, or\n  artificial hairline enhancement."],
  ["modern", "Modern Edgy Styles", "Disconnected Crop", "Disconnected crop with short textured top around 4-6 cm and noticeably shorter sides, often 0-2 mm, creating strong contrast under the crop. Fringe is\n  forward and choppy, while the parietal connection is intentionally sharp or minimally blended. Finish is matte and modern. Neckline is tight. Avoid soft business taper, long fringe, glossy helmet texture, or\n  unrealistic blocky hair shape."],
  ["afro", "Afro Coily Hair", "Short Afro", "Short afro with natural coily texture shaped into a compact rounded silhouette around 2-5 cm high. Curl coils must remain authentic with visible density variation\n  and natural scalp behavior. Sides and back are lightly tapered or shaped without removing the afro character. Edges may be cleaned but not overdrawn. Finish is natural low shine with moisturized texture.\n  Avoid straightening, plastic sponge texture, fake painted hairline, or perfectly uniform helmet shape."],
  ["afro", "Afro Coily Hair", "Medium Afro", "Medium afro with natural coily hair shaped into a fuller rounded form around 5-9 cm high. Volume should be balanced across top, sides, and crown while preserving\n  authentic coil density. Edges are softly shaped, with optional light taper around sideburns and nape. Finish is moisturized and natural, not shiny plastic. Avoid flattening coils, fake uniform texture,\n  exaggerated cartoon roundness, or artificial hairline filling."],
  ["afro", "Afro Coily Hair", "Afro Fade", "Afro fade with natural coily volume on top around 4-8 cm and faded sides/back starting close around 0-1 mm. Fade blends upward smoothly into the afro shape without\n  a harsh shelf. Top remains rounded and dense with authentic coil texture. Hairline may be cleaned lightly but must stay realistic. Neckline is sharp and tapered. Avoid plastic texture, overdrawn lineup,\n  straightened curls, or uneven fade bands."],
  ["afro", "Afro Coily Hair", "High Top Fade", "High top fade with coily hair shaped upward into a tall structured top around 5-10 cm, with sides and back faded close from 0-1 mm. Top has a squared or softly\n  rounded vertical silhouette depending on face shape. The fade should transition cleanly into the high top with crisp but realistic edges. Finish is natural matte with authentic coil density. Avoid cartoon\n  height, painted hairline, flat plastic surface, or fake scalp texture."],
  ["afro", "Afro Coily Hair", "Low Afro Fade", "Low afro fade with natural afro texture on top around 3-7 cm and a subtle fade kept low around the ears and nape. Fade starts near 0.5-1 mm and blends softly\n  into the afro without removing too much side volume. Top remains rounded and authentic. Edges are clean but natural. Avoid high fade placement, over-sharp lineup, straightened coils, plastic uniformity, or\n  unrealistic density."],
  ["afro", "Afro Coily Hair", "Temple Fade Afro", "Temple fade afro with natural coily afro shape preserved through the top and sides, while the temple and sideburn areas fade close around 0-1 mm. The fade\n  is focused only at the temples and optionally the nape, not the full side. Afro texture remains rounded, dense, and natural. Finish is moisturized low shine. Avoid over-fading the sides, fake sharp hairline,\n  straightened coils, or plastic sponge pattern."],
  ["afro", "Afro Coily Hair", "Twist Out", "Twist out hairstyle with defined coily sections released into textured curls, length around 4-8 cm depending on hair. Pattern should show natural twist definition\n  with varied strand grouping and realistic volume. Sides and back may be shaped or lightly tapered while preserving texture. Finish is hydrated and natural. Avoid fake identical coils, dry frizz,\n  straightening, overly glossy plastic shine, or unnatural scalp exposure."],
  ["afro", "Afro Coily Hair", "Short Twists", "Short twists with small to medium two-strand sections around 3-6 cm long, evenly distributed across the scalp. Parting should look natural and realistic, with\n  visible sectioning but not overly perfect grid lines. Sides and back may be tapered lightly or kept full depending on original hair. Finish is moisturized with natural low shine. Avoid plastic rope texture,\n  fake scalp lines, excessive length, or changing the natural hairline."],
  ["afro", "Afro Coily Hair", "Medium Twists", "Medium twists with defined two-strand sections around 6-10 cm long, falling naturally with controlled volume. Parting and scalp visibility should be realistic\n  and not overly geometric. Sides and back maintain twist density or taper lightly near the edges. Finish is hydrated with natural texture. Avoid fake synthetic shine, identical twist thickness, unrealistic\n  added length, or painted hairline edges."],
  ["afro", "Afro Coily Hair", "Sponge Twists", "Sponge twists with short coily hair around 2.5-5 cm formed into small rounded twist clusters. Texture should look natural and varied, with authentic coil\n  density and subtle scalp visibility only where appropriate. Sides and back may have a low taper or fade for clean shape. Finish is matte and moisturized. Avoid plastic dot pattern, overly perfect circles,\n  straightened texture, exaggerated lineup, or artificial density."],
  ["braids", "Braids And Locs", "Cornrows", "Cornrows braided close to the scalp in neat straight or slightly curved rows, with clean parting and realistic scalp visibility. Braids should follow the head\n  shape from front to back or selected direction, maintaining even tension without looking painful. Hairline remains natural with optional soft edge cleanup. Braid texture should look authentic and not\n  plastic. Avoid fake painted scalp, uneven impossible parting, synthetic shine, or changing facial features."],
  ["braids", "Braids And Locs", "Box Braids", "Box braids with individual square-section parts and consistent braid thickness, falling naturally from the scalp. Length should be realistic for the selected\n  look and original hair context, with clean but not overly perfect parting. Braids should show natural texture and subtle variation. Edges remain realistic. Finish is low shine and authentic. Avoid plastic\n  synthetic ropes, impossible density, fake scalp grid, or unrealistic sudden extreme length."],
  ["braids", "Braids And Locs", "Short Braids", "Short braids with neat sections close to the scalp and braid length kept compact, generally ending above the ears or near the upper neck. Parting should be\n  clean and realistic with natural scalp visibility. Braids maintain authentic texture and slight variation in thickness. Sides and back follow the braid pattern naturally. Avoid fake plastic shine, overly\n  perfect grid, unrealistic length, or artificially sharpened hairline."],
  ["braids", "Braids And Locs", "Man Bun Braids", "Man bun braids with braided sections gathered into a bun at the back or crown. Braids should be cleanly sectioned and pulled with natural tension toward the\n  bun. Bun size must match the available braid length and density. Scalp parting is visible but realistic. Finish is neat with authentic braid texture. Avoid oversized fake bun, synthetic plastic shine,\n  impossible braid density, or changing the natural hairline."],
  ["braids", "Braids And Locs", "Two Strand Twists", "Two strand twists with defined rope-like sections distributed naturally across the scalp. Length may be short to medium depending on source hair, with\n  twists falling according to gravity and head shape. Parting is clean but not artificially perfect. Texture should look natural, hydrated, and varied. Edges may be lightly cleaned. Avoid plastic uniformity,\n  fake shine, impossible length gain, or overly sharp scalp grid."],
  ["braids", "Braids And Locs", "Dreadlocks", "Dreadlocks with natural locked sections, varied thickness, and realistic texture. Locs should fall naturally from the scalp with believable density and weight.\n  Length may be short, medium, or longer depending on the selected style and original hair. Parting/scalp visibility should be authentic. Finish is matte to low shine with natural fiber texture. Avoid plastic\n  ropes, identical locs, fake extensions, excessive gloss, or artificial hairline fill."],
  ["braids", "Braids And Locs", "Short Locs", "Short locs with compact locked sections around 4-8 cm long, standing or falling naturally depending on density. Sections should vary subtly in size and\n  direction for realism. Sides and back may be shaped or tapered lightly without losing the loc character. Scalp visibility is natural at the roots. Avoid synthetic shine, identical loc shapes, fake scalp\n  parting, or changing the hairline unnaturally."],
  ["braids", "Braids And Locs", "Medium Locs", "Medium locs with locked sections around 8-15 cm long, falling around the forehead, sides, or nape with realistic weight. Locs should vary naturally in\n  thickness and direction while maintaining a groomed shape. Roots and parting must look authentic. Finish is natural matte to low shine. Avoid plastic rope texture, impossible added length, overly perfect\n  uniform sections, or artificial edge enhancement."],
  ["braids", "Braids And Locs", "Loc Bun", "Loc bun with medium to long locs gathered into a bun at the crown or back of the head. Locs should pull naturally from the scalp with realistic tension and weight.\n  Bun size must match loc density and length, with a few natural loose loc details if appropriate. Finish is authentic and low shine. Avoid oversized fake bun, synthetic plastic texture, impossible length, or\n  distorted scalp parting."],
  ["braids", "Braids And Locs", "Loc Fade", "Loc fade with locs retained on top while sides and back fade close around 0-1 mm, blending into the loc section cleanly. Top locs may be short to medium length\n  with natural root texture and realistic density. Fade should be smooth around temples and nape without cutting into the loc base. Finish is natural and clean. Avoid fake scalp grid, plastic locs, harsh fade\n  bands, or overdrawn lineup."],
  ["mature", "Mature Receding Hairline", "Receding Hairline Buzz Cut", "Buzz cut designed for a receding hairline, clipped evenly around 3-6 mm while respecting the natural recession pattern. Do not fill in\n  temples or create a fake juvenile hairline. Sides and back may taper slightly shorter around ears and nape for a clean mature finish. Scalp visibility at thinner areas should remain natural. Finish is matte\n  and product-free. Avoid painted density, sharp artificial lineup, or hiding recession unrealistically."],
  ["mature", "Mature Receding Hairline", "Short Taper For Receding Hairline", "Short taper haircut for a receding hairline with top length around 2-4 cm, lightly textured and styled naturally forward or\n  slightly to the side. Temples remain realistic and are not artificially filled. Sides and back taper gradually around ears and neckline, keeping a clean mature shape. Finish is matte or low shine with\n  minimal product. Avoid comb-over concealment, fake hairline restoration, high contrast fades, or excessive volume."],
  ["mature", "Mature Receding Hairline", "Textured Crop For Receding Hairline", "Textured crop for a receding hairline with top length around 3-5 cm, directed slightly forward to soften the frontal area\n  without pretending the hairline is full. Texture should be choppy and matte, with natural density variations visible. Sides and back use a low taper or soft fade. Temples remain naturally receded. Avoid\n  artificial temple filling, heavy fringe cover-up, painted hairline, wet shine, or wig-like thickness."],
  ["mature", "Mature Receding Hairline", "Crew Cut For Receding Hairline", "Crew cut adapted for mature or receding hairline with top length around 2-4 cm and slightly shorter crown. Front may lift subtly\n  but should not try to hide recession. Sides and back are tapered short and blended cleanly. Natural scalp visibility at temples is acceptable and realistic. Finish is matte and conservative. Avoid fake dense\n  front, aggressive lineup, exaggerated height, or combing hair unnaturally over thin areas."],
  ["mature", "Mature Receding Hairline", "Clean Shaved Head", "Completely clean shaved head with smooth realistic scalp texture and natural skin tone. Any remaining hair is removed evenly, with subtle\n  natural shaving shadow only if appropriate. Head shape, hairline history, and scalp imperfections should remain realistic. Facial identity must stay unchanged. Finish is clean and matte, not overly glossy.\n  Avoid plastic bald cap look, blurred scalp texture, fake hairline traces, or changing skull shape."],
  ["mature", "Mature Receding Hairline", "Bald With Fade Beard Blend", "Bald or closely shaved head blended cleanly into existing facial hair if present. Scalp should look naturally shaved with realistic\n  skin texture and subtle shadow where appropriate. Sideburn area transitions smoothly into beard or stubble using a barber fade, with no harsh break. Hairline recession should not be filled. Finish is clean,\n  mature, and masculine. Avoid plastic bald cap, artificial beard connection, excessive scalp shine, or changing face shape."],
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
  ["clean", "Clean And Minimal", "Clean Shaven", "Completely clean-shaven face with no visible beard, mustache, stubble, or shaped facial hair. Skin should remain realistic with natural pores, shaving\n  texture, and subtle tone variation around the beard area. Jawline, chin, cheeks, and upper lip must be smooth while preserving the customer\u0027s natural face shape. Sideburns may end cleanly at the natural\n  hairline if hair is present. Finish is fresh, neat, and natural. Avoid adding artificial beard density, fake black shadow, painted stubble, overly blurred skin, plastic smoothing, or changing the jaw\n  shape."],
  ["clean", "Clean And Minimal", "Fresh Shave", "Fresh shave look with an extremely clean face and very minimal shaving shadow only where naturally appropriate. Cheeks, jawline, chin, neckline, and upper lip\n  should appear recently shaved with realistic skin texture and slight natural redness or smoothness if suitable. No visible stubble length should be present. Sideburn edges should look clean and naturally\n  groomed. Finish is polished and hygienic. Avoid creating beard patches, dark artificial shadow, overly perfect airbrushed skin, fake razor lines, or any mustache/beard shape."],
  ["clean", "Clean And Minimal", "Light Shaving Shadow", "Light shaving shadow with no actual beard length, only a subtle natural gray or dark undertone around the jaw, chin, upper lip, and lower cheeks. The\n  shadow should follow the natural beard-growth area softly without defined edges. Cheek line and neckline are not shaped as a beard; they remain diffused and realistic. Skin texture must stay visible. Finish\n  is clean and masculine, like same-day regrowth after shaving. Avoid painted-on black areas, visible stubble hairs, sharp beard outlines, fake density, or changing face structure."],
  ["clean", "Clean And Minimal", "Five O Clock Shadow", "Five o\u0027clock shadow with very short regrowth around 0.5-1.5 mm across the upper lip, chin, jawline, lower cheeks, and sideburn area. Coverage should\n  look natural and slightly uneven, with skin clearly visible through the shadow. Cheek line is soft and unshaped, neckline is lightly diffused rather than sharply edged. Mustache area blends naturally into\n  chin and jaw shadow. Finish is rugged but clean. Avoid heavy stubble, full beard density, painted black shadow, sharp barber lines, or plastic facial hair texture."],
  ["stubble", "Stubble", "Light Stubble", "Light stubble with short facial hair around 1-2 mm evenly but naturally covering the cheeks, jawline, chin, and upper lip. Cheek line should be soft and realistic,\n  not razor-defined. Neckline may be lightly cleaned below the jaw while still looking natural. Mustache connects subtly into the chin and beard area through short growth. Sideburns blend softly into the\n  stubble. Density should vary slightly by face area. Avoid painted shadow, overly black stubble, fake uniform dots, harsh digital edges, or changing the jaw shape."],
  ["stubble", "Stubble", "Medium Stubble", "Medium stubble with visible facial hair length around 2-3.5 mm across cheeks, jaw, chin, sideburns, and upper lip. Cheek line can be lightly groomed but should\n  remain natural with slight density variation. Neckline is cleaned softly under the jaw, not carved too high. Mustache blends into the corners of the mouth and chin area. Texture should show individual short\n  hairs and realistic growth direction. Avoid full beard thickness, painted-on texture, overly sharp cheek lines, patchy AI artifacts, or plastic stubble dots."],
  ["stubble", "Stubble", "Heavy Stubble", "Heavy stubble with dense short facial hair around 3-5 mm, clearly visible across the jawline, chin, cheeks, and mustache area. Cheek line may be moderately defined\n  while still showing natural growth variation. Neckline should be cleaned under the jaw with a soft curved boundary. Mustache connects naturally to the beard at the mouth corners. Sideburns transition into\n  the stubble without a hard break. Finish is rugged and masculine. Avoid turning it into a short boxed beard, fake black blocks, sharp digital lines, or unrealistic uniform density."],
  ["stubble", "Stubble", "Designer Stubble", "Designer stubble with controlled length around 2-4 mm and intentional barber grooming. Cheek line is clean and lightly angled from sideburn toward the mustache\n  corner, while still preserving realistic hair texture. Neckline is shaped neatly 1-2 fingers above the Adam\u0027s apple with a natural curve under the jaw. Mustache blends cleanly into the stubble around the\n  mouth. Sideburns are trimmed and connected. Finish is polished and modern. Avoid messy patchiness, painted shadow, overdrawn edges, fake symmetry, or plastic facial hair."],
  ["stubble", "Stubble", "Short Boxed Stubble", "Short boxed stubble with close facial hair around 3-5 mm shaped into a compact boxed outline. Cheek line is defined but not overly high, following a clean\n  barber angle from sideburn to mustache corner. Neckline is clearly cleaned under the jaw and curved naturally below the chin. Mustache connects to the chin and jaw stubble. Sideburns blend smoothly into the\n  beard area. Density should look even with subtle natural variation. Avoid blocky fake edges, overly black fill, harsh digital outlines, or accidental full beard length."],
  ["stubble", "Stubble", "Rugged Stubble", "Rugged stubble with natural uneven density and length around 2-5 mm across cheeks, chin, jaw, and upper lip. Cheek line is soft and imperfect, neckline is\n  minimally cleaned or naturally diffused below the jaw. Mustache connects organically into the chin and beard area. Sideburns blend naturally without precise barber fading. Texture should look masculine and\n  realistic with small gaps and growth variation. Avoid polished sharp edges, painted black shadow, excessive patchiness, artificial dots, or changing the face shape."],
  ["short", "Short Beards", "Short Boxed Beard", "Short boxed beard with facial hair length around 6-12 mm across cheeks, jawline, chin, and mustache. Cheek line is clean and slightly angled from sideburn\n  toward the corner of the mustache, but still natural. Neckline sits about 1-2 fingers above the Adam\u0027s apple, curved naturally under the jaw and cleaned sharply. Beard connects fully from sideburns to jaw\n  and chin, with mustache blended into the beard at the mouth corners. Density should look even but realistic. Edges are barber-defined but not painted on. Avoid fake beard texture, overly black blocks, harsh\n  digital lines, unrealistic density, or changing the face shape."],
  ["short", "Short Beards", "Corporate Beard", "Corporate beard with short controlled length around 5-10 mm, trimmed evenly across cheeks, jaw, chin, and mustache for a professional office-ready look. Cheek\n  line is tidy but conservative, not aggressively sharp. Neckline is clean and curved naturally under the jaw, placed low enough to look mature and balanced. Mustache is neatly trimmed above the upper lip and\n  connected softly to the beard. Sideburns blend smoothly. Finish is polished, masculine, and low-maintenance. Avoid rugged bulk, messy flyaways, painted edges, fake density, or excessive darkening."],
  ["short", "Short Beards", "Classic Short Beard", "Classic short beard with balanced length around 8-15 mm covering cheeks, jawline, chin, and mustache. Cheek line follows natural growth with light barber\n  cleanup, and neckline is shaped cleanly under the jaw without being too high. Mustache connects naturally into the beard at both corners, with trimmed upper-lip clearance. Sideburns transition into the beard\n  at similar density. Jawline should look defined but not reshaped. Finish is neat and timeless. Avoid blocky artificial edges, over-sharpened cheek lines, patchy AI texture, or plastic hair."],
  ["short", "Short Beards", "Rounded Short Beard", "Rounded short beard with length around 7-14 mm and a softer curved outline around the chin and lower jaw. Cheek line is clean but gentle, avoiding harsh\n  angles. Neckline curves naturally under the jaw and supports the rounded lower beard shape. Mustache connects into the beard while staying neatly trimmed above the lip. Sideburns blend evenly into cheek\n  coverage. Density should be natural and slightly fuller at the chin. Avoid square block shape, painted black fill, overly sharp barber lines, or unnatural jaw widening."],
  ["short", "Short Beards", "Square Short Beard", "Square short beard with facial hair around 7-14 mm shaped to create a stronger, more structured lower jaw outline. Cheek line is clean and moderately sharp,\n  running from sideburn toward mustache corner. Neckline is crisp and slightly flatter under the jaw to support the squared shape. Chin and jaw density should be even, with mustache connected and trimmed\n  cleanly. Sideburns blend into the beard without gaps. Finish is barber-defined and masculine. Avoid fake geometric blocks, digital-looking edges, unrealistic density, or changing the actual jaw shape too\n  much."],
  ["short", "Short Beards", "Sharp Line Short Beard", "Sharp line short beard with length around 6-12 mm and very precise barber edge work. Cheek line is razor-defined with strong contrast between skin and\n  beard, but individual hair texture must remain visible. Neckline is crisp, curved under the jaw, and placed naturally 1-2 fingers above the Adam\u0027s apple. Mustache connects cleanly to the beard and is edged\n  neatly above the lip. Sideburn blend is precise. Finish is polished and high-detail. Avoid painted-on beard blocks, digital black lines, fake symmetry, plastic texture, or over-darkened cheeks."],
  ["short", "Short Beards", "Natural Short Beard", "Natural short beard with length around 6-15 mm and softer organic growth across cheeks, chin, jaw, and mustache. Cheek line is mostly natural with minimal\n  cleanup, showing realistic unevenness. Neckline is lightly groomed below the jaw but not sharply carved. Mustache connects naturally into the beard with a relaxed trimmed edge. Sideburns blend without a fade\n  line. Density varies subtly on cheeks and jaw. Finish is tidy but not overly styled. Avoid razor-sharp edges, painted density, perfect symmetry, or fake plastic facial hair."],
  ["short", "Short Beards", "Faded Short Beard", "Faded short beard with length around 6-12 mm through the jaw and chin, gradually shortening near the sideburns. Fade begins around the sideburn/temple area\n  at about 0-2 mm and transitions smoothly into fuller cheek and jaw coverage. Cheek line is clean but realistic, neckline is shaped neatly under the jaw. Mustache connects naturally and remains trimmed. The\n  sideburn blend should have no harsh banding. Finish is modern barber-groomed. Avoid patchy fade gradients, painted transitions, fake black fill, or overly sharp digital edges."],
  ["medium", "Medium Beards", "Medium Full Beard", "Medium full beard with length around 1.5-3.5 cm covering cheeks, jawline, chin, sideburns, and mustache. Cheek line is natural to moderately cleaned, not\n  overly carved. Neckline sits under the jaw with a soft but intentional curve, supporting fuller lower-face coverage. Mustache connects fully into the beard and is trimmed enough to keep the upper lip\n  visible. Sideburns blend naturally into cheek density. Beard texture should show realistic strand direction and volume. Avoid excessive bulk, fake extensions, painted black density, or changing jaw shape\n  unnaturally."],
  ["medium", "Medium Beards", "Medium Boxed Beard", "Medium boxed beard with length around 1.5-3 cm and a controlled rectangular outline along cheeks, jaw, chin, and mustache. Cheek line is clean and angled,\n  neckline is sharply groomed under the jaw with a balanced curve. Chin and jaw remain fuller to define the lower face, while sideburns connect smoothly. Mustache is integrated and trimmed at the lip line.\n  Finish is structured and professional. Avoid overly square fake blocks, plastic beard mass, harsh digital edge lines, uneven AI patches, or unrealistic density."],
  ["medium", "Medium Beards", "Rounded Medium Beard", "Rounded medium beard with length around 2-4 cm, shaped into a softer curved lower outline around the chin and jaw. Cheek line is gently cleaned while\n  preserving natural growth. Neckline follows a rounded curve below the jaw and should not sit too high. Mustache connects into the beard with natural fullness and trimmed lip clearance. Sideburns blend\n  smoothly into cheek density. Texture should look full but groomed. Avoid square shaping, inflated beard mass, painted dark areas, or synthetic strand texture."],
  ["medium", "Medium Beards", "Tapered Medium Beard", "Tapered medium beard with fuller length around 2-4 cm at the chin and jaw, gradually shortening toward the cheeks and sideburns. Cheek line is clean but\n  natural, and sideburns fade smoothly into the beard without harsh bands. Neckline is groomed under the jaw with a natural curve. Mustache connects cleanly but remains controlled above the lip. Density should\n  feel dimensional and realistic. Avoid abrupt length jumps, patchy gradients, fake black fill, over-carved edges, or unnatural chin extension."],
  ["medium", "Medium Beards", "Structured Medium Beard", "Structured medium beard with length around 2-3.5 cm and precise barber shaping through cheeks, jawline, chin, and mustache. Cheek line is defined and\n  symmetrical, neckline is crisp and curved below the jaw. Chin and jaw are shaped for clear definition while preserving the actual face structure. Mustache connects strongly into the beard and is trimmed\n  neatly. Sideburn transition is clean and intentional. Finish is polished and masculine. Avoid painted-on edges, overly perfect digital symmetry, plastic texture, or excessive bulky volume."],
  ["medium", "Medium Beards", "Natural Medium Beard", "Natural medium beard with length around 1.5-4 cm and organic fullness across cheeks, jaw, chin, and mustache. Cheek line is soft with minimal shaping,\n  neckline is lightly groomed but not sharply carved. Mustache connects naturally and may have slight texture over the upper lip while staying tidy. Sideburns blend without a fade. Density should vary\n  realistically, especially on cheeks. Finish is masculine and relaxed. Avoid barber-sharp edges, painted black density, fake uniform strands, or messy AI patch artifacts."],
  ["medium", "Medium Beards", "Dense Medium Beard", "Dense medium beard with strong coverage and length around 2-4 cm across cheeks, jaw, chin, and mustache. Cheek line may be clean but should still show\n  natural hair texture. Neckline is shaped low under the jaw to support fullness. Mustache is thick, connected, and trimmed enough to avoid covering the mouth. Sideburns blend into dense cheek growth. Beard\n  volume should look full but groomed. Avoid unrealistic beard mass, solid black painted blocks, plastic hair texture, or exaggerated jaw enlargement."],
  ["medium", "Medium Beards", "Soft Medium Beard", "Soft medium beard with length around 1.5-3 cm, natural edges, and less aggressive barber shaping. Cheek line is gently diffused, neckline is cleaned\n  lightly below the jaw without a hard razor boundary. Mustache connects softly into the beard with a natural trimmed edge. Sideburns blend gradually. Density should look approachable and realistic, with soft\n  strand texture. Finish is groomed but relaxed. Avoid sharp carved lines, blocky beard shape, heavy dark fill, fake smooth texture, or changing facial structure."],
  ["full", "Full Beards", "Full Beard", "Full beard with complete coverage across cheeks, jawline, chin, mustache, and sideburns, usually 2.5-5 cm in length depending on face shape. Cheek line is natural to\n  lightly cleaned, neckline sits lower under the jaw to support fullness. Mustache connects fully and blends into the beard around the mouth. Lower beard shape is balanced and groomed without looking over-\n  carved. Density should be high but naturally varied. Avoid unrealistic beard mass, fake black blocks, plastic strand texture, over-sharp edges, or changing the jaw shape."],
  ["full", "Full Beards", "Classic Full Beard", "Classic full beard with traditional balanced coverage around 2.5-5 cm across cheeks, jaw, chin, and mustache. Cheek line follows natural growth with moderate\n  cleanup, neckline is clean but not too high. Mustache is connected and trimmed at the upper lip while keeping natural thickness. Sideburns blend directly into cheek coverage. Lower shape is softly rounded\n  and symmetrical. Finish is timeless and masculine. Avoid exaggerated volume, painted density, overly sharp cheek lines, fake strand texture, or accidental long rugged beard shape."],
  ["full", "Full Beards", "Thick Full Beard", "Thick full beard with dense facial hair around 3-6 cm and strong coverage across cheeks, jawline, chin, and mustache. Cheek line may be defined but should\n  preserve realistic density variation. Neckline is groomed lower under the jaw to support heavier volume. Mustache is full and connected, trimmed enough to reveal the mouth. Sideburns blend naturally into the\n  thickness. Finish is powerful but controlled. Avoid solid black painted fill, inflated fake mass, plastic hair texture, unnatural jaw widening, or messy AI clumping."],
  ["full", "Full Beards", "Long Full Beard", "Long full beard extending below the chin, generally around 5-10 cm or more depending on the chosen look. Cheeks, jaw, chin, mustache, and sideburns remain\n  connected with natural density. Lower beard shape should be groomed and slightly rounded or tapered, not wild unless intended. Neckline is less visible but should remain naturally integrated under the beard.\n  Mustache blends into the beard and is controlled around the lip. Avoid fake extensions, unrealistic beard weight, plastic strands, painted black areas, or distorted face shape."],
  ["full", "Full Beards", "Rounded Full Beard", "Rounded full beard with length around 3-6 cm and a clearly curved lower outline under the chin and jaw. Cheek line is natural to moderately cleaned, neckline\n  supports the rounded volume without sitting too high. Mustache connects fully and is trimmed neatly. Sideburns transition into cheek fullness. Density should be full but dimensional, with natural strand flow\n  downward. Finish is groomed and balanced. Avoid square edges, balloon-like beard mass, painted density, overly perfect curve, or plastic texture."],
  ["full", "Full Beards", "Square Full Beard", "Square full beard with length around 3-6 cm shaped into a strong, flatter lower edge for a masculine jaw effect. Cheek line is clean and structured, neckline\n  is groomed to support the squared outline. Chin and jaw density are full, with mustache connected and trimmed at the lip. Sideburns blend smoothly into thick cheek coverage. Edges are barber-defined but\n  realistic. Avoid fake geometric blocks, excessive jaw reshaping, painted black fill, digital lines, or plastic beard texture."],
  ["full", "Full Beards", "Tapered Full Beard", "Tapered full beard with fuller chin and lower jaw length around 4-7 cm, gradually shorter through cheeks and sideburns. Cheek line is clean but natural,\n  sideburns blend softly into the beard with no harsh step. Neckline is groomed below the jaw and follows the taper. Mustache connects naturally into the beard and remains controlled. Shape should elongate\n  slightly without distorting the face. Avoid abrupt length changes, fake extensions, patchy gradients, painted density, or unnatural pointed chin."],
  ["full", "Full Beards", "Natural Full Beard", "Natural full beard with full coverage and length around 3-6 cm, keeping organic cheek line, natural neckline, and realistic density variation. Mustache\n  connects fully and may be slightly fuller while staying groomed around the lip. Sideburns flow naturally into cheek growth. Lower beard shape is lightly maintained but not sharply sculpted. Finish is\n  authentic and masculine. Avoid razor-sharp barber lines, painted black blocks, synthetic texture, overly perfect symmetry, or unrecognizable face shape."],
  ["goatee", "Goatee Styles", "Goatee", "Goatee focused on the chin with facial hair around 6-15 mm while cheeks remain clean-shaven or nearly clean. Mustache may be absent or lightly present depending on\n  natural growth, but the main emphasis is the chin area. Chin outline is neat and centered, with natural density and realistic hair direction. Neckline below the chin is cleaned softly. Sideburns do not\n  connect into a full beard. Avoid accidental full beard, heavy cheek growth, painted chin block, fake black fill, or changing chin shape unnaturally."],
  ["goatee", "Goatee Styles", "Classic Goatee", "Classic goatee with a compact chin beard around 8-15 mm, shaped neatly under the lower lip and around the chin. Cheeks and jawline are clean-shaven, leaving\n  strong contrast between skin and chin hair. Mustache may be separate or minimal depending on the classic form, but should not create full beard coverage. Neckline below the chin is clean. Density is moderate\n  and realistic. Avoid cheek stubble turning into a beard, over-dark painted chin hair, uneven AI patches, or exaggerated pointed shape."],
  ["goatee", "Goatee Styles", "Full Goatee", "Full goatee with mustache connected to the chin beard around the mouth, forming a complete rounded or oval frame. Hair length is usually 8-15 mm, with cheeks and\n  side jaw clean-shaven. Mustache follows the upper lip and connects at both corners to the chin section. Chin density is slightly stronger but realistic. Neckline below the goatee is clean. Edges are barber-\n  groomed but not painted. Avoid accidental full beard, disconnected mustache, overly sharp digital outline, or plastic facial hair texture."],
  ["goatee", "Goatee Styles", "Circle Beard", "Circle beard with mustache and chin beard connected into a rounded ring around the mouth. Length is around 6-12 mm, with clean-shaven cheeks and jawline outside\n  the circle. The outline should be smooth and symmetrical, following the mouth and chin naturally. Neckline is clean below the chin. Density should be even with visible hair texture. Finish is precise but\n  realistic. Avoid full cheek beard, square goatee shape, fake black outline, overly perfect cartoon circle, or changing mouth/chin shape."],
  ["goatee", "Goatee Styles", "Anchor Beard", "Anchor beard with a defined mustache, clean cheeks, and chin hair shaped into a pointed anchor-like lower form. Length is around 8-18 mm, denser at the chin and\n  narrower along the lower jaw if extended. Mustache may be separated or lightly connected depending on styling, but cheeks remain shaved. Neckline is clean and controlled. Edges are sharp but realistic. Avoid\n  turning it into a full goatee or full beard, over-pointing the chin, painted edges, or fake black density."],
  ["goatee", "Goatee Styles", "Extended Goatee", "Extended goatee with mustache and chin beard connected, extending slightly along the lower jawline while cheeks remain mostly clean. Length is around 8-15\n  mm, with chin and mouth area fuller than the side extensions. Cheek line is absent or very low because cheeks are shaved. Neckline is cleaned under the chin and jaw. Sideburns should not fully connect into a\n  full beard. Finish is groomed and masculine. Avoid full cheek coverage, blocky jaw strips, painted texture, or unnatural jaw reshaping."],
  ["goatee", "Goatee Styles", "Van Dyke", "Van Dyke beard with a separated mustache and pointed chin beard, usually 8-18 mm in length. Cheeks and jawline are clean-shaven, creating strong contrast. Mustache\n  is shaped clearly above the lip and does not fully connect to the chin beard. Chin section tapers downward into a refined point while preserving natural hair texture. Neckline is clean. Finish is classic and\n  precise. Avoid connecting it into a full goatee, adding cheek hair, fake black edges, or exaggerated cartoon point."],
  ["goatee", "Goatee Styles", "Balbo Beard", "Balbo beard with separated mustache and structured lower beard focused on the chin and lower jaw. Length is around 10-20 mm, with clean-shaven cheeks and no\n  sideburn connection. Mustache is trimmed independently above the upper lip. Chin and lower beard are shaped into a neat block or soft curve with defined edges. Neckline is clean under the jaw. Finish is\n  polished and masculine. Avoid full cheek beard, accidental sideburn connection, painted-on outlines, excessive density, or distorted chin shape."],
  ["mustache", "Mustache Styles", "Mustache Only", "Mustache-only style with facial hair limited to the upper lip area while cheeks, chin, jawline, and neckline remain clean-shaven. Mustache length and\n  thickness should match natural density, usually 4-12 mm depending on the selected shape. Edges are groomed at the lip line and corners. Sideburns do not connect to facial hair. Skin remains realistic with no\n  beard shadow beyond natural shaving texture. Avoid creating chin hair, stubble beard, painted mustache blocks, fake black fill, or changing lip shape."],
  ["mustache", "Mustache Styles", "Classic Mustache", "Classic mustache with medium thickness following the natural curve of the upper lip. Hair length is around 6-12 mm, trimmed neatly so it does not\n  heavily cover the mouth. Ends stop near or slightly beyond the mouth corners. Cheeks, chin, and jaw remain clean-shaven or minimally shadowed. Edge grooming is clean but natural. Finish is timeless and\n  masculine. Avoid turning it into a beard, overly thin pencil shape, exaggerated handlebar curls, painted black texture, or plastic shine."],
  ["mustache", "Mustache Styles", "Thin Mustache", "Thin mustache with a narrow groomed strip above the upper lip, around 2-5 mm in thickness and short trimmed length. It follows the lip line cleanly with\n  precise but realistic edges. Cheeks, chin, jawline, and neckline are clean-shaven. Corners are tidy and do not connect into a goatee. Density should be subtle and natural. Avoid making it too dark, too\n  thick, or cartoon-like; avoid accidental stubble beard, fake black line, or changing the mouth shape."],
  ["mustache", "Mustache Styles", "Thick Mustache", "Thick mustache with strong density and length around 8-15 mm, covering the upper lip area while staying groomed. Shape follows the natural mustache growth\n  from one mouth corner to the other, with a clean lower edge that does not obscure the mouth completely. Cheeks, chin, and jaw remain shaved or lightly shadowed only. Texture should show individual hairs and\n  natural direction. Avoid turning it into a full beard, fake black block, plastic hair, or excessive drooping over the lips."],
  ["mustache", "Mustache Styles", "Chevron Mustache", "Chevron mustache with a full thick triangular shape covering much of the upper lip, usually 10-18 mm in length. It should be dense, masculine, and\n  angled downward slightly from the center toward the mouth corners. Cheeks, chin, and jaw remain clean-shaven. Edges are groomed but not razor-thin. Hair texture should be natural with subtle strand\n  variation. Avoid handlebar curls, thin pencil shape, full beard connection, painted black mass, or hiding the mouth unnaturally."],
  ["mustache", "Mustache Styles", "Handlebar Mustache", "Handlebar mustache with medium to thick upper-lip hair around 10-20 mm, styled outward with ends gently curled or lifted. The center follows the upper\n  lip while the ends extend past the mouth corners. Cheeks, chin, and jaw are clean-shaven unless a very light natural shadow exists. Edges are groomed, and curl shape should look realistic with waxed control.\n  Avoid cartoon spiral curls, full beard growth, fake plastic shine, overly black fill, or distorted lip shape."],
  ["mustache", "Mustache Styles", "Pencil Mustache", "Pencil mustache with a very thin, precise line above the upper lip, usually 1-3 mm thick and closely trimmed. It follows the lip contour with clean\n  separation from the nose and upper lip. Cheeks, chin, jaw, and neckline are fully clean-shaven. Density is subtle but visible, with realistic fine hair texture. Finish is refined and sharp. Avoid making it\n  thick, uneven, cartoonish, connected to a goatee, painted like marker ink, or changing the mouth shape."],
  ["mustache", "Mustache Styles", "Horseshoe Mustache", "Horseshoe mustache with thick upper-lip hair extending downward along both sides of the mouth toward the chin, forming an inverted U shape. Length is\n  around 8-18 mm, with clean-shaven cheeks and chin center unless naturally shadowed. Vertical sides should be symmetrical but realistic, ending near the lower chin or jaw area. Edges are groomed and defined.\n  Avoid turning it into a full beard, connecting across the chin, fake black strips, plastic texture, or overly sharp digital lines."],
  ["jawline", "Jawline And Chin", "Chin Strap", "Chin strap beard with a narrow line of facial hair following the jawline from sideburns to chin, usually 3-6 mm wide and 2-5 mm in length. Cheeks remain\n  clean-shaven above the strap, and neckline below the strap is clean. Chin connection is centered and neat, while mustache may be absent unless naturally part of the look. Sideburns connect directly into the\n  strap. Finish is precise but realistic. Avoid thick full beard, unnatural jaw reshaping, painted black line, uneven AI edges, or fake symmetry."],
  ["jawline", "Jawline And Chin", "Thick Chin Strap", "Thick chin strap with a wider band of facial hair around 8-15 mm across following the lower jaw from sideburn to chin. Length is around 4-8 mm, with\n  cheeks clean above the strap and neckline cleaned below it. Chin area may be slightly fuller but should not become a goatee unless connected naturally. Mustache is optional but should not turn it into a full\n  beard. Sideburn connection is clean. Avoid overly thin pencil line, painted jaw blocks, fake density, or changing the jaw shape."],
  ["jawline", "Jawline And Chin", "Jawline Beard", "Jawline beard focused along the lower face, with hair length around 5-12 mm tracing the jaw from sideburns through chin. Cheeks remain mostly clean or very\n  low in density, emphasizing the jaw contour. Neckline is cleaned below the jaw with a natural curve. Chin coverage is connected and slightly fuller. Mustache may be light or connected depending on natural\n  growth. Finish is sculpted but realistic. Avoid full cheek beard, fake jaw enlargement, painted lines, or plastic hair texture."],
  ["jawline", "Jawline And Chin", "Chin Beard", "Chin beard with facial hair concentrated on the chin area, around 8-18 mm in length, while cheeks and most of the jaw remain clean-shaven. Mustache may be\n  absent or lightly present but should not dominate unless naturally connected. Chin shape is groomed and centered, with natural density and strand direction. Neckline below the chin is clean. Sideburns do not\n  connect into a full beard. Avoid accidental goatee ring, full beard coverage, painted chin block, or exaggerated chin length."],
  ["jawline", "Jawline And Chin", "Soul Patch", "Soul patch with a small, isolated patch of facial hair directly below the lower lip, usually 3-8 mm long and compact in shape. Cheeks, chin, jawline,\n  mustache, and neckline remain clean-shaven unless there is very subtle natural shaving shadow. The patch should be centered and realistic with soft hair texture. Edges may be neat but not digitally sharp.\n  Avoid expanding it into a goatee, adding mustache or beard growth, painted black spot, or changing the lower lip/chin shape."],
  ["jawline", "Jawline And Chin", "Chin Curtain", "Chin curtain beard following the jawline and chin without a mustache. Hair length is around 8-20 mm along the sideburns, jaw, and chin, while upper lip\n  remains clean-shaven. Cheeks above the curtain are clean or lightly natural, and neckline below the jaw is groomed. The beard should frame the lower face with natural density and smooth sideburn connection.\n  Avoid adding mustache, turning it into a full beard, fake black jaw outline, overly sharp digital edges, or unnatural jaw widening."],
  ["jawline", "Jawline And Chin", "Amish Beard", "Amish beard with full jawline, chin, and lower cheek coverage but no mustache. Length may range from 2-6 cm depending on fullness, with natural density and\n  downward strand flow. Upper lip is clean-shaven, creating clear separation from the beard. Cheek line is natural and neckline may be softly groomed or natural depending on length. Sideburns connect fully.\n  Finish is authentic and mature. Avoid adding a mustache, overly sculpted modern edges, fake beard mass, plastic texture, or painted density."],
  ["jawline", "Jawline And Chin", "Neckline Beard", "Neckline beard emphasizing facial hair along the lower jaw and neckline area, with cheeks and upper face kept cleaner. Length is around 5-15 mm depending\n  on natural density. The beard sits low under the jaw, with a defined but realistic lower-face frame. Chin coverage connects into the lower jaw, while mustache may be minimal or absent. Sideburns blend\n  naturally downward. Avoid making it look like an accidental untrimmed neckbeard, painted jaw shadow, fake density, or unnatural face reshaping."],
  ["faded", "Faded And Tapered", "Beard Fade", "Beard fade with facial hair gradually transitioning from very short sideburns around 0-1 mm into fuller beard length along cheeks, jaw, and chin. Fade is\n  placed at the sideburn/temple area and should blend smoothly without visible bands. Cheek line remains clean and neckline is groomed under the jaw. Mustache connects naturally to the beard if present.\n  Density increases gradually toward the lower beard. Finish is modern barber-polished. Avoid patchy gradient, abrupt sideburn break, painted black transition, fake edge lines, or losing beard density."],
  ["faded", "Faded And Tapered", "Low Beard Fade", "Low beard fade with the shortest blend starting low near the lower sideburn and upper jaw area, around 0-1 mm, then transitioning into fuller beard length\n  around 6-20 mm. Cheek line stays natural to moderately clean, and neckline is shaped under the jaw. Mustache connects normally into the beard. The fade should be subtle and smooth, preserving fullness\n  through the lower face. Avoid high temple fading, harsh bands, patchy AI texture, painted gradient, or overly thin beard edges."],
  ["faded", "Faded And Tapered", "High Beard Fade", "High beard fade with the blend beginning higher at the temple and upper sideburn area, starting around 0-1 mm and transitioning into fuller cheek and jaw\n  coverage. Cheek line is clean and defined, neckline remains groomed under the jaw. Mustache connects into the beard with consistent density. Sideburn-to-beard transition is precise but realistic. Finish is\n  sharp and modern. Avoid abrupt length jumps, over-fading the cheek, fake black blocks, digital-looking fade bands, or unnatural jaw reshaping."],
  ["faded", "Faded And Tapered", "Temple Beard Fade", "Temple beard fade focused at the temple and sideburn junction, starting near 0-1 mm at the hairline/sideburn area and blending into the beard along the\n  cheek and jaw. The fade should be localized, not removing too much beard density. Cheek line remains clean, neckline is shaped naturally. Mustache connection stays intact. Finish is barber-polished with\n  smooth transition. Avoid patchy temple gradients, hard disconnect from haircut, painted shadow, over-sharp artificial line, or fake density."],
  ["faded", "Faded And Tapered", "Tapered Beard", "Tapered beard with shorter length near the sideburns and upper cheeks, gradually increasing to fuller length around the jaw and chin. Length may range from\n  4-8 mm near sideburns to 1.5-4 cm at the chin depending on fullness. Cheek line is clean but natural, neckline is groomed under the jaw. Mustache connects and is trimmed neatly. Shape should guide the eye\n  toward the chin without changing face structure. Avoid abrupt steps, patchy blend, fake extensions, painted edges, or excessive bulk."],
  ["faded", "Faded And Tapered", "Sideburn Blend Beard", "Sideburn blend beard with a smooth transition from haircut sideburn into beard density. The sideburn starts short around 0-2 mm near the hairline and\n  gradually blends into cheek and jaw beard length. Cheek line is natural to moderately sharp, neckline is cleaned under the jaw. Mustache remains connected if beard style includes it. Texture should remain\n  realistic through the blend. Avoid hard sideburn cutoff, mismatched hair/beard color, painted gradient, fake black patches, or visible banding."],
  ["faded", "Faded And Tapered", "Sharp Beard Fade", "Sharp beard fade with crisp barber precision from sideburn into fuller beard. Fade starts around 0-1 mm at the upper sideburn/temple and transitions\n  cleanly into cheek and jaw density. Cheek line and neckline are razor-defined with strong contrast, but individual hair texture must remain visible. Mustache connects cleanly and is trimmed. Finish is\n  polished and high-detail. Avoid digital-looking lines, painted-on beard blocks, patchy fade bands, fake symmetry, or plastic texture."],
  ["faded", "Faded And Tapered", "Soft Beard Fade", "Soft beard fade with a gentle natural transition from sideburns into the beard, starting around 1-2 mm and blending gradually into fuller cheek and jaw\n  hair. Cheek line is lightly groomed rather than razor-sharp, neckline is cleaned softly under the jaw. Mustache connects naturally. Density should build smoothly with realistic variation. Finish is clean but\n  understated. Avoid harsh banding, over-sharp edges, painted shadow, patchy AI gradients, or removing too much sideburn density."],
  ["line", "Line And Shape", "Sharp Cheek Line", "Beard with a sharp razor-defined cheek line, usually angled cleanly from sideburn toward the mustache corner. Beard length may vary by style but the cheek\n  boundary must be crisp while still showing realistic hair texture below it. Neckline is also clean and balanced under the jaw. Mustache connects naturally if present. Sideburn blend is neat. Finish is\n  precise barber edge work. Avoid overdrawn digital lines, painted black beard blocks, fake symmetry, jagged AI edges, or changing cheekbone shape."],
  ["line", "Line And Shape", "Natural Cheek Line", "Beard with a natural cheek line that follows organic growth rather than a sharply carved barber edge. Length may range from short to full depending on\n  existing beard, with realistic density variation along upper cheeks. Neckline can be lightly groomed under the jaw while maintaining a natural finish. Mustache and sideburns connect normally. Texture should\n  look authentic and relaxed. Avoid razor-sharp cheek edges, painted fill, fake density, overly symmetrical line placement, or messy AI patch artifacts."],
  ["line", "Line And Shape", "Low Cheek Line", "Low cheek line beard with upper cheeks cleaned lower than usual, emphasizing the jawline and lower beard area. Beard length can be short to medium, with clear\n  skin above the cheek line and realistic hair texture below. Neckline is groomed under the jaw, and sideburns connect into the lower beard shape. Mustache connects if present but should not raise the cheek\n  coverage. Finish is clean and structured. Avoid cutting the line unnaturally low, fake jaw reshaping, painted edges, or harsh digital contrast."],
  ["line", "Line And Shape", "High Cheek Line", "High cheek line beard with fuller cheek coverage extending naturally higher toward the cheekbones. Beard length may be short to full, with the upper cheek\n  boundary lightly cleaned but not overly artificial. Neckline is groomed under the jaw to balance the fuller cheek density. Mustache connects strongly into the beard. Sideburns blend fully. Finish is\n  masculine and dense. Avoid overdrawn cheek height, fake black cheek blocks, uneven AI patches, or making the face look unnaturally wide."],
  ["line", "Line And Shape", "Sharp Neckline", "Beard with a crisp sharp neckline placed naturally about 1-2 fingers above the Adam\u0027s apple, curving under the jaw from ear to ear. Beard length and cheek line\n  follow the selected style, but the lower boundary must be clean and barber-defined. Neck hair below the line is fully shaved with realistic skin texture. Mustache and sideburns remain connected as\n  appropriate. Finish is precise and tidy. Avoid neckline too high, digital black edge, painted beard underside, or changing jaw shape."],
  ["line", "Line And Shape", "Natural Neckline", "Beard with a softer natural neckline that is lightly groomed but not sharply carved. Lower beard growth blends gradually into the upper neck with realistic\n  density variation. Cheek line and mustache follow the selected beard style, while sideburns connect naturally. The neckline should still look intentional and clean enough for grooming. Finish is relaxed and\n  authentic. Avoid messy untrimmed neck hair, razor-sharp artificial line, painted shadow, fake density, or overly blurred skin."],
  ["line", "Line And Shape", "Rounded Beard Shape", "Rounded beard shape with the lower outline curved softly around the chin and jaw. Beard length may range from short to full, with chin and jaw density\n  shaped into a smooth rounded form. Cheek line is natural to moderately clean, neckline supports the rounded contour under the jaw. Mustache connects and is trimmed neatly. Sideburns blend into the shape.\n  Finish is balanced and approachable. Avoid square lower edge, balloon-like fake volume, painted black fill, or overly perfect digital curve."],
  ["line", "Line And Shape", "Square Beard Shape", "Square beard shape with a flatter, more angular lower outline designed to strengthen the jaw visually. Beard length may be short to full, with jaw and chin\n  trimmed into a structured squared edge. Cheek line is clean, neckline is crisp and placed naturally under the jaw. Mustache connects into the beard and is groomed. Sideburns blend smoothly. Finish is strong\n  and barber-defined. Avoid geometric fake blocks, excessive jaw widening, painted edges, plastic texture, or unrealistic symmetry."],
  ["rugged", "Long And Rugged", "Rugged Beard", "Rugged beard with natural masculine density and length around 2-6 cm, showing realistic unevenness across cheeks, jaw, chin, and mustache. Cheek line is soft\n  or minimally groomed, neckline may be natural or lightly cleaned. Mustache connects fully and can be fuller over the upper lip while still believable. Sideburns blend organically. Strand direction should\n  vary naturally with subtle flyaways. Finish is authentic and outdoorsy. Avoid painted black mass, plastic texture, excessive patchiness, fake extensions, or distorted jaw shape."],
  ["rugged", "Long And Rugged", "Lumberjack Beard", "Lumberjack beard with thick full coverage and longer length around 5-10 cm, dense across cheeks, jaw, chin, mustache, and sideburns. Lower beard is full\n  and slightly rounded or natural, with controlled but rugged grooming. Cheek line is natural to lightly shaped, neckline is mostly hidden but should integrate realistically. Mustache is full and connected.\n  Texture should show coarse strands and natural volume. Avoid unrealistic beard mass, synthetic plastic hair, painted black blocks, overly perfect outline, or changing face shape."],
  ["rugged", "Long And Rugged", "Garibaldi Beard", "Garibaldi beard with a wide full shape and rounded bottom, typically 4-8 cm long. Cheeks, jaw, chin, and mustache are dense and connected, with natural\n  cheek line and softly groomed lower edge. The bottom should be rounded and broad but controlled, not wild. Mustache is integrated and trimmed enough to keep the mouth visible. Sideburns blend fully. Finish\n  is full, mature, and natural. Avoid pointed chin shape, fake extensions, plastic texture, painted density, or excessive balloon-like volume."],
  ["rugged", "Long And Rugged", "Bandholz Beard", "Bandholz beard with large natural fullness, often 7-15 cm or longer, covering cheeks, jaw, chin, mustache, and sideburns with substantial volume. Cheek line\n  and neckline are natural or minimally groomed, preserving an intentionally grown-out look. Mustache is full and integrated, possibly wider but still realistic. Strand flow should be downward with varied\n  texture and density. Finish is bold and rugged. Avoid fake beard extensions, solid black mass, plastic strands, unrealistic bulk, or losing the customer\u0027s facial identity."],
  ["rugged", "Long And Rugged", "Ducktail Beard", "Ducktail beard with fuller cheek and jaw coverage tapering downward into a pointed chin-focused shape. Length is usually 3-8 cm, longest at the chin. Cheek\n  line is moderately cleaned, neckline is groomed to support the taper. Mustache connects into the beard and is trimmed neatly. Sideburns blend naturally into the cheek area. Strand direction should converge\n  subtly toward the chin. Avoid exaggerated cartoon point, fake extensions, painted black density, harsh digital edges, or unnatural chin elongation."],
  ["rugged", "Long And Rugged", "Viking Beard", "Viking beard with long thick facial hair around 6-15 cm, dense across cheeks, jaw, chin, mustache, and sideburns. Shape is rugged and powerful with natural\n  downward flow, possible slight tapering or textured unevenness at the lower beard. Cheek line is natural to lightly cleaned, neckline mostly hidden. Mustache is full and integrated. Texture should be coarse\n  and realistic. Avoid fantasy costume exaggeration, braided additions unless selected, fake beard mass, plastic strands, painted black areas, or changing facial structure."],
  ["rugged", "Long And Rugged", "Pointed Beard", "Pointed beard with length around 3-8 cm shaped downward toward a centered chin point. Cheeks and jaw remain connected but gradually taper into the lower\n  point. Cheek line is clean but realistic, neckline is groomed to support the shape. Mustache connects naturally and stays trimmed. Sideburns blend into the beard without harsh breaks. Finish is sculpted and\n  masculine. Avoid extreme wizard-like point, fake chin extension, painted density, digital edges, or unnatural jaw reshaping."],
  ["rugged", "Long And Rugged", "Long Tapered Beard", "Long tapered beard with fuller length around 5-10 cm at the chin and lower jaw, gradually shorter through cheeks and sideburns. Cheek line is natural to\n  moderately defined, neckline is groomed but partly hidden by length. Mustache connects and is controlled above the lip. Sideburns transition smoothly into the beard. Strand flow should move downward with\n  realistic density and taper. Avoid abrupt length steps, fake extensions, plastic texture, painted black blocks, or exaggerated face elongation."],
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

type GeminiLogContext = {
  request_id?: string;
  user_id?: string;
  gender?: string;
  mode?: string;
  customer_name?: string | null;
  customer_phone?: string | null;
};

type GeminiInlineData = {
  mimeType: string;
  data: string;
};

type CatalogReferenceImage = {
  label: string;
  inlineData: GeminiInlineData;
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
  return (await fetchImageInlineData(url)).data;
}

async function fetchImageInlineData(url: string): Promise<GeminiInlineData> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.status}`);
  }

  const buffer = await res.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return {
    mimeType: normalizeImageMimeType(res.headers.get("content-type")),
    data: btoa(binary),
  };
}

function normalizeImageMimeType(contentType?: string | null) {
  const mimeType = (contentType || "").split(";")[0]?.trim().toLowerCase();

  return mimeType?.startsWith("image/") ? mimeType : "image/jpeg";
}

async function collectCatalogReferenceImages(
  hairStyleImageUrl?: string | null,
  beardStyleImageUrl?: string | null,
) {
  const references: CatalogReferenceImage[] = [];

  if (!USE_CATALOG_REFERENCE_IMAGES) {
    return references;
  }

  await addCatalogReferenceImage(
    references,
    hairStyleImageUrl,
    "HAIRSTYLE REFERENCE IMAGE: use only the scalp hair shape, fade height, top length, texture, and grooming style. Do not copy this reference person's identity, face, pose, clothing, background, lighting, or skin.",
  );
  await addCatalogReferenceImage(
    references,
    beardStyleImageUrl,
    "BEARD REFERENCE IMAGE: use only the facial-hair shape, cheek coverage, mustache/chin relationship, length, edge work, and grooming style. Do not copy this reference person's identity, face, pose, clothing, background, lighting, or skin.",
  );

  return references;
}

async function addCatalogReferenceImage(
  references: CatalogReferenceImage[],
  url?: string | null,
  label?: string,
) {
  if (!url || !label) {
    return;
  }

  try {
    references.push({
      label,
      inlineData: await fetchImageInlineData(url),
    });
  } catch (error) {
    console.warn("CATALOG REFERENCE IMAGE SKIPPED:", {
      url,
      error: serializeError(error),
    });
  }
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
  const description = option.description.replace(/\s+/g, " ").trim();

  return [
    `${label}: ${selectedValue}${category}`,
    `${label} details: ${description}`,
  ].join("\n");
}

function createSelectedOptions(body: Record<string, unknown>) {
  const excluded = new Set(["src_file_url", "log_context"]);

  return Object.fromEntries(
    Object.entries(body).filter(
      ([key, value]) => !excluded.has(key) && value !== undefined,
    ),
  );
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  return error;
}

async function insertGeminiCallLog(row: Record<string, unknown>) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("GEMINI LOG SKIPPED: missing Supabase service env");
    return null;
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/gemini_generation_logs`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(row),
      },
    );

    if (!response.ok) {
      console.error("GEMINI LOG INSERT FAILED:", {
        status: response.status,
        body: await response.text().catch(() => ""),
      });
      return null;
    }

    const data = await response.json().catch(() => []);
    return Array.isArray(data) ? data[0]?.id ?? null : null;
  } catch (error) {
    console.error("GEMINI LOG INSERT ERROR:", serializeError(error));
    return null;
  }
}

async function updateGeminiCallLog(id: string | null, patch: Record<string, unknown>) {
  if (!id || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/gemini_generation_logs?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(patch),
      },
    );

    if (!response.ok) {
      console.error("GEMINI LOG UPDATE FAILED:", {
        status: response.status,
        body: await response.text().catch(() => ""),
      });
    }
  } catch (error) {
    console.error("GEMINI LOG UPDATE ERROR:", serializeError(error));
  }
}

const PRESERVE_SOURCE_RULES = `
SOURCE PRESERVATION RULES (MANDATORY):
- Use the uploaded image as the fixed photographic base, not as inspiration for a new portrait.
- Only change the selected hair and/or beard styling requested in this prompt.
- Preserve the exact camera angle, lens perspective, crop, framing, head position, body pose, shoulder position, and visible body shape from the uploaded image.
- Preserve the exact background, room/location, wall, objects, furniture, mirrors, people, shadows, lighting direction, exposure, color temperature, and image noise from the uploaded image.
- Preserve the exact clothing, outfit, collar, neckline, fabric color, fabric texture, accessories, jewelry, glasses, and visible body/shoulders from the uploaded image.
- Preserve the customer's exact face, facial expression, skin texture, skin tone, eyes, eyebrows, nose, lips, jawline, face shape, age, and identity.
- Do not add makeup, skin retouching, face slimming, face widening, eye changes, lip changes, body changes, clothing changes, background changes, accessories, hats, props, salon lighting, studio lighting, or beauty filters.
- Do not improve, clean, blur, replace, simplify, upscale creatively, editorialize, or restage any unselected part of the image.
- Final result must look like the same original photo with only the selected grooming changes applied.
`.trim();

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

${PRESERVE_SOURCE_RULES}

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
- Grid layout: 2 rows Ã— 5 columns.
- Same camera angle.
- Same lighting.
- Same head position.
- Same background in every grid cell.
- Same clothing/outfit in every grid cell.
- Same pose, crop, framing, shoulders, body, face, expression, and accessories in every grid cell.

QUALITY:
- Ultra photorealistic.
- 8K detail.
- DSLR portrait look.
- No CGI.
- No illustration.
- No painting.

BACKGROUND:
- Keep the exact original background from the uploaded image in every grid cell.
- Never replace or stylize the background.

FINAL CHECK:
If identity changes, regenerate.
If beautified, regenerate.
If any style repeats, regenerate.
If clothing, background, camera angle, pose, lighting, or unselected features change, regenerate.
If the output looks like a new photo instead of the same source photo with hair/beard edits, regenerate.

Return final image only.
`;
}

function buildCatalogPrompt(
  hairStyle: string,
  hairOption: CatalogPromptOption,
  beardStyle: string,
  beardOption: CatalogPromptOption,
  referenceImages: CatalogReferenceImage[],
) {
  const referenceRule = referenceImages.length
    ? `
REFERENCE IMAGE RULE:
- The customer source image is the photo to edit.
- The catalog reference image(s) show style shape only.
- Apply the selected style geometry from the reference image(s) to the customer.
- Never copy the catalog model's identity, face, skin, pose, clothing, lighting, or background.
`
    : "";

  return `
Never change the identity.
Keep the same person.

${referenceRule}
Apply the following styles:
${formatCatalogPromptOption("Hairstyle", hairStyle, hairOption)}

${formatCatalogPromptOption("Beard style", beardStyle, beardOption)}
`;
}

/* ============================================================
   GEMINI 3 CLIENT
============================================================ */

async function callGemini(
  prompt: string,
  imageBase64: string,
  referenceImages: CatalogReferenceImage[] = [],
) {
  const sourceImagePart = {
    inlineData: {
      mimeType: "image/jpeg",
      data: imageBase64,
    },
  };
  const parts = referenceImages.length
    ? [
        { text: prompt },
        {
          text:
            "CUSTOMER SOURCE IMAGE: edit this exact photo. Preserve identity, face, pose, crop, lighting, clothes, and background.",
        },
        sourceImagePart,
        ...referenceImages.flatMap((reference) => [
          { text: reference.label },
          { inlineData: reference.inlineData },
        ]),
      ]
    : [{ text: prompt }, sourceImagePart];

  const body = {
    contents: [
      {
        parts,
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

  return {
    imageBase64: resultBase64,
    mimeType: part?.inlineData?.mimeType || "image/png",
  };
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
      hairStyleImageUrl,
      beardStyleImageUrl,
      log_context,
    } = body;

    if (!src_file_url) {
      return json(400, { ok: false, error: "Missing src_file_url" });
    }

    if (gender !== "male") {
      return json(400, { ok: false, error: "Men only endpoint" });
    }

    const imageBase64 = await fetchImageBase64(src_file_url);
    let prompt = "";
    let referenceImages: CatalogReferenceImage[] = [];

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

      referenceImages = await collectCatalogReferenceImages(
        hairStyleImageUrl,
        beardStyleImageUrl,
      );
      prompt = buildCatalogPrompt(
        hairStyle,
        hairOption,
        beardStyle,
        beardOption,
        referenceImages,
      );
    }

    const mode = isSmartStyle === true ? "smart" : "catalog";
    const logContext = (log_context || {}) as GeminiLogContext;
    const logId = await insertGeminiCallLog({
      request_id: logContext.request_id || null,
      user_id: logContext.user_id || null,
      edge_function: "gemini-auto-style",
      gender: logContext.gender || "men",
      mode: logContext.mode || mode,
      customer_name: logContext.customer_name || null,
      customer_phone: logContext.customer_phone || null,
      src_file_url,
      selected_options: createSelectedOptions(body),
      prompt,
      gemini_model: GEMINI_MODEL,
      status: "started",
      started_at: new Date().toISOString(),
    });

    let result;

    try {
      result = await callGemini(prompt, imageBase64, referenceImages);
      await updateGeminiCallLog(logId, {
        status: "success",
        generated_image_base64: result.imageBase64,
        generated_image_mime_type: result.mimeType,
        completed_at: new Date().toISOString(),
      });
    } catch (error) {
      await updateGeminiCallLog(logId, {
        status: "error",
        error_message: error instanceof Error ? error.message : String(error),
        error_details: serializeError(error),
        completed_at: new Date().toISOString(),
      });
      throw error;
    }

    return json(200, {
      ok: true,
      image_base64: result.imageBase64,
    });
  } catch (e) {
    console.error("MEN EDGE ERROR:", e);

    return json(500, {
      ok: false,
      error: String(e),
    });
  }
});
