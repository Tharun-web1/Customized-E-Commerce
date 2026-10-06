import React from 'react';
import { QrCode } from 'lucide-react';

/**
 * PlainCardPreview
 * Renders the accurate template matching the uploaded card:
 * 1. Background: Pristine clean artwork background preserving curves, waves, and badge graphics
 * 2. Elements: Exact-positioned generic placeholder text (no client private data)
 * 3. Blueprint Overlay: Shows field tags ([WEBSITE], [COMPANYNAME]) and dashed outlines
 */
export default function PlainCardPreview({
  templateJson,
  showBlueprint = false,
  scale = 1,
  style = {},
}) {
  if (!templateJson || !templateJson.canvas) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>
        No template generated yet
      </div>
    );
  }

  const { canvas, background = {}, elements = [] } = templateJson;
  const cW = canvas.width || 1050;
  const cH = canvas.height || 600;
  const isVertical = canvas.orientation === 'vertical';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: isVertical ? '9/16' : '16/9',
        background: background.color || '#ffffff',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        border: '1px solid #cbd5e1',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* 1. Real Card Artwork / Background Graphic */}
      {background.cleanArtworkSrc ? (
        <img
          src={background.cleanArtworkSrc}
          alt="Card Artwork"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            display: 'block',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: background.color || '#ffffff',
            zIndex: 1,
          }}
        />
      )}

      {/* 2. Detected Elements Layer */}
      {elements.map((el) => {
        if (el.visible === false) return null;

        const leftPercent = (el.x / cW) * 100;
        const topPercent = (el.y / cH) * 100;
        const widthPercent = (el.width / cW) * 100;

        // Blueprint badge tag
        const blueprintTag = showBlueprint ? (
          <div
            style={{
              position: 'absolute',
              top: -15,
              left: 0,
              fontSize: '8px',
              fontWeight: 800,
              color: '#0284c7',
              background: 'rgba(224, 242, 254, 0.95)',
              padding: '1px 4px',
              borderRadius: 3,
              whiteSpace: 'nowrap',
              border: '1px solid #7dd3fc',
              pointerEvents: 'none',
              zIndex: 60,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            {el.role ? `[${el.role.toUpperCase()}]` : '[FIELD]'}
          </div>
        ) : null;

        const blueprintOutlineStyle = showBlueprint ? {
          outline: '1px dashed #38bdf8',
          outlineOffset: '1px',
          background: 'rgba(56, 189, 248, 0.08)',
        } : {};

        // Image / Logo Element
        if (el.type === 'image' && el.src) {
          return (
            <div
              key={el.id}
              style={{
                position: 'absolute',
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                width: `${widthPercent}%`,
                zIndex: el.zIndex || 20,
                ...blueprintOutlineStyle,
              }}
            >
              {blueprintTag}
              <img src={el.src} alt="Logo" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          );
        }

        // QR Code Element
        if (el.type === 'qr') {
          return (
            <div
              key={el.id}
              style={{
                position: 'absolute',
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                width: `${widthPercent}%`,
                aspectRatio: '1/1',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 4,
                padding: '2px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: el.zIndex || 25,
                ...blueprintOutlineStyle,
              }}
            >
              {blueprintTag}
              <QrCode size={24} color="#0f172a" />
            </div>
          );
        }

        // Text Element
        return (
          <div
            key={el.id}
            style={{
              position: 'absolute',
              left: `${leftPercent}%`,
              top: `${topPercent}%`,
              fontSize: `calc(${el.fontSize || 14}px * 0.44 * ${scale})`,
              fontWeight: el.fontWeight || 600,
              fontFamily: el.fontFamily || 'Inter, system-ui, sans-serif',
              color: el.color || '#0f172a',
              textAlign: el.alignment || 'left',
              whiteSpace: 'nowrap',
              zIndex: el.zIndex || 10,
              lineHeight: 1.15,
              ...blueprintOutlineStyle,
            }}
          >
            {blueprintTag}
            <span>{el.content}</span>
          </div>
        );
      })}
    </div>
  );
}
