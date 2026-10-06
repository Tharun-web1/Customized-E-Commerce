import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, theme } from '../../theme';
import { CardMockupPreview } from '../common/CardMockupPreview';

export const CartItemCard = ({ item, onRemove }) => {
  const [activeSide, setActiveSide] = useState('front');

  if (!item) return null;

  const total = Number(item.total_price || 0).toFixed(2);
  const unit = Number(item.unit_price || 0).toFixed(2);

  return (
    <View style={[styles.card, theme.shadows.md]}>
      {/* Header Info */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {item.card_title || 'Standard Visiting Cards'}
          </Text>
          <Text style={styles.specs}>
            {item.quantity} Cards • {item.card_gsm || '350 GSM'} • {item.corner_style || 'Standard'} Corners
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onRemove(item.id)}
          style={styles.deleteBtn}
          accessibilityLabel="Remove Item"
        >
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>

      {/* Interactive Mockup View */}
      <View style={styles.mockupContainer}>
        <CardMockupPreview
          side={activeSide}
          onToggleSide={setActiveSide}
          cardTitle={item.card_title}
          customName={item.custom_name}
          customTitle={item.custom_title}
          customCompany={item.custom_company}
          customPhone={item.custom_phone}
          customEmail={item.custom_email}
          accentColor={item.accent_color || '#002c5f'}
          cornerStyle={item.corner_style}
          previewImage={item.preview_image}
          backPreviewImage={item.back_preview_image}
          interactive={true}
        />
      </View>

      {/* Customized Attributes Summary */}
      <View style={styles.detailsBox}>
        {item.custom_name ? (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{item.custom_name}</Text>
          </View>
        ) : null}
        {item.custom_company ? (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Company:</Text>
            <Text style={styles.detailValue}>{item.custom_company}</Text>
          </View>
        ) : null}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Finish & Backside:</Text>
          <Text style={styles.detailValue}>
            {item.finish || 'Matte'} / {item.backside || 'Blank'}
          </Text>
        </View>
      </View>

      {/* Footer Pricing */}
      <View style={styles.footerRow}>
        <View>
          <Text style={styles.unitPriceText}>₹{unit} per card</Text>
          <Text style={styles.qtyText}>Qty: {item.quantity} units</Text>
        </View>
        <Text style={styles.totalPrice}>₹{total}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleWrap: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  specs: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.dangerLight,
  },
  mockupContainer: {
    marginVertical: spacing.xs,
  },
  detailsBox: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginVertical: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  detailLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontWeight: typography.fontWeights.medium,
  },
  detailValue: {
    fontSize: typography.fontSizes.xs,
    color: colors.textPrimary,
    fontWeight: typography.fontWeights.semibold,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  unitPriceText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  qtyText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
  },
  totalPrice: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.primary,
  },
});
