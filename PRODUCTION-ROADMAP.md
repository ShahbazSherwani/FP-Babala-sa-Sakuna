# Production Roadmap - Babala sa Sakuna

## Current Status: Academic Prototype ✅
**Target: Production-Ready Mobile App**

---

## Phase 1: Core Infrastructure (4-6 weeks)

### 1.1 Backend Setup (Week 1-2)
**Objective:** Establish server infrastructure

- [ ] **Firebase Project Setup**
  - Create Firebase project
  - Enable Firestore Database
  - Enable Firebase Authentication
  - Enable Cloud Storage (for images)
  - Enable Cloud Functions
  - Configure security rules

- [ ] **Database Schema Design**
  - Users collection (profile, preferences, history)
  - Alerts collection (real-time disaster alerts)
  - Reports collection (user-submitted reports)
  - Resources collection (shelters, hospitals)
  - Missions/Progress collection
  - Weather/PSI cache collection

- [ ] **Environment Configuration**
  - Create `.env` files for API keys
  - Set up Firebase config for dev/staging/prod
  - Implement secure key storage (react-native-dotenv)

**Files to Create:**
- `firebase.config.ts`
- `firebaseService.ts`
- `.env.example`
- `app.config.js` (updated with env variables)

---

### 1.2 API Integration (Week 2-3)
**Objective:** Connect to real data sources

- [ ] **PAGASA Weather API**
  - Research PAGASA API documentation
  - Alternative: OpenWeatherMap API (if PAGASA unavailable)
  - Implement WeatherService with real API calls
  - Add error handling and fallbacks
  - Cache responses (30 min TTL)

- [ ] **Air Quality API**
  - DENR Air Quality API (Philippines)
  - Alternative: IQAir API, AirVisual API
  - Update PSI calculation logic
  - Implement PSI threshold alerts

- [ ] **Google Maps Platform**
  - Enable Maps SDK for Android/iOS
  - Enable Places API
  - Enable Directions API
  - Enable Geocoding API
  - Replace map fallback with real MapView
  - Add user location marker

- [ ] **NDRRMC/PHIVOLCS Integration**
  - Earthquake data API
  - Typhoon tracking API
  - Flood monitoring API
  - Alert notifications API

**Files to Update:**
- `src/services/WeatherService.ts` - Add real API calls
- `src/services/AlertService.ts` - Connect to NDRRMC
- `app/(tabs)/map.tsx` - Replace fallback with real map

**New Dependencies:**
```bash
npm install @react-native-firebase/app
npm install @react-native-firebase/firestore
npm install @react-native-firebase/auth
npm install @react-native-firebase/storage
npm install @react-native-firebase/messaging
npm install axios
npm install react-native-dotenv
```

---

### 1.3 User Authentication (Week 3-4)
**Objective:** Secure user accounts

- [ ] **Firebase Authentication Setup**
  - Email/password sign-up
  - Google Sign-In
  - Facebook Login (optional)
  - Phone number verification
  - Password reset flow

- [ ] **User Profile Management**
  - Create user profile screen
  - Store user preferences (language, location)
  - Profile picture upload
  - Emergency contact info
  - Notification preferences

- [ ] **Authentication Screens**
  - Login screen
  - Sign-up screen
  - Password reset screen
  - Onboarding flow for new users
  - Profile settings screen

**Files to Create:**
- `src/services/AuthService.ts`
- `src/contexts/AuthContext.tsx`
- `app/auth/login.tsx`
- `app/auth/signup.tsx`
- `app/auth/profile.tsx`

**Navigation Update:**
- Add auth check in `_layout.tsx`
- Protect authenticated routes
- Redirect to login if not authenticated

---

### 1.4 Real Push Notifications (Week 4-5)
**Objective:** Implement production notification system

- [ ] **Firebase Cloud Messaging (FCM)**
  - Configure FCM for Android
  - Configure APNs for iOS
  - Request notification permissions
  - Handle foreground notifications
  - Handle background notifications
  - Handle notification tap actions

- [ ] **Notification Categories**
  - Critical alerts (earthquakes, typhoons)
  - Warning alerts (floods, landslides)
  - Weather updates (PSI, temperature)
  - Mission/badge achievements
  - Community report updates

- [ ] **Cloud Functions for Notifications**
  - Trigger on new alert
  - Trigger on PSI threshold breach
  - Trigger on severe weather
  - Schedule periodic weather updates
  - Geofence-based notifications

**Files to Update:**
- `src/services/NotificationService.ts` - Replace stub with FCM
- Remove `NotificationService.full.ts` (merge into main)

**Cloud Functions to Create:**
```javascript
// functions/src/index.ts
exports.sendAlertNotification = functions.firestore
  .document('alerts/{alertId}')
  .onCreate(async (snap, context) => {
    // Send FCM to all users in affected area
  });
```

