import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/config';

const SESSION_KEY = '@asap_session_id';

export const getStoredSessionId = async () => {
  try {
    let sid = await AsyncStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = 'mob_' + Math.random().toString(36).substring(2, 12);
      await AsyncStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch (e) {
    return 'mob_guest_' + Date.now();
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  const sessionId = await getStoredSessionId();
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers = {
    'Accept': 'application/json',
    'X-Session-ID': sessionId,
    ...(options.headers || {}),
  };

  // If body is JSON, ensure Content-Type is set
  if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const timeoutMs = options.timeout || 12000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    let responseData = null;
    if (contentType.includes('application/json')) {
      responseData = await res.json();
    } else {
      responseData = await res.text();
    }

    if (!res.ok) {
      const errorMsg = (typeof responseData === 'object' && responseData !== null)
        ? (responseData.message || responseData.error || JSON.stringify(responseData))
        : responseData;
      const error = new Error(errorMsg || `HTTP error ${res.status}`);
      error.status = res.status;
      error.data = responseData;
      throw error;
    }

    return responseData;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      const abortError = new Error('Network timeout. Please check your internet connection.');
      abortError.isTimeout = true;
      throw abortError;
    }
    throw err;
  }
};
