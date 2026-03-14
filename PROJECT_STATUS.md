# Peekaboo - Project Status & Handoff Document

**Last Updated**: March 14, 2026 (Evening)
**Status**: 95% Ready for App Store Launch - See CEO Briefing

---

## Quick Links

- **CEO Briefing**: [docs/CEO_BRIEFING.md](docs/CEO_BRIEFING.md) - Strategic overview & launch plan
- **Live Web App**: https://peekaboo.photos
- **GitHub**: https://github.com/therealdansickles/peekaboo

---

## What is Peekaboo?

A secure preschool photo sharing app where:
- **Teachers** upload photos, tag children, and share with families
- **Parents** only see photos where their child is tagged (RLS enforced)
- **Security**: EXIF stripping, signed URLs (15-min expiration), magic link auth

---

## Current State

### What's Ready
- [x] Web app live at **https://peekaboo.photos**
- [x] Teacher photo upload with EXIF stripping and compression
- [x] Child tagging system
- [x] Parent view with RLS-protected photo access
- [x] Magic link authentication (passwordless)
- [x] Real-time photo updates via Supabase subscriptions
- [x] iOS app builds in Xcode
- [x] Android project configured
- [x] Code pushed to GitHub
- [x] **App icons and splash screens** (violet eye brand)
- [x] **App Store listing copy** (docs/STORE_LISTING.md)
- [x] **Go-to-market strategy** (docs/LAUNCH_MARKETING.md)
- [x] **Competitive research & pricing** (docs/GROWTH_RESEARCH.md)
- [x] **Onboarding emails** (docs/ONBOARDING_EMAILS.md)
- [x] **User guides** (docs/TEACHER_GUIDE.md, docs/PARENT_GUIDE.md)
- [x] **Privacy Policy** (docs/PRIVACY_POLICY.md)
- [x] **Terms of Service** (docs/TERMS_OF_SERVICE.md)
- [x] **Founder blog post** (docs/BLOG_WHY_WE_BUILT_PEEKABOO.md)
- [x] **Press Release** (docs/PRESS_RELEASE.md)
- [x] **FAQ** (docs/FAQ.md)
- [x] **In-App Help Content** (docs/IN_APP_HELP.md)
- [x] **Social Media Profiles** (docs/SOCIAL_MEDIA_PROFILES.md)
- [x] **Referral Program** (docs/REFERRAL_PROGRAM.md)
- [x] **Review Solicitation Strategy** (docs/REVIEW_SOLICITATION.md)
- [x] **Analytics Guide** (docs/ANALYTICS_GUIDE.md)
- [x] **90-Day Content Calendar** (docs/CONTENT_CALENDAR.md)
- [x] **In-app review prompt** (useAppReview hook)
- [x] **Analytics integration** (PostHog, privacy-first)
- [x] **Error tracking** (Sentry, production-only)
- [x] **ESLint clean** (0 errors, 1 acceptable warning)

### BLOCKERS - Must Fix Before Launch
- [ ] **Configure Supabase redirect URLs** (15 min) - See instructions below
- [ ] **Test iOS app in simulator** (30 min) - See instructions below

### Before Public Launch
- [ ] Submit to TestFlight (1-2 days Apple review)
- [x] Add in-app review prompt (✅ useAppReview hook - triggers after 3 photo views)
- [x] Add analytics (✅ PostHog - privacy-first, no PII)
- [x] Add error tracking (✅ Sentry - production-only, PII filtered)

### Post-Launch Improvements
- [ ] Push notifications for new photos
- [ ] Batch photo download
- [ ] Admin dashboard for schools
- [ ] Stripe payment integration

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite 7 |
| Styling | Tailwind CSS 4 |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Mobile | Capacitor 8 (iOS + Android) |
| Hosting | Vercel |
| Domain | peekaboo.photos (via Vercel) |

---

## Key Files & Structure

```
/Users/dansickles/peekaboo/
├── src/
│   ├── App.jsx                    # Main app with routing and deep link handling
│   ├── components/
│   │   ├── AuthScreen.jsx         # Magic link sign-in
│   │   ├── LandingPage.jsx        # Role selection (Teacher/Parent)
│   │   ├── TeacherDashboard.jsx   # Teacher view
│   │   ├── TeacherPhotoUpload.jsx # Photo upload with child tagging
│   │   ├── ParentDashboard.jsx    # Parent view (filtered by child)
│   │   └── PhotoCard.jsx          # Individual photo display
│   ├── hooks/
│   │   ├── useAuth.jsx            # Auth context and state
│   │   ├── usePhotos.js           # Photo fetching with real-time
│   │   ├── useClassrooms.js       # Classroom data
│   │   └── useChildren.js         # Children data
│   └── lib/
│       ├── supabase.js            # Supabase client init
│       ├── auth.js                # Auth functions (with mobile deep link support)
│       ├── storage.js             # Photo upload/compression
│       └── camera.js              # Native camera integration (Capacitor)
├── ios/                           # iOS Xcode project
│   └── App/
│       ├── App.xcodeproj          # Open this in Xcode
│       └── App/Info.plist         # Contains camera permissions & URL scheme
├── android/                       # Android project
│   └── app/src/main/
│       └── AndroidManifest.xml    # Contains deep link config
├── capacitor.config.json          # Capacitor configuration
├── .env                           # Supabase credentials (not in git)
└── PROJECT_STATUS.md              # This file
```

---

## Accounts & Credentials

### Supabase
- **Project URL**: https://weuhristvbhcehfwymsz.supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/weuhristvbhcehfwymsz
- **Anon Key**: In `.env` file (VITE_SUPABASE_ANON_KEY)

