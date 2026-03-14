# TestFlight Setup Checklist

## Prerequisites

- [ ] Apple Developer Program membership ($99/year)
- [ ] Xcode installed (latest version recommended)
- [ ] App icons added (see `docs/APP_ICONS.md`)
- [ ] App builds successfully on iOS simulator

## Step 1: App Store Connect Setup

1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Platform**: iOS
   - **Name**: Peekaboo
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: com.peekaboo.app (must match `capacitor.config.json`)
   - **SKU**: PEEKABOO001 (any unique identifier)
   - **User Access**: Full Access

## Step 2: Configure Xcode Project

### Open Project

```bash
cd /Users/dansickles/peekaboo
npm run build && npx cap sync ios
npx cap open ios
```

### Signing & Capabilities

1. In Xcode, select the "App" target
2. Go to "Signing & Capabilities" tab
3. Check "Automatically manage signing"
4. Select your Apple Developer Team
5. Verify Bundle Identifier: `com.peekaboo.app`

### Version & Build Numbers

1. In "General" tab:
   - Version: `1.0.0`
   - Build: `1` (increment for each TestFlight upload)

### Required Capabilities

Verify these are enabled in "Signing & Capabilities":
- [ ] Associated Domains (for deep links if needed)

### Info.plist Privacy Descriptions

Verify in `ios/App/App/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>Peekaboo needs camera access so teachers can take photos of classroom activities.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Peekaboo needs photo library access so teachers can select photos to share.</string>
```

## Step 3: Build for App Store

### Archive the App

1. Select "Any iOS Device (arm64)" as the build target (not a simulator)
2. Product → Archive
3. Wait for build to complete

### Upload to App Store Connect

1. When archive completes, Organizer window opens
2. Select the archive → "Distribute App"
3. Select "App Store Connect" → "Upload"
4. Select options:
   - [x] Upload your app's symbols
   - [x] Manage Version and Build Number
5. Click "Upload"
6. Wait for processing (5-30 minutes)

## Step 4: TestFlight Configuration

### App Information

In App Store Connect → TestFlight:

1. Click "Test Information"
2. Fill in:
   - **Beta App Description**: "Secure photo sharing app for preschools. Teachers upload photos and tag children; parents see only their own child's photos."
   - **Feedback Email**: Your email for tester feedback
   - **Privacy Policy URL**: https://peekaboo.photos/privacy
   - **Contact Information**: Your support email/phone

### Build Processing

After upload:
1. Build appears with "Processing" status
2. Wait 10-30 minutes for Apple processing
3. Status changes to "Ready to Submit" or "Missing Compliance"

### Export Compliance

When prompted:
1. Click "Manage" next to the build
2. Answer: "Does your app use encryption?"
3. For Peekaboo: **Yes** (HTTPS)
4. "Does your app qualify for exemption?"
5. **Yes** (standard HTTPS encryption)
6. Check the declaration box

## Step 5: Add Testers

### Internal Testers (Team Members)

1. TestFlight → Internal Testing → App Store Connect Users
2. All team members with App Store Connect access can test
3. Limit: 100 internal testers
4. No review required

### External Testers (Beta)

1. TestFlight → External Testing → "+" to create group
2. Name: "Beta Testers" or "School Pilot"
3. Add testers by email
4. Limit: 10,000 external testers
5. **Requires Beta App Review** (first build only)

### Tester Groups Suggestion

| Group | Who | Purpose |
|-------|-----|---------|
| Internal | Dev team | Quick iteration |
| Teachers Beta | School teachers | Real-world testing |
| Parents Beta | Test parents | User experience |

## Step 6: Submit for Beta Review

For external testers (first build):

1. Select the build
2. Click "Submit for Review"
3. Fill in:
   - What to test: "Sign in with your email, view photos, upload photos (teachers), favorite photos (parents)"
   - Contact info for reviewer
4. Wait 24-48 hours for review

## Step 7: Distribute Build

After approval:

