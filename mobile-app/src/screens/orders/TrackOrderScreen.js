import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, theme } from '../../theme';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { SUPPORT_PHONE, SUPPORT_WHATSAPP } from '../../constants/config';

export const TrackOrderScreen = ({ navigation, route }) => {
  const initialRef = route.params?.orderRef || 'ASAP-982143';
  const [orderQuery, setOrderQuery] = useState(initialRef);
  const [trackingResult, setTrackingResult] = useState({
    orderId: initialRef,
    status: 'In Pre-Flight Quality Check',
    stage: 2,
    carrier: 'BlueDart Air Express',
    trackingNumber: 'BLR-982143-AIR',
    location: 'Bangalore Production Hub',
    estimatedDelivery: '2-3 Business Days',
  });

  const handleTrack = () => {
    const q = orderQuery.trim().toUpperCase() || 'ASAP-982143';
    setTrackingResult({
      orderId: q,
      status: 'Printing & Quality Inspection',
      stage: 3,
      carrier: 'BlueDart Air Express',
      trackingNumber: `BD-${Math.floor(100000 + Math.random() * 900000)}`,
      location: 'Central Digital Print Facility',
      estimatedDelivery: '2 Business Days',
    });
  };

  return (
    <View style={styles.screen}>
      <Header title="Live Order Tracker" showBack navigation={navigation} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Input Box */}
        <View style={[styles.searchCard, theme.shadows.sm]}>
          <Text style={styles.searchTitle}>Track Your Visiting Card Order</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="e.g. ASAP-982143"
              value={orderQuery}
              onChangeText={setOrderQuery}
              autoCapitalize="characters"
            />
            <Button
              title="Track"
              variant="primary"
              size="sm"
              onPress={handleTrack}
              style={styles.trackBtn}
            />
          </View>
        </View>

        {/* Tracking Details Card */}
        {trackingResult && (
          <View style={[styles.statusCard, theme.shadows.md]}>
            <View style={styles.statusHeader}>
              <View>
                <Text style={styles.orderNumber}>{trackingResult.orderId}</Text>
                <Text style={styles.currentStatus}>{trackingResult.status}</Text>
              </View>
              <View style={styles.carrierBadge}>
                <Ionicons name="airplane" size={14} color={colors.primary} />
                <Text style={styles.carrierText}>Air Express</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaCol}>
                <Text style={styles.metaKey}>Carrier Hub</Text>
                <Text style={styles.metaVal}>{trackingResult.location}</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaKey}>Estimated ETA</Text>
                <Text style={[styles.metaVal, { color: colors.success }]}>
                  {trackingResult.estimatedDelivery}
                </Text>
              </View>
            </View>

            {/* Stages Timeline */}
            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <View style={styles.dotDone}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
                <View style={styles.timelineTextWrap}>
                  <Text style={styles.timelineTitle}>1. Order Placed & Logged</Text>
                  <Text style={styles.timelineDesc}>Verified custom card details</Text>
                </View>
              </View>

              <View style={styles.timelineLineDone} />

              <View style={styles.timelineItem}>
                <View style={trackingResult.stage >= 2 ? styles.dotDone : styles.dotPending}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
                <View style={styles.timelineTextWrap}>
                  <Text style={styles.timelineTitle}>2. Pre-Flight Bleed & Color Check</Text>
                  <Text style={styles.timelineDesc}>Precision HD verification passed</Text>
                </View>
              </View>

              <View style={trackingResult.stage >= 3 ? styles.timelineLineDone : styles.timelineLinePending} />

              <View style={styles.timelineItem}>
                <View style={trackingResult.stage >= 3 ? styles.dotDone : styles.dotPending}>
                  {trackingResult.stage >= 3 ? (
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  ) : (
                    <View style={styles.dotInner} />
                  )}
                </View>
                <View style={styles.timelineTextWrap}>
                  <Text style={styles.timelineTitle}>3. HD Digital Print & Curing</Text>
                  <Text style={styles.timelineDesc}>350 GSM cardstock cut and boxed</Text>
                </View>
              </View>

              <View style={trackingResult.stage >= 4 ? styles.timelineLineDone : styles.timelineLinePending} />

              <View style={styles.timelineItem}>
                <View style={trackingResult.stage >= 4 ? styles.dotDone : styles.dotPending}>
                  <Ionicons name="airplane-outline" size={12} color={colors.textMuted} />
                </View>
                <View style={styles.timelineTextWrap}>
                  <Text style={styles.timelineTitle}>4. Out for Delivery</Text>
                  <Text style={styles.timelineDesc}>Dispatched via Priority Air</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Support Card */}
        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Need Help With Your Order?</Text>
          <Text style={styles.supportDesc}>
            Our printing support team is active Mon–Sat 9am–8pm.
          </Text>

          <View style={styles.supportBtnRow}>
            <TouchableOpacity
              style={styles.whatsappBtn}
              onPress={() => Linking.openURL(SUPPORT_WHATSAPP)}
            >
              <Ionicons name="logo-whatsapp" size={16} color="#ffffff" />
              <Text style={styles.whatsappBtnText}>WhatsApp Support</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => Linking.openURL(`tel:${SUPPORT_PHONE.replace(/\s+/g, '')}`)}
            >
              <Ionicons name="call-outline" size={16} color={colors.primary} />
              <Text style={styles.callBtnText}>Call Team</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  searchCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 40,
    fontSize: typography.fontSizes.xs + 1,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trackBtn: {
    minWidth: 80,
  },
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderNumber: {
    fontSize: typography.fontSizes.md + 1,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.primary,
  },
  currentStatus: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.secondaryDark,
    marginTop: 2,
  },
  carrierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryLight,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.pill,
    gap: 4,
  },
  carrierText: {
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.lg,
  },
  metaCol: {
    flex: 1,
  },
  metaKey: {
    fontSize: 10,
    color: colors.textMuted,
  },
  metaVal: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginTop: 1,
  },
  timeline: {
    paddingLeft: spacing.xs,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dotDone: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotPending: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  timelineTextWrap: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  timelineDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  timelineLineDone: {
    width: 2,
    height: 20,
    backgroundColor: colors.success,
    marginLeft: 10,
    marginVertical: 2,
  },
  timelineLinePending: {
    width: 2,
    height: 20,
    backgroundColor: colors.border,
    marginLeft: 10,
    marginVertical: 2,
  },
  supportCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  supportTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  supportDesc: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  supportBtnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  whatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  whatsappBtnText: {
    color: '#ffffff',
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryLight,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  callBtnText: {
    color: colors.primary,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
});
