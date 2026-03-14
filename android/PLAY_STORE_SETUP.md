# Google Play Store Setup Guide

## Prerequisites

- [ ] Google Play Developer account ($25 one-time fee)
- [ ] App icons (see `docs/APP_ICONS.md`)
- [ ] Privacy policy URL (required by Google)
- [ ] Screenshots (at least 2 per form factor)

## Step 1: Create Developer Account

1. Go to https://play.google.com/console
2. Sign in with your Google account
3. Pay $25 registration fee
4. Complete account details (takes 48 hours for verification)

## Step 2: Prepare App for Release

### Play App Signing (Recommended)

Google Play App Signing provides secure key management where Google manages your app signing key:

1. In Play Console, go to **Release** → **Setup** → **App signing**
2. Choose "Let Google manage and protect your app signing key"
3. Export your upload key for signing builds locally
4. Google re-signs your app with the app signing key for distribution

**Benefits:**
- Key recovery if you lose your upload key
- Smaller app sizes with APK optimization
- Required for Android App Bundles (.aab)

### Build Configuration

Edit `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        applicationId "com.peekaboo.app"
        versionCode 1
        versionName "1.0.0"
    }
}
```

### Create Signing Key

```bash
cd /Users/dansickles/peekaboo/android

# Generate release keystore (keep this file safe!)
keytool -genkey -v -keystore peekaboo-release.keystore \
  -alias peekaboo \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**IMPORTANT**: Store the keystore file and passwords securely. You need these for all future updates.

### Configure Signing in Gradle

Create `android/keystore.properties` (DO NOT commit to git):

```properties
storeFile=peekaboo-release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=peekaboo
keyPassword=YOUR_KEY_PASSWORD
```

Add to `android/app/build.gradle`:

```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
keystoreProperties.load(new FileInputStream(keystorePropertiesFile))

