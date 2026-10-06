import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

export const CardMockupPreview = ({
  side = 'front', // 'front' | 'back'
  onToggleSide,
  cardTitle = 'Standard Visiting Cards',
  customName = 'Aditya Sharma',
  customTitle = 'Managing Director',
  customCompany = 'Vertex Solutions Pvt Ltd',
  customPhone = '+91 98765 43210',
  customEmail = 'contact@example.in',
  accentColor = '#002c5f',
  cornerStyle = 'Standard',
  previewImage = null,
  backPreviewImage = null,
  orientation = 'horizontal',
  interactive = true,
}) => {
  const isRounded = cornerStyle?.toLowerCase() === 'rounded';
  const isVertical = orientation === 'vertical';
  const isLuxury = accentColor === '#d4af37' || accentColor === '#09090b';

  const bgColor = isLuxury ? '#09090b' : '#ffffff';
  const textColor = isLuxury ? '#ffffff' : '#0f172a';
  const subtextColor = isLuxury ? '#d4af37' : '#64748b';

  const currentImage = side === 'front' ? previewImage : backPreviewImage;

  return (
    <View style={styles.container}>
      {/* Desk Background Mat */}
      <View style={[styles.deskFrame, isVertical && styles.deskFrameVertical]}>
        <View
          style={[
            styles.cardBody,
            isVertical ? styles.cardVertical : styles.cardHorizontal,
            isRounded && styles.roundedCorners,
            { backgroundColor: bgColor, borderColor: accentColor },
          ]}
        >
          {currentImage ? (
            <Image
              source={{ uri: currentImage }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : side === 'front' ? (
            <View style={styles.cardInnerFront}>
              {/* Top Accent Band */}
              <View style={[styles.accentBand, { backgroundColor: accentColor }]} />

              {/* Company Logo Badge */}
              <View style={styles.companyRow}>
                <View style={[styles.logoIconBox, { backgroundColor: accentColor }]}>
                  <Text style={styles.logoIconLetter}>
                    {(customCompany || 'V').charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.companyTextWrap}>
                  <Text style={[styles.companyName, { color: accentColor }]} numberOfLines={1}>
                    {customCompany || 'Your Company Name'}
                  </Text>
                  <Text style={styles.companyTagline} numberOfLines={1}>
                    Excellence in Precision
                  </Text>
                </View>
              </View>

              {/* Center Details */}
              <View style={styles.centerDetails}>
                <Text style={[styles.personName, { color: textColor }]} numberOfLines={1}>
                  {customName || 'Your Full Name'}
                </Text>
                <Text style={[styles.personTitle, { color: subtextColor }]} numberOfLines={1}>
                  {customTitle || 'Professional Title / Designation'}
                </Text>
              </View>

              {/* Bottom Contact Strip */}
              <View style={styles.contactStrip}>
                <View style={styles.contactItem}>
                  <Ionicons name="call" size={10} color={accentColor} />
                  <Text style={[styles.contactText, { color: textColor }]} numberOfLines={1}>
                    {customPhone || '+91 98765 43210'}
                  </Text>
                </View>
                <View style={styles.contactItem}>
                  <Ionicons name="mail" size={10} color={accentColor} />
                  <Text style={[styles.contactText, { color: textColor }]} numberOfLines={1}>
                    {customEmail || 'contact@domain.com'}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.cardInnerBack}>
              {/* Back Center Logo */}
              <View style={[styles.backLogoCircle, { backgroundColor: accentColor }]}>
                <Text style={styles.backLogoLetter}>
                  {(customCompany || 'V').charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.backCompanyName, { color: textColor }]}>
                {customCompany || 'Your Company Name'}
              </Text>
              <Text style={[styles.backSubtext, { color: subtextColor }]}>
                www.{(customCompany || 'company').toLowerCase().replace(/\s+/g, '')}.com
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Side Toggle Control */}
      {interactive && onToggleSide && (
        <View style={styles.sideToggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, side === 'front' && styles.toggleBtnActive]}
            onPress={() => onToggleSide('front')}
          >
            <Text style={[styles.toggleBtnText, side === 'front' && styles.toggleBtnTextActive]}>
              Front Side
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, side === 'back' && styles.toggleBtnActive]}
            onPress={() => onToggleSide('back')}
          >
            <Text style={[styles.toggleBtnText, side === 'back' && styles.toggleBtnTextActive]}>
              Back Side
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  deskFrame: {
    width: '100%',
    backgroundColor: '#e2e8f0',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  deskFrameVertical: {
    paddingVertical: spacing.xl,
  },
  cardBody: {
    borderRadius: borderRadius.xs,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  roundedCorners: {
    borderRadius: 14,
  },
  cardHorizontal: {
    width: 290,
    height: 165,
  },
  cardVertical: {
    width: 175,
    height: 275,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardInnerFront: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
    position: 'relative',
  },
  accentBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  logoIconBox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  logoIconLetter: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: typography.fontWeights.bold,
  },
  companyTextWrap: {
    flex: 1,
  },
  companyName: {
    fontSize: 11,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 0.5,
  },
  companyTagline: {
    fontSize: 8,
    color: '#94a3b8',
  },
  centerDetails: {
    marginVertical: 4,
  },
  personName: {
    fontSize: 14,
    fontWeight: typography.fontWeights.bold,
  },
  personTitle: {
    fontSize: 9,
    fontWeight: typography.fontWeights.medium,
    marginTop: 1,
  },
  contactStrip: {
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingTop: 4,
    gap: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactText: {
    fontSize: 8.5,
    fontWeight: typography.fontWeights.medium,
  },
  cardInnerBack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  backLogoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  backLogoLetter: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: typography.fontWeights.bold,
  },
  backCompanyName: {
    fontSize: 13,
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
  },
  backSubtext: {
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  },
  sideToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: borderRadius.pill,
    padding: 3,
    marginTop: spacing.md,
  },
  toggleBtn: {
    paddingVertical: 5,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleBtnText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textSecondary,
  },
  toggleBtnTextActive: {
    color: colors.textInverted,
  },
});
