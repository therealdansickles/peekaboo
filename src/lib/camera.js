import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'

// Check if running on native platform (iOS/Android)
export function isNativePlatform() {
  return Capacitor.isNativePlatform()
}

// Take a photo using device camera
export async function takePicture() {
  if (!isNativePlatform()) return null

  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      correctOrientation: true,
    })
    return photo
  } catch (error) {
    console.error('Camera error:', error)
    throw error
  }
}

// Pick photo from gallery
export async function pickFromGallery() {
  if (!isNativePlatform()) return null

  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    })
    return photo
  } catch (error) {
    console.error('Gallery error:', error)
    throw error
  }
}

// Pick multiple photos from gallery
export async function pickMultiplePhotos() {
  if (!isNativePlatform()) return null

  try {
    const result = await Camera.pickImages({
      quality: 90,
    })
    return result.photos
  } catch (error) {
    console.error('Pick images error:', error)
    throw error
  }
}

// Convert Capacitor photo URI to File object for upload
export async function photoToFile(photo) {
  const response = await fetch(photo.webPath)
  const blob = await response.blob()
  const filename = `photo-${Date.now()}.jpg`
  return new File([blob], filename, { type: 'image/jpeg' })
}
