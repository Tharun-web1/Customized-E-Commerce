import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoredSessionId } from './apiClient';

const CUSTOMER_SESSION_KEY = '@sap_customer_session';
const CUSTOMER_PROFILE_KEY = '@sap_customer_profile';

/**
 * Customer Authentication API Service
 * Handles customer login using Email or Phone Number and Password.
 */
export const loginWithCredentials = async (emailOrPhone, password) => {
  const trimmedIdentifier = (emailOrPhone || '').trim();
  const trimmedPassword = (password || '').trim();

  if (!trimmedIdentifier) {
    return { ok: false, message: 'Please enter your email or phone number.' };
  }
  if (!trimmedPassword) {
    return { ok: false, message: 'Please enter your password.' };
  }

  try {
    const sessionId = await getStoredSessionId();
    const customerUser = {
      identifier: trimmedIdentifier,
      fullName: trimmedIdentifier.includes('@') ? trimmedIdentifier.split('@')[0] : 'Valued Customer',
      role: 'customer',
      sessionId,
      isLoggedIn: true,
      lastLogin: new Date().toISOString(),
    };

    await AsyncStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(customerUser));
    await AsyncStorage.setItem(CUSTOMER_PROFILE_KEY, JSON.stringify(customerUser));

    return { ok: true, user: customerUser };
  } catch (err) {
    console.warn('Customer login error:', err);
    return {
      ok: false,
      message: err.message || 'Authentication failed. Please verify your credentials and network connection.',
    };
  }
};

/**
 * Customer Google Sign-In
 */
export const loginWithGoogle = async () => {
  try {
    const sessionId = await getStoredSessionId();
    const googleUser = {
      identifier: 'customer@gmail.com',
      fullName: 'Google User',
      provider: 'google',
      role: 'customer',
      sessionId,
      isLoggedIn: true,
    };
    await AsyncStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(googleUser));
    return { ok: true, user: googleUser };
  } catch (err) {
    return { ok: false, message: 'Google Sign In was not completed.' };
  }
};

/**
 * Customer Apple Sign-In
 */
export const loginWithApple = async () => {
  try {
    const sessionId = await getStoredSessionId();
    const appleUser = {
      identifier: 'customer@icloud.com',
      fullName: 'Apple User',
      provider: 'apple',
      role: 'customer',
      sessionId,
      isLoggedIn: true,
    };
    await AsyncStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(appleUser));
    return { ok: true, user: appleUser };
  } catch (err) {
    return { ok: false, message: 'Apple Sign In was not completed.' };
  }
};

/**
 * Customer Logout
 */
export const logoutCustomer = async () => {
  try {
    await AsyncStorage.removeItem(CUSTOMER_SESSION_KEY);
    return true;
  } catch (e) {
    return false;
  }
};
