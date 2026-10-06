import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, theme } from '../../theme';
import { Badge } from '../common/Badge';

export const ProductCard = ({ card, onPress, onCustomize }) => {
  if (!card) return null;

  const basePrice = Number(card.base_price_100 || 200.0);
  const unitPrice = (basePrice / 100).toFixed(2);

  return (
    <TouchableOpacity
      style={[styles.container, theme.shadows.md]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Product Image / Visual Showcase */}
      <View style={[styles.imageContainer, { backgroundColor: card.accent_color || colors.primary }]}>
        {card.image_url ? (
          <Image
            source={{ uri: card.image_url.startsWith('http') ? card.image_url : undefined }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.fallbackCardGraphic}>
            <Ionicons name="card-outline" size={48} color="rgba(255, 255, 255, 0.4)" />
            <Text style={styles.fallbackCardTitle}>{card.title}</Text>
          </View>
        )}

        {/* Badge Overlay */}
        {card.badge ? (
          <View style={styles.badgeWrap}>
            <Badge
              label={card.badge}
              variant={card.badge === 'Luxury' ? 'luxury' : 'accent'}
              size="sm"
            />
          </View>
        ) : null}

        {/* Rating Pill */}
        <View style={styles.ratingPill}>
          <Ionicons name="star" size={11} color="#f59e0b" />
          <Text style={styles.ratingText}>{card.rating || '4.8'}</Text>
        </View>
      </View>

      {/* Product Information */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>{card.title}</Text>
        <Text style={styles.specs} numberOfLines={1}>
          {card.gsm || '350 GSM'} • {card.finish_type || 'Matte / Glossy'}
        </Text>

        <Text style={styles.tagline} numberOfLines={2}>
          {card.tagline || card.description || 'Personalized premium visiting cards with high-definition color.'}
        </Text>

        {/* Price & Action Row */}
        <View style={styles.footerRow}>
          <View style={styles.priceWrap}>
            <Text style={styles.priceLabel}>Starting from</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{basePrice}</Text>
              <Text style={styles.priceUnit}> / {card.min_quantity || 100} pcs</Text>
            </View>
            <Text style={styles.unitRate}>₹{unitPrice} / card</Text>
          </View>

          <TouchableOpacity
            style={styles.customizeBtn}
            onPress={onCustomize || onPress}
            accessibilityLabel={`Customize ${card.title}`}
          >
            <Text style={styles.customizeBtnText}>Customize</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.textInverted} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageContainer: {
    height: 150,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackCardGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  fallbackCardTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  badgeWrap: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  ratingPill: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: borderRadius.pill,
    gap: 3,
  },
  ratingText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
  },
  detailsContainer: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  specs: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.secondaryDark,
    marginTop: 2,
  },
  tagline: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  priceWrap: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.primary,
  },
  priceUnit: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  unitRate: {
    fontSize: 9.5,
    color: colors.success,
    fontWeight: typography.fontWeights.semibold,
  },
  customizeBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 3,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  customizeBtnText: {
    color: colors.textInverted,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
});
