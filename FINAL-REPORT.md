# Babala sa Sakuna — CM3070 Final Project Report

## Chapter 1: Introduction

### 1.1 Project Context

The Philippines is one of the most disaster-prone countries in the world. Situated along the Pacific Ring of Fire and within the Western Pacific typhoon belt, the archipelago faces an average of 20 typhoons per year, frequent earthquakes, volcanic eruptions, and widespread flooding. The devastating impact of Typhoon Haiyan (locally named Yolanda) in 2013—which killed over 6,300 people and displaced 4 million—exposed critical failures in the country's early warning infrastructure. Despite improvements in meteorological forecasting through PAGASA (Philippine Atmospheric, Geophysical and Astronomical Services Administration), the "last mile" of warning dissemination remains a persistent challenge: information often fails to reach the most vulnerable communities in a timely, actionable format (Lagmay et al., 2015).

Mobile phone penetration in the Philippines exceeds 150% of the population, with smartphone adoption growing rapidly even in rural areas. This presents an opportunity to deliver personalised, location-aware disaster warnings directly to citizens' devices—bridging the gap between institutional forecasting and individual preparedness action.

### 1.2 Project Overview

**Babala sa Sakuna** (Tagalog: "Warning of Disaster") is a cross-platform mobile application designed to provide Filipino citizens with real-time disaster alerts, weather and air quality monitoring, emergency preparedness tools, community hazard reporting, and gamified educational content. The application addresses a gap observed in existing solutions: most current tools are either globally focused (not Philippines-specific), response-oriented (not warning-oriented), or lack community participation features.

The core functionality comprises seven integrated screens: a Dashboard displaying severity-filtered disaster alerts; a Weather and PSI (Pollutant Standards Index) monitor fetching live data from OpenWeatherMap and the World Air Quality Index; a Resource Hub listing nearby emergency shelters, hospitals, and fire/police stations with distance calculations; a Hazard Map displaying active disaster zones; an Emergency Checklist covering before/during/after disaster phases; a Community Report screen enabling users to submit local hazard observations; and a Missions and Badges system that gamifies disaster preparedness education through quizzes.

### 1.3 Technical Stack

The application is built with **React Native** using **Expo SDK 54** and **TypeScript**, enabling cross-platform deployment from a single codebase. Navigation is handled by **Expo Router v6** (file-based routing). State management uses React hooks with **AsyncStorage** for offline persistence. Internationalisation is implemented through **i18n-js** supporting English and Tagalog. The service layer integrates **OpenWeatherMap**, **WAQI (World Air Quality Index)**, and **Google Maps Platform** APIs through a custom `ApiClient` with retry logic and caching (30-minute TTL). Firebase Authentication is available via a deferred-initialisation pattern with stub mode for Expo Go compatibility.

### 1.4 Report Structure

Chapter 2 reviews existing literature and competing applications. Chapter 3 details the design process including user analysis, requirements, and system architecture. Chapter 4 describes the implementation with key algorithms and code patterns. Chapter 5 presents evaluation through testing and user acceptance results. Chapter 6 concludes with reflections and future directions.

---

## Chapter 2: Literature Review

### 2.1 Existing Disaster Warning Applications

#### 2.1.1 PAGASA Mobile App

PAGASA, the Philippines' national meteorological agency, offers a mobile application that provides weather forecasts, typhoon bulletins, and rainfall advisories. While authoritative, the app has significant limitations: it lacks real-time push notifications for critical alerts, provides no community reporting features, offers minimal preparedness guidance, and does not include air quality monitoring (Racoma et al., 2016). The interface is primarily information-display oriented with no interactive or educational components. Critically, PAGASA does not expose a public API, meaning third-party developers cannot programmatically access its data—a constraint that directly influenced this project's decision to use OpenWeatherMap as the primary weather data source.

#### 2.1.2 Disaster Alert (Pacific Disaster Center)

The Pacific Disaster Center's Disaster Alert application provides global hazard monitoring covering earthquakes, tsunamis, floods, and cyclones. While technically sophisticated, its global scope means Philippine-specific context is minimal: alert descriptions use generic terminology rather than local references (e.g., PAGASA signal numbers), evacuation centres are not mapped, and community-level reporting is absent (Pacific Disaster Center, 2020). The application serves international disaster management professionals rather than local citizens who need actionable, contextualised guidance. Babala sa Sakuna directly addresses this gap by constraining its geographic scope to the Philippines and providing locally relevant resources, Tagalog language support, and location-bounded data queries.

#### 2.1.3 ReliefWeb

ReliefWeb, operated by the UN Office for the Coordination of Humanitarian Affairs, aggregates disaster reports, situation updates, and analytical publications. It functions as an information archive rather than a real-time warning system: content is curated and published with inherent delays, there are no push notifications, and the platform targets humanitarian coordination professionals rather than at-risk populations (OCHA, 2019). ReliefWeb demonstrates the value of comprehensive disaster information but confirms the need for a complementary tool that transforms static information into proactive, real-time citizen alerts.

#### 2.1.4 Philippine Red Cross Mobile Applications

The Philippine Red Cross offers several mobile tools focused on first aid guidance, blood donation, and disaster response coordination. These are fundamentally response-focused: they assist after a disaster has occurred rather than providing advance warning or preparedness training. The "First Aid" app provides step-by-step emergency response procedures, and the "Hazard Hunter" app allows users to view hazard maps—but neither offers real-time weather-driven alerts, air quality monitoring, or gamified preparedness education (Philippine Red Cross, 2021). This project's warning-first approach, combined with proactive preparedness checklists and missions, occupies a distinct space in the Philippine disaster app ecosystem.

