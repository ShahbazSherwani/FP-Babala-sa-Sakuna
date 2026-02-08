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
      map: 'Hazard Map',
      checklist: 'Checklist',
      report: 'Report',
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
      map: 'Mapa',
      checklist: 'Checklist',
      report: 'Ulat',
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
