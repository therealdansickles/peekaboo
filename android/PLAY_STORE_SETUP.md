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

1. Go to Policy → App content → Content rating
2. Complete the IARC questionnaire
3. Typical answers for Peekaboo:
   - No violence
   - No sexual content
   - No profanity
   - No user-generated content (photos are teacher-generated)
   - Handles user data (photos, email)

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

### Internal Testing (Recommended First)

1. Create internal test track
2. Add tester emails
3. Upload .aab file
4. Testers receive link to install

### Closed Testing (Beta)

1. Create closed testing track
2. Define tester group (e.g., school staff)
3. Upload .aab file
4. Collect feedback before public launch

### Production

Only release to production after thorough testing!

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
