/**
 * In-App Review Hook
 *
 * Prompts users to rate the app at positive experience moments.
 * Uses native App Store / Play Store review dialogs.
 *
 * Best practices:
 * - Only prompt after a positive action (viewing photos)
 * - Limit prompts (max once per 30 days)
 * - Don't prompt on first use
 */

import { useCallback, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { InAppReview } from '@capacitor-community/in-app-review'
import { track } from '../lib/analytics'

// Storage key for tracking review prompts
const REVIEW_STORAGE_KEY = 'peekaboo_review_state'

// Minimum photo views before prompting
const MIN_PHOTO_VIEWS = 3

// Minimum days between review prompts
const MIN_DAYS_BETWEEN_PROMPTS = 30

/**
 * Get review state from localStorage
 */
function getReviewState() {
  try {
    const stored = localStorage.getItem(REVIEW_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  return {
    photoViewCount: 0,
    lastPromptDate: null,
    hasRated: false,
  }
}

/**
 * Save review state to localStorage
 */
function saveReviewState(state) {
  try {
    localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage errors
  }
}

/**
 * Hook for managing in-app review prompts
 */
export function useAppReview() {
  const promptingRef = useRef(false)

  /**
   * Track a photo view and potentially show review prompt
   */
  const trackPhotoView = useCallback(async () => {
    // Only works on native platforms
    if (!Capacitor.isNativePlatform()) {
      return
    }

    const state = getReviewState()

    // Don't prompt if already rated
    if (state.hasRated) {
      return
    }

    // Increment photo view count
    state.photoViewCount++
    saveReviewState(state)

    // Check if we should prompt
    if (state.photoViewCount < MIN_PHOTO_VIEWS) {
      return
    }

    // Check if enough time has passed since last prompt
    if (state.lastPromptDate) {
      const lastPrompt = new Date(state.lastPromptDate)
      const daysSincePrompt = (Date.now() - lastPrompt.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSincePrompt < MIN_DAYS_BETWEEN_PROMPTS) {
        return
      }
    }

    // Prevent duplicate prompts
    if (promptingRef.current) {
      return
    }
    promptingRef.current = true

    try {
      // Track the prompt attempt
      track('review_prompt_shown', {
        photo_view_count: state.photoViewCount,
        days_since_last_prompt: state.lastPromptDate
          ? Math.floor((Date.now() - new Date(state.lastPromptDate).getTime()) / (1000 * 60 * 60 * 24))
          : null,
      })

      // Show the native review dialog
      await InAppReview.requestReview()

      // Update state
      state.lastPromptDate = new Date().toISOString()
      saveReviewState(state)

      track('review_prompt_completed')
    } catch (error) {
      console.error('[AppReview] Failed to show review prompt:', error)
      track('review_prompt_failed', { error: error.message })
    } finally {
      promptingRef.current = false
    }
  }, [])

  /**
   * Mark the user as having rated (call if they rate in-app)
   */
  const markAsRated = useCallback(() => {
    const state = getReviewState()
    state.hasRated = true
    saveReviewState(state)
    track('review_marked_rated')
  }, [])

  /**
   * Reset review state (for testing)
   */
  const resetReviewState = useCallback(() => {
    localStorage.removeItem(REVIEW_STORAGE_KEY)
  }, [])

  return {
    trackPhotoView,
    markAsRated,
    resetReviewState,
  }
}
