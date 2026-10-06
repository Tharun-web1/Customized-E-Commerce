import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

export const CATEGORIES_DATA = [
  {
    id: 1,
    name: 'Visiting Cards',
    slug: 'visiting-cards',
    image: require('../../assets/images/home/cat_visiting_cards_img.png'),
    bg: '#FAE1D9',
    arrowColor: '#EF1C62',
  },
  {
    id: 2,
    name: 'Banners',
    slug: 'banners',
    image: require('../../assets/images/home/cat_banners_img.png'),
    bg: '#E9F3F8',
    arrowColor: '#1C7EE0',
  },
  {
    id: 3,
    name: 'Brochures',
    slug: 'brochures',
    image: require('../../assets/images/home/cat_brochures_img.png'),
    bg: '#E7F6EF',
    arrowColor: '#12A66A',
  },
  {
    id: 4,
    name: 'Flyers',
    slug: 'flyers',
    image: require('../../assets/images/home/cat_flyers_img.png'),
    bg: '#FFF1D6',
    arrowColor: '#D97706',
  },
  {
    id: 5,
    name: 'Stickers & Labels',
    slug: 'stickers-labels',
    image: require('../../assets/images/home/cat_stickers_labels_img.png'),
    bg: '#FFF6E5',
    arrowColor: '#D97706',
  },
  {
    id: 6,
    name: 'Menu Cards',
    slug: 'menu-cards',
    image: require('../../assets/images/home/cat_menu_cards_img.png'),
    bg: '#EEE9F8',
    arrowColor: '#7C3AED',
  },
  {
    id: 7,
    name: 'T-Shirt Printing',
    slug: 't-shirts',
    image: require('../../assets/images/home/cat_tshirt_printing_img.png'),
    bg: '#E0F2FE',
    arrowColor: '#0284C7',
  },
  {
    id: 8,
    name: 'Sublimation Printing',
    slug: 'sublimation',
    image: require('../../assets/images/home/cat_sublimation_printing_img.png'),
    bg: '#E9F3F8',
    arrowColor: '#1C7EE0',
  },
  {
    id: 9,
    name: 'Flex Printing',
    slug: 'flex-printing',
    image: require('../../assets/images/home/cat_flex_printing_img.png'),
    bg: '#E9F3F8',
    arrowColor: '#1C7EE0',
  },
  {
    id: 10,
    name: 'Canvas Printing',
    slug: 'canvas-printing',
    image: require('../../assets/images/home/cat_canvas_printing_img.png'),
    bg: '#E7F6EF',
    arrowColor: '#12A66A',
  },
  {
    id: 11,
    name: '3D Printing',
    slug: '3d-printing',
    image: require('../../assets/images/home/cat_3d_printing_img.png'),
    bg: '#F8E6EF',
    arrowColor: '#EF1C62',
  },
  {
    id: 12,
    name: 'Custom Printing',
    slug: 'custom-printing',
    image: require('../../assets/images/home/cat_custom_printing_img.png'),
    bg: '#FAE1D9',
    arrowColor: '#D97706',
  },
  {
    id: 13,
    name: 'Catalogue Printing',
    slug: 'catalogue-printing',
    image: require('../../assets/images/home/cat_catalogue_printing_img.png'),
    bg: '#E7F6EF',
    arrowColor: '#12A66A',
  },
  {
    id: 14,
    name: 'Books Printing',
    slug: 'books-printing',
    image: require('../../assets/images/home/cat_books_printing_img.png'),
    bg: '#EEE9F8',
    arrowColor: '#EF1C62',
  },
  {
    id: 15,
    name: 'More Products',
    slug: 'more-products',
    image: require('../../assets/images/home/cat_more_products_img.png'),
    bg: '#E9F3F8',
    arrowColor: '#1C7EE0',
    isMore: true,
  },
];

export const HomeCategorySection = ({ onCategoryPress, onViewAllPress }) => {
  return (
    <View style={styles.sectionContainer}>
      {/* 1. Header: Shop by Category & View All */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <TouchableOpacity
          onPress={onViewAllPress}
          activeOpacity={0.7}
          style={styles.viewAllBtn}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={15} color={colors.primaryBlue} />
        </TouchableOpacity>
      </View>

      {/* 2. 3-Column Category Grid */}
      <View style={styles.gridContainer}>
        {CATEGORIES_DATA.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryCard, { backgroundColor: cat.bg }]}
            activeOpacity={0.88}
            onPress={() => onCategoryPress && onCategoryPress(cat)}
          >
            {/* Dedicated Edge-to-Edge Product Image Container without white strip */}
            <View style={styles.categoryImageContainer}>
              <Image
                source={cat.image}
                style={styles.categoryImage}
                resizeMode="cover"
                fadeDuration={150}
              />
            </View>

            {/* Title & Arrow Row */}
            <View style={styles.bottomRow}>
              <Text
                style={styles.categoryName}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {cat.name}
              </Text>
              <View style={styles.arrowCircle}>
                <Ionicons
                  name="chevron-forward"
                  size={11}
                  color={cat.arrowColor || colors.primaryNavy}
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryNavy,
    letterSpacing: -0.3,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 8,
  },
  viewAllText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.primaryBlue,
    marginRight: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryCard: {
    width: '31.6%',
    height: 104,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'space-between',
    paddingBottom: 6,
    paddingHorizontal: 6,
    paddingTop: 4,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(225, 230, 237, 0.6)',
  },
  categoryImageContainer: {
    width: '100%',
    height: 64,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 3,
    gap: 2,
  },
  categoryName: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primaryNavy,
    flex: 1,
    lineHeight: 12.5,
  },
  arrowCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
});
