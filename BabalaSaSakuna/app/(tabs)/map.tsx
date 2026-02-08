import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert as AlertType, SEVERITY_COLORS, CATEGORY_ICONS, SeverityLevel } from '../../src/types';
import { alertService } from '../../src/services';
import SeverityBadge from '../../src/components/SeverityBadge';

const { width } = Dimensions.get('window');

// Try to load react-native-maps; it requires a dev build with native modules.
// In Expo Go it will fail, so we gracefully fall back to a list-based view.
let MapView: any = null;
let Marker: any = null;
let Circle: any = null;
let PROVIDER_GOOGLE: any = null;
let mapsAvailable = false;

try {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
  Circle = maps.Circle;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
  mapsAvailable = true;
} catch {
  mapsAvailable = false;
}

const PHILIPPINES_CENTER = {
  latitude: 12.8797,
  longitude: 121.774,
  latitudeDelta: 10,
  longitudeDelta: 10,
};

export default function HazardMapScreen() {
  const mapRef = React.useRef<any>(null);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    setAlerts(alertService.getAllAlerts());
    requestLocation();
  }, []);

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    } catch (error) {
      console.log('Location permission not granted');
    }
  };

  const handleMarkerPress = (alert: AlertType) => {
    setSelectedAlert(alert);
    mapRef.current?.animateToRegion(
      {
        latitude: alert.coordinates.latitude,
        longitude: alert.coordinates.longitude,
        latitudeDelta: 2,
        longitudeDelta: 2,
      },
      500
    );
  };

  const goToMyLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...userLocation,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        },
        500
      );
    }
  };

  const getMarkerColor = (severity: string): string => {
    return SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS] || '#2563EB';
  };

  // ---- Fallback list-based hazard zone view (for Expo Go) ----
  const renderHazardZoneCard = ({ item }: { item: AlertType }) => {
    const color = SEVERITY_COLORS[item.severity];
    const isSelected = selectedAlert?.id === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.zoneCard,
          { borderLeftColor: color },
          isSelected && styles.zoneCardSelected,
        ]}
        onPress={() => setSelectedAlert(isSelected ? null : item)}
        activeOpacity={0.7}
      >
        <View style={styles.zoneCardHeader}>
          <View style={[styles.zoneIcon, { backgroundColor: color + '18' }]}>
            <MaterialCommunityIcons
              name={CATEGORY_ICONS[item.category] as any}
              size={22}
              color={color}
            />
          </View>
          <View style={styles.zoneInfo}>
            <Text style={styles.zoneTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.zoneCoords}>
              {item.coordinates.latitude.toFixed(2)}°N, {item.coordinates.longitude.toFixed(2)}°E
            </Text>
          </View>
          <SeverityBadge severity={item.severity} size="small" />
        </View>
        <View style={styles.zoneDetails}>
          <View style={styles.zoneDetailItem}>
            <MaterialCommunityIcons name="radius-outline" size={14} color="#6B7280" />
            <Text style={styles.zoneDetailText}>{item.radiusKm} km radius</Text>
          </View>
          <View style={styles.zoneDetailItem}>
            <MaterialCommunityIcons name="map-marker" size={14} color="#6B7280" />
            <Text style={styles.zoneDetailText} numberOfLines={1}>
              {item.affectedRegions.slice(0, 2).join(', ')}
              {item.affectedRegions.length > 2 && ` +${item.affectedRegions.length - 2}`}
            </Text>
          </View>
        </View>
        {isSelected && (
          <Text style={styles.zoneDescription} numberOfLines={3}>
            {item.description}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  // ---- Legend component (shared) ----
  const renderLegend = (floating: boolean) => (
    <View style={floating ? styles.legendFloat : styles.legendInline}>
      <Text style={styles.legendTitle}>Risk Level</Text>
      <View style={floating ? styles.legendItemsCol : styles.legendItemsRow}>
        {(['critical', 'high', 'medium', 'low'] as const).map((level) => (
          <View key={level} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: SEVERITY_COLORS[level] }]} />
            <Text style={styles.legendText}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hazard Map</Text>
        <Text style={styles.headerSubtitle}>
          {alerts.length} active hazard zones
        </Text>
      </View>

      {mapsAvailable ? (
        /* ---- Native Map View (dev build) ---- */
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={PHILIPPINES_CENTER}
            showsUserLocation={true}
            showsMyLocationButton={false}
            provider={PROVIDER_GOOGLE}
          >
            {alerts.map((alert) => (
              <React.Fragment key={alert.id}>
                <Marker
                  coordinate={alert.coordinates}
                  onPress={() => handleMarkerPress(alert)}
                  pinColor={getMarkerColor(alert.severity)}
                  title={alert.title}
                />
                <Circle
                  center={alert.coordinates}
                  radius={alert.radiusKm * 1000}
                  fillColor={getMarkerColor(alert.severity) + '20'}
                  strokeColor={getMarkerColor(alert.severity) + '60'}
                  strokeWidth={2}
                />
              </React.Fragment>
            ))}
          </MapView>

          {userLocation && (
            <TouchableOpacity style={styles.myLocationBtn} onPress={goToMyLocation}>
              <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#1E3A5F" />
            </TouchableOpacity>
          )}

          {renderLegend(true)}

          {selectedAlert && (
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <MaterialCommunityIcons
                  name={CATEGORY_ICONS[selectedAlert.category] as any}
                  size={28}
                  color={SEVERITY_COLORS[selectedAlert.severity]}
                />
                <View style={styles.sheetTitleContainer}>
                  <Text style={styles.sheetTitle} numberOfLines={1}>
                    {selectedAlert.title}
                  </Text>
                  <SeverityBadge severity={selectedAlert.severity} size="small" />
                </View>
              </View>
              <Text style={styles.sheetDescription} numberOfLines={3}>
                {selectedAlert.description}
              </Text>
              <TouchableOpacity
                style={styles.closeSheetBtn}
                onPress={() => setSelectedAlert(null)}
              >
                <Text style={styles.closeSheetText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        /* ---- Fallback List View (Expo Go) ---- */
        <View style={styles.fallbackContainer}>
          <View style={styles.fallbackBanner}>
            <MaterialCommunityIcons name="map-marker-radius" size={20} color="#1E3A5F" />
            <Text style={styles.fallbackBannerText}>
              Hazard zone list view — native map requires a development build
            </Text>
          </View>
          {renderLegend(false)}
          <FlatList
            data={alerts}
            keyExtractor={(item) => item.id}
            renderItem={renderHazardZoneCard}
            contentContainerStyle={styles.zoneListContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#93C5FD',
    marginTop: 2,
  },

  // ---- Native map styles ----
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  myLocationBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sheetTitleContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  sheetDescription: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 19,
    marginBottom: 8,
  },
  closeSheetBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeSheetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },

  // ---- Legend (shared) ----
  legendFloat: {
    position: 'absolute',
    bottom: 16,
    left: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  legendInline: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  legendItemsCol: {
    flexDirection: 'column',
  },
  legendItemsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: '#4B5563',
  },

  // ---- Fallback list view styles ----
  fallbackContainer: {
    flex: 1,
  },
  fallbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  fallbackBannerText: {
    fontSize: 12,
    color: '#1E3A5F',
    flex: 1,
  },
  zoneListContent: {
    paddingVertical: 8,
    paddingBottom: 20,
  },
  zoneCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  zoneCardSelected: {
    backgroundColor: '#F8FAFC',
    elevation: 3,
  },
  zoneCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoneIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  zoneInfo: {
    flex: 1,
    marginRight: 8,
  },
  zoneTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  zoneCoords: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  zoneDetails: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  zoneDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  zoneDetailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  zoneDescription: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
