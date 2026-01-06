import imageCompression from 'browser-image-compression'
import { supabase } from './supabase'

// Strip EXIF data and compress image
async function processImage(file) {
  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: false, // Disabled - can cause hanging issues
    fileType: 'image/jpeg',
  }

  try {
    console.log('Processing image:', file.name, file.size)
    const compressedFile = await imageCompression(file, options)
    console.log('Image processed:', compressedFile.size)
    return compressedFile
  } catch (error) {
    console.error('Error processing image:', error)
    throw error
  }
}

// Upload photo to Supabase Storage
export async function uploadPhoto(file, classroomId) {
  if (!supabase) throw new Error('Supabase not configured')

  // Process image (strips EXIF, compresses)
  const processedFile = await processImage(file)

  // Generate unique filename
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(7)
  const filename = `${classroomId}/${timestamp}-${randomStr}.jpg`

  // Upload to private bucket
  const { data, error } = await supabase.storage
    .from('photos')
    .upload(filename, processedFile, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
    })

  if (error) throw error

  return {
    storagePath: data.path,
    filename,
  }
}

// Get signed URL for a photo (15-minute expiration)
export async function getSignedUrl(storagePath) {
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase.storage
    .from('photos')
    .createSignedUrl(storagePath, 900) // 900 seconds = 15 minutes

  if (error) throw error
  return data.signedUrl
}

// Upload multiple photos with child tags
export async function uploadPhotos(files, classroomId, childIds, caption) {
  if (!supabase) throw new Error('Supabase not configured')

  console.log('Starting uploadPhotos:', { filesCount: files.length, classroomId, childIds, caption })

  const results = []
  const { data: { user } } = await supabase.auth.getUser()
  console.log('Got user:', user?.id)

  for (const file of files) {
    // Upload to storage
    console.log('Uploading to storage...')
    const { storagePath } = await uploadPhoto(file, classroomId)
    console.log('Storage upload complete:', storagePath)

    // Create photo record
    console.log('Inserting into photos table...')
    const { data: photo, error: photoError } = await supabase
      .from('photos')
      .insert({
        classroom_id: classroomId,
        storage_path: storagePath,
        caption,
        uploaded_by: user.id,
      })
      .select()
      .single()

    if (photoError) {
      console.error('Photo insert error:', photoError)
      throw photoError
    }
    console.log('Photo record created:', photo?.id)

    // Tag children in photo
    if (childIds.length > 0) {
      console.log('Tagging children...')
      const tags = childIds.map(childId => ({
        photo_id: photo.id,
        child_id: childId,
      }))

      const { error: tagError } = await supabase
        .from('photo_children')
        .insert(tags)

      if (tagError) {
        console.error('Tag insert error:', tagError)
        throw tagError
      }
      console.log('Children tagged successfully')
    }

    results.push(photo)
  }

  console.log('Upload complete!', results.length)
  return results
}
