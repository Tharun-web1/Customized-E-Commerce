import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest, getStoredSessionId } from './apiClient';

const CART_CACHE_KEY = '@asap_cart_cache';

export const getCart = async () => {
  const sid = await getStoredSessionId();
  try {
    const data = await apiRequest(`/cart/?session_id=${sid}`, { timeout: 4000 });
    if (data && Array.isArray(data.items)) {
      await AsyncStorage.setItem(CART_CACHE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    // Graceful fallback to client cache when backend is offline
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
      timeout: 5000,
    });
    serverItem = data;
  } catch (err) {
    // Gracefully handle offline caching
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

  try {
    let currentCache = { items: [], count: 0, subtotal: 0 };
    const raw = await AsyncStorage.getItem(CART_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) currentCache = parsed;
    }
    const exists = currentCache.items.some((it) => it.id === finalItem.id);
    if (!exists) {
      currentCache.items = [finalItem, ...currentCache.items];
    }
    currentCache.count = currentCache.items.length;
    currentCache.subtotal = currentCache.items.reduce((sum, it) => sum + Number(it.total_price || 0), 0);
    await AsyncStorage.setItem(CART_CACHE_KEY, JSON.stringify(currentCache));
  } catch (cacheErr) {
    console.warn('Cart cache sync error:', cacheErr);
  }

  return finalItem;
};

export const removeCartItem = async (itemId) => {
  const sid = await getStoredSessionId();
  try {
    await apiRequest(`/cart/${itemId}/?session_id=${sid}`, {
      method: 'DELETE',
      timeout: 4000,
    });
  } catch (_) {}

  try {
    const raw = await AsyncStorage.getItem(CART_CACHE_KEY);
    if (raw) {
      const cache = JSON.parse(raw);
      cache.items = (cache.items || []).filter((it) => it.id !== itemId);
      cache.count = cache.items.length;
      cache.subtotal = cache.items.reduce((sum, it) => sum + Number(it.total_price || 0), 0);
      await AsyncStorage.setItem(CART_CACHE_KEY, JSON.stringify(cache));
    }
  } catch (_) {}

  return true;
};

export const validatePromo = async (code, orderTotal) => {
  try {
    const data = await apiRequest('/promos/validate/', {
      method: 'POST',
      body: JSON.stringify({ code, order_total: orderTotal }),
      timeout: 5000,
    });
    return data;
  } catch (err) {
    // Client validation fallback
    const upper = (code || '').trim().toUpperCase();
    if (upper === 'SAPFIRST' || upper === 'PROMO15') {
      const discount = Math.round(orderTotal * 0.15);
      return { valid: true, discount, message: '15% Welcome discount applied!' };
    }
    if (upper === 'BULK30') {
      const discount = Math.round(orderTotal * 0.30);
      return { valid: true, discount, message: '30% Bulk printing discount applied!' };
    }
    return { valid: false, message: 'Invalid or expired promotional code.' };
  }
};
