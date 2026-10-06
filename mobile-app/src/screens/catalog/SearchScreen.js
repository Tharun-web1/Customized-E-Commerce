import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Header } from '../../components/common/Header';
import { ProductCard } from '../../components/product/ProductCard';
import { Loader } from '../../components/common/Loader';
import { fetchCards } from '../../api/cardApi';

const POPULAR_SEARCH_TAGS = [
  'Gold Foil',
  'Spot UV',
  'Rounded Corners',
  'Matte',
  'Glossy',
  'Linen Textured',
  'Card Holders',
];

export const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await fetchCards();
        setCards(data);
        setFilteredCards(data);
      } catch (e) {
        console.warn('Search load cards error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadCards();
  }, []);

  const handleSearch = (text) => {
    setQuery(text);
    if (!text.trim()) {
      setFilteredCards(cards);
      return;
    }
    const lower = text.toLowerCase().trim();
    const matches = cards.filter(
      (c) =>
        c.title?.toLowerCase().includes(lower) ||
        c.description?.toLowerCase().includes(lower) ||
        c.finish_type?.toLowerCase().includes(lower) ||
        c.tagline?.toLowerCase().includes(lower) ||
        c.category_group?.toLowerCase().includes(lower)
    );
    setFilteredCards(matches);
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Search Products"
        subtitle="Find cards, finishes & accessories"
        navigation={navigation}
      />

      {/* Search Bar Input */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search visiting cards, textures, foil..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={handleSearch}
            autoFocus={false}
          />
          {query ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Popular Search Tags */}
      <View style={styles.tagsContainer}>
        <Text style={styles.tagsHeading}>Popular Searches:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
          {POPULAR_SEARCH_TAGS.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[styles.tagPill, query === tag && styles.tagPillActive]}
              onPress={() => handleSearch(tag)}
            >
              <Text style={[styles.tagPillText, query === tag && styles.tagPillTextActive]}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search Results */}
      {isLoading ? (
        <Loader text="Searching catalog..." fullScreen />
      ) : filteredCards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No matching products found</Text>
          <Text style={styles.emptyDesc}>Try searching for "Gold Foil", "Matte", "Linen" or clear filters.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCards}
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
  searchBarContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 44,
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
  tagsContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tagsHeading: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginBottom: 6,
    fontWeight: typography.fontWeights.medium,
  },
  tagsScroll: {
    gap: spacing.xs,
  },
  tagPill: {
    backgroundColor: colors.surfaceSubtle,
    paddingVertical: 5,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagPillText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  tagPillTextActive: {
    color: colors.textInverted,
    fontWeight: typography.fontWeights.bold,
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
    fontSize: typography.fontSizes.md + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  emptyDesc: {
    fontSize: typography.fontSizes.xs + 1,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
