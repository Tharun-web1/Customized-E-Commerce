import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, theme } from '../../theme';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { useSession } from '../../context/SessionContext';
import { SUPPORT_PHONE, SUPPORT_EMAIL, SUPPORT_WHATSAPP } from '../../constants/config';

export const ProfileScreen = ({ navigation }) => {
  const { userProfile, saveProfile, customerUser, logout } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(userProfile?.fullName || customerUser?.fullName || '');
  const [email, setEmail] = useState(userProfile?.email || customerUser?.identifier || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [company, setCompany] = useState(userProfile?.company || '');
  const [gstin, setGstin] = useState(userProfile?.gstin || '');

  const handleSave = async () => {
    await saveProfile({
      fullName,
      email,
      phone,
      address,
      company,
      gstin,
    });
    setIsEditing(false);
    Alert.alert('Profile Saved', 'Your delivery address and account details have been updated.');
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <Header
        title="My Profile"
        subtitle="Saved Addresses & Account Details"
        navigation={navigation}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Customer Profile Spotlight Card */}
        <View style={[styles.profileCard, theme.shadows.sm]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>
              {(fullName || 'C').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfoWrap}>
            <Text style={styles.profileName}>{fullName || 'Valued Customer'}</Text>
            <Text style={styles.profilePhone}>{phone || email || 'customer@domain.com'}</Text>
            {company ? <Text style={styles.profileCompany}>{company}</Text> : null}
          </View>
          <TouchableOpacity
            style={styles.editIconBtn}
            onPress={() => setIsEditing(!isEditing)}
            accessibilityLabel="Edit Profile"
          >
            <Ionicons name={isEditing ? 'close' : 'create-outline'} size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Edit Mode */}
        {isEditing && (
          <View style={[styles.formCard, theme.shadows.sm]}>
            <Text style={styles.formTitle}>Edit Delivery & Profile Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="e.g. Vikramaditya Sharma" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+91 98765 43210" keyboardType="phone-pad" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="customer@domain.com" keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Company / Business Name (Optional)</Text>
              <TextInput style={styles.input} value={company} onChangeText={setCompany} placeholder="e.g. Vertex Solutions" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>GSTIN (for Input Tax Credit)</Text>
              <TextInput style={styles.input} value={gstin} onChangeText={setGstin} placeholder="22AAAAA0000A1Z5" autoCapitalize="characters" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Delivery Address</Text>
              <TextInput style={[styles.input, styles.multilineInput]} value={address} onChangeText={setAddress} placeholder="Office or Home address" multiline />
            </View>

            <Button title="Save Profile Details" variant="primary" size="md" onPress={handleSave} style={styles.saveBtn} />
          </View>
        )}

        {/* Customer Menu Navigation Options */}
        <View style={styles.menuCard}>
          {/* 1. My Orders */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('MyOrders')}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#FFEBF1' }]}>
              <Ionicons name="receipt-outline" size={18} color={colors.primaryPink} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>My Orders</Text>
              <Text style={styles.menuDesc}>View order history, status & reorder.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* 2. Edit Profile */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#EBF5FF' }]}>
              <Ionicons name="person-outline" size={18} color={colors.primaryBlue} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Edit Profile & Business Info</Text>
              <Text style={styles.menuDesc}>Update name, email, phone & GSTIN.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* 3. Saved Addresses */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('SavedAddresses')}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#EAF8F1' }]}>
              <Ionicons name="location-outline" size={18} color="#12A66A" />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Saved Delivery Addresses</Text>
              <Text style={styles.menuDesc}>Manage shipping & billing locations.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* 4. Notifications */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Notifications')}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="notifications-outline" size={18} color="#7C3AED" />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Notifications</Text>
              <Text style={styles.menuDesc}>Order dispatches & promotional alerts.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* 5. Help & Support */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('HelpSupport')}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#FFF0F5' }]}>
              <Ionicons name="help-circle-outline" size={18} color={colors.primaryPink} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Help & Support (24/7)</Text>
              <Text style={styles.menuDesc}>FAQs, contact numbers & Hyderabad hub.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* 6. WhatsApp Specialist */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Linking.openURL(SUPPORT_WHATSAPP)}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(37, 211, 102, 0.15)' }]}>
              <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>WhatsApp Design Specialist</Text>
              <Text style={styles.menuDesc}>Instant advice for bleed margins & printing.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Customer Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingBottom: spacing.xxxl,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarLetter: {
    color: colors.textInverted,
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
  },
  profileInfoWrap: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  profilePhone: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  profileCompany: {
    fontSize: 10.5,
    color: colors.secondaryDark,
    marginTop: 2,
    fontWeight: typography.fontWeights.medium,
  },
  editIconBtn: {
    padding: spacing.sm,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.sm,
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
    height: 40,
    fontSize: typography.fontSizes.xs + 1,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  multilineInput: {
    height: 60,
    paddingTop: 8,
    textAlignVertical: 'top',
  },
  saveBtn: {
    marginTop: spacing.sm,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuTextWrap: {
    flex: 1,
  },
  menuTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  menuDesc: {
    fontSize: 10.5,
    color: colors.textSecondary,
    marginTop: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerLight,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  logoutButtonText: {
    color: colors.danger,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
});
