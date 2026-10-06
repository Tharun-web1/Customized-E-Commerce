import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

export const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon,
  iconRight,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getContainerStyle = () => {
    const base = [styles.base, styles[size]];
    if (variant === 'primary') base.push(styles.primary);
    if (variant === 'secondary') base.push(styles.secondary);
    if (variant === 'outline') base.push(styles.outline);
    if (variant === 'ghost') base.push(styles.ghost);
    if (variant === 'accent') base.push(styles.accent);
    if (variant === 'danger') base.push(styles.danger);
    if (disabled || loading) base.push(styles.disabled);
    if (style) base.push(style);
    return base;
  };

  const getTextStyle = () => {
    const base = [styles.text, styles[`text_${size}`]];
    if (variant === 'outline') base.push(styles.textOutline);
    if (variant === 'ghost') base.push(styles.textGhost);
    if (variant === 'secondary') base.push(styles.textSecondary);
    if (disabled) base.push(styles.textDisabled);
    if (textStyle) base.push(textStyle);
    return base;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textInverted}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
          {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  // Sizes
  sm: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  md: {
    paddingVertical: spacing.md - 1,
    paddingHorizontal: spacing.lg,
  },
  lg: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
  },
  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondaryLight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  accent: {
    backgroundColor: colors.secondary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    opacity: 0.5,
  },
  // Text styles
  text: {
    fontWeight: typography.fontWeights.bold,
    color: colors.textInverted,
    textAlign: 'center',
  },
  text_sm: {
    fontSize: typography.fontSizes.sm,
  },
  text_md: {
    fontSize: typography.fontSizes.md,
  },
  text_lg: {
    fontSize: typography.fontSizes.lg,
  },
  textOutline: {
    color: colors.primary,
  },
  textGhost: {
    color: colors.primary,
  },
  textSecondary: {
    color: colors.secondaryDark,
  },
  textDisabled: {
    color: colors.textMuted,
  },
});
