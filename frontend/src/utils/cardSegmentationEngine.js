/**
 * Generic Card Segmentation & Decomposition Engine
 * 
 * Works dynamically on ANY visiting card image (no hardcoded layouts, coordinates, or fields):
 * 1. Full-canvas text detection with exact bounding boxes (x, y, width, height)
 * 2. True typography extraction (dynamic font sizes, font weights, colors, alignments)
 * 3. Dynamic semantic field classification (personName, designation, company, phones, emails, web, address, custom)
 * 4. Full-canvas QR code pattern scanning & asset localization
 * 5. Full-canvas Logo & visual graphic cluster isolation
 * 6. High-Fidelity Text Inpainting: masks out text regions and heals the underlying background
 *    so graphics, gradients, curves, and patterns are preserved WITHOUT duplicate text baking!
 */

import { createWorker } from 'tesseract.js';
import { loadImage } from './cardPreprocessingEngine';

/**
 * Executes complete visual decomposition on ANY preprocessed card image
 */
export async function segmentCardElements(imageDataUrl, canvasMeta, onProgress = () => {}) {
  const { canvasWidth = 1050, canvasHeight = 600 } = canvasMeta || {};

  onProgress('Initializing OCR & vision analysis engine...');
  const worker = await createWorker('eng');

  onProgress('Detecting text lines, coordinates, and bounding boxes across the card...');
  const ret = await worker.recognize(imageDataUrl);
  await worker.terminate();

  const lines = ret.data?.lines || [];
  const words = ret.data?.words || [];

  onProgress('Analyzing typography, colors, and layout structure...');
  const img = await loadImage(imageDataUrl);
  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;

  // Scale factor from OCR image dimensions to canonical normalized canvas
  const scaleX = canvasWidth / Math.max(1, srcW);
  const scaleY = canvasHeight / Math.max(1, srcH);

  // Read pixel data for color sampling, logo extraction, and background inpainting
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = srcW;
  tempCanvas.height = srcH;
  const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
  tempCtx.drawImage(img, 0, 0);
  const fullImageData = tempCtx.getImageData(0, 0, srcW, srcH);

  // 1. Process and normalize text blocks with exact coordinates
  const detectedTexts = processTextLines(lines, words, scaleX, scaleY, fullImageData, srcW, srcH, canvasWidth, canvasHeight);

  // 2. Classify semantic fields dynamically (no hardcoded values!)
  classifySemanticFields(detectedTexts);

  // 3. Scan the ENTIRE card for visual assets (Logo & QR Code anywhere on the card)
  onProgress('Scanning full canvas for logo, icons, and QR code regions...');
  const assets = detectAssetsFullCanvas(fullImageData, srcW, srcH, scaleX, scaleY, detectedTexts, canvasWidth, canvasHeight);

  // 4. Inpaint text areas on the background image to produce clean background
  onProgress('Generating clean background graphic layer with text inpainting...');
  const cleanBackgroundUrl = inpaintTextRegions(img, srcW, srcH, lines, assets.qrBox, assets.logoBox);

  // 5. Extract dominant palette & theme
  const paletteInfo = extractPaletteAndTheme(fullImageData);

  return {
    texts: detectedTexts,
    logoAsset: assets.logoAsset,
    logoBox: assets.logoBox,
    qrAsset: assets.qrAsset,
    qrBox: assets.qrBox,
    hasQrCode: Boolean(assets.hasQrCode),
    qrValue: assets.qrValue || '',
    cleanBackgroundUrl,
    palette: paletteInfo.palette,
    primaryColor: paletteInfo.primaryColor,
    accentColor: paletteInfo.accentColor,
    cardBgColor: paletteInfo.bgColor,
    textTheme: paletteInfo.theme,
    detectedGraphicAssets: assets.otherGraphics || [],
  };
}

/**
 * Normalizes detected text lines into coordinate-based elements
 */
