import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  SEVERITY_COLORS,
  CATEGORY_ICONS,
} from '../../src/types';
import { alertService } from '../../src/services';
import SeverityBadge from '../../src/components/SeverityBadge';

export default function AlertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const alert = alertService.getAlertById(id);

  if (!alert) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Alert not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const borderColor = SEVERITY_COLORS[alert.severity];
  const iconName = CATEGORY_ICONS[alert.category];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: borderColor }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons
              name={iconName as any}
              size={32}
              color="#FFFFFF"
            />
          </View>
          <Text style={styles.headerTitle}>{alert.title}</Text>
          <SeverityBadge severity={alert.severity} />
          <Text style={styles.headerTime}>
            Updated: {formatDate(alert.updatedAt)}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{alert.description}</Text>
        </View>

        {/* Affected Regions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Affected Regions</Text>
          {alert.affectedRegions.map((region, index) => (
            <View key={index} style={styles.regionItem}>
              <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color={borderColor}
              />
              <Text style={styles.regionText}>{region}</Text>
            </View>
          ))}
        </View>

        {/* Timing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.timeRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color="#6B7280"
            />
            <Text style={styles.timeLabel}>Issued:</Text>
            <Text style={styles.timeValue}>{formatDate(alert.timestamp)}</Text>
          </View>
          <View style={styles.timeRow}>
            <MaterialCommunityIcons
              name="update"
              size={16}
              color="#6B7280"
            />
            <Text style={styles.timeLabel}>Updated:</Text>
            <Text style={styles.timeValue}>
              {formatDate(alert.updatedAt)}
            </Text>
          </View>
        </View>

        {/* Recommended Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Actions</Text>
          {alert.recommendedActions.map((action, index) => (
            <View key={index} style={styles.actionItem}>
              <View style={[styles.actionNumber, { backgroundColor: borderColor + '20' }]}>
                <Text style={[styles.actionNumberText, { color: borderColor }]}>
                  {index + 1}
                </Text>
              </View>
              <Text style={styles.actionText}>{action}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#1E3A5F' }]}
            onPress={() => router.push('/map' as any)}
          >
            <MaterialCommunityIcons
              name="map-marker-radius"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.actionBtnText}>View on Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#16A34A' }]}
            onPress={() => router.push('/checklist' as any)}
          >
            <MaterialCommunityIcons
              name="clipboard-check"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.actionBtnText}>Open Checklist</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 28,
  },
  headerTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  regionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  regionText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 6,
  },
  timeLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  timeValue: {
    fontSize: 13,
    color: '#374151',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  actionNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  actionNumberText: {
    fontSize: 12,
    fontWeight: '800',
  },
  actionText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 16,
  },
  backLink: {
    fontSize: 16,
    color: '#1E3A5F',
    fontWeight: '600',
  },
});
