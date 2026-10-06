import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Header } from '../../components/common/Header';
import { ProductCard } from '../../components/product/ProductCard';
import { CategoryCard } from '../../components/product/CategoryCard';
import { Loader } from '../../components/common/Loader';
import { fetchCategories, fetchCards } from '../../api/cardApi';

export const CategoryCardsScreen = ({ navigation, route }) => {
  const initialGroup = route.params?.category || route.params?.group || 'all';
  const categoryTitle = route.params?.categoryName || route.params?.name || 'Printing Catalog';
  const [categories, setCategories] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(initialGroup);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [catsData, cardsData] = await Promise.all([
        fetchCategories(),
        fetchCards(selectedGroup, searchQuery),
      ]);
      setCategories(catsData);
      setCards(cardsData);
    } catch (e) {
      console.warn('Category cards load error:', e);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedGroup, searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <View style={styles.screen}>
      <Header
        title={categoryTitle}
        subtitle="Explore verified styles, papers & custom options"
        showBack
        navigation={navigation}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cards (e.g. Gold Foil, Matte, Linen)..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category Chips Bar */}
      <View style={styles.categoriesBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: 0, name: 'All Cards', slug: 'all' }, ...categories]}
          keyExtractor={(item) => String(item.id || item.slug)}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              isSelected={selectedGroup === item.slug}
              onPress={() => setSelectedGroup(item.slug)}
            />
          )}
          contentContainerStyle={styles.categoryListContent}
        />
      </View>

      {/* Card List */}
      {isLoading ? (
        <Loader text="Loading catalog..." fullScreen />
      ) : cards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No Cards Found</Text>
          <Text style={styles.emptyDesc}>
            Try modifying your search or select a different category filter.
          </Text>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              setSearchQuery('');
              setSelectedGroup('all');
            }}
          >
            <Text style={styles.resetBtnText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => String(item.id || item.slug)}
          renderItem={({ item }) => (
            <ProductCard
              card={item}
              onPress={() => navigation.navigate('ProductDetail', { card: item })}
              onCustomize={() => navigation.navigate('StudioTab', { screen: 'DesignStudio', params: { card: item } })}
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    backgroundColor: colors.surface,
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
  categoriesBar: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryListContent: {
    paddingHorizontal: spacing.lg,
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
    lineHeight: 20,
  },
  resetBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  resetBtnText: {
    color: colors.textInverted,
    fontWeight: typography.fontWeights.bold,
    fontSize: typography.fontSizes.sm,
  },
});