---

### 1.5 Location Services (Week 5-6)
**Objective:** Enable GPS and location-based features

- [ ] **Location Permissions**
  - Request location permission on app start
  - Explain why location is needed
  - Handle permission denied gracefully
  - Background location (for ongoing alerts)

- [ ] **Location Tracking**
  - Get current location
  - Update user location in Firestore
  - Calculate distance to resources
  - Filter alerts by proximity
  - Geofencing for area-specific alerts

- [ ] **Map Integration**
  - Show user location on map
  - Show nearby resources
  - Show active alert zones
  - Directions to resources
  - Custom markers for different resource types

**Files to Update:**
- `app/(tabs)/map.tsx` - Add user location marker
- `src/services/ResourceService.ts` - Calculate real distances
- `src/services/AlertService.ts` - Filter by user location

**New Dependencies:**
```bash
npm install expo-location
npm install react-native-maps
npm install expo-task-manager (for background location)
```

---

### Phase 1 Deliverables:

✅ **Backend:**
- Firebase project configured
- Firestore database with collections
- Cloud Functions deployed

✅ **APIs:**
- Real weather data (PAGASA/OpenWeatherMap)
- Real air quality data (DENR/IQAir)
- Google Maps integrated
- NDRRMC alerts connected

✅ **Authentication:**
- User sign-up/login working
- Profile management
- Session persistence

✅ **Notifications:**
- FCM configured for Android/iOS
- Push notifications for alerts
- Notification preferences

✅ **Location:**
- GPS location working
- Distance calculations accurate
- Map shows user location

---

## Phase 2: Features & Polish (3-4 weeks)

### 2.1 Enhanced Report System (Week 7-8)
- [ ] **Image Upload**
  - Camera integration (expo-camera)
  - Gallery picker (expo-image-picker)
  - Image compression before upload
  - Upload to Firebase Storage
  - Thumbnail generation

- [ ] **Report Moderation**
  - Admin review queue
  - Report flagging system
  - Spam detection
  - Inappropriate content filter

- [ ] **Report Maps**
  - Show reports on map
  - Cluster nearby reports
  - Filter by report type
  - Upvote/downvote system

### 2.2 Real-Time Alert System (Week 8-9)
- [ ] **WebSocket/Firestore Realtime**
  - Listen to alert changes
  - Auto-update alert list
  - Sound/vibration on new alert
  - Alert detail updates live

- [ ] **Alert Channels**
  - Official government alerts
  - Community reports
  - Weather warnings
  - Earthquake early warning

- [ ] **Alert History**
  - View past alerts
  - Alert statistics
  - Personal alert log

### 2.3 Admin Dashboard (Week 9)
- [ ] **Web Admin Panel**
  - Create React web app
  - Firebase Admin SDK
  - Manage alerts
  - Moderate reports
  - View analytics
  - Manage resources
  - Push manual notifications

### 2.4 Performance Optimization (Week 10)
- [ ] **Code Optimization**
  - React.memo for components
  - useMemo/useCallback hooks
  - Lazy loading screens
  - Image optimization
  - Bundle size reduction

- [ ] **Caching Strategy**
  - Aggressive caching for static data
  - Refresh strategies
  - Offline-first approach
  - AsyncStorage optimization

---

## Phase 3: Testing & Security (2-3 weeks)

### 3.1 Automated Testing (Week 11)
- [ ] **Unit Tests**
  - Jest configuration
  - Service layer tests
  - Utility function tests
  - 80%+ code coverage

- [ ] **Integration Tests**
  - API integration tests
  - Firebase integration tests
  - Authentication flow tests

- [ ] **E2E Tests**
  - Detox setup
  - Critical user flows
  - Alert flow
  - Report flow
  - Mission completion flow

### 3.2 Security Audit (Week 12)
- [ ] **Code Security**
  - No hardcoded secrets
  - API key rotation strategy
  - Input validation
  - SQL injection prevention (Firestore rules)
  - XSS prevention

- [ ] **Firebase Security Rules**
  - Strict read/write rules
  - User data isolation
  - Rate limiting
  - Admin-only collections

- [ ] **App Security**
  - SSL pinning (optional)
  - Jailbreak/root detection
  - Secure storage for sensitive data
  - Code obfuscation

### 3.3 Compliance (Week 12-13)
- [ ] **Legal Documents**
  - Privacy Policy
  - Terms of Service
  - Data Protection Notice
  - Cookie Policy (web admin)

- [ ] **Data Protection**
  - GDPR compliance (if applicable)
  - Data retention policy
  - User data export
  - Account deletion

- [ ] **Accessibility**
  - Screen reader support
  - Color contrast compliance
  - Font scaling
  - VoiceOver/TalkBack testing

---

## Phase 4: Deployment (2-3 weeks)

