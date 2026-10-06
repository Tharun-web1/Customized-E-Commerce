import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useCart } from '../../context/CartContext';
import { DEFAULT_PINCODE } from '../../constants/config';

const { width: screenWidth } = Dimensions.get('window');

const QUANTITY_TIERS = [
  { qty: 100, discount: 0, tag: 'Standard' },
  { qty: 200, discount: 5, tag: 'Popular' },
  { qty: 300, discount: 8, tag: 'Value' },
  { qty: 500, discount: 12, tag: 'Best Seller' },
  { qty: 1000, discount: 20, tag: 'Corporate' },
  { qty: 2000, discount: 25, tag: 'Bulk Saver' },
];

const PAPER_STOCKS = [
  { id: '350gsm', name: '350 GSM Art Card', desc: 'Sturdy & crisp finish', extra: 0 },
  { id: '400gsm', name: '400 GSM Velvet Soft-Touch', desc: 'Silky tactile feel', extra: 1.5 },
  { id: '320gsm', name: '320 GSM Woven Linen', desc: 'Artisanal texture', extra: 0.8 },
];

const FINISH_TYPES = [
  { id: 'matte', name: 'Silk Matte', desc: 'Non-reflective elegance', extra: 0 },
  { id: 'gloss', name: 'High Gloss', desc: 'Vibrant color pop', extra: 0 },
  { id: 'gold_foil', name: 'Metallic Gold Foil', desc: 'Reflective hot stamp', extra: 2.5 },
  { id: 'spot_uv', name: '3D Raised Spot UV', desc: 'Glossy 3D embossed logo', extra: 1.8 },
];

const CORNER_STYLES = [
  { id: 'standard', name: 'Standard Square (90°)', extra: 0 },
  { id: 'rounded', name: 'Rounded Corners (6mm)', extra: 30 },
];

const PRINT_SIDES = [
  { id: 'single', name: 'Single Side (Front Only)', extra: 0 },
  { id: 'double', name: 'Both Sides (Front & Back)', extra: 0.5 },
];

const getProductImage = (card) => {
  if (card?.image) {
    return typeof card.image === 'string' ? { uri: card.image } : card.image;
  }
  const slug = (card?.slug || card?.category || card?.title || '').toLowerCase();
  if (slug.includes('banner') || slug.includes('flex')) {
    return require('../../assets/images/home/cat_banners_img.png');
  }
  if (slug.includes('tshirt') || slug.includes('t-shirt') || slug.includes('apparel')) {
    return require('../../assets/images/home/cat_tshirt_printing_img.png');
  }
  if (slug.includes('brochure') || slug.includes('flyer')) {
    return require('../../assets/images/home/cat_brochures_img.png');
  }
  if (slug.includes('sticker') || slug.includes('label')) {
    return require('../../assets/images/home/cat_stickers_labels_img.png');
  }
  if (slug.includes('menu')) {
    return require('../../assets/images/home/cat_menu_cards_img.png');
  }
  if (slug.includes('canvas')) {
    return require('../../assets/images/home/cat_canvas_printing_img.png');
  }
  if (slug.includes('3d')) {
    return require('../../assets/images/home/cat_3d_printing_img.png');
  }
  if (slug.includes('gold') || slug.includes('foil')) {
    return require('../../assets/images/home/banner_visiting_cards.png');
  }
  return require('../../assets/images/home/cat_visiting_cards_img.png');
};

