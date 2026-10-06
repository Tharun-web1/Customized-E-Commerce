export const SITE_DOMAIN = 'asapnow.in';
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://asapnow.in/';

// In production, always use relative '/api' so it matches the page protocol (https://)
const resolveApiBase = () => {
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://127.0.0.1:8000/api';
    }
    return '/api';
  }
  return '/api';
};

export const API_BASE = resolveApiBase();

const getSessionId = () => {
  let sid = localStorage.getItem('vp_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 12);
    localStorage.setItem('vp_session_id', sid);
  }
  return sid;
};

export const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_BASE}/categories/`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (err) {
    console.warn('API fetch error, using local fallback:', err);
    return [
      { id: 1, name: '1. By Shape', slug: 'shapes' },
      { id: 2, name: '2. Texture', slug: 'texture' },
      { id: 3, name: '3. Special', slug: 'special' },
      { id: 4, name: '4. Card Holders', slug: 'holders' },
    ];
  }
};

export const fetchCards = async (group = '', search = '') => {
  try {
    let url = `${API_BASE}/cards/`;
    const params = new URLSearchParams();
    if (group && group !== 'all') params.append('group', group);
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch cards');
    return await res.json();
  } catch (err) {
    console.warn('API cards fetch error, using fallback:', err);
    return [];
  }
};

export const fetchTemplates = async (industry = '', cardId = null, cardSlug = '', orientation = '', search = '') => {
  try {
    let url = `${API_BASE}/templates/`;
    const params = new URLSearchParams();
    if (industry && industry !== 'all') params.append('industry', industry);
    if (cardId) params.append('card_id', cardId);
    if (cardSlug) params.append('card_slug', cardSlug);
    if (orientation && orientation !== 'all') params.append('orientation', orientation);
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch templates');
    return await res.json();
  } catch (err) {
    console.warn('API templates fetch error:', err);
    return [];
  }
};

export const uploadDesignArtwork = async (fileOrDataUrl, fileName = 'user_design.png') => {
  try {
    let res;
    if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
      const formData = new FormData();
      formData.append('file', fileOrDataUrl);
      res = await fetch(`${API_BASE}/upload/`, {
        method: 'POST',
        body: formData,
      });
    } else {
      res = await fetch(`${API_BASE}/upload/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data_url: fileOrDataUrl, name: fileName }),
      });
    }
    if (!res.ok) throw new Error('Upload failed');
    return await res.json();
  } catch (err) {
    console.warn('API upload error, using local data URL fallback:', err);
    return { success: true, url: typeof fileOrDataUrl === 'string' ? fileOrDataUrl : URL.createObjectURL(fileOrDataUrl) };
  }
};


export const validatePromoCode = async (code, orderTotal) => {
  try {
    const res = await fetch(`${API_BASE}/promos/validate/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, order_total: orderTotal }),
    });
    return await res.json();
  } catch (err) {
    return { valid: false, message: 'Could not connect to promo verification server' };
  }
};

export const getCart = async () => {
  const sid = getSessionId();
  try {
    const res = await fetch(`${API_BASE}/cart/?session_id=${sid}`, {
      headers: { 'X-Session-ID': sid },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items)) {
        localStorage.setItem(`vp_cart_cache_${sid}`, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('API getCart error, falling back to client cache:', err);
  }

  // Local fallback
  try {
    const raw = localStorage.getItem(`vp_cart_cache_${sid}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) return parsed;
    }
  } catch (_) {}
  return { items: [], count: 0, subtotal: 0 };
};

export const addToCart = async (payload) => {
  const sid = getSessionId();
  let serverItem = null;

  try {
    const res = await fetch(`${API_BASE}/cart/?session_id=${sid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sid,
      },
      body: JSON.stringify({ ...payload, session_id: sid }),
    });
    if (res.ok) {
      serverItem = await res.json();
    } else {
      console.warn('Backend cart add failed with status', res.status);
    }
  } catch (err) {
    console.warn('Cart add network error:', err);
  }

  // Construct valid item whether from server or client fallback
  const finalItem = serverItem || {
    id: Date.now(),
    card_title: payload.title || payload.card_title || 'Standard Visiting Cards',
    card_gsm: payload.paper_stock || '350 GSM',
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
    accent_color: payload.accent_color || '#0056b3',
    unit_price: Number(payload.unit_price) || 2.0,
    total_price: Number(payload.total_price) || 200.0,
    created_at: new Date().toISOString(),
  };

  // Sync to local cache so UI always immediately shows the added item
  try {
    let currentCache = { items: [], count: 0, subtotal: 0 };
    const raw = localStorage.getItem(`vp_cart_cache_${sid}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) currentCache = parsed;
    }
    
    // Avoid duplicate if server item already present
    const exists = currentCache.items.some(it => it.id === finalItem.id);
    if (!exists) {
      currentCache.items = [finalItem, ...currentCache.items];
    }
    currentCache.count = currentCache.items.length;
    currentCache.subtotal = currentCache.items.reduce((sum, it) => sum + Number(it.total_price || 0), 0);
    localStorage.setItem(`vp_cart_cache_${sid}`, JSON.stringify(currentCache));
  } catch (cacheErr) {
    console.warn('Local cart cache sync error:', cacheErr);
  }

  return finalItem;
};