### 4.1 Beta Testing (Week 13-14)
- [ ] **TestFlight (iOS)**
  - Apple Developer account
  - Build with EAS Build
  - Upload to TestFlight
  - Recruit 50-100 beta testers

- [ ] **Google Play Internal Testing**
  - Google Play Console
  - Build AAB with EAS Build
  - Upload to Internal Testing track
  - Invite testers

- [ ] **Feedback Collection**
  - In-app feedback form
  - Bug reporting
  - Feature requests
  - Analytics tracking

### 4.2 App Store Submission (Week 14-15)
- [ ] **iOS App Store**
  - App Store Connect setup
  - Screenshots (6.5", 5.5")
  - App icon (1024x1024)
  - App description (English/Tagalog)
  - Keywords/categories
  - Privacy questions
  - Submit for review

- [ ] **Google Play Store**
  - Play Console setup
  - Feature graphic
  - Screenshots (phone/tablet)
  - App description
  - Content rating
  - Target audience
  - Submit for review

### 4.3 DevOps & Monitoring (Week 15-16)
- [ ] **CI/CD Pipeline**
  - GitHub Actions setup
  - Automated builds (EAS Build)
  - Automated tests
  - Version bumping

- [ ] **Error Tracking**
  - Sentry setup
  - Error logging
  - Performance monitoring
  - Crash reporting

- [ ] **Analytics**
  - Firebase Analytics
  - Google Analytics
  - User behavior tracking
  - Conversion funnels

- [ ] **App Updates**
  - OTA updates (Expo Updates)
  - Version management
  - Release notes
  - Rollback strategy

---

## Infrastructure Costs (Monthly Estimates)

### Development/Staging:
- Firebase Spark (Free): $0
- OpenWeatherMap Free Tier: $0
- Google Maps (limited usage): ~$50-100
- **Total: ~$50-100/month**

### Production (1,000-10,000 users):
- Firebase Blaze Plan: $25-200
- Weather API: $50-150
- Air Quality API: $50-100
- Google Maps: $200-500
- Cloud Storage: $20-50
- Push Notifications: Included in Firebase
- Sentry: $26-80
- **Total: ~$371-1,080/month**

### Production (100,000+ users):
- Scaled infrastructure: $2,000-5,000/month

---

## Development Team (Optional)

**Minimum Team:**
- 1 Full-stack Developer (you)
- 1 UI/UX Designer (part-time)
- 1 QA Tester (part-time)

**Optimal Team:**
- 1 React Native Developer
- 1 Backend Developer (Firebase/Node.js)
- 1 UI/UX Designer
- 1 QA Engineer
- 1 DevOps Engineer (part-time)
- 1 Project Manager

---

## Success Metrics

### Phase 1 Goals:
- [ ] 100% real data (no mock data)
- [ ] User authentication working
- [ ] Push notifications delivered
- [ ] Location services functional
- [ ] 0 critical bugs

### Phase 2 Goals:
- [ ] <2 second load time
- [ ] 99.9% uptime
- [ ] Real-time updates <1 second
- [ ] Image uploads working
- [ ] Admin panel functional

### Phase 3 Goals:
- [ ] 80%+ test coverage
- [ ] Security audit passed
- [ ] Legal documents approved
- [ ] Accessibility score >90

### Phase 4 Goals:
- [ ] App Store approval
- [ ] Play Store approval
- [ ] 500+ beta testers
- [ ] <1% crash rate
- [ ] 4+ star rating

---

## Timeline Summary

| Phase | Duration | Weeks | End Date |
|-------|----------|-------|----------|
| Phase 1: Infrastructure | 4-6 weeks | 1-6 | Week 6 |
| Phase 2: Features | 3-4 weeks | 7-10 | Week 10 |
| Phase 3: Testing | 2-3 weeks | 11-13 | Week 13 |
| Phase 4: Deployment | 2-3 weeks | 13-16 | Week 16 |
| **Total** | **11-16 weeks** | **~4 months** | **End of Month 4** |

---

## Risk Assessment

### High Risk:
- ❗ API availability (PAGASA might not have public API)
- ❗ App Store rejection (both stores are strict)
- ❗ Budget constraints (APIs can be expensive)

### Medium Risk:
- ⚠️ User adoption (marketing needed)
- ⚠️ Performance at scale (optimization required)
- ⚠️ Data accuracy (depends on API quality)

### Low Risk:
- ✓ Technical feasibility (proven tech stack)
- ✓ Development time (realistic estimates)
- ✓ Team capability (you've built the prototype)

---

## Next Steps (RIGHT NOW):

**Starting Phase 1.1: Backend Setup**

1. Create Firebase project
2. Install Firebase dependencies
3. Configure Firebase in app
4. Set up environment variables
5. Create basic data structure

Ready to proceed?
