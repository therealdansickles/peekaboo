# App Icons and Splash Screen Guide

## Current Assets (Installed)

The app icons and splash screens have been generated and installed:

### Source Files

Located in `resources/`:
- `icon-source-1024x1024.png` - Master app icon (violet background, white eye)
- `splash-source-1024x1024.png` - Master splash screen

### iOS Assets (Installed)

- **App Icon**: `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png` (1024x1024)
- **Splash Screen**: `ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732*.png`

### Android Assets (Installed)

- **Launcher Icons**: `android/app/src/main/res/mipmap-*/ic_launcher.png` (48-192px)
- **Round Icons**: `android/app/src/main/res/mipmap-*/ic_launcher_round.png` (48-192px)
- **Adaptive Foreground**: `android/app/src/main/res/mipmap-*/ic_launcher_foreground.png` (108-432px)
- **Splash Screens**: `android/app/src/main/res/drawable*/splash.png` (480-2560px)

---

## Brand Colors

- **Primary**: Violet `#7C3AED` (brand color)
- **Secondary**: Violet `#8b5cf6` (splash screen background)
- **Accent**: Amber `#F59E0B` (parent view accent)

## Required Assets

### iOS App Icons

Generate from a single 1024x1024 source icon. Required sizes:

| Size | Usage |
|------|-------|
| 1024x1024 | App Store |
| 180x180 | iPhone (@3x) |
| 120x120 | iPhone (@2x) |
| 167x167 | iPad Pro (@2x) |
| 152x152 | iPad (@2x) |
| 76x76 | iPad (@1x) |

**Location**: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Android App Icons

Generate adaptive icons with separate foreground and background layers.

| Type | Size | Usage |
|------|------|-------|
| ic_launcher | 192x192 | Launcher icon |
| ic_launcher_round | 192x192 | Round launcher icon |
| ic_launcher_foreground | 432x432 | Adaptive foreground |
| ic_launcher_background | 432x432 | Adaptive background |

**Location**: `android/app/src/main/res/mipmap-*/`

### Splash Screen

Current configuration in `capacitor.config.json`:
```json
{
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#8b5cf6",
      "showSpinner": false
    }
  }
}
```

For a custom splash image, add:
- iOS: `ios/App/App/Assets.xcassets/Splash.imageset/`
- Android: `android/app/src/main/res/drawable/splash.png`

## Icon Design Guidelines

### Recommended Design

1. **Icon Shape**: Eye symbol (matches the Peekaboo brand)
2. **Background**: Solid violet `#7C3AED`
3. **Foreground**: White eye icon
4. **Style**: Simple, flat design with rounded corners
5. **Safe Zone**: Keep important elements within 66% center area (for adaptive icons)

### Design Tools

- **Figma**: Free, recommended for quick design
- **Canva**: Simple drag-and-drop
- **App Icon Generator**: https://appicon.co/

### Example Prompt for AI Image Generation

If using AI image generation (DALL-E, Midjourney, etc.):

```
A simple, minimalist app icon design. White eye symbol (like the Lucide "eye" icon)
centered on a solid violet (#7C3AED) background. The eye should be simple with
clean lines, no gradients. Flat design style, suitable for iOS and Android app stores.
1024x1024 pixels.
```

## Installation Steps

### iOS

1. Design your 1024x1024 icon
2. Use a tool like https://appicon.co/ to generate all sizes
3. Replace contents of `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
4. Update `Contents.json` if needed
5. Run `npx cap sync ios` and rebuild in Xcode

### Android

1. In Android Studio: File → New → Image Asset
2. Select "Launcher Icons (Adaptive and Legacy)"
3. Set foreground (eye icon) and background (violet color)
4. Generate icons
5. Or use https://icon.kitchen/ for adaptive icons

## Testing

After adding icons:

```bash
# Rebuild for iOS
npm run build && npx cap sync ios
npx cap open ios
# Build and run in simulator to verify icons

# Rebuild for Android
npm run build && npx cap sync android
npx cap open android
# Build and run in emulator to verify icons
```
