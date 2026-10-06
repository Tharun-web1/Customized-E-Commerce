import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { colors } from '../../theme/colors';

const { width: screenWidth } = Dimensions.get('window');

const BANNERS = [
  {
    id: 1,
    image: require('../../assets/images/home/home_promo_banner.png'),
    title: 'High Quality Visiting Cards',
    subtitle: 'Premium Designs for Your Business',
    cta: 'Order Now →',
    category: 'visiting-cards',
  },
  {
    id: 2,
    image: require('../../assets/images/home/home_promo_banner.png'),
    title: 'Custom Flex & Banners',
    subtitle: 'Stand Out with High-Definition Prints',
    cta: 'Order Now →',
    category: 'banners',
  },
  {
    id: 3,
    image: require('../../assets/images/home/home_promo_banner.png'),
    title: 'Custom Merchandise & T-Shirts',
    subtitle: 'Bulk & Single Order Express Delivery',
    cta: 'Order Now →',
    category: 't-shirts',
  },
];

export const HomePromoCarousel = ({ onBannerPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideSize);
    if (index !== activeIndex && index >= 0 && index < BANNERS.length) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {BANNERS.map((banner, index) => (
          <TouchableOpacity
            key={banner.id}
            style={styles.bannerSlide}
            activeOpacity={0.92}
            onPress={() => onBannerPress && onBannerPress(banner)}
          >
            <Image
              source={banner.image}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.paginationRow}>
        {BANNERS.map((_, index) => (
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
  container: {
    marginTop: 10,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  bannerSlide: {
    width: Math.min(screenWidth - 32, 408),
    height: 172,
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 12,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  paginationRow: {
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
    backgroundColor: colors.primaryPink,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#D8DEE8',
  },
});
