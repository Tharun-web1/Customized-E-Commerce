import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, theme } from '../../theme';
import { Header } from '../../components/common/Header';
import { CardMockupPreview } from '../../components/common/CardMockupPreview';
import { Button } from '../../components/common/Button';
import { useCart } from '../../context/CartContext';

const STUDIO_COLORS = [
  { name: 'Navy', hex: '#002c5f' },
  { name: 'Vivid Blue', hex: '#0099ff' },
  { name: 'Dark Slate', hex: '#0f172a' },
  { name: 'Emerald', hex: '#047857' },
  { name: 'Crimson', hex: '#dc2626' },
  { name: 'Purple', hex: '#7c3aed' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Obsidian', hex: '#09090b' },
  { name: 'Gold Foil', hex: '#d4af37' },
];

const QUICK_ICONS = [
  { id: 'phone', name: 'call', label: 'Call' },
  { id: 'whatsapp', name: 'logo-whatsapp', label: 'WhatsApp' },
  { id: 'mail', name: 'mail', label: 'Email' },
  { id: 'globe', name: 'globe', label: 'Web' },
  { id: 'location', name: 'location', label: 'Map' },
  { id: 'shield', name: 'shield-checkmark', label: 'Trust' },
  { id: 'star', name: 'star', label: 'Star' },
  { id: 'qr', name: 'qr-code', label: 'QR' },
];

export const DesignStudioScreen = ({ navigation, route }) => {
  const card = route.params?.card || {
    title: 'Standard Visiting Cards',
    slug: 'standard',
    base_price_100: 200.0,
    gsm: '350 GSM',
  };
  const template = route.params?.template;

  const { addItem, isLoading: isCartLoading } = useCart();

  // Customization Form State
  const [activeSide, setActiveSide] = useState('front');
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'colors' | 'icons' | 'options'

  const [customName, setCustomName] = useState(template?.sample_name || 'Aditya Sharma');
  const [customTitle, setCustomTitle] = useState(template?.sample_job_title || 'Managing Director');
  const [customCompany, setCustomCompany] = useState(template?.sample_company || 'Vertex Solutions Pvt Ltd');
  const [customPhone, setCustomPhone] = useState(template?.sample_phone || '+91 98765 43210');
  const [customEmail, setCustomEmail] = useState(template?.sample_email || 'contact@vertex.in');
  const [customAddress, setCustomAddress] = useState('Ground Floor, Tech Park, Bangalore 560001');
  const [customQrUrl, setCustomQrUrl] = useState('https://vertexsolutions.in');

  const [accentColor, setAccentColor] = useState(template?.primary_color || card.accent_color || '#002c5f');
  const [orientation, setOrientation] = useState(template?.orientation || 'horizontal');
  const [cornerStyle, setCornerStyle] = useState(route.params?.cornerStyle || 'Standard');
  const [finish, setFinish] = useState('Matte');
  const [backside, setBackside] = useState('Blank');
  const [quantity, setQuantity] = useState(route.params?.quantity || 100);

  // Price calculations
  const baseRate = Number(card.base_price_100 || 200.0) / 100;
  let discountMultiplier = 1.0;
  if (quantity >= 2000) discountMultiplier = 0.75;
  else if (quantity >= 1000) discountMultiplier = 0.80;
  else if (quantity >= 500) discountMultiplier = 0.88;
  else if (quantity >= 200) discountMultiplier = 0.95;

  const unitPrice = (baseRate * discountMultiplier).toFixed(2);
  const backsideExtra = backside === 'Color' ? 0.50 * quantity : 0.0;
  const cornerExtra = cornerStyle === 'Rounded' ? 30.0 : 0.0;
  const totalPrice = (Number(unitPrice) * quantity + backsideExtra + cornerExtra).toFixed(2);

  const handleAddToCart = async () => {
    if (!customName.trim()) {
      Alert.alert('Name Required', 'Please enter a name for the visiting card.');
      return;
    }

    try {
      await addItem({
        card_id: card.id,
        title: card.title,
        card_title: card.title,
        card_slug: card.slug,
        gsm: card.gsm || '350 GSM',
        quantity,
        corner_style: cornerStyle,
        finish,
        backside,
        custom_name: customName,
        custom_title: customTitle,
        custom_company: customCompany,
        custom_phone: customPhone,
        custom_email: customEmail,
        custom_qr_url: customQrUrl,
        template_name: template?.title || 'Custom Studio Design',
        accent_color: accentColor,
        unit_price: Number(unitPrice),
        total_price: Number(totalPrice),
      });

      Alert.alert(
        'Added to Cart!',
        `${quantity} customized ${card.title} added to your shopping cart.`,
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'View Cart', onPress: () => navigation.navigate('CartTab') },
        ]
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title="Mobile Design Studio"
        subtitle={`${card.title} • Live 3D Preview`}
        showBack
        navigation={navigation}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Card Mockup Canvas */}
        <View style={styles.canvasContainer}>
          <CardMockupPreview
            side={activeSide}
            onToggleSide={setActiveSide}
            cardTitle={card.title}
            customName={customName}
            customTitle={customTitle}
            customCompany={customCompany}
            customPhone={customPhone}
            customEmail={customEmail}
            accentColor={accentColor}
            cornerStyle={cornerStyle}
            orientation={orientation}
            interactive={true}
          />
        </View>

        {/* Studio Tool Navigation Tabs */}
        <View style={styles.toolTabs}>
          <TouchableOpacity
            style={[styles.toolTab, activeTab === 'text' && styles.toolTabActive]}
            onPress={() => setActiveTab('text')}
          >
            <Ionicons
              name="text"
              size={16}
              color={activeTab === 'text' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.toolTabText, activeTab === 'text' && styles.toolTabTextActive]}>
              Text
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolTab, activeTab === 'colors' && styles.toolTabActive]}
            onPress={() => setActiveTab('colors')}
          >
            <Ionicons
              name="color-palette"
              size={16}
              color={activeTab === 'colors' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.toolTabText, activeTab === 'colors' && styles.toolTabTextActive]}>
              Colors
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolTab, activeTab === 'icons' && styles.toolTabActive]}
            onPress={() => setActiveTab('icons')}
          >
            <Ionicons
              name="shapes"
              size={16}
              color={activeTab === 'icons' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.toolTabText, activeTab === 'icons' && styles.toolTabTextActive]}>
              Badges
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolTab, activeTab === 'options' && styles.toolTabActive]}
            onPress={() => setActiveTab('options')}
          >
            <Ionicons
              name="options"
              size={16}
              color={activeTab === 'options' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.toolTabText, activeTab === 'options' && styles.toolTabTextActive]}>
              Options
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Text Customizer */}
        {activeTab === 'text' && (
          <View style={styles.tabContent}>
            <Text style={styles.tabSectionTitle}>Card Contact & Identity Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={customName}
                onChangeText={setCustomName}
                placeholder="e.g. Aditya Sharma"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Job Title / Designation</Text>
              <TextInput
                style={styles.textInput}
                value={customTitle}
                onChangeText={setCustomTitle}
                placeholder="e.g. Managing Director"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Company / Business Name</Text>
              <TextInput
                style={styles.textInput}
                value={customCompany}
                onChangeText={setCustomCompany}
                placeholder="e.g. Vertex Solutions Pvt Ltd"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={customPhone}
                  onChangeText={setCustomPhone}
                  placeholder="+91 98765 43210"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.textInput}
                  value={customEmail}
                  onChangeText={setCustomEmail}
                  placeholder="name@domain.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Office Address / Website</Text>
              <TextInput
                style={styles.textInput}
                value={customAddress}
                onChangeText={setCustomAddress}
                placeholder="Office location"
              />
            </View>
          </View>
        )}

        {/* Tab 2: Color Palette */}
        {activeTab === 'colors' && (
          <View style={styles.tabContent}>
            <Text style={styles.tabSectionTitle}>Accent & Theme Colors</Text>
            <Text style={styles.tabSectionSubtitle}>
              Select from curated executive palettes or metallic foil tones.
            </Text>

            <View style={styles.colorsGrid}>
              {STUDIO_COLORS.map((col) => (
                <TouchableOpacity
                  key={col.hex}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: col.hex },
                    accentColor === col.hex && styles.colorCircleActive,
                  ]}
                  onPress={() => setAccentColor(col.hex)}
                  activeOpacity={0.8}
                >
                  {accentColor === col.hex && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={col.hex === '#ffffff' ? colors.primary : '#ffffff'}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.orientationSwitchBox}>
              <Text style={styles.inputLabel}>Card Orientation</Text>
              <View style={styles.orientationButtons}>
                <TouchableOpacity
                  style={[styles.orientBtn, orientation === 'horizontal' && styles.orientBtnActive]}
                  onPress={() => setOrientation('horizontal')}
                >
                  <Text style={[styles.orientBtnText, orientation === 'horizontal' && styles.orientBtnTextActive]}>
                    Horizontal (Standard)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.orientBtn, orientation === 'vertical' && styles.orientBtnActive]}
                  onPress={() => setOrientation('vertical')}
                >
                  <Text style={[styles.orientBtnText, orientation === 'vertical' && styles.orientBtnTextActive]}>
                    Vertical (Modern)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Tab 3: Badges & Vector Elements */}
        {activeTab === 'icons' && (
          <View style={styles.tabContent}>
            <Text style={styles.tabSectionTitle}>Vector Elements & Contact Icons</Text>
            <Text style={styles.tabSectionSubtitle}>
              Tap to include relevant business badges and channel icons.
            </Text>

            <View style={styles.iconsGrid}>
              {QUICK_ICONS.map((ic) => (
                <View key={ic.id} style={styles.iconCard}>
                  <View style={[styles.iconCircle, { backgroundColor: 'rgba(0, 44, 95, 0.08)' }]}>
                    <Ionicons name={ic.name} size={22} color={accentColor} />
                  </View>
                  <Text style={styles.iconLabel}>{ic.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tab 4: Print Options & Finishes */}
        {activeTab === 'options' && (
          <View style={styles.tabContent}>
            <Text style={styles.tabSectionTitle}>Paper Finish & Backside Printing</Text>

            <View style={styles.optionsBlock}>
              <Text style={styles.inputLabel}>Finish Coating</Text>
              <View style={styles.pillRow}>
                {['Matte', 'Glossy', 'Velvet Soft-Touch'].map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.pillOption, finish === f && styles.pillOptionActive]}
                    onPress={() => setFinish(f)}
                  >
                    <Text style={[styles.pillText, finish === f && styles.pillTextActive]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.optionsBlock}>
              <Text style={styles.inputLabel}>Backside Print</Text>
              <View style={styles.pillRow}>
                {['Blank', 'Color', 'Monochrome'].map((b) => (
                  <TouchableOpacity
                    key={b}
                    style={[styles.pillOption, backside === b && styles.pillOptionActive]}
                    onPress={() => setBackside(b)}
                  >
                    <Text style={[styles.pillText, backside === b && styles.pillTextActive]}>{b}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.optionsBlock}>
              <Text style={styles.inputLabel}>Corners</Text>
              <View style={styles.pillRow}>
                {['Standard', 'Rounded'].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.pillOption, cornerStyle === c && styles.pillOptionActive]}
                    onPress={() => setCornerStyle(c)}
                  >
                    <Text style={[styles.pillText, cornerStyle === c && styles.pillTextActive]}>
                      {c === 'Standard' ? 'Square 90°' : 'Rounded 6mm'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.footerBar}>
        <View style={styles.footerPriceCol}>
          <Text style={styles.footerQty}>{quantity} Cards • ₹{unitPrice}/pc</Text>
          <Text style={styles.footerTotal}>₹{totalPrice}</Text>
        </View>

        <Button
          title="Add to Cart"
          variant="primary"
          size="md"
          loading={isCartLoading}
          onPress={handleAddToCart}
          icon={<Ionicons name="cart" size={18} color={colors.textInverted} />}
          style={styles.addCartBtn}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 110,
  },
  canvasContainer: {
    marginBottom: spacing.md,
  },
  toolTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: 4,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toolTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  toolTabActive: {
    backgroundColor: 'rgba(0, 44, 95, 0.08)',
  },
  toolTabText: {
    fontSize: typography.fontSizes.xs + 1,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  toolTabTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeights.bold,
  },
  tabContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabSectionTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  tabSectionSubtitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inputLabel: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 42,
    fontSize: typography.fontSizes.sm,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginVertical: spacing.md,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleActive: {
    borderColor: colors.secondary,
    transform: [{ scale: 1.1 }],
  },
  orientationSwitchBox: {
    marginTop: spacing.md,
  },
  orientationButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 4,
  },
  orientBtn: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  orientBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  orientBtnText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  orientBtnTextActive: {
    color: colors.textInverted,
    fontWeight: typography.fontWeights.bold,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  iconCard: {
    width: '21%',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  optionsBlock: {
    marginBottom: spacing.md,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: 4,
  },
  pillOption: {
    backgroundColor: colors.surfaceSubtle,
    paddingVertical: spacing.sm - 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  pillTextActive: {
    color: colors.textInverted,
    fontWeight: typography.fontWeights.bold,
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  footerPriceCol: {
    flex: 1,
  },
  footerQty: {
    fontSize: 11,
    color: colors.textMuted,
  },
  footerTotal: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.primary,
  },
  addCartBtn: {
    minWidth: 140,
  },
});
