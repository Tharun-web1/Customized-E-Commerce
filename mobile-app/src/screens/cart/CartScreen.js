import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, theme } from '../../theme';
import { Header } from '../../components/common/Header';
import { CartItemCard } from '../../components/cart/CartItemCard';
import { Button } from '../../components/common/Button';
import { useCart } from '../../context/CartContext';

const POPULAR_PROMOS = [
  { code: 'PROMO15', label: '15% OFF', desc: 'Site-wide Discount' },
  { code: 'SAVE10', label: '10% OFF', desc: 'Orders 200+ cards' },
  { code: 'FREESHIP', label: 'Free Courier', desc: 'Priority Air shipping' },
];

export const CartScreen = ({ navigation }) => {
  const {
    cart,
    itemCount,
    subtotal,
    discountAmount,
    shippingFee,
    grandTotal,
    appliedPromo,
    promoMessage,
    isLoading,
    refreshCart,
    removeItem,
    applyPromo,
    clearPromo,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [applyingCode, setApplyingCode] = useState(false);

  const handleApplyCoupon = async (codeToUse) => {
    const target = (codeToUse || couponInput).trim().toUpperCase();
    if (!target) return;
    setApplyingCode(true);
    await applyPromo(target);
    setApplyingCode(false);
  };

  const handleRemove = (itemId) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this customized design from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeItem(itemId) },
    ]);
  };

  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <View style={styles.screen}>
      <Header
        title="Shopping Cart"
        subtitle={isEmpty ? '0 Items' : `${itemCount} Customized Design${itemCount > 1 ? 's' : ''}`}
        navigation={navigation}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshCart} colors={[colors.primary]} />}
      >
        {isEmpty ? (
          /* Empty Cart State */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="cart-outline" size={54} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Your cart is currently empty</Text>
            <Text style={styles.emptyDesc}>
              Personalize business cards with 350 GSM cardstock, raised spot UV, and metallic gold foils.
            </Text>

            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('CategoryCards')}
            >
              <Text style={styles.exploreBtnText}>Explore Visiting Cards</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.textInverted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.studioBtn}
              onPress={() => navigation.navigate('DesignStudio')}
            >
              <Ionicons name="color-wand-outline" size={16} color={colors.primary} />
              <Text style={styles.studioBtnText}>Open 3D Design Studio</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Cart Items List */
          <View>
            {cart.items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onRemove={handleRemove}
              />
            ))}

            {/* Promo Code Box */}
            <View style={[styles.promoCard, theme.shadows.sm]}>
              <View style={styles.promoHeader}>
                <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
                <Text style={styles.promoTitle}>Coupons & Offers</Text>
              </View>

              {appliedPromo ? (
                <View style={styles.appliedPromoRow}>
                  <View style={styles.appliedPromoBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                    <Text style={styles.appliedPromoCode}>{appliedPromo.code}</Text>
                    <Text style={styles.appliedPromoDisc}>Applied</Text>
                  </View>
                  <TouchableOpacity onPress={clearPromo}>
                    <Text style={styles.removePromoText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.promoInputRow}>
                  <TextInput
                    style={styles.promoInput}
                    placeholder="Enter Coupon Code (e.g. PROMO15)"
                    placeholderTextColor={colors.textMuted}
                    value={couponInput}
                    onChangeText={setCouponInput}
                    autoCapitalize="characters"
                  />
                  <Button
                    title="Apply"
                    variant="primary"
                    size="sm"
                    loading={applyingCode}
                    onPress={() => handleApplyCoupon()}
                    style={styles.applyBtn}
                  />
                </View>
              )}

              {promoMessage && (
                <Text style={[styles.promoMessageText, promoMessage.isError && styles.promoMessageError]}>
                  {promoMessage.text}
                </Text>
              )}

              {/* Quick Click Promo Chips */}
              <View style={styles.quickPromosRow}>
                {POPULAR_PROMOS.map((p) => (
                  <TouchableOpacity
                    key={p.code}
                    style={styles.promoChip}
                    onPress={() => {
                      setCouponInput(p.code);
                      handleApplyCoupon(p.code);
                    }}
                  >
                    <Text style={styles.promoChipCode}>{p.code}</Text>
                    <Text style={styles.promoChipLabel}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bill Summary Breakdown */}
            <View style={[styles.summaryCard, theme.shadows.sm]}>
              <Text style={styles.summaryTitle}>Price Breakdown</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Items Subtotal</Text>
                <Text style={styles.summaryVal}>₹{subtotal.toFixed(2)}</Text>
              </View>

              {discountAmount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryKey, { color: colors.success }]}>
                    Coupon Discount ({appliedPromo?.code})
                  </Text>
                  <Text style={[styles.summaryVal, { color: colors.success }]}>
                    -₹{discountAmount.toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Shipping & Handling</Text>
                <Text style={[styles.summaryVal, shippingFee === 0 && { color: colors.success }]}>
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}
                </Text>
              </View>

              {subtotal < 500 && subtotal > 0 && (
                <Text style={styles.freeShippingTip}>
                  Add ₹{(500 - subtotal).toFixed(2)} more to unlock FREE shipping!
                </Text>
              )}

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Grand Total (Incl. Taxes)</Text>
                <Text style={styles.totalAmount}>₹{grandTotal.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Checkout Footer */}
      {!isEmpty && (
        <View style={styles.stickyFooter}>
          <View style={styles.footerPriceWrap}>
            <Text style={styles.footerPriceLabel}>Amount to Pay</Text>
            <Text style={styles.footerPriceVal}>₹{grandTotal.toFixed(2)}</Text>
          </View>

          <Button
            title="Proceed to Checkout"
            variant="primary"
            size="md"
            onPress={() => navigation.navigate('Checkout', { grandTotal, appliedPromo })}
            iconRight={<Ionicons name="arrow-forward" size={16} color={colors.textInverted} />}
            style={styles.checkoutBtn}
          />
        </View>
      )}
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 1.5,
    paddingHorizontal: spacing.lg,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  exploreBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    gap: 8,
    marginBottom: spacing.sm,
    width: '100%',
    justifyContent: 'center',
  },
  exploreBtnText: {
    color: colors.textInverted,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
  studioBtn: {
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: 8,
    width: '100%',
    justifyContent: 'center',
  },
  studioBtnText: {
    color: colors.primary,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
  promoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  promoTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  promoInput: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 40,
    fontSize: typography.fontSizes.xs + 1,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  applyBtn: {
    minWidth: 80,
  },
  appliedPromoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.successLight,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  appliedPromoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appliedPromoCode: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.success,
  },
  appliedPromoDisc: {
    fontSize: 10,
    color: colors.success,
  },
  removePromoText: {
    fontSize: typography.fontSizes.xs,
    color: colors.danger,
    fontWeight: typography.fontWeights.bold,
  },
  promoMessageText: {
    fontSize: 11,
    color: colors.success,
    marginTop: 4,
  },
  promoMessageError: {
    color: colors.danger,
  },
  quickPromosRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  promoChip: {
    backgroundColor: colors.surfaceSubtle,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  promoChipCode: {
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  promoChipLabel: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryKey: {
    fontSize: typography.fontSizes.xs + 1,
    color: colors.textSecondary,
  },
  summaryVal: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
  },
  freeShippingTip: {
    fontSize: 10,
    color: colors.secondaryDark,
    marginTop: 2,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  totalLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  totalAmount: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.primary,
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
  checkoutBtn: {
    minWidth: 180,
  },
});
