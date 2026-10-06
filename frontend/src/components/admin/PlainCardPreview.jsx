import React from 'react';
import { Phone, Mail, Globe, MapPin, QrCode } from 'lucide-react';

/**
 * PlainCardPreview
 * Renders the exact-positioned plain card template with:
 * - Extracted background color & split panels
 * - Extracted graphic lines and accents
 * - Exact-positioned SVG icons (Phone, Mail, Globe, Pin)
 * - Pure generic placeholder text (Full Name, Job Title, etc.)
 * - Optional Blueprint overlay showing role labels and bounding boxes
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

  const { canvas, background = {}, graphics = [], elements = [] } = templateJson;
  const cW = canvas.width || 1050;
  const cH = canvas.height || 600;
  const isVertical = canvas.orientation === 'vertical';

  const renderIcon = (iconName, color) => {
    switch (iconName) {
      case 'phone':
        return <Phone size={13} color={color || '#60a5fa'} style={{ flexShrink: 0 }} />;
      case 'mail':
        return <Mail size={13} color={color || '#60a5fa'} style={{ flexShrink: 0 }} />;
      case 'globe':
        return <Globe size={13} color={color || '#60a5fa'} style={{ flexShrink: 0 }} />;
      case 'mapPin':
        return <MapPin size={13} color={color || '#60a5fa'} style={{ flexShrink: 0 }} />;
      default:
        return null;
    }
  };

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
        border: '1px solid #e2e8f0',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* 1. Split Panel Graphic Layer */}
      {graphics.map((g) => {
        if (g.type === 'panel') {
          const leftPercent = (g.x / cW) * 100;
          const widthPercent = (g.width / cW) * 100;
          return (
            <div
              key={g.id}
              style={{
                position: 'absolute',
                left: `${leftPercent}%`,
                top: 0,
                width: `${widthPercent}%`,
                height: '100%',
                background: g.fill,
                zIndex: g.zIndex || 2,
              }}
            />
          );
        }

        if (g.type === 'line') {
          const leftPercent = (g.x / cW) * 100;
          const topPercent = (g.y / cH) * 100;
          const widthPercent = (g.width / cW) * 100;
          return (
            <div
              key={g.id}
              style={{
                position: 'absolute',
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                width: `${widthPercent}%`,
                height: Math.max(2, g.height),
                background: g.fill,
                borderRadius: 2,
                zIndex: g.zIndex || 4,
              }}
            />
          );
        }

        return null;
      })}

      {/* 2. Elements Layer */}
      {elements.map((el) => {
        const leftPercent = (el.x / cW) * 100;
        const topPercent = (el.y / cH) * 100;

        // Blueprint badge header
        const blueprintTag = showBlueprint ? (
          <div
            style={{
              position: 'absolute',
              top: -16,
              left: 0,
              fontSize: '9px',
              fontWeight: 800,
              color: '#0284c7',
              background: '#e0f2fe',
              padding: '1px 5px',
              borderRadius: 3,
              whiteSpace: 'nowrap',
              border: '1px solid #7dd3fc',
              pointerEvents: 'none',
              zIndex: 50,
            }}
          >
            {el.role ? `[${el.role.toUpperCase()}]` : '[FIELD]'}
          </div>
        ) : null;

        // Bounding box border if blueprint mode active
        const blueprintOutlineStyle = showBlueprint ? {
          outline: '1.5px dashed #38bdf8',
          outlineOffset: '2px',
          background: 'rgba(56, 189, 248, 0.05)',
        } : {};

        // Logo Element
        if (el.type === 'logo_placeholder') {
          return (
            <div
              key={el.id}
              style={{
                position: 'absolute',
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                width: `${(el.width / cW) * 100}%`,
                aspectRatio: '1/1',
                borderRadius: '50%',
                background: el.badgeBg || 'rgba(0, 112, 186, 0.1)',
                border: `2px solid ${el.accentColor || '#0070ba'}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: el.zIndex || 20,
                ...blueprintOutlineStyle,
              }}
            >
              {blueprintTag}
              <div style={{ fontSize: '12px', fontWeight: 900, color: el.accentColor || '#0070ba' }}>
                LOGO
              </div>
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
                width: `${(el.width / cW) * 100}%`,
                aspectRatio: '1/1',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                zIndex: el.zIndex || 22,
                ...blueprintOutlineStyle,
              }}
            >
              {blueprintTag}
              <QrCode size={28} color="#0f172a" />
              <span style={{ fontSize: '7px', fontWeight: 700, color: '#64748b', marginTop: 2 }}>SCAN ME</span>
            </div>
          );
        }

        // Text Element with SVG Icon if present
        return (
          <div
            key={el.id}
            style={{
              position: 'absolute',
              left: `${leftPercent}%`,
              top: `${topPercent}%`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: `calc(${el.fontSize || 14}px * 0.44 * ${scale})`,
              fontWeight: el.fontWeight || 500,
              color: el.color || '#0f172a',
              whiteSpace: 'nowrap',
              zIndex: el.zIndex || 10,
              lineHeight: 1.2,
              ...blueprintOutlineStyle,
            }}
          >
            {blueprintTag}
            {el.icon && (
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: background.badgeBg || 'rgba(0, 112, 186, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {renderIcon(el.icon, background.accentColor)}
              </div>
            )}
            <span>{el.content}</span>
          </div>
        );
      })}
    </div>
  );
}
