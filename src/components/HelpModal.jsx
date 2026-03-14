import { useState } from 'react'
import { X, HelpCircle, Camera, Users, Heart, Mail, Lock, Image as ImageIcon, Download, Shield, Sparkles } from 'lucide-react'

export default function HelpModal({ isOpen, onClose, defaultTab = 'teacher' }) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 to-violet-600 text-white p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle size={24} />
            <h2 className="text-lg font-semibold">Help Center</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100 flex-shrink-0">
          <button
            onClick={() => setActiveTab('teacher')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'teacher'
                ? 'text-violet-600 border-b-2 border-violet-500 bg-violet-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Camera size={16} className="inline mr-2" />
            For Teachers
          </button>
          <button
            onClick={() => setActiveTab('parent')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'parent'
                ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Heart size={16} className="inline mr-2" />
            For Parents
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'teacher' ? (
            <TeacherHelp />
          ) : (
            <ParentHelp />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 flex-shrink-0">
          <p className="text-xs text-gray-400 text-center">
            Need more help? Contact support at help@peekaboo.photos
          </p>
        </div>
      </div>
    </div>
  )
}

function TeacherHelp() {
  return (
    <div className="space-y-6">
      {/* Upload photos */}
      <HelpSection
        icon={Camera}
        iconColor="text-violet-500"
        iconBg="bg-violet-100"
        title="Upload Photos"
      >
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>Tap the <strong>"Share Photos"</strong> button on your dashboard</li>
          <li>Select one or more photos from your camera roll</li>
          <li>Photos are automatically compressed and location data is removed for privacy</li>
          <li>Add an optional caption to describe the activity</li>
        </ol>
      </HelpSection>

      {/* Tag children */}
      <HelpSection
        icon={Users}
        iconColor="text-violet-500"
        iconBg="bg-violet-100"
        title="Tag Children"
      >
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>After selecting photos, you'll see a list of children in your classroom</li>
          <li>Tap each child who appears in the photo to tag them</li>
          <li>Use <strong>"All"</strong> to quickly select everyone, or <strong>"Clear"</strong> to start over</li>
          <li>Only parents of tagged children will be able to see the photo</li>
        </ol>
        <div className="mt-3 bg-violet-50 rounded-lg p-3 flex items-start gap-2">
          <Shield size={16} className="text-violet-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-violet-700">
            <strong>Privacy tip:</strong> Always double-check tags before uploading. Parents can only see photos where their child is specifically tagged.
          </p>
        </div>
      </HelpSection>

      {/* Manage classrooms */}
      <HelpSection
        icon={Sparkles}
        iconColor="text-violet-500"
        iconBg="bg-violet-100"
        title="Manage Your Classroom"
      >
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-2">
            <span className="text-violet-500">•</span>
            <span>View all children in your class from the dashboard</span>
          </li>
          <li className="flex gap-2">
            <span className="text-violet-500">•</span>
            <span>If you teach multiple classes, use the dropdown to switch between them</span>
          </li>
          <li className="flex gap-2">
            <span className="text-violet-500">•</span>
            <span>Photos are organized by date and show who you've tagged</span>
          </li>
          <li className="flex gap-2">
            <span className="text-violet-500">•</span>
            <span>You can delete your own photos by tapping the trash icon</span>
          </li>
        </ul>
      </HelpSection>

      {/* Security info */}
      <HelpSection
        icon={Lock}
        iconColor="text-emerald-500"
        iconBg="bg-emerald-100"
        title="Security & Privacy"
      >
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-2">
            <span className="text-emerald-500">•</span>
            <span><strong>EXIF data stripped:</strong> Location, camera info, and metadata are removed from all photos</span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-500">•</span>
            <span><strong>Signed URLs:</strong> Photo links expire after 15 minutes for extra security</span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-500">•</span>
            <span><strong>RLS protection:</strong> Database-level security ensures parents only see their own children's photos</span>
          </li>
        </ul>
      </HelpSection>
    </div>
  )
}

function ParentHelp() {
  return (
    <div className="space-y-6">
      {/* Sign in */}
      <HelpSection
        icon={Mail}
        iconColor="text-amber-500"
        iconBg="bg-amber-100"
        title="Sign In"
      >
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>Tap <strong>"I'm a Parent"</strong> on the home screen</li>
          <li>Enter your email address</li>
          <li>Check your inbox for a magic link (no password needed!)</li>
          <li>Tap the link to sign in automatically</li>
        </ol>
        <div className="mt-3 bg-amber-50 rounded-lg p-3 flex items-start gap-2">
          <Mail size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            <strong>Tip:</strong> Check your spam folder if you don't see the email within a minute.
          </p>
        </div>
      </HelpSection>

      {/* View photos */}
      <HelpSection
        icon={ImageIcon}
        iconColor="text-amber-500"
        iconBg="bg-amber-100"
        title="View Photos"
      >
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-2">
            <span className="text-amber-500">•</span>
            <span>Your child's photos appear in the <strong>Photos</strong> tab</span>
          </li>
          <li className="flex gap-2">
            <span className="text-amber-500">•</span>
            <span>Photos update in real-time as teachers share new ones</span>
          </li>
          <li className="flex gap-2">
            <span className="text-amber-500">•</span>
            <span>If you have multiple children, use the tabs at the top to switch between them</span>
          </li>
          <li className="flex gap-2">
            <span className="text-amber-500">•</span>
            <span>Pull down or tap refresh to check for new photos</span>
          </li>
        </ul>
      </HelpSection>

      {/* Favorite & download */}
      <HelpSection
        icon={Heart}
        iconColor="text-amber-500"
        iconBg="bg-amber-100"
        title="Favorite & Download"
      >
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-2">
            <Heart size={14} className="text-amber-500 mt-1 flex-shrink-0" />
            <span>Tap the heart icon to save a photo to your favorites</span>
          </li>
          <li className="flex gap-2">
            <Download size={14} className="text-amber-500 mt-1 flex-shrink-0" />
            <span>Tap the download icon to save a photo to your device</span>
          </li>
        </ul>
      </HelpSection>

      {/* Contact teacher */}
      <HelpSection
        icon={Users}
        iconColor="text-amber-500"
        iconBg="bg-amber-100"
        title="Contact Your Teacher"
      >
        <p className="text-sm text-gray-600 mb-3">
          Have questions or concerns about a photo? Contact your child's teacher directly through the school.
        </p>
        <p className="text-sm text-gray-600">
          <strong>Messages feature coming soon!</strong> You'll be able to send quick messages to teachers directly in the app.
        </p>
      </HelpSection>

      {/* Security info */}
      <HelpSection
        icon={Lock}
        iconColor="text-emerald-500"
        iconBg="bg-emerald-100"
        title="Your Privacy"
      >
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-2">
            <span className="text-emerald-500">•</span>
            <span>You can <strong>only</strong> see photos where your child is tagged</span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-500">•</span>
            <span>Other parents cannot see your child's photos unless their child is also tagged</span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-500">•</span>
            <span>Photo URLs expire every 15 minutes and cannot be shared publicly</span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-500">•</span>
            <span>All photos are encrypted during transfer and storage</span>
          </li>
        </ul>
      </HelpSection>
    </div>
  )
}

function HelpSection({ icon, iconColor, iconBg, title, children }) {
  const IconComponent = icon
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
          <IconComponent size={18} className={iconColor} />
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  )
}

// Export a simple help button component for use in navbars
export function HelpButton({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${className}`}
      title="Help"
    >
      <HelpCircle size={20} className="text-gray-500" />
    </button>
  )
}