export const ProductDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { addItem, itemCount } = useCart();

  const card = route.params?.card || {
    id: 1,
    title: 'Standard Visiting Cards',
    slug: 'standard',
    base_price_100: 200.0,
    dimensions: '8.9 cm x 5.1 cm',
    gsm: '350 GSM',
    finish_type: 'Silk Matte',
    rating: 4.8,
    reviews_count: 1420,
    badge: 'Bestseller',
    description:
      'Precision digital printing on 350 GSM sturdy cardstock. Features brilliant color fidelity, crisp typography, and standard 90° die-cut edges.',
  };

  // State
  const [selectedStock, setSelectedStock] = useState(PAPER_STOCKS[0]);
  const [selectedFinish, setSelectedFinish] = useState(FINISH_TYPES[0]);
  const [selectedCorner, setSelectedCorner] = useState(CORNER_STYLES[0]);
  const [selectedSide, setSelectedSide] = useState(PRINT_SIDES[0]);
  const [quantity, setQuantity] = useState(route.params?.quantity || 100);
  const [pincode, setPincode] = useState(DEFAULT_PINCODE);
  const [pincodeVerified, setPincodeVerified] = useState(true);

  // Math & Pricing
  const baseRate = Number(card.base_price_100 || 200.0) / 100;
  const currentTier = QUANTITY_TIERS.find((t) => t.qty === quantity) || QUANTITY_TIERS[0];
  const unitAddons = selectedStock.extra + selectedFinish.extra + selectedSide.extra;
  const effectiveUnitRate = Math.max(0.5, (baseRate + unitAddons) * (1 - currentTier.discount / 100));
  const subtotal = effectiveUnitRate * quantity + selectedCorner.extra;
  const formattedTotal = subtotal.toFixed(2);

  const productImageSource = getProductImage(card);

  const handleAddToCart = () => {
    addItem({
      title: card.title,
      card_title: card.title,
      paper_stock: selectedStock.name,
      finish: selectedFinish.name,
      corner_style: selectedCorner.name,
      sides: selectedSide.name,
      quantity,
      unit_price: effectiveUnitRate.toFixed(2),
      total_price: formattedTotal,
    });

    Alert.alert('Added to Cart', `${quantity} units of ${card.title} added to your cart.`, [
      { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      { text: 'Continue Shopping', style: 'cancel' },
    ]);
  };

  const handleBuyNow = () => {
    addItem({
      title: card.title,
      card_title: card.title,
      paper_stock: selectedStock.name,
      finish: selectedFinish.name,
      corner_style: selectedCorner.name,
      sides: selectedSide.name,
      quantity,
      unit_price: effectiveUnitRate.toFixed(2),
      total_price: formattedTotal,
    });

    navigation.navigate('Checkout', {
      grandTotal: Number(formattedTotal),
    });
  };

  const handleCheckPincode = () => {
    if (pincode.trim().length === 6) {
      setPincodeVerified(true);
      Alert.alert('Delivery Available', `Express priority delivery available to PIN ${pincode} in 2-3 business days.`);
    } else {
      Alert.alert('Invalid PIN Code', 'Please enter a valid 6-digit PIN code.');
    }
  };

  return (
    <View style={[styles.rootContainer, { paddingTop: insets.top }]}>
      {/* 1. Header (Back Button, Title, Cart with live count badge) */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.primaryNavy} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {card.title}
          </Text>
          <Text style={styles.headerSubtitle}>{card.dimensions || '8.9 cm x 5.1 cm'}</Text>
        </View>

        <TouchableOpacity
          style={styles.headerCartBtn}
          onPress={() => navigation.navigate('Cart')}
          accessibilityLabel="View Shopping Cart"
        >
          <Ionicons name="cart-outline" size={24} color={colors.primaryNavy} />
          {itemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* 2. Scrollable Product Details Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image Gallery Showcase */}
        <View style={styles.imageCard}>
          {card.badge && (
            <View style={styles.imageBadgePill}>
              <Ionicons name="sparkles" size={11} color={colors.white} />
              <Text style={styles.imageBadgeText}>{card.badge.toUpperCase()}</Text>
            </View>
          )}

          <Image
            source={productImageSource}
            style={styles.productHeroImage}
            resizeMode="contain"
          />

          <View style={styles.qualitySealRow}>
            <Ionicons name="checkmark-circle" size={14} color={colors.successGreen} />
            <Text style={styles.qualitySealText}>2400 DPI Ultra HD Verified • Precision Die-Cut</Text>
          </View>
        </View>

        {/* Product Information & Rating */}
        <View style={styles.infoCard}>
          <Text style={styles.productMainTitle}>{card.title}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.starsWrap}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingScore}>{card.rating || '4.8'}</Text>
            </View>
            <Text style={styles.reviewCount}>({card.reviews_count || '1,420'}+ Customer Reviews)</Text>
            <View style={styles.dotSeparator} />
            <Text style={styles.inStockText}>In Stock</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceSymbol}>₹</Text>
            <Text style={styles.priceAmount}>{formattedTotal}</Text>
            <Text style={styles.priceForQty}>for {quantity} Units</Text>
            <View style={styles.unitRateBadge}>
              <Text style={styles.unitRateText}>₹{effectiveUnitRate.toFixed(2)}/card</Text>
            </View>
          </View>

          <Text style={styles.taxNotice}>Price includes all applicable GST taxes & digital pre-flight proof</Text>

          <Text style={styles.productDescription}>{card.description}</Text>
        </View>

        {/* 3. Customization Pathways Card */}
        <View style={styles.customizationCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="color-wand-outline" size={18} color={colors.primaryPink} />
            <Text style={styles.sectionHeading}>Design & Customization</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Choose your preferred way to personalize this product:</Text>

          {/* Action 1: Browse Templates */}
          <TouchableOpacity
            style={styles.customActionRow}
            onPress={() => navigation.navigate('BrowseTemplates', { card, quantity })}
            activeOpacity={0.88}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#FFEBF1' }]}>
              <Ionicons name="grid-outline" size={20} color={colors.primaryPink} />
            </View>
            <View style={styles.actionTextWrap}>
              <Text style={styles.actionTitle}>Choose from 4,000+ Templates</Text>
              <Text style={styles.actionDesc}>Pick ready-to-print corporate, luxury & creative layouts</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Action 2: Design Studio */}
          <TouchableOpacity
            style={styles.customActionRow}
            onPress={() => navigation.navigate('DesignStudio', { card, quantity })}
            activeOpacity={0.88}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#EBF5FF' }]}>
              <Ionicons name="create-outline" size={20} color={colors.primaryBlue} />
            </View>
            <View style={styles.actionTextWrap}>
              <Text style={styles.actionTitle}>Open 3D Design Studio</Text>
              <Text style={styles.actionDesc}>Live visual typography editor with real-time card preview</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Action 3: Upload Artwork */}
          <TouchableOpacity
            style={styles.customActionRow}
            onPress={() => navigation.navigate('UploadArtwork', { card, quantity })}
            activeOpacity={0.88}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#EAF8F1' }]}>
              <Ionicons name="cloud-upload-outline" size={20} color={colors.successGreen} />
            </View>
            <View style={styles.actionTextWrap}>
              <Text style={styles.actionTitle}>Upload Custom PDF / Artwork</Text>
              <Text style={styles.actionDesc}>Upload high-res files with instant bleed margin inspection</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
          </TouchableOpacity>
        </View>

        {/* 4. Product Options: Paper Stock */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Paper Stock & Weight</Text>
          <View style={styles.optionsList}>
            {PAPER_STOCKS.map((stock) => {
              const isSelected = selectedStock.id === stock.id;
              return (
                <TouchableOpacity
                  key={stock.id}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => setSelectedStock(stock)}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={isSelected ? colors.primaryPink : colors.secondaryText}
                  />
                  <View style={styles.optionTextCol}>
                    <Text style={[styles.optionName, isSelected && styles.optionNameSelected]}>
                      {stock.name}
                    </Text>
                    <Text style={styles.optionDesc}>{stock.desc}</Text>
                  </View>
                  <Text style={[styles.optionPriceTag, isSelected && styles.optionPriceTagSelected]}>
                    {stock.extra === 0 ? 'Standard' : `+₹${stock.extra.toFixed(2)}/card`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 5. Product Options: Finish Type */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Surface Finish & Coating</Text>
          <View style={styles.optionsList}>
            {FINISH_TYPES.map((finish) => {
              const isSelected = selectedFinish.id === finish.id;
              return (
                <TouchableOpacity
                  key={finish.id}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => setSelectedFinish(finish)}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={isSelected ? colors.primaryPink : colors.secondaryText}
                  />
                  <View style={styles.optionTextCol}>
                    <Text style={[styles.optionName, isSelected && styles.optionNameSelected]}>
                      {finish.name}
                    </Text>
                    <Text style={styles.optionDesc}>{finish.desc}</Text>
                  </View>
                  <Text style={[styles.optionPriceTag, isSelected && styles.optionPriceTagSelected]}>
                    {finish.extra === 0 ? 'Included' : `+₹${finish.extra.toFixed(2)}/card`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 6. Product Options: Corner Shape & Sides */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Corner Style & Printing Sides</Text>

          {/* Corner Selector */}
          <Text style={styles.subOptionLabel}>Corner Style:</Text>
          <View style={styles.pillsRow}>
            {CORNER_STYLES.map((corner) => {
              const isSelected = selectedCorner.id === corner.id;
              return (
                <TouchableOpacity
                  key={corner.id}
                  style={[styles.pillBtn, isSelected && styles.pillBtnSelected]}
                  onPress={() => setSelectedCorner(corner)}
                >
                  <Text style={[styles.pillBtnText, isSelected && styles.pillBtnTextSelected]}>
                    {corner.name} {corner.extra > 0 ? `(+₹${corner.extra})` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Printing Sides Selector */}
          <Text style={[styles.subOptionLabel, { marginTop: 14 }]}>Printing Sides:</Text>
          <View style={styles.pillsRow}>
            {PRINT_SIDES.map((side) => {
              const isSelected = selectedSide.id === side.id;
              return (
                <TouchableOpacity
                  key={side.id}
                  style={[styles.pillBtn, isSelected && styles.pillBtnSelected]}
                  onPress={() => setSelectedSide(side)}
                >
                  <Text style={[styles.pillBtnText, isSelected && styles.pillBtnTextSelected]}>
                    {side.name} {side.extra > 0 ? `(+₹${side.extra}/card)` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 7. Quantity Selector with Tier Savings */}
        <View style={styles.sectionCard}>
          <View style={styles.qtyTitleRow}>
            <Text style={styles.sectionHeading}>Quantity & Bulk Discounts</Text>
            <Text style={styles.savingsHighlight}>Save up to 25%</Text>
          </View>

          <View style={styles.qtyTiersGrid}>
            {QUANTITY_TIERS.map((tier) => {
              const isSelected = quantity === tier.qty;
              return (
                <TouchableOpacity
                  key={tier.qty}
                  style={[styles.qtyTierCard, isSelected && styles.qtyTierCardSelected]}
                  onPress={() => setQuantity(tier.qty)}
                  activeOpacity={0.85}
                >
                  {tier.discount > 0 && (
                    <View style={styles.discountPill}>
                      <Text style={styles.discountPillText}>{tier.discount}% OFF</Text>
                    </View>
                  )}
                  <Text style={[styles.qtyNumber, isSelected && styles.qtyNumberSelected]}>
                    {tier.qty}
                  </Text>
                  <Text style={styles.qtyUnitLabel}>Cards</Text>
                  <Text style={[styles.qtyTag, isSelected && styles.qtyTagSelected]}>
                    {tier.tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom Stepper */}
          <View style={styles.stepperRow}>
            <Text style={styles.stepperLabel}>Custom Quantity:</Text>
            <View style={styles.stepperControls}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setQuantity(Math.max(50, quantity - 50))}
              >
                <Ionicons name="remove" size={16} color={colors.primaryNavy} />
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setQuantity(quantity + 50)}
              >
                <Ionicons name="add" size={16} color={colors.primaryNavy} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 8. Delivery & PIN Code Checker */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Delivery & Turnaround</Text>
          <View style={styles.pincodeRow}>
            <Ionicons name="location-outline" size={18} color={colors.primaryNavy} style={styles.pincodeIcon} />
            <TextInput
              style={styles.pincodeInput}
              value={pincode}
              onChangeText={setPincode}
              placeholder="Enter PIN code (e.g. 500072)"
              keyboardType="numeric"
              maxLength={6}
            />
            <TouchableOpacity style={styles.checkPinBtn} onPress={handleCheckPincode}>
              <Text style={styles.checkPinBtnText}>Verify</Text>
            </TouchableOpacity>
          </View>

          {pincodeVerified && (
            <View style={styles.deliveryStatusBox}>
              <Ionicons name="airplane-outline" size={18} color={colors.primaryBlue} />
              <View style={styles.deliveryStatusTextWrap}>
                <Text style={styles.deliveryStatusTitle}>Express Priority Air Dispatch</Text>
                <Text style={styles.deliveryStatusSub}>
                  Orders placed today will dispatch within 24-48 hours to PIN {pincode}.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* 9. Specifications Table */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Product Specifications</Text>
          <View style={styles.specsTable}>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Card Dimensions</Text>
              <Text style={styles.specVal}>{card.dimensions || '8.9 cm x 5.1 cm'}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Paper Board</Text>
              <Text style={styles.specVal}>{selectedStock.name}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Finish Coating</Text>
              <Text style={styles.specVal}>{selectedFinish.name}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Print Resolution</Text>
              <Text style={styles.specVal}>2400 x 2400 DPI Ultra HD</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Bleed & Safety</Text>
              <Text style={styles.specVal}>3mm Safe Margin Bleed Verified</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 3. Fixed Bottom Purchase Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomPriceLabel}>Total ({quantity} Units)</Text>
          <Text style={styles.bottomPriceAmount}>₹{formattedTotal}</Text>
        </View>

        <View style={styles.bottomActionButtons}>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={handleAddToCart}
            activeOpacity={0.88}
          >
            <Ionicons name="cart-outline" size={17} color={colors.primaryPink} />
            <Text style={styles.addToCartBtnText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buyNowBtn}
            onPress={handleBuyNow}
            activeOpacity={0.88}
          >
            <Text style={styles.buyNowBtnText}>Buy Now</Text>
            <Ionicons name="flash" size={15} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
  },
  headerIconBtn: {
    padding: 6,
  },
  headerTitleWrap: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 1,
  },
  headerCartBtn: {
    padding: 6,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.primaryPink,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120, // Clean clearance above fixed purchase bar
    gap: 14,
  },
  imageCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  imageBadgePill: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: colors.primaryPink,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 2,
  },
  imageBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  productHeroImage: {
    width: '100%',
    height: 190,
    marginVertical: 10,
  },
  qualitySealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    width: '100%',
    justifyContent: 'center',
  },
  qualitySealText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.primaryNavy,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  productMainTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.primaryNavy,
    lineHeight: 24,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  starsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  reviewCount: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.secondaryText,
    marginHorizontal: 8,
  },
  inStockText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.successGreen,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  priceSymbol: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primaryPink,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primaryPink,
    marginLeft: 2,
  },
  priceForQty: {
    fontSize: 13,
    color: colors.secondaryText,
    marginLeft: 8,
    fontWeight: '600',
  },
  unitRateBadge: {
    marginLeft: 'auto',
    backgroundColor: '#FFEBF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  unitRateText: {
    color: colors.primaryPink,
    fontSize: 11,
    fontWeight: '800',
  },
  taxNotice: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  productDescription: {
    fontSize: 12.5,
    color: colors.secondaryText,
    lineHeight: 18,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  customizationCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(239, 28, 98, 0.25)',
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 12,
  },
  customActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  actionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextWrap: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  actionDesc: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  optionsList: {
    gap: 8,
    marginTop: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  optionCardSelected: {
    borderColor: colors.primaryPink,
    backgroundColor: '#FFF8FA',
  },
  optionTextCol: {
    flex: 1,
  },
  optionName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryNavy,
  },
  optionNameSelected: {
    color: colors.primaryPink,
    fontWeight: '800',
  },
  optionDesc: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 1,
  },
  optionPriceTag: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondaryText,
  },
  optionPriceTagSelected: {
    color: colors.primaryPink,
    fontWeight: '800',
  },
  subOptionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryNavy,
    marginTop: 10,
    marginBottom: 6,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillBtnSelected: {
    backgroundColor: '#FFEBF1',
    borderColor: colors.primaryPink,
  },
  pillBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondaryText,
  },
  pillBtnTextSelected: {
    color: colors.primaryPink,
    fontWeight: '800',
  },
  qtyTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsHighlight: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryPink,
  },
  qtyTiersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  qtyTierCard: {
    width: (screenWidth - 32 - 32 - 16) / 3,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  qtyTierCardSelected: {
    borderColor: colors.primaryPink,
    backgroundColor: '#FFF8FA',
  },
  discountPill: {
    position: 'absolute',
    top: -6,
    right: -4,
    backgroundColor: colors.successGreen,
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  discountPillText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: '800',
  },
  qtyNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  qtyNumberSelected: {
    color: colors.primaryPink,
  },
  qtyUnitLabel: {
    fontSize: 10,
    color: colors.secondaryText,
  },
  qtyTag: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
  },
  qtyTagSelected: {
    color: colors.primaryPink,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  stepperLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryNavy,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 2,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryNavy,
    paddingHorizontal: 16,
  },
  pincodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 44,
    marginTop: 10,
  },
  pincodeIcon: {
    marginRight: 8,
  },
  pincodeInput: {
    flex: 1,
    fontSize: 13,
    color: colors.primaryNavy,
  },
  checkPinBtn: {
    backgroundColor: colors.primaryPink,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  checkPinBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  deliveryStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    borderRadius: 10,
    padding: 10,
    gap: 10,
    marginTop: 10,
  },
  deliveryStatusTextWrap: {
    flex: 1,
  },
  deliveryStatusTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.primaryBlue,
  },
  deliveryStatusSub: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 1,
  },
  specsTable: {
    marginTop: 8,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  specKey: {
    fontSize: 12.5,
    color: colors.secondaryText,
  },
  specVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.primaryNavy,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 20,
  },
  bottomPriceCol: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 11,
    color: colors.secondaryText,
    fontWeight: '600',
  },
  bottomPriceAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primaryPink,
  },
  bottomActionButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FFEBF1',
    borderWidth: 1,
    borderColor: colors.primaryPink,
    gap: 4,
  },
  addToCartBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryPink,
  },
  buyNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.primaryPink,
    gap: 4,
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  buyNowBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.white,
  },
});
