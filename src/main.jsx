import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SplashScreen } from '@capacitor/splash-screen'
import { initAnalytics } from './lib/analytics'
import { initSentry, ErrorBoundary } from './lib/sentry'

// Initialize error tracking first
initSentry()

// Initialize analytics
initAnalytics()

// Hide splash screen when app is ready
SplashScreen.hide().catch(() => {
  // Ignore errors on web (splash screen is native only)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary fallback={<div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <div className="text-4xl mb-4">😕</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-4">We've been notified and are working on it.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-violet-500 text-white rounded-lg"
        >
          Reload App
        </button>
      </div>
    </div>}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
