# Babala sa Sakuna
## CM3070 Final Project - Philippine Disaster Warning Mobile Application

**Institution**: University of London  
**Course**: BSc Computer Science  
**Module**: CM3070 Final Project  
**Student**: [Your Name]  
**Student ID**: [Your ID]

---

## Project Overview

**Babala sa Sakuna** (Tagalog: "Warning of Disaster") is a cross-platform mobile application designed to provide Filipino citizens with real-time disaster alerts, weather and air quality monitoring, emergency preparedness tools, community hazard reporting, and gamified educational content. The app addresses the "last mile" problem in Philippine disaster warning dissemination by delivering personalised, location-aware information directly to mobile devices.

### Key Features
- **Real-time Disaster Alerts** with severity-based filtering (Critical, High, Medium, Advisory)
- **Weather and Air Quality Monitoring** via OpenWeatherMap and WAQI APIs
- **Resource Hub** with nearby shelters, hospitals, and emergency services (GPS distance)
- **Hazard Map** showing active disaster zones with severity indicators
- **Emergency Checklist** covering Before, During, and After disaster phases (offline-capable)
- **Community Reporting** for local hazard observations
- **Missions and Badges** gamified disaster preparedness quizzes
- **Full Bilingual Support** in English and Tagalog (all screens, alerts, and content)
- **Firebase Authentication** with guest mode for Expo Go compatibility
- **Offline Support** for checklist, reports, and language preferences

---

## Technical Stack

| Technology | Purpose |
|---|---|
| React Native + Expo SDK 54 | Cross-platform mobile framework |
| TypeScript (strict mode) | Type-safe development |
| Expo Router v6 | File-based navigation with 7 tabs |
| AsyncStorage | Offline data persistence |
| i18n-js | Bilingual English/Tagalog support |
| OpenWeatherMap API | Real-time weather data |
| WAQI API | Air quality index (PSI) monitoring |
| Google Maps Platform | Distance calculations and directions |
| Firebase Authentication | User sign-in (stub mode for Expo Go) |
| expo-notifications | Push notifications (development build) |
| react-native-maps | Native map display (development build) |

---

## Repository Structure

```
FP-Babala-sa-Sakuna/
├── BabalaSaSakuna/              # Main Expo application
│   ├── app/                     # Expo Router screens
│   │   ├── (tabs)/             # Tab navigation (7 screens)
│   │   │   ├── index.tsx       # Dashboard
│   │   │   ├── weather.tsx     # Weather and Air Quality
│   │   │   ├── map.tsx         # Hazard Map
│   │   │   ├── resources.tsx   # Resource Hub
│   │   │   ├── checklist.tsx   # Emergency Checklist
│   │   │   ├── missions.tsx    # Missions and Badges
│   │   │   └── report.tsx      # Community Reporting
│   │   ├── alert/[id].tsx      # Alert Detail (dynamic route)
│   │   └── auth/               # Authentication screens
│   │       ├── login.tsx
│   │       ├── signup.tsx
│   │       └── reset-password.tsx
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── services/           # Business logic and API layer
│   │   ├── contexts/           # React context (AuthContext)
│   │   ├── config/             # Firebase configuration
│   │   ├── data/               # Alert and checklist data
│   │   └── types/              # TypeScript type definitions
│   ├── assets/                 # Images and icons
│   ├── app.json                # Expo configuration
│   ├── package.json            # Dependencies
│   └── tsconfig.json           # TypeScript configuration
├── FINAL-REPORT.md             # CM3070 Final Project Report
├── TESTING-GUIDE.md            # Testing documentation
├── IMPROVEMENTS.md             # Enhancement documentation
└── README.md                   # This file
```

---

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Expo Go app on your mobile device (iOS or Android)
- Optional: Android Studio or Xcode for development builds

### Installation and Running

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShahbazSherwani/FP-Babala-sa-Sakuna.git
   cd FP-Babala-sa-Sakuna/BabalaSaSakuna
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `a` for Android emulator, `i` for iOS simulator

### Expo Go Limitations
Some features require a development build and are gracefully degraded in Expo Go:
- **Push Notifications**: Stub mode prevents crashes; info banner shown to user
- **Native Maps**: Fallback list view of hazard zones displayed instead
- **Firebase Auth**: Operates in guest/stub mode automatically

All other features work fully in Expo Go.

---

## Implemented Features

### Dashboard
- 8 disaster alerts sorted by severity (Critical first)
- Filter chips for hazard categories (Typhoon, Flood, Earthquake, Volcano)
- Severity-coded alert cards with descriptions and affected regions
- Pull-to-refresh functionality
- Login access via profile icon beside the app title
- Language toggle (EN/TL) in header

