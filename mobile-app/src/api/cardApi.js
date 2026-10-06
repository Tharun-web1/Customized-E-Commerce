import { apiRequest } from './apiClient';

export const fetchCategories = async () => {
  try {
    const data = await apiRequest('/categories/');
    return Array.isArray(data) ? data : (data?.results || []);
  } catch (err) {
    console.warn('Card categories fetch error, returning fallback:', err);
    return [
      { id: 1, name: '1. By Shape', slug: 'shapes', description: 'Standard, Square & Rounded corners' },
      { id: 2, name: '2. Texture', slug: 'texture', description: 'Glossy, Matte, Linen & Embossed' },
      { id: 3, name: '3. Special', slug: 'special', description: 'Metallic Gold, Spot UV & Transparent' },
      { id: 4, name: '4. Card Holders', slug: 'holders', description: 'Leatherette & Stainless Steel Cases' },
    ];
  }
};

export const fetchCards = async (group = '', search = '') => {
  try {
    const params = new URLSearchParams();
    if (group && group !== 'all') params.append('group', group);
    if (search) params.append('search', search);
    const query = params.toString() ? `?${params.toString()}` : '';

    const data = await apiRequest(`/cards/${query}`);
    return Array.isArray(data) ? data : (data?.results || []);
  } catch (err) {
    console.warn('Cards fetch error, returning fallback catalog:', err);
    return [
      {
        id: 1,
        title: 'Standard Visiting Cards',
        slug: 'standard',
        category_group: 'shapes',
        dimensions: '8.9 cm x 5.1 cm',
        gsm: '350 GSM',
        finish_type: 'Matte / Glossy',
        base_price_100: 200.0,
        min_quantity: 100,
        rating: 4.8,
        reviews_count: 1420,
        badge: 'Bestseller',
        tagline: 'Professional high-definition print on sturdy 350 GSM cardstock.',
        description: 'Our most popular business card choice. Perfect for executives, entrepreneurs, and freelancers seeking high durability with brilliant color reproduction.',
        accent_color: '#002c5f',
        is_featured: true,
      },
      {
        id: 2,
        title: 'Rounded Corner Cards',
        slug: 'rounded-corner',
        category_group: 'shapes',
        dimensions: '8.9 cm x 5.1 cm',
        gsm: '350 GSM',
        finish_type: 'Silk Matte',
        base_price_100: 250.0,
        min_quantity: 100,
        rating: 4.9,
        reviews_count: 880,
        badge: 'Modern',
        tagline: 'Sleek 6mm radius corners that never fray.',
        description: 'Stand out from the crowd with rounded corners. Soft on the hands and fits seamlessly into any wallet or pocket without creasing.',
        accent_color: '#0099ff',
        is_featured: true,
      },
      {
        id: 3,
        title: 'Metallic Gold Foil Cards',
        slug: 'gold-foil',
        category_group: 'special',
        dimensions: '8.9 cm x 5.1 cm',
        gsm: '400 GSM',
        finish_type: 'Velvet Soft Touch + Gold Foil',
        base_price_100: 450.0,
        min_quantity: 100,
        rating: 4.9,
        reviews_count: 650,
        badge: 'Luxury',
        tagline: 'Ultra-luxurious hot foil stamped accents that gleam under light.',
        description: 'Reflective gold foil applied onto rich matte velvet texture. Designed for luxury brands, architects, realtors, and senior executives.',
        accent_color: '#d4af37',
        is_featured: true,
      },
      {
        id: 4,
        title: 'Raised Spot UV Cards',
        slug: 'raised-spot-uv',
        category_group: 'special',
        dimensions: '8.9 cm x 5.1 cm',
        gsm: '380 GSM',
        finish_type: 'Matte + 3D Glossy Spot UV',
        base_price_100: 380.0,
        min_quantity: 100,
        rating: 4.7,
        reviews_count: 520,
        badge: 'Tactile',
        tagline: '3D raised glossy polymer highlighting your logo and typography.',
        description: 'Creates a striking tactile contrast between smooth matte background and raised high-gloss logo elements.',
        accent_color: '#7c3aed',
        is_featured: true,
      },
      {
        id: 5,
        title: 'Classic Linen Textured Cards',
        slug: 'linen-textured',
        category_group: 'texture',
        dimensions: '8.9 cm x 5.1 cm',
        gsm: '320 GSM',
        finish_type: 'Woven Linen Texture',
        base_price_100: 280.0,
        min_quantity: 100,
        rating: 4.6,
        reviews_count: 310,
        badge: 'Artisanal',
        tagline: 'Fine cross-hatched woven texture with an authentic organic touch.',
        description: 'Imparts a classic, handcrafted paper texture ideal for lawyers, consultants, boutiques, and artists.',
        accent_color: '#047857',
        is_featured: false,
      },
      {
        id: 6,
        title: 'Executive Matte Card Holder',
        slug: 'card-holder',
        category_group: 'holders',
        dimensions: '9.5 cm x 6.2 cm',
        gsm: 'Stainless Steel & Vegan Leather',
        finish_type: 'Laser Engraved',
        base_price_100: 199.0,
        min_quantity: 1,
        rating: 4.8,
        reviews_count: 410,
        badge: 'Accessory',
        tagline: 'Magnetic closure case holds up to 25 visiting cards crisp and pristine.',
        description: 'Sleek brushed metal pocket case with magnetic snap closure. Protects your cards from edge bends and water splashes.',
        accent_color: '#0f172a',
        is_featured: false,
      }
    ];
  }
};

export const fetchCardBySlug = async (slugOrId) => {
  try {
    return await apiRequest(`/cards/${slugOrId}/`);
  } catch (err) {
    console.warn(`Card detail fetch error for ${slugOrId}:`, err);
    const all = await fetchCards();
    return all.find(c => String(c.slug) === String(slugOrId) || String(c.id) === String(slugOrId)) || all[0];
  }
};
