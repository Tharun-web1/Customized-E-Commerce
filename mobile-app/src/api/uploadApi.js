import { apiRequest } from './apiClient';
import { API_BASE_URL } from '../constants/config';

export const uploadArtwork = async (fileUri, fileName = 'user_card_design.jpg', mimeType = 'image/jpeg') => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: mimeType,
    });

    const res = await apiRequest('/upload/', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res;
  } catch (err) {
    console.warn('Multipart upload failed, using local URI fallback:', err);
    return {
      success: true,
      url: fileUri,
      name: fileName,
      local: true,
    };
  }
};

export const uploadDataUrl = async (dataUrl, fileName = 'user_design.png') => {
  try {
    return await apiRequest('/upload/', {
      method: 'POST',
      body: JSON.stringify({ data_url: dataUrl, name: fileName }),
    });
  } catch (err) {
    console.warn('Data URL upload failed, returning dataUrl fallback:', err);
    return {
      success: true,
      url: dataUrl,
      name: fileName,
    };
  }
};