### Vercel
- **Project**: therealdansickles-projects/peekaboo
- **Production URL**: https://peekaboo.photos
- **Dashboard**: https://vercel.com/therealdansickles-projects/peekaboo

### Apple Developer
- Already enrolled (for App Store submission)

### Google Play
- Need to set up ($25 one-time fee)

---

## Test Accounts

| Role | Email | Notes |
|------|-------|-------|
| Teacher/Admin | dan@dansickles.com | Has classroom access |
| Parent | dlsickles@gmail.com | Linked to Emma |

---

## Key Commands

```bash
# Development
npm run dev                    # Start local dev server (port 5173)
npm run build                  # Build for production

# Capacitor
npx cap sync                   # Sync web build to native projects
npx cap open ios               # Open Xcode
npx cap open android           # Open Android Studio

# Deploy
vercel --prod                  # Deploy to Vercel

# After code changes for mobile:
npm run build && npx cap sync  # Rebuild and sync to native
```

---

## STEP 1: Configure Supabase Redirect URLs

**This must be done before mobile auth will work.**

1. Open the Supabase Auth URL Configuration page:
   https://supabase.com/dashboard/project/weuhristvbhcehfwymsz/auth/url-configuration

2. Set **Site URL** to:
   ```
   https://peekaboo.photos
   ```

3. In the **Redirect URLs** section, click "Add URL" and add each of these:
   ```
   https://peekaboo.photos
   https://peekaboo-virid.vercel.app
   http://localhost:5173
   http://localhost:3000
   peekaboo://auth-callback
   ```

   **Important**: The `peekaboo://auth-callback` URL is required for magic link auth to work on mobile devices.

4. Click **Save** at the bottom of the page.

---

## STEP 2: Test iOS App in Simulator

The black screen issue was caused by the Capacitor splash screen not dismissing automatically. This has been fixed by adding `SplashScreen.hide()` in `/src/main.jsx`.

**To test the fix:**

1. Open Terminal and run:
   ```bash
   cd /Users/dansickles/peekaboo
   npm run build && npx cap sync ios
   npx cap open ios
   ```

2. In Xcode:
   - Select an iPhone simulator from the device dropdown (e.g., "iPhone 15")
   - Press `Cmd+R` to build and run

3. **Expected result**: You should see the Peekaboo landing page with "I'm a Teacher" and "I'm a Parent" buttons (instead of a black screen).

4. **If you still see a black screen**, debug with Safari:
   - Open Safari on your Mac
   - Go to Safari menu → Settings → Advanced → Enable "Show Develop menu in menu bar"
   - With the simulator running, go to Develop → Simulator → select the web view
   - Check the Console tab for JavaScript errors

---

## iOS App - Black Screen Fix Applied

**What was the issue?**
Capacitor's splash screen plugin was configured but never dismissed, leaving a permanent overlay.

**The fix (already applied):**
Added `SplashScreen.hide()` call in `/src/main.jsx`:
```javascript
import { SplashScreen } from '@capacitor/splash-screen'

// Hide splash screen when app is ready
SplashScreen.hide().catch(() => {
  // Ignore errors on web (splash screen is native only)
})
```

---

## Database Schema (Key Tables)

- `profiles` - User profiles with roles (teacher, parent, admin)
- `schools` - School information
- `classrooms` - Classrooms belonging to schools
- `children` - Children in classrooms
- `photos` - Uploaded photos with storage paths
- `photo_children` - Junction table linking photos to tagged children
- `parent_children` - Links parents to their children
- `photo_favorites` - Parent favorites

**RLS Policy**: Parents can only see photos where their child is in `photo_children`

---

## Next Session Priorities

1. **Configure Supabase redirect URLs** - Follow STEP 1 above (required for mobile auth) ⚠️ BLOCKING
2. **Test iOS app in simulator** - Follow STEP 2 above (black screen fix already applied) ⚠️ BLOCKING
3. **TestFlight submission** - Get iOS app to beta testers
4. **Create App Store screenshots** - Requires running app
5. **Optional: 30-second app preview video**

**Note**: In-app help content, analytics, error tracking, and comprehensive documentation are all complete. See `docs/` for all assets.

---

## Mobile App Features Implemented

- **Camera plugin** - Native camera access for teachers (`@capacitor/camera`)
- **Deep links** - `peekaboo://auth-callback` scheme for magic link auth
- **Status bar** - Configured for violet theme
- **Splash screen** - Configured with violet background
- **Keyboard handling** - Proper resize behavior

---

## Files Modified for Mobile

1. `/src/lib/auth.js` - Added Capacitor platform detection for redirect URLs
2. `/src/lib/camera.js` - NEW: Native camera integration
3. `/src/App.jsx` - Added deep link listener for mobile auth
4. `/capacitor.config.json` - App configuration
5. `/ios/App/App/Info.plist` - Camera permissions, URL scheme
6. `/android/app/src/main/AndroidManifest.xml` - Deep link intent filter

---

## Useful Links

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)

---

## Quick Resume Commands

When starting a new session, run these to get back up to speed:

```bash
# Navigate to project
cd /Users/dansickles/peekaboo

# Pull latest changes
git pull origin main

# Install dependencies (if needed)
npm install

# Build and sync to iOS
npm run build && npx cap sync ios

# Open Xcode
npx cap open ios
```

Then in Xcode, press `Cmd+R` to run on simulator.

---

## Contact Context

Building this for Dan's daughter's preschool. Goal is production app ASAP for real school use. ~95% of users will be on mobile devices.
