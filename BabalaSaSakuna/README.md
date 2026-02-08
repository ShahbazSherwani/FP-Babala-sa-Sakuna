# Babala sa Sakuna
**Philippine Disaster Warning Mobile Application**

A React Native mobile app providing disaster alerts, emergency preparedness checklists, hazard mapping, and community reporting for the Philippines.

## 🚀 Quick Start

### Running in Expo Go (Recommended for Development)
```bash
npm install
npx expo start
```

Scan the QR code with Expo Go app on your device.

**Note**: Some features have limitations in Expo Go:
- ⚠️ Push notifications (requires development build)
- ⚠️ Native map view (shows fallback list view)

### Running with Full Features (Development Build)
For full push notification and native map support:

```bash
# Android
npx expo run:android

# iOS  
npx expo run:ios
```

**To enable push notifications in development build:**
```bash
# Swap the notification service implementations
cd src/services
mv NotificationService.ts NotificationService.stub.ts
mv NotificationService.full.ts NotificationService.ts
```

Then rebuild the development build.

## 📱 Features

### ✅ Fully Working in Expo Go
- **Dashboard**: Real-time disaster alerts with filtering
- **Alert Details**: Complete alert information with recommendations
- **Checklist**: Emergency preparedness tasks (Before/During/After)
- **Community Reports**: Submit local hazard observations
- **Multilingual**: Switch between English and Tagalog
- **Severity Guide**: Onboarding modal explaining alert levels
- **Offline Support**: Checklist and reports work without internet

### ⚠️ Limited in Expo Go
- **Push Notifications**: Requires development build (SDK 53+ restriction)
- **Hazard Map**: Shows list view instead of native map

## 🌍 Localization

Toggle between English and Tagalog using the language switcher in the Dashboard header.

Supported languages:
- 🇺🇸 English (EN)
- 🇵🇭 Tagalog (TL)

## 🏗️ Project Structure

```
BabalaSaSakuna/
├── app/
│   ├── _layout.tsx              # Root layout with service initialization
│   ├── (tabs)/
│   │   ├── index.tsx            # Dashboard (main screen)
│   │   ├── map.tsx              # Hazard map (with Expo Go fallback)
│   │   ├── checklist.tsx        # Emergency checklist
│   │   └── report.tsx           # Community reporting
│   └── alert/
│       └── [id].tsx             # Alert details (dynamic route)
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── AlertCard.tsx
│   │   ├── SeverityGuideModal.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── ...
│   ├── services/                # Business logic layer
│   │   ├── AlertService.ts
│   │   ├── LocalizationService.ts
│   │   ├── NotificationService.ts (lazy-loaded)
│   │   └── CacheService.ts
│   ├── data/                    # Mock data
│   │   ├── alerts.ts
│   │   └── checklist.ts
│   └── types/                   # TypeScript definitions
└── assets/                      # Images and static assets
```

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Install Dependencies
```bash
npm install
```

### Type Checking
```bash
npx tsc --noEmit
```

### Build for Production
```bash
# Android APK
npx expo build:android

# iOS IPA
npx expo build:ios

# Or use EAS Build (recommended)
eas build --platform android
```

## 🧪 Testing

### Expo Go Testing
- ✅ All UI/UX features
- ✅ Navigation and routing
- ✅ Localization switching
- ✅ Offline data persistence
- ⚠️ Limited: No push notifications or native maps

### Development Build Testing  
- ✅ All features including push notifications
- ✅ Native map integration
- ✅ Full performance testing

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| expo | ~54.0.0 | Application framework |
| expo-router | ~6.0.23 | File-based routing |
| react-native-maps | 1.20.1 | Map visualization |
| expo-notifications | ~0.29.12 | Push notifications (dev build only) |
| i18n-js | ^4.4.3 | Internationalization |
| @react-native-async-storage/async-storage | 2.2.0 | Offline storage |

## 🐛 Known Limitations

### Expo Go Environment
1. **Push Notifications**: Not supported in Expo Go since SDK 53. Use development build.
2. **Native Maps**: `react-native-maps` requires linking. App shows fallback list view.

### Workarounds Implemented
- **Lazy Loading**: NotificationService uses dynamic imports to prevent crashes
- **Fallback UI**: Map screen shows hazard zone list when native module unavailable
- **Info Banners**: User is informed when features are limited

## 🔐 Permissions

The app requests the following permissions:
- **Location** (optional): For showing nearby hazards on map
- **Notifications** (optional): For critical disaster alerts

All permissions have fallback behaviors if denied.

## 🚨 Emergency Features

### Alert Severity Levels
- 🔴 **Critical**: Life-threatening, immediate evacuation required
- 🟠 **High**: Serious threat, prepare to evacuate
- 🟡 **Medium**: Moderate threat, monitor closely
- 🔵 **Low/Advisory**: Stay informed, review plans

### Hazard Categories
- 🌀 **Typhoon** (Bagyo)
- 💧 **Flood** (Baha)
- 🌍 **Earthquake** (Lindol)
- 🌋 **Volcano** (Bulkan)

## 📄 License

This is an academic project developed for CM3070 Final Project.

## 👥 Contributors

- Developer: [Your Name]
- Institution: University of London
- Course: CM3070 - Final Project

## 📚 Documentation

See [IMPROVEMENTS.md](../../IMPROVEMENTS.md) for details on recent enhancements:
- Severity guide modal with onboarding
- Push notification system (development build)
- English/Tagalog multilingual support
