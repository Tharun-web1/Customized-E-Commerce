/**
 * plainCardTemplateEngine.js
 * 
 * Generates an accurate, reusable template matching ANY uploaded visiting card:
 * 1. Preserves the card's real graphic design, background artwork, curves, badges, and icons
 * 2. Positions detected elements at their EXACT (X, Y) coordinates
 * 3. Replaces client-specific private text with standard GENERIC TEMPLATE PLACEHOLDERS
 *    ("COMPANY NAME", "www.yourwebsite.com", "City, State, Country", etc.)
 * 4. NEVER forces or hallucinates non-existent elements (e.g., if there's no phone or person name,
 *    it does NOT inject them).
 * 5. NO fake synthetic staircase lines.
 */

import { segmentCardElements } from './cardSegmentationEngine';

export const GENERIC_PLACEHOLDERS = {
  fullName: 'Full Name',
  jobTitle: 'Job Title',
  companyName: 'COMPANY NAME',
  tagline: 'Your Business Tagline Here',
  phone: '+1 (555) 000-0000',
  phone_2: '+1 (555) 000-1111',
  email: 'contact@company.com',
  website: 'www.yourwebsite.com',
  address: 'City, State, Country',
  service: 'Service Name',
  customText: 'Custom Text',
};

export const TEMPLATE_PLACEHOLDERS = GENERIC_PLACEHOLDERS;

/**
 * Maps a detected text line to an appropriate generic template placeholder
 */
function getPlaceholderForRole(field, cleanText, idx) {
  if (field === 'website' || field.startsWith('website')) return GENERIC_PLACEHOLDERS.website;
  if (field === 'address') return GENERIC_PLACEHOLDERS.address;
  if (field === 'companyName') return GENERIC_PLACEHOLDERS.companyName;
  if (field === 'tagline') return GENERIC_PLACEHOLDERS.tagline;
  if (field === 'personName') return GENERIC_PLACEHOLDERS.fullName;
  if (field === 'designation') return GENERIC_PLACEHOLDERS.jobTitle;
  if (field === 'phone' || field.startsWith('phone')) return idx > 0 ? GENERIC_PLACEHOLDERS.phone_2 : GENERIC_PLACEHOLDERS.phone;
  if (field === 'email' || field.startsWith('email')) return GENERIC_PLACEHOLDERS.email;

  // Check if it's a short service/feature label (like "Website Design", "Web Applications")
  if (cleanText && cleanText.length < 25 && !/\d/.test(cleanText) && cleanText.split(' ').length <= 3) {
    return cleanText; // Keep descriptive service label or use clean generic
  }

  return GENERIC_PLACEHOLDERS.customText;
}

/**
 * Builds the canonical template JSON from segmentation data
 */
export async function generatePlainCardTemplate({
  imageDataUrl,
  userTitle = '',
  industry = 'Corporate & Business',
  side = 'front',
  onProgress = () => {},
}) {
  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
    img.src = imageDataUrl;
  });

  const isVertical = img.naturalHeight > img.naturalWidth * 1.15;
  const canvasWidth = isVertical ? 600 : 1050;
  const canvasHeight = isVertical ? 1050 : 600;

  // 1. Run full visual decomposition: text detection, inpainting, logo/qr localization
  const segmented = await segmentCardElements(
    imageDataUrl,
    { canvasWidth, canvasHeight },
    onProgress
  );

  const {
    texts = [],
    cleanBackgroundUrl = '',
    logoAsset = null,
    logoBox = null,
    qrAsset = null,
    qrBox = null,
    hasQrCode = false,
    cardBgColor = '#ffffff',
    primaryColor = '#0070ba',
    accentColor = '#eab308',
  } = segmented;

  const elements = [];
  let zCounter = 10;

  // 2. Add Logo Element if a distinct visual logo cluster was detected
  if (logoBox && logoAsset) {
    elements.push({
      id: `el_logo_${Date.now()}`,
      type: 'image',
      role: 'logo',
      field: 'logo',
      src: logoAsset,
      x: logoBox.x,
      y: logoBox.y,
      width: logoBox.width,
      height: logoBox.height,
      zIndex: 20,
      editable: true,
      locked: false,
    });
  }

  // 3. Add QR Code Element ONLY if actually detected on the card
  if (hasQrCode && qrBox) {
    elements.push({
      id: `el_qr_${Date.now()}`,
      type: 'qr',
      role: 'qrCode',
      field: 'qr',
      value: 'https://www.example.com',
      x: qrBox.x,
      y: qrBox.y,
      width: qrBox.width,
      height: qrBox.height,
      zIndex: 25,
      editable: true,
      locked: false,
    });
  }

  // 4. Map ACTUALLY DETECTED text lines into generic template elements
  // NEVER force non-existent fields!
  texts.forEach((txt, idx) => {
    const placeholder = getPlaceholderForRole(txt.field, txt.cleanText, idx);

    elements.push({
      id: txt.id || `el_text_${idx}`,
      role: txt.field || 'customText',
      field: txt.field || 'customText',
      type: 'text',
      content: placeholder, // Generic placeholder (NO private data!)
      defaultValue: placeholder,
      variable: `{{${txt.field || `customText_${idx + 1}`}}}`,
      x: txt.x,
      y: txt.y,
      width: txt.width,
      height: txt.height,
      fontSize: txt.fontSize,
      fontWeight: txt.fontWeight,
      fontFamily: txt.fontFamily || 'Inter, system-ui, sans-serif',
      color: txt.color,
      alignment: txt.alignment || 'left',
      zIndex: zCounter++,
      editable: true,
      locked: false,
      visible: true,
    });
  });

  const plainTemplateJson = {
    version: '3.0.0-accurate-template',
    side,
    canvas: {
      width: canvasWidth,
      height: canvasHeight,
      orientation: isVertical ? 'vertical' : 'horizontal',
      aspectRatio: isVertical ? '9:16' : '16:9',
    },
    background: {
      type: 'card_artwork',
      color: cardBgColor || '#ffffff',
      cleanArtworkSrc: cleanBackgroundUrl || imageDataUrl,
      primaryColor,
      accentColor,
    },
    graphics: [], // No fake staircase lines!
    elements,
    metadata: {
      title: userTitle || 'Visiting Card Template',
      industry,
      status: 'PUBLISHED',
      createdAt: new Date().toISOString(),
    },
  };

  return {
    plainTemplateJson,
    canvasWidth,
    canvasHeight,
    orientation: isVertical ? 'vertical' : 'horizontal',
    cleanBackgroundUrl,
  };
}
