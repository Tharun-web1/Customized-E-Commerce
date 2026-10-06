import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const OffersScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exclusive Offers & Promos</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.offerCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SPECIAL 20% OFF</Text>
          </View>
          <Text style={styles.offerTitle}>First Order Discount</Text>
          <Text style={styles.offerDesc}>Use promo code SAPFIRST at checkout on any Visiting Card or Banner order.</Text>
          <TouchableOpacity style={styles.copyBtn} activeOpacity={0.8}>
            <Text style={styles.copyBtnText}>Copy Code: SAPFIRST</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.offerCard, { backgroundColor: '#F3E8FF' }]}>
          <View style={[styles.badge, { backgroundColor: '#7C3AED' }]}>
            <Text style={styles.badgeText}>BULK PRINTING</Text>
          </View>
          <Text style={styles.offerTitle}>Corporate Bundle Savings</Text>
          <Text style={styles.offerDesc}>Flat 30% discount on bulk brochure, flyer, and sticker printing packages.</Text>
          <TouchableOpacity style={[styles.copyBtn, { backgroundColor: '#7C3AED' }]} activeOpacity={0.8}>
            <Text style={styles.copyBtnText}>Copy Code: BULK30</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  offerCard: {
    backgroundColor: '#FFEBF1',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(239, 28, 98, 0.15)',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryPink,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryNavy,
    marginBottom: 6,
  },
  offerDesc: {
    fontSize: 13,
    color: colors.secondaryText,
    lineHeight: 18,
    marginBottom: 14,
  },
  copyBtn: {
    backgroundColor: colors.primaryPink,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  copyBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