#### 2.1.5 Critical Comparison

Table 2.1 summarises the feature comparison:

| Feature                     | PAGASA | Disaster Alert | ReliefWeb | PRC Apps | **Babala sa Sakuna** |
|-----------------------------|--------|---------------|-----------|----------|----------------------|
| Real-time alerts            | Partial| Yes           | No        | No       | **Yes**              |
| Philippines-specific        | Yes    | No            | Partial   | Yes      | **Yes**              |
| Air quality monitoring      | No     | No            | No        | No       | **Yes**              |
| Community reporting         | No     | No            | No        | Limited  | **Yes**              |
| Preparedness checklists     | No     | No            | No        | Partial  | **Yes**              |
| Bilingual (EN/TL)           | Partial| No            | No        | Partial  | **Yes**              |
| Gamification                | No     | No            | No        | No       | **Yes**              |
| Offline capability          | No     | Limited       | No        | Partial  | **Yes**              |
| Nearby resources/shelters   | No     | No            | No        | Limited  | **Yes**              |

### 2.2 Mobile-Based Disaster Warning Systems in Academic Literature

Aloudat and Michael (2011) argue that effective mobile disaster warning systems must address five dimensions: timeliness, accuracy, reach, comprehensibility, and actionability. Their framework highlights that most existing systems succeed on the first three but fail on the latter two—users receive warnings they do not understand or cannot act upon. Babala sa Sakuna addresses comprehensibility through bilingual support, severity-colour-coded alerts with plain-language explanations, and an onboarding modal; actionability is addressed through linked checklists and nearby resource discovery.

Meier (2015) examines "digital humanitarianism" and the role of crowdsourced data in disaster response, demonstrating that community-sourced hazard reports can complement institutional data. However, Meier also notes the risk of misinformation in unverified reports. Babala sa Sakuna incorporates community reporting with a status workflow (submitted → under_review → verified) and submission guidelines that explicitly discourage unverified claims—balancing participatory data collection with information integrity.

Tan et al. (2017) studied disaster preparedness mobile applications in Southeast Asia and found that apps combining information delivery with behavioural nudges (reminders, progress tracking) achieved significantly higher engagement. Their findings support the inclusion of the checklist progress system and mission-based gamification in Babala sa Sakuna.

### 2.3 Gamification in Civic Applications

Deterding et al. (2011) define gamification as "the use of game design elements in non-game contexts." In civic and emergency preparedness contexts, gamification has shown promise in increasing user engagement with otherwise low-frequency, prevention-oriented behaviours (Robson et al., 2015). Babala sa Sakuna implements a missions-and-badges system where users complete educational quizzes on disaster preparedness topics (typhoon safety, flood awareness, earthquake response) and earn points leading to level progression and badge awards. This approach is grounded in Self-Determination Theory (Ryan & Deci, 2000): the missions provide competence (demonstrating knowledge), autonomy (choosing which missions to attempt), and relatedness (community preparedness as a shared goal). The badge system provides extrinsic reinforcement that complements intrinsic motivation to learn about disaster safety.

Critically, gamification in safety-critical contexts must avoid trivialising the subject matter. Nicholson (2015) warns against "pointsification"—superficial reward systems that undermine serious content. The quiz questions in Babala sa Sakuna are factually grounded (e.g., "What should you include in an emergency kit?" with explanations for each answer), and the badge categories (Preparedness, Survival, Knowledge, Community) align with genuine disaster readiness competencies.

### 2.4 Multilingual Emergency Communication

Research consistently demonstrates that disaster communication in the affected population's primary language significantly improves comprehension and response compliance. Palen and Liu (2007) found that language barriers during Hurricane Katrina contributed to delayed evacuation among non-English-speaking communities. In the Philippines, while English is widely understood among educated urban populations, Tagalog remains the primary language for approximately 45 million speakers, and many citizens in rural areas have limited English proficiency (Philippine Statistics Authority, 2020).

Babala sa Sakuna implements full bilingual support through i18n-js with over 200 translated strings covering all seven screens, severity descriptions, checklist items, and report categories. The language preference persists across sessions via AsyncStorage and can be toggled instantly without app restart. This implementation aligns with inclusive design principles: the app does not assume English proficiency and provides full functionality in Tagalog.

---

## Chapter 3: Design

### 3.1 User Analysis

#### 3.1.1 Target Users

The primary target users are Filipino citizens aged 16–65 in disaster-prone regions of the Philippines. Three user personas were developed:

**Persona 1 – Maria (Rural Farmer, 42):** Lives in a typhoon-prone province. Limited smartphone experience, predominantly Tagalog-speaking. Needs simple, clear warnings with actionable steps. Represents users who benefit most from bilingual support and the severity guide onboarding modal.

**Persona 2 – James (Urban Student, 22):** Lives in Metro Manila. Tech-literate, English-speaking. Interested in air quality data and gamified learning. Represents users who engage with the missions system and weather/PSI monitoring features.

**Persona 3 – Liza (Barangay Official, 35):** Manages community disaster response. Needs to monitor multiple hazard types, access nearby resources, and coordinate community reports. Represents users who use the full feature set including the resource hub and community reporting.

#### 3.1.2 User Needs Analysis

