import { useState } from 'react'
import { Heart, Download, Clock, Lock, Trash2, Users } from 'lucide-react'

export default function PhotoCard({
  photo,
  onFavorite,
  onDelete,
  showDelete = false,
  compact = false
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const timeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const handleDownload = async () => {
    if (!photo.signedUrl) return

    try {
      const response = await fetch(photo.signedUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `peekaboo-${photo.id}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (e) {
      console.error('Download failed:', e)
    }
  }

  if (compact) {
    return (
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
        {photo.signedUrl && !imageError ? (
          <img
            src={photo.signedUrl}
            alt={photo.caption || 'Photo'}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Lock size={24} />
          </div>
        )}
        {photo.taggedChildren?.length > 0 && (
          <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
            <Users size={10} />
            {photo.taggedChildren.length}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {photo.signedUrl && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={photo.signedUrl}
              alt={photo.caption || 'Photo'}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Lock size={32} />
            <span className="text-sm mt-2">Unable to load</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>{timeAgo(photo.created_at)}</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onFavorite?.(photo.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Heart
                size={20}
                className={photo.isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'}
              />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download size={20} className="text-gray-400" />
            </button>
            {showDelete && (
              <button
                onClick={() => onDelete?.(photo.id)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={20} className="text-gray-400 hover:text-red-500" />
              </button>
            )}
          </div>
        </div>

        {/* Caption */}
        {photo.caption && (
          <p className="text-gray-900 mb-3">{photo.caption}</p>
        )}

        {/* Tagged children */}
        {photo.taggedChildren?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {photo.taggedChildren.filter(child => child != null).map((child, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-1 bg-violet-50 text-violet-700 rounded-full text-xs"
              >
                <span>{child.avatar_emoji || '👤'}</span>
                <span>{child.first_name || 'Child'}</span>
              </span>
            ))}
          </div>
        )}

        {/* Uploader */}
        {photo.uploader?.full_name && (
          <p className="text-xs text-gray-400">
            Shared by {photo.uploader.full_name}
          </p>
        )}

        {/* Security footer */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
          <Lock size={12} />
          <span>Signed URL • Expires in 15 min</span>
        </div>
      </div>
    </div>
  )
}
