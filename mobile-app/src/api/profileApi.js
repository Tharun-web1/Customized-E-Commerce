import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_STORAGE_KEY = '@sap_customer_profile';

export const fetchUserProfile = async () => {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const existing = (await fetchUserProfile()) || {};
    const updated = {
      ...existing,
      ...profileData,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('updateUserProfile error:', e);
    return profileData;
  }
};
