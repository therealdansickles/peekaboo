import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { signOut } from './lib/auth'
import LandingPage from './components/LandingPage'
import TeacherDashboard from './components/TeacherDashboard'
import AuthScreen from './components/AuthScreen'
import ParentDashboard from './components/ParentDashboard'
import { LogOut, User, AlertCircle, X } from 'lucide-react'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { supabase } from './lib/supabase'

// Auth error banner component (moved outside render)
function AuthErrorBanner({ authError, setAuthError, setShowAuth }) {
  if (!authError) return null
  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3 shadow-lg">
        <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-red-800 font-medium text-sm">Sign in failed</p>
          <p className="text-red-600 text-sm mt-1">{authError}</p>
          <button
            onClick={() => setShowAuth(true)}
            className="text-red-700 font-medium text-sm mt-2 hover:underline"
          >
            Try again
          </button>
        </div>
        <button
          onClick={() => setAuthError(null)}
          className="text-red-400 hover:text-red-600"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

// User header component (moved outside render)
function UserHeader({ user, profile, onSignOut }) {
  if (!user) return null
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <div className="bg-white shadow-lg rounded-full px-3 py-1.5 flex items-center gap-2 text-sm">
        <User size={16} className="text-violet-500" />
        <span className="text-gray-700 max-w-[120px] truncate">{profile?.email || user.email}</span>
        <button
          onClick={onSignOut}
          className="p-1 hover:bg-gray-100 rounded-full"
          title="Sign out"
        >
          <LogOut size={14} className="text-gray-400" />
        </button>
      </div>
    </div>
  )
}

function AppContent() {
  const { user, profile, loading } = useAuth()
  const [screen, setScreen] = useState('landing')
  const [showAuth, setShowAuth] = useState(false)
  const [authError, setAuthError] = useState(null)

  // Handle auth callback (magic link redirect) - web and mobile
  useEffect(() => {
    // Web: Handle URL hash tokens
    const hash = window.location.hash
    const params = new URLSearchParams(hash.substring(1))

    // Check for errors in the hash (from failed magic links)
    const error = params.get('error')
    const errorDescription = params.get('error_description')

    if (error) {
      console.error('Auth error:', error, errorDescription)
      setAuthError(errorDescription?.replace(/\+/g, ' ') || 'Authentication failed')
      // Clear the hash
      window.history.replaceState(null, '', window.location.pathname)
    } else if (hash && hash.includes('access_token')) {
      // Success - Supabase client will auto-detect and process the tokens
      // Clear the hash after a brief delay to let Supabase process
      setTimeout(() => {
        window.history.replaceState(null, '', window.location.pathname)
      }, 100)
    }

    // Mobile: Handle deep link auth callbacks
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('appUrlOpen', async ({ url }) => {
        console.log('Deep link received:', url)

        // Parse the URL for auth tokens
        if (url.includes('auth-callback')) {
          try {
            // Extract tokens from the URL
            const urlObj = new URL(url)
            const fragment = urlObj.hash.substring(1)
            const fragmentParams = new URLSearchParams(fragment)

            const accessToken = fragmentParams.get('access_token')
            const refreshToken = fragmentParams.get('refresh_token')

            if (accessToken && refreshToken && supabase) {
              // Set the session manually
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              })

              if (error) {
                console.error('Session error:', error)
                setAuthError('Failed to complete sign in')
              }
            }
          } catch (err) {
            console.error('Deep link parse error:', err)
            setAuthError('Failed to process sign in link')
          }
        }
      })
    }

    return () => {
      if (Capacitor.isNativePlatform()) {
        CapacitorApp.removeAllListeners()
      }
    }
  }, [])

  // Auto-route based on user role
  useEffect(() => {
    if (profile) {
      if (profile.role === 'teacher' || profile.role === 'admin') {
        setScreen('teacher')
      } else if (profile.role === 'parent') {
        setScreen('parent')
      }
      setShowAuth(false)
    }
  }, [profile])

  const handleSignOut = async () => {
    await signOut()
    setScreen('landing')
  }

  const handleSelectRole = (role) => {
    if (user) {
      // Already logged in, go directly to dashboard
      setScreen(role)
    } else {
      // Need to login first
      setShowAuth(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (showAuth) {
    return (
      <AuthScreen
        onBack={() => setShowAuth(false)}
      />
    )
  }

  switch (screen) {
    case 'teacher':
      return (
        <>
          <AuthErrorBanner authError={authError} setAuthError={setAuthError} setShowAuth={setShowAuth} />
          <UserHeader user={user} profile={profile} onSignOut={handleSignOut} />
          <TeacherDashboard onBack={() => setScreen('landing')} />
        </>
      )
    case 'parent':
      return (
        <>
          <AuthErrorBanner authError={authError} setAuthError={setAuthError} setShowAuth={setShowAuth} />
          <UserHeader user={user} profile={profile} onSignOut={handleSignOut} />
          <ParentDashboard onBack={() => setScreen('landing')} />
        </>
      )
    default:
      return (
        <>
          <AuthErrorBanner authError={authError} setAuthError={setAuthError} setShowAuth={setShowAuth} />
          <UserHeader user={user} profile={profile} onSignOut={handleSignOut} />
          <LandingPage
            onSelectRole={handleSelectRole}
            user={user}
            profile={profile}
          />
        </>
      )
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
