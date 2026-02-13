# Expo Go vs Development Build - Guide

## Understanding the Modes

### 🏃 Expo Go (Current Mode)
- **What**: Sandbox environment included in Expo Go app
- **Pros**: Quick testing, no build required, instant refresh
- **Cons**: Limited native modules, no custom native code
- **Firebase**: ❌ Not supported (requires native modules)
- **Authentication**: ❌ Stub mode (guest access only)
- **Push Notifications**: ❌ Stub mode
- **Best For**: UI development, testing mock data, rapid prototyping

### 🛠️ Development Build (Production-Ready)
- **What**: Custom build of your app with all native modules
- **Pros**: Full Firebase support, all native features, custom native code
- **Cons**: Requires building (10-20 mins), need EAS account
- **Firebase**: ✅ Full support
- **Authentication**: ✅ Email/password, Google, Facebook, etc.
- **Push Notifications**: ✅ Real FCM notifications
- **Best For**: Testing real features, pre-production testing, final QA

---

## Current Status: Stub Mode

Your app is currently running in **stub mode** because:
- React Native Firebase requires native modules
- Expo Go doesn't include these native modules
- We've created fallback implementations for development

### What Works in Stub Mode:
✅ All UI screens (Dashboard, Weather, Map, Resources, Missions, Checklist, Report)  
✅ Mock data (alerts, weather, resources, missions)  
✅ Navigation between screens  
✅ Language switching (EN/TL)  
✅ Local storage (AsyncStorage)  
✅ Guest access to all features  

### What Requires Development Build:
❌ Firebase Authentication (email/password sign up/sign in)  
❌ Firestore database (storing user profiles, reports)  
❌ Firebase Storage (uploading images)  
❌ Push notifications (FCM)  
❌ Google Maps API  
❌ Real weather/PSI APIs  

---

## Stub Mode Implementation

### FirebaseService (Stub Mode)
```typescript
// Detects if native modules are available
isNativeModuleAvailable = false; // In Expo Go

// Initialize returns success but doesn't connect to Firebase
await firebaseService.initialize(); // ✅ Success (stub)

// Operations throw helpful errors
firebaseService.getAuth(); // ❌ "Firebase Auth requires development build"
```

### AuthService (Stub Mode)
```typescript
// All auth operations return helpful messages
authService.signUp(...); 
// Returns: { success: false, error: 'Authentication requires a development build' }

authService.signIn(...);
// Returns: { success: false, error: 'Use guest mode in Expo Go' }

authService.isAuthenticated(); 
// Returns: false (always)
```

### Console Messages
You'll see these helpful messages:
```
📱 Firebase: Stub mode (Expo Go) - Use development build for Firebase features
🔥 AuthService: Running in stub mode (guest access only)
🔥 Auth: Guest mode active (Expo Go) - Build with EAS for full authentication
```

---

## When to Use Each Mode

### Phase 1: Feature Development (Current) ✅ Expo Go
- Building UI screens
- Implementing navigation
- Testing with mock data
- Iterating on design
- Quick feedback loop

### Phase 2: Backend Integration → Development Build Required
- Testing Firebase authentication
- Storing real user data
- Uploading images to Firebase Storage
- Testing push notifications
- Integrating real APIs

### Phase 3: Pre-Production → Development Build Required
- End-to-end testing
- Performance testing
- Security testing
- Beta testing with users

### Phase 4: Production → Production Build
- App Store submission
- Google Play submission
- Real user testing
- Analytics and monitoring

---

## Building Your First Development Build

When you're ready to test Firebase features, follow these steps:

### Option A: EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
cd BabalaSaSakuna
eas build:configure

# Build for Android (development)
eas build --profile development --platform android

# Build for iOS (development) - requires Apple Developer account
eas build --profile development --platform ios

# Install on device (once build completes)
# Download .apk (Android) or install via Expo Go (iOS)
```

### Option B: Local Build (Advanced)
```bash
# Prebuild native directories
npx expo prebuild

# Run on Android
npx expo run:android

