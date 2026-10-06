import { Platform } from 'react-native';

// In development, Android emulator connects to host via 10.0.2.2, iOS simulator via localhost
// In production, uses the live backend URL.
const getDevApiBase = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api';
  }
  return 'http://localhost:8000/api';
};

export const API_BASE_URL = __DEV__ ? getDevApiBase() : 'https://asapnow.in/api';
export const SITE_DOMAIN = 'asapnow.in';
export const SITE_NAME = 'SAP Prints – Designing & Printing';

export const DEFAULT_PINCODE = '500072'; // Hyderabad (KPHB Colony)
export const SUPPORT_PHONE = '+91 98765 43210';
export const SUPPORT_EMAIL = 'support@sapprints.com';
export const SUPPORT_WHATSAPP = 'https://wa.me/919876543210';