1. Go to TestFlight → External Testing → Your group
2. Click "+" next to Builds
3. Select the approved build
4. Testers receive email with TestFlight link

## Tester Instructions

Send to testers:

```
To test Peekaboo:

1. Install TestFlight from the App Store (if not already installed)
2. Open the TestFlight invitation email on your iPhone
3. Tap "View in TestFlight"
4. Tap "Accept" then "Install"
5. Open Peekaboo and sign in with your email
6. A magic link will be sent - tap it to complete sign in

Test these features:
- Teachers: Upload a photo and tag children
- Parents: View your child's photos, favorite them
- Both: Sign out and back in

Report issues: Reply to this email or tap "Send Feedback" in TestFlight
```

## Build Checklist (Per Release)

Before each TestFlight upload:

- [ ] Increment build number in Xcode
- [ ] Test on simulator
- [ ] Test on physical device (if available)
- [ ] Run `npm run build && npx cap sync ios`
- [ ] Archive and upload from Xcode
- [ ] Update "What to Test" notes
- [ ] Notify testers of new build

## Commands Reference

```bash
# Prepare for build
cd /Users/dansickles/peekaboo
npm run build
npx cap sync ios

# Open Xcode
npx cap open ios

# In Xcode:
# 1. Select "Any iOS Device (arm64)"
# 2. Product → Archive
# 3. Organizer → Distribute App → App Store Connect → Upload
```

## Troubleshooting

### "No accounts with App Store Connect access"

1. Xcode → Preferences → Accounts
2. Add your Apple ID
3. Download certificates

### "Provisioning profile doesn't include signing certificate"

1. Xcode → Preferences → Accounts
2. Select your team → "Download Manual Profiles"
3. Or: enable "Automatically manage signing"

### Build fails with code signing error

```bash
# Reset provisioning
cd ios/App
rm -rf ~/Library/MobileDevice/Provisioning\ Profiles/*
# Re-open Xcode, let it auto-sign
```

### "App uses non-public API"

Check that all plugins are App Store compatible. Remove any debug-only plugins.

### Upload stuck at "Authenticating"

1. Check Apple Developer System Status
2. Try Transporter app (App Store) as alternative upload method

## Feedback Collection Process

### In-App Feedback (TestFlight)

TestFlight automatically adds a feedback mechanism:
1. Testers shake their device or take a screenshot
2. TestFlight prompts to send feedback
3. Feedback goes to App Store Connect → TestFlight → Feedback

### Monitoring Feedback

1. Go to App Store Connect → TestFlight → Feedback
2. Review:
   - Screenshots from testers
   - Device info (iOS version, device model)
   - Crash logs (automatic)
   - Written feedback

### Crash Reports

1. App Store Connect → TestFlight → Crashes
2. Review crash reports with stack traces
3. Xcode Organizer also shows crash logs (Xcode → Window → Organizer → Crashes)

### Best Practices for Feedback

1. **Weekly triage**: Review all feedback weekly
2. **Prioritize crashes**: Fix crash bugs before feature bugs
3. **Respond to testers**: Email them when issues are fixed
4. **Update "What to Test"**: Guide testers to specific features each build
5. **Create issues**: Convert actionable feedback into dev tasks

### Sample Feedback Request Email

```
Hi [Tester Name],

Thanks for testing Peekaboo! We'd love your feedback on:

1. Was sign-in easy to complete?
2. Could you view/upload photos as expected?
3. Did anything crash or behave unexpectedly?
4. What would make the app better for your school?

Reply to this email or use TestFlight's built-in feedback (shake your phone while in the app).

Thanks!
The Peekaboo Team
```

## Version Strategy

| Build | When | Version | Build # |
|-------|------|---------|---------|
| First TestFlight | Initial | 1.0.0 | 1 |
| Bug fixes | As needed | 1.0.0 | 2, 3, 4... |
| Feature update | Major change | 1.1.0 | 1 |
| App Store release | Go live | 1.0.0 | (last tested) |

## Resources

- [App Store Connect Help](https://developer.apple.com/app-store-connect/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
