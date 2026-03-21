import { Alert } from '../types';

export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    title: 'Typhoon Aghon - Signal No. 4',
    description:
      'Super Typhoon Aghon has intensified with sustained winds of 185 kph and gustiness of up to 230 kph. The typhoon is moving west-northwest at 20 kph towards the Bicol Region. Heavy rainfall, destructive winds, and storm surge of up to 3 meters are expected in coastal areas.',
    category: 'typhoon',
    severity: 'critical',
    affectedRegions: [
      'Bicol Region',
      'Eastern Visayas',
      'Calabarzon',
      'Metro Manila',
      'Central Luzon',
    ],
    timestamp: '2026-02-08T06:00:00Z',
    updatedAt: '2026-02-08T14:30:00Z',
    recommendedActions: [
      'Evacuate immediately if in coastal or low-lying areas',
      'Secure all loose outdoor items',
      'Stock up on food, water, and medicine for at least 3 days',
      'Charge all communication devices',
      'Monitor official PAGASA updates regularly',
      'Do not attempt to cross flooded areas',
    ],
    coordinates: { latitude: 13.4, longitude: 123.95 },
    radiusKm: 250,
    isActive: true,
  },
  {
    id: 'alert-002',
    title: 'Flooding in Cagayan Valley',
    description:
      'Severe flooding reported across Cagayan Valley following continuous heavy rainfall over the past 48 hours. Cagayan River has risen above critical level. Multiple barangays in Tuguegarao and Aparri are submerged. Rescue operations are ongoing.',
    category: 'flood',
    severity: 'critical',
    affectedRegions: [
      'Cagayan Valley',
      'Tuguegarao City',
      'Aparri',
      'Isabela Province',
    ],
    timestamp: '2026-02-07T18:00:00Z',
    updatedAt: '2026-02-08T12:00:00Z',
    recommendedActions: [
      'Move to higher ground immediately',
      'Avoid wading or swimming in floodwaters',
      'Watch for downed power lines',
      'Contact local DRRMO for rescue assistance',
      'Boil or treat all drinking water',
    ],
    coordinates: { latitude: 17.6132, longitude: 121.7270 },
    radiusKm: 80,
    isActive: true,
  },
  {
    id: 'alert-003',
    title: 'Earthquake - Magnitude 5.8 Mindanao',
    description:
      'A magnitude 5.8 earthquake struck 15 km southeast of Davao City at a depth of 30 km. Aftershocks are expected within the next 24 hours. Structural damage reported in several barangays. No tsunami threat issued.',
    category: 'earthquake',
    severity: 'high',
    affectedRegions: [
      'Davao City',
      'Davao del Sur',
      'Davao Oriental',
      'Compostela Valley',
    ],
    timestamp: '2026-02-08T09:15:00Z',
    updatedAt: '2026-02-08T10:45:00Z',
    recommendedActions: [
      'Stay away from damaged buildings',
      'Check for gas leaks before re-entering structures',
      'Prepare for aftershocks',
      'Report structural damage to local authorities',
      'Keep emergency supplies accessible',
    ],
    coordinates: { latitude: 7.0707, longitude: 125.6087 },
    radiusKm: 60,
    isActive: true,
  },
  {
    id: 'alert-004',
    title: 'Mayon Volcano - Alert Level 3',
    description:
      'PHIVOLCS has raised Mayon Volcano to Alert Level 3 (increased tendency towards hazardous eruption). Increased sulfur dioxide emissions and lava dome growth observed. A 6-kilometer danger zone has been established around the summit.',
    category: 'volcano',
    severity: 'high',
    affectedRegions: [
      'Albay Province',
      'Legazpi City',
      'Daraga',
      'Camalig',
      'Guinobatan',
    ],
    timestamp: '2026-02-06T08:00:00Z',
    updatedAt: '2026-02-08T06:00:00Z',
    recommendedActions: [
      'Evacuate if within the 6-km permanent danger zone',
      'Prepare face masks for ashfall protection',
      'Stay indoors during ashfall events',
      'Monitor PHIVOLCS bulletins regularly',
      'Prepare evacuation bags with essentials',
    ],
    coordinates: { latitude: 13.2575, longitude: 123.6856 },
    radiusKm: 40,
    isActive: true,
  },
  {
    id: 'alert-005',
    title: 'Flood Advisory - NCR Metro Manila',
    description:
      'PAGASA issued a flood advisory for Metro Manila due to continued monsoon rains. Low-lying areas in Marikina, Pasig, and Taguig are at risk. River levels are approaching alarm stage.',
    category: 'flood',
    severity: 'medium',
    affectedRegions: [
      'Metro Manila',
      'Marikina City',
      'Pasig City',
      'Taguig City',
    ],
    timestamp: '2026-02-08T07:00:00Z',
    updatedAt: '2026-02-08T11:00:00Z',
    recommendedActions: [
      'Avoid unnecessary travel',
      'Prepare sandbags if in flood-prone areas',
      'Monitor river level updates from PAGASA',
      'Keep important documents in waterproof bags',
    ],
    coordinates: { latitude: 14.5995, longitude: 121.0244 },
    radiusKm: 30,
    isActive: true,
  },
  {
    id: 'alert-006',
    title: 'Tropical Depression Approaching Visayas',
    description:
      'A tropical depression has been detected 800 km east of the Visayas and is expected to intensify into a tropical storm within 24 hours. Areas in the path should begin preparations.',
    category: 'typhoon',
    severity: 'medium',
    affectedRegions: [
      'Eastern Visayas',
      'Central Visayas',
      'Western Visayas',
    ],
    timestamp: '2026-02-08T03:00:00Z',
    updatedAt: '2026-02-08T09:00:00Z',
    recommendedActions: [
      'Monitor PAGASA weather bulletins',
      'Secure outdoor furniture and equipment',
      'Stock emergency supplies',
      'Review family evacuation plan',
    ],
    coordinates: { latitude: 11.0, longitude: 127.0 },
    radiusKm: 200,
    isActive: true,
  },
  {
    id: 'alert-007',
    title: 'Earthquake Advisory - Batangas',
    description:
      'A series of minor earthquakes (M2.5-3.2) detected near Taal Volcano region. PHIVOLCS is monitoring for any unusual volcanic activity. No immediate danger but residents should remain vigilant.',
    category: 'earthquake',
    severity: 'low',
    affectedRegions: [
      'Batangas Province',
      'Taal',
      'Lemery',
      'Agoncillo',
    ],
    timestamp: '2026-02-08T05:30:00Z',
    updatedAt: '2026-02-08T08:00:00Z',
    recommendedActions: [
      'Stay informed via PHIVOLCS updates',
      'Review earthquake safety procedures',
      'Secure heavy furniture to walls',
      'Identify safe spots in your home (under sturdy tables)',
    ],
    coordinates: { latitude: 13.9941, longitude: 121.0027 },
    radiusKm: 25,
    isActive: true,
  },
  {
    id: 'alert-008',
    title: 'Taal Volcano - Alert Level 1',
    description:
      'Taal Volcano remains at Alert Level 1 (low-level unrest). Volcanic earthquakes and slight ground deformation detected. Entry into the Taal Volcano Island is prohibited.',
    category: 'volcano',
    severity: 'low',
    affectedRegions: [
      'Batangas Province',
      'Cavite Province',
      'Laguna Province',
    ],
    timestamp: '2026-02-05T12:00:00Z',
    updatedAt: '2026-02-08T06:00:00Z',
    recommendedActions: [
      'Do not enter Taal Volcano Island',
      'Follow PHIVOLCS advisories',
      'Prepare protective masks in case of ashfall',
      'Know your evacuation routes',
    ],
    coordinates: { latitude: 14.0113, longitude: 120.9980 },
    radiusKm: 15,
    isActive: true,
  },
];

