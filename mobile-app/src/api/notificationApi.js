import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_STORAGE_KEY = '@sap_notifications';

export const fetchNotifications = async () => {
  try {
    const raw = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!parsed || parsed.length === 0) {
      const initial = [
        {
          id: 'notif_1',
          title: 'Order Dispatch Notification',
          message: 'Your Visiting Cards order #SAP-8821 has been printed and dispatched via Bluedart Air Express.',
          timestamp: '10 minutes ago',
          isRead: false,
          type: 'order',
        },
        {
          id: 'notif_2',
          title: 'Exclusive Weekend Offer',
          message: 'Get flat 20% OFF on all Flex Banners & Standees this week. Use code SAPFIRST.',
          timestamp: '2 hours ago',
          isRead: false,
          type: 'promo',
        },
        {
          id: 'notif_3',
          title: 'Free Digital Proof Ready',
          message: 'Your custom business card template preview is saved and ready for high-resolution print.',
          timestamp: 'Yesterday',
          isRead: true,
          type: 'proof',
        },
      ];
      await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch (e) {
    return [];
  }
};

export const markNotificationRead = async (notifId) => {
  try {
    const list = await fetchNotifications();
    const updated = list.map((n) => (n.id === notifId ? { ...n, isRead: true } : n));
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const markAllNotificationsRead = async () => {
  try {
    const list = await fetchNotifications();
    const updated = list.map((n) => ({ ...n, isRead: true }));
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const clearAllNotifications = async () => {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify([]));
    return [];
  } catch (e) {
    return [];
  }
};
