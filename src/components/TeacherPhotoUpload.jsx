import { useState, useRef, useCallback } from 'react'
import { Camera, Upload, X, Check, Users, Send, Shield, Loader2, Image as ImageIcon } from 'lucide-react'
import { uploadPhotos } from '../lib/storage'

// Demo children for when Supabase isn't configured
const DEMO_CHILDREN = [
  { id: '1', first_name: 'Emma', last_initial: 'S', avatar_emoji: '👧' },
  { id: '2', first_name: 'Liam', last_initial: 'W', avatar_emoji: '👦' },
  { id: '3', first_name: 'Olivia', last_initial: 'M', avatar_emoji: '👧' },
  { id: '4', first_name: 'Noah', last_initial: 'B', avatar_emoji: '👦' },
  { id: '5', first_name: 'Ava', last_initial: 'K', avatar_emoji: '👧' },
]

export default function TeacherPhotoUpload({
  classroomId,
  classroomName = 'Butterflies',
  children: propChildren,
  onUploadComplete,
  onCancel,
}) {
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [selectedChildren, setSelectedChildren] = useState([])
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  // Use prop children or demo children
  const children = propChildren?.length > 0 ? propChildren : DEMO_CHILDREN
  const isDemoMode = !propChildren?.length

  // Handle file selection
  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length === 0) return

    // Filter for images only
    const imageFiles = selectedFiles.filter(f => f.type.startsWith('image/'))
    if (imageFiles.length !== selectedFiles.length) {
      setError('Some files were skipped - only images are allowed')
    }

    setFiles(prev => [...prev, ...imageFiles])

    // Generate previews
    imageFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviews(prev => [...prev, {
          file,
          url: e.target.result,
          name: file.name
        }])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  // Handle drag and drop
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFileSelect({ target: { files: droppedFiles } })
  }, [handleFileSelect])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  // Remove a preview
  const removePreview = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }, [])

  // Toggle child selection
  const toggleChild = useCallback((childId) => {
    setSelectedChildren(prev =>
      prev.includes(childId)
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    )
  }, [])

  // Select all children
  const selectAllChildren = useCallback(() => {
    setSelectedChildren(children.map(c => c.id))
  }, [children])

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedChildren([])
  }, [])

  // Handle upload
  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one photo')
      return
    }

    if (selectedChildren.length === 0) {
      setError('Please tag at least one child')
      return
    }

    setError(null)
    setUploading(true)
    setUploadProgress(0)

    try {
      if (isDemoMode) {
        // Simulate upload for demo mode
        for (let i = 0; i < files.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 500))
          setUploadProgress(((i + 1) / files.length) * 100)
        }
      } else {
        // Real upload
        await uploadPhotos(files, classroomId, selectedChildren, caption)
      }

      setSuccess(true)
      setTimeout(() => {
        setFiles([])
        setPreviews([])
        setSelectedChildren([])
        setCaption('')
        setSuccess(false)
        onUploadComplete?.()
      }, 2000)
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // Render success state
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-emerald-500" size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Photos Shared!</h2>
          <p className="text-gray-600">
            {files.length} photo{files.length !== 1 ? 's' : ''} sent securely to {selectedChildren.length} famil{selectedChildren.length !== 1 ? 'ies' : 'y'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-600">
            <Shield size={16} />
            <span>EXIF data stripped • URLs expire in 15 min</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-violet-600 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onCancel} className="text-white/80 hover:text-white">
            ← Back
          </button>
          {isDemoMode && (
            <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Demo Mode</span>
          )}
        </div>
        <h1 className="text-xl font-bold">Share Photos</h1>
        <p className="text-violet-200">{classroomName} Classroom</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
            <X size={18} />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Photo Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200 text-center hover:border-violet-300 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {previews.length === 0 ? (
            <>
              <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="text-violet-500" size={28} />
              </div>
              <p className="font-semibold text-gray-900 mb-1">Upload Photos</p>
              <p className="text-sm text-gray-500 mb-4">Drag & drop or tap to select</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm font-medium hover:bg-violet-600 transition-colors"
              >
                Choose Files
              </button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      onClick={() => removePreview(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-violet-300 hover:text-violet-500 transition-colors"
                >
                  <Camera size={24} />
                  <span className="text-xs mt-1">Add</span>
                </button>
              </div>
              <p className="text-sm text-gray-600">
                <ImageIcon size={14} className="inline mr-1" />
                {previews.length} photo{previews.length !== 1 ? 's' : ''} selected
              </p>
            </>
          )}
        </div>

        {/* Tag Children */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users size={18} className="text-violet-500" />
              Tag Children
            </h3>
            <div className="flex gap-2">
              <button
                onClick={selectAllChildren}
                className="text-sm text-violet-600 font-medium hover:text-violet-700"
              >
                All
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={clearSelection}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => toggleChild(child.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                  selectedChildren.includes(child.id)
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-gray-100 hover:border-gray-200 text-gray-700'
                }`}
              >
                <span className="text-lg">{child.avatar_emoji}</span>
                <span className="text-sm font-medium">
                  {child.first_name} {child.last_initial}.
                </span>
                {selectedChildren.includes(child.id) && (
                  <Check size={14} className="text-violet-500" />
                )}
              </button>
            ))}
          </div>

          {selectedChildren.length > 0 && (
            <p className="mt-3 text-sm text-gray-500">
              {selectedChildren.length} child{selectedChildren.length !== 1 ? 'ren' : ''} tagged — only their parents will see this photo
            </p>
          )}
        </div>

        {/* Caption */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <label className="block font-semibold text-gray-900 mb-2">Caption (optional)</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What's happening in this photo?"
            className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
            rows={2}
            maxLength={280}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{caption.length}/280</p>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="bg-violet-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="text-violet-500 animate-spin" size={20} />
              <span className="font-medium text-violet-700">
                Processing & uploading...
              </span>
            </div>
            <div className="w-full bg-violet-200 rounded-full h-2">
              <div
                className="bg-violet-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-violet-600 mt-2">
              Stripping EXIF data • Compressing images • Encrypting
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleUpload}
          disabled={files.length === 0 || selectedChildren.length === 0 || uploading}
          className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
            files.length > 0 && selectedChildren.length > 0 && !uploading
              ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-200 hover:shadow-xl'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Send size={18} />
              Share with {selectedChildren.length || 0} famil{selectedChildren.length !== 1 ? 'ies' : 'y'}
            </>
          )}
        </button>

        {/* Security Notice */}
        <div className="bg-emerald-50 rounded-xl p-3 flex items-start gap-3">
          <Shield className="text-emerald-500 mt-0.5 flex-shrink-0" size={18} />
          <div>
            <p className="text-sm text-emerald-800 font-medium">Secure Delivery</p>
            <p className="text-xs text-emerald-600">
              Photos are encrypted and EXIF/location data is stripped. Only tagged parents can view with time-limited signed URLs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
