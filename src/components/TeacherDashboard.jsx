import { useState } from 'react'
import { Camera, MessageCircle, Eye, Shield, Users, Image as ImageIcon, RefreshCw, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTeacherClassrooms } from '../hooks/useClassrooms'
import { useChildren } from '../hooks/useChildren'
import { usePhotos } from '../hooks/usePhotos'
import TeacherPhotoUpload from './TeacherPhotoUpload'
import PhotoCard from './PhotoCard'

// Demo data when Supabase isn't configured
const DEMO_CLASSROOM = {
  id: 'demo-classroom',
  name: 'Butterflies',
  school: { name: 'Sunshine Preschool' }
}

export default function TeacherDashboard({ onBack }) {
  const { profile } = useAuth()
  const { classrooms, loading: classroomsLoading } = useTeacherClassrooms()
  const [selectedClassroom, setSelectedClassroom] = useState(null)
  const [activeTab, setActiveTab] = useState('photos')
  const [showUpload, setShowUpload] = useState(false)

  // Use first classroom or demo
  const classroom = selectedClassroom || classrooms[0] || DEMO_CLASSROOM
  const isDemoMode = classrooms.length === 0

  // Get children for the classroom
  const { children, loading: childrenLoading } = useChildren(classroom?.id)

  // Get photos for the classroom
  const { photos, loading: photosLoading, refresh: refreshPhotos } = usePhotos(
    isDemoMode ? null : classroom?.id
  )

  const handleUploadComplete = () => {
    setShowUpload(false)
    // Refresh photos after upload
    refreshPhotos()
  }

  if (showUpload) {
    return (
      <TeacherPhotoUpload
        classroomId={classroom.id}
        classroomName={classroom.name}
        children={children}
        onUploadComplete={handleUploadComplete}
        onCancel={() => setShowUpload(false)}
      />
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
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Eye className="text-white" size={16} />
            </div>
            <span className="font-semibold text-gray-900">Teacher Dashboard</span>
          </div>
          <div className="w-12" />
        </div>
      </div>

      {/* Classroom Banner */}
      <div className="bg-gradient-to-r from-violet-500 to-violet-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{classroom.name} Classroom</h2>
            <p className="text-violet-200 text-sm">
              {isDemoMode ? 'Demo Mode' : classroom.school?.name}
              {children.length > 0 && ` • ${children.length} children`}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full text-sm">
            <Shield size={14} />
            <span>Secure</span>
          </div>
        </div>

        {/* Classroom selector if multiple */}
        {classrooms.length > 1 && (
          <select
            value={classroom.id}
            onChange={(e) => setSelectedClassroom(classrooms.find(c => c.id === e.target.value))}
            className="mt-3 w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm appearance-none"
          >
            {classrooms.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-4">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'photos'
                ? 'border-violet-500 text-violet-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <Camera size={18} />
              <span className="font-medium">Photos</span>
              {photos.length > 0 && (
                <span className="bg-violet-100 text-violet-600 text-xs px-2 py-0.5 rounded-full">
                  {photos.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'messages'
                ? 'border-violet-500 text-violet-600'
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
            {/* Upload Button */}
            <button
              onClick={() => setShowUpload(true)}
              className="w-full bg-white rounded-2xl p-6 border-2 border-dashed border-violet-200 text-center hover:border-violet-400 hover:bg-violet-50 transition-all group"
            >
              <div className="w-16 h-16 bg-violet-100 group-hover:bg-violet-200 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <Camera className="text-violet-500" size={28} />
              </div>
              <p className="font-semibold text-gray-900 mb-1">Share Photos</p>
              <p className="text-sm text-gray-500">Tap to upload and tag children</p>
            </button>

            {/* Recent Photos */}
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <ImageIcon size={18} className="text-violet-500" />
                  Recent Photos
                </h3>
                {!isDemoMode && (
                  <button
                    onClick={refreshPhotos}
                    disabled={photosLoading}
                    className="p-2 text-gray-400 hover:text-violet-500 hover:bg-violet-50 rounded-lg transition-colors"
                  >
                    <RefreshCw size={18} className={photosLoading ? 'animate-spin' : ''} />
                  </button>
                )}
              </div>

              {photosLoading ? (
                <div className="text-center py-8">
                  <Loader2 size={32} className="mx-auto mb-3 text-violet-500 animate-spin" />
                  <p className="text-gray-500">Loading photos...</p>
                </div>
              ) : photos.length > 0 ? (
                <div className="space-y-4">
                  {photos.map(photo => (
                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      showDelete={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No photos yet today</p>
                  <p className="text-sm">Tap above to share your first photo</p>
                </div>
              )}
            </div>

            {/* Children Overview */}
            <div className="bg-white rounded-2xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users size={18} className="text-violet-500" />
                Your Class
              </h3>
              {childrenLoading ? (
                <p className="text-gray-500 text-sm">Loading...</p>
              ) : children.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {children.map(child => (
                    <div
                      key={child.id}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl"
                    >
                      <span className="text-lg">{child.avatar_emoji}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {child.first_name} {child.last_initial}.
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  {isDemoMode
                    ? 'Demo mode - children will appear when connected to Supabase'
                    : 'No children in this classroom yet'}
                </p>
              )}
            </div>
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
