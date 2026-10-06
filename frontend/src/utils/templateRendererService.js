/**
 * Template Renderer Service
 * 
 * Takes a Canonical Template JSON and renders it off-screen onto an HTML5 Canvas.
 * Generates an exact pixel representation of the generated template for:
 * 1. Visual comparison against original card
 * 2. Visual difference heatmaps
 * 3. High-resolution export previews
 */

import QRCode from 'qrcode';
import { loadImage } from './cardPreprocessingEngine';

export async function renderTemplateToDataUrl(templateJson) {
  if (!templateJson || !templateJson.canvas) return null;

  const width = templateJson.canvas.width || 1050;
  const height = templateJson.canvas.height || 600;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. Render Background
  const bg = templateJson.background || {};
  if (bg.cleanArtworkSrc) {
    try {
      const bgImg = await loadImage(bg.cleanArtworkSrc);
      ctx.drawImage(bgImg, 0, 0, width, height);
    } catch (e) {
      ctx.fillStyle = bg.color || '#151b2d';
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    ctx.fillStyle = bg.color || '#151b2d';
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Render Elements sorted by zIndex
  const elements = [...(templateJson.elements || [])].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  for (const el of elements) {
    if (el.visible === false) continue;

    if (el.type === 'image' && el.src) {
      try {
        const img = await loadImage(el.src);
        ctx.drawImage(img, el.x, el.y, el.width, el.height);
      } catch (err) {
        console.warn('Failed to render template image element:', err);
      }
    } else if (el.type === 'qr') {
      try {
        let cleanVal = el.value || 'https://example.com';
        if (!cleanVal.startsWith('http://') && !cleanVal.startsWith('https://')) {
          cleanVal = 'https://' + cleanVal;
        }
        const qrDataUrl = await QRCode.toDataURL(cleanVal, {
          width: el.width * 2,
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' },
        });
        const qrImg = await loadImage(qrDataUrl);
        ctx.drawImage(qrImg, el.x, el.y, el.width, el.height);
      } catch (err) {
        console.warn('Failed to render template QR element:', err);
      }
    } else if (el.type === 'text') {
      const text = el.content || el.defaultValue || '';
      if (!text) continue;

      ctx.save();
      const fontSize = el.fontSize || 16;
      const fontWeight = el.fontWeight || '600';
      const fontFamily = el.fontFamily || 'Inter, system-ui, sans-serif';
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = el.color || '#ffffff';

      let drawX = el.x;
      if (el.alignment === 'center') {
        ctx.textAlign = 'center';
        drawX = el.x + el.width / 2;
      } else if (el.alignment === 'right') {
        ctx.textAlign = 'right';
        drawX = el.x + el.width;
      } else {
        ctx.textAlign = 'left';
      }

      ctx.textBaseline = 'top';
      ctx.fillText(text, drawX, el.y);
      ctx.restore();
    }
  }

  return canvas.toDataURL('image/jpeg', 0.94);
}
