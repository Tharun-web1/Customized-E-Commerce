import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Platform,
  RefreshControl,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { HomeHeader } from '../../components/home/HomeHeader';
import { HomeSearchBar } from '../../components/home/HomeSearchBar';
import { HomePromoCarousel } from '../../components/home/HomePromoCarousel';
import { HomeCategorySection } from '../../components/home/HomeCategorySection';
import { HomeBenefitsSection } from '../../components/home/HomeBenefitsSection';

export const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('KPHB Colony, Hyderabad');

  const LOCATIONS = [
    'KPHB Colony, Hyderabad',
    'Hitec City, Hyderabad',
    'Madhapur, Hyderabad',
    'Gachibowli, Hyderabad',
    'Banjara Hills, Hyderabad',
    'Jubilee Hills, Hyderabad',
    'Secunderabad, Telangana',
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleLocationPress = () => {
    setShowLocationModal(true);
  };

  const handleNotificationPress = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('Notifications');
    }
  };

  const handleSearchPress = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('Search', { initialQuery: searchQuery });
    }
  };

  const handleScannerPress = () => {
    Alert.alert(
      'SAP QR / Barcode Scanner',
      'Point your camera at a physical print proof or visiting card QR code to instantly preview, re-order, or verify print specifications.'
    );
  };

  const handleBannerPress = (banner) => {
    if (navigation && navigation.navigate) {
      if (banner.category === 'visiting-cards') {
        navigation.navigate('ProductDetail', {
          card: {
            id: 1,
            title: 'Standard Visiting Cards',
            slug: 'visiting-cards',
            price: 200,
            description: 'Premium High-Definition Visiting Cards with Matte/Gloss finish.',
          },
        });
      } else {
        navigation.navigate('BrowseTemplates', { category: banner.category });
      }
    }
  };

  const handleCategoryPress = (category) => {
    if (category.isMore) {
      if (navigation && navigation.navigate) {
        navigation.navigate('BrowseTemplates');
      } else {
        Alert.alert('More Products', 'Browsing full printing catalog.');
      }
      return;
    }

    if (navigation && navigation.navigate) {
      navigation.navigate('ProductDetail', {
        card: {
          id: category.id,
          name: category.name,
          title: category.name,
          slug: category.slug,
          price: 299,
          description: `Customized high-definition ${category.name.toLowerCase()} with multi-material finish and precision die-cut options.`,
        },
      });
    }
  };

  const handleViewAllPress = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('BrowseTemplates');
    }
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      {/* Screen Container with Max Width for Desktop/Tablet responsiveness */}
      <View style={styles.screenContainer}>
        {/* 1. Header (Logo, Location, Notification Badge with safe area top padding) */}
        <HomeHeader
          onLocationPress={handleLocationPress}
          onNotificationPress={handleNotificationPress}
        />

        {/* 2. Search & Scanner Row */}
        <HomeSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearchPress={handleSearchPress}
          onScannerPress={handleScannerPress}
        />

        {/* 3. Scrollable Main Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primaryPink]}
              tintColor={colors.primaryPink}
            />
          }
        >
          {/* 4. Promotional Banner Carousel */}
          <HomePromoCarousel onBannerPress={handleBannerPress} />

          {/* 5. Shop by Category (3-Column Pastel Grid with All 15 Categories) */}
          <HomeCategorySection
            onCategoryPress={handleCategoryPress}
            onViewAllPress={handleViewAllPress}
          />

          {/* 6. Quick Benefits Section (Quick Order, Premium Quality, 24/7 Support) */}
          <HomeBenefitsSection />
        </ScrollView>
      </View>

      {/* Location Picker Modal */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLocationModal(false)}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Delivery Location</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Ionicons name="close" size={22} color={colors.primaryNavy} />
              </TouchableOpacity>
            </View>

            {LOCATIONS.map((loc, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.locationOption,
                  selectedLocation === loc && styles.locationOptionSelected,
                ]}
                onPress={() => {
                  setSelectedLocation(loc);
                  setShowLocationModal(false);
                }}
              >
                <Ionicons
                  name={selectedLocation === loc ? 'radio-button-on' : 'radio-button-off'}
                  size={18}
                  color={selectedLocation === loc ? colors.primaryPink : colors.secondaryText}
                  style={styles.radioIcon}
                />
                <Text
                  style={[
                    styles.locationOptionText,
                    selectedLocation === loc && styles.locationOptionTextSelected,
                  ]}
                >
                  {loc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  screenContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    backgroundColor: colors.white,
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0px 8px 30px rgba(23, 32, 70, 0.08)',
          minHeight: '100vh',
        }
      : {}),
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 32, 70, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  locationOptionSelected: {
    backgroundColor: '#FFEBF1',
  },
  radioIcon: {
    marginRight: 10,
  },
  locationOptionText: {
    fontSize: 14,
    color: colors.primaryNavy,
    fontWeight: '500',
  },
  locationOptionTextSelected: {
    color: colors.primaryPink,
    fontWeight: '700',
  },
});
