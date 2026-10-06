import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const { width: screenWidth } = Dimensions.get('window');
// Card width calculated so a subtle peek of the next banner is visible on the right
const CARD_WIDTH = Math.min(screenWidth - 44, 390);
const CARD_SPACING = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

export const PROMO_BANNERS_DATA = [
  {
    id: 1,
    titleLine1: 'High Quality',
    titleLine2: 'Visiting Cards',
    subtitle: 'Premium Designs\nfor Your Business',
    ctaText: 'Order Now',
    image: require('../../assets/images/home/banner_visiting_cards.png'),
    bg: '#FEEAE6',
    category: 'visiting-cards',
    categoryName: 'Visiting Cards',
    accentColor: '#EF1C62',
    isHeroArtwork: true,
  },
  {
    id: 2,
    titleLine1: 'Big Banners',
    titleLine2: 'Bigger Brands',
    subtitle: 'High-Impact Flex &\nOutdoor Advertising',
    ctaText: 'Order Now',
    image: require('../../assets/images/home/banner_flex_outdoor.png'),
    bg: '#EBF5FF',
    category: 'banners',
    categoryName: 'Banners',
    accentColor: '#1C7EE0',
    isHeroArtwork: false,
    badgeText: 'FAST 24H DELIVERY',
  },
  {
    id: 3,
    titleLine1: 'Custom T-Shirts',
    titleLine2: '& Apparel',
    subtitle: 'Vibrant Sublimation &\nScreen Printing',
    ctaText: 'Order Now',
    image: require('../../assets/images/home/banner_tshirts_merch.png'),
    bg: '#FFF0F5',
    category: 't-shirts',
    categoryName: 'T-Shirt Printing',
    accentColor: '#EF1C62',
    isHeroArtwork: false,
    badgeText: 'POPULAR APPAREL',
  },
  {
    id: 4,
    titleLine1: 'Corporate Brochures',
    titleLine2: '& Marketing Kits',
    subtitle: 'Multi-Fold Collateral\non Premium Art Paper',
    ctaText: 'Order Now',
    image: require('../../assets/images/home/banner_brochures_flyers.png'),
    bg: '#EAF8F1',
    category: 'brochures',
    categoryName: 'Brochures',
    accentColor: '#12A66A',
    isHeroArtwork: false,
    badgeText: 'BULK DISCOUNT 30%',
  },
];

export const HomePromoCarousel = ({ onBannerPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const isUserInteracting = useRef(false);
  const autoPlayTimer = useRef(null);

  // Auto-play interval (3.5 seconds)
  useEffect(() => {
    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayTimer.current = setInterval(() => {
        if (!isUserInteracting.current && flatListRef.current) {
          setActiveIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % PROMO_BANNERS_DATA.length;
            flatListRef.current.scrollToOffset({
              offset: nextIndex * SNAP_INTERVAL,
              animated: true,
            });
            return nextIndex;
          });
        }
      }, 3500);
    };

    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  const stopAutoPlay = () => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
      autoPlayTimer.current = null;
    }
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SNAP_INTERVAL);
    if (index >= 0 && index < PROMO_BANNERS_DATA.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const renderBannerItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.bannerCard, { backgroundColor: item.bg }]}
        activeOpacity={0.92}
        onPress={() => onBannerPress && onBannerPress(item)}
      >
        {item.isHeroArtwork ? (
          // Direct high-definition reference artwork
          <Image
            source={item.image}
            style={styles.fullBannerImage}
            resizeMode="cover"
          />
        ) : (
          // Rich native banner with typography, badge, CTA and product artwork
          <View style={styles.bannerContentRow}>
            <View style={styles.textContainer}>
              {item.badgeText ? (
                <View style={[styles.badgePill, { backgroundColor: item.accentColor }]}>
                  <Text style={styles.badgePillText}>{item.badgeText}</Text>
                </View>
              ) : null}

              <Text style={styles.titleLine1}>{item.titleLine1}</Text>
              <Text style={[styles.titleLine2, { color: item.accentColor }]}>
                {item.titleLine2}
              </Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>

              <View style={[styles.ctaButton, { backgroundColor: item.accentColor }]}>
                <Text style={styles.ctaText}>{item.ctaText}</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.white} style={styles.ctaArrow} />
              </View>
            </View>

            <View style={styles.productArtWrapper}>
              <Image
                source={item.image}
                style={styles.productArtImage}
                resizeMode="contain"
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        data={PROMO_BANNERS_DATA}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
        renderItem={renderBannerItem}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => {
          isUserInteracting.current = true;
        }}
        onScrollEndDrag={() => {
          isUserInteracting.current = false;
        }}
        onMomentumScrollEnd={(e) => {
          isUserInteracting.current = false;
          handleScroll(e);
        }}
        getItemLayout={(_, index) => ({
          length: SNAP_INTERVAL,
          offset: SNAP_INTERVAL * index,
          index,
        })}
      />

      {/* Pagination Dots (Active Pink Pill & Inactive Circles) */}
      <View style={styles.paginationContainer}>
        {PROMO_BANNERS_DATA.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  flatListContent: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  bannerCard: {
    width: CARD_WIDTH,
    height: 168,
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: CARD_SPACING,
    borderWidth: 1,
    borderColor: 'rgba(225, 230, 237, 0.7)',
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  fullBannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerContentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textContainer: {
    flex: 1.1,
    justifyContent: 'center',
    paddingRight: 6,
  },
  badgePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  badgePillText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  titleLine1: {
    fontSize: 16.5,
    fontWeight: '800',
    color: colors.primaryNavy,
    lineHeight: 20,
    letterSpacing: -0.3,
  },
  titleLine2: {
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 23,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.secondaryText,
    lineHeight: 14.5,
    marginBottom: 10,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  ctaArrow: {
    marginLeft: 4,
  },
  productArtWrapper: {
    flex: 0.9,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productArtImage: {
    width: '100%',
    height: 120,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 18,
    backgroundColor: colors.primaryPink, // #EF1C62
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#D9E0EA',
  },
});