export const removeCartItem = async (itemId) => {
  const sid = getSessionId();
  try {
    await fetch(`${API_BASE}/cart/${itemId}/`, {
      method: 'DELETE',
      headers: { 'X-Session-ID': sid },
    });
  } catch (_) {}

  // Update local cache
  try {
    const raw = localStorage.getItem(`vp_cart_cache_${sid}`);
    if (raw) {
      const cache = JSON.parse(raw);
      cache.items = (cache.items || []).filter(it => it.id !== itemId);
      cache.count = cache.items.length;
      cache.subtotal = cache.items.reduce((sum, it) => sum + Number(it.total_price || 0), 0);
      localStorage.setItem(`vp_cart_cache_${sid}`, JSON.stringify(cache));
    }
  } catch (_) {}

  return true;
};

/* ==========================================
   ADMIN AUTHENTICATION API
   ========================================== */
export const adminLogin = async (username, password) => {
  try {
    const res = await fetch(`${API_BASE}/admin/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error('Admin login error:', err);
    return { ok: false, status: 500, data: { message: 'Network error connecting to backend.' } };
  }
};

/* ==========================================
   ADMIN DASHBOARD CRUD OPERATIONS
   ========================================== */


// --- Cards CRUD ---
export const createCard = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/cards/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(JSON.stringify(errData));
    }
    return await res.json();
  } catch (err) {
    console.error('Error creating card:', err);
    throw err;
  }
};

export const updateCard = async (idOrSlug, payload) => {
  try {
    const res = await fetch(`${API_BASE}/cards/${idOrSlug}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(JSON.stringify(errData));
    }
    return await res.json();
  } catch (err) {
    console.error(`Error updating card ${idOrSlug}:`, err);
    throw err;
  }
};

export const deleteCard = async (idOrSlug) => {
  try {
    const res = await fetch(`${API_BASE}/cards/${idOrSlug}/`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error(`Error deleting card ${idOrSlug}:`, err);
    return false;
  }
};

// --- Categories CRUD ---
export const createCategory = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/categories/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(JSON.stringify(errData));
    }
    return await res.json();
  } catch (err) {
    console.error('Error creating category:', err);
    throw err;
  }
};

export const updateCategory = async (id, payload) => {
  try {
    const res = await fetch(`${API_BASE}/categories/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update category');
    return await res.json();
  } catch (err) {
    console.error(`Error updating category ${id}:`, err);
    throw err;
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/categories/${id}/`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error(`Error deleting category ${id}:`, err);
    return false;
  }
};

// --- Templates CRUD ---
export const createTemplate = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/templates/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      let errDetail = 'Failed to create template';
      try {
        const errJson = await res.json();
        errDetail = typeof errJson === 'object' ? JSON.stringify(errJson) : String(errJson);
      } catch (parseErr) {
        errDetail = await res.text();
      }
      throw new Error(`HTTP ${res.status}: ${errDetail}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Error creating template:', err);
    throw err;
  }
};

export const updateTemplate = async (id, payload) => {
  try {
    const res = await fetch(`${API_BASE}/templates/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update template');
    return await res.json();
  } catch (err) {
    console.error(`Error updating template ${id}:`, err);
    throw err;
  }
};

export const deleteTemplate = async (id) => {

  try {
    const res = await fetch(`${API_BASE}/templates/${id}/`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error(`Error deleting template ${id}:`, err);
    return false;
  }
};

// --- Promo Codes CRUD ---
export const fetchPromoCodes = async () => {
  try {
    const res = await fetch(`${API_BASE}/promocodes/`);
    if (!res.ok) throw new Error('Failed to fetch promo codes');
    return await res.json();
  } catch (err) {
    console.warn('Error fetching promo codes:', err);
    return [];
  }
};

export const createPromoCode = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/promocodes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create promo code');
    return await res.json();
  } catch (err) {
    console.error('Error creating promo code:', err);
    throw err;
  }
};

export const deletePromoCode = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/promocodes/${id}/`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error(`Error deleting promo code ${id}:`, err);
    return false;
  }
};

// --- Admin Portal Analytics & Orders APIs ---
export const fetchAdminStats = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/stats/`);
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return await res.json();
  } catch (err) {
    console.warn('Error fetching admin stats:', err);
    return null;
  }
};

export const fetchAdminOrders = async (search = '') => {
  try {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetch(`${API_BASE}/admin/orders/${query}`);
    if (!res.ok) throw new Error('Failed to fetch admin orders');
    return await res.json();
  } catch (err) {
    console.warn('Error fetching admin orders:', err);
    return { orders: [], count: 0 };
  }
};

export const deleteAdminOrder = async (orderId) => {
  try {
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}/`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error(`Error deleting order ${orderId}:`, err);
    return false;
  }
};