android {
    signingConfigs {
        release {
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Build Release APK/AAB

```bash
cd /Users/dansickles/peekaboo

# Build the web app
npm run build

# Sync to Android
npx cap sync android

# Open Android Studio
npx cap open android
```

In Android Studio:
1. Build → Generate Signed Bundle / APK
2. Select "Android App Bundle" (recommended)
3. Choose your keystore
4. Build release variant
5. Find the `.aab` file in `android/app/release/`

## Step 3: Create App in Play Console

1. Go to Play Console → All apps → Create app
2. Fill in:
   - App name: **Peekaboo**
   - Default language: English (United States)
   - App type: App
   - Category: Parenting (or Education)
   - Free or Paid: Free

## Step 4: Store Listing

### App Details

**Short description** (80 chars max):
```
Secure preschool photo sharing for teachers and parents
```

**Full description** (4000 chars max):
```
Peekaboo is a secure photo sharing app designed for preschools and childcare centers.

FOR TEACHERS:
- Easily share classroom photos with families
- Tag children so parents only see their own child
- EXIF data automatically stripped for privacy
- Simple, intuitive interface

FOR PARENTS:
- See only photos where your child appears
- Secure magic link sign-in (no passwords)
- Photo URLs expire after 15 minutes
- Real-time updates when new photos are shared

SECURITY FIRST:
- Row Level Security (RLS) ensures data privacy
- Each parent only sees their own children
- Encrypted connections
- No photo data stored on device

Perfect for preschools, daycares, and childcare centers that want to share precious moments with families while maintaining strict privacy controls.
```

### Screenshots Required

| Screen Type | Minimum | Recommended Size |
|-------------|---------|------------------|
| Phone | 2 | 1080x1920 (portrait) |
| 7-inch tablet | 0 | 1200x1920 |
| 10-inch tablet | 0 | 1600x2560 |

**Suggested screenshots:**
1. Landing page (role selection)
2. Teacher dashboard with photos
3. Parent view with child's photos
4. Photo upload/tagging screen
5. Magic link authentication

### Feature Graphic

- Size: 1024x500
- Design: Show app logo with tagline "Secure Photo Sharing for Schools"

### App Icon

- 512x512 PNG (high resolution)
- Same design as the app icon

## Step 5: Content Rating

1. Go to **Policy** → **App content** → **Content rating**
2. Click "Start questionnaire"
3. Select category: **Utility, Productivity, Communication, or Other**

### IARC Questionnaire Answers for Peekaboo

| Question | Answer | Reason |
|----------|--------|--------|
| Does the app contain violence? | No | Photo sharing only |
| Sexual content or nudity? | No | Family-friendly content |
| References to drugs/alcohol/tobacco? | No | N/A |
| Profanity or crude humor? | No | N/A |
| Gambling or simulated gambling? | No | N/A |
| User-generated content? | No* | Photos are teacher-uploaded, not open UGC |
| User interaction features? | Yes | Teachers share with authorized parents |
| Shares user location? | No | No location tracking |
| Allows purchases? | No | Free app |

*Note: Although photos are uploaded by teachers, this is controlled content within a closed system, not open user-generated content.

**Expected Rating:** Rated for ages 3+ (PEGI 3 / ESRB Everyone)

## Step 6: Privacy Policy

**Required**: A valid privacy policy URL

Host at: `https://peekaboo.photos/privacy` (need to create this page)

Privacy policy must cover:
- What data is collected (email, photos)
- How data is used
- How data is shared
- How data is stored
- User rights (GDPR, CCPA)
- Contact information

## Step 7: Data Safety Form

Fill out in Play Console → Policy → App content → Data safety:

| Data Type | Collected | Shared | Purpose |
|-----------|-----------|--------|---------|
| Email | Yes | No | Authentication |
| Photos | Yes | Yes (with authorized parents only) | Core functionality |
| Name | Yes | No | User profiles |

## Step 8: Testing Tracks

### Release Track Progression

```
Internal Testing → Closed Testing → Open Testing (optional) → Production
```

### 1. Internal Testing (Start Here)

- **Max testers:** 100 per track
- **Review time:** None (instant distribution)
- **Best for:** Core team, developers, QA

**Setup:**
1. Go to **Release** → **Testing** → **Internal testing**
2. Click "Create track" or use existing
3. Add tester emails (must be Google accounts)
4. Upload .aab file
5. Testers receive opt-in link via email

### 2. Closed Testing (Beta)

- **Max testers:** Unlimited (via email lists or Google Groups)
- **Review time:** Usually 1-3 days for first review
- **Best for:** School staff, early adopter parents

**Setup:**
1. Go to **Release** → **Testing** → **Closed testing**
2. Create testers list (email addresses)
3. Upload .aab file and submit for review
4. Share opt-in URL with testers after approval

### 3. Open Testing (Optional)

- **Max testers:** Unlimited public access
- **Review time:** Full review process
- **Best for:** Large-scale beta before production

### 4. Production

- **Full review required** (may take several days)
- **Visible on Google Play Store**
- Only release after thorough testing in earlier tracks!

## Step 9: Release Checklist

Before going live:

- [ ] App builds and runs without crashes
- [ ] All screenshots are accurate
- [ ] Privacy policy is published and accessible
- [ ] Data safety form is complete
- [ ] Content rating questionnaire is submitted
- [ ] Target audience and content is set
- [ ] App signed with release keystore
- [ ] Version code incremented from any previous version

## Commands Reference

```bash
# Full build and deploy workflow
cd /Users/dansickles/peekaboo
npm run build
npx cap sync android
npx cap open android

# In Android Studio:
# Build → Generate Signed Bundle / APK → Android App Bundle
# Upload the .aab file to Play Console
```

## Common Rejection Reasons & How to Avoid Them

### 1. Privacy Policy Issues

**Rejection:** "Your app's privacy policy is missing or inaccessible"

**Prevention:**
- Ensure `https://peekaboo.photos/privacy` is live and accessible
- Privacy policy must be hosted on a secure (HTTPS) URL
- Must cover all data types mentioned in Data Safety form
- Include contact information for privacy inquiries

### 2. Data Safety Form Inconsistencies

**Rejection:** "Your Data safety section doesn't match your app's behavior"

**Prevention:**
- Declare ALL data collected (email, photos, names)
- If using any analytics (even Supabase telemetry), declare it
- Review third-party SDKs for hidden data collection

### 3. Target Audience & Content Issues

**Rejection:** "App targets children but doesn't comply with Families Policy"

**Prevention:**
- Peekaboo is for **parents and teachers**, not children directly
- Set target audience to **18+ or general audience** (not under 13)
- Do NOT include ads or in-app purchases in child-directed content
- Clearly state the app is for adult caregivers in store listing

### 4. Broken Functionality

**Rejection:** "App crashes or has broken features"

**Prevention:**
- Test on multiple Android versions (API 24+)
- Test with slow/no network connectivity
- Ensure Supabase connection handles errors gracefully
- Test the full flow: login → view photos → logout

### 5. Insufficient App Content

**Rejection:** "App doesn't provide sufficient value or functionality"

**Prevention:**
- Ensure demo mode or onboarding shows app purpose
- If auth is required, provide test credentials or screenshots
- Include meaningful store listing description

### 6. Login/Authentication Issues

**Rejection:** "Unable to test core app functionality"

**Prevention:**
- Provide test account credentials in app review notes:
  ```
  Test credentials for review:
  - Go to app
  - Select "Teacher" role
  - Enter email: test-reviewer@peekaboo.photos
  - Check inbox for magic link (or provide direct test URL)
  ```
- Or implement a demo/guest mode for reviewers

### 7. Permissions Without Justification

**Rejection:** "App requests permissions without clear user benefit"

**Prevention:**
- Only request CAMERA permission when user taps "Take Photo"
- Only request storage/photos permission when user uploads
- Include runtime permission rationale strings in app

### 8. Metadata Policy Violations

**Rejection:** "Screenshots or description don't accurately represent app"

**Prevention:**
- Use actual app screenshots (not mockups)
- Don't use keywords like "best", "#1", or "free" excessively
- Don't mention other apps or brands in description

## Troubleshooting

### "App not installed" on device

- Check that device allows installation from unknown sources (for testing)
- Ensure app is signed correctly

### Build fails

```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleRelease
```

### Capacitor sync issues

```bash
npx cap sync android --force
```

## Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android App Bundle](https://developer.android.com/guide/app-bundle)
- [Play Console Policy Center](https://play.google.com/console/policy-center)
