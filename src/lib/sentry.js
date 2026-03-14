/**
 * Sentry Error Tracking
 *
 * Captures and reports errors to Sentry for monitoring.
 *
 * To enable:
 * 1. Create a Sentry account at https://sentry.io
 * 2. Create a new React project
 * 3. Add VITE_SENTRY_DSN to your .env file
 */

import * as Sentry from '@sentry/react'

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
const IS_PRODUCTION = import.meta.env.PROD

/**
 * Initialize Sentry error tracking
 */
export function initSentry() {
  if (!SENTRY_DSN) {
    if (import.meta.env.DEV) {
      console.log('[Sentry] Not configured - add VITE_SENTRY_DSN to enable')
    }
    return
  }

  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: IS_PRODUCTION ? 'production' : 'development',
      // Only enable in production by default
      enabled: IS_PRODUCTION,
      // Sample rate for performance monitoring (10% in production)
      tracesSampleRate: IS_PRODUCTION ? 0.1 : 1.0,
      // Sample rate for session replay (disabled for privacy)
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
      // Filter out common noise
      ignoreErrors: [
        // Network errors
        'Network Error',
        'NetworkError',
        'Failed to fetch',
        'Load failed',
        // User cancel
        'AbortError',
        // Browser extensions
        /^chrome-extension:\/\//,
        /^moz-extension:\/\//,
      ],
      // Don't send PII
      beforeSend(event) {
        // Strip any email addresses from error messages
        if (event.message) {
          event.message = event.message.replace(
            /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
            '[email]'
          )
        }
        return event
      },
    })
    console.log('[Sentry] Initialized')
  } catch (error) {
    console.error('[Sentry] Failed to initialize:', error)
  }
}

/**
 * Capture an exception manually
 */
export function captureException(error, context = {}) {
  if (!SENTRY_DSN) return

  Sentry.captureException(error, {
    extra: context,
  })
}

/**
 * Capture a message
 */
export function captureMessage(message, level = 'info') {
  if (!SENTRY_DSN) return

  Sentry.captureMessage(message, level)
}

/**
 * Set user context (call after sign-in)
 * Only sets role, not PII
 */
export function setUser(userId, role) {
  if (!SENTRY_DSN) return

  Sentry.setUser({
    id: userId,
    // Don't set email for privacy
    role,
  })
}

/**
 * Clear user context (call on sign-out)
 */
export function clearUser() {
  if (!SENTRY_DSN) return

  Sentry.setUser(null)
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message, category = 'app', data = {}) {
  if (!SENTRY_DSN) return

  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  })
}

// Export the ErrorBoundary component for wrapping the app
export const ErrorBoundary = Sentry.ErrorBoundary
