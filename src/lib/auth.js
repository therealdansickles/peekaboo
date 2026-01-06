import { supabase } from './supabase'

// Send magic link to email
export async function sendMagicLink(email) {
  if (!supabase) throw new Error('Supabase not configured')

  // Use origin directly - simpler and more reliable
  const redirectUrl = window.location.origin

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl,
    },
  })

  if (error) throw error
  return { success: true }
}

// Sign out
export async function signOut() {
  if (!supabase) throw new Error('Supabase not configured')

  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current session
export async function getSession() {
  if (!supabase) return null

  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

// Get current user's profile with role
export async function getProfile() {
  if (!supabase) return null

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, schools(*)')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return profile
}

// Accept invitation and link to child
export async function acceptInvitation(token) {
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase.rpc('accept_invitation', {
    invitation_token: token
  })

  if (error) throw error
  return data
}