### Alert Details
- Full alert description, affected regions, and timeline
- Recommended safety actions with numbered steps
- Quick navigation links to Hazard Map and Checklist
- All content translates to Tagalog when TL is selected

### Weather and Air Quality
- Real-time weather from OpenWeatherMap API
- Air Quality Index (PSI) from WAQI API with colour-coded gauge
- Disaster alert checking for the user's location
- City-based WAQI lookup bounded to Philippine coordinates

### Resource Hub
- Emergency services: shelters, evacuation centres, hospitals, fire stations, police
- GPS-based distance calculation to each resource
- One-tap Call and Directions buttons
- Filter by resource type

### Hazard Map
- List view of active hazard zones with severity badges (Expo Go)
- Native Google Map with markers and radius circles (development build)
- Severity-coded legend

### Emergency Checklist
- 39 preparedness items across 3 phases (Before, During, After)
- Progress bar with completion tracking
- Offline persistence via AsyncStorage
- Tab-based phase navigation

### Missions and Badges
- Educational quizzes on disaster preparedness topics
- Point-based scoring with level progression
- Badge unlocking system
- Minimum score threshold to pass missions

### Community Reporting
- 6 report categories: Flooding, Road Blocked, Structural Damage, Landslide, Power Outage, Other
- Location and description input with validation
- Reports saved locally for offline use
- Success confirmation with option to submit another

### Bilingual Support
- Full English and Tagalog translations across all 7 screens
- All alert content (titles, descriptions, recommended actions) translated
- Tab bar names, filter chips, buttons, error messages all localised
- Auth screens (login, signup, reset password) fully translated
- Instant language switching with persistent preference

### Authentication
- Firebase email/password authentication
- Sign up, sign in, and password reset flows
- Guest mode (default in Expo Go)
- Deferred Firebase initialisation to prevent Expo Go crashes

---

## Testing and Validation

- TypeScript compilation: 0 errors
- Android bundle export: 1559 modules
- Tested on Android API 36 emulator
- Expo Go compatibility verified
- All 7 tabs and auth flow functional

---

## Service Architecture

The app uses a singleton service pattern:

| Service | Responsibility |
|---|---|
| AlertService | Alert data with language-aware content |
| WeatherService | OpenWeatherMap API integration |
| ApiClient | HTTP requests with retry logic and 30-min TTL cache |
| LocationService | GPS coordinates bounded to Philippines |
| LocalizationService | i18n-js bilingual management (EN/TL) |
| CacheService | AsyncStorage persistence for checklist, reports |
| NotificationService | Push notifications with stub/full pattern |
| FirebaseService | Deferred Firebase initialisation |
| AuthService | Authentication with guest mode fallback |
| MissionService | Quiz scoring and badge management |
| ResourceService | Emergency service data with distance calculations |
| AlertPollingService | Periodic alert checking with in-app notifications |

---

## Known Limitations

1. **Mock Alert Data**: Uses 8 static disaster alerts (real-time PAGASA integration planned)
2. **Expo Go Restrictions**: Push notifications and native maps require development build
3. **Single Platform Testing**: Primarily tested on Android emulator
4. **Firebase Stub Mode**: Authentication and Firestore operate in stub mode in Expo Go

---

## Future Work

- Real-time integration with PAGASA and PHIVOLCS APIs
- Backend infrastructure with Firebase Cloud Functions
- Community report verification system
- SMS fallback for areas with limited internet
- Additional Philippine languages (Cebuano, Ilocano)
- Geofencing for automatic location-based alerts
- iOS comprehensive testing
- Admin dashboard for alert management

---

## Dependencies

```json
{
  "expo": "~54.0.0",
  "expo-router": "~6.0.23",
  "react-native": "0.79.0",
  "react-native-maps": "1.20.1",
  "expo-location": "~19.0.8",
  "expo-notifications": "~0.29.12",
  "i18n-js": "^4.4.3",
  "@react-native-async-storage/async-storage": "2.2.0",
  "firebase": "^11.9.0"
}
```

Full dependency list in [BabalaSaSakuna/package.json](BabalaSaSakuna/package.json)

---

## Acknowledgments

- University of London - CM3070 Final Project guidance
- Expo Team - Development framework and documentation
- Philippine Agencies - Hazard data research (PAGASA, PHIVOLCS)
- React Native Community - Open-source components and libraries

---

## License

This project is an academic submission for educational purposes.

Academic Use Only - Not for commercial distribution.

---

**Repository**: https://github.com/ShahbazSherwani/FP-Babala-sa-Sakuna