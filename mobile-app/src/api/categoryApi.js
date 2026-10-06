import { apiRequest } from './apiClient';

export const fetchCategories = async () => {
  try {
    const data = await apiRequest('/categories/');
    if (Array.isArray(data)) return data;
    if (data?.results && Array.isArray(data.results)) return data.results;
    return [];
  } catch (err) {
    console.warn('Categories fetch fallback:', err);
    return [
      { id: 1, name: 'Visiting Cards', slug: 'visiting-cards', group: 'shapes' },
      { id: 2, name: 'Banners & Flex', slug: 'banners', group: 'marketing' },
      { id: 3, name: 'Brochures & Flyers', slug: 'brochures', group: 'marketing' },
      { id: 4, name: 'Stickers & Labels', slug: 'stickers', group: 'packaging' },
      { id: 5, name: 'T-Shirt Printing', slug: 't-shirts', group: 'apparel' },
      { id: 6, name: 'Menu Cards', slug: 'menu-cards', group: 'hospitality' },
      { id: 7, name: 'Canvas & 3D Prints', slug: 'canvas', group: 'special' },
      { id: 8, name: 'Custom Printing', slug: 'custom', group: 'custom' },
    ];
  }
};
