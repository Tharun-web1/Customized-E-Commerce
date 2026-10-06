import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, theme } from '../../theme';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { uploadArtwork } from '../../api/uploadApi';
import { useCart } from '../../context/CartContext';

const { width } = Dimensions.get('window');

export const UploadArtworkScreen = ({ navigation, route }) => {
  const card = route.params?.card || {
    title: 'Standard Visiting Cards',
    slug: 'standard',
    base_price_100: 200.0,
    gsm: '350 GSM',
  };

  const { addItem, isLoading: isCartLoading } = useCart();

  const [frontImageUri, setFrontImageUri] = useState(null);
  const [backImageUri, setBackImageUri] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async (side = 'front', useCamera = false) => {
    try {
      let result;
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Needed', 'Camera permission is required to capture card artwork.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [16, 9],
          quality: 0.9,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Needed', 'Gallery access is required to select card artwork.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [16, 9],
          quality: 0.9,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        if (side === 'front') {
          setFrontImageUri(selectedUri);
        } else {
          setBackImageUri(selectedUri);
        }
      }
    } catch (e) {
      console.warn('Image pick error:', e);
    }
  };

  const handleAddUploadedArtworkToCart = async () => {
    if (!frontImageUri) {
      Alert.alert('Front Artwork Missing', 'Please upload or snap a photo of the front card design.');
      return;
    }

    setIsUploading(true);
    try {
      // Upload front design
      const frontUpload = await uploadArtwork(frontImageUri, 'custom_card_front.jpg');
      const frontUrl = frontUpload?.url || frontImageUri;

      let backUrl = '';
      if (backImageUri) {
        const backUpload = await uploadArtwork(backImageUri, 'custom_card_back.jpg');
        backUrl = backUpload?.url || backImageUri;
      }

      const unitPrice = 2.0;
      const backsideFee = backImageUri ? 0.50 * quantity : 0.0;
      const total = (unitPrice * quantity + backsideFee).toFixed(2);

      await addItem({
        card_id: card.id,
        title: card.title,
        card_title: card.title,
        quantity,
        corner_style: 'Standard',
        finish: 'Matte',
        backside: backImageUri ? 'Color' : 'Blank',
        preview_image: frontUrl,
        uploaded_artwork: frontUrl,
        back_preview_image: backUrl,
        uploaded_artwork_back: backUrl,
        template_name: 'Customer Uploaded Artwork',
        accent_color: '#002c5f',
        unit_price: unitPrice,
        total_price: Number(total),
      });

      Alert.alert('Artwork Saved!', 'Your customized artwork has been added to the cart.', [
        { text: 'Keep Uploading', style: 'cancel' },
        { text: 'Go to Cart', onPress: () => navigation.navigate('CartTab') },
      ]);
    } catch (err) {
      Alert.alert('Upload Error', 'Failed to upload artwork. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Upload Print-Ready Artwork"
        subtitle="Full HD Bleed & Safety Inspection"
        showBack
        navigation={navigation}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Bleed Guide Note */}
        <View style={styles.guideCard}>
          <Ionicons name="information-circle" size={20} color={colors.secondaryDark} />
          <View style={styles.guideTextWrap}>
            <Text style={styles.guideTitle}>Print Artwork Checklist</Text>
            <Text style={styles.guideDesc}>
              Keep crucial text and logos 3mm inside the cut borders. Supported formats: JPG, PNG, WEBP.
            </Text>
          </View>
        </View>

        {/* Front Artwork Upload Section */}
        <View style={styles.uploadCard}>
          <View style={styles.uploadHeader}>
            <Text style={styles.uploadHeaderTitle}>Front Side Design (Required)</Text>
            {frontImageUri && (
              <TouchableOpacity onPress={() => setFrontImageUri(null)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          {frontImageUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: frontImageUri }} style={styles.previewImage} resizeMode="cover" />
              <View style={styles.bleedBorderOverlay} />
            </View>
          ) : (
            <View style={styles.emptyUploadBox}>
              <Ionicons name="image-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyUploadTitle}>No Front Artwork Selected</Text>
              <Text style={styles.emptyUploadSubtitle}>Resolution recommended: 1050 x 600 px (300 DPI)</Text>
            </View>
          )}

          <View style={styles.actionButtonRow}>
            <TouchableOpacity
              style={styles.pickerBtn}
              onPress={() => pickImage('front', false)}
            >
              <Ionicons name="images-outline" size={16} color={colors.primary} />
              <Text style={styles.pickerBtnText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pickerBtn}
              onPress={() => pickImage('front', true)}
            >
              <Ionicons name="camera-outline" size={16} color={colors.primary} />
              <Text style={styles.pickerBtnText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Back Artwork Upload Section */}
        <View style={styles.uploadCard}>
          <View style={styles.uploadHeader}>
            <Text style={styles.uploadHeaderTitle}>Back Side Design (Optional)</Text>
            {backImageUri && (
              <TouchableOpacity onPress={() => setBackImageUri(null)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          {backImageUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: backImageUri }} style={styles.previewImage} resizeMode="cover" />
              <View style={styles.bleedBorderOverlay} />
            </View>
          ) : (
            <View style={styles.emptyUploadBox}>
              <Ionicons name="image-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyUploadTitle}>Leave blank for plain white back</Text>
              <Text style={styles.emptyUploadSubtitle}>Or upload back side artwork (+₹0.50/card)</Text>
            </View>
          )}

          <View style={styles.actionButtonRow}>
            <TouchableOpacity
              style={styles.pickerBtn}
              onPress={() => pickImage('back', false)}
            >
              <Ionicons name="images-outline" size={16} color={colors.primary} />
              <Text style={styles.pickerBtnText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pickerBtn}
              onPress={() => pickImage('back', true)}
            >
              <Ionicons name="camera-outline" size={16} color={colors.primary} />
              <Text style={styles.pickerBtnText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quantity Selection */}
        <View style={styles.qtySection}>
          <Text style={styles.qtyTitle}>Quantity to Print</Text>
          <View style={styles.qtyPillsRow}>
            {[100, 250, 500, 1000].map((q) => (
              <TouchableOpacity
                key={q}
                style={[styles.qtyPill, quantity === q && styles.qtyPillActive]}
                onPress={() => setQuantity(q)}
              >
                <Text style={[styles.qtyPillText, quantity === q && styles.qtyPillTextActive]}>
                  {q} Cards
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.footerBar}>
        <View>
          <Text style={styles.footerQty}>{quantity} Cards • Uploaded Artwork</Text>
          <Text style={styles.footerPrice}>₹{(2.0 * quantity + (backImageUri ? 0.50 * quantity : 0)).toFixed(2)}</Text>
        </View>

        <Button
          title={isUploading ? 'Uploading...' : 'Add to Cart'}
          variant="primary"
          loading={isUploading || isCartLoading}
          onPress={handleAddUploadedArtworkToCart}
          icon={<Ionicons name="cart" size={18} color={colors.textInverted} />}
          style={styles.addCartBtn}
        />
      </View>
    </View>
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
  guideCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.secondaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  guideTextWrap: {
    flex: 1,
  },
  guideTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  guideDesc: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  uploadCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  uploadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  uploadHeaderTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  removeText: {
    fontSize: typography.fontSizes.xs,
    color: colors.danger,
    fontWeight: typography.fontWeights.semibold,
  },
  previewContainer: {
    height: 160,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0f172a',
    marginVertical: spacing.xs,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  bleedBorderOverlay: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: 6,
    right: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderStyle: 'dashed',
    borderRadius: borderRadius.xs,
  },
  emptyUploadBox: {
    height: 130,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginVertical: spacing.xs,
  },
  emptyUploadTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  emptyUploadSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  actionButtonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  pickerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryLight,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  pickerBtnText: {
    color: colors.primary,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  qtySection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  qtyPillsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  qtyPill: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  qtyPillText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.semibold,
  },
  qtyPillTextActive: {
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
  footerQty: {
    fontSize: 11,
    color: colors.textMuted,
  },
  footerPrice: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.primary,
  },
  addCartBtn: {
    minWidth: 140,
  },
});
