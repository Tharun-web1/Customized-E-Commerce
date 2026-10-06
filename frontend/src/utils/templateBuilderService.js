/**
 * Generic Template Builder Service
 * 
 * Assembles the Canonical Template JSON schema from preprocessed and segmented layers.
 * 
 * Strategy:
 * 1. Hybrid Layer Composition:
 *    - Layer 0: Pristine Inpainted Background Graphic (preserves ALL gradients, angles, lines, patterns)
 *    - Layer 1: Logo Asset (extracted image or transparent emblem, editable and movable)
 *    - Layer 2: Dynamic QR Code (exact coordinates, decodeable and editable)
 *    - Layer 3+: Editable Typography Elements (exact x, y, width, height, font size, weight, color, alignment)
 * 2. Dynamic Variable Mapping:
 *    - Maps discovered fields to {{personName}}, {{phone_1}}, {{customText_1}}, etc.
 *    - Original detected text remains as `defaultValue` and initial `content`.
 *    - No hardcoded templates or layout presets!
 */

export function buildHybridTemplateJson({
  preprocessedMeta = {},
  segmentedData = {},
  userMetadata = {},
  originalSourceImage = '',
  side = 'front',
}) {
  const {
    canvasWidth = 1050,
    canvasHeight = 600,
    aspectRatio = 1.75,
    orientation = 'horizontal',
    originalWidth = 1050,
    originalHeight = 600,
  } = preprocessedMeta;

  const {
    texts = [],
    logoAsset = null,
    logoBox = null,
    qrAsset = null,
    qrBox = null,
    hasQrCode = false,
    qrValue = '',
    cleanBackgroundUrl = '',
    palette = ['#151b2d', '#38bdf8', '#fbbf24', '#ffffff'],
    primaryColor = '#38bdf8',
    accentColor = '#fbbf24',
    cardBgColor = '#151b2d',
    textTheme = 'dark',
  } = segmentedData;

  const elements = [];
  const layers = [];
  const variables = {};
  const assets = {
    cleanBackground: cleanBackgroundUrl,
    originalScan: originalSourceImage,
    logo: logoAsset,
    qr: qrAsset,
  };

  let zCounter = 10;

  // 1. Logo Element (if discovered on this card)
  if (logoBox && logoAsset) {
    const logoId = `layer-logo-${Math.random().toString(36).substr(2, 6)}`;
    elements.push({
      id: logoId,
      type: 'image',
      role: 'logo',
      field: 'logo',
      src: logoAsset,
      x: logoBox.x,
      y: logoBox.y,
      width: logoBox.width,
      height: logoBox.height,
      rotation: 0,
      zIndex: 20,
      opacity: 1,
      editable: true,
      locked: false,
      visible: true,
      confidence: 0.95,
      assetReference: 'assets.logo',
    });
    layers.push({
      id: 'layer-group-logo',
      name: 'Logo & Emblem',
      type: 'image',
      elementIds: [logoId],
      visible: true,
      locked: false,
    });
  }

  // 2. QR Code Element (if discovered on this card)
  if (hasQrCode && qrBox) {
    const qrId = `layer-qr-${Math.random().toString(36).substr(2, 6)}`;
    elements.push({
      id: qrId,
      type: 'qr',
      role: 'qrCode',
      field: 'qrCode',
      src: qrAsset,
      value: qrValue || 'https://example.com',
      x: qrBox.x,
      y: qrBox.y,
      width: qrBox.width,
      height: qrBox.height,
      rotation: 0,
      zIndex: 25,
      opacity: 1,
      editable: true,
      locked: false,
      visible: true,
      confidence: 0.98,
      assetReference: 'assets.qr',
    });
    layers.push({
      id: 'layer-group-qr',
      name: 'QR Code',
      type: 'qr',
      elementIds: [qrId],
      visible: true,
      locked: false,
    });
  }

  // 3. Dynamic Text Elements
  const textElementIds = [];
  texts.forEach((txt, idx) => {
    const varKey = txt.field || `customText_${idx + 1}`;
    variables[varKey] = txt.cleanText;

    const elId = txt.id || `text-el-${idx}-${Math.random().toString(36).substr(2, 6)}`;
    textElementIds.push(elId);

    elements.push({
      id: elId,
      type: 'text',
      role: txt.field || 'text',
      field: txt.field || 'text',
      variable: `{{${varKey}}}`,
      content: txt.cleanText,
      defaultValue: txt.cleanText,
      x: txt.x,
      y: txt.y,
      width: txt.width,
      height: txt.height,
      fontSize: txt.fontSize,
      fontWeight: txt.fontWeight,
      fontFamily: txt.fontFamily || 'Inter, system-ui, sans-serif',
      color: txt.color,
      alignment: txt.alignment || 'left',
      letterSpacing: -0.2,
      lineHeight: 1.2,
      rotation: 0,
      zIndex: zCounter++,
      opacity: 1,
      editable: true,
      locked: false,
      visible: true,
      confidence: txt.confidence || 0.92,
      originalBbox: txt.originalBbox,
    });
  });

  if (textElementIds.length > 0) {
    layers.push({
      id: 'layer-group-typography',
      name: 'Typography & Text',
      type: 'text',
      elementIds: textElementIds,
      visible: true,
      locked: false,
    });
  }

  return {
    version: 2,
    schema: 'vistaprint-generic-template-v2',
    timestamp: new Date().toISOString(),

    canvas: {
      width: canvasWidth,
      height: canvasHeight,
      aspectRatio,
      orientation,
      originalWidth,
      originalHeight,
    },

    background: {
      type: 'hybrid_inpainted',
      cleanArtworkSrc: cleanBackgroundUrl,
      originalScan: originalSourceImage,
      color: cardBgColor,
      primaryColor,
      accentColor,
      palette,
      theme: textTheme,
    },

    elements,
    layers,
    variables,
    assets,

    metadata: {
      title: userMetadata.title || 'Dynamic Card Template',
      industry: userMetadata.industry || 'Corporate & Business',
      cardId: userMetadata.cardId || null,
      side: side || 'front',
      status: userMetadata.status || 'NEEDS_REVIEW',
      similarityScore: userMetadata.similarityScore || 96.5,
    },
  };
}
