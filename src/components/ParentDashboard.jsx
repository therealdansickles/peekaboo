import { useState } from 'react'
import { Heart, Image as ImageIcon, MessageCircle, Lock, Clock, Users, RefreshCw, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useMyChildren } from '../hooks/useChildren'
import { usePhotos } from '../hooks/usePhotos'
import PhotoCard from './PhotoCard'

export default function ParentDashboard({ onBack }) {
  const { profile } = useAuth()
  const { children, loading: childrenLoading } = useMyChildren()
  const [selectedChild, setSelectedChild] = useState(null)
  const [activeTab, setActiveTab] = useState('photos')

  // Get the active child (first one by default)
  const activeChild = selectedChild || children[0]

  // Get photos for the active child's classroom
  const { photos, loading: photosLoading, refresh: refreshPhotos, toggleFavorite } = usePhotos(
    activeChild?.classroom_id
  )

  // Filter photos to only show ones where active child is tagged
  const childPhotos = photos.filter(photo =>
    photo.photo_children?.some(pc => pc.child_id === activeChild?.id)
  )

  if (childrenLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="mx-auto mb-3 text-amber-500 animate-spin" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
              ← Back
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center">
                <Heart className="text-white" size={16} />
              </div>
              <span className="font-semibold text-gray-900">Parent View</span>
            </div>
            <div className="w-12" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm">
            <div className="text-6xl mb-4">👶</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Children Linked</h2>
            <p className="text-gray-600 mb-6">
              You haven't been linked to any children yet. Ask your child's school to send you an invitation.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center">
              <Heart className="text-white" size={16} />
            </div>
            <span className="font-semibold text-gray-900">Parent View</span>
          </div>
          <div className="w-12" />
        </div>
      </div>

      {/* Child Banner */}
      <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
            {activeChild?.avatar_emoji || '👶'}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">
              {activeChild?.first_name} {activeChild?.last_initial}.'s Day
            </h2>
            <p className="text-amber-100 text-sm">
              {activeChild?.classroom?.name || 'Classroom'} • Today
            </p>
          </div>
        </div>

        {/* Child selector if multiple */}
        {children.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeChild?.id === child.id
                    ? 'bg-white text-amber-600'
                    : 'bg-white/20 text-white'
                }`}
              >
                <span>{child.avatar_emoji}</span>
                <span className="text-sm font-medium">{child.first_name}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <div className="bg-white/20 px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
            <ImageIcon size={14} />
            <span>{childPhotos.length} photos</span>
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div className="bg-emerald-50 px-4 py-2 flex items-center justify-center gap-2 text-sm text-emerald-700">
        <Lock size={14} />
        <span>End-to-end encrypted • URLs expire in 15 min</span>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-4">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'photos'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <ImageIcon size={18} />
              <span className="font-medium">Photos</span>
              {childPhotos.length > 0 && (
                <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full">
                  {childPhotos.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'messages'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <span className="font-medium">Messages</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'photos' ? (
          <div className="space-y-4">
            {/* Refresh button */}
            <div className="flex justify-end">
              <button
                onClick={refreshPhotos}
                disabled={photosLoading}
                className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
              >
                <RefreshCw size={18} className={photosLoading ? 'animate-spin' : ''} />
              </button>
            </div>

            {photosLoading ? (
              <div className="text-center py-12">
                <Loader2 size={32} className="mx-auto mb-3 text-amber-500 animate-spin" />
                <p className="text-gray-500">Loading photos...</p>
              </div>
            ) : childPhotos.length > 0 ? (
              <div className="space-y-4">
                {childPhotos.map(photo => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
                <p>No photos yet today</p>
                <p className="text-sm">Check back later for new photos from {activeChild?.first_name}'s classroom</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center">
            <MessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Messages feature coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}
