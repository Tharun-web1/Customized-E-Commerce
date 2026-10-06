import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, theme } from '../../theme';
import { CardMockupPreview } from '../common/CardMockupPreview';

export const TemplateCard = ({ template, onSelect }) => {
  if (!template) return null;

  return (
    <TouchableOpacity
      style={[styles.container, theme.shadows.md]}
      onPress={() => onSelect(template)}
      activeOpacity={0.9}
    >
      {/* Template Card Mini Mockup */}
      <View style={styles.previewWrap}>
        <CardMockupPreview
          cardTitle={template.title}
          customName={template.sample_name || 'Aditya Sharma'}
          customTitle={template.sample_job_title || 'Managing Director'}
          customCompany={template.sample_company || 'Vertex Solutions'}
          customPhone={template.sample_phone || '+91 98765 43210'}
          customEmail={template.sample_email || 'contact@vertex.in'}
          accentColor={template.primary_color || '#002c5f'}
          orientation={template.orientation || 'horizontal'}
          interactive={false}
        />
      </View>

      {/* Template Meta */}
      <View style={styles.metaWrap}>
        <View style={styles.badgeRow}>
          <View style={styles.industryBadge}>
            <Text style={styles.industryText}>{template.industry || 'Corporate'}</Text>
          </View>
          <View style={styles.orientationBadge}>
            <Text style={styles.orientationText}>
              {template.orientation === 'vertical' ? 'Vertical' : 'Horizontal'}
            </Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={1}>{template.title}</Text>
        <Text style={styles.sampleCompany} numberOfLines={1}>
          By {template.sample_company || 'Vertex Designs'}
        </Text>

        <TouchableOpacity
          style={styles.openStudioBtn}
          onPress={() => onSelect(template)}
        >
          <Ionicons name="color-wand-outline" size={14} color={colors.primary} />
          <Text style={styles.openStudioText}>Use Template</Text>
        </TouchableOpacity>
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
  previewWrap: {
    backgroundColor: '#f1f5f9',
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaWrap: {
    padding: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  industryBadge: {
    backgroundColor: 'rgba(0, 44, 95, 0.08)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: borderRadius.pill,
  },
  industryText: {
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  orientationBadge: {
    backgroundColor: 'rgba(0, 153, 255, 0.1)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: borderRadius.pill,
  },
  orientationText: {
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondaryDark,
  },
  title: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  sampleCompany: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  openStudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryLight,
    paddingVertical: spacing.sm - 2,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    gap: 6,
  },
  openStudioText: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
});
