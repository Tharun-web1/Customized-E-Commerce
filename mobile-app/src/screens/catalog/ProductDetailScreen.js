import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, theme } from '../../theme';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { CardMockupPreview } from '../../components/common/CardMockupPreview';
import { DEFAULT_PINCODE } from '../../constants/config';

const { width } = Dimensions.get('window');

const QUANTITY_TIERS = [
  { qty: 100, discount: 0, tag: 'Standard' },
  { qty: 200, discount: 5, tag: 'Popular' },
  { qty: 300, discount: 8, tag: 'Value' },
  { qty: 500, discount: 12, tag: 'Best Seller' },
  { qty: 1000, discount: 20, tag: 'Corporate' },
  { qty: 2000, discount: 25, tag: 'Bulk Saver' },
];

export const ProductDetailScreen = ({ navigation, route }) => {
  const card = route.params?.card || {
    title: 'Standard Visiting Cards',
    slug: 'standard',
    base_price_100: 200.0,
    dimensions: '8.9 cm x 5.1 cm',
    gsm: '350 GSM',
    finish_type: 'Matte / Glossy',
    rating: 4.8,
    reviews_count: 1420,
    description: 'Personalized cards with a professional look. High-definition precision printing on premium quality paper board.',
  };

  const [quantity, setQuantity] = useState(100);
  const [cornerStyle, setCornerStyle] = useState('Standard');
  const [deliverySpeed, setDeliverySpeed] = useState('standard');
  const [pincode, setPincode] = useState(DEFAULT_PINCODE);
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [activeSide, setActiveSide] = useState('front');

  // Pricing math
  const baseRate = Number(card.base_price_100 || 200.0) / 100;
  const currentTier = QUANTITY_TIERS.find(t => t.qty === quantity) || QUANTITY_TIERS[0];
  const unitPrice = (baseRate * (1 - currentTier.discount / 100)).toFixed(2);
  const cornerExtra = cornerStyle === 'Rounded' ? 30.0 : 0.0;
  const totalPrice = (Number(unitPrice) * quantity + cornerExtra).toFixed(2);

  const bulletPoints = card.bullet_points
    ? card.bullet_points.split('\n').filter(Boolean)
    : [
        '4,000+ ready design options or upload custom artwork',
        'Sturdy 350 GSM archival-grade art cardstock',
        'Precision die-cut corners and bleed alignment',
        'GST invoice and input tax credit available for businesses',
        'Same-day express dispatch available on select metro PIN codes',
      ];

  return (
    <View style={styles.screen}>
      <Header
        title={card.title}
        subtitle={`${card.gsm || '350 GSM'} • ${card.dimensions || '8.9 cm x 5.1 cm'}`}
        showBack
        navigation={navigation}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Visual Mockup Preview */}
        <View style={styles.mockupSection}>
          <CardMockupPreview
            side={activeSide}
            onToggleSide={setActiveSide}
            cardTitle={card.title}
            cornerStyle={cornerStyle}
            accentColor={card.accent_color || '#002c5f'}
            interactive={true}
          />
        </View>

        {/* Title, Rating & Base Price */}
        <View style={styles.titleSection}>
          <View style={styles.badgeRow}>
            {card.badge && (
              <Badge
                label={card.badge}
                variant={card.badge === 'Luxury' ? 'luxury' : 'accent'}
                size="sm"
              />
            )}
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={13} color="#f59e0b" />
              <Text style={styles.ratingScore}>{card.rating || '4.8'}</Text>
              <Text style={styles.reviewsCount}>({card.reviews_count || 1400}+ reviews)</Text>
            </View>
          </View>

          <Text style={styles.productTitle}>{card.title}</Text>
          <Text style={styles.productDesc}>{card.description}</Text>
        </View>

        {/* Corner Style Selector */}
        <View style={styles.optionSection}>
          <Text style={styles.optionSectionTitle}>1. Corner Style</Text>
          <View style={styles.cornerOptionsRow}>
            <TouchableOpacity
              style={[styles.cornerOptionCard, cornerStyle === 'Standard' && styles.optionCardActive]}
              onPress={() => setCornerStyle('Standard')}
            >
              <View style={styles.cornerIconStandard} />
              <Text style={[styles.cornerOptionText, cornerStyle === 'Standard' && styles.optionTextActive]}>
                Standard Square (90°)
              </Text>
              <Text style={styles.cornerSubtext}>Included Free</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cornerOptionCard, cornerStyle === 'Rounded' && styles.optionCardActive]}
              onPress={() => setCornerStyle('Rounded')}
            >
              <View style={styles.cornerIconRounded} />
              <Text style={[styles.cornerOptionText, cornerStyle === 'Rounded' && styles.optionTextActive]}>
                Rounded Corners (6mm)
              </Text>
              <Text style={styles.cornerSubtext}>+₹30 flat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quantity & Volume Pricing Grid */}
        <View style={styles.optionSection}>
          <View style={styles.qtyHeaderRow}>
            <Text style={styles.optionSectionTitle}>2. Select Quantity</Text>
            <Text style={styles.qtySavingText}>Up to 25% Volume Savings</Text>
          </View>

          <View style={styles.quantityGrid}>
            {QUANTITY_TIERS.map((tier) => {
              const isSelected = quantity === tier.qty;
              const tierRate = (baseRate * (1 - tier.discount / 100)).toFixed(2);
              const tierTotal = (Number(tierRate) * tier.qty + cornerExtra).toFixed(0);

              return (
                <TouchableOpacity
                  key={tier.qty}
                  style={[styles.qtyCard, isSelected && styles.qtyCardActive]}
                  onPress={() => setQuantity(tier.qty)}
                  activeOpacity={0.85}
                >
                  {tier.discount > 0 && (
                    <View style={styles.discountRibbon}>
                      <Text style={styles.discountRibbonText}>{tier.discount}% OFF</Text>
                    </View>
                  )}
                  <Text style={[styles.qtyCardQty, isSelected && styles.qtyCardQtyActive]}>
                    {tier.qty} pcs
                  </Text>
                  <Text style={[styles.qtyCardRate, isSelected && styles.qtyCardRateActive]}>
                    ₹{tierRate} / pc
                  </Text>
                  <Text style={[styles.qtyCardTotal, isSelected && styles.qtyCardTotalActive]}>
                    Total ₹{tierTotal}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Pincode & Delivery Checker */}
        <View style={styles.pincodeBox}>
          <View style={styles.pincodeHeader}>
            <Ionicons name="location" size={18} color={colors.primary} />
            <Text style={styles.pincodeTitle}>Delivery & Pincode Checker</Text>
          </View>
          <View style={styles.pincodeInputRow}>
            <TextInput
              style={styles.pincodeInput}
              value={pincode}
              onChangeText={setPincode}
              placeholder="Enter 6-digit PIN"
              keyboardType="numeric"
              maxLength={6}
            />
            <TouchableOpacity
              style={styles.pincodeCheckBtn}
              onPress={() => setPincodeChecked(pincode.length === 6)}
            >
              <Text style={styles.pincodeCheckBtnText}>Check</Text>
            </TouchableOpacity>
          </View>
          {pincodeChecked && (
            <View style={styles.deliveryStatusRow}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.deliveryStatusText}>
                Express Air Dispatch available to {pincode}. Order today for delivery in 2-3 business days.
              </Text>
            </View>
          )}
        </View>

        {/* Product Specifications Table */}
        <View style={styles.specsSection}>
          <Text style={styles.specsSectionTitle}>Product Specifications</Text>
          <View style={styles.specsTable}>
            <View style={styles.specTableRow}>
              <Text style={styles.specTableKey}>Dimensions</Text>
              <Text style={styles.specTableVal}>{card.dimensions || '8.9 cm x 5.1 cm'}</Text>
            </View>
            <View style={styles.specTableRow}>
              <Text style={styles.specTableKey}>Paper Weight</Text>
              <Text style={styles.specTableVal}>{card.gsm || '350 GSM'}</Text>
            </View>
            <View style={styles.specTableRow}>
              <Text style={styles.specTableKey}>Finish Coating</Text>
              <Text style={styles.specTableVal}>{card.finish_type || 'Matte / Glossy'}</Text>
            </View>
            <View style={styles.specTableRow}>
              <Text style={styles.specTableKey}>Print Resolution</Text>
              <Text style={styles.specTableVal}>2400 x 2400 DPI Ultra HD</Text>
            </View>
          </View>
        </View>

        {/* Feature Highlights */}
        <View style={styles.featuresBox}>
          <Text style={styles.featuresTitle}>Why Choose ASAP Visiting Cards?</Text>
          {bulletPoints.map((pt, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Ionicons name="checkmark" size={14} color={colors.success} style={styles.bulletIcon} />
              <Text style={styles.bulletText}>{pt}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Sticky Bottom Bar */}
      <View style={styles.stickyFooter}>
        <View style={styles.footerPriceWrap}>
          <Text style={styles.footerPriceLabel}>Total ({quantity} Cards)</Text>
          <Text style={styles.footerPriceVal}>₹{totalPrice}</Text>
        </View>

        <View style={styles.footerActions}>
          <TouchableOpacity
            style={styles.browseDesignsBtn}
            onPress={() =>
              navigation.navigate('CatalogTab', {
                screen: 'BrowseTemplates',
                params: { card, quantity, cornerStyle },
              })
            }
          >
            <Ionicons name="grid-outline" size={16} color={colors.primary} />
            <Text style={styles.browseDesignsText}>Templates</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.openStudioBtn}
            onPress={() =>
              navigation.navigate('StudioTab', {
                screen: 'DesignStudio',
                params: { card, quantity, cornerStyle },
              })
            }
          >
            <Ionicons name="color-wand" size={16} color={colors.textInverted} />
            <Text style={styles.openStudioBtnText}>Customize</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 110,
  },
  mockupSection: {
    marginBottom: spacing.md,
  },
  titleSection: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  reviewsCount: {
    fontSize: 11,
    color: colors.textMuted,
  },
  productTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginTop: 4,
  },
  productDesc: {
    fontSize: typography.fontSizes.xs + 1,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  optionSection: {
    marginBottom: spacing.lg,
  },
  optionSectionTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  cornerOptionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cornerOptionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  optionCardActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 44, 95, 0.03)',
  },
  cornerIconStandard: {
    width: 28,
    height: 18,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: 6,
  },
  cornerIconRounded: {
    width: 28,
    height: 18,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 6,
    marginBottom: 6,
  },
  cornerOptionText: {
    fontSize: 11,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeights.bold,
  },
  cornerSubtext: {
    fontSize: 9.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  qtyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  qtySavingText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: typography.fontWeights.bold,
  },
  quantityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  qtyCard: {
    width: (width - spacing.lg * 2 - spacing.sm * 2) / 3,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    position: 'relative',
  },
  qtyCardActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 44, 95, 0.03)',
  },
  discountRibbon: {
    position: 'absolute',
    top: -6,
    backgroundColor: colors.danger,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: borderRadius.pill,
  },
  discountRibbonText: {
    color: colors.textInverted,
    fontSize: 8,
    fontWeight: typography.fontWeights.bold,
  },
  qtyCardQty: {
    fontSize: 13,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  qtyCardQtyActive: {
    color: colors.primary,
  },
  qtyCardRate: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  qtyCardRateActive: {
    color: colors.secondaryDark,
  },
  qtyCardTotal: {
    fontSize: 11,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
    marginTop: 4,
  },
  qtyCardTotalActive: {
    color: colors.primary,
  },
  pincodeBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pincodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  pincodeTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  pincodeInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pincodeInput: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 40,
    fontSize: typography.fontSizes.sm,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pincodeCheckBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pincodeCheckBtnText: {
    color: colors.textInverted,
    fontWeight: typography.fontWeights.bold,
    fontSize: typography.fontSizes.xs + 1,
  },
  deliveryStatusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: spacing.sm,
  },
  deliveryStatusText: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  specsSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  specsSectionTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  specsTable: {
    gap: spacing.xs,
  },
  specTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderLight,
  },
  specTableKey: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
  },
  specTableVal: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
  },
  featuresBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featuresTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 3,
    gap: 6,
  },
  bulletIcon: {
    marginTop: 2,
  },
  bulletText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  footerPriceWrap: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  footerPriceVal: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.primary,
  },
  footerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  browseDesignsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  browseDesignsText: {
    color: colors.primary,
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.bold,
  },
  openStudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  openStudioBtnText: {
    color: colors.textInverted,
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.bold,
  },
});
