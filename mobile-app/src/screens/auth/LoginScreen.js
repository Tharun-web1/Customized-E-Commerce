import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
  TextInput,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { loginWithCredentials, loginWithGoogle, loginWithApple } from '../../api/authApi';

// 4-Color Vector Google Icon matching exact brand standard
const GoogleIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <Path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <Path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <Path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </Svg>
);

export const LoginScreen = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isIdentifierFocused, setIsIdentifierFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or phone number.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    const result = await loginWithCredentials(identifier, password);
    setIsLoading(false);

    if (result.ok) {
      Alert.alert(
        'Login Successful',
        `Welcome back! Logged in as ${result.user?.fullName || identifier}.`,
        [
          {
            text: 'Continue',
            onPress: () => {
              if (navigation && navigation.navigate) {
                navigation.navigate('MainTabs');
              }
            },
          },
        ]
      );
    } else {
      setErrorMessage(result.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const res = await loginWithGoogle();
    setIsLoading(false);
    if (res.ok) {
      Alert.alert('Google Sign-In', 'Signed in successfully with Google account.');
      if (navigation && navigation.navigate) {
        navigation.navigate('MainTabs');
      }
    }
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    const res = await loginWithApple();
    setIsLoading(false);
    if (res.ok) {
      Alert.alert('Apple Sign-In', 'Signed in successfully with Apple ID.');
      if (navigation && navigation.navigate) {
        navigation.navigate('MainTabs');
      }
    }
  };

  const handleForgotPassword = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('ForgotPassword');
    } else {
      Alert.alert('Forgot Password', 'Password reset instructions will be sent to your email or phone.');
    }
  };

  const handleSignUp = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('Register');
    } else {
      Alert.alert('Sign Up', 'Registration screen will open.');
    }
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />

      {/* Center Phone Canvas on Desktop/Web */}
      <View style={styles.outerContainer}>
        {/* Layer 1: Background Artwork */}
        <ImageBackground
          source={require('../../assets/images/login_clean_bg.png')}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />

        {/* Layer 2: Soft White Translucency Overlay for Foreground Clarity */}
        <View style={styles.backgroundOverlay} />

        {/* Layer 3: Foreground Content */}
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
              {/* 1. SAP PRINTS LOGO SECTION */}
              <View style={styles.logoSection}>
                <Image
                  source={require('../../assets/images/sap_logo_clean.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>

              {/* 2. WELCOME TITLE & SUBTITLE */}
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Welcome Back!</Text>
                <Text style={styles.welcomeSubtitle}>
                  Login to continue your printing journey
                </Text>
              </View>

              {/* ERROR BANNER IF ANY */}
              {errorMessage ? (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle" size={18} color="#EF4444" />
                  <Text style={styles.errorBannerText}>{errorMessage}</Text>
                </View>
              ) : null}

              {/* 3. EMAIL OR PHONE NUMBER INPUT (SINGLE CLEAN ROUNDED CONTAINER) */}
              <View
                style={[
                  styles.inputCard,
                  isIdentifierFocused && styles.inputCardFocused,
                  errorMessage && !identifier.trim() && styles.inputCardError,
                ]}
              >
                <View style={styles.inputIconWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#64748B"
                  />
                </View>
                <View style={styles.inputDivider} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email or Phone Number"
                  placeholderTextColor="#94A3B8"
                  value={identifier}
                  onChangeText={(text) => {
                    setIdentifier(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  onFocus={() => setIsIdentifierFocused(true)}
                  onBlur={() => setIsIdentifierFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                />
              </View>

              {/* 4. PASSWORD INPUT WITH SHOW/HIDE TOGGLE (SINGLE CLEAN ROUNDED CONTAINER) */}
              <View
                style={[
                  styles.inputCard,
                  isPasswordFocused && styles.inputCardFocused,
                  errorMessage && !password.trim() && styles.inputCardError,
                ]}
              >
                <View style={styles.inputIconWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#64748B"
                  />
                </View>
                <View style={styles.inputDivider} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                />
                <TouchableOpacity
                  style={styles.eyeIconButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>

              {/* 5. FORGOT PASSWORD LINK (RIGHT ALIGNED) */}
              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  activeOpacity={0.7}
                  accessibilityLabel="Forgot Password"
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* 6. LOGIN BUTTON (PILL SHAPE WITH RIGHT ARROW) */}
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.88}
                accessibilityLabel="Login"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <View style={styles.loginButtonContent}>
                    <Text style={styles.loginButtonText}>Login</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color="#FFFFFF"
                      style={styles.loginArrowIcon}
                    />
                  </View>
                )}
              </TouchableOpacity>

              {/* 7. OR DIVIDER */}
              <View style={styles.orDividerContainer}>
                <View style={styles.orDividerLine} />
                <Text style={styles.orDividerText}>OR</Text>
                <View style={styles.orDividerLine} />
              </View>

              {/* 8. CONTINUE WITH GOOGLE BUTTON */}
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleLogin}
                disabled={isLoading}
                activeOpacity={0.85}
                accessibilityLabel="Continue with Google"
              >
                <View style={styles.socialIconWrapper}>
                  <GoogleIcon />
                </View>
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              {/* 9. CONTINUE WITH APPLE BUTTON */}
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleAppleLogin}
                disabled={isLoading}
                activeOpacity={0.85}
                accessibilityLabel="Continue with Apple"
              >
                <View style={styles.socialIconWrapper}>
                  <Ionicons name="logo-apple" size={21} color="#000000" />
                </View>
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </TouchableOpacity>

              {/* 10. SIGN UP SECTION */}
              <View style={styles.signUpRow}>
                <Text style={styles.signUpPrompt}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleSignUp} activeOpacity={0.7}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  outerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FAF8F5',
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0px 10px 35px rgba(15, 23, 42, 0.08)',
          minHeight: '100vh',
        }
      : {}),
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 10,
    paddingBottom: 28,
    alignItems: 'stretch',
  },

  /* 1. Header Logo */
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 8,
    height: 102,
  },
  logoImage: {
    width: '100%',
    height: 98,
  },

  /* 2. Welcome Title & Subtitle */
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#0B1B3D',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5A6A80',
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 20,
  },

  /* Error Banner */
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

  /* 3 & 4. Input Cards (Single Outer Border Only) */
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 13,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  inputCardFocused: {
    borderColor: '#FF1E67',
    shadowColor: '#FF1E67',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  inputCardError: {
    borderColor: '#EF4444',
  },
  inputIconWrapper: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#0B1B3D',
    fontWeight: '500',
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web'
      ? {
          outlineStyle: 'none',
          outlineWidth: 0,
          outline: 'none',
          boxShadow: 'none',
        }
      : {}),
  },
  eyeIconButton: {
    padding: 6,
    marginRight: -4,
  },

  /* 5. Forgot Password */
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: -2,
    marginBottom: 18,
  },
  forgotPasswordText: {
    color: '#FF1E67',
    fontSize: 13,
    fontWeight: '700',
  },

  /* 6. Login Button */
  loginButton: {
    backgroundColor: '#FF1E67',
    borderRadius: 26,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#FF1E67',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  loginArrowIcon: {
    marginLeft: 8,
  },

  /* 7. OR Divider */
  orDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 13,
  },
  orDividerLine: {
    flex: 1,
    height: 1.2,
    backgroundColor: '#CBD5E1',
  },
  orDividerText: {
    marginHorizontal: 14,
    fontSize: 12.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.2,
  },

  /* 8 & 9. Social Buttons */
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    height: 52,
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  socialIconWrapper: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B1B3D',
    letterSpacing: 0.1,
  },

  /* 10. Sign Up Link */
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  signUpPrompt: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5A6A80',
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF1E67',
  },
});
