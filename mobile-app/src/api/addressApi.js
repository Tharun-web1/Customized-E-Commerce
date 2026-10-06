import AsyncStorage from '@react-native-async-storage/async-storage';

const ADDRESSES_STORAGE_KEY = '@sap_saved_addresses';

export const fetchSavedAddresses = async () => {
  try {
    const raw = await AsyncStorage.getItem(ADDRESSES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!parsed || parsed.length === 0) {
      const defaultList = [
        {
          id: 'addr_1',
          name: 'Home / Office',
          recipientName: 'Vikramaditya Sharma',
          phone: '+91 98765 43210',
          addressLine1: 'Flat 402, Royal Palms Apartments',
          addressLine2: 'Road No. 1, KPHB Colony Phase 1',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500072',
          landmark: 'Near Forum Sujana Mall',
          isDefault: true,
        },
        {
          id: 'addr_2',
          name: 'Corporate HQ',
          recipientName: 'Vikramaditya Sharma (Accounts)',
          phone: '+91 98765 43210',
          addressLine1: 'Building 14, Mindspace IT Park',
          addressLine2: 'Hitec City, Madhapur',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500081',
          landmark: 'Opposite Inorbit Mall',
          isDefault: false,
        },
      ];
      await AsyncStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(defaultList));
      return defaultList;
    }
    return parsed;
  } catch (e) {
    return [];
  }
};

export const saveAddress = async (address) => {
  try {
    const addresses = await fetchSavedAddresses();
    let updated;
    if (address.id) {
      updated = addresses.map((a) => (a.id === address.id ? { ...a, ...address } : a));
    } else {
      const newAddr = {
        ...address,
        id: 'addr_' + Date.now(),
        isDefault: addresses.length === 0 || address.isDefault,
      };
      updated = [newAddr, ...addresses];
    }
    if (address.isDefault) {
      const targetId = address.id || updated[0].id;
      updated = updated.map((a) => ({ ...a, isDefault: a.id === targetId }));
    }
    await AsyncStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('saveAddress error:', e);
    return [];
  }
};

export const deleteAddress = async (addressId) => {
  try {
    const addresses = await fetchSavedAddresses();
    const updated = addresses.filter((a) => a.id !== addressId);
    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
      updated[0].isDefault = true;
    }
    await AsyncStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const setDefaultAddress = async (addressId) => {
  try {
    const addresses = await fetchSavedAddresses();
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === addressId }));
    await AsyncStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};
