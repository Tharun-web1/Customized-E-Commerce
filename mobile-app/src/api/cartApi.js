import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest, getStoredSessionId } from './apiClient';

const CART_CACHE_KEY = '@asap_cart_cache';

export const getCart = async () => {
  const sid = await getStoredSessionId();
  try {
    const data = await apiRequest(`/cart/?session_id=${sid}`);
    if (data && Array.isArray(data.items)) {
      await AsyncStorage.setItem(CART_CACHE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Backend getCart failed, using local offline cache:', err);
  }

  // Fallback to local cache
  try {
    const raw = await AsyncStorage.getItem(CART_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) return parsed;
    }
  } catch (_) {}
  return { items: [], count: 0, subtotal: 0 };
};

export const addToCart = async (payload) => {
  const sid = await getStoredSessionId();
  let serverItem = null;

  try {
    const data = await apiRequest(`/cart/?session_id=${sid}`, {
      method: 'POST',
      body: JSON.stringify({ ...payload, session_id: sid }),
    });
    serverItem = data;
  } catch (err) {
    console.warn('Backend addToCart failed, caching locally:', err);
  }

  const finalItem = serverItem || {
    id: Date.now(),
    card_title: payload.title || payload.card_title || 'Standard Visiting Cards',
    card_gsm: payload.gsm || payload.paper_stock || '350 GSM',
    quantity: Number(payload.quantity) || 100,
    corner_style: payload.corner_style || 'Standard',
    finish: payload.finish || 'Matte',
    backside: payload.backside || 'Blank',
    custom_name: payload.custom_name || '',
    custom_title: payload.custom_title || '',
    custom_company: payload.custom_company || '',
    custom_phone: payload.custom_phone || '',
    custom_email: payload.custom_email || '',
    preview_image: payload.preview_image || payload.uploaded_artwork || '',
    back_preview_image: payload.back_preview_image || payload.uploaded_artwork_back || '',
    template_name: payload.template_name || '',
    accent_color: payload.accent_color || '#002c5f',
    unit_price: Number(payload.unit_price) || 2.0,
    total_price: Number(payload.total_price) || 200.0,
    created_at: new Date().toISOString(),
  };

  // Sync to local cache
  try {
    let currentCache = { items: [], count: 0, subtotal: 0 };
    const raw = await AsyncStorage.getItem(CART_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) currentCache = parsed;
    }
    const exists = currentCache.items.some(it => it.id === finalItem.id);
    if (!exists) {
      currentCache.items = [finalItem, ...currentCache.items];
    }
    currentCache.count = currentCache.items.length;
    currentCache.subtotal = currentCache.items.reduce((sum, it) => sum + Number(it.total_price || 0), 0);
    await AsyncStorage.setItem(CART_CACHE_KEY, JSON.stringify(currentCache));
  } catch (e) {
    console.warn('Local cart cache sync error:', e);
  }

  return finalItem;
};

export const removeCartItem = async (itemId) => {
  const sid = await getStoredSessionId();
  try {
    await apiRequest(`/cart/${itemId}/?session_id=${sid}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('Backend delete cart item error:', err);
  }

  // Update local cache
  try {
    const raw = await AsyncStorage.getItem(CART_CACHE_KEY);
    if (raw) {
      const cache = JSON.parse(raw);
      cache.items = (cache.items || []).filter(it => it.id !== itemId);
      cache.count = cache.items.length;
      cache.subtotal = cache.items.reduce((sum, it) => sum + Number(it.total_price || 0), 0);
      await AsyncStorage.setItem(CART_CACHE_KEY, JSON.stringify(cache));
    }
  } catch (_) {}

  return true;
};

export const validatePromoCode = async (code, orderTotal) => {
  try {
    return await apiRequest('/promos/validate/', {
      method: 'POST',
      body: JSON.stringify({ code: code.toUpperCase().trim(), order_total: orderTotal }),
    });
  } catch (err) {
    const upper = (code || '').toUpperCase().trim();
    if (upper === 'PROMO15' || upper === 'NEW15') {
      const discount = (orderTotal * 15) / 100;
      return {
        valid: true,
        code: upper,
        discount_percent: 15,
        discount_amount: roundVal(discount),
        final_total: roundVal(orderTotal - discount),
        message: `Coupon ${upper} applied! 15% OFF`,
      };
    }
    if (upper === 'SAVE10') {
      const discount = (orderTotal * 10) / 100;
      return {
        valid: true,
        code: upper,
        discount_percent: 10,
        discount_amount: roundVal(discount),
        final_total: roundVal(orderTotal - discount),
        message: `Coupon ${upper} applied! 10% OFF`,
      };
    }
    return {
      valid: false,
      message: 'Invalid coupon code. Try PROMO15 or SAVE10.',
    };
  }
};

const roundVal = (v) => Math.round(v * 100) / 100;
