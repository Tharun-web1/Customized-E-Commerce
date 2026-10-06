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
import { Button } from '../../components/common/Button';
import { useCart } from '../../context/CartContext';
import { useSession } from '../../context/SessionContext';

export const CheckoutScreen = ({ navigation, route }) => {
  const { grandTotal, clearCart } = useCart();
  const { userProfile, saveProfile } = useSession();

  // Form State
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [state, setState] = useState(userProfile?.state || '');
  const [pincode, setPincode] = useState(userProfile?.pincode || '110001');
  const [company, setCompany] = useState(userProfile?.company || '');
  const [gstin, setGstin] = useState(userProfile?.gstin || '');

  // Checkout Options
  const [deliverySpeed, setDeliverySpeed] = useState('express'); // 'standard' | 'express'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'cards' | 'cod'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      Alert.alert('Required Fields', 'Please fill in your name, phone, delivery address, city and pincode.');
      return;
    }

    setIsSubmitting(true);

    // Save profile for subsequent visits
    await saveProfile({
      fullName,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      company,
      gstin,
    });

    // Simulate pre-flight processing
    setTimeout(() => {
      setIsSubmitting(false);
      const orderRef = `ASAP-${Math.floor(100000 + Math.random() * 900000)}`;
      clearCart();
      navigation.replace('OrderSuccess', {
        orderRef,
        customerName: fullName,
        totalAmount: grandTotal,
        paymentMethod,
        deliverySpeed,
      });
    }, 1200);
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header
        title="Checkout & Shipping"
        subtitle="Step 2 of 2 • Secure Order Confirmation"
        showBack
        navigation={navigation}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Contact Information */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>1. Contact & Customer Details</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Vikramaditya Sharma"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Mobile Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 98765 43210"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="order@company.in"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>2. Shipping Address</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Flat / Building / Street Address *</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Office No. 402, 4th Floor, Tech Hub Tower"
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Bangalore"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>PIN Code *</Text>
              <TextInput
                style={styles.input}
                placeholder="560001"
                keyboardType="numeric"
                maxLength={6}
                value={pincode}
                onChangeText={setPincode}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>State</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Karnataka"
              value={state}
              onChangeText={setState}
            />
          </View>
        </View>

        {/* Delivery Tier Selection */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="airplane-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>3. Delivery Speed</Text>
          </View>

          <TouchableOpacity
            style={[styles.tierOption, deliverySpeed === 'express' && styles.tierOptionActive]}
            onPress={() => setDeliverySpeed('express')}
          >
            <View style={styles.tierRadio}>
              {deliverySpeed === 'express' && <View style={styles.tierRadioInner} />}
            </View>
            <View style={styles.tierTextWrap}>
              <Text style={styles.tierTitle}>Priority Air Express (Recommended)</Text>
              <Text style={styles.tierDesc}>24–48 Hours Dispatch with BlueDart Air tracking.</Text>
            </View>
            <Text style={styles.tierPrice}>Included</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tierOption, deliverySpeed === 'standard' && styles.tierOptionActive]}
            onPress={() => setDeliverySpeed('standard')}
          >
            <View style={styles.tierRadio}>
              {deliverySpeed === 'standard' && <View style={styles.tierRadioInner} />}
            </View>
            <View style={styles.tierTextWrap}>
              <Text style={styles.tierTitle}>Standard Surface Delivery</Text>
              <Text style={styles.tierDesc}>3–5 Business Days delivery via ground transport.</Text>
            </View>
            <Text style={styles.tierPrice}>Free</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Method */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>4. Payment Method</Text>
          </View>

          <TouchableOpacity
            style={[styles.payOption, paymentMethod === 'upi' && styles.payOptionActive]}
            onPress={() => setPaymentMethod('upi')}
          >
            <Ionicons name="qr-code-outline" size={20} color={colors.primary} />
            <View style={styles.payTextWrap}>
              <Text style={styles.payTitle}>UPI / QR Code / GPay / PhonePe</Text>
              <Text style={styles.payDesc}>Instant verification with 100% secure payment gateway.</Text>
            </View>
            {paymentMethod === 'upi' && <Ionicons name="checkmark-circle" size={18} color={colors.success} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.payOption, paymentMethod === 'cards' && styles.payOptionActive]}
            onPress={() => setPaymentMethod('cards')}
          >
            <Ionicons name="card-outline" size={20} color={colors.primary} />
            <View style={styles.payTextWrap}>
              <Text style={styles.payTitle}>Credit / Debit Cards & Net Banking</Text>
              <Text style={styles.payDesc}>Visa, MasterCard, RuPay, Corporate Cards.</Text>
            </View>
            {paymentMethod === 'cards' && <Ionicons name="checkmark-circle" size={18} color={colors.success} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.payOption, paymentMethod === 'cod' && styles.payOptionActive]}
            onPress={() => setPaymentMethod('cod')}
          >
            <Ionicons name="cash-outline" size={20} color={colors.primary} />
            <View style={styles.payTextWrap}>
              <Text style={styles.payTitle}>Cash on Delivery (COD)</Text>
              <Text style={styles.payDesc}>Pay upon physical delivery inspection.</Text>
            </View>
            {paymentMethod === 'cod' && <Ionicons name="checkmark-circle" size={18} color={colors.success} />}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Order Button */}
      <View style={styles.stickyFooter}>
        <View style={styles.footerPriceWrap}>
          <Text style={styles.footerPriceLabel}>Payable Amount</Text>
          <Text style={styles.footerPriceVal}>₹{grandTotal.toFixed(2)}</Text>
        </View>

        <Button
          title="Confirm & Place Order"
          variant="primary"
          size="md"
          loading={isSubmitting}
          onPress={handlePlaceOrder}
          iconRight={<Ionicons name="shield-checkmark" size={16} color={colors.textInverted} />}
          style={styles.orderBtn}
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
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  inputGroup: {
    marginBottom: spacing.sm,
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
  input: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 42,
    fontSize: typography.fontSizes.sm,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  multilineInput: {
    height: 60,
    paddingTop: 8,
    textAlignVertical: 'top',
  },
  tierOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  tierOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 44, 95, 0.04)',
  },
  tierRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  tierRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  tierTextWrap: {
    flex: 1,
  },
  tierTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  tierDesc: {
    fontSize: 10.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tierPrice: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.success,
  },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  payOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 44, 95, 0.04)',
  },
  payTextWrap: {
    flex: 1,
  },
  payTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  payDesc: {
    fontSize: 10.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stickyFooter: {
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
  footerPriceWrap: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  footerPriceVal: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.primary,
  },
  orderBtn: {
    minWidth: 190,
  },
});
