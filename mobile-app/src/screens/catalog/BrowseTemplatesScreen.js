import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Header } from '../../components/common/Header';
import { TemplateCard } from '../../components/product/TemplateCard';
import { Loader } from '../../components/common/Loader';
import { fetchTemplates } from '../../api/templateApi';

const INDUSTRIES = [
  'All',
  'Corporate & Business',
  'Real Estate & Luxury',
  'Healthcare & Wellness',
  'Design & Creative Arts',
  'Legal & Financial Services',
];

export const BrowseTemplatesScreen = ({ navigation, route }) => {
  const card = route.params?.card;
  const [templates, setTemplates] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedOrientation, setSelectedOrientation] = useState('all'); // 'all' | 'horizontal' | 'vertical'
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTemplates = async () => {
    try {
      const data = await fetchTemplates({
        industry: selectedIndustry === 'All' ? '' : selectedIndustry,
        orientation: selectedOrientation === 'all' ? '' : selectedOrientation,
        search: searchQuery,
      });
      setTemplates(data);
    } catch (e) {
      console.warn('Load templates error:', e);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [selectedIndustry, selectedOrientation, searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTemplates();
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Template Gallery"
        subtitle={card ? `For ${card.title}` : 'Choose from 4,000+ designer cards'}
        showBack
        navigation={navigation}
      />

      {/* Search Input */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search templates (e.g. Modern, Minimal, Gold)..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Industry Filter Chips */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {INDUSTRIES.map((ind) => (
            <TouchableOpacity
              key={ind}
              style={[styles.industryChip, selectedIndustry === ind && styles.industryChipActive]}
              onPress={() => setSelectedIndustry(ind)}
            >
              <Text style={[styles.industryChipText, selectedIndustry === ind && styles.industryChipTextActive]}>
                {ind}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orientation Selector Strip */}
      <View style={styles.orientationStrip}>
        <Text style={styles.orientationLabel}>Orientation:</Text>
        <View style={styles.orientationButtons}>
          <TouchableOpacity
            style={[styles.orientBtn, selectedOrientation === 'all' && styles.orientBtnActive]}
            onPress={() => setSelectedOrientation('all')}
          >
            <Text style={[styles.orientBtnText, selectedOrientation === 'all' && styles.orientBtnTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.orientBtn, selectedOrientation === 'horizontal' && styles.orientBtnActive]}
            onPress={() => setSelectedOrientation('horizontal')}
          >
            <Text style={[styles.orientBtnText, selectedOrientation === 'horizontal' && styles.orientBtnTextActive]}>Horizontal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.orientBtn, selectedOrientation === 'vertical' && styles.orientBtnActive]}
            onPress={() => setSelectedOrientation('vertical')}
          >
            <Text style={[styles.orientBtnText, selectedOrientation === 'vertical' && styles.orientBtnTextActive]}>Vertical</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Templates List */}
      {isLoading ? (
        <Loader text="Loading templates..." fullScreen />
      ) : templates.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="color-palette-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No Matching Templates</Text>
          <Text style={styles.emptyDesc}>Try choosing a different industry filter or clear search.</Text>
        </View>
      ) : (
        <FlatList
          data={templates}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TemplateCard
              template={item}
              onSelect={(tpl) =>
                navigation.navigate('StudioTab', {
                  screen: 'DesignStudio',
                  params: {
                    template: tpl,
                    card: card || { title: 'Standard Visiting Cards', slug: 'standard' },
                  },
                })
              }
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchWrap: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSizes.sm,
    color: colors.textPrimary,
  },
  filterSection: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
  },
  filterScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  industryChip: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  industryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  industryChipText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  industryChipTextActive: {
    color: colors.textInverted,
    fontWeight: typography.fontWeights.bold,
  },
  orientationStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orientationLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.semibold,
  },
  orientationButtons: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.pill,
    padding: 2,
  },
  orientBtn: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.pill,
  },
  orientBtnActive: {
    backgroundColor: colors.primary,
  },
  orientBtnText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.semibold,
  },
  orientBtnTextActive: {
    color: colors.textInverted,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  emptyDesc: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
