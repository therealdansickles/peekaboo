# Peekaboo - Project Status & Handoff Document

**Last Updated**: January 9, 2026
**Status**: Mobile app running in iOS Simulator, ready for App Store preparation

---

## What is Peekaboo?

A secure preschool photo sharing app where:
- **Teachers** upload photos, tag children, and share with families
- **Parents** only see photos where their child is tagged (RLS enforced)
- **Security**: EXIF stripping, signed URLs (15-min expiration), magic link auth

---

## Current State

### What's Working
- [x] Web app live at **https://peekaboo.photos** (and peekaboo-virid.vercel.app)
- [x] Teacher photo upload with EXIF stripping and compression
- [x] Child tagging system
- [x] Parent view with RLS-protected photo access
- [x] Magic link authentication (passwordless)
- [x] Real-time photo updates via Supabase subscriptions
- [x] iOS app builds and runs in simulator (showing black screen - needs debugging)
- [x] Android project configured (not yet tested)

### What Needs Work
- [ ] Debug iOS app black screen issue
- [ ] Add `https://peekaboo.photos` to Supabase redirect URLs
- [ ] Add `peekaboo://auth-callback` to Supabase redirect URLs (for mobile deep links)
- [ ] Create app icons and splash screens
- [ ] Test on physical iOS device
- [ ] Submit to App Store (TestFlight first)
- [ ] Submit to Google Play Store
- [ ] Create user documentation

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

## Supabase Configuration Needed

Go to: https://supabase.com/dashboard/project/weuhristvbhcehfwymsz/auth/url-configuration

**Site URL**: `https://peekaboo.photos`

**Redirect URLs** (add all of these):
- `https://peekaboo.photos`
- `https://peekaboo-virid.vercel.app`
- `http://localhost:3000`
- `http://localhost:5173`
- `peekaboo://auth-callback` (for mobile app deep links)

---

## iOS App - Current Issue

The app builds and runs but shows a **black screen**. Possible causes:
1. Web assets not loading properly
2. Splash screen not dismissing
3. WKWebView configuration issue

**To debug**:
1. Open Xcode: `npx cap open ios`
2. Run on simulator
3. Open Safari → Develop → Simulator → inspect the web view
4. Check console for JavaScript errors

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

1. **Fix iOS black screen** - Debug why app isn't rendering
2. **Add Supabase redirect URLs** - Add `peekaboo://auth-callback` for mobile auth
3. **Test full mobile flow** - Sign in, view photos, test camera
4. **Create app assets** - Icons, splash screen, screenshots
5. **TestFlight submission** - Get iOS app to testers
6. **Documentation** - In-app help + Notion guides

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

## Contact Context

Building this for Dan's daughter's preschool. Goal is production app ASAP for real school use. ~95% of users will be on mobile devices.
