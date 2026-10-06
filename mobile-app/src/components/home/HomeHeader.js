import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const HomeHeader = ({ onLocationPress, onNotificationPress }) => {
  const insets = useSafeAreaInsets();
  
  // Calculate proper top padding for notch, punch hole, or standard status bar
  const headerTopPadding = insets.top > 0 ? insets.top + 4 : (Platform.OS === 'android' ? 10 : 8);

  return (
    <View style={[styles.headerContainer, { paddingTop: headerTopPadding }]}>
      {/* 1. SAP Prints Logo */}
      <View style={styles.logoWrapper}>
        <Image
          source={require('../../assets/images/home/sap_home_logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* 2. Location Selector */}
      <TouchableOpacity
        style={styles.locationWrapper}
        onPress={onLocationPress}
        activeOpacity={0.7}
      >
        <Ionicons name="location" size={20} color={colors.primaryNavy} style={styles.locationPin} />
        <View style={styles.locationTextColumn}>
          <View style={styles.locationRow}>
            <Text style={styles.locationTitle}>KPHB Colony,</Text>
            <Ionicons name="chevron-down" size={14} color={colors.primaryNavy} style={styles.chevronIcon} />
          </View>
          <Text style={styles.locationCity}>Hyderabad</Text>
        </View>
      </TouchableOpacity>

      {/* 3. Notification Button with Pink Badge (2) */}
      <TouchableOpacity
        style={styles.bellButton}
        onPress={onNotificationPress}
        activeOpacity={0.7}
        accessibilityLabel="Notifications"
      >
        <View style={styles.bellCircle}>
          <Ionicons name="notifications-outline" size={22} color={colors.primaryNavy} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: colors.white,
  },
  logoWrapper: {
    width: 120,
    height: 48,
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    flex: 1,
    marginLeft: 8,
  },
  locationPin: {
    marginRight: 4,
  },
  locationTextColumn: {
    justifyContent: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryNavy,
  },
  chevronIcon: {
    marginLeft: 3,
  },
  locationCity: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.secondaryText,
    marginTop: -1,
  },
  bellButton: {
    padding: 2,
  },
  bellCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.primaryPink,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
});
