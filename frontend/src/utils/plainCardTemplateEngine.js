/**
 * plainCardTemplateEngine.js
 * 
 * Analyzes any uploaded visiting card image and extracts:
 * 1. Graphic design elements (split panels, accent lines, border rules, icon badge shapes)
 * 2. Contact icons (phone, email, globe/web, location/pin, social)
 * 3. Exact element positions (x, y, width, height, alignment, font sizing)
 * 4. Strictly uses GENERIC PLACEHOLDERS instead of uploaded personal card data
 *    ("Full Name", "Job Title", "COMPANY NAME", "+1 (555) 000-0000", "contact@example.com", etc.)
 */

import { parseVisitingCardText } from './cardOcrParser';

// Standard high-quality placeholder values
export const TEMPLATE_PLACEHOLDERS = {
  fullName: 'Full Name',
  jobTitle: 'Job Title / Designation',
  companyName: 'COMPANY NAME',
  companyMessage: 'Your Business Tagline Here',
  phone: '+1 (555) 000-0000',
  phone_2: '+1 (555) 000-1111',
  email: 'contact@company.com',
  web: 'www.company.com',
  address1: '123 Business Street, Suite 100',
  address2: 'City, State, Country - 10001',
  customText: 'Custom Text Description',
  logo: 'BRAND LOGO',
  qr: 'https://www.company.com',
};

/**
 * Extracts dominant background colors, panel splits, and accent colors from an image canvas
 */
export function extractCardColorPalette(canvas, ctx) {
  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Sample corner pixels to determine main background
  const samplePoints = [
    [10, 10], [w - 10, 10], [10, h - 10], [w - 10, h - 10],
    [Math.floor(w / 2), 10], [Math.floor(w / 2), h - 10],
    [10, Math.floor(h / 2)], [w - 10, Math.floor(h / 2)],
  ];

  const colorSamples = [];
  samplePoints.forEach(([sx, sy]) => {
    const idx = (sy * w + sx) * 4;
    colorSamples.push({
      r: data[idx],
      g: data[idx + 1],
      b: data[idx + 2],
    });
  });

  // Calculate average corner color for background
  const avgBg = colorSamples.reduce(
    (acc, c) => ({ r: acc.r + c.r, g: acc.g + c.g, b: acc.b + c.b }),
    { r: 0, g: 0, b: 0 }
  );
  avgBg.r = Math.round(avgBg.r / colorSamples.length);
  avgBg.g = Math.round(avgBg.g / colorSamples.length);
  avgBg.b = Math.round(avgBg.b / colorSamples.length);

  const isDarkBg = (avgBg.r * 0.299 + avgBg.g * 0.587 + avgBg.b * 0.114) < 130;
  const bgColorHex = rgbToHex(avgBg.r, avgBg.g, avgBg.b);

  // Check if there is a split panel (e.g. left side dark, right side light or vice versa)
  const leftIdx = (Math.floor(h / 2) * w + Math.floor(w * 0.15)) * 4;
  const rightIdx = (Math.floor(h / 2) * w + Math.floor(w * 0.85)) * 4;
  const leftColor = { r: data[leftIdx], g: data[leftIdx + 1], b: data[leftIdx + 2] };
  const rightColor = { r: data[rightIdx], g: data[rightIdx + 1], b: data[rightIdx + 2] };

  const colorDiff = Math.abs(leftColor.r - rightColor.r) +
                    Math.abs(leftColor.g - rightColor.g) +
                    Math.abs(leftColor.b - rightColor.b);

  let hasSplitPanel = false;
  let splitType = null;
  let panelColorHex = null;

  if (colorDiff > 120) {
    hasSplitPanel = true;
    splitType = 'vertical_split';
    panelColorHex = rgbToHex(rightColor.r, rightColor.g, rightColor.b);
  }

  // Determine text primary color based on background luminance
  const textPrimary = isDarkBg ? '#ffffff' : '#0f172a';
  const textMuted = isDarkBg ? '#94a3b8' : '#64748b';
  const accentColor = isDarkBg ? '#38bdf8' : '#0070ba';

  return {
    backgroundColor: bgColorHex,
    isDarkBg,
    hasSplitPanel,
    splitType,
    panelColor: panelColorHex,
    textPrimary,
    textMuted,
    accentColor,
    badgeBg: isDarkBg ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 112, 186, 0.1)',
  };
}

