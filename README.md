# Babala sa Sakuna
## CM3070 Final Project - Philippine Disaster Warning Mobile Application

**Institution**: University of London  
**Course**: BSc Computer Science  
**Module**: CM3070 Final Project  
**Submission Date**: February 2026

---

## Project Overview

**Babala sa Sakuna** (Tagalog: "Warning of Disaster") is a mobile disaster warning application designed for the Philippines. The app provides real-time disaster alerts, emergency preparedness checklists, hazard mapping, and community reporting features to help Filipinos prepare for and respond to natural disasters including typhoons, floods, earthquakes, and volcanic activity.

### Key Features
- **Real-time Disaster Alerts** with severity-based filtering
- **Hazard Map** showing active disaster zones
- **Emergency Checklist** (Before/During/After phases)
- **Community Reporting** for local hazard observations
- **Bilingual Support** (English & Tagalog)
- **Onboarding Guide** explaining alert severity levels
- **Offline Support** for checklist and reports

---

## Technical Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript (strict mode)
- **Navigation**: Expo Router v6 (file-based routing)
- **State Management**: React hooks with AsyncStorage
- **UI Components**: Custom components with react-native-safe-area-context
- **Internationalization**: i18n-js
- **Maps**: react-native-maps (with Expo Go fallback)
- **Notifications**: expo-notifications (development build only)

---

## Repository Structure

```
FP-Babala-sa-Sakuna/
├── BabalaSaSakuna/           # Main application code
│   ├── app/                  # Expo Router screens
│   │   ├── (tabs)/          # Tab navigation screens
│   │   │   ├── index.tsx    # Dashboard
│   │   │   ├── map.tsx      # Hazard map
│   │   │   ├── checklist.tsx # Emergency checklist
│   │   │   └── report.tsx   # Community reporting
│   │   ├── alert/[id].tsx   # Alert details (dynamic route)
│   │   └── _layout.tsx      # Root layout
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── services/        # Business logic layer
│   │   ├── data/            # Mock disaster data
│   │   └── types/           # TypeScript definitions
│   ├── assets/              # Images and icons
│   ├── app.json             # Expo configuration
│   ├── package.json         # Dependencies
│   ├── tsconfig.json        # TypeScript config
│   └── README.md            # Application documentation
├── IMPROVEMENTS.md          # Detailed enhancement documentation
├── CM3070 Preliminary Project Report-Final.pdf
└── README.md                # This file
```

---

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Expo Go app on your mobile device (iOS/Android)
- *Optional*: Android Studio or Xcode for development builds

### Installation & Running

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
Some features are limited in Expo Go:
- **Push Notifications**: Requires development build (SDK 53+ restriction)
- **Native Maps**: Shows list fallback instead of MapView

All other features work fully in Expo Go.

---

## Documentation

### Application Documentation
- **[BabalaSaSakuna/README.md](BabalaSaSakuna/README.md)** - Comprehensive app documentation, API reference, project structure
- **[IMPROVEMENTS.md](IMPROVEMENTS.md)** - Detailed explanation of implemented enhancements (onboarding, notifications, i18n)

### Original Project Report
- **[CM3070 Preliminary Project Report-Final.pdf](CM3070%20Preliminary%20Project%20Report-Final.pdf)** - Complete project specification, design, and evaluation

---

## Implemented Features

### Core Features (All Working in Expo Go)
**Dashboard Screen**
- Real-time disaster alerts display
- Filter by hazard type (Typhoon, Flood, Earthquake, Volcano)
- Severity-based color coding (Critical/High/Medium/Low)
- Pull-to-refresh functionality
- Navigation to detailed alert views

**Alert Details Screen**
- Complete disaster information
- Affected regions display
- Recommended actions list
- Quick navigation to hazard map and checklist
- Formatted timestamps

**Hazard Map Screen**
- *Expo Go*: List view showing hazard zones with coordinates
- *Dev Build*: Interactive native map with markers and regions
- Severity-based color coding
- Zone radius information

