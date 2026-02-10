# Testing Instructions for New Features

## Quick Test Suite

### 1. Weather & PSI Screen
```bash
# Start the app
cd BabalaSaSakuna
npm start
```

**Test Steps:**
1. Navigate to "Weather" tab (cloud icon)
2. Verify PSI indicators show colored cards
3. Verify weather cards display temperature, humidity, rainfall, wind
4. Pull down to refresh
5. Check that data updates timestamp

**Expected Results:**
- 8 PSI cards with different colors (green to dark red)
- 7 weather cards with weather icons
- Smooth scrolling
- No crashes

---

### 2. Resources Hub
**Test Steps:**
1. Navigate to "Resources" tab (multiple markers icon)
2. Tap "All" filter chip - should show 10 resources
3. Tap "Shelters" filter - should show 3 resources
4. Tap "Hospitals" filter - should show 2 resources
5. Tap a resource card
6. Verify "Call" and "Directions" buttons appear
7. Tap "Directions" - should open maps app

**Expected Results:**
- Filtering works correctly
- Resource count updates
- Icons match resource types
- 24/7 badge shows for fire/police stations
- Capacity shows for shelters/evacuation centers

---

### 3. Missions & Badges
**Test Steps:**
1. Navigate to "Missions" tab (trophy icon)
2. Verify 5 badge placeholders at top (grayed out)
3. Verify progress bar shows "Level 1, 0 points"
4. Tap "Start Mission" on "Typhoon Preparedness Basics"
5. Answer all 4 questions
6. Verify results screen shows score
7. If passed (3+/4), tap "Complete Mission"
8. Verify success alert shows points earned
9. Verify badge "Storm Ready" is now earned (colored)
10. Verify progress updated (50 points, Level 1, 1 mission, 1 badge)

**Expected Results:**
- Quiz modal opens
- Questions display with A/B/C/D options
- Results show correct/incorrect with explanations
- Badge unlocks and shows checkmark
- Progress persists after closing app

---

## Automated Validation

### Run TypeScript Check
```bash
cd BabalaSaSakuna
npx tsc --noEmit
```
Expected: No errors

### Run Build
```bash
npm run build
```
Expected: Successful bundle

### Check for Errors
```bash
# In VS Code, open Problems panel (Ctrl+Shift+M)
```
Expected: 0 errors

---

## Smoke Test Checklist

- [ ] App launches without crash
- [ ] All 7 tabs visible and navigable
- [ ] Weather tab loads PSI and weather data
- [ ] Resources tab shows 10 resources
- [ ] Resource filtering works
- [ ] Mission tab shows badges and missions
- [ ] Quiz can be started and completed
- [ ] Badge unlocks after completing mission
- [ ] Progress persists (close and reopen app)
- [ ] No console errors related to new features
- [ ] TypeScript compiles with 0 errors
- [ ] Android build succeeds

---

## Known Limitations (Mock Data)

1. **Weather/PSI**: Static mock data, no real API integration
2. **Resources**: Manila metro area only, fictional phone numbers
3. **Missions**: Limited to 5 missions, need more content
4. **Distance**: Not calculated (requires user location permission)
5. **Translations**: English only for new features (need Tagalog)

---

## Performance Notes

- Weather/PSI service caches data for 30 minutes
- Mission progress stored in AsyncStorage (offline-first)
- Resource service uses Haversine formula for distance (when location available)
- All mock data loaded synchronously (fast)

---

## Troubleshooting

### "Route missing required default export"
**Solution**: Metro cache issue. Run:
```bash
npx expo start -c
```

### Mission modal doesn't open
**Solution**: Check console for errors. Ensure missions.ts data is loaded.

### Resource icons not showing
**Solution**: Verify MaterialCommunityIcons include all icon names. Check RESOURCE_ICONS mapping.

### PSI colors wrong
**Solution**: Verify PSILevel matches PSI_COLORS keys. Check type definitions.

---

## Next Steps for Production

1. Integrate real APIs:
   - PAGASA for weather
   - DENR for air quality
   - Google Places for resources

2. Add translations:
   - Update LocalizationService with all new strings
   - Translate mission questions to Tagalog

3. Location services:
   - Request permissions
   - Show user location on map
   - Calculate actual distances

4. Enhanced features:
   - Weather push notifications
   - PSI threshold alerts
   - Mission leaderboards
   - Social badge sharing

5. Content expansion:
   - 10-15 more missions
   - More quiz questions
   - Additional resource categories
   - Historical PSI trends

---

**Test Date**: {{Today}}
**Tester**: {{Name}}
**Build**: Development
**Platform**: Android / iOS
