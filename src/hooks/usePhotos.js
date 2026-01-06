import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getSignedUrl } from '../lib/storage'

export function usePhotos(classroomId) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadPhotos = useCallback(async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Query photos - RLS automatically filters to authorized photos
      let query = supabase
        .from('photos')
        .select(`
          *,
          photo_children(child_id, children(first_name, last_initial, avatar_emoji)),
          uploader:profiles!uploaded_by(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      // Filter by classroom if provided
      if (classroomId) {
        query = query.eq('classroom_id', classroomId)
      }

      const { data, error: queryError } = await query

      if (queryError) throw queryError

      // Get signed URLs for each photo
      const photosWithUrls = await Promise.all(
        (data || []).map(async (photo) => {
          try {
            const signedUrl = await getSignedUrl(photo.storage_path)
            return {
              ...photo,
              signedUrl,
              taggedChildren: photo.photo_children?.map(pc => pc.children) || []
            }
          } catch (e) {
            console.error('Error getting signed URL for photo:', photo.id, e)
            return {
              ...photo,
              signedUrl: null,
              taggedChildren: photo.photo_children?.map(pc => pc.children) || []
            }
          }
        })
      )

      setPhotos(photosWithUrls)
    } catch (err) {
      console.error('Error loading photos:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [classroomId])

  useEffect(() => {
    loadPhotos()

    // Subscribe to new photos in realtime
    if (!supabase) return

    const subscription = supabase
      .channel('photos-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'photos' },
        () => {
          loadPhotos()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [loadPhotos])

  const toggleFavorite = async (photoId) => {
    if (!supabase) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const photo = photos.find(p => p.id === photoId)
    const isFavorited = photo?.photo_favorites?.some(f => f.user_id === user.id)

    if (isFavorited) {
      await supabase
        .from('photo_favorites')
        .delete()
        .eq('photo_id', photoId)
        .eq('user_id', user.id)
    } else {
      await supabase
        .from('photo_favorites')
        .insert({ photo_id: photoId, user_id: user.id })
    }

    await loadPhotos()
  }

  return {
    photos,
    loading,
    error,
    refresh: loadPhotos,
    toggleFavorite,
  }
}
