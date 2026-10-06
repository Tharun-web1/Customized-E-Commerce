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
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Header } from '../../components/common/Header';
import { saveAddress } from '../../api/addressApi';

export const AddEditAddressScreen = ({ navigation, route }) => {
  const existing = route.params?.address;
  const isEditing = !!existing;

  const [name, setName] = useState(existing?.name || 'Home');
  const [recipientName, setRecipientName] = useState(existing?.recipientName || '');
  const [phone, setPhone] = useState(existing?.phone || '');
  const [addressLine1, setAddressLine1] = useState(existing?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(existing?.addressLine2 || '');
  const [city, setCity] = useState(existing?.city || 'Hyderabad');
  const [state, setState] = useState(existing?.state || 'Telangana');
  const [pincode, setPincode] = useState(existing?.pincode || '500072');
  const [landmark, setLandmark] = useState(existing?.landmark || '');
  const [isDefault, setIsDefault] = useState(existing?.isDefault || false);
  const [saving, setSaving] = useState(false);

  const TAGS = ['Home', 'Office', 'Factory / Print Shop', 'Other'];

  const handleSave = async () => {
    if (!recipientName.trim() || !phone.trim() || !addressLine1.trim() || !city.trim() || !pincode.trim()) {
      Alert.alert('Required Fields', 'Please fill in recipient name, phone, address, city and PIN code.');
      return;
    }

    setSaving(true);
    await saveAddress({
      ...(existing || {}),
      name,
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      landmark: landmark.trim(),
      isDefault,
    });
    setSaving(false);

    Alert.alert('Address Saved', `Address "${name}" has been ${isEditing ? 'updated' : 'added'}.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header
        title={isEditing ? 'Edit Address' : 'Add New Address'}
        subtitle="Ensure accurate doorstep express dispatch"
        showBack
        navigation={navigation}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Address Type Tag Selector */}
        <View style={styles.card}>
          <Text style={styles.label}>Address Label / Type</Text>
          <View style={styles.tagsRow}>
            {TAGS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tagChip, name === t && styles.tagChipActive]}
                onPress={() => setName(t)}
              >
                <Text style={[styles.tagChipText, name === t && styles.tagChipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Contact Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient Full Name *</Text>
            <TextInput
              style={styles.input}
              value={recipientName}
              onChangeText={setRecipientName}
              placeholder="e.g. Vikramaditya Sharma"
              placeholderTextColor={colors.secondaryText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>10-Digit Mobile Number *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 98765 43210"
              keyboardType="phone-pad"
              placeholderTextColor={colors.secondaryText}
            />
          </View>
        </View>

        {/* Address Fields */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Address Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Flat / House / Building / Street *</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={addressLine1}
              onChangeText={setAddressLine1}
              placeholder="Flat 402, Royal Palms, Road No. 1"
              multiline
              placeholderTextColor={colors.secondaryText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Colony / Area / Locality</Text>
            <TextInput
              style={styles.input}
              value={addressLine2}
              onChangeText={setAddressLine2}
              placeholder="KPHB Colony Phase 1"
              placeholderTextColor={colors.secondaryText}
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Hyderabad"
                placeholderTextColor={colors.secondaryText}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>PIN Code *</Text>
              <TextInput
                style={styles.input}
                value={pincode}
                onChangeText={setPincode}
                placeholder="500072"
                keyboardType="numeric"
                placeholderTextColor={colors.secondaryText}
              />
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                value={state}
                onChangeText={setState}
                placeholder="Telangana"
                placeholderTextColor={colors.secondaryText}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Landmark</Text>
              <TextInput
                style={styles.input}
                value={landmark}
                onChangeText={setLandmark}
                placeholder="Near Forum Mall"
                placeholderTextColor={colors.secondaryText}
              />
            </View>
          </View>
        </View>

        {/* Set as Default Address Toggle */}
        <View style={[styles.card, styles.toggleCard]}>
          <View style={styles.toggleTextWrap}>
            <Text style={styles.toggleTitle}>Set as Default Delivery Address</Text>
            <Text style={styles.toggleSub}>Use this address automatically for all future orders.</Text>
          </View>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ false: '#CBD5E1', true: '#FCE7F3' }}
            thumbColor={isDefault ? colors.primaryPink : '#94A3B8'}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.88}>
          <Ionicons name="checkmark-circle" size={18} color={colors.white} />
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : isEditing ? 'Update Address' : 'Save Address'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryNavy,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryNavy,
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tagChipActive: {
    backgroundColor: '#FFEBF1',
    borderColor: colors.primaryPink,
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondaryText,
  },
  tagChipTextActive: {
    color: colors.primaryPink,
  },
  inputGroup: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 13.5,
    color: colors.primaryNavy,
    borderWidth: 1,
    borderColor: colors.border,
  },
  multilineInput: {
    height: 60,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  toggleTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  toggleSub: {
    fontSize: 11.5,
    color: colors.secondaryText,
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: colors.primaryPink,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
