import { Camera, Heart, ChevronRight, Lock, Eye, EyeOff, Clock, Shield } from 'lucide-react'

function SecurityBadge({ label, icon: Icon }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
      <Icon size={12} />
      <span>{label}</span>
    </div>
  )
}

export default function LandingPage({ onSelectRole }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-amber-50 flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
            <Eye className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900">peekaboo</span>
        </div>
        <SecurityBadge label="Encrypted" icon={Lock} />
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-amber-400 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-violet-200 rotate-3">
          <Camera className="text-white" size={40} />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          See their day.<br />
          <span className="text-violet-600">Safely.</span>
        </h1>

        <p className="text-gray-600 max-w-sm mb-8 leading-relaxed">
          Ultra-secure photo sharing for preschools. No billing. No complexity. Just the moments that matter.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <SecurityBadge label="Signed URLs" icon={Clock} />
          <SecurityBadge label="Zero Public Access" icon={EyeOff} />
          <SecurityBadge label="EXIF Stripped" icon={Shield} />
        </div>

        {/* Role Selection */}
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={() => onSelectRole('teacher')}
            className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl flex items-center gap-4 hover:border-violet-200 hover:bg-violet-50 transition-all group"
          >
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center group-hover:bg-violet-200 transition-colors">
              <Camera className="text-violet-600" size={24} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-900">I'm a Teacher</div>
              <div className="text-sm text-gray-500">Share photos & updates</div>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </button>

          <button
            onClick={() => onSelectRole('parent')}
            className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl flex items-center gap-4 hover:border-amber-200 hover:bg-amber-50 transition-all group"
          >
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-200 transition-colors">
              <Heart className="text-amber-600" size={24} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-900">I'm a Parent</div>
              <div className="text-sm text-gray-500">See my child's day</div>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-gray-400">
          Photos encrypted at rest and in transit. URLs expire after 15 minutes.
        </p>
      </div>
    </div>
  )
}