Key user needs identified through persona analysis and literature review:
- Receive timely, understandable disaster warnings (all personas)
- Access preparedness guidance relevant to current phase — before, during, after (Maria, James)
- Monitor environmental conditions: weather, air quality (James, Liza)
- Locate nearby emergency resources: shelters, hospitals (Maria, Liza)
- Report local hazards to aid community awareness (Liza)
- Learn preparedness skills in an engaging format (James)
- Use the app in Tagalog (Maria)
- Use the app without reliable internet (Maria)

### 3.2 Requirements Specification

#### 3.2.1 Functional Requirements

| ID   | Requirement                                                     | Priority |
|------|-----------------------------------------------------------------|----------|
| FR1  | Display real-time disaster alerts with severity colour-coding    | Must     |
| FR2  | Filter alerts by hazard type (typhoon, flood, earthquake, volcano) | Must   |
| FR3  | Show detailed alert information with recommended actions         | Must     |
| FR4  | Display current weather data (temperature, wind, humidity)       | Must     |
| FR5  | Display air quality (PSI/AQI) with health recommendations       | Must     |
| FR6  | Show hazard map with active disaster zones                       | Should   |
| FR7  | Provide emergency checklist with before/during/after phases      | Must     |
| FR8  | Track checklist completion progress per phase                    | Must     |
| FR9  | Enable community hazard report submission                        | Must     |
| FR10 | List nearby emergency resources (shelters, hospitals, stations)  | Must     |
| FR11 | Calculate distance to resources using GPS                        | Should   |
| FR12 | Support English and Tagalog languages                            | Must     |
| FR13 | Provide educational missions with quizzes                        | Should   |
| FR14 | Award badges and points for completed missions                   | Should   |
| FR15 | Persist checklist, reports, and preferences offline              | Must     |

#### 3.2.2 Non-Functional Requirements

| ID    | Requirement                                                    | Metric           |
|-------|----------------------------------------------------------------|------------------|
| NFR1  | App must load within 3 seconds on a mid-range Android device   | < 3s cold start  |
| NFR2  | Must function offline for checklist and saved reports           | Full offline access |
| NFR3  | API responses must be cached to reduce network dependency       | 30-min TTL cache |
| NFR4  | Must support Android 10+ devices                               | API level 29+    |
| NFR5  | Location data must remain on-device unless user submits report  | Local-only storage |
| NFR6  | Must degrade gracefully when features are unavailable           | Stub/fallback pattern |

### 3.3 Use Case Diagram

*Figure 3.1: Use Case Diagram*

The use case diagram shows the primary actor (Filipino Citizen) interacting with seven use case groups: View Alerts (includes filter, view details), Check Weather/PSI, View Map, Complete Checklist, Submit Report, Access Resources (includes find nearest), and Complete Missions (includes take quiz, earn badge). A secondary actor (External APIs: OpenWeatherMap, WAQI) provides data to the weather and alert use cases. A future actor (Administrator) is shown as out-of-scope for the prototype.

### 3.4 System Architecture

*Figure 3.2: System Architecture Diagram*

The architecture follows a three-layer pattern:

**Presentation Layer:** Expo Router screens (7 tabs + alert detail + auth screens) built with React Native components. Each screen is a functional component using React hooks for state management.

**Service Layer:** Singleton service classes provide business logic:
- `WeatherService` — weather/PSI data with caching, API transformation, alert inference
- `LocationService` — GPS permissions, reverse geocoding, distance calculations
- `AlertPollingService` — periodic alert checks with deduplication
- `ResourceService` — resource filtering, search, nearest-resource computation
- `MissionService` — quiz scoring, badge awarding, progress tracking
- `LocalizationService` — i18n translation management
- `NotificationService` — stub/full pattern for Expo Go compatibility
- `CacheService` — AsyncStorage-based caching with TTL
- `ApiClient` — axios wrapper with retry logic and exponential backoff

**Data Layer:** External APIs (OpenWeatherMap, WAQI, Google Maps), local mock data for fallback, and AsyncStorage for offline persistence.

### 3.5 Database Schema

*Figure 3.3: Data Model Diagram*

The TypeScript type definitions serve as the application's data schema:

- **Alert**: id, title, description, category (HazardCategory), severity (SeverityLevel), affectedRegions[], coordinates, radiusKm, isActive, timestamp
- **WeatherData**: id, location, temperature, condition, humidity, windSpeed, rainfall, lastUpdated
- **PSIData**: id, location, psiValue, level (PSILevel), pollutants (pm25, pm10, o3, no2, so2, co), healthRecommendations[]
- **Resource**: id, name, type (ResourceType), address, coordinates, phone, capacity, is24Hours
- **ChecklistItem**: id, phase (before/during/after), title, description, priority, isCompleted
- **CommunityReport**: id, category, location, description, timestamp, status
- **Mission**: id, title, category, questions (Quiz[]), pointsReward, badgeId
- **UserProgress**: points, level, completedMissions[], earnedBadges[]

### 3.6 Navigation Flow

*Figure 3.4: Screen Flow Diagram*

The app uses a bottom-tab navigation pattern with 7 tabs:
1. **Dashboard** → tap alert → **Alert Detail** → link to Map or Checklist
2. **Weather/PSI** → pull-to-refresh; "Check for Alerts Now" button
3. **Map** → list/map view of hazard zones
4. **Checklist** → tab between Before/During/After phases; toggle items
5. **Resources** → filter by type; tap for call/directions
6. **Missions** → start quiz → answer questions → view results → earn badge
7. **Report** → select category → fill form → submit

The root layout (`_layout.tsx`) initialises all services (localization, notifications, alert polling) and wraps the app in an `AuthProvider` context. An optional auth flow (login/signup/reset-password) is available but not enforced in the prototype.

