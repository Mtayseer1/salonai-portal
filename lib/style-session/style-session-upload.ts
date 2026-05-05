import { supabase } from '@/src/lib/supabase'

const CUSTOMER_IMAGES_BUCKET = 'customer-images'

export async function uploadStyleImageAndCreateSignedUrl(
  imageFile: File,
  customerPhone?: string,
) {
  const filePath = createFlutterUploadPath(imageFile, customerPhone)
  const { error: uploadError } = await supabase.storage
    .from(CUSTOMER_IMAGES_BUCKET)
    .upload(filePath, imageFile, {
      cacheControl: '300',
      contentType: imageFile.type || 'image/jpeg',
      upsert: false,
    })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const { data, error: signedUrlError } = await supabase.storage
    .from(CUSTOMER_IMAGES_BUCKET)
    .createSignedUrl(filePath, 300)

  if (signedUrlError || !data?.signedUrl) {
    throw new Error(signedUrlError?.message || 'Could not create image URL.')
  }

  return data.signedUrl
}

export async function persistMenSessionImages({
  userId,
  styleType,
  originalImageFile,
  generatedImageBlob,
}: {
  userId: string
  styleType: string
  originalImageFile: File
  generatedImageBlob: Blob
}) {
  const timestamp = Date.now()
  const createdAt = new Date(timestamp).toISOString()
  const originalPath = `style_sessions/${userId}/original_${timestamp}.${getImageExtension(originalImageFile)}`
  const generatedPath = `style_sessions/${userId}/generated_${timestamp}.${getBlobExtension(generatedImageBlob)}`

  await uploadPublicImage(originalPath, originalImageFile, originalImageFile.type || 'image/jpeg')
  await uploadPublicImage(generatedPath, generatedImageBlob, generatedImageBlob.type || 'image/png')

  const originalUrl = getPublicUrl(originalPath)
  const generatedUrl = getPublicUrl(generatedPath)
  const { error } = await supabase.from('style_sessions').insert({
    user_id: userId,
    original_image_url: originalUrl,
    generated_image_url: generatedUrl,
    style_type: styleType,
    created_at: createdAt,
    credits_used: 1,
  })

  if (error) {
    throw new Error(error.message)
  }

  return {
    originalUrl,
    generatedUrl,
  }
}

function createFlutterUploadPath(imageFile: File, customerPhone?: string) {
  const timestamp = Date.now()
  const extension = getImageExtension(imageFile)
  const folder = customerPhone?.trim() ? customerPhone.trim() : 'temp'

  return `${folder}/${timestamp}.${extension}`
}

async function uploadPublicImage(path: string, body: File | Blob, contentType: string) {
  const { error } = await supabase.storage
    .from(CUSTOMER_IMAGES_BUCKET)
    .upload(path, body, {
      cacheControl: '3600',
      contentType,
      upsert: true,
    })

  if (error) {
    throw new Error(error.message)
  }
}

function getPublicUrl(path: string) {
  const { data } = supabase.storage.from(CUSTOMER_IMAGES_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

function getImageExtension(imageFile: File) {
  const extensionFromName = imageFile.name.split('.').pop()

  if (extensionFromName) {
    return extensionFromName.toLowerCase()
  }

  if (imageFile.type === 'image/png') {
    return 'png'
  }

  if (imageFile.type === 'image/webp') {
    return 'webp'
  }

  return 'jpg'
}

function getBlobExtension(blob: Blob) {
  if (blob.type === 'image/jpeg') {
    return 'jpg'
  }

  if (blob.type === 'image/webp') {
    return 'webp'
  }

  return 'png'
}