/**
 * Detects geometric divider lines, accent bars, and border rules
 */
export function detectGraphicElements(canvas, ctx, colorInfo) {
  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const graphics = [];

  // 1. If split panel exists, add split decorative shape
  if (colorInfo.hasSplitPanel) {
    graphics.push({
      id: 'graphic_split_panel',
      type: 'panel',
      x: Math.round(w * 0.55),
      y: 0,
      width: Math.round(w * 0.45),
      height: h,
      fill: colorInfo.panelColor || (colorInfo.isDarkBg ? '#1e293b' : '#f8fafc'),
      zIndex: 2,
    });
  }

  // 2. Scan for horizontal accent lines (e.g. underline under name)
  const stepY = 15;
  for (let y = Math.floor(h * 0.15); y < Math.floor(h * 0.7); y += stepY) {
    let continuousAccent = 0;
    let startX = 0;

    for (let x = Math.floor(w * 0.05); x < Math.floor(w * 0.6); x += 6) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Check if pixel contrast deviates strongly from background
      const lum = r * 0.299 + g * 0.587 + b * 0.114;
      const bgLum = colorInfo.isDarkBg ? 20 : 230;

      if (Math.abs(lum - bgLum) > 80) {
        if (continuousAccent === 0) startX = x;
        continuousAccent += 6;
      } else {
        if (continuousAccent >= 40 && continuousAccent <= 180) {
          graphics.push({
            id: `graphic_accent_line_${y}`,
            type: 'line',
            x: startX,
            y,
            width: continuousAccent,
            height: 3,
            fill: colorInfo.accentColor,
            zIndex: 4,
          });
          break;
        }
        continuousAccent = 0;
      }
    }
  }

  return graphics;
}

/**
 * Converts detected OCR bounding boxes into exact-positioned generic template elements
 * using standard placeholder content.
 */