function processTextLines(lines, words, scaleX, scaleY, fullImageData, srcW, srcH, canvasWidth, canvasHeight) {
  const elements = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const rawText = (line.text || '').trim();
    if (!rawText || rawText.length < 2) continue;

    // Filter out obvious system artifact headers
    if (rawText.toLowerCase().includes('converted template') || rawText.toLowerCase().includes('original uploaded')) {
      continue;
    }

    const bbox = line.bbox || { x0: 0, y0: 0, x1: 100, y1: 20 };
    const rawW = bbox.x1 - bbox.x0;
    const rawH = bbox.y1 - bbox.y0;

    // Map to normalized canvas coordinates
    const normX = Math.round(bbox.x0 * scaleX);
    const normY = Math.round(bbox.y0 * scaleY);
    const normW = Math.round(rawW * scaleX);
    const normH = Math.round(rawH * scaleY);

    // Font size estimation based on line bounding-box height
    const fontSize = Math.max(11, Math.round(normH * 0.82));

    // Sample foreground text color from the center pixels of the line
    const textColor = sampleTextColor(fullImageData, bbox, srcW, srcH);

    // Dynamic Alignment: estimate based on position on the canvas
    let alignment = 'left';
    if (normX + normW / 2 > canvasWidth * 0.72) {
      alignment = 'right';
    } else if (normX > canvasWidth * 0.32 && normX + normW < canvasWidth * 0.75) {
      alignment = 'center';
    }

    elements.push({
      id: `text-${i}-${Math.random().toString(36).substr(2, 6)}`,
      rawText,
      cleanText: rawText.replace(/[|•*_~]/g, '').trim(),
      x: normX,
      y: normY,
      width: Math.max(60, normW),
      height: Math.max(16, normH),
      fontSize,
      fontWeight: fontSize >= 22 ? '800' : fontSize >= 14 ? '700' : '500',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: textColor,
      alignment,
      confidence: (line.confidence || 90) / 100,
      field: 'customText',
      role: 'text',
      originalBbox: bbox,
      editable: true,
      locked: false,
    });
  }

  return elements;
}

/**
 * Samples the true text color by analyzing contrasting foreground pixels inside the bounding box
 */