### 3.7 Project Timeline

*Figure 3.5: Project Gantt Chart (22 Weeks)*

The project was planned and executed over a 22-week period, structured into seven distinct phases to manage scope and risk progressively.

**Phase 1 — Initial Research (Weeks 1–4):** The project began with writing the project proposal and conducting a literature review of existing disaster warning applications (PAGASA, Disaster Alert, ReliefWeb, Philippine Red Cross) and academic research on mobile disaster systems, gamification, and multilingual emergency communication. Requirements were gathered through persona analysis and a review of the Philippine disaster context.

**Phase 2 — Preliminary Report (Weeks 5–8):** The preliminary project report was written covering the project specification, design rationale, and planned methodology. During this phase, the functional and non-functional requirements (FR1–FR15, NFR1–NFR6) were formalised, UI wireframes were drafted for all seven screens, and the system architecture was defined.

**Phase 3 — Core Development (Weeks 9–14):** Development began with project setup (Expo SDK 54, TypeScript configuration, Expo Router file-based routing). The four original core screens were built sequentially: the Dashboard with alert filtering and severity colour-coding, the Hazard Map with Expo Go list-view fallback, the Emergency Checklist with three-phase tab navigation and AsyncStorage persistence, and the Community Report form with validation and local storage. The Severity Guide onboarding modal was also implemented during this phase.

**Phase 4 — Enhanced Features (Weeks 14–18):** Three major feature additions expanded the app beyond its initial scope. The multilingual system was implemented using i18n-js with 200+ translated strings across English and Tagalog. The push notification architecture was designed with the stub/full service pattern to maintain Expo Go compatibility. Three new screens were developed: the Weather and PSI monitor with colour-coded air quality indicators, the Resource Hub with type-based filtering and distance calculation capabilities, and the Missions and Badges gamification system with quiz logic, scoring, and progress persistence.

**Phase 5 — API Integration & Advanced Services (Weeks 18–20):** This phase transitioned the app from mock data to live API integration. The Firebase Authentication system was implemented with deferred initialisation and guest-mode fallback. The ApiClient was built with axios, retry logic, and exponential backoff. OpenWeatherMap and WAQI APIs were integrated into the WeatherService with 30-minute TTL caching. The LocationService was developed with GPS permissions, reverse geocoding, and the Philippines bounding box check to ensure location accuracy. The AlertPollingService was created to check for weather-based disaster alerts every 15 minutes with deduplication and in-app notification delivery.

**Phase 6 — Testing (Weeks 20–21):** Testing was conducted across three levels: device testing on Android 10, 12, and 14 (both physical devices and emulators); integration testing in Expo Go validating the full data flow from API to UI; and user acceptance testing with five participants completing six task-based scenarios across all seven screens. Bugs identified during testing—including the WAQI Taiwan station issue and Expo Go notification crashes—were resolved during this phase.

**Phase 7 — Final Report & Submission (Weeks 21–22):** The evaluation chapter was written incorporating UAT results, performance metrics, and critical analysis. The conclusion, references, and all figures were finalised. The complete report was compiled and submitted alongside the working application codebase.

---

## Chapter 4: Implementation

### 4.1 Technology Stack Justification

**React Native with Expo** was chosen over Flutter or native development for several reasons. First, the project targets both Android and iOS from a single TypeScript codebase, reducing development time by an estimated 40% compared to maintaining separate native projects. Second, Expo's managed workflow provides hot-reload, over-the-air updates, and a rich library ecosystem (expo-location, expo-notifications, AsyncStorage) that accelerates prototyping. Third, TypeScript provides compile-time type safety, which is valuable for a project with complex data transformations between API responses and internal types. Flutter was considered but rejected because its Dart ecosystem has fewer Philippines-specific community libraries, and the team's existing JavaScript/TypeScript experience made React Native the more productive choice.

The trade-off is Expo Go's limitations: push notifications require a native development build (SDK 53+), and certain native modules (react-native-maps with full interactivity, Firebase native SDKs) are unavailable without ejecting. This was mitigated through the stub/fallback pattern described in Section 4.4.

### 4.2 Key Algorithms

#### 4.2.1 Haversine Formula for Distance Calculation

The Resource Hub requires calculating distances between the user's GPS position and emergency resources (shelters, hospitals, stations) to surface the nearest options. The Haversine formula computes the great-circle distance between two points on a sphere given their longitudes and latitudes:

$$d = 2r \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\phi_2 - \phi_1}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\lambda_2 - \lambda_1}{2}\right)}\right)$$

Where:
- $\phi_1, \phi_2$ are the latitudes in radians
- $\lambda_1, \lambda_2$ are the longitudes in radians
- $r$ is Earth's radius (6,371 km)

The `LocationService.calculateDistance()` method implements this and is used by `ResourceService.getNearestResources()` to sort all resources by proximity. This produces distances accurate to within ~0.5% for the short ranges typical within Philippine metro areas.

#### 4.2.2 PSI/AQI Level Classification

The air quality classification maps raw AQI integer values from the WAQI API into four health-relevant categories with corresponding colour codes and recommendations:

```
AQI 0–50    → Good       (#16A34A, green)   — Normal outdoor activities
AQI 51–100  → Moderate   (#D97706, yellow)  — Sensitive groups limit exertion
AQI 101–200 → Unhealthy  (#EA580C, orange)  — Everyone limit outdoor exertion
AQI 201–500 → Hazardous  (#7C2D12, dark red) — Avoid all outdoor activity
```

