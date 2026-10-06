export const VISITING_CARD_GRAPHICS = [
  // 1. Contact & Communications
  { id: 'phone', name: 'Phone', label: 'Phone', category: 'contact', type: 'icon' },
  { id: 'smartphone', name: 'Smartphone', label: 'Mobile', category: 'contact', type: 'icon' },
  { id: 'phonecall', name: 'PhoneCall', label: 'Hotline', category: 'contact', type: 'icon' },
  { id: 'mail', name: 'Mail', label: 'Email', category: 'contact', type: 'icon' },
  { id: 'globe', name: 'Globe', label: 'Website', category: 'contact', type: 'icon' },
  { id: 'mappin', name: 'MapPin', label: 'Location', category: 'contact', type: 'icon' },
  { id: 'building', name: 'Building2', label: 'Office', category: 'contact', type: 'icon' },
  { id: 'message', name: 'MessageCircle', label: 'Chat / SMS', category: 'contact', type: 'icon' },
  { id: 'send', name: 'Send', label: 'Telegram', category: 'contact', type: 'icon' },

  // 2. Social Media Channels
  { id: 'whatsapp', name: 'WhatsApp', label: 'WhatsApp', category: 'social', type: 'icon' },
  { id: 'linkedin', name: 'LinkedIn', label: 'LinkedIn', category: 'social', type: 'icon' },
  { id: 'instagram', name: 'Instagram', label: 'Instagram', category: 'social', type: 'icon' },
  { id: 'facebook', name: 'Facebook', label: 'Facebook', category: 'social', type: 'icon' },
  { id: 'twitter', name: 'Twitter', label: 'X / Twitter', category: 'social', type: 'icon' },
  { id: 'youtube', name: 'YouTube', label: 'YouTube', category: 'social', type: 'icon' },

  // 3. Business & Trust Badges
  { id: 'briefcase', name: 'Briefcase', label: 'Services', category: 'business', type: 'icon' },
  { id: 'user', name: 'User', label: 'Founder', category: 'business', type: 'icon' },
  { id: 'users', name: 'Users', label: 'Team', category: 'business', type: 'icon' },
  { id: 'award', name: 'Award', label: 'Certified', category: 'business', type: 'icon' },
  { id: 'shield', name: 'ShieldCheck', label: 'Guaranteed', category: 'business', type: 'icon' },
  { id: 'clock', name: 'Clock', label: '24/7 Hours', category: 'business', type: 'icon' },
  { id: 'creditcard', name: 'CreditCard', label: 'Payments', category: 'business', type: 'icon' },
  { id: 'star', name: 'Star', label: 'Top Rated', category: 'business', type: 'icon' },
  { id: 'qrcode', name: 'QrCode', label: 'QR Scan', category: 'business', type: 'icon' },

  // 4. Badges & Shapes
  { id: 'circle_shape', name: 'circle', label: 'Circle Dot', category: 'shapes', type: 'shape' },
  { id: 'square_shape', name: 'square', label: 'Square Block', category: 'shapes', type: 'shape' },
  { id: 'pill_shape', name: 'pill', label: 'Pill Badge', category: 'shapes', type: 'shape' },
  { id: 'badge_shape', name: 'badge', label: 'Outline Badge', category: 'shapes', type: 'shape' },

  // 5. Dividers & Accent Rules
  { id: 'divider_thin', name: 'divider', label: 'Thin Divider', category: 'shapes', type: 'divider', size: { width: 180, height: 2 } },
  { id: 'divider_thick', name: 'divider', label: 'Bold Accent Bar', category: 'shapes', type: 'divider', size: { width: 220, height: 4 } },
  { id: 'divider_short', name: 'divider', label: 'Mini Accent Bar', category: 'shapes', type: 'divider', size: { width: 60, height: 3 } },
];

export const BG_SOLID_PRESETS = [
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Clean Slate', value: '#f8fafc' },
  { name: 'Soft Linen', value: '#fdfbf7' },
  { name: 'Warm Greige', value: '#f5f5f4' },
  { name: 'Charcoal Navy', value: '#0f172a' },
  { name: 'Executive Obsidian', value: '#09090b' },
  { name: 'Royal Sapphire', value: '#1e3a8a' },
  { name: 'Deep Navy', value: '#172554' },
  { name: 'Rich Emerald', value: '#064e3b' },
  { name: 'Burgundy Crimson', value: '#4c0519' },
  { name: 'Metallic Bronze', value: '#292524' },
  { name: 'Soft Powder Blue', value: '#f0f9ff' },
];

export const BG_GRADIENT_PRESETS = [
  { name: 'Executive Midnight', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
  { name: 'Royal Indigo', value: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' },
  { name: 'Luxury Gold & Slate', value: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)' },
  { name: 'Emerald Velvet', value: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)' },
  { name: 'Titanium Frost', value: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' },
  { name: 'Rose Champagne', value: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)' },
  { name: 'Warm Amber', value: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' },
  { name: 'Teal Elegance', value: 'linear-gradient(135deg, #042f2e 0%, #0d9488 100%)' },
];

export const BG_PATTERNS = [
  { id: 'none', title: 'None', desc: 'Plain background' },
  { id: 'dots', title: 'Dot Matrix', desc: 'Subtle micro polka dots' },
  { id: 'grid', title: 'Grid Line', desc: 'Architectural blueprint' },
  { id: 'stripes', title: 'Pinstripe', desc: 'Executive diagonal lines' },
  { id: 'mesh', title: 'Color Mesh', desc: 'Soft dual-radial gradient' },
];

export const FONT_FAMILIES = [
  { name: 'Modern Sans (Inter)', value: "'Inter', sans-serif" },
  { name: 'Clean Neutral (System)', value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  { name: 'Classic Serif (Georgia)', value: "'Georgia', serif" },
  { name: 'Executive Serif (Playfair)', value: "'Playfair Display', serif" },
  { name: 'Geometric Sans (Montserrat)', value: "'Montserrat', sans-serif" },
  { name: 'Minimalist (Roboto)', value: "'Roboto', sans-serif" },
  { name: 'Corporate (Open Sans)', value: "'Open Sans', sans-serif" },
];

export const QUANTITY_PRICE_TABLE = [
  { qty: 100, pricePerUnit: 2.70, savings: 0, tag: 'Standard' },
  { qty: 250, pricePerUnit: 2.45, savings: 9, tag: 'Popular' },
  { qty: 500, pricePerUnit: 2.10, savings: 22, tag: 'Best Value' },
  { qty: 1000, pricePerUnit: 1.85, savings: 31, tag: 'Corporate' },
  { qty: 2000, pricePerUnit: 1.60, savings: 40, tag: 'Enterprise' },
];
