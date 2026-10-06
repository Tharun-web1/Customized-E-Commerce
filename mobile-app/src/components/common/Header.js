import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { useCart } from '../../context/CartContext';

export const Header = ({
  title = 'ASAP Visiting Cards',
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  navigation,
}) => {
  const { itemCount } = useCart();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.content}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onBack || (() => navigation?.goBack())}
            accessibilityLabel="Go Back"
          >
            <Ionicons name="arrow-back" size={24} color={colors.textInverted} />
          </TouchableOpacity>
        ) : (
          <View style={styles.brandBadge}>
            <Ionicons name="card" size={18} color={colors.accent} />
          </View>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>

        <View style={styles.actions}>
          {rightAction ? (
            rightAction
          ) : (
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigation?.navigate('CartTab')}
              accessibilityLabel="View Cart"
            >
              <Ionicons name="cart-outline" size={22} color={colors.textInverted} />
              {itemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{itemCount > 99 ? '99+' : itemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 12 : 12,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryLight,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  brandBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textInverted,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  cartBadgeText: {
    color: colors.textInverted,
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
  },
});