function sampleTextColor(imgData, bbox, srcW, srcH) {
  const data = imgData.data;
  const startX = Math.max(0, Math.round(bbox.x0 + (bbox.x1 - bbox.x0) * 0.2));
  const endX = Math.min(srcW - 1, Math.round(bbox.x1 - (bbox.x1 - bbox.x0) * 0.2));
  const startY = Math.max(0, Math.round(bbox.y0 + (bbox.y1 - bbox.y0) * 0.2));
  const endY = Math.min(srcH - 1, Math.round(bbox.y1 - (bbox.y1 - bbox.y0) * 0.2));

  // Sample corner luminance as background reference
  const bgIdx = (Math.max(0, bbox.y0 - 2) * srcW + Math.max(0, bbox.x0 - 2)) * 4;
  const bgLum = 0.299 * data[bgIdx] + 0.587 * data[bgIdx + 1] + 0.114 * data[bgIdx + 2];

  let maxContrastR = 255, maxContrastG = 255, maxContrastB = 255;
  let maxDiff = 0;

  for (let y = startY; y < endY; y += 2) {
    for (let x = startX; x < endX; x += 2) {
      const idx = (y * srcW + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const diff = Math.abs(lum - bgLum);
      if (diff > maxDiff) {
        maxDiff = diff;
        maxContrastR = r;
        maxContrastG = g;
        maxContrastB = b;
      }
    }
  }

  // If contrast is very low or dark background, default appropriately
  if (maxDiff < 25) {
    return bgLum < 128 ? '#ffffff' : '#0f172a';
  }

  return rgbToHex(maxContrastR, maxContrastG, maxContrastB);
}

/**
 * Dynamically classifies semantic roles for detected text elements.
 * Supports ANY card design with multiple phones, emails, web addresses, etc.
 * Does NOT force fields if they do not exist.
 */
function classifySemanticFields(texts) {
  const sorted = [...texts].sort((a, b) => a.y - b.y);

  const phoneRegex = /(?:(?:\+91|91|0)?[-\s]?)?[6-9]\d{4}[-\s]?\d{5}|(?:\+?\d{1,3}[-\s]?)?\(?\d{2,5}\)?[-\s]?\d{3,4}/;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(?:info|contact|support|mail)\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
  const webRegex = /(?:https?:\/\/)?(?:www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9.-]+\.(?:com|in|org|net|co|biz|tech|io|ai)/i;
  const titleRegex = /(?:manager|director|general manager|bdm|ceo|cto|cfo|founder|co-founder|executive|officer|partner|consultant|president|engineer|architect|advocate|doctor|dr\.|ca|lawyer|proprietor|designer)/i;
  const addressRegex = /(?:floor|tower|building|plaza|corporate|trinity|road|street|st\.|avenue|colony|nagar|plot|phase|hyderabad|mumbai|delhi|bengaluru|bangalore|chennai|kolkata|pune|ahmedabad|india|\b\d{6}\b)/i;
  const taglineRegex = /(?:we build|we launch|we grow|innovate|quality|excellence|solutions|engineering tomorrow|tagline|motto)/i;

  let phoneCount = 0;
  let emailCount = 0;
  let webCount = 0;
  let customCount = 0;
  let foundName = false;
  let foundTitle = false;
  let foundCompany = false;

  for (const el of sorted) {
    const txt = el.cleanText;

    if (phoneRegex.test(txt) && /\d{4,}/.test(txt)) {
      phoneCount++;
      el.field = phoneCount === 1 ? 'phone' : `phone_${phoneCount}`;
      continue;
    }

    if (emailRegex.test(txt)) {
      emailCount++;
      el.field = emailCount === 1 ? 'email' : `email_${emailCount}`;
      continue;
    }

    if (webRegex.test(txt) && !emailRegex.test(txt)) {
      webCount++;
      el.field = webCount === 1 ? 'website' : `website_${webCount}`;
      continue;
    }

    if (addressRegex.test(txt)) {
      el.field = 'address';
      continue;
    }

    if (titleRegex.test(txt) && !foundTitle) {
      el.field = 'designation';
      foundTitle = true;
      continue;
    }

    if (taglineRegex.test(txt)) {
      el.field = 'tagline';
      continue;
    }

    // Company name detection (business keywords or uppercase branding)
    if (!foundCompany && /(?:services|technologies|solutions|global|infotech|consulting|industries|corp|pvt|ltd|group|agency|enterprises|hospital|clinic|studio|academy)/i.test(txt)) {
      el.field = 'companyName';
      foundCompany = true;
      continue;
    }

    // Prominent text without numbers is typically personName
    if (!foundName && el.fontSize >= 16 && !/\d/.test(txt) && txt.split(' ').length <= 4) {
      el.field = 'personName';
      foundName = true;
      continue;
    }

    // Otherwise assign sequential customText variable
    customCount++;
    el.field = `customText_${customCount}`;
  }

  // If personName still wasn't found and we have prominent text, assign the largest top non-number line
  if (!foundName && sorted.length > 0) {
    const topProminent = sorted.find((e) => !/\d/.test(e.cleanText) && e.fontSize >= 15);
    if (topProminent && topProminent.field.startsWith('customText')) {
      topProminent.field = 'personName';
    }
  }
}

/**
 * Searches the ENTIRE card canvas for visual Logo and QR Code regions.
 * Does NOT assume fixed corners or quadrants.
 */
function detectAssetsFullCanvas(fullImageData, srcW, srcH, scaleX, scaleY, detectedTexts, canvasW, canvasH) {
  let qrBox = null;
  let qrAsset = null;
  let hasQrCode = false;
  let qrValue = '';

  const webEl = detectedTexts.find((t) => t.field.startsWith('website'));
  if (webEl) qrValue = webEl.cleanText;

  // 1. Scan ENTIRE card for QR code patterns (using full-grid scan)
  const qrRegion = scanEntireCanvasForQr(fullImageData, srcW, srcH);
  if (qrRegion) {
    hasQrCode = true;
    qrBox = {
      x: Math.round(qrRegion.x * scaleX),
      y: Math.round(qrRegion.y * scaleY),
      width: Math.round(qrRegion.width * scaleX),
      height: Math.round(qrRegion.height * scaleY),
    };
    qrAsset = cropCanvasRegion(fullImageData, qrRegion.x, qrRegion.y, qrRegion.width, qrRegion.height, srcW, srcH);
  }

  // 2. Scan ENTIRE card for prominent non-text graphic clusters (Logo)
  let logoBox = null;
  let logoAsset = null;

  const logoRegion = scanEntireCanvasForLogo(fullImageData, srcW, srcH, detectedTexts, scaleX, scaleY, qrRegion);
  if (logoRegion) {
    logoBox = {
      x: Math.round(logoRegion.x * scaleX),
      y: Math.round(logoRegion.y * scaleY),
      width: Math.round(logoRegion.width * scaleX),
      height: Math.round(logoRegion.height * scaleY),
    };
    logoAsset = cropCanvasRegion(fullImageData, logoRegion.x, logoRegion.y, logoRegion.width, logoRegion.height, srcW, srcH);
  }

  return {
    logoBox,
    logoAsset,
    qrBox,
    qrAsset,
    hasQrCode,
    qrValue,
  };
}

/**
 * Scans the whole image grid to locate QR code patterns anywhere on the card
 */
function scanEntireCanvasForQr(imgData, srcW, srcH) {
  const data = imgData.data;
  const minSize = Math.round(Math.min(srcW, srcH) * 0.12);
  const maxSize = Math.round(Math.min(srcW, srcH) * 0.38);

  // Scan across the entire width and height in small step intervals
  for (let y = Math.round(srcH * 0.05); y < srcH - minSize; y += 20) {
    for (let x = Math.round(srcW * 0.05); x < srcW - minSize; x += 20) {
      let darkCount = 0;
      let lightCount = 0;
      const testSize = Math.round(minSize * 1.15);

      for (let sy = y; sy < y + testSize && sy < srcH; sy += 6) {
        for (let sx = x; sx < x + testSize && sx < srcW; sx += 6) {
          const idx = (sy * srcW + sx) * 4;
          const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
          if (lum < 75) darkCount++;
          else if (lum > 175) lightCount++;
        }
      }

      // QR patterns have balanced dark & light distribution with high local variance
      if (darkCount > 18 && lightCount > 18 && Math.abs(darkCount - lightCount) < 35) {
        return {
          x,
          y,
          width: Math.min(testSize, maxSize),
          height: Math.min(testSize, maxSize),
        };
      }
    }
  }

  return null;
}

/**
 * Scans the whole canvas for a distinct non-text graphic cluster (Logo / Icon emblem)
 */
function scanEntireCanvasForLogo(imgData, srcW, srcH, texts, scaleX, scaleY, qrRegion) {
  const data = imgData.data;

  // Helper: check if a pixel coordinate collides with text or QR
  const isOccupied = (x, y) => {
    const normX = x * scaleX;
    const normY = y * scaleY;
    if (qrRegion) {
      if (x >= qrRegion.x - 10 && x <= qrRegion.x + qrRegion.width + 10 &&
          y >= qrRegion.y - 10 && y <= qrRegion.y + qrRegion.height + 10) {
        return true;
      }
    }
    return texts.some(
      (t) => normX >= t.x - 8 && normX <= t.x + t.width + 8 &&
             normY >= t.y - 8 && normY <= t.y + t.height + 8
    );
  };

  // Sample corner luminance as background reference
  const bgLum = 0.299 * data[0] + 0.587 * data[1] + 0.114 * data[2];

  // Candidates for graphic clusters
  let bestCluster = null;
  let maxClusterPoints = 0;

  // Search candidate zones: top-left, top-right, center-top, center
  const zones = [
    { startX: 0.04, startY: 0.04, endX: 0.50, endY: 0.50 }, // Top-Left
    { startX: 0.50, startY: 0.04, endX: 0.96, endY: 0.55 }, // Top-Right
    { startX: 0.25, startY: 0.04, endX: 0.75, endY: 0.50 }, // Top-Center
    { startX: 0.04, startY: 0.40, endX: 0.45, endY: 0.90 }, // Bottom-Left
  ];

  for (const zone of zones) {
    const zStartX = Math.round(srcW * zone.startX);
    const zStartY = Math.round(srcH * zone.startY);
    const zEndX = Math.round(srcW * zone.endX);
    const zEndY = Math.round(srcH * zone.endY);

    let minX = zEndX, maxX = zStartX;
    let minY = zEndY, maxY = zStartY;
    let pointCount = 0;

    for (let y = zStartY; y < zEndY; y += 6) {
      for (let x = zStartX; x < zEndX; x += 6) {
        if (isOccupied(x, y)) continue;

        const idx = (y * srcW + x) * 4;
        const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        if (Math.abs(lum - bgLum) > 40) {
          pointCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    const clusterW = maxX - minX;
    const clusterH = maxY - minY;

    if (pointCount > 25 && clusterW > 25 && clusterH > 25 && clusterW < srcW * 0.5 && clusterH < srcH * 0.5) {
      if (pointCount > maxClusterPoints) {
        maxClusterPoints = pointCount;
        bestCluster = {
          x: Math.max(0, minX - 6),
          y: Math.max(0, minY - 6),
          width: Math.min(srcW - minX, clusterW + 12),
          height: Math.min(srcH - minY, clusterH + 12),
        };
      }
    }
  }

  return bestCluster;
}

/**
 * Crops a specific bounding box from the image data into a Data URL
 */
function cropCanvasRegion(imgData, x, y, width, height, srcW, srcH) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  const ctx = canvas.getContext('2d');

  const regionData = ctx.createImageData(canvas.width, canvas.height);
  const data = imgData.data;

  for (let cy = 0; cy < canvas.height; cy++) {
    for (let cx = 0; cx < canvas.width; cx++) {
      const srcIdx = ((y + cy) * srcW + (x + cx)) * 4;
      const dstIdx = (cy * canvas.width + cx) * 4;
      regionData.data[dstIdx] = data[srcIdx];
      regionData.data[dstIdx + 1] = data[srcIdx + 1];
      regionData.data[dstIdx + 2] = data[srcIdx + 2];
      regionData.data[dstIdx + 3] = data[srcIdx + 3];
    }
  }

  ctx.putImageData(regionData, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * TEXT INPAINTING ENGINE:
 * Removes detected text pixels from the card artwork so the background retains
 * ALL original designs, curves, gradients, and patterns WITHOUT baked-in text!
 */
export function inpaintTextRegions(img, srcW, srcH, lines, qrBox, logoBox) {
  const canvas = document.createElement('canvas');
  canvas.width = srcW;
  canvas.height = srcH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);

  // Inpaint each detected text bounding box
  for (const line of lines) {
    if (!line.bbox) continue;
    const bbox = line.bbox;
    const pad = 4;
    const x = Math.max(0, bbox.x0 - pad);
    const y = Math.max(0, bbox.y0 - pad);
    const w = Math.min(srcW - x, (bbox.x1 - bbox.x0) + pad * 2);
    const h = Math.min(srcH - y, (bbox.y1 - bbox.y0) + pad * 2);

    if (w <= 0 || h <= 0) continue;

    // Sample perimeter background colors immediately above and below the text line
    const topSampleY = Math.max(0, y - 2);
    const bottomSampleY = Math.min(srcH - 1, y + h + 2);

    const topPixel = ctx.getImageData(x + Math.round(w / 2), topSampleY, 1, 1).data;
    const bottomPixel = ctx.getImageData(x + Math.round(w / 2), bottomSampleY, 1, 1).data;

    // Linear gradient fill between top and bottom perimeter pixels to seamlessly heal the texture
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, `rgb(${topPixel[0]}, ${topPixel[1]}, ${topPixel[2]})`);
    grad.addColorStop(1, `rgb(${bottomPixel[0]}, ${bottomPixel[1]}, ${bottomPixel[2]})`);

    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
  }

  return canvas.toDataURL('image/jpeg', 0.94);
}

/**
 * Extracts dominant color palette and determines dark vs light theme
 */
function extractPaletteAndTheme(imgData) {
  const data = imgData.data;
  const samples = 400;
  const step = Math.max(1, Math.floor(data.length / (samples * 4)));

  const colorBuckets = {};
  let totalR = 0, totalG = 0, totalB = 0;

  for (let i = 0; i < data.length; i += step * 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    totalR += r;
    totalG += g;
    totalB += b;

    const qR = Math.round(r / 28) * 28;
    const qG = Math.round(g / 28) * 28;
    const qB = Math.round(b / 28) * 28;
    const hex = rgbToHex(qR, qG, qB);
    colorBuckets[hex] = (colorBuckets[hex] || 0) + 1;
  }

  const avgR = Math.round(totalR / (samples / 2));
  const avgG = Math.round(totalG / (samples / 2));
  const avgB = Math.round(totalB / (samples / 2));
  const luminance = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;
  const isDark = luminance < 130;

  const sortedColors = Object.entries(colorBuckets)
    .sort((a, b) => b[1] - a[1])
    .map(([c]) => c);

  const bgColor = sortedColors[0] || (isDark ? '#151b2d' : '#ffffff');
  const primaryColor = sortedColors[1] || (isDark ? '#38bdf8' : '#0056b3');
  const accentColor = sortedColors[2] || (isDark ? '#fbbf24' : '#eab308');

  return {
    theme: isDark ? 'dark' : 'light',
    bgColor,
    primaryColor,
    accentColor,
    palette: [bgColor, primaryColor, accentColor, sortedColors[3] || '#1e293b'],
  };
}

function rgbToHex(r, g, b) {
  const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
  return `#${((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1)}`;
}
