import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export const Loader = ({ text = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size="large" color={colors.primary} />
        {text ? <Text style={styles.text}>{text}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.primary} />
      {text ? <Text style={styles.inlineText}>{text}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  container: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: spacing.md,
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  inlineText: {
    marginTop: spacing.sm,
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
  },
});
