import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const HomeSearchBar = ({ value, onChangeText, onSearchPress, onScannerPress }) => {
  return (
    <View style={styles.searchRow}>
      {/* 1. Search Bar */}
      <TouchableOpacity
        style={styles.searchContainer}
        activeOpacity={0.9}
        onPress={onSearchPress}
      >
        <Ionicons name="search" size={20} color={colors.primaryNavy} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for products, templates..."
          placeholderTextColor={colors.secondaryText}
          value={value}
          onChangeText={onChangeText}
          underlineColorAndroid="transparent"
        />
      </TouchableOpacity>

      {/* 2. QR / Scan Button */}
      <TouchableOpacity
        style={styles.scannerButton}
        onPress={onScannerPress}
        activeOpacity={0.75}
        accessibilityLabel="Scan QR"
      >
        <Ionicons name="scan-outline" size={22} color={colors.primaryNavy} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 10,
    backgroundColor: colors.white,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    height: 48,
    paddingHorizontal: 14,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1.5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.primaryNavy,
    fontWeight: '500',
    paddingVertical: 0,
  },
  scannerButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1.5,
  },
});