// Tagalog translations for alert content (keyed by alert ID)
export const alertTranslations: Record<string, { title: string; description: string; recommendedActions: string[] }> = {
  'alert-001': {
    title: 'Bagyong Aghon - Senyas Bilang 4',
    description:
      'Tumindi ang Super Typhoon Aghon na may tuloy-tuloy na hangin na 185 kph at bugsong hanggang 230 kph. Ang bagyo ay kumikilos pa-kanluran-hilagang-kanluran sa bilis na 20 kph patungo sa Rehiyon ng Bicol. Inaasahan ang malakas na pag-ulan, mapanirang hangin, at storm surge na hanggang 3 metro sa mga baybaying lugar.',
    recommendedActions: [
      'Lumikas agad kung nasa baybay-dagat o mababang lugar',
      'Itali o itago ang lahat ng mga bagay sa labas ng bahay',
      'Mag-imbak ng pagkain, tubig, at gamot na sapat para sa 3 araw',
      'I-charge ang lahat ng mga aparatong pangkomunikasyon',
      'Regular na subaybayan ang opisyal na mga update ng PAGASA',
      'Huwag subukang tumawid sa mga baha',
    ],
  },
  'alert-002': {
    title: 'Pagbaha sa Lambak ng Cagayan',
    description:
      'Matinding pagbaha ang naiulat sa buong Lambak ng Cagayan dahil sa tuloy-tuloy na malakas na pag-ulan sa nakalipas na 48 oras. Lumampas na sa kritikal na antas ang Ilog Cagayan. Maraming barangay sa Tuguegarao at Aparri ang lubog sa baha. Patuloy ang mga operasyon ng pagliligtas.',
    recommendedActions: [
      'Pumunta agad sa mataas na lugar',
      'Iwasang maglakad o lumangoy sa baha',
      'Mag-ingat sa mga nakalawit na linya ng kuryente',
      'Makipag-ugnayan sa lokal na DRRMO para sa pagliligtas',
      'Pakuluan o i-treat ang lahat ng inuming tubig',
    ],
  },
  'alert-003': {
    title: 'Lindol - Magnitude 5.8 sa Mindanao',
    description:
      'Isang lindol na magnitude 5.8 ang tumama 15 km timog-silangan ng Lungsod ng Davao sa lalim na 30 km. Inaasahan ang mga aftershock sa susunod na 24 oras. May naiulat na pinsala sa mga istruktura sa ilang barangay. Walang banta ng tsunami.',
    recommendedActions: [
      'Lumayo sa mga nasirang gusali',
      'Suriin kung may gas leak bago bumalik sa mga istruktura',
      'Maghanda para sa mga aftershock',
      'Iulat ang pinsala sa mga istruktura sa lokal na awtoridad',
      'Panatilihing madaling makuha ang mga emergency supplies',
    ],
  },
  'alert-004': {
    title: 'Bulkang Mayon - Alert Level 3',
    description:
      'Itinaas ng PHIVOLCS ang Bulkang Mayon sa Alert Level 3 (tumataas na posibilidad ng mapanganib na pagsabog). Nadagdagan ang emisyon ng sulfur dioxide at paglaki ng lava dome. Itinatag ang 6 na kilometrong danger zone sa paligid ng tuktok.',
    recommendedActions: [
      'Lumikas kung nasa loob ng 6-km permanent danger zone',
      'Maghanda ng face mask para sa proteksyon laban sa ashfall',
      'Manatili sa loob ng bahay habang may ashfall',
      'Regular na subaybayan ang mga bulletin ng PHIVOLCS',
      'Maghanda ng evacuation bag na may mga pangunahing pangangailangan',
    ],
  },
  'alert-005': {
    title: 'Abiso sa Pagbaha - NCR Metro Manila',
    description:
      'Naglabas ang PAGASA ng abiso sa pagbaha para sa Metro Manila dahil sa tuloy-tuloy na ulan ng habagat. Ang mga mababang lugar sa Marikina, Pasig, at Taguig ay nasa panganib. Papalapit na sa alarm stage ang antas ng mga ilog.',
    recommendedActions: [
      'Iwasan ang hindi kinakailangang paglalakbay',
      'Maghanda ng mga sandbag kung nasa flood-prone area',
      'Subaybayan ang mga update ng antas ng ilog mula sa PAGASA',
      'Itago ang mahahalagang dokumento sa waterproof na bag',
    ],
  },
  'alert-006': {
    title: 'Tropical Depression Papalapit sa Visayas',
    description:
      'May natuklasang tropical depression na 800 km silangan ng Visayas at inaasahang titindi bilang tropical storm sa loob ng 24 oras. Ang mga lugar sa dadaanan ay dapat nang magsimulang maghanda.',
    recommendedActions: [
      'Subaybayan ang mga weather bulletin ng PAGASA',
      'Itali ang mga kasangkapan at gamit sa labas ng bahay',
      'Mag-imbak ng mga emergency supplies',
      'Suriin ang plano ng pamilya para sa pag-likas',
    ],
  },
  'alert-007': {
    title: 'Abiso sa Lindol - Batangas',
    description:
      'Serye ng maliliit na lindol (M2.5-3.2) ang nadetect malapit sa rehiyon ng Bulkang Taal. Sinusubaybayan ng PHIVOLCS ang anumang hindi pangkaraniwang aktibidad ng bulkan. Walang agarang panganib ngunit dapat manatiling alerto ang mga residente.',
    recommendedActions: [
      'Manatiling may kaalaman sa pamamagitan ng mga update ng PHIVOLCS',
      'Suriin ang mga pamamaraan sa kaligtasan sa lindol',
      'I-secure ang mabibigat na kasangkapan sa mga pader',
      'Alamin ang mga ligtas na lugar sa inyong tahanan (ilalim ng matibay na mesa)',
    ],
  },
  'alert-008': {
    title: 'Bulkang Taal - Alert Level 1',
    description:
      'Nananatili ang Bulkang Taal sa Alert Level 1 (mababang antas ng kaguluhan). May nadetect na mga volcanic earthquake at bahagyang pagbabago sa lupa. Ipinagbabawal ang pagpasok sa Taal Volcano Island.',
    recommendedActions: [
      'Huwag pumasok sa Taal Volcano Island',
      'Sundin ang mga abiso ng PHIVOLCS',
      'Maghanda ng mga protective mask sakaling may ashfall',
      'Alamin ang inyong mga evacuation route',
    ],
  },
};
