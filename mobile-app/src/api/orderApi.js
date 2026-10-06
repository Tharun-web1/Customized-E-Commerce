import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from './apiClient';

const ORDERS_STORAGE_KEY = '@sap_customer_orders';

export const fetchCustomerOrders = async () => {
  try {
    const local = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
    const parsed = local ? JSON.parse(local) : [];

    // Default sample orders matching real SAP Prints workflow
    if (!parsed || parsed.length === 0) {
      const initialOrders = [
        {
          id: 'SAP-982143',
          date: '06 Oct 2026, 02:30 PM',
          status: 'In Pre-Flight Quality Check',
          stage: 2,
          amount: 200.0,
          items: [
            {
              id: 1,
              title: 'Standard Visiting Cards',
              quantity: 100,
              finish: 'Silk Matte 350 GSM',
              corner_style: 'Standard (90°)',
              price: 200.0,
              image: null,
            },
          ],
          shippingAddress: {
            fullName: 'Vikramaditya Sharma',
            phone: '+91 98765 43210',
            address: 'Flat 402, Royal Palms, KPHB Phase 1',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500072',
          },
          paymentStatus: 'Paid via UPI (Ref: 9812409)',
          trackingNumber: 'SAP-EXP-HYD-8821',
          estimatedDelivery: '08 Oct 2026',
        },
        {
          id: 'SAP-874219',
          date: '03 Oct 2026, 11:15 AM',
          status: 'Delivered',
          stage: 5,
          amount: 675.0,
          items: [
            {
              id: 2,
              title: 'Metallic Gold Foil Visiting Cards',
              quantity: 250,
              finish: 'Velvet Soft Touch + Gold Foil',
              corner_style: 'Rounded Corners',
              price: 675.0,
              image: null,
            },
          ],
          shippingAddress: {
            fullName: 'Vikramaditya Sharma',
            phone: '+91 98765 43210',
            address: 'Flat 402, Royal Palms, KPHB Phase 1',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500072',
          },
          paymentStatus: 'Paid via Debit Card (Ending 4012)',
          trackingNumber: 'SAP-EXP-HYD-7714',
          estimatedDelivery: '05 Oct 2026',
        },
      ];
      await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(initialOrders));
      return initialOrders;
    }
    return parsed;
  } catch (e) {
    console.warn('Orders fetch error:', e);
    return [];
  }
};

export const fetchOrderById = async (orderId) => {
  const orders = await fetchCustomerOrders();
  return orders.find((o) => o.id === orderId) || orders[0] || null;
};

export const createOrder = async (orderData) => {
  try {
    const existing = await fetchCustomerOrders();
    const newOrder = {
      id: `SAP-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Order Placed & Confirmed',
      stage: 1,
      trackingNumber: `SAP-EXP-HYD-${Math.floor(1000 + Math.random() * 9000)}`,
      estimatedDelivery: 'Within 2-3 Business Days',
      ...orderData,
    };

    const updated = [newOrder, ...existing];
    await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return newOrder;
  } catch (e) {
    console.warn('Create order error:', e);
    return {
      id: `SAP-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Order Placed',
      ...orderData,
    };
  }
};