**Emergency Checklist Screen**
- 39 preparedness items across 3 phases (Before/During/After)
- Progress tracking per phase
- Offline persistence with AsyncStorage
- Priority level indicators
- Tab-based phase navigation

**Community Report Screen**
- 6 report categories with icons
- Location input (optional)
- Description textarea (500 char limit)
- Form validation
- Success confirmation
- Local storage for offline reports

### Enhancement Features
**Severity Guide Modal**
- First-launch onboarding
- Clear explanation of all 4 severity levels
- Color-coded visual guide
- "Don't show again" functionality

**Multilingual Support**
- English/Tagalog language switching
- 200+ translated UI strings
- Instant language switching
- Persistent language preference
- Language switcher in Dashboard header

**Push Notifications** (Development Build Only)
- Stub implementation for Expo Go (no crashes)
- Full implementation available in `NotificationService.full.ts`
- Permission handling
- Push token registration
- Deep linking from notifications
- Info banner shows when unavailable

---

## Testing & Validation

### Build Verification
TypeScript compilation: 0 errors  
Android bundle export: 1559 modules  
Tested on Android API 36 emulator  
Expo Go compatibility verified  



## Data & Privacy

### Mock Data
The application currently uses mock data for demonstration:
- 8 sample disaster alerts covering all hazard types
- 39 emergency checklist items
- Philippine coordinates and region names

### Data Persistence
- **AsyncStorage** for offline data (checklist state, reports, preferences)
- No external API calls in current prototype
- All data stored locally on device

### Future Integration
Ready for Phase 2 backend integration with:
- PAGASA (Philippine weather service) APIs
- PHIVOLCS (Philippine seismology agency)
- Local government alert systems

---

## Academic Context

This project fulfills the requirements for CM3070 Final Project, demonstrating:

### Technical Skills
- Cross-platform mobile development
- TypeScript and type-safe programming
- Component-based architecture
- State management and data persistence
- Internationalization and localization
- Graceful degradation for platform limitations
- Service-oriented architecture

### Project Management
- Requirements analysis from PDF specification
- Iterative development with version control
- Problem-solving (Expo Go compatibility challenges)
- Documentation and code maintainability
- Testing and quality assurance

### Social Impact
- Addresses real-world problem (disaster preparedness in Philippines)
- Culturally appropriate design (bilingual, local hazard types)
- Accessibility considerations (severity guide, clear UI)
- Offline-first approach for reliability

---

## Known Limitations & Future Work

### Current Limitations
1. **Mock Data**: Uses static disaster alerts (no real-time API integration)
2. **Expo Go Restrictions**: Push notifications and native maps require development build
3. **Single Platform Testing**: Primarily tested on Android
4. **Limited Languages**: Only English and Tagalog (Cebuano, Ilocano planned)

### Planned Enhancements (Phase 2)
- Backend API integration with Philippine disaster agencies
- User authentication and profile management
- Historical disaster data visualization
- Community verification system for reports
- SMS fallback for areas with limited internet
- Additional Philippine languages
- iOS comprehensive testing
- Geofencing for location-based alerts

---

## Dependencies

### Main Dependencies
```json
{
  "expo": "~54.0.0",
  "expo-router": "~6.0.23",
  "react-native": "0.79.0",
  "react-native-maps": "1.20.1",
  "expo-location": "~19.0.8",
  "expo-notifications": "~0.29.12",
  "i18n-js": "^4.4.3",
  "@react-native-async-storage/async-storage": "2.2.0"
}
```

Full dependency list in [BabalaSaSakuna/package.json](BabalaSaSakuna/package.json)

---

## Acknowledgments

- **University of London** - CM3070 Final Project guidance
- **Expo Team** - Excellent documentation and development tools
- **Philippine Agencies** - Hazard data research (PAGASA, PHIVOLCS)
- **React Native Community** - Open-source components and libraries

---

## License

This project is an academic submission for educational purposes.

**Academic Use Only** - Not for commercial distribution.

---

**Repository**: https://github.com/ShahbazSherwani/FP-Babala-sa-Sakuna