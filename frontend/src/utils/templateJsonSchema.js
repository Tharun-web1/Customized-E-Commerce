/**
 * Canonical Template JSON Schema Engine
 * Produces structured, normalized, and editable template representations
 * matching the exact visual card layout.
 */

export const DEFAULT_CANVAS_WIDTH = 1050;
export const DEFAULT_CANVAS_HEIGHT = 600;

/**
 * Creates a unique identifier for template elements
 */
export function generateElementId(prefix = 'el') {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Builds the canonical Template JSON dynamically from Computer Vision & OCR results
 */
export function buildCanonicalTemplateJson({
  cardAnalysis = {},
  userMetadata = {},
}) {
  const canvas = {
    width: DEFAULT_CANVAS_WIDTH,
    height: DEFAULT_CANVAS_HEIGHT,
    orientation: cardAnalysis.orientation || 'horizontal',
  };

  const bg = cardAnalysis.background || {};
  const isDark = bg.theme === 'dark' || (bg.color && bg.color !== '#ffffff');
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';

  const background = {
    type: bg.type || 'gradient',
    color: bg.color || (isDark ? '#151b2d' : '#ffffff'),
    gradient: bg.gradient || (isDark
      ? 'linear-gradient(135deg, #101524 0%, #1c243c 55%, #131828 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)'),
    theme: isDark ? 'dark' : 'light',
    palette: bg.palette || (isDark ? ['#151b2d', '#2563eb', '#fbbf24', '#38bdf8'] : ['#ffffff', '#0056b3', '#1e293b', '#eab308']),
    cleanArtworkSrc: cardAnalysis.cleanArtworkSrc || bg.cleanArtworkSrc || '',
    accents: [],
  };

  const content = cardAnalysis.content || {};
  const assets = cardAnalysis.assets || {};
  const elements = [];

  // 1. Person Name (Only if present)
  if (content.personName) {
    elements.push({
      id: generateElementId('text'),
      type: 'text',
      field: 'personName',
      content: content.personName,
      x: content.nameBox?.x || 70,
      y: content.nameBox?.y || 60,
      width: content.nameBox?.width || 280,
      height: 48,
      fontSize: 26,
      fontFamily: 'Inter, sans-serif',
      fontWeight: '800',
      color: textColor,
      alignment: 'left',
      confidence: content.nameConfidence || 0.95,
      editable: true,
      locked: false,
    });
  }

  // 2. Job Designation (Only if present)
  if (content.jobTitle) {
    elements.push({
      id: generateElementId('text'),
      type: 'text',
      field: 'designation',
      content: content.jobTitle,
      x: content.titleBox?.x || 70,
      y: content.titleBox?.y || 110,
      width: content.titleBox?.width || 220,
      height: 32,
      fontSize: 15,
      fontFamily: 'Inter, sans-serif',
      fontWeight: '600',
      color: subTextColor,
      alignment: 'left',
      confidence: content.titleConfidence || 0.92,
      editable: true,
      locked: false,
    });
  }

  // 3. Contact: Phones (Only if present)
  if (content.phone) {
    elements.push({
      id: generateElementId('contact'),
      type: 'contact',
      field: 'phone',
      iconType: 'phone',
      content: content.phone,
      x: 70,
      y: 330,
      width: 320,
      height: 40,
      fontSize: 14,
      fontFamily: 'Inter, sans-serif',
      fontWeight: '600',
      color: isDark ? '#f8fafc' : '#1e293b',
      iconBadgeBg: '#1e3a8a',
      iconColor: '#60a5fa',
      confidence: content.phoneConfidence || 0.98,
      editable: true,
      locked: false,
    });
  }

  // 4. Contact: Email (Only if present)
  if (content.email) {
    elements.push({
      id: generateElementId('contact'),
      type: 'contact',
      field: 'email',
      iconType: 'email',
      content: content.email,
      x: 70,
      y: 385,
      width: 320,
      height: 40,
      fontSize: 13,
      fontFamily: 'Inter, sans-serif',
      fontWeight: '500',
      color: isDark ? '#e2e8f0' : '#334155',
      iconBadgeBg: '#1e3a8a',
      iconColor: '#60a5fa',
      confidence: content.emailConfidence || 0.95,
      editable: true,
      locked: false,
    });
  }

  // 5. Contact: Address (Only if present)
  if (content.address) {
    elements.push({
      id: generateElementId('contact'),
      type: 'contact',
      field: 'address',
      iconType: 'address',
      content: content.address,
      x: 70,
      y: 440,
      width: 360,
      height: 55,
      fontSize: 12,
      fontFamily: 'Inter, sans-serif',
      fontWeight: '500',
      color: subTextColor,
      iconBadgeBg: '#1e3a8a',
      iconColor: '#60a5fa',
      confidence: content.addressConfidence || 0.88,
      editable: true,
      locked: false,
    });
  }

  // 6. Company Name (Only if present)
  if (content.companyName) {
    elements.push({
      id: generateElementId('text'),
      type: 'text',
      field: 'companyName',
      content: content.companyName,
      x: 700,
      y: 185,
      width: 220,
      height: 35,
      fontSize: 18,
      fontFamily: 'Inter, sans-serif',
      fontWeight: '800',
      letterSpacing: 2,
      color: textColor,
      alignment: 'center',
      confidence: content.companyConfidence || 0.91,
      editable: true,
      locked: false,
    });
  }

  // 7. QR Code (Only if present)
  if (assets.hasQrCode && (assets.qrValue || content.website)) {
    elements.push({
      id: generateElementId('qr'),
      type: 'qr',
      field: 'qrCode',
      value: assets.qrValue || content.website || 'https://example.com',
      enabled: true,
      x: 760,
      y: 250,
      width: 100,
      height: 100,
      confidence: 0.99,
      editable: true,
      locked: false,
    });
  }

  // 8. Logo Asset (Only if present)
  if (assets.logoSrc || assets.logoInitials) {
    elements.push({
      id: generateElementId('logo'),
      type: 'logo',
      field: 'companyLogo',
      logoType: assets.logoType || 'emblem',
      initials: assets.logoInitials || '',
      src: assets.logoSrc || '',
      x: 750,
      y: 50,
      width: 120,
      height: 120,
      color: '#fbbf24',
      bgGradient: 'radial-gradient(circle at 35% 35%, #2563eb 0%, #1e3a8a 70%, #0f172a 100%)',
      confidence: 0.94,
      editable: true,
      locked: false,
    });
  }

  return {
    version: 1,
    schema: 'vistaprint-canonical-v1',
    timestamp: new Date().toISOString(),
    canvas,
    background,
    elements,
    variables: {
      personName: content.personName || '',
      jobTitle: content.jobTitle || '',
      companyName: content.companyName || '',
      phone: content.phone || '',
      email: content.email || '',
      website: content.website || '',
      address: content.address || '',
    },
    metadata: {
      title: userMetadata.title || 'Dynamic Template',
      industry: userMetadata.industry || 'Corporate & Business',
      cardId: userMetadata.cardId || null,
      source: 'card_analysis',
    },
  };
}