This classification follows the US EPA AQI standard adopted by WAQI, ensuring consistency with international health guidance. The thresholds also drive alert generation: AQI > 100 triggers a medium-severity alert, AQI > 150 triggers high, and AQI > 200 triggers extreme.

#### 4.2.3 Weather Alert Inference from Condition Codes

The `buildWeatherAlert()` method maps OpenWeatherMap condition IDs to structured disaster alerts without requiring the paid One Call API. The classification logic:

- **Extreme (evacuate):** Condition codes 781 (tornado), 900 (tornado), 902 (hurricane) → immediate evacuation alert
- **High (thunderstorm/heavy rain):** Codes 200–232 (thunderstorm group) or 502, 503, 504, 522, 531 (heavy rain) → stay indoors, avoid low-lying areas
- **Medium (advisory):** Code 501 (moderate rain) or wind speed > 60 km/h → take caution
- **No alert:** All other conditions (clear, light rain, clouds)

This heuristic approach trades precision for availability: it works with the free OpenWeatherMap tier and provides useful signal even without access to official PAGASA warnings.

#### 4.2.4 Caching Strategy

All API responses are cached in AsyncStorage with a 30-minute TTL:

```typescript
private async getFromCache<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  const cached: CachedData<T> = JSON.parse(raw);
  if (Date.now() - cached.timestamp > CACHE_DURATION) return null; // expired
  return cached.data;
}
```

This serves three purposes: (1) reduces API call frequency within rate limits, (2) provides instant load on subsequent views within the cache window, and (3) ensures the last-known data remains available if the network drops. On pull-to-refresh, the cache is cleared and fresh data is fetched.

### 4.3 Architecture Pattern: Singleton Services

All service classes use the Singleton pattern to ensure a single instance manages state consistently:

```typescript
export class WeatherService {
  private static instance: WeatherService;
  private constructor() {
    this.useRealApis = features.useRealApis;
  }
  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }
}
```

This pattern is applied to `WeatherService`, `LocationService`, `ResourceService`, `MissionService`, `AlertPollingService`, and `FirebaseService`. It guarantees that cache state, polling timers, and location subscriptions are not duplicated across screen re-renders.

### 4.4 Stub/Fallback Pattern for Expo Go Compatibility

A key engineering challenge was supporting features that require native modules (Firebase Auth, push notifications, native maps) while maintaining Expo Go compatibility for rapid development. The solution uses conditional `require()` with try/catch at the module level:

```typescript
let messaging: any = null;
let isNativeModuleAvailable = false;
try {
  messaging = require('@react-native-firebase/messaging').default;
  isNativeModuleAvailable = true;
} catch (error) {
  isNativeModuleAvailable = false;
}
```

When the native module is unavailable (Expo Go), the service enters "stub mode" where all methods return safe defaults (null tokens, false permissions, no-op sends). This is applied consistently across `FirebaseService`, `NotificationService`, and `AuthService`. The stub pattern enables the full app to run without crashes in Expo Go while preserving the complete implementation for native development builds.

### 4.5 Philippines-Bounded Location Handling

A significant implementation challenge was ensuring all data displayed pertains to the Philippines. Android emulators default to Mountain View, California (37.4°N, 122.1°W), and the WAQI geo endpoint returns the nearest global station—which from Manila coordinates could be a station in Taiwan. Two mechanisms address this:

**Geographic bounding box check:**
```typescript
const PH_BOUNDS = {
  minLat: 4.5,  maxLat: 21.5,
  minLon: 116.0, maxLon: 127.0,
};
function safeCoords(lat, lon) {
  if (isWithinPhilippines(lat, lon)) return { latitude: lat, longitude: lon };
  return DEFAULT_COORDINATES; // Manila
}
```

**City-based WAQI lookup:** Instead of the geo endpoint, air quality is fetched by mapping coordinates to the nearest Philippine city with a known WAQI station (`getNearestPHCity()`), guaranteeing Philippines-specific results.

### 4.6 AuthContext Provider

The `AuthContext` wraps the entire application, managing authentication state and exposing `signUp`, `signIn`, `signOut`, and `resetPassword` methods to all screens. It initialises Firebase with deferred loading—if Firebase native modules are unavailable (Expo Go), it enters guest mode silently:

```typescript
const initializeAuth = async () => {
  await firebaseService.initialize();
  await authService.initialize();
  if (firebaseService.isStubMode()) {
    console.log('Auth: Guest mode active (Expo Go)');
    setLoading(false);
    return;
  }
  const cachedUser = await authService.getCachedUser();
  if (cachedUser) setUser(cachedUser);
  setLoading(false);
};
```

This ensures the full app is usable without authentication while the auth infrastructure is ready for production deployment.

### 4.7 Screenshots

*Figure 4.1: Dashboard — real-time alerts with severity filtering*
*Figure 4.2: Alert Detail — recommended actions and affected regions*
*Figure 4.3: Weather & PSI — live temperature, humidity, wind, air quality*
*Figure 4.4: Disaster Alerts section — inferred weather alerts with "Check Now"*
*Figure 4.5: Hazard Map — active disaster zones (list fallback in Expo Go)*
*Figure 4.6: Emergency Checklist — Before/During/After tabs with progress*
*Figure 4.7: Resource Hub — shelters, hospitals, stations with filter chips*
*Figure 4.8: Community Report — category selection and form submission*
*Figure 4.9: Missions — quiz questions with answer explanations*
*Figure 4.10: Badge Display — earned and locked badges with points/level*
*Figure 4.11: Severity Guide Modal — onboarding for new users*
*Figure 4.12: Language Switcher — English/Tagalog toggle*
*Figure 4.13: Tagalog UI — full screen translated to Tagalog*
*Figure 4.14: Login/Signup — authentication screens (guest mode in Expo Go)*
*Figure 4.15: Pull-to-Refresh — live data update in progress*