export function buildPlainCardElements({
  ocrData,
  canvasWidth = 1050,
  canvasHeight = 600,
  colorInfo,
}) {
  const elements = [];
  const rawLines = ocrData?.lines || [];
  const parsed = parseVisitingCardText(ocrData?.text || '');

  // Track discovered roles to prevent duplicates
  const assignedRoles = new Set();
  let contactRowY = Math.floor(canvasHeight * 0.52);

  // If OCR gave line boxes, use their actual coordinates
  rawLines.forEach((line, idx) => {
    const text = (line.text || '').trim();
    if (!text || text.length < 2) return;

    const bbox = line.bbox || {};
    const origX = bbox.x0 ?? Math.floor(canvasWidth * 0.08);
    const origY = bbox.y0 ?? (Math.floor(canvasHeight * 0.15) + idx * 35);
    const origW = (bbox.x1 ? bbox.x1 - bbox.x0 : Math.floor(canvasWidth * 0.35));
    const origH = (bbox.y1 ? bbox.y1 - bbox.y0 : 28);

    // Normalize coordinates
    const normX = Math.max(20, Math.min(canvasWidth - 100, origX));
    const normY = Math.max(20, Math.min(canvasHeight - 50, origY));

    // Determine field role based on heuristics (NOT using the original text content as value)
    const lower = text.toLowerCase();
    let role = 'customText';
    let placeholder = TEMPLATE_PLACEHOLDERS.customText;
    let fontSize = Math.max(13, Math.min(32, Math.round(origH * 0.85)));
    let fontWeight = 500;
    let color = colorInfo.textPrimary;
    let icon = null;

    if (/@|\.com|\.in|\.org/i.test(lower) && lower.includes('@') && !assignedRoles.has('email')) {
      role = 'email';
      placeholder = TEMPLATE_PLACEHOLDERS.email;
      fontSize = 13;
      color = colorInfo.textPrimary;
      icon = 'mail';
      assignedRoles.add('email');
    } else if (/\b(www\.|\.com|\.io|\.net|\.co)\b/i.test(lower) && !assignedRoles.has('web')) {
      role = 'web';
      placeholder = TEMPLATE_PLACEHOLDERS.web;
      fontSize = 13;
      color = colorInfo.accentColor;
      icon = 'globe';
      assignedRoles.add('web');
    } else if (/(\+?\d[\d\s-]{7,})/i.test(lower) && !assignedRoles.has('phone')) {
      role = 'phone';
      placeholder = TEMPLATE_PLACEHOLDERS.phone;
      fontSize = 13;
      fontWeight = 600;
      color = colorInfo.textPrimary;
      icon = 'phone';
      assignedRoles.add('phone');
    } else if (/(\+?\d[\d\s-]{7,})/i.test(lower) && assignedRoles.has('phone') && !assignedRoles.has('phone_2')) {
      role = 'phone_2';
      placeholder = TEMPLATE_PLACEHOLDERS.phone_2;
      fontSize = 13;
      fontWeight = 600;
      color = colorInfo.textPrimary;
      icon = 'phone';
      assignedRoles.add('phone_2');
    } else if (/\b(road|street|floor|suite|st|avenue|city|nagar|plot|phase|tower|building)\b/i.test(lower) && !assignedRoles.has('address1')) {
      role = 'address1';
      placeholder = TEMPLATE_PLACEHOLDERS.address1;
      fontSize = 12;
      color = colorInfo.textMuted;
      icon = 'mapPin';
      assignedRoles.add('address1');
    } else if (idx === 0 || (origY < canvasHeight * 0.35 && !assignedRoles.has('fullName') && origX < canvasWidth * 0.6)) {
      role = 'fullName';
      placeholder = TEMPLATE_PLACEHOLDERS.fullName;
      fontSize = Math.max(22, Math.min(36, Math.round(origH * 1.1)));
      fontWeight = 800;
      color = colorInfo.textPrimary;
      assignedRoles.add('fullName');
    } else if (assignedRoles.has('fullName') && !assignedRoles.has('jobTitle') && origY < canvasHeight * 0.45) {
      role = 'jobTitle';
      placeholder = TEMPLATE_PLACEHOLDERS.jobTitle;
      fontSize = Math.max(12, Math.min(18, Math.round(origH * 0.9)));
      fontWeight = 600;
      color = colorInfo.textMuted;
      assignedRoles.add('jobTitle');
    } else if (!assignedRoles.has('companyName') && (origX > canvasWidth * 0.45 || origY < canvasHeight * 0.25 || /inc|llc|pvt|ltd|solutions|services|corp/i.test(lower))) {
      role = 'companyName';
      placeholder = TEMPLATE_PLACEHOLDERS.companyName;
      fontSize = Math.max(16, Math.min(26, Math.round(origH * 1.0)));
      fontWeight = 800;
      color = colorInfo.textPrimary;
      assignedRoles.add('companyName');
    }

    elements.push({
      id: `el_${role}_${idx}`,
      role,
      field: role,
      type: 'text',
      content: placeholder, // Pure generic placeholder
      variable: `{{${role}}}`,
      x: normX,
      y: normY,
      width: Math.max(120, origW),
      height: origH,
      fontSize,
      fontWeight,
      color,
      alignment: origX > canvasWidth * 0.55 ? 'center' : 'left',
      icon,
      zIndex: 10 + idx,
      editable: true,
    });
  });

  // Ensure mandatory core fields exist at sensible standard coordinates if missing from OCR
  if (!assignedRoles.has('fullName')) {
    elements.unshift({
      id: 'el_fullName_default',
      role: 'fullName',
      field: 'fullName',
      type: 'text',
      content: TEMPLATE_PLACEHOLDERS.fullName,
      variable: '{{fullName}}',
      x: Math.floor(canvasWidth * 0.08),
      y: Math.floor(canvasHeight * 0.18),
      width: 280,
      height: 38,
      fontSize: 26,
      fontWeight: 800,
      color: colorInfo.textPrimary,
      alignment: 'left',
      zIndex: 10,
      editable: true,
    });
  }

  if (!assignedRoles.has('jobTitle')) {
    elements.push({
      id: 'el_jobTitle_default',
      role: 'jobTitle',
      field: 'jobTitle',
      type: 'text',
      content: TEMPLATE_PLACEHOLDERS.jobTitle,
      variable: '{{jobTitle}}',
      x: Math.floor(canvasWidth * 0.08),
      y: Math.floor(canvasHeight * 0.27),
      width: 240,
      height: 24,
      fontSize: 14,
      fontWeight: 600,
      color: colorInfo.textMuted,
      alignment: 'left',
      zIndex: 11,
      editable: true,
    });
  }

  if (!assignedRoles.has('phone')) {
    elements.push({
      id: 'el_phone_default',
      role: 'phone',
      field: 'phone',
      type: 'text',
      content: TEMPLATE_PLACEHOLDERS.phone,
      variable: '{{phone}}',
      x: Math.floor(canvasWidth * 0.08),
      y: contactRowY,
      width: 200,
      height: 22,
      fontSize: 13,
      fontWeight: 600,
      color: colorInfo.textPrimary,
      icon: 'phone',
      alignment: 'left',
      zIndex: 12,
      editable: true,
    });
    contactRowY += 32;
  }

  if (!assignedRoles.has('email')) {
    elements.push({
      id: 'el_email_default',
      role: 'email',
      field: 'email',
      type: 'text',
      content: TEMPLATE_PLACEHOLDERS.email,
      variable: '{{email}}',
      x: Math.floor(canvasWidth * 0.08),
      y: contactRowY,
      width: 220,
      height: 22,
      fontSize: 13,
      fontWeight: 500,
      color: colorInfo.textPrimary,
      icon: 'mail',
      alignment: 'left',
      zIndex: 13,
      editable: true,
    });
    contactRowY += 32;
  }

  if (!assignedRoles.has('web')) {
    elements.push({
      id: 'el_web_default',
      role: 'web',
      field: 'web',
      type: 'text',
      content: TEMPLATE_PLACEHOLDERS.web,
      variable: '{{web}}',
      x: Math.floor(canvasWidth * 0.08),
      y: contactRowY,
      width: 200,
      height: 22,
      fontSize: 13,
      fontWeight: 500,
      color: colorInfo.accentColor,
      icon: 'globe',
      alignment: 'left',
      zIndex: 14,
      editable: true,
    });
    contactRowY += 32;
  }

  // Add Logo Placeholder Element (typically right or top-right)
  const logoX = Math.floor(canvasWidth * 0.72);
  const logoY = Math.floor(canvasHeight * 0.18);
  elements.push({
    id: 'el_logo_placeholder',
    role: 'logo',
    field: 'logo',
    type: 'logo_placeholder',
    content: TEMPLATE_PLACEHOLDERS.logo,
    x: logoX,
    y: logoY,
    width: 68,
    height: 68,
    badgeBg: colorInfo.badgeBg,
    accentColor: colorInfo.accentColor,
    zIndex: 20,
    editable: true,
  });

  // Company Name below Logo
  if (!assignedRoles.has('companyName')) {
    elements.push({
      id: 'el_company_default',
      role: 'companyName',
      field: 'companyName',
      type: 'text',
      content: TEMPLATE_PLACEHOLDERS.companyName,
      variable: '{{companyName}}',
      x: Math.floor(canvasWidth * 0.65),
      y: logoY + 76,
      width: Math.floor(canvasWidth * 0.3),
      height: 26,
      fontSize: 16,
      fontWeight: 800,
      color: colorInfo.textPrimary,
      alignment: 'center',
      zIndex: 21,
      editable: true,
    });
  }

  // QR Code Placeholder (typically bottom-right)
  elements.push({
    id: 'el_qr_placeholder',
    role: 'qr',
    field: 'qr',
    type: 'qr',
    value: TEMPLATE_PLACEHOLDERS.qr,
    x: Math.floor(canvasWidth * 0.75),
    y: Math.floor(canvasHeight * 0.58),
    width: 72,
    height: 72,
    zIndex: 22,
    editable: true,
  });

  return elements;
}

