/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// @ts-ignore Deno/Supabase Edge Functions require explicit .ts extensions.
import { MEN_BEARD_OPTIONS } from "./men-beard-catalog.ts";
// @ts-ignore Deno/Supabase Edge Functions require explicit .ts extensions.
import { MEN_HAIR_OPTIONS } from "./men-hair-catalog.ts";

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
