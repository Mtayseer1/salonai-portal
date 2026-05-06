export type StyleSessionGender = 'men' | 'women'

export type StyleSessionMode = 'smart' | 'catalog' | 'bridal'

export type WomenCatalogCategory =
  | 'style'
  | 'color'
  | 'makeup'
  | 'lips'
  | 'eyes'
  | 'brows'
  | 'skin'
  | 'blush'
  | 'contour'
  | 'highlight'
  | 'lashes'
  | 'review'

export type StyleSessionRoute =
  | '/style'
  | '/style/info'
  | '/style/photo'
  | '/style/men/options'
  | '/style/women/options'
  | '/style/women/catalog/style'
  | '/style/women/catalog/color'
  | '/style/women/catalog/makeup'
  | '/style/women/catalog/lips'
  | '/style/women/catalog/eyes'
  | '/style/women/catalog/brows'
  | '/style/women/catalog/skin'
  | '/style/women/catalog/blush'
  | '/style/women/catalog/contour'
  | '/style/women/catalog/highlight'
  | '/style/women/catalog/lashes'
  | '/style/women/catalog/review'
  | '/style/loading'
  | '/style/result'

export type StyleSessionStep =
  | 'start'
  | 'info'
  | 'photo'
  | 'men-options'
  | 'women-options'
  | `women-catalog-${WomenCatalogCategory}`
  | 'loading'
  | 'result'

export type StyleSessionStatus = 'draft' | 'ready' | 'generating' | 'completed' | 'failed'

export type StyleFlowSessionState = {
  gender: StyleSessionGender | null
  mode: StyleSessionMode | null
  imageFile: File | null
  imagePreviewUrl: string | null
  generatedImageUrl?: string
  generatedImageBase64?: string
  generationResponse?: unknown
  generationResultId?: string
  creditDeductedForResultId?: string
  generationError?: string
  hairLength?: string
  beardLength?: string
  hairStyle?: string
  beardStyle?: string
  haircutId?: string
  hairStyleId?: string
  hairColorId?: string
  makeup?: boolean
  dye?: boolean
  lipstick?: string
  lipFinish?: string
  lipStyle?: string
  lipColor?: string
  eyeShadow?: string
  eyeLiner?: string
  eyeLashes?: string
  browStyle?: string
  skinType?: string
  blushColor?: string
  blushStyle?: string
  blushIntensity?: string
  contourType?: string
  bronzerTone?: string
  contourIntensity?: string
  highlightPlacement?: string
  highlightTone?: string
  highlightIntensity?: string
  highlightFinish?: string
  mascara?: string
  extensions?: boolean
  customerName?: string
  customerPhone?: string
}

export type StyleFlowSessionPersistedState = Omit<StyleFlowSessionState, 'imageFile'>

export type MenStyleSessionOptions = Partial<
  Pick<
    StyleFlowSessionState,
    'hairLength' | 'beardLength' | 'hairStyle' | 'beardStyle'
  >
>

export type WomenStyleSessionOptions = Partial<
  Pick<
    StyleFlowSessionState,
    | 'hairLength'
    | 'haircutId'
    | 'hairStyleId'
    | 'hairColorId'
    | 'makeup'
    | 'dye'
    | 'lipstick'
    | 'lipFinish'
    | 'lipStyle'
    | 'lipColor'
    | 'eyeShadow'
    | 'eyeLiner'
    | 'eyeLashes'
    | 'browStyle'
    | 'skinType'
    | 'blushColor'
    | 'blushStyle'
    | 'blushIntensity'
    | 'contourType'
    | 'bronzerTone'
    | 'contourIntensity'
    | 'highlightPlacement'
    | 'highlightTone'
    | 'highlightIntensity'
    | 'highlightFinish'
    | 'mascara'
    | 'extensions'
  >
>

export type StyleSessionCustomerInfo = Partial<
  Pick<StyleFlowSessionState, 'customerName' | 'customerPhone'>
>

export type StyleSessionGenerationResult = {
  image_url?: string
  image_base64?: string
  imageUrl?: string
  imageBase64?: string
  generated_image_url?: string
  generatedImageUrl?: string
  generated_image_base64?: string
  generatedImageBase64?: string
  result?: {
    image_url?: string
    image_base64?: string
    imageUrl?: string
    imageBase64?: string
    generated_image_url?: string
    generatedImageUrl?: string
    generated_image_base64?: string
    generatedImageBase64?: string
  }
  data?: {
    image_url?: string
    image_base64?: string
    imageUrl?: string
    imageBase64?: string
    generated_image_url?: string
    generatedImageUrl?: string
    generated_image_base64?: string
    generatedImageBase64?: string
  }
  [key: string]: unknown
}

export type StyleSessionClientInfo = {
  name?: string
  phone?: string
  ageRange?: string
  notes?: string
}

export type StyleSessionPhoto = {
  source: 'upload' | 'camera'
  previewUrl?: string
  storagePath?: string
}

export type StyleCatalogSelection = {
  category: WomenCatalogCategory
  optionId: string
}

export type StyleSessionState = {
  id: string
  status: StyleSessionStatus
  currentStep: StyleSessionStep
  gender?: StyleSessionGender
  client: StyleSessionClientInfo
  photo?: StyleSessionPhoto
  selections: StyleCatalogSelection[]
  resultImageUrl?: string
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

export type WomenCatalogOption = {
  id: string
  label: string
  category: WomenCatalogCategory
  description?: string
  imagePath?: string
  haircutId?: string
  hairStyleId?: string
  hairColorId?: string
  parentHairStyleId?: string
  parentHaircutId?: string
}