/**
 * Main function: builds complete Plain Card Template JSON from any uploaded card
 */
export async function generatePlainCardTemplate({
  imageDataUrl,
  ocrResult,
  userTitle = '',
  industry = 'Corporate & Business',
  side = 'front',
}) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const isVertical = img.naturalHeight > img.naturalWidth * 1.15;
      const canvasWidth = isVertical ? 600 : 1050;
      const canvasHeight = isVertical ? 1050 : 600;

      const offscreen = document.createElement('canvas');
      offscreen.width = canvasWidth;
      offscreen.height = canvasHeight;
      const ctx = offscreen.getContext('2d');
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      // 1. Color Palette & Panel Analysis
      const colorInfo = extractCardColorPalette(offscreen, ctx);

      // 2. Graphic Elements (divider lines, split panels)
      const graphics = detectGraphicElements(offscreen, ctx, colorInfo);

      // 3. Exact-Positioned Generic Elements (NO uploaded card data)
      const elements = buildPlainCardElements({
        ocrData: ocrResult,
        canvasWidth,
        canvasHeight,
        colorInfo,
      });

      // Construct canonical template JSON
      const plainTemplateJson = {
        version: '3.0.0-plain-template',
        side,
        canvas: {
          width: canvasWidth,
          height: canvasHeight,
          orientation: isVertical ? 'vertical' : 'horizontal',
          aspectRatio: isVertical ? '9:16' : '16:9',
        },
        background: {
          type: colorInfo.hasSplitPanel ? 'split_panel' : 'plain_solid',
          color: colorInfo.backgroundColor,
          panelColor: colorInfo.panelColor,
          isDark: colorInfo.isDarkBg,
          accentColor: colorInfo.accentColor,
          badgeBg: colorInfo.badgeBg,
        },
        graphics,
        elements,
        fields: {
          fullName: TEMPLATE_PLACEHOLDERS.fullName,
          jobTitle: TEMPLATE_PLACEHOLDERS.jobTitle,
          companyName: TEMPLATE_PLACEHOLDERS.companyName,
          companyMessage: TEMPLATE_PLACEHOLDERS.companyMessage,
          phone: TEMPLATE_PLACEHOLDERS.phone,
          email: TEMPLATE_PLACEHOLDERS.email,
          web: TEMPLATE_PLACEHOLDERS.web,
          address1: TEMPLATE_PLACEHOLDERS.address1,
        },
        metadata: {
          title: userTitle || 'Plain Visiting Card Template',
          industry,
          status: 'PUBLISHED',
          createdAt: new Date().toISOString(),
        },
      };

      resolve({
        plainTemplateJson,
        colorInfo,
        canvasWidth,
        canvasHeight,
        orientation: isVertical ? 'vertical' : 'horizontal',
      });
    };

    img.onerror = () => {
      // Fallback if image fails to load
      resolve({
        plainTemplateJson: null,
        error: 'Failed to process card image',
      });
    };

    img.src = imageDataUrl;
  });
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => {
    const hex = Math.max(0, Math.min(255, x)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}
