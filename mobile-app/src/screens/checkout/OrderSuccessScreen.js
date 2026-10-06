import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, theme } from '../../theme';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';

export const OrderSuccessScreen = ({ navigation, route }) => {
  const orderRef = route.params?.orderRef || 'ASAP-982143';
  const customerName = route.params?.customerName || 'Customer';
  const totalAmount = route.params?.totalAmount || 200.0;
  const deliverySpeed = route.params?.deliverySpeed || 'express';

  return (
    <View style={styles.screen}>
      <Header title="Order Confirmed" navigation={navigation} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Icon Badge */}
        <View style={styles.successCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark-circle" size={60} color={colors.success} />
          </View>

          <Text style={styles.successTitle}>Order Placed Successfully!</Text>
          <Text style={styles.successSubtitle}>
            Thank you {customerName}. Your customized visiting cards have entered pre-flight HD review.
          </Text>

          {/* Order Reference Box */}
          <View style={styles.orderRefBox}>
            <View style={styles.refRow}>
              <Text style={styles.refLabel}>Order Number:</Text>
              <Text style={styles.refVal}>{orderRef}</Text>
            </View>

            <View style={styles.refRow}>
              <Text style={styles.refLabel}>Total Paid:</Text>
              <Text style={styles.refVal}>₹{Number(totalAmount).toFixed(2)}</Text>
            </View>

            <View style={styles.refRow}>
              <Text style={styles.refLabel}>Estimated Dispatch:</Text>
              <Text style={[styles.refVal, { color: colors.success }]}>
                {deliverySpeed === 'express' ? 'Within 24 Hours' : 'Within 48 Hours'}
              </Text>
            </View>
          </View>
        </View>

        {/* Timeline Next Steps */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>Production Timetable</Text>

          <View style={styles.stepRow}>
            <View style={styles.stepDotActive}>
              <Ionicons name="checkmark" size={12} color={colors.textInverted} />
            </View>
            <View style={styles.stepTextWrap}>
              <Text style={styles.stepHeading}>1. Order Placed</Text>
              <Text style={styles.stepDesc}>Details securely logged in production database.</Text>
            </View>
          </View>

          <View style={styles.stepLine} />

          <View style={styles.stepRow}>
            <View style={styles.stepDotPending}>
              <Ionicons name="search" size={10} color={colors.primary} />
            </View>
            <View style={styles.stepTextWrap}>
              <Text style={styles.stepHeading}>2. Pre-Flight Bleed & Color Check</Text>
              <Text style={styles.stepDesc}>Precision inspection of typography, cutlines and resolution.</Text>
            </View>
          </View>

          <View style={styles.stepLine} />

          <View style={styles.stepRow}>
            <View style={styles.stepDotPending}>
              <Ionicons name="print" size={10} color={colors.primary} />
            </View>
            <View style={styles.stepTextWrap}>
              <Text style={styles.stepHeading}>3. HD Print & Precision Die-Cut</Text>
              <Text style={styles.stepDesc}>2400 DPI print run on 350 GSM cardstock with finish curing.</Text>
            </View>
          </View>

          <View style={styles.stepLine} />

          <View style={styles.stepRow}>
            <View style={styles.stepDotPending}>
              <Ionicons name="airplane" size={10} color={colors.primary} />
            </View>
            <View style={styles.stepTextWrap}>
              <Text style={styles.stepHeading}>4. Priority Air Dispatch</Text>
              <Text style={styles.stepDesc}>Express courier handover with live tracking notifications.</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsBox}>
          <Button
            title="Track Order Status"
            variant="primary"
            size="lg"
            onPress={() => navigation.navigate('OrderDetail', { orderId: orderRef })}
            icon={<Ionicons name="navigate-outline" size={18} color={colors.textInverted} />}
            style={styles.actionBtn}
          />

          <Button
            title="Continue Shopping"
            variant="outline"
            size="lg"
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}
            style={styles.actionBtn}
          />
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
  successCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    marginBottom: spacing.md,
  },
  successTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: typography.fontSizes.xs + 1,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  orderRefBox: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    width: '100%',
    marginTop: spacing.lg,
    gap: 8,
  },
  refRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  refLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
  },
  refVal: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  stepsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepsTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  stepDotActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotPending: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTextWrap: {
    flex: 1,
  },
  stepHeading: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  stepDesc: {
    fontSize: 10.5,
    color: colors.textSecondary,
    marginTop: 1,
  },
  stepLine: {
    width: 2,
    height: 18,
    backgroundColor: colors.border,
    marginLeft: 10,
    marginVertical: 2,
  },
  actionsBox: {
    gap: spacing.sm,
  },
  actionBtn: {
    width: '100%',
  },
});
