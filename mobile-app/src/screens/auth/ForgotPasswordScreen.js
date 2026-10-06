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

export const ForgotPasswordScreen = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Enter Email/Phone, 2: OTP & New Password
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendOtp = () => {
    setErrorMessage('');
    if (!identifier.trim()) {
      setErrorMessage('Please enter your registered email or phone number.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      Alert.alert('Verification Code Sent', `A 6-digit reset OTP has been dispatched to ${identifier.trim()}. (Demo OTP: 123456)`);
    }, 600);
  };

  const handleResetPassword = () => {
    setErrorMessage('');
    if (!otpCode.trim()) {
      setErrorMessage('Please enter the 6-digit OTP.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Password Reset Successful',
        'Your password has been updated. Please log in with your new credentials.',
        [
          {
            text: 'Go to Login',
            onPress: () => navigation.navigate('Login'),
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
          <TouchableOpacity style={styles.backBtn} onPress={() => (step === 2 ? setStep(1) : navigation.goBack())}>
            <Ionicons name="arrow-back" size={24} color={colors.primaryNavy} />
          </TouchableOpacity>

          <View style={styles.brandBox}>
            <Image
              source={require('../../assets/images/home/sap_home_logo.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <Text style={styles.headingTitle}>Reset Password</Text>
            <Text style={styles.headingSubtitle}>
              {step === 1
                ? 'Enter your registered email or phone to receive a reset code'
                : 'Enter the verification OTP and your new password'}
            </Text>
          </View>

          {/* Error Banner */}
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color="#EF4444" />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          ) : null}

          {step === 1 ? (
            <>
              {/* Identifier Input */}
              <View style={styles.inputCard}>
                <Ionicons name="mail-outline" size={20} color={colors.secondaryText} style={styles.inputIcon} />
                <View style={styles.divider} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email or Mobile Number"
                  placeholderTextColor="#94A3B8"
                  value={identifier}
                  onChangeText={(t) => {
                    setIdentifier(t);
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleSendOtp}
                disabled={isLoading}
                activeOpacity={0.88}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.btnText}>Send Verification Code</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* OTP Input */}
              <View style={styles.inputCard}>
                <Ionicons name="key-outline" size={20} color={colors.secondaryText} style={styles.inputIcon} />
                <View style={styles.divider} />
                <TextInput
                  style={styles.textInput}
                  placeholder="6-Digit OTP (e.g. 123456)"
                  placeholderTextColor="#94A3B8"
                  value={otpCode}
                  onChangeText={(t) => {
                    setOtpCode(t);
                    if (errorMessage) setErrorMessage('');
                  }}
                  keyboardType="numeric"
                  maxLength={6}
                  underlineColorAndroid="transparent"
                />
              </View>

              {/* New Password */}
              <View style={styles.inputCard}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.secondaryText} style={styles.inputIcon} />
                <View style={styles.divider} />
                <TextInput
                  style={styles.textInput}
                  placeholder="New Password (min 6 chars)"
                  placeholderTextColor="#94A3B8"
                  value={newPassword}
                  onChangeText={(t) => {
                    setNewPassword(t);
                    if (errorMessage) setErrorMessage('');
                  }}
                  secureTextEntry
                  underlineColorAndroid="transparent"
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleResetPassword}
                disabled={isLoading}
                activeOpacity={0.88}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.btnText}>Confirm & Update Password</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.backToLoginRow} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>
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
    marginBottom: 16,
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: 28,
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
    marginBottom: 16,
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
  submitButton: {
    backgroundColor: colors.primaryPink,
    borderRadius: 26,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: colors.white,
    fontSize: 15.5,
    fontWeight: '800',
  },
  backToLoginRow: {
    alignItems: 'center',
    marginTop: 24,
  },
  backToLoginText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryBlue,
  },
});