# Run on iOS (macOS only)
npx expo run:ios
```

---

## Configuration Checklist for Development Build

Before building, ensure you have:

### Firebase Setup
- [ ] Created Firebase project
- [ ] Enabled Authentication (Email/Password)
- [ ] Created Firestore database
- [ ] Configured Firebase Storage
- [ ] Set up Cloud Messaging (FCM)
- [ ] Downloaded `google-services.json` (Android)
- [ ] Downloaded `GoogleService-Info.plist` (iOS)

### Environment Variables
- [ ] Created `.env` file from `.env.example`
- [ ] Added Firebase credentials
- [ ] Added API keys (OpenWeather, Air Quality, Google Maps)

### Native Configuration
- [ ] Updated `app.json` with proper bundle identifiers
- [ ] Configured splash screen and icon
- [ ] Set up permissions (location, camera, notifications)

### Testing
- [ ] Test sign up flow
- [ ] Test sign in flow
- [ ] Test password reset
- [ ] Test Firestore writes
- [ ] Test image uploads
- [ ] Test push notifications

---

## Cost Comparison

### Expo Go (Free)
- $0 - Completely free
- No build minutes used
- No storage used
- Perfect for prototyping

### Development Builds (Free Tier)
- Expo EAS Free tier: 30 builds/month
- Each build: ~10-20 minutes
- ~500MB storage per build
- **Cost**: $0/month (within free tier)

### Production Builds (Paid)
- Expo EAS Production builds
- CI/CD integration
- Automatic updates (OTA)
- **Cost**: ~$29-99/month (depends on plan)

---

## Troubleshooting Stub Mode

### Error: "Native module RNFBAppModule not found"
**Solution**: This is expected in Expo Go. The app will run in stub mode.

### Error: "Firebase not initialized"
**Solution**: The app auto-initializes Firebase in stub mode. Restart metro bundler:
```bash
# Stop current server (Ctrl+C)
# Clear cache and restart
npx expo start --clear
```

### Warning: "Route missing default export"
**Solution**: This is a transient error during hot reload. Restart the app:
```bash
# In Expo Go, shake device → Reload
# Or press 'r' in terminal
```

### Authentication not working
**Solution**: This is expected in stub mode. Options:
1. Continue with guest access for now
2. Build development build to test authentication

### Can't test push notifications
**Solution**: Push notifications require native modules. Options:
1. Use stub notification service for now (logs only)
2. Build development build to test real FCM

---

## Feature Support Matrix

| Feature | Expo Go | Dev Build | Production |
|---------|---------|-----------|------------|
| UI/UX Development | ✅ | ✅ | ✅ |
| Navigation | ✅ | ✅ | ✅ |
| Mock Data | ✅ | ✅ | ❌ |
| Local Storage | ✅ | ✅ | ✅ |
| Firebase Auth | ❌ | ✅ | ✅ |
| Firestore | ❌ | ✅ | ✅ |
| Firebase Storage | ❌ | ✅ | ✅ |
| Push Notifications | ❌ | ✅ | ✅ |
| Google Maps | ❌ | ✅ | ✅ |
| Real APIs | ❌️ | ✅ | ✅ |
| Camera | ⚠️ Limited | ✅ | ✅ |
| Location | ⚠️ Limited | ✅ | ✅ |
| Geofencing | ❌ | ✅ | ✅ |
| Background Tasks | ❌ | ✅ | ✅ |
| OTA Updates | ❌ | ✅ | ✅ |

---

## Recommended Workflow

### Week 1-2: Expo Go (Current Phase) ✅
- ✅ Build all screens
- ✅ Implement navigation
- ✅ Use mock data
- ✅ Test user flows
- ✅ Iterate on design

### Week 3: Development Build Setup
- [ ] Set up Firebase project
- [ ] Configure .env file
- [ ] Create first development build
- [ ] Test on real device

### Week 4: Backend Integration
- [ ] Test Firebase authentication
- [ ] Integrate real APIs
- [ ] Test push notifications
- [ ] Test image uploads

### Week 5-6: QA & Polish
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Beta testing

### Week 7: Production Build
- [ ] Create production build
- [ ] Submit to app stores
- [ ] Monitor analytics
- [ ] Collect user feedback

---

## Next Steps

**Current Status**: ✅ Phase 1 Complete - Authentication system implemented (stub mode)

**Choose your path**:

### Path A: Continue in Expo Go
- ✅ Continue with UI development
- ✅ Add more features with mock data
- ✅ Test user experience
- ⏸️ Skip Firebase features for now

### Path B: Move to Development Build
1. Follow [FIREBASE-SETUP-GUIDE.md](FIREBASE-SETUP-GUIDE.md)
2. Create Firebase project (~10 minutes)
3. Build development build (~20 minutes)
4. Test authentication on real device

### Path C: Hybrid Approach (Recommended)
1. Continue building features in Expo Go
2. Set up Firebase project in parallel
3. Build development build when ready to test
4. Switch between modes as needed

---

## Questions?

- **"Can I test the app in Expo Go?"** → Yes! Everything works except Firebase features
- **"Do I need to build now?"** → No, only when you want to test Firebase/real APIs
- **"Will my code work in both modes?"** → Yes! The stub pattern handles both cases
- **"How do I know what mode I'm in?"** → Check console: "📱 Firebase: Stub mode" = Expo Go
- **"Can I switch between modes?"** → Yes! Code works in both Expo Go and development builds

---

**Bottom Line**: Your app is fully functional in Expo Go for development and testing. Build a development build when you're ready to test real Firebase features and APIs.
