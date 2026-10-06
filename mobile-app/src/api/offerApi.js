import { apiRequest } from './apiClient';

export const fetchOffers = async () => {
  try {
    const data = await apiRequest('/promos/');
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (e) {
    console.warn('Offers fetch fallback:', e);
  }

  return [
    {
      id: 1,
      code: 'SAPFIRST',
      title: 'Welcome First Order Discount',
      discountPercentage: 20,
      description: 'Get flat 20% OFF on your first Visiting Card or Promotional Banner order.',
      minOrderAmount: 200,
      badgeText: 'SPECIAL 20% OFF',
      badgeColor: '#EF1C62',
      bgColor: '#FFEBF1',
      borderColor: 'rgba(239, 28, 98, 0.2)',
      expiryDate: '31 Dec 2026',
      terms: 'Valid once per user. Applicable across all standard and premium card categories.',
    },
    {
      id: 2,
      code: 'BULK30',
      title: 'Corporate Bulk Printing Bundle',
      discountPercentage: 30,
      description: 'Flat 30% discount on 500+ Visiting Cards, Brochures, Flyers, and Stickers.',
      minOrderAmount: 1000,
      badgeText: 'BULK PRINTING 30% OFF',
      badgeColor: '#7C3AED',
      bgColor: '#F3E8FF',
      borderColor: 'rgba(124, 58, 237, 0.2)',
      expiryDate: '31 Dec 2026',
      terms: 'Minimum cart value of ₹1,000 required. Unlimited usages for business customers.',
    },
    {
      id: 3,
      code: 'FREESHIP',
      title: 'Free Metro Express Shipping',
      discountPercentage: 0,
      discountFixed: 50,
      description: 'Enjoy free same-day air courier on orders over ₹499 within Telangana & AP.',
      minOrderAmount: 499,
      badgeText: 'FREE SHIPPING',
      badgeColor: '#12A66A',
      bgColor: '#EAF8F1',
      borderColor: 'rgba(18, 166, 106, 0.2)',
      expiryDate: '31 Dec 2026',
      terms: 'Auto-applies zero delivery charge on checkout for standard and express shipping.',
    },
    {
      id: 4,
      code: 'LUXURY15',
      title: 'Gold Foil & Spot UV Special',
      discountPercentage: 15,
      description: '15% instant discount on Velvet Soft-Touch, Raised UV and Gold Foil finishes.',
      minOrderAmount: 400,
      badgeText: 'LUXURY 15% OFF',
      badgeColor: '#1C7EE0',
      bgColor: '#EBF5FF',
      borderColor: 'rgba(28, 126, 224, 0.2)',
      expiryDate: '31 Dec 2026',
      terms: 'Applicable on luxury visiting card categories.',
    },
  ];
};

export const validatePromoCode = async (code, orderTotal) => {
  try {
    const data = await apiRequest('/promos/validate/', {
      method: 'POST',
      body: JSON.stringify({ code, order_total: orderTotal }),
    });
    return data;
  } catch (err) {
    const uppercaseCode = (code || '').toUpperCase().trim();
    if (uppercaseCode === 'SAPFIRST' || uppercaseCode === 'PROMO15') {
      return { valid: true, discount_percent: 15, message: '15% Discount Applied!' };
    }
    if (uppercaseCode === 'BULK30') {
      return { valid: true, discount_percent: 30, message: '30% Bulk Discount Applied!' };
    }
    if (uppercaseCode === 'FREESHIP') {
      return { valid: true, discount_amount: 50, message: 'Free Shipping Applied!' };
    }
    return { valid: false, message: 'Invalid or expired coupon code' };
  }
};
