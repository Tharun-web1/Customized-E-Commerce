import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

export const CategoryCard = ({ category, isSelected = false, onPress }) => {
  const getIconName = (slug) => {
    switch (slug) {
      case 'shapes':
        return 'shapes-outline';
      case 'texture':
        return 'layers-outline';
      case 'special':
        return 'sparkles-outline';
      case 'holders':
        return 'briefcase-outline';
      default:
        return 'card-outline';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isSelected && styles.chipSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={getIconName(category.slug)}
        size={16}
        color={isSelected ? colors.textInverted : colors.primary}
        style={styles.icon}
      />
      <Text style={[styles.text, isSelected && styles.textSelected]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
  },
  textSelected: {
    color: colors.textInverted,
  },
});
