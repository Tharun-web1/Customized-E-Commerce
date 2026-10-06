import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

export const Badge = ({
  label,
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'luxury'
  size = 'sm', // 'sm' | 'md'
  icon,
  style,
}) => {
  const getBadgeStyle = () => {
    const base = [styles.badge, styles[size]];
    if (variant === 'primary') base.push(styles.primary);
    if (variant === 'secondary') base.push(styles.secondary);
    if (variant === 'accent') base.push(styles.accent);
    if (variant === 'success') base.push(styles.success);
    if (variant === 'warning') base.push(styles.warning);
    if (variant === 'luxury') base.push(styles.luxury);
    if (style) base.push(style);
    return base;
  };

  const getTextStyle = () => {
    const base = [styles.text, styles[`text_${size}`]];
    if (variant === 'primary') base.push(styles.textPrimary);
    if (variant === 'secondary') base.push(styles.textSecondary);
    if (variant === 'accent') base.push(styles.textAccent);
    if (variant === 'success') base.push(styles.textSuccess);
    if (variant === 'warning') base.push(styles.textWarning);
    if (variant === 'luxury') base.push(styles.textLuxury);
    return base;
  };

  return (
    <View style={getBadgeStyle()}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={getTextStyle()}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.pill,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
  },
  md: {
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
  },
  icon: {
    marginRight: 4,
  },
  primary: {
    backgroundColor: 'rgba(0, 44, 95, 0.08)',
  },
  secondary: {
    backgroundColor: 'rgba(0, 153, 255, 0.12)',
  },
  accent: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  success: {
    backgroundColor: colors.successLight,
  },
  warning: {
    backgroundColor: colors.warningLight,
  },
  luxury: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  text: {
    fontWeight: typography.fontWeights.semibold,
  },
  text_sm: {
    fontSize: 11,
  },
  text_md: {
    fontSize: typography.fontSizes.sm,
  },
  textPrimary: {
    color: colors.primary,
  },
  textSecondary: {
    color: colors.secondaryDark,
  },
  textAccent: {
    color: colors.accentDark,
  },
  textSuccess: {
    color: colors.success,
  },
  textWarning: {
    color: '#a16207',
  },
  textLuxury: {
    color: '#d4af37',
  },
});
