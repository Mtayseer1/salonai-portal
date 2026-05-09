/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/* ============================================================
   CONFIG
============================================================ */

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const GEMINI_MODEL = "gemini-3-pro-image-preview";

if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY");
}

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/* ============================================================
   HELPERS
============================================================ */

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
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
    binary += String.fromCharCode(
      ...bytes.subarray(i, i + chunkSize),
    );
  }

  return btoa(binary);
}

function normalizeKey(value?: string | null) {
  return String(value ?? "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

function readable(value?: string | null) {
  const text = String(value ?? "").replace(/_/g, " ").trim();
  return text.length > 0 ? text : undefined;
}

function lookupLibraryPrompt(
  library: Record<string, string>,
  selectedId?: string,
  selectedName?: string,
) {
  const normalizedEntries = Object.entries(library).map(([key, value]) => [
    normalizeKey(key),
    value,
  ]);

  for (const value of [selectedId, selectedName]) {
    const key = normalizeKey(value);
    if (!key) continue;

    const match = normalizedEntries.find(([entryKey]) => entryKey === key);
    if (match) return match[1];
  }

  return undefined;
}

type CatalogBeautyOptions = {
  lipstick?: string;
  mascara?: string;
  extensions?: boolean;
  lipFinish?: string;
  lipFinishDescription?: string;
  lipStyle?: string;
  lipStyleDescription?: string;
  lipColor?: string;
  lipColorDescription?: string;
  lipsPrompt?: string;
  eyeShadow?: string;
  eyeLiner?: string;
  eyeLashes?: string;
  browStyle?: string;
  skinType?: string;
  blushColor?: string;
  blushStyle?: string;
  blushIntensity?: string;
  contourType?: string;
  bronzerTone?: string;
  contourIntensity?: string;
  highlightPlacement?: string;
  highlightTone?: string;
  highlightIntensity?: string;
  highlightFinish?: string;
};

type BridalOptions = {
  styleOrigin?: string[];
};

type GeminiLogContext = {
  request_id?: string;
  user_id?: string;
  gender?: string;
  mode?: string;
  customer_name?: string | null;
  customer_phone?: string | null;
};

function isNoneSelection(value?: string | null) {
  const normalized = normalizeKey(value);
  return (
    !normalized ||
    normalized === "none" ||
    normalized.startsWith("noneno") ||
    normalized.startsWith("no")
  );
}

function promptSelection(
  label: string,
  value?: string | null,
  noneInstruction?: string,
) {
  if (isNoneSelection(value)) {
    return `- ${label}: ${noneInstruction ?? "Do not apply."}`;
  }

  return `- ${label}: ${value}`;
}

function promptOptionalSelection(
  label: string,
  value?: string | null,
  noneInstruction?: string,
) {
  if (!value) {
    return "";
  }

  return promptSelection(label, value, noneInstruction);
}

function compactLines(lines: string[]) {
  return lines.filter((line) => line.trim().length > 0).join("\n");
}

function parseInlineImageData(value?: string | null, mimeType?: string | null) {
  const text = String(value ?? "").trim();
  const dataUrlMatch = text.match(/^data:([^;]+);base64,(.+)$/);

  if (dataUrlMatch) {
    return {
      imageBase64: dataUrlMatch[2],
      mimeType: dataUrlMatch[1] || mimeType || "image/jpeg",
    };
  }

  return {
    imageBase64: text,
    mimeType: mimeType || "image/jpeg",
  };
}

function createSelectedOptions(body: Record<string, unknown>) {
  const excluded = new Set([
    "src_file_url",
    "src_file_base64",
    "src_file_mime_type",
    "log_context",
  ]);

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

const SOURCE_PRESERVATION_RULES = `
SOURCE PRESERVATION RULES (MANDATORY):
- Only change the selected hair, makeup, brow, skin base, blush, contour, highlight, lashes, lips, or bridal styling requested in this prompt.
- Preserve the exact camera angle, crop, framing, head position, body pose, shoulders, and perspective from the uploaded image.
- Preserve the exact background, room/location, objects, lighting direction, shadows, exposure, and color temperature from the uploaded image.
- Preserve the exact clothing, outfit, collar, neckline, fabric color, fabric texture, glasses, and visible body details.
- Do not change expression, face shape, eye shape, nose, lips shape, jawline, body shape, age, skin tone, background, clothing, or unselected facial features.
- Do not add salon/studio scenery, luxury room, retouching, smoothing, editorial lighting, bridal dress, outfit changes, or props.
- Final result must look like the same photo with only the selected beauty changes applied.
`.trim();

/* ============================================================
   FEMALE CATALOG PROMPT LIBRARY
============================================================ */

const HAIRCUT_LIBRARY: Record<string, string> = {
  PixieCut:
    "Luxury feminine pixie haircut. Sides and back cropped close with soft tapering around ears and neckline. Top length retained between 5-8 cm with layered internal texture for movement. Crown moderately full, never flat. Front fringe softly feathered and styled away from face or lightly forward depending finish. Neckline refined and feminine, no harsh masculine fade. Silhouette elegant and balanced with visible softness around temples.",
  BobCut:
    "Classic precision bob haircut resting between chin and jawline. Perimeter cut clean and symmetrical with strong shape retention. Interior lightly beveled to curve inward naturally. Density preserved through baseline while removing excess bulk internally. Ends blunt yet polished. Nape softly tucked. Front edges frame jawline evenly. Luxurious salon finish with strong geometry and shine.",
  Lob:
    "Long bob haircut finishing near collarbone. Balanced weight line with subtle invisible layering for movement. Front slightly elongated toward clavicle for slimming effect. Ends polished and healthy, never stringy. Crown natural density maintained. Highly versatile premium salon structure combining elegance of bob with flexibility of longer hair.",
  LongLayers:
    "Long layered haircut reaching mid-back. Face-framing layers begin near cheekbone level and cascade gradually through collarbone and chest area. Crown retains fullness with minimal short layers. Mid-lengths softly sculpted for movement. Ends refined using slide-cutting, never blunt or damaged. Natural luxurious flow with preserved density.",
  CurtainBangsLayers:
    "Long layered haircut featuring curtain bangs parted centrally. Fringe starts near brow level and sweeps outward into cheekbone-length face-framing sections. Seamless blend into surrounding layers. Total length medium-long to long. Crown soft volume with feminine movement. Elegant modern salon silhouette.",
  ButterflyCut:
    "Modern butterfly haircut with shorter lifted face-framing layers and preserved long base length. Upper layers begin around chin and shoulder level creating airy wing-like movement. Lower perimeter remains long and full. Crown naturally elevated without teasing. Dynamic luxurious volume with soft glamorous bounce.",
  WolfCut:
    "Fashion-forward wolf cut combining shag layering with mullet-inspired length balance. Crown heavily textured with lifted volume. Mid-sections layered aggressively for movement. Lower lengths retained near shoulders. Fringe soft and piecey. Edgy youthful silhouette with controlled salon refinement.",
  ShagCut:
    "Medium shag haircut with feathered layers throughout. Crown lifted and airy. Ends textured with visible movement. Fringe soft and irregular. Weight removed through interior while maintaining enough density. Relaxed rock-chic premium silhouette.",
  BluntLongCut:
    "Long one-length blunt haircut reaching chest or lower. Minimal layering. Perimeter thick, dense, healthy, and perfectly straight across. Strong luxury fullness from roots to ends. Glass-hair potential with heavy premium finish.",
  VCut:
    "Long haircut with perimeter forming soft V-shape at back. Internal long layers preserve movement while showcasing pointed flowing back line. Front face-framing sections blended elegantly. Best for dramatic long-hair movement.",
  UCut:
    "Long haircut with rounded U-shaped perimeter. Softer than V-cut with fuller visual density at ends. Long blended layers through lower third only. Graceful balanced salon finish.",
  CurlyLayers:
    "Curly haircut with carefully placed layers to enhance natural curl spring and reduce triangular heaviness. Crown balanced, curls evenly distributed, ends shaped round and healthy. No excessive thinning. Premium curl-specialist structure.",
  FrenchBob:
    "Parisian French bob ending above jawline with soft inward curve. Often paired with refined fringe. Shape chic, artistic, effortless. Ends polished with slight bend under. Crown compact yet elegant.",
  AsymmetricalBob:
    "Modern asymmetrical bob with one side subtly longer than the other. Precision perimeter lines. Interior softened for movement. Sophisticated editorial look with controlled imbalance.",
};

const HAIRSTYLE_LIBRARY: Record<string, string> = {
  StraightSleek:
    "Ultra-smooth straight styling. Hair blow-dried and flat-ironed to mirror-like finish. Roots aligned cleanly with no bumps. Mid-lengths fluid and reflective. Ends polished and healthy with slight bevel or pin-straight finish depending cut. Zero frizz. Luxury editorial shine.",
  SoftCurls:
    "Loose soft curls created with medium barrel styling. Curl pattern begins from mid-length downward. Natural bounce with brushed softness rather than tight spirals. Ends polished. Feminine romantic movement with touchable texture.",
  HollywoodWaves:
    "Deep sculpted vintage Hollywood waves. Uniform S-wave pattern beginning near temple or ear level. Roots smooth and controlled. High shine finish. Ends tucked elegantly inward. Red carpet glamour with perfect symmetry.",
  BeachWaves:
    "Relaxed beach waves with alternating loose bends and textured movement. Slightly undone premium finish. Roots natural, mids tousled, ends softly separated. No frizz or dryness. Expensive effortless look.",
  Blowout:
    "Professional salon blowout with lifted roots, smooth body, and rounded ends. Hair appears full, bouncy, and healthy. Crown airy volume without teasing. Luxurious movement with polished shine.",
  PonytailGlam:
    "High polished glamorous ponytail. Hair smoothed tightly at scalp with clean tension. Ponytail thick, flowing, and glossy. Base wrapped with hair strand concealing elastic. Lifted crown optional. Red carpet finish.",
  LowPonytail:
    "Elegant low ponytail positioned at nape. Smooth refined roots with center or side part. Length sleek and controlled. Soft luxury minimalism.",
  MessyBun:
    "Chic messy bun with intentional softness. Hair gathered loosely with natural volume at crown. Face-framing tendrils optional. Bun textured and airy, never chaotic. Fashionable off-duty luxury look.",
  ElegantBun:
    "Structured formal bun placed mid or low at back of head. Surface smooth and refined. Symmetrical shape with clean edges. Sophisticated bridal or gala styling.",
  HalfUpHalfDown:
    "Upper section lifted and secured while lower lengths remain flowing. Crown softly elevated. Seamless blending between pinned section and free hair. Romantic versatile styling.",
  BraidedCrown:
    "Hair braided around crown area in halo formation. Braids neat yet soft, with balanced fullness. Remaining lengths integrated or pinned depending haircut length. Regal feminine elegance.",
  VolumeStyle:
    "Maximum glamorous body with lifted roots and expansive movement through mids and ends. Hair appears thick, expensive, and camera-ready. No teasing damage, only polished volume.",
  WetLook:
    "Modern glossy wet-look styling. Roots and upper lengths sleek with controlled shine, lengths comb-defined. Editorial runway finish, never greasy.",
  SideSwept:
    "Hair dramatically swept to one side with asymmetrical volume. Exposes one side of face while opposite side carries movement and body. Glamorous event styling.",
  TexturedMessy:
    "Modern intentionally tousled styling with separated strands and airy movement. Controlled imperfection. Premium lived-in texture.",
  BraidedPonytail:
    "Polished ponytail transitioning into sleek braid through lengths. Tight scalp control with glossy refined finish.",
  CurlyPonytail:
    "Hair gathered into ponytail while curls remain defined and voluminous through tail. Roots controlled, curls springy and luxurious.",
  NaturalCurls:
    "Natural curl pattern enhanced with moisture and definition. Individual curls separated softly. Healthy shine, no frizz, authentic bounce.",
  DefinedCurls:
    "Highly defined polished curls with even ringlet or spiral structure. Controlled volume and premium hydration.",
  VolumeCurls:
    "Large dramatic curls styled for maximum fullness. Root lift combined with bold glamorous curl pattern.",
  CurlyBun:
    "Curly hair gathered into bun while preserving texture and bounce. Soft tendrils and refined shape.",
  GlassHair:
    "Extremely sleek precision-straight styling with ultra reflective mirror shine. Every strand aligned. Premium luxury campaign finish.",
};

/* ============================================================
   PROMPTS (UNCHANGED)
============================================================ */

function buildSmartPrompt(
  img: string,
  hairLength?: string,
  makeup?: boolean,
  dye?: boolean,
) {
  return `
Create ONE single high-resolution image arranged in a 5x4 grid (20 variations).

Each grid cell must show THE SAME WOMAN from the reference image.
Identity must NEVER change.

ABSOLUTE RULES:
- Same face.
- Same age.
- Same skin tone.
- No face modification.
- No beautification.
- No AI identity drift.
- Ultra realistic photography.
- Clear numbering 1–20 in corner.

${SOURCE_PRESERVATION_RULES}

STRUCTURE:

1–10:
Different flattering hairstyles.
No heavy makeup.

11–15:
Light professional makeup.

16–20:
Hair dye variations (caramel, chocolate, balayage).

All hairstyles must fit her face.
Requested hair length: ${hairLength ?? "Random"}.
Include professional makeup variations: ${makeup === false ? "No" : "Yes"}.
Include hair dye variations: ${dye === false ? "No" : "Yes"}.

Result must look like premium salon board.
Every grid cell must keep the same original background, clothing, camera angle, pose, crop, and lighting.

Reference image:
${img}
`.trim();
}

function buildCatalogPrompt(
  img: string,
  haircut?: string,
  haircutId?: string,
  hairStyle?: string,
  hairStyleId?: string,
  hairColor?: string,
  hairColorId?: string,
  lipstick?: string,
  mascara?: string,
  extensions?: boolean,
  beauty: CatalogBeautyOptions = {},
) {
  const haircutDescription = lookupLibraryPrompt(
    HAIRCUT_LIBRARY,
    haircutId,
    haircut,
  );
  const hairStyleDescription = lookupLibraryPrompt(
    HAIRSTYLE_LIBRARY,
    hairStyleId,
    hairStyle,
  );
  const selectedHaircut =
    readable(haircut) ?? readable(haircutId) ?? "Catalog selected haircut";
  const selectedHairStyle =
    readable(hairStyle) ?? readable(hairStyleId) ?? "Catalog selected hairstyle";
  const selectedHairColor =
    readable(hairColor) ?? readable(hairColorId) ?? "Natural";
  const beautyPrompt = compactLines([
    promptOptionalSelection(
      "Lip finish",
      beauty.lipFinish,
      "Do not apply a special lip finish.",
    ),
    promptOptionalSelection(
      "Lip finish detail",
      beauty.lipFinishDescription,
      "No lip finish detail.",
    ),
    promptOptionalSelection(
      "Lip style",
      beauty.lipStyle,
      "Do not reshape or stylize the lips.",
    ),
    promptOptionalSelection(
      "Lip style detail",
      beauty.lipStyleDescription,
      "No lip style detail.",
    ),
    promptOptionalSelection(
      "Lip color",
      beauty.lipColor ?? lipstick,
      "Do not add lipstick color.",
    ),
    promptOptionalSelection(
      "Lip color detail",
      beauty.lipColorDescription,
      "No lip color detail.",
    ),
    beauty.lipsPrompt ? `- Complete lips prompt: ${beauty.lipsPrompt}` : "",
    promptOptionalSelection(
      "Eye shadow",
      beauty.eyeShadow,
      "No eyeshadow. Keep eyelids natural.",
    ),
    promptOptionalSelection(
      "Eyeliner",
      beauty.eyeLiner,
      "No eyeliner.",
    ),
    promptOptionalSelection(
      "Lashes",
      beauty.eyeLashes ?? mascara,
      "No mascara or false lashes.",
    ),
    promptOptionalSelection(
      "Brows",
      beauty.browStyle,
      "Do not change eyebrows.",
    ),
    promptOptionalSelection(
      "Foundation or skin base",
      beauty.skinType,
      "Do not add foundation. Keep natural skin texture.",
    ),
    promptOptionalSelection(
      "Blush color",
      beauty.blushColor,
      "No blush color.",
    ),
    promptOptionalSelection(
      "Blush placement",
      beauty.blushStyle,
      "No blush placement.",
    ),
    promptOptionalSelection(
      "Blush intensity",
      beauty.blushIntensity,
      "No blush intensity.",
    ),
    promptOptionalSelection(
      "Contour type",
      beauty.contourType,
      "No contour.",
    ),
    promptOptionalSelection(
      "Bronzer tone",
      beauty.bronzerTone,
      "No bronzer.",
    ),
    promptOptionalSelection(
      "Contour intensity",
      beauty.contourIntensity,
      "No contour intensity.",
    ),
    promptOptionalSelection(
      "Highlight placement",
      beauty.highlightPlacement,
      "No highlighter.",
    ),
    promptOptionalSelection(
      "Highlight tone",
      beauty.highlightTone,
      "No highlight tone.",
    ),
    promptOptionalSelection(
      "Highlight intensity",
      beauty.highlightIntensity,
      "No highlight intensity.",
    ),
    promptOptionalSelection(
      "Highlight finish",
      beauty.highlightFinish,
      "No highlight finish.",
    ),
  ]);

  return `
Create ONE ultra-realistic premium salon portrait of THE SAME WOMAN from the reference image.

ABSOLUTE RULES:
- Same face, same features, same age, same skin tone.
- Do NOT change face shape, eyes, nose, lips, jawline, or expression.
- No face reshaping.
- Do NOT beautify, enhance, smooth, or filter the face.
- Keep natural skin texture and imperfections.
- No beauty filters.
- No identity drift.
- Ultra-realistic photography only.
- No grid. Only one final portrait.
- The customer identity comes ONLY from the uploaded customer image.
- No catalog reference image is provided. Follow the selected catalog prompt text exactly.

${SOURCE_PRESERVATION_RULES}

REQUESTED STYLE:
- Haircut family: ${selectedHaircut}
- Haircut technical prompt: ${haircutDescription ?? selectedHaircut}
- Hairstyle: ${selectedHairStyle}
- Hairstyle technical prompt: ${hairStyleDescription ?? selectedHairStyle}
- Hair color: ${selectedHairColor}. Apply this color clearly and naturally across the generated hairstyle while preserving premium salon realism.
- Hair extensions: ${extensions === true ? "Yes" : "No"}

BEAUTY CATALOG REQUEST:
${beautyPrompt || "- Makeup: Keep natural, no additional catalog makeup selected."}

MAKEUP APPLICATION RULES:
- Apply only the selected beauty catalog requests above.
- If an item says no or none, do not apply that makeup category.
- Keep makeup realistic, professionally blended, and suitable for salon preview.
- Preserve the customer's natural facial structure and skin texture.
- Do not over-smooth skin, enlarge lips, enlarge eyes, or change identity.

LIGHTING:
- Keep the exact original lighting, shadows, exposure, background, crop, pose, and clothing from the source image.

Reference image:
${img}
`.trim();
}

function formatBridalStyle(selections?: string[] | string) {
  const values = Array.isArray(selections)
    ? selections
    : typeof selections === "string"
    ? [selections]
    : [];
  const cleanValues = values
    .map((value) => String(value).trim())
    .filter((value) => value.length > 0);

  return cleanValues[0] || "Middle Eastern style";
}

function buildBridalPrompt(img: string, bridal: BridalOptions = {}) {
  const bridalStyle = formatBridalStyle(bridal.styleOrigin);
  const bridalTheme =
    normalizeKey(bridalStyle) === "middleeasternstyle"
      ? "Middle Eastern / Arabic"
      : bridalStyle.replace(/\s*style$/i, "");

  return `
Create ONE single ultra-high-resolution image arranged in a 3x2 grid (6 variations).

Each grid cell must show THE SAME WOMAN from the reference image.
Her identity must NEVER change.

ABSOLUTE RULES:
- Same face, same features, same age, same skin tone.
- No face reshaping.
- No beauty filters.
- No AI face enhancement.
- No different person.
- Ultra-realistic photography only.
- Clear numbering 1-6 on each variation.

${SOURCE_PRESERVATION_RULES}

STYLE THEME:
Heavy ${bridalTheme} bridal makeup and bridal hairstyle only.
Use this as the only selected bridal style/origin: ${bridalStyle}.

Each variation must show a different heavy bridal makeup and hairstyle direction influenced by ${bridalTheme} bridal beauty:

1) Royal low bun with heavy sculpted bridal makeup
2) Soft glamorous waves with dramatic bridal eye makeup
3) High elegant bun with bold bridal contour and highlighted cheeks
4) Half-up romantic curls with intense bridal lashes and defined eyes
5) Voluminous curls with full glam bridal makeup
6) Classic ${bridalTheme} bridal updo with polished heavy bridal makeup

STYLE RULES:
- Generate exactly 6 unique bridal variations in the 3x2 grid.
- Only change hairstyle and makeup.
- Keep every hairstyle and makeup variation faithful to the selected ${bridalTheme} bridal style.
- Do not mix in unselected bridal origins or unrelated cultural styling.
- Keep the visual attention on the hairline, hairstyle shape, brows, eyes, lashes, lips, cheeks, contour, highlight, and skin texture.
- Do not restyle the visible outfit to create bridal dress variations.
- Do not add jewelry, earrings, necklaces, nose rings, hair ornaments, crowns, tiaras, veils, headpieces, flowers, pins, accessories, props, or decorative objects.

MAKEUP STYLE:
- Heavy professional ${bridalTheme} bridal makeup
- Deep defined smoky eyes or culturally appropriate dramatic eye makeup
- Strong eyeliner with long dramatic lashes
- Full coverage bridal base while preserving real skin texture
- Perfectly blended contour and bronzer
- Highlighted cheekbones
- Bold bridal lips suitable for the selected ${bridalTheme} style
- Matte luxury finish
- No plastic skin

HAIR & MAKEUP ONLY:
- Add no jewelry or accessories of any kind.
- Add no bridal dress, outfit change, veil, crown, tiara, headpiece, hair jewelry, flowers, or pins.
- Do not change the customer's clothing or outfit into a bridal dress.
- Preserve any existing jewelry or accessories already visible in the source image, but do not add new ones.

LIGHTING:
- Keep the exact original lighting direction, shadows, exposure, and color temperature from the source image.
- Do not convert the photo into wedding studio lighting if the source image was not shot that way.

BACKGROUND:
- Keep the exact original background from the uploaded image in every grid cell.
- NEVER change, replace, blur, stylize, or remove the background.

FINAL OUTPUT:
- Must look like a premium ${bridalTheme} bridal portfolio
- High-end wedding magazine quality
- Ultra-realistic DSLR photography
- No CGI, no illustration, no painting
- If clothing, background, camera angle, pose, lighting, or unselected features change, regenerate.

Reference image:
${img}
`.trim();
}

/* ============================================================
   GEMINI CLIENT
============================================================ */

async function callGemini(
  prompt: string,
  imageBase64: string,
  imageMimeType = "image/jpeg",
) {
  const parts: any[] = [
    { text: prompt },
    {
      inlineData: {
        mimeType: imageMimeType,
        data: imageBase64,
      },
    },
  ];

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

  const json = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(json));
  }

  const part = json.candidates?.[0]?.content?.parts?.find(
    (p: any) => p.inlineData
  );

  const resultBase64 = part?.inlineData?.data;

  if (!resultBase64) {
    throw new Error("No image returned from Gemini");
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
      src_file_base64,
      src_file_mime_type,
      mode,
      hairLength,
      makeup,
      dye,
      haircut,
      haircutId,
      hairStyle,
      hairStyleId,
      hairColor,
      hairColorId,
      lipstick,
      lipFinish,
      lipFinishDescription,
      lipStyle,
      lipStyleDescription,
      lipColor,
      lipColorDescription,
      lipsPrompt,
      eyeShadow,
      eyeLiner,
      eyeLashes,
      browStyle,
      skinType,
      blushColor,
      blushStyle,
      blushIntensity,
      contourType,
      bronzerTone,
      contourIntensity,
      highlightPlacement,
      highlightTone,
      highlightIntensity,
      highlightFinish,
      mascara,
      extensions,
      bridalStyleOrigin,
      log_context,
    } = body;

    if (!src_file_url && !src_file_base64) {
      return json(400, {
        ok: false,
        error: "Missing source image",
      });
    }

    const finalMode =
      String(mode).toLowerCase() === "bridal"
        ? "bridal"
        : String(mode).toLowerCase() === "catalog"
        ? "catalog"
        : "smart";

    /* ===============================
       Prepare image
    =============================== */

    const inlineImage = src_file_base64
      ? parseInlineImageData(src_file_base64, src_file_mime_type)
      : {
          imageBase64: await fetchImageBase64(src_file_url),
          mimeType: "image/jpeg",
        };
    const sourceReference =
      src_file_url || "Inline uploaded customer image supplied with this request.";

    /* ===============================
       Build prompt
    =============================== */

    const prompt =
      finalMode === "bridal"
        ? buildBridalPrompt(sourceReference, {
            styleOrigin: bridalStyleOrigin,
          })
        : finalMode === "catalog"
        ? buildCatalogPrompt(
            sourceReference,
            haircut,
            haircutId,
            hairStyle,
            hairStyleId,
            hairColor,
            hairColorId,
            lipstick,
            mascara,
            extensions,
            {
              lipstick,
              lipFinish,
              lipFinishDescription,
              lipStyle,
              lipStyleDescription,
              lipColor,
              lipColorDescription,
              lipsPrompt,
              eyeShadow,
              eyeLiner,
              eyeLashes,
              browStyle,
              skinType,
              blushColor,
              blushStyle,
              blushIntensity,
              contourType,
              bronzerTone,
              contourIntensity,
              highlightPlacement,
              highlightTone,
              highlightIntensity,
              highlightFinish,
              mascara,
              extensions,
            },
          )
        : buildSmartPrompt(sourceReference, hairLength, makeup, dye);

    /* ===============================
       Call Gemini
    =============================== */

    const logContext = (log_context || {}) as GeminiLogContext;
    const logId = await insertGeminiCallLog({
      request_id: logContext.request_id || null,
      user_id: logContext.user_id || null,
      edge_function: "gemini-women-style",
      gender: logContext.gender || "women",
      mode: logContext.mode || finalMode,
      customer_name: logContext.customer_name || null,
      customer_phone: logContext.customer_phone || null,
      src_file_url: null,
      selected_options: createSelectedOptions(body),
      prompt,
      gemini_model: GEMINI_MODEL,
      status: "started",
      started_at: new Date().toISOString(),
    });

    let result;

    try {
      result = await callGemini(
        prompt,
        inlineImage.imageBase64,
        inlineImage.mimeType,
      );
      await updateGeminiCallLog(logId, {
        status: "success",
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

    /* ===============================
       Return result
    =============================== */

    return json(200, {
      ok: true,
      mode: finalMode,
      image_base64: result.imageBase64,
    });
  } catch (e) {
    console.error("WOMEN EDGE ERROR:", e);

    return json(500, {
      ok: false,
      error: String(e),
    });
  }
});
