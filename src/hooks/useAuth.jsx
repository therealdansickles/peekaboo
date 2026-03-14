import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/auth'
import { identify, reset as resetAnalytics, authEvents } from '../lib/analytics'
import { setUser as setSentryUser, clearUser as clearSentryUser } from '../lib/sentry'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          loadProfile()
        } else {
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error('Error getting session:', error)
        setLoading(false)
      })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await loadProfile()
        } else {
          setProfile(null)
          setLoading(false)
          // Reset analytics and error tracking on sign-out
          resetAnalytics()
          clearSentryUser()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile() {
    try {
      const profile = await getProfile()
      setProfile(profile)

      // Identify user in analytics and error tracking (role only, no PII)
      if (profile?.id) {
        identify(profile.id, {
          role: profile.role,
          createdAt: profile.created_at,
        })
        setSentryUser(profile.id, profile.role)
        authEvents.signedIn(profile.role)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    isTeacher: profile?.role === 'teacher',
    isParent: profile?.role === 'parent',
    refreshProfile: loadProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
