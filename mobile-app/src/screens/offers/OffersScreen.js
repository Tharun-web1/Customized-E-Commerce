import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fetchOffers } from '../../api/offerApi';
import { useCart } from '../../context/CartContext';

export const OffersScreen = ({ navigation }) => {
  const [offers, setOffers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const { applyPromo } = useCart();

  const loadOffers = async () => {
    const list = await fetchOffers();
    setOffers(list);
    setRefreshing(false);
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleCopy = (code) => {
    setCopiedCode(code);
    Alert.alert('Coupon Copied!', `Promo code "${code}" has been copied to your clipboard.`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleApply = async (code) => {
    const res = await applyPromo(code);
    Alert.alert('Promo Applied', `Code "${code}" applied to your active shopping cart!`, [
      { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      { text: 'Continue', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exclusive Offers & Promos</Text>
        <Text style={styles.headerSubtitle}>Verified discounts for visiting cards, banners & printing</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadOffers(); }} colors={[colors.primaryPink]} />}
      >
        {offers.map((offer) => (
          <View
            key={offer.id}
            style={[
              styles.offerCard,
              {
                backgroundColor: offer.bgColor || '#FFEBF1',
                borderColor: offer.borderColor || 'rgba(239, 28, 98, 0.2)',
              },
            ]}
          >
            <View style={styles.cardTopRow}>
              <View style={[styles.badge, { backgroundColor: offer.badgeColor || colors.primaryPink }]}>
                <Text style={styles.badgeText}>{offer.badgeText || 'SPECIAL OFFER'}</Text>
              </View>
              <Text style={styles.expiryText}>Expires: {offer.expiryDate || '31 Dec 2026'}</Text>
            </View>

            <Text style={styles.offerTitle}>{offer.title}</Text>
            <Text style={styles.offerDesc}>{offer.description}</Text>

            {offer.terms ? (
              <View style={styles.termsWrap}>
                <Ionicons name="information-circle-outline" size={14} color={colors.secondaryText} />
                <Text style={styles.termsText}>{offer.terms}</Text>
              </View>
            ) : null}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.copyBtn, { backgroundColor: offer.badgeColor || colors.primaryPink }]}
                onPress={() => handleCopy(offer.code)}
                activeOpacity={0.88}
              >
                <Ionicons name="copy-outline" size={15} color={colors.white} />
                <Text style={styles.copyBtnText}>
                  {copiedCode === offer.code ? 'Copied!' : `Code: ${offer.code}`}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => handleApply(offer.code)}
                activeOpacity={0.88}
              >
                <Text style={[styles.applyBtnText, { color: offer.badgeColor || colors.primaryPink }]}>
                  Apply to Cart
                </Text>
                <Ionicons name="arrow-forward" size={13} color={offer.badgeColor || colors.primaryPink} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 30,
  },
  offerCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10.5,
    fontWeight: '800',
  },
  expiryText: {
    fontSize: 11,
    color: colors.secondaryText,
    fontWeight: '600',
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryNavy,
    marginBottom: 6,
  },
  offerDesc: {
    fontSize: 13,
    color: colors.secondaryText,
    lineHeight: 18,
    marginBottom: 10,
  },
  termsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 14,
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  termsText: {
    fontSize: 11,
    color: colors.secondaryText,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  copyBtn: {
    flex: 1.2,
    borderRadius: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  copyBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  applyBtn: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
