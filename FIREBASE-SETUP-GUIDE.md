# Firebase Setup Guide for Babala sa Sakuna

## Prerequisites
- Google Account
- Node.js and npm installed
- Expo CLI configured

---

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: **babala-sa-sakuna** (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Click "Create Project"

---

## Step 2: Add Android App

1. In Firebase Console, click the Android icon ⚙️
2. Register app:
   - **Android package name**: `com.babalasasakuna.app` (or from your app.json)
   - **App nickname**: Babala sa Sakuna Android
   - **Debug signing certificate**: (optional for now)
3. Download `google-services.json`
4. Save it to: `BabalaSaSakuna/android/app/google-services.json` (when you build native)

---

## Step 3: Add iOS App (Optional)

1. Click the iOS icon 
2. Register app:
   - **iOS bundle ID**: `com.babalasasakuna.app`
   - **App nickname**: Babala sa Sakuna iOS
3. Download `GoogleService-Info.plist`
4. Save it to: `BabalaSaSakuna/ios/` (when you build native)

---

## Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable sign-in methods:
   - ✅ **Email/Password** - Click "Enable" → Save
   - ✅ **Google** (optional) - Enable if needed
   - ✅ **Facebook** (optional) - Enable if needed

---

## Step 5: Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose:
   - **Start in production mode** (we'll add rules later)
   - **Cloud Firestore location**: `asia-southeast1` (Singapore - closest to Philippines)
4. Click "Enable"

### Database Rules (Important!)

After creating the database, update Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Alerts collection - everyone can read, only admins can write
    match /alerts/{alertId} {
      allow read: if true;
      allow write: if request.auth != null && 
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Reports collection - authenticated users can create, users can read their own
    match /reports/{reportId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                            resource.data.userId == request.auth.uid;
    }
    
    // Resources collection - everyone can read, only admins can write
    match /resources/{resourceId} {
      allow read: if true;
      allow write: if request.auth != null && 
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Missions collection - everyone can read
    match /missions/{missionId} {
      allow read: if true;
      allow write: if false;
    }
    
    // User progress - users can only access their own
    match /user_progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Step 6: Enable Storage

1. Go to **Storage**
2. Click "Get Started"
3. Choose **Start in production mode**
4. Use default location or select closest region
5. Click "Done"

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User profile pictures
    match /users/{userId}/profile/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024; // Max 5MB
    }
    
    // Community report images
    match /reports/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 10 * 1024 * 1024; // Max 10MB
    }
  }
}
```

---

## Step 7: Enable Cloud Messaging

1. Go to **Cloud Messaging**
2. Click on the three dots → "Manage API in Google Cloud Console"
3. Enable **Cloud Messaging API**
4. Go back to Firebase Console
5. In Project Settings → Cloud Messaging:
   - Copy the **Server key** (you'll need this for backend)

---

## Step 8: Get Your Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Select your Android/iOS app
4. Copy the configuration object

You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "babala-sa-sakuna.firebaseapp.com",
  projectId: "babala-sa-sakuna",
  storageBucket: "babala-sa-sakuna.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:android:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
};
```

---

## Step 9: Configure Your App

1. Create `.env` file in `BabalaSaSakuna/` folder:

```env
# Copy from .env.example and fill in your values

# Firebase Configuration
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=babala-sa-sakuna.firebaseapp.com
FIREBASE_PROJECT_ID=babala-sa-sakuna
FIREBASE_STORAGE_BUCKET=babala-sa-sakuna.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:android:abcdef1234567890

# API Keys (get these from respective services)
OPENWEATHER_API_KEY=your_key_here
AIR_QUALITY_API_KEY=your_key_here
GOOGLE_MAPS_API_KEY=your_key_here

# Environment
NODE_ENV=development
```

2. Update `src/config/firebase.config.ts` with your values OR rely on environment variables

---

## Step 10: Test Firebase Connection

Run these commands to test:

```bash
cd BabalaSaSakuna
npm start
```

Then in your app:
1. Try to sign up with email/password
2. Check Firebase Console → Authentication → Users
3. Your new user should appear there!

---

## Step 11: Create Firestore Collections (Initial Data)

### Using Firebase Console:

1. Go to Firestore Database
2. Click "Start collection"
3. Create these collections:

#### Collection: `users`
- Auto-created when users sign up
- No manual creation needed

#### Collection: `alerts`
```
Document ID: auto
Fields:
  - id: string
  - title: string
  - message: string
  - severity: string (critical/warning/minor)
  - category: string (typhoon/flood/earthquake/fire)
  - location: map {
      coordinates: map {
        latitude: number
        longitude: number
      }
      address: string
    }
  - isActive: boolean
  - timestamp: timestamp
```

#### Collection: `resources`
```
Document ID: auto
Fields:
  - id: string
  - name: string
  - type: string
  - address: string
  - coordinates: map {
      latitude: number
      longitude: number
    }
  - phone: string
  - capacity: number
  - services: array
  - isOperational: boolean
```

#### Collection: `missions`
```
Document ID: auto
Copy data from src/data/missions.ts
```

---

## Step 12: Enable Indexes (As Needed)

Firestore will prompt you to create indexes when you run queries. Click the provided link to auto-create them.

Common indexes needed:
- `alerts` collection: `timestamp` (Descending) + `isActive` (Ascending)
- `reports` collection: `timestamp` (Descending) + `userId` (Ascending)

---

## Step 13: Set Up Firebase Admin (For Backend)

If you need backend/Cloud Functions:

1. Go to **Project Settings** → **Service Accounts**
2. Click "Generate new private key"
3. Download the JSON file
4. **NEVER commit this file to Git!**
5. Use it for server-side Firebase operations

---

## Troubleshooting

### Error: "Default Firebase app has not been initialized"
- Make sure `firebaseService.initialize()` is called in `AuthContext`
- Check that `.env` file exists and has correct values

### Error: "Network request failed"
- Check internet connection
- Verify Firebase project is active
- Check if you're behind a firewall/proxy

### Error: "API key not valid"
- Double-check API key in `.env`
- Make sure to restart Metro bundler after changing `.env`

### Users can't sign up
- Check Authentication is enabled
- Check email/password provider is enabled
- Look at browser console for detailed errors

---

## Production Checklist

Before deploying to production:

- [ ] Update Firestore rules (stricter security)
- [ ] Update Storage rules (validate file types)
- [ ] Enable App Check (anti-abuse)
- [ ] Set up billing alerts
- [ ] Enable Firebase Analytics
- [ ] Configure custom domain (optional)
- [ ] Set up Cloud Functions for server logic
- [ ] Enable Firebase Crashlytics
- [ ] Review security rules with Firebase team

---

## Cost Estimates

### Spark Plan (Free):
- 50K reads/day
- 20K writes/day
- 1GB storage
- 10GB/month transfer

**Good for**: Development and testing

### Blaze Plan (Pay as you go):
- First amounts same as Spark (free)
- Beyond that: $0.06 per 100K reads
- Perfect for production

**Estimated costs for 10,000 active users**: $25-100/month

---

## Next Steps

After Firebase is configured:

1. ✅ Test sign up/login flow
2. ✅ Verify users appear in Firebase Console
3. ⬜ Set up real-time listeners for alerts
4. ⬜ Integrate weather APIs
5. ⬜ Set up Cloud Functions for push notifications
6. ⬜ Deploy to production

---

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase](https://rnfirebase.io/)
- [Firebase Console](https://console.firebase.google.com/)
- [Stack Overflow - Firebase](https://stackoverflow.com/questions/tagged/firebase)

---

**Last Updated**: Phase 1, Step 1.3 - Authentication Setup
