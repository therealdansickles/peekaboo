/**
 * Peekaboo Analytics Utility
 *
 * Privacy-first analytics using PostHog.
 * Tracks aggregate metrics without storing PII or child data.
 *
 * To enable analytics:
 * 1. Create a PostHog account at https://posthog.com
 * 2. Add VITE_POSTHOG_KEY to your .env file
 * 3. Optionally add VITE_POSTHOG_HOST for self-hosted instances
 */

import posthog from 'posthog-js'

// Initialize only if PostHog key is configured
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

let isInitialized = false

/**
 * Initialize PostHog analytics
 * Call this once when the app starts
 */
export function initAnalytics() {
  if (isInitialized || !POSTHOG_KEY) {
    if (!POSTHOG_KEY && import.meta.env.DEV) {
      console.log('[Analytics] PostHog not configured - add VITE_POSTHOG_KEY to enable')
    }
    return
  }

  try {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      // Privacy settings aligned with Peekaboo's privacy-first approach
      persistence: 'localStorage',
      autocapture: false, // We'll manually track important events
      capture_pageview: true,
      capture_pageleave: true,
      disable_session_recording: true, // No session recordings for privacy
      respect_dnt: true, // Respect Do Not Track
      opt_out_capturing_by_default: false,
      // Mask sensitive data
      mask_all_text: false,
      mask_all_element_attributes: false,
    })
    isInitialized = true
    console.log('[Analytics] PostHog initialized')
  } catch (error) {
    console.error('[Analytics] Failed to initialize PostHog:', error)
  }
}

/**
 * Track a custom event
 * @param {string} event - Event name
 * @param {object} properties - Event properties (no PII or child data)
 */
export function track(event, properties = {}) {
  if (!isInitialized) return

  try {
    posthog.capture(event, {
      ...properties,
      timestamp: new Date().toISOString(),
      platform: getPlatform(),
    })
  } catch (error) {
    console.error('[Analytics] Track error:', error)
  }
}

/**
 * Identify a user (call after sign-in)
 * @param {string} userId - User's Supabase UUID
 * @param {object} traits - User traits (role, not PII)
 */
export function identify(userId, traits = {}) {
  if (!isInitialized) return

  try {
    posthog.identify(userId, {
      role: traits.role,
      // Don't store email or PII - just role for segmentation
      created_at: traits.createdAt,
    })
  } catch (error) {
    console.error('[Analytics] Identify error:', error)
  }
}

/**
 * Reset user identity (call on sign-out)
 */
export function reset() {
  if (!isInitialized) return

  try {
    posthog.reset()
  } catch (error) {
    console.error('[Analytics] Reset error:', error)
  }
}

/**
 * Set a user property
 * @param {object} properties - Properties to set
 */
export function setUserProperties(properties) {
  if (!isInitialized) return

  try {
    posthog.people.set(properties)
  } catch (error) {
    console.error('[Analytics] Set properties error:', error)
  }
}

/**
 * Get the current platform
 */
function getPlatform() {
  // Check if running in Capacitor
  if (window.Capacitor?.isNativePlatform()) {
    return window.Capacitor.getPlatform() // 'ios' or 'android'
  }
  return 'web'
}

// ============================================================
// Pre-defined Event Helpers
// These ensure consistent event naming and properties
// ============================================================

/**
 * Track authentication events
 */
export const authEvents = {
  magicLinkRequested: (role) =>
    track('magic_link_requested', { role }),

  signedIn: (role) =>
    track('signed_in', { method: 'magic_link', role }),

  signedOut: () =>
    track('signed_out'),

  signInFailed: (reason) =>
    track('sign_in_failed', { reason }),
}

/**
 * Track photo events
 */
export const photoEvents = {
  uploaded: (count, childrenTagged) =>
    track('photo_uploaded', {
      count,
      children_tagged: childrenTagged,
    }),

  uploadFailed: (reason, fileCount) =>
    track('upload_failed', { reason, file_count: fileCount }),

  viewed: () =>
    track('photo_viewed'),

  downloaded: () =>
    track('photo_downloaded'),

  favorited: () =>
    track('photo_favorited'),

  unfavorited: () =>
    track('photo_unfavorited'),
}

/**
 * Track app events
 */
export const appEvents = {
  opened: (source) =>
    track('app_opened', { source }),

  roleSelected: (role) =>
    track('role_selected', { role }),

  helpViewed: (tab) =>
    track('help_viewed', { tab }),

  dashboardViewed: (role) =>
    track('dashboard_viewed', { role }),
}

/**
 * Track school/classroom events
 */
export const schoolEvents = {
  classroomSelected: () =>
    track('classroom_selected'),

  childTagged: (count) =>
    track('children_tagged', { count }),
}
