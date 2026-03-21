import { I18n } from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = '@babala_language';

// Translation data
const translations = {
  en: {
    // Common
    loading: 'Loading...',
    cancel: 'Cancel',
    close: 'Close',
    submit: 'Submit',
    
    // Severity levels
    severity: {
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low / Advisory',
    },

    // Dashboard
    dashboard: {
      title: 'Babala sa Sakuna',
      activeAlerts: 'Active Alerts',
      activeAlert: 'Active Alert',
      noAlerts: 'No Active Alerts',
      noAlertsDesc: 'No alerts match the selected filter. Try selecting a different category.',
      loadingAlerts: 'Loading alerts...',
      filters: {
        all: 'All',
        typhoon: 'Typhoon',
        flood: 'Flood',
        earthquake: 'Earthquake',
        volcano: 'Volcano',
      },
    },

    // Alert Details
    alertDetail: {
      description: 'Description',
      affectedRegions: 'Affected Regions',
      timeline: 'Timeline',
      issued: 'Issued:',
      updated: 'Updated:',
      recommendedActions: 'Recommended Actions',
      viewOnMap: 'View on Map',
      openChecklist: 'Open Checklist',
      notFound: 'Alert not found',
      goBack: 'Go Back',
    },

    // Map
    map: {
      title: 'Hazard Map',
      hazardZones: 'active hazard zones',
      hazardZone: 'active hazard zone',
      riskLevel: 'Risk Level',
      fallbackBanner: 'Hazard zone list view — native map requires a development build',
      radius: 'km radius',
    },

    // Checklist
    checklist: {
      title: 'Emergency Checklist',
      subtitle: 'preparation steps • Works offline',
      phases: {
        before: 'Before',
        during: 'During',
        after: 'After',
      },
      completed: 'completed',
      of: 'of',
    },

    // Report
    report: {
      title: 'Community Report',
      subtitle: 'Report local hazards to help your community',
      reportType: 'Report Type',
      location: 'Location (Optional)',
      locationPlaceholder: 'e.g., Brgy. San Antonio, Makati City',
      description: 'Description',
      descriptionPlaceholder: 'Describe the situation in detail...',
      guidelines: 'Reporting Guidelines',
      guidelineItems: [
        'Be specific about the location and situation',
        'Do not share unverified or alarming information',
        'Reports are saved locally for now and may be shared with authorities in future updates',
        'Your safety comes first — only report when safe to do so',
      ],
      categories: {
        flooding: 'Flooding',
        road_blocked: 'Road Blocked',
        structural_damage: 'Structural Damage',
        landslide: 'Landslide',
        power_outage: 'Power Outage',
        other: 'Other',
      },
      submitReport: 'Submit Report',
      submitted: 'Report Submitted',
      thankYou: 'Thank you for helping your community. Your report has been saved locally and will be reviewed when connectivity allows.',
      submitAnother: 'Submit Another Report',
      errors: {
        selectCategory: 'Please select a report category',
        descriptionRequired: 'Description is required',
        descriptionTooShort: 'Description must be at least 10 characters',
      },
    },

    // Tabs
    tabs: {
      dashboard: 'Dashboard',
      weather: 'Weather',
      map: 'Hazard Map',
      resources: 'Resources',
      checklist: 'Checklist',
      missions: 'Missions',
      report: 'Report',
    },

    // Weather Screen
    weather: {
      title: 'Weather & Air Quality',
      subtitle: 'Real-time environmental monitoring across the Philippines',
      loading: 'Loading environmental data...',
      airQuality: 'Air Quality Index (PSI)',
      airQualityDesc: 'Monitor pollution levels and protect your health',
      currentWeather: 'Current Weather',
      currentWeatherDesc: 'Live weather conditions and forecasts',
      disasterAlerts: 'Disaster Alerts',
      disasterAlertsDesc: 'Real-time weather and air quality warnings for your area',
      checkAlerts: 'Check for Alerts Now',
      checking: 'Checking...',
      allClear: 'All Clear',
      allClearDesc: 'No active weather or air quality alerts in your area.',
      noPSI: 'No PSI data available',
      noWeather: 'No weather data available',
      noAlerts: 'No active alerts — your area is clear.',
      error: 'Could not fetch alerts. Check your API keys and internet connection.',
    },

    // Resources Screen
    resources: {
      title: 'Resource Hub',
      subtitle: 'Find emergency services and shelters near you',
      filterAll: 'All',
      filterShelters: 'Shelters',
      filterEvacuation: 'Evacuation',
      filterHospitals: 'Hospitals',
      filterFire: 'Fire',
      filterPolice: 'Police',
      resourceFound: 'resource found',
      resourcesFound: 'resources found',
      noResources: 'No resources found',
      noResourcesDesc: 'Try selecting a different category',
      infoTip: 'Tap "Call" to contact directly or "Directions" to navigate using your maps app.',
    },

    // Missions Screen
    missions: {
      title: 'Missions & Badges',
      level: 'Level',
      points: 'points',
      missionsLabel: 'missions',
      badgesLabel: 'badges',
      yourBadges: 'Your Badges',
      availableMissions: 'Available Missions',
      question: 'Question',
      of: 'of',
      greatJob: 'Great Job!',
      keepLearning: 'Keep Learning!',
      score: 'Score',
      completeMission: 'Complete Mission',
      tryAgain: 'Try Again',
      missionComplete: '🎉 Mission Complete!',
      youEarned: 'You earned',
      pointsLabel: 'points!',
      badgeUnlocked: 'Badge Unlocked',
      missionFailed: 'Mission Failed',
      needMore: 'You need at least',
      correctAnswers: 'correct answers to pass. Try again!',
      retry: 'Retry',
    },

    // Auth
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      guestMode: 'Guest Mode',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
    },

    // Severity Guide
    severityGuide: {
      title: 'Understanding Alert Levels',
      subtitle: 'Learn what each severity level means',
      levels: {
        critical: {
          title: 'Critical',
          description: 'Life-threatening situation. Immediate evacuation or action required. Destructive impact expected.',
        },
        high: {
          title: 'High Risk',
          description: 'Serious threat to safety. Prepare to evacuate. Significant damage possible.',
        },
        medium: {
          title: 'Medium Risk',
          description: 'Moderate threat. Monitor updates closely. Prepare emergency supplies.',
        },
        low: {
          title: 'Advisory',
          description: 'Low-level monitoring. Stay informed. Review preparedness plans.',
        },
      },
      gotIt: 'Got It',
      dontShowAgain: "Don't show this again",
    },

    // Settings
    settings: {
      language: 'Language',
      english: 'English',
      tagalog: 'Tagalog',
    },
  },

  tl: {
    // Common (Tagalog)
    loading: 'Naglo-load...',
    cancel: 'Kanselahin',
    close: 'Isara',
    submit: 'Isumite',
    
    // Severity levels
    severity: {
      critical: 'Kritikal',
      high: 'Mataas',
      medium: 'Katamtaman',
      low: 'Mababa / Paalala',
    },

    // Dashboard
    dashboard: {
      title: 'Babala sa Sakuna',
      activeAlerts: 'Aktibong Babala',
      activeAlert: 'Aktibong Babala',
      noAlerts: 'Walang Aktibong Babala',
      noAlertsDesc: 'Walang babala na tumutugma sa napiling kategorya. Subukan ang ibang kategorya.',
      loadingAlerts: 'Naglo-load ng mga babala...',
      filters: {
        all: 'Lahat',
        typhoon: 'Bagyo',
        flood: 'Baha',
        earthquake: 'Lindol',
        volcano: 'Bulkan',
      },
    },

    // Alert Details
    alertDetail: {
      description: 'Paglalarawan',
      affectedRegions: 'Apektadong Lugar',
      timeline: 'Takdang-Panahon',
      issued: 'Inilabas:',
      updated: 'Na-update:',
      recommendedActions: 'Mga Rekomendasyon',
      viewOnMap: 'Tingnan sa Mapa',
      openChecklist: 'Buksan ang Checklist',
      notFound: 'Hindi nahanap ang babala',
      goBack: 'Bumalik',
    },

    // Map
    map: {
      title: 'Mapa ng Panganib',
      hazardZones: 'aktibong danger zone',
      hazardZone: 'aktibong danger zone',
      riskLevel: 'Antas ng Panganib',
      fallbackBanner: 'Listahan ng danger zone — kailangan ng development build para sa native map',
      radius: 'km radius',
    },

    // Checklist
    checklist: {
      title: 'Emergency Checklist',
      subtitle: 'mga hakbang sa paghahanda • Gumagana offline',
      phases: {
        before: 'Bago',
        during: 'Habang',
        after: 'Pagkatapos',
      },
      completed: 'nakumpleto',
      of: 'sa',
    },

    // Report
    report: {
      title: 'Ulat ng Komunidad',
      subtitle: 'Mag-ulat ng panganib sa inyong lugar',
      reportType: 'Uri ng Ulat',
      location: 'Lokasyon (Opsyonal)',
      locationPlaceholder: 'hal., Brgy. San Antonio, Lungsod ng Makati',
      description: 'Paglalarawan',
      descriptionPlaceholder: 'Ilarawan ang sitwasyon...',
      guidelines: 'Mga Alituntunin',
      guidelineItems: [
        'Maging tiyak sa lokasyon at sitwasyon',
        'Huwag magbahagi ng hindi na-verify na impormasyon',
        'Ang mga ulat ay naka-save locally at maaaring ibahagi sa mga awtoridad sa hinaharap',
        'Ang inyong kaligtasan ang una — mag-ulat lamang kung ligtas',
      ],
      categories: {
        flooding: 'Baha',
        road_blocked: 'Saradong Daan',
        structural_damage: 'Sira na Istruktura',
        landslide: 'Landslide',
        power_outage: 'Walang Kuryente',
        other: 'Iba Pa',
      },
      submitReport: 'Isumite ang Ulat',
      submitted: 'Naisumite na ang Ulat',
      thankYou: 'Salamat sa pagtulong sa inyong komunidad. Ang ulat ay naka-save locally at susuriin kapag may koneksyon.',
      submitAnother: 'Magsumite ng Isa Pang Ulat',
      errors: {
        selectCategory: 'Pumili ng kategorya ng ulat',
        descriptionRequired: 'Kailangan ang paglalarawan',
        descriptionTooShort: 'Dapat ay hindi bababa sa 10 character ang paglalarawan',
      },
    },

    // Tabs
    tabs: {
      dashboard: 'Dashboard',
      weather: 'Panahon',
      map: 'Mapa',
      resources: 'Mga Mapagkukunan',
      checklist: 'Checklist',
      missions: 'Misyon',
      report: 'Ulat',
    },

    // Weather Screen
    weather: {
      title: 'Panahon at Kalidad ng Hangin',
      subtitle: 'Real-time na pagsubaybay sa kapaligiran sa Pilipinas',
      loading: 'Naglo-load ng datos sa kapaligiran...',
      airQuality: 'Air Quality Index (PSI)',
      airQualityDesc: 'Subaybayan ang antas ng polusyon at protektahan ang iyong kalusugan',
      currentWeather: 'Kasalukuyang Panahon',
      currentWeatherDesc: 'Live na kondisyon ng panahon at forecast',
      disasterAlerts: 'Mga Babala sa Sakuna',
      disasterAlertsDesc: 'Real-time na babala sa panahon at kalidad ng hangin sa iyong lugar',
      checkAlerts: 'Suriin ang mga Babala Ngayon',
      checking: 'Sinusuri...',
      allClear: 'Walang Panganib',
      allClearDesc: 'Walang aktibong babala sa panahon o kalidad ng hangin sa iyong lugar.',
      noPSI: 'Walang datos sa PSI',
      noWeather: 'Walang datos sa panahon',
      noAlerts: 'Walang aktibong babala — ligtas ang iyong lugar.',
      error: 'Hindi makuha ang mga babala. Suriin ang iyong koneksyon sa internet.',
    },

    // Resources Screen
    resources: {
      title: 'Mga Mapagkukunan',
      subtitle: 'Hanapin ang mga serbisyong pang-emergency at shelter malapit sa iyo',
      filterAll: 'Lahat',
      filterShelters: 'Shelter',
      filterEvacuation: 'Ebakwasyon',
      filterHospitals: 'Ospital',
      filterFire: 'Bumbero',
      filterPolice: 'Pulis',
      resourceFound: 'mapagkukunan ang nahanap',
      resourcesFound: 'mapagkukunan ang nahanap',
      noResources: 'Walang nahanap na mapagkukunan',
      noResourcesDesc: 'Subukan ang ibang kategorya',
      infoTip: 'Pindutin ang "Tawag" para tumawag o "Direksyon" para mag-navigate gamit ang maps app.',
    },

    // Missions Screen
    missions: {
      title: 'Misyon at Badge',
      level: 'Antas',
      points: 'puntos',
      missionsLabel: 'misyon',
      badgesLabel: 'badge',
      yourBadges: 'Mga Badge Mo',
      availableMissions: 'Mga Available na Misyon',
      question: 'Tanong',
      of: 'sa',
      greatJob: 'Mahusay!',
      keepLearning: 'Patuloy na Matuto!',
      score: 'Iskor',
      completeMission: 'Tapusin ang Misyon',
      tryAgain: 'Subukan Muli',
      missionComplete: '🎉 Natapos ang Misyon!',
      youEarned: 'Nakakuha ka ng',
      pointsLabel: 'puntos!',
      badgeUnlocked: 'Na-unlock ang Badge',
      missionFailed: 'Hindi Naipasa ang Misyon',
      needMore: 'Kailangan mo ng hindi bababa sa',
      correctAnswers: 'tamang sagot para makapasa. Subukan muli!',
      retry: 'Ulitin',
    },

    // Auth
    auth: {
      signIn: 'Mag-sign In',
      signUp: 'Mag-sign Up',
      guestMode: 'Guest Mode',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Nakalimutan ang Password?',
      noAccount: 'Wala pang account?',
      hasAccount: 'Mayroon ka nang account?',
    },

    // Severity Guide
    severityGuide: {
      title: 'Pag-unawa sa Mga Antas ng Babala',
      subtitle: 'Alamin ang kahulugan ng bawat severity level',
      levels: {
        critical: {
          title: 'Kritikal',
          description: 'Nakamamatay na sitwasyon. Kailangang lumikas o kumilos kaagad. Inaasahang malaking pinsala.',
        },
        high: {
          title: 'Mataas na Panganib',
          description: 'Seryosong banta sa kaligtasan. Maghanda na lumikas. Posibleng malaking pinsala.',
        },
        medium: {
          title: 'Katamtamang Panganib',
          description: 'Katamtamang banta. Makinig sa mga update. Ihanda ang emergency supplies.',
        },
        low: {
          title: 'Paalala',
          description: 'Mababang antas ng monitoring. Manatiling alerto. Suriin ang mga plano sa emergency.',
        },
      },
      gotIt: 'Naintindihan',
      dontShowAgain: 'Huwag nang ipakita muli',
    },

    // Settings
    settings: {
      language: 'Wika',
      english: 'English',
      tagalog: 'Tagalog',
    },
  },
};

class LocalizationService {
  private i18n: I18n;

  constructor() {
    this.i18n = new I18n(translations);
    this.i18n.enableFallback = true;
    this.i18n.defaultLocale = 'en';
  }

  async init() {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage) {
      this.i18n.locale = savedLanguage;
    } else {
      this.i18n.locale = 'en';
    }
  }

  t(key: string, options?: any): string {
    return this.i18n.t(key, options);
  }

  async setLanguage(locale: 'en' | 'tl') {
    this.i18n.locale = locale;
    await AsyncStorage.setItem(LANGUAGE_KEY, locale);
  }

  getLanguage(): 'en' | 'tl' {
    return this.i18n.locale as 'en' | 'tl';
  }

  getAvailableLanguages() {
    return [
      { code: 'en', label: 'English' },
      { code: 'tl', label: 'Tagalog' },
    ];
  }
}

export const localizationService = new LocalizationService();