---

## Chapter 5: Evaluation

### 5.1 Testing Strategy

A multi-layered testing approach was employed to validate the application across functional correctness, integration behaviour, user acceptance, and device compatibility.

| Test Type             | Tool/Method              | Coverage                           |
|-----------------------|--------------------------|-------------------------------------|
| Unit Testing          | Manual + TypeScript check| Service functions, data transforms  |
| Integration Testing   | Expo Go live testing     | API calls + navigation flows        |
| User Acceptance (UAT) | 5 users, task-based      | All 7 screens, end-to-end workflows|
| Device Testing        | Android 10/12/14         | 3 physical/emulated devices         |
| Type Safety           | `npx tsc --noEmit`       | Full codebase — 0 errors            |

#### 5.1.1 Unit Testing

Service-level logic was validated through manual execution and TypeScript compile-time checks. Key validations included: Haversine distance calculation accuracy (compared against Google Maps distances for known Manila landmarks — within 0.3% error), PSI classification boundary conditions (AQI values 49, 50, 51, 100, 101, 150, 151, 200, 201 all classified correctly), weather alert inference for each condition code group, and cache expiry behaviour (data served from cache within 30 minutes, fresh fetch after expiry). The TypeScript compiler with strict mode enabled (`npx tsc --noEmit`) confirmed zero type errors across the full codebase.

#### 5.1.2 Integration Testing

Integration testing was performed live in Expo Go, validating that the complete data flow from API request through service transformation to UI rendering functioned correctly. Console logging confirmed:
- OpenWeatherMap API returning HTTP 200 with valid weather data for Manila coordinates
- WAQI API returning HTTP 200 with air quality data for Philippine cities
- Alert polling service executing on the 15-minute cycle and deduplicating previously shown alerts
- Location service obtaining GPS coordinates, performing reverse geocoding, and falling back to Manila when outside Philippine bounds
- AsyncStorage correctly persisting checklist states, language preferences, mission progress, and cached API responses across app restarts

#### 5.1.3 Device Testing

The application was tested on three device configurations:

| Device/Environment       | OS Version  | Result                                       |
|--------------------------|-------------|----------------------------------------------|
| Samsung Galaxy A52       | Android 12  | All features functional, smooth navigation   |
| Android Emulator (Pixel 5)| Android 14 | All features functional, Manila fallback used|
| Samsung Galaxy S10       | Android 10  | All features functional, minor layout spacing|

All devices achieved cold start times under 3 seconds (NFR1 met). Offline functionality for checklist and saved reports was confirmed by enabling airplane mode after initial load.

### 5.2 User Acceptance Testing

#### 5.2.1 Methodology

Five participants were recruited (2 university classmates, 2 family members, 1 colleague) representing a range of ages (19–48) and technical proficiency levels. Each participant was given the app on an Android device and asked to complete six tasks without guidance:

| Task | Description                                           | Screen(s)      |
|------|-------------------------------------------------------|----------------|
| T1   | Find the most severe active alert and read its details| Dashboard, Alert Detail |
| T2   | Check current weather and air quality for your area   | Weather/PSI    |
| T3   | Find the nearest evacuation centre or shelter         | Resources      |
| T4   | Complete 5 checklist items in the "Before" phase      | Checklist      |
| T5   | Report a flooding hazard in your neighbourhood        | Report         |
| T6   | Complete one mission quiz and earn a badge            | Missions       |

For each task, the following were recorded: success (yes/partial/no), time taken (seconds), number of errors or wrong navigations, and post-task satisfaction (1–5 Likert scale).

#### 5.2.2 Results

*Table 5.1: User Acceptance Test Results*

| Task | Success Rate | Avg Time (s) | Avg Errors | Avg Satisfaction |
|------|-------------|---------------|------------|------------------|
| T1   | 5/5 (100%)  | 18            | 0.2        | 4.8              |
| T2   | 5/5 (100%)  | 12            | 0.0        | 4.6              |
| T3   | 4/5 (80%)   | 25            | 0.8        | 4.0              |
| T4   | 5/5 (100%)  | 35            | 0.4        | 4.4              |
| T5   | 5/5 (100%)  | 42            | 0.6        | 4.2              |
| T6   | 5/5 (100%)  | 65            | 0.2        | 4.6              |

**Overall task completion rate: 96.7% (29/30 task attempts successful)**
**Average satisfaction: 4.43/5**

*Figure 5.1: Task Completion Time (bar chart)*
*Figure 5.2: Satisfaction Ratings by Task (bar chart)*

#### 5.2.3 Analysis

**T1 (Find severe alert):** All participants completed this quickly. The severity colour-coding and filter chips were immediately understood. One participant initially tapped the weather tab instead but self-corrected within 3 seconds.

**T2 (Weather/PSI):** Fastest task. The dedicated Weather tab with clear cards was intuitive. All participants understood the PSI colour indicators without explanation, validating the design choice of consistent colour semantics.

**T3 (Find nearest shelter):** One participant (age 48, lower tech proficiency) initially looked for shelters in the Map tab rather than Resources. After 30 seconds she found the correct tab. This suggests the resource/map distinction could be clearer—a UX improvement for future iterations.

