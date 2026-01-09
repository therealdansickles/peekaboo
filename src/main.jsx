import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SplashScreen } from '@capacitor/splash-screen'

// Hide splash screen when app is ready
SplashScreen.hide().catch(() => {
  // Ignore errors on web (splash screen is native only)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
