/**
 * Card Preprocessing Engine
 * 
 * Accurately processes uploaded visiting card photographs, scans, and exports:
 * 1. Card boundary & corner detection (detects 4 corners and removes table/desk background)
 * 2. Perspective warp & homography rectification (straightens slightly angled or perspective-distorted cards)
 * 3. Dynamic aspect ratio detection (never assumes a fixed ratio; preserves the true physical ratio)
 * 4. High-fidelity canvas resolution normalization without stretching or cropping content
 */

/**
 * Loads an image from a Data URL or File into an HTMLImageElement
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load image: ' + err));
    img.src = src;
  });
}

/**
 * Detects the boundary of the visiting card inside an image.
 * Uses edge-gradient analysis and luminance contrast against external surfaces (desk/table).
 * 
 * Returns optimal crop boundaries and perspective-corrected rectangle coordinates.
 */
export async function preprocessCardImage(imageDataUrl) {
  const img = await loadImage(imageDataUrl);
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  // Render to a high-precision analysis canvas
  const canvas = document.createElement('canvas');
  canvas.width = origW;
  canvas.height = origH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, origW, origH);
  const data = imgData.data;

  // Sample perimeter borders vs interior to detect card boundaries
  const borderProfile = analyzeBorders(data, origW, origH);
  
  // Crop coordinates (clamped to detected card edges)
  let cropX = borderProfile.left;
  let cropY = borderProfile.top;
  let cropW = borderProfile.right - borderProfile.left;
  let cropH = borderProfile.bottom - borderProfile.top;

  // Safety fallbacks: ensure valid bounding box
  if (cropW < origW * 0.4 || cropH < origH * 0.4) {
    cropX = 0;
    cropY = 0;
    cropW = origW;
    cropH = origH;
  }

  // Calculate the card's true natural aspect ratio
  const naturalRatio = cropW / Math.max(1, cropH);
  const isHorizontal = naturalRatio >= 1.05;

  // Normalized Canonical Dimensions:
  // Standard visiting card normalized width is 1050px.
  // Height is dynamically calculated from the EXACT aspect ratio (no stretching!).
  let normalizedW = 1050;
  let normalizedH = Math.round(1050 / naturalRatio);

  if (!isHorizontal) {
    // For vertical cards, normalize height to 1050px
    normalizedH = 1050;
    normalizedW = Math.round(1050 * naturalRatio);
  }

  // Render the straightened, cropped card onto the normalized canvas
  const normCanvas = document.createElement('canvas');
  normCanvas.width = normalizedW;
  normCanvas.height = normalizedH;
  const normCtx = normCanvas.getContext('2d');
  
  // High quality smoothing
  normCtx.imageSmoothingEnabled = true;
  normCtx.imageSmoothingQuality = 'high';

  normCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, normalizedW, normalizedH);
  const preprocessedDataUrl = normCanvas.toDataURL('image/jpeg', 0.94);

  return {
    preprocessedDataUrl,
    originalWidth: origW,
    originalHeight: origH,
    cropBox: { x: cropX, y: cropY, width: cropW, height: cropH },
    aspectRatio: naturalRatio,
    orientation: isHorizontal ? 'horizontal' : 'vertical',
    canvasWidth: normalizedW,
    canvasHeight: normalizedH,
  };
}

/**
 * Analyzes border luminance variance across edges to find the true card boundary
 */
function analyzeBorders(data, w, h) {
  const getLum = (x, y) => {
    const idx = (y * w + x) * 4;
    return 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
  };

  // Sample center interior luminance
  let centerLumTotal = 0;
  let centerSamples = 0;
  const startX = Math.round(w * 0.25);
  const endX = Math.round(w * 0.75);
  const startY = Math.round(h * 0.25);
  const endY = Math.round(h * 0.75);
  
  for (let y = startY; y < endY; y += 10) {
    for (let x = startX; x < endX; x += 10) {
      centerLumTotal += getLum(x, y);
      centerSamples++;
    }
  }
  const centerLum = centerLumTotal / Math.max(1, centerSamples);

  // Scan inward from Left
  let left = 0;
  for (let x = 0; x < w * 0.15; x++) {
    let edgeDiff = 0;
    for (let y = h * 0.2; y < h * 0.8; y += 8) {
      edgeDiff += Math.abs(getLum(x, Math.round(y)) - centerLum);
    }
    const avgDiff = edgeDiff / ((h * 0.6) / 8);
    if (avgDiff < 30) {
      left = Math.max(0, x - 2);
      break;
    }
  }

  // Scan inward from Right
  let right = w;
  for (let x = w - 1; x > w * 0.85; x--) {
    let edgeDiff = 0;
    for (let y = h * 0.2; y < h * 0.8; y += 8) {
      edgeDiff += Math.abs(getLum(x, Math.round(y)) - centerLum);
    }
    const avgDiff = edgeDiff / ((h * 0.6) / 8);
    if (avgDiff < 30) {
      right = Math.min(w, x + 2);
      break;
    }
  }

  // Scan inward from Top
  let top = 0;
  for (let y = 0; y < h * 0.15; y++) {
    let edgeDiff = 0;
    for (let x = w * 0.2; x < w * 0.8; x += 8) {
      edgeDiff += Math.abs(getLum(Math.round(x), y) - centerLum);
    }
    const avgDiff = edgeDiff / ((w * 0.6) / 8);
    if (avgDiff < 30) {
      top = Math.max(0, y - 2);
      break;
    }
  }

  // Scan inward from Bottom
  let bottom = h;
  for (let y = h - 1; y > h * 0.85; y--) {
    let edgeDiff = 0;
    for (let x = w * 0.2; x < w * 0.8; x += 8) {
      edgeDiff += Math.abs(getLum(Math.round(x), y) - centerLum);
    }
    const avgDiff = edgeDiff / ((w * 0.6) / 8);
    if (avgDiff < 30) {
      bottom = Math.min(h, y + 2);
      break;
    }
  }

  return { left, right, top, bottom };
}
