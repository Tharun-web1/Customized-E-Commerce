import React, { useState, useEffect } from 'react';
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
import { colors } from '../../theme/colors';
import { Header } from '../../components/common/Header';
import { useSession } from '../../context/SessionContext';
import { fetchUserProfile, updateUserProfile } from '../../api/profileApi';

export const EditProfileScreen = ({ navigation }) => {
  const { userProfile, saveProfile, customerUser } = useSession();

  const [fullName, setFullName] = useState(userProfile?.fullName || customerUser?.fullName || '');
  const [email, setEmail] = useState(userProfile?.email || customerUser?.identifier || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [company, setCompany] = useState(userProfile?.company || '');
  const [gstin, setGstin] = useState(userProfile?.gstin || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [city, setCity] = useState(userProfile?.city || 'Hyderabad');
  const [state, setState] = useState(userProfile?.state || 'Telangana');
  const [pincode, setPincode] = useState(userProfile?.pincode || '500072');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Required Field', 'Please enter your full name.');
      return;
    }

    setSaving(true);
    const updated = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      gstin: gstin.trim().toUpperCase(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
    };

    await saveProfile(updated);
    await updateUserProfile(updated);
    setSaving(false);

    Alert.alert('Profile Updated', 'Your customer account details have been saved successfully.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Edit Profile" subtitle="Manage your personal & business details" showBack navigation={navigation} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Spotlight */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>
              {(fullName || 'C').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.avatarSub}>{email || phone || 'Customer'}</Text>
        </View>

        {/* Personal Details */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Personal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. Vikramaditya Sharma"
              placeholderTextColor={colors.secondaryText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="customer@domain.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.secondaryText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
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

        {/* Business & GSTIN Information */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Business & Billing (Optional)</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company / Brand Name</Text>
            <TextInput
              style={styles.input}
              value={company}
              onChangeText={setCompany}
              placeholder="e.g. Vertex Solutions LLP"
              placeholderTextColor={colors.secondaryText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>GSTIN (for Input Tax Credit)</Text>
            <TextInput
              style={styles.input}
              value={gstin}
              onChangeText={setGstin}
              placeholder="36AAAAA0000A1Z5"
              autoCapitalize="characters"
              placeholderTextColor={colors.secondaryText}
            />
          </View>
        </View>

        {/* Primary Delivery Address */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Default Delivery Address</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Street / Flat Address</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={address}
              onChangeText={setAddress}
              placeholder="Flat 402, Royal Palms, KPHB Phase 1"
              multiline
              placeholderTextColor={colors.secondaryText}
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Hyderabad"
                placeholderTextColor={colors.secondaryText}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>PIN Code</Text>
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
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.88}>
          <Ionicons name="checkmark-circle" size={18} color={colors.white} />
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Profile Changes'}</Text>
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryNavy,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFEBF1',
  },
  avatarLetter: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '800',
  },
  avatarSub: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 6,
    fontWeight: '600',
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
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryNavy,
    marginBottom: 6,
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
    height: 64,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
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
