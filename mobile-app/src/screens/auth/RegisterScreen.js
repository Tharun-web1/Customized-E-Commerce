import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useSession } from '../../context/SessionContext';

export const RegisterScreen = ({ navigation }) => {
  const { saveProfile } = useSession();
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage('');
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!emailOrPhone.trim()) {
      setErrorMessage('Please enter your email or mobile number.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please agree to Terms and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    setTimeout(async () => {
      setIsLoading(false);
      await saveProfile({
        fullName: fullName.trim(),
        email: emailOrPhone.includes('@') ? emailOrPhone.trim() : `${emailOrPhone.trim()}@customer.sapnow.in`,
        phone: !emailOrPhone.includes('@') ? emailOrPhone.trim() : '+91 98765 43210',
      });

      Alert.alert(
        'Account Created Successfully',
        `Welcome to SAP Prints, ${fullName.trim()}! Your customer printing profile is ready.`,
        [
          {
            text: 'Continue to Marketplace',
            onPress: () => navigation.navigate('MainTabs'),
          },
        ]
      );
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.primaryNavy} />
          </TouchableOpacity>

          <View style={styles.brandBox}>
            <Image
              source={require('../../assets/images/home/sap_home_logo.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <Text style={styles.headingTitle}>Create Account</Text>
            <Text style={styles.headingSubtitle}>Sign up for instant ordering and express delivery in Hyderabad</Text>
          </View>

          {/* Error Banner */}
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color="#EF4444" />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Full Name */}
          <View style={styles.inputCard}>
            <Ionicons name="person-outline" size={20} color={colors.secondaryText} style={styles.inputIcon} />
            <View style={styles.divider} />
            <TextInput
              style={styles.textInput}
              placeholder="Full Name / Business Name"
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={(t) => {
                setFullName(t);
                if (errorMessage) setErrorMessage('');
              }}
              autoCapitalize="words"
              underlineColorAndroid="transparent"
            />
          </View>

          {/* Email or Phone */}
          <View style={styles.inputCard}>
            <Ionicons name="mail-outline" size={20} color={colors.secondaryText} style={styles.inputIcon} />
            <View style={styles.divider} />
            <TextInput
              style={styles.textInput}
              placeholder="Email or Mobile Number"
              placeholderTextColor="#94A3B8"
              value={emailOrPhone}
              onChangeText={(t) => {
                setEmailOrPhone(t);
                if (errorMessage) setErrorMessage('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              underlineColorAndroid="transparent"
            />
          </View>

          {/* Password */}
          <View style={styles.inputCard}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.secondaryText} style={styles.inputIcon} />
            <View style={styles.divider} />
            <TextInput
              style={styles.textInput}
              placeholder="Create Password (min 6 chars)"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errorMessage) setErrorMessage('');
              }}
              secureTextEntry={!showPassword}
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputCard}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.secondaryText} style={styles.inputIcon} />
            <View style={styles.divider} />
            <TextInput
              style={styles.textInput}
              placeholder="Confirm Password"
              placeholderTextColor="#94A3B8"
              value={confirmPassword}
              onChangeText={(t) => {
                setConfirmPassword(t);
                if (errorMessage) setErrorMessage('');
              }}
              secureTextEntry={!showPassword}
              underlineColorAndroid="transparent"
            />
          </View>

          {/* Terms Checkbox */}
          <TouchableOpacity
            style={styles.termsRow}
            activeOpacity={0.8}
            onPress={() => setAgreeTerms(!agreeTerms)}
          >
            <Ionicons
              name={agreeTerms ? 'checkbox' : 'square-outline'}
              size={20}
              color={agreeTerms ? colors.primaryPink : colors.secondaryText}
            />
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsHighlight}>Terms of Service</Text> &{' '}
              <Text style={styles.termsHighlight}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.88}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <View style={styles.btnContent}>
                <Text style={styles.btnText}>Create Account</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.white} style={{ marginLeft: 6 }} />
              </View>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandLogo: {
    width: 140,
    height: 52,
    marginBottom: 8,
  },
  headingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  headingSubtitle: {
    fontSize: 13,
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 14,
    gap: 8,
  },
  errorBannerText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 14,
  },
  inputIcon: {
    width: 22,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    marginHorizontal: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    color: colors.primaryNavy,
    fontWeight: '500',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
    gap: 8,
  },
  termsText: {
    fontSize: 12.5,
    color: colors.secondaryText,
    flex: 1,
  },
  termsHighlight: {
    color: colors.primaryPink,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: colors.primaryPink,
    borderRadius: 26,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginPrompt: {
    fontSize: 13.5,
    color: colors.secondaryText,
  },
  loginLink: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.primaryPink,
  },
});
