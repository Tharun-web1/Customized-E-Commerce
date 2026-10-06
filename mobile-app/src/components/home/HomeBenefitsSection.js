import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const HomeBenefitsSection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Benefit 1: Quick Order */}
        <View style={styles.benefitItem}>
          <View style={[styles.iconBox, { backgroundColor: '#FFEBF1' }]}>
            <MaterialCommunityIcons name="truck-delivery" size={22} color={colors.primaryPink} />
          </View>
          <View style={styles.textColumn}>
            <Text style={styles.benefitTitle}>Quick Order</Text>
            <Text style={styles.benefitSubtitle}>Fast Delivery{'\n'}in Hyderabad</Text>
          </View>
        </View>

        {/* Divider 1 */}
        <View style={styles.verticalDivider} />

        {/* Benefit 2: Premium Quality */}
        <View style={styles.benefitItem}>
          <View style={[styles.iconBox, { backgroundColor: '#EBF4FE' }]}>
            <Ionicons name="shield-checkmark" size={20} color={colors.primaryBlue} />
          </View>
          <View style={styles.textColumn}>
            <Text style={styles.benefitTitle}>Premium</Text>
            <Text style={styles.benefitSubtitle}>Quality</Text>
          </View>
        </View>

        {/* Divider 2 */}
        <View style={styles.verticalDivider} />

        {/* Benefit 3: Support */}
        <View style={styles.benefitItem}>
          <View style={[styles.iconBox, { backgroundColor: '#E8F8F0' }]}>
            <Ionicons name="headset" size={20} color={colors.successGreen} />
          </View>
          <View style={styles.textColumn}>
            <Text style={styles.benefitTitle}>Support</Text>
            <Text style={styles.benefitSubtitle}>Anytime</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 2,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  benefitTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  benefitSubtitle: {
    fontSize: 9.5,
    fontWeight: '500',
    color: colors.secondaryText,
    marginTop: 1,
    lineHeight: 12,
  },
  verticalDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
});