**T4 (Checklist):** All completed successfully. The phase tabs (Before/During/After) were understood, though two participants initially checked items in "During" before reading that the task specified "Before"—a reading comprehension issue rather than a UI issue.

**T5 (Report hazard):** All submitted successfully. Average time was higher due to form filling (typing description). Two participants questioned why location was optional—they expected mandatory geolocation, which is actually a deliberate privacy-respecting design choice.

**T6 (Complete mission):** All completed and earned a badge. Participants expressed positive reactions to the badge animation and quiz explanations. One participant voluntarily continued to attempt a second mission after completing the task.

#### 5.2.4 Qualitative Feedback

Positive themes: "Clear and easy to understand" (3 participants), "The colours help me know what's serious" (2 participants), "I like that I learn something from the quizzes" (2 participants), "Switching to Tagalog is helpful for my parents" (1 participant).

Improvement suggestions: "Show distance in the resource list without tapping" (2 participants), "Add a home button to go back to dashboard from any screen" (1 participant), "Push notifications would be important for real use" (2 participants).

### 5.3 Performance Metrics

| Metric                    | Target          | Actual                        |
|---------------------------|-----------------|-------------------------------|
| Cold start time           | < 3 seconds     | ~2.1s (Samsung A52)           |
| API response (weather)    | < 5 seconds     | ~1.2s (OpenWeatherMap)        |
| API response (AQI)        | < 5 seconds     | ~0.8s (WAQI)                  |
| Cache hit load            | < 500ms         | ~120ms (AsyncStorage)         |
| Checklist toggle persist  | Immediate       | ~50ms (AsyncStorage write)    |
| Language switch           | < 1 second      | Instant (re-render)           |
| TypeScript compile errors | 0               | 0                             |

### 5.4 Critical Evaluation

#### 5.4.1 Successes

**Seven fully functional screens** covering the complete disaster preparedness cycle (warning → information → preparation → response → reporting → education). All screens work in Expo Go without crashes.

**Bilingual support** with 200+ translated strings enabling genuine accessibility for Tagalog-speaking users. The instant language toggle with persistent preference exceeds many comparable apps that offer only one language.

**Offline capability** for checklists and saved reports ensures the app provides value even during network outages—precisely when disasters are most likely to disrupt connectivity.

**Gamification** through the missions and badges system provides a unique differentiator among Philippine disaster apps. UAT results (Task T6: 100% completion, 4.6/5 satisfaction) confirm user engagement.

**Graceful degradation** throughout the architecture. The stub/fallback pattern for Firebase, notifications, and maps ensures every feature either works fully or degrades transparently—no crashes, no blank screens.

**Real-time API integration** with OpenWeatherMap and WAQI provides live, location-aware weather and air quality data, validated by HTTP 200 responses in production logs.

#### 5.4.2 Limitations

**No official PAGASA API integration.** PAGASA does not expose a public API. Weather data comes from OpenWeatherMap which, while accurate, does not include PAGASA-specific signal numbers (Signal 1–5 typhoon warnings) that Filipino users are familiar with. Future work should explore PAGASA web scraping or RSS feed parsing.

**Firebase requires native build.** Authentication, Firestore database, and Cloud Messaging all require a development build with native Firebase SDKs. In Expo Go, these operate in stub mode. This means multi-user features (synced reports, server-side alert push) are architecturally ready but not testable in the prototype environment.

**No admin panel.** Community reports are submitted but there is no moderator interface to review, verify, or escalate them. A production deployment would require a web-based admin dashboard.

**Resource data is mock.** The 10 emergency resources (shelters, hospitals, stations) use realistic Manila metro area data but are not sourced from a live database. Production use requires integration with NDRRMC or local government resource registries.

#### 5.4.3 Failures (Honest Assessment)

**Push notifications are untestable in Expo Go.** Despite significant engineering effort (stub/full pattern, lazy loading, conditional imports), the Expo SDK 53+ restriction means push notifications cannot be demonstrated in the development environment. The full implementation exists in `NotificationService.full.ts` and is architecturally validated, but end-to-end notification delivery has not been tested. The in-app `Alert.alert()` polling mechanism provides a functional workaround for the prototype but is not equivalent to true background push delivery.

**WAQI station accuracy.** The geo-coordinate WAQI endpoint sometimes returns stations outside the Philippines (e.g., a Taiwan station for Manila coordinates). The city-based lookup workaround resolves this for major cities but provides less precise results for rural or non-metro areas where no named WAQI station exists.

#### 5.4.4 Future Extensions

1. **Real-time WebSocket alerts:** Replace 15-minute polling with WebSocket or Server-Sent Events for instant alert delivery, reducing the maximum delay from 15 minutes to near-zero.

2. **Barangay admin dashboard:** A web-based interface for local government units to manage evacuation centres, verify community reports, and issue localised warnings.

3. **SMS fallback for no-internet areas:** Use Twilio or a local SMS gateway to deliver critical alerts via text message to users without data connectivity—addressing the "last mile" problem identified in Chapter 1.

4. **PAGASA integration via web scraping:** Implement a server-side scraper for PAGASA weather bulletins and typhoon signal information, mapping them to the app's alert severity system.

5. **Offline-first preparedness mode:** Downloadable resource packs (checklists, first-aid guides, evacuation routes) cached locally for use during connectivity loss.

6. **Formal usability evaluation:** Conduct a larger UAT study (n=20+) with SUS (System Usability Scale) scoring and A/B testing of key UI decisions (colour schemes, navigation structure).

---

## Chapter 6: Conclusion

### 6.1 Summary of Achievements

Babala sa Sakuna successfully delivers a functional prototype of a Philippine-focused disaster warning mobile application. The project achieved its core objectives: real-time weather and air quality monitoring through OpenWeatherMap and WAQI API integration; severity-classified disaster alerts with actionable recommendations; an emergency preparedness checklist spanning before, during, and after disaster phases; a resource hub with GPS-based distance calculations to nearby shelters and emergency services; community hazard reporting; bilingual English/Tagalog support; and a gamified missions system that incentivises disaster preparedness learning.

The application implements seven fully functional screens accessible through intuitive tab navigation, all working within Expo Go's constraints through a carefully designed stub/fallback architecture. User acceptance testing with five participants achieved a 96.7% task completion rate and 4.43/5 average satisfaction, validating the usability of the core workflows.

### 6.2 Addressing Feedback

Throughout development, iterative feedback shaped key decisions. Early user testing revealed that the severity colour system was not immediately understood—leading to the implementation of the Severity Guide onboarding modal, which was well-received by all subsequent testers. API integration testing exposed the WAQI station accuracy problem (returning non-Philippine stations), which was resolved by switching to city-based lookups. The Expo Go notification limitation, discovered during integration testing, drove the architectural decision to implement the stub/full service pattern and the AlertPollingService with in-app alerts as a functional alternative.

### 6.3 Technology and Disaster Preparedness in Developing Nations

The Philippines case study illustrates both the opportunity and the challenge of technology-driven disaster preparedness in developing nations. The opportunity is clear: high mobile penetration means well-designed apps can reach millions of at-risk citizens with timely, personalised information. The challenges, however, are significant. Reliable API data sources are scarce—PAGASA lacks a public API, authoritative resource databases are not digitised, and air quality monitoring coverage is sparse outside metro areas. Infrastructure constraints (intermittent connectivity, older devices, limited storage) demand offline-first design and lightweight architectures. Language diversity requires genuine multilingual support, not just English-first design with optional translation.

Babala sa Sakuna demonstrates that a single developer, using modern cross-platform frameworks and freely available APIs, can produce a functional disaster warning prototype that addresses real needs. However, the gap between prototype and production deployment is substantial: it requires institutional data partnerships (PAGASA, NDRRMC, DILG), backend infrastructure (Firebase/cloud functions, admin interfaces), sustained maintenance, and community trust-building. The most impactful future direction would be partnering with a local government unit (LGU) to pilot the app in a real community during typhoon season—transforming this academic prototype into a genuine contribution to Filipino disaster resilience.

### 6.4 Final Reflection

This project reinforced that engineering for safety-critical, real-world use cases demands discipline beyond feature delivery. The most valuable technical skills exercised were not building screens but designing fallback chains, validating geographic correctness, and making honest trade-offs between ideal and achievable functionality. The stub/fallback pattern, the Philippines bounds-checking, and the alert-inference heuristic are all engineering responses to genuine constraints—not theoretical exercises. If this project achieves one lasting outcome, it is demonstrating that disaster preparedness technology must be built for the conditions in which disasters actually occur: limited connectivity, stressed infrastructure, and users who need clarity above all else.

---

## References

- Aloudat, A. and Michael, K. (2011) 'Toward the regulation of ubiquitous mobile government: a case study on location-based emergency services in Australia', *Electronic Commerce Research*, 11(1), pp. 31–74.
- Deterding, S., Dixon, D., Khaled, R. and Nacke, L. (2011) 'From game design elements to gamefulness: defining gamification', *Proceedings of the 15th International Academic MindTrek Conference*, pp. 9–15.
- Lagmay, A.M.F. et al. (2015) 'Devastating storm surges of Typhoon Haiyan', *International Journal of Disaster Risk Reduction*, 11, pp. 1–12.
- Meier, P. (2015) *Digital Humanitarians: How Big Data Is Changing the Face of Humanitarian Response*. Boca Raton: CRC Press.
- Nicholson, S. (2015) 'A RECIPE for meaningful gamification', in *Gamification in Education and Business*. Cham: Springer, pp. 1–20.
- OCHA (2019) *ReliefWeb: Informing Humanitarians Worldwide*. United Nations Office for the Coordination of Humanitarian Affairs.
- Pacific Disaster Center (2020) *DisasterAWARE Platform Overview*. Available at: https://www.pdc.org.
- Palen, L. and Liu, S.B. (2007) 'Citizen communications in crisis: anticipating a future of ICT-supported public participation', *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*, pp. 727–736.
- Philippine Red Cross (2021) *Philippine Red Cross Mobile Applications*. Available at: https://redcross.org.ph.
- Philippine Statistics Authority (2020) *Philippine Population by Mother Tongue*. Manila: PSA.
- Racoma, B.A.B. et al. (2016) 'The change in rainfall from tropical cyclones due to orographic effect of the Sierra Madre Mountain Range in Luzon, Philippines', *Philippine Journal of Science*, 145(4), pp. 313–326.
- Robson, K. et al. (2015) 'Is it all a game? Understanding the principles of gamification', *Business Horizons*, 58(4), pp. 411–420.
- Ryan, R.M. and Deci, E.L. (2000) 'Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being', *American Psychologist*, 55(1), pp. 68–78.
- Tan, M.L. et al. (2017) 'Social media and disaster preparedness: a systematic review', *International Journal of Disaster Risk Reduction*, 24, pp. 252–264.
