import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import '../css/TemplateCardMockup.css';

function QrCodeBadge({ url = 'https://example.com', size = 40 }) {
  const [dataUrl, setDataUrl] = useState('');
  useEffect(() => {
    let clean = (url || '').trim();
    if (!clean) clean = 'https://example.com';
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    QRCode.toDataURL(clean, { width: size * 2, margin: 1, color: { dark: '#000000', light: '#ffffff' } })
      .then(setDataUrl)
      .catch(() => {});
  }, [url, size]);

  if (!dataUrl) {
    return (
      <div
        style={{
          width: size,
          height: size,
          background: '#ffffff',
          borderRadius: 3,
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        }}
      />
    );
  }
  return (
    <div
      style={{
        padding: 2,
        background: '#ffffff',
        borderRadius: 3,
        boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
        display: 'inline-block',
      }}
    >
      <img src={dataUrl} alt="QR Code" style={{ width: size, height: size, display: 'block' }} />
    </div>
  );
}

export default function TemplateCardMockup({ template, onSelect }) {
  // Parse color swatches from template.color_palette
  const paletteString = template.color_palette || '#0056b3,#1e293b,#047857,#dc2626';
  const swatches = paletteString.split(',').map((s) => s.trim()).filter(Boolean);

  const [activeColor, setActiveColor] = useState(() => {
    if (template.primary_color) return template.primary_color;
    return swatches[0] || '#0056b3';
  });

  const layout = template.layout_type || template.preview_style || 'classic_photo';

  // Helper to determine background/foreground for split swatches like "#0a0a0a:#d4af37"
  const getSwatchStyle = (swatch) => {
    if (swatch.includes(':')) {
      const [c1, c2] = swatch.split(':');
      return {
        background: `linear-gradient(135deg, ${c1} 50%, ${c2} 50%)`,
      };
    }
    return {
      background: swatch,
    };
  };

  const getPrimaryColor = () => {
    if (activeColor.includes(':')) {
      return activeColor.split(':')[1] || '#d4af37';
    }
    return activeColor;
  };

  const getBgColor = () => {
    if (activeColor.includes(':')) {
      return activeColor.split(':')[0] || '#08080a';
    }
    return null;
  };

  const currentPrimary = getPrimaryColor();
  const currentBg = getBgColor();

  const handleCardClick = () => {
    if (onSelect) {
      onSelect({
        ...template,
        activeColor: currentPrimary,
      });
    }
  };

  const handleSwatchClick = (e, swatch) => {
    e.stopPropagation();
    setActiveColor(swatch);
  };

  return (
    <div className="vp-template-container" onClick={handleCardClick}>
      {/* 1. VISITING CARD PHYSICAL CANVAS */}
      <div className="vp-card-canvas-wrap">
        {/* CASE -1: HYBRID RECONSTRUCTED TEMPLATE (CANONICAL V2) */}
        {template.text_positions?.templateJson?.background?.cleanArtworkSrc ? (
          <div
            className={`vp-card-canvas ${template.orientation === 'vertical' ? 'vertical' : ''}`}
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: template.text_positions.templateJson.background.color || '#151b2d',
              padding: 0,
            }}
          >
            <img
              src={template.text_positions.templateJson.background.cleanArtworkSrc}
              alt={template.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'fill',
                display: 'block',
              }}
            />
            {(template.text_positions.templateJson.elements || []).map((el) => {
              if (el.visible === false) return null;
              const cW = template.text_positions.templateJson.canvas?.width || 1050;
              const cH = template.text_positions.templateJson.canvas?.height || 600;
              const leftPct = (el.x / cW) * 100;
              const topPct = (el.y / cH) * 100;
              const widthPct = (el.width / cW) * 100;

              if (el.type === 'image' && el.src) {
                return (
                  <div
                    key={el.id}
                    style={{
                      position: 'absolute',
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      width: `${widthPct}%`,
                      zIndex: el.zIndex || 2,
                    }}
                  >
                    <img src={el.src} alt="Logo" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                );
              }

              if (el.type === 'qr') {
                return (
                  <div
                    key={el.id}
                    style={{
                      position: 'absolute',
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      width: `${widthPct}%`,
                      zIndex: el.zIndex || 2,
                    }}
                  >
                    <QrCodeBadge url={el.value || 'https://example.com'} size={32} />
                  </div>
                );
              }

              if (el.type === 'text') {
                const isHeading = el.field === 'personName' || el.field === 'companyName';
                return (
                  <div
                    key={el.id}
                    style={{
                      position: 'absolute',
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      width: `${widthPct}%`,
                      fontSize: `${Math.max(7, Math.round((el.fontSize / cH) * 160))}px`,
                      fontWeight: el.fontWeight || (isHeading ? '800' : '500'),
                      color: el.color || '#ffffff',
                      textAlign: el.alignment || 'left',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      zIndex: el.zIndex || 3,
                      lineHeight: 1.15,
                    }}
                  >
                    {el.content}
                  </div>
                );
              }
              return null;
            })}
          </div>
        ) : (layout === 'image_template' || (!['executive_swoosh', 'corporate_split_swoosh', 'classic_photo', 'luxury_black_gold', 'corporate_red_ribbon', 'modern_geometric', 'medical_care'].includes(layout) && template.background_image)) ? (
          <div
            className={`vp-card-canvas layout-image-template ${template.orientation === 'vertical' ? 'vertical' : ''}`}
            style={{
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8fafc',
              padding: 0,
            }}
          >
            <img
              src={template.background_image}
              alt={template.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            {/* Optional Text Overlay (Only rendered if admin explicitly enabled it) */}
            {template.text_positions?.showTextOverlay && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  boxSizing: 'border-box',
                  pointerEvents: 'none',
                  background: 'rgba(0,0,0,0.1)',
                }}
              >
                {/* Top Brand Block */}
                <div style={{ textAlign: 'left' }}>
                  {template.sample_company && (
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: currentPrimary,
                        lineHeight: 1.1,
                      }}
                    >
                      {template.sample_company}
                    </div>
                  )}
                  {template.sample_tagline && (
                    <div
                      style={{
                        fontSize: '0.45rem',
                        fontWeight: 500,
                        color: template.text_positions?.textTheme === 'light' ? '#e2e8f0' : '#475569',
                        marginTop: '2px',
                      }}
                    >
                      {template.sample_tagline}
                    </div>
                  )}
                </div>

                {/* Bottom Details Block */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    fontSize: '0.45rem',
                    color: template.text_positions?.textTheme === 'light' ? '#f8fafc' : '#1e293b',
                  }}
                >
                  <div>
                    {template.sample_name && (
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: '0.58rem',
                          color: template.text_positions?.textTheme === 'light' ? '#ffffff' : '#0f172a',
                        }}
                      >
                        {template.sample_name}
                      </div>
                    )}
                    {template.sample_job_title && (
                      <div style={{ opacity: 0.85, fontSize: '0.46rem' }}>
                        {template.sample_job_title}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right', opacity: 0.9, lineHeight: 1.25 }}>
                    {template.sample_phone && <div>{template.sample_phone}</div>}
                    {template.sample_email && <div>{template.sample_email}</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (template.text_positions?.templateJson?.background?.cleanArtworkSrc) ? (
          <div
            className={`vp-card-canvas layout-card-recreation ${template.orientation === 'vertical' ? 'vertical' : ''}`}
            style={{
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              height: '100%',
              background: template.text_positions?.templateJson?.background?.color || '#151b2d',
              boxSizing: 'border-box',
            }}
          >
            {/* Clean Background Image */}
            <img
              src={template.text_positions.templateJson.background.cleanArtworkSrc}
              alt="Card Background"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'fill',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />

            {/* Elements Layer with Normalized Scale */}
            {(template.text_positions.templateJson.elements || []).map((el) => {
              if (el.visible === false) return null;
              const cW = template.text_positions.templateJson.canvas?.width || 1050;
              const cH = template.text_positions.templateJson.canvas?.height || 600;
              const leftPercent = (el.x / cW) * 100;
              const topPercent = (el.y / cH) * 100;
              const widthPercent = (el.width / cW) * 100;

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
                    }}
                  >
                    <img src={el.src} alt="Logo" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                );
              }

              if (el.type === 'qr') {
                return (
                  <div
                    key={el.id}
                    style={{
                      position: 'absolute',
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      zIndex: el.zIndex || 25,
                    }}
                  >
                    <QrCodeBadge url={el.value || 'https://example.com'} size={28} />
                  </div>
                );
              }

              if (el.type === 'text') {
                return (
                  <div
                    key={el.id}
                    style={{
                      position: 'absolute',
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      fontSize: `calc(${el.fontSize || 14}px * 0.44)`,
                      fontWeight: el.fontWeight || 600,
                      color: el.color || '#ffffff',
                      textAlign: el.alignment || 'left',
                      whiteSpace: 'nowrap',
                      zIndex: el.zIndex || 10,
                      lineHeight: 1.15,
                    }}
                  >
                    {el.content || el.defaultValue}
                  </div>
                );
              }

              return null;
            })}
          </div>
        ) : (layout === 'card_recreation' || layout === 'exact_recreation' || layout === 'corporate_split_navy' || layout === 'corporate_navy_qr') ? (
          <div
            className={`vp-card-canvas layout-card-recreation ${template.orientation === 'vertical' ? 'vertical' : ''}`}
            style={{
              background: template.text_positions?.backgroundColor || '#151b2d',
              backgroundImage: 'linear-gradient(135deg, #101524 0%, #1c243c 55%, #131828 100%)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              padding: '16px 20px',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              color: '#ffffff',
            }}
          >
            {/* Top-Right Angled Modern Geometric Cut */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '45%',
                height: '42%',
                background: 'linear-gradient(225deg, rgba(37, 99, 235, 0.35) 0%, rgba(30, 58, 138, 0.1) 60%, transparent 100%)',
                clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
                pointerEvents: 'none',
              }}
            />
            {/* Bottom-Center Angled Cut */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: '25%',
                width: '35%',
                height: '22%',
                background: 'linear-gradient(45deg, rgba(30, 58, 138, 0.25) 0%, transparent 100%)',
                clipPath: 'polygon(0 100%, 30% 0, 100% 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* LEFT COLUMN: Name, Title, and 3 Contacts with Circular Badges */}
            <div
              style={{
                flex: 1.25,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                zIndex: 2,
                paddingRight: '10px',
              }}
            >
              {/* Name & Title Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      letterSpacing: '-0.2px',
                      lineHeight: 1.1,
                    }}
                  >
                    {template.sample_name || 'Cardholder Name'}
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 600,
                      color: '#94a3b8',
                      textTransform: 'capitalize',
                    }}
                  >
                    {template.sample_job_title || 'Designation'}
                  </span>
                </div>
                {/* Thin Underline Accent */}
                <div
                  style={{
                    width: 38,
                    height: 2,
                    background: template.text_positions?.accentColor || '#38bdf8',
                    marginTop: 4,
                    borderRadius: 1,
                  }}
                />
              </div>

              {/* 3 Contact Rows with Circular Blue Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.47rem', color: '#e2e8f0' }}>
                {/* Phones */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: '#1e3a8a',
                      color: '#60a5fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '7px',
                      flexShrink: 0,
                    }}
                  >
                    📞
                  </div>
                  <div style={{ fontWeight: 600, lineHeight: 1.2, color: '#f8fafc' }}>
                    {(template.sample_phone || '+1 555-0199')
                      .split(',')
                      .map((p, idx) => (
                        <div key={idx}>{p.trim()}</div>
                      ))}
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: '#1e3a8a',
                      color: '#60a5fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '7px',
                      flexShrink: 0,
                    }}
                  >
                    ✉️
                  </div>
                  <span style={{ color: '#e2e8f0' }}>{template.sample_email || 'contact@domain.com'}</span>
                </div>

                {/* Address */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: '#1e3a8a',
                      color: '#60a5fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '7px',
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    📍
                  </div>
                  <div style={{ lineHeight: 1.25, color: '#cbd5e1', fontSize: '0.44rem' }}>
                    {(template.text_positions?.sampleAddress || '123 Business Avenue, Suite 100')
                      .split(',')
                      .map((part, idx) => (
                        <div key={idx}>{part.trim()}</div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Brand Emblem, Company Name, QR Code, Website */}
            <div
              style={{
                flex: 0.95,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 2,
              }}
            >
              {/* Brand Logo & Name */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Globe + Golden Monogram Emblem */}
                <div
                  style={{
                    position: 'relative',
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #2563eb 0%, #1e3a8a 70%, #0f172a 100%)',
                    boxShadow: '0 0 0 1.5px #f59e0b, 0 3px 8px rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <svg
                    viewBox="0 0 36 36"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.45 }}
                  >
                    <ellipse cx="18" cy="18" rx="8" ry="16" fill="none" stroke="#93c5fd" strokeWidth="0.8" />
                    <line x1="2" y1="18" x2="34" y2="18" stroke="#93c5fd" strokeWidth="0.8" />
                    <line x1="5" y1="10" x2="31" y2="10" stroke="#93c5fd" strokeWidth="0.6" />
                    <line x1="5" y1="26" x2="31" y2="26" stroke="#93c5fd" strokeWidth="0.6" />
                  </svg>
                  <span
                    style={{
                      position: 'relative',
                      fontSize: '0.78rem',
                      fontWeight: 900,
                      fontFamily: 'serif',
                      color: '#fbbf24',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 6px rgba(251,191,36,0.6)',
                      letterSpacing: '-0.5px',
                      zIndex: 2,
                    }}
                  >
                    {template.text_positions?.logoInitials || 'BC'}
                  </span>
                </div>

                {/* Company Name */}
                <div
                  style={{
                    marginTop: 5,
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    letterSpacing: '1.2px',
                    color: '#ffffff',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                  }}
                >
                  {template.sample_company || 'COMPANY NAME'}
                </div>
              </div>

              {/* QR Code */}
              <div style={{ margin: '3px 0' }}>
                <QrCodeBadge
                  url={template.text_positions?.sampleWebsite || template.sample_email || 'https://example.com'}
                  size={42}
                />
              </div>

              {/* Website Footer with globe icon */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.45rem',
                  color: '#93c5fd',
                  fontWeight: 600,
                }}
              >
                <span>🌐</span>
                <span>{template.text_positions?.sampleWebsite || template.sample_web || 'www.example.com'}</span>
              </div>
            </div>
          </div>
        ) : (layout === 'executive_swoosh' || layout === 'corporate_split_swoosh') ? (
          <div
            className={`vp-card-canvas layout-executive-swoosh ${template.orientation === 'vertical' ? 'vertical' : ''}`}
            style={{
              background: '#ffffff',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Left Column: Name, Designation & 4 Contacts */}
            <div className="l7-left-col">
              <div>
                <div className="l7-person-name" style={{ color: currentPrimary || '#1e1b4b' }}>
                  {template.sample_name || 'Full Name'}
                </div>
                <div className="l7-person-title">
                  {template.sample_job_title || 'Designation'}
                </div>
                {/* Dual Underline: Accent Gold + Primary Blue */}
                <div className="l7-dual-underline">
                  <div style={{ width: '35%', background: template.text_positions?.accentColor || '#eab308' }} />
                  <div style={{ width: '65%', background: currentPrimary || '#004b93' }} />
                </div>
              </div>

              {/* 4 Contact Details with Circular Icons */}
              <div className="l7-contact-list">
                <div className="l7-contact-row">
                  <div className="l7-contact-icon" style={{ background: template.text_positions?.swooshColor || '#004b93' }}>
                    <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z" />
                    </svg>
                  </div>
                  <span style={{ fontWeight: 600 }}>{template.sample_phone || '+91 98765 43210'}</span>
                </div>

                <div className="l7-contact-row">
                  <div className="l7-contact-icon" style={{ background: template.text_positions?.swooshColor || '#004b93' }}>
                    <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                    </svg>
                  </div>
                  <span>{template.text_positions?.sampleWebsite || template.sample_web || 'www.example.com'}</span>
                </div>

                <div className="l7-contact-row">
                  <div className="l7-contact-icon" style={{ background: template.text_positions?.swooshColor || '#004b93' }}>
                    <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                  <span>{template.sample_email || 'info@example.com'}</span>
                </div>

                <div className="l7-contact-row">
                  <div className="l7-contact-icon" style={{ background: template.text_positions?.swooshColor || '#004b93' }}>
                    <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                    </svg>
                  </div>
                  <span>{template.text_positions?.sampleAddress || template.sample_address || 'City, Country'}</span>
                </div>
              </div>
            </div>

            {/* Vertical Golden Divider Line */}
            <div
              className="l7-center-divider"
              style={{ background: template.text_positions?.accentColor || '#eab308' }}
            />

            {/* Right Column: Logo, Tagline Bullets, Curved Swoosh */}
            <div className="l7-right-col">
              {/* Top-Right: Brand Logo Area */}
              <div className="l7-logo-area">
                {template.text_positions?.logoImage ? (
                  <img
                    src={template.text_positions.logoImage}
                    alt="Logo"
                    style={{ maxHeight: 26, maxWidth: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.62rem', fontWeight: 900, color: template.text_positions?.swooshColor || '#004b93', letterSpacing: '0.3px', lineHeight: 1.1 }}>
                      {template.sample_company || 'Company Name'}
                    </div>
                    {template.sample_tagline && (
                      <div style={{ fontSize: '0.3rem', fontWeight: 700, color: '#334155', letterSpacing: '0.5px' }}>
                        {template.sample_tagline}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Middle-Right: 3 Bullet Points / Taglines */}
              <div className="l7-bullets-area">
                <div className="l7-bullet-item">
                  <span style={{ color: template.text_positions?.accentColor || '#eab308', fontSize: '6px' }}>▶</span>
                  <span>{template.text_positions?.bullet1 || 'We Build'}</span>
                </div>
                <div className="l7-bullet-item">
                  <span style={{ color: template.text_positions?.accentColor || '#eab308', fontSize: '6px' }}>▶</span>
                  <span>{template.text_positions?.bullet2 || 'We Launch'}</span>
                </div>
                <div className="l7-bullet-item">
                  <span style={{ color: template.text_positions?.accentColor || '#eab308', fontSize: '6px' }}>▶</span>
                  <span>{template.text_positions?.bullet3 || 'We Grow'}</span>
                </div>
              </div>
            </div>

            {/* Bottom-Right Curved Graphic Swoosh Wave (SVG) */}
            <svg
              className="l7-swoosh-svg"
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '45%',
                height: '42%',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              {/* Yellow/Gold Swoosh Layer */}
              <path
                d="M 0 100 C 60 85, 130 65, 200 10 L 200 100 Z"
                fill={template.text_positions?.accentColor || '#eab308'}
              />
              {/* Deep Corporate Navy Blue Swoosh Layer */}
              <path
                d="M 30 100 C 80 88, 145 70, 200 25 L 200 100 Z"
                fill={template.text_positions?.swooshColor || '#004b93'}
              />
              {/* Accent shadow highlight */}
              <path
                d="M 65 100 C 105 92, 160 80, 200 45 L 200 100 Z"
                fill="#002b66"
                opacity="0.8"
              />
            </svg>
          </div>
        ) : layout === 'luxury_black_gold' ? (
          /* LAYOUT 2: LUXURY BLACK & GOLD FILIGREE */
          <div
            className="vp-card-canvas layout-luxury-black-gold"
            style={{
              background: currentBg || '#08080a',
              color: currentPrimary || '#d4af37',
            }}
          >
            <div className="l2-top-person">
              <div className="l2-person-name">{template.sample_name || 'FULL NAME'}</div>
              <div className="l2-person-title">{template.sample_job_title || 'Job Title'}</div>
            </div>

            {/* Elegant Filigree Flourish Divider */}
            <div className="l2-flourish-wrap">
              <div className="l2-flourish-line" style={{ background: `linear-gradient(90deg, transparent, ${currentPrimary}, transparent)` }} />
              <div className="l2-flourish-icon">
                <svg width="28" height="12" viewBox="0 0 40 16" fill="currentColor">
                  <path d="M20 2C16 2 13 6 10 6C6 6 4 4 2 4C0 4 0 6 2 7C5 8 8 7 11 8C14 9 17 14 20 14C23 14 26 9 29 8C32 7 35 8 38 7C40 6 40 4 38 4C36 4 34 6 30 6C27 6 24 2 20 2Z" opacity="0.9" />
                  <circle cx="20" cy="8" r="2" fill="currentColor" />
                </svg>
              </div>
              <div className="l2-flourish-line" style={{ background: `linear-gradient(90deg, transparent, ${currentPrimary}, transparent)` }} />
            </div>

            <div className="l2-company-name">
              {template.sample_company || 'COMPANY NAME'}
            </div>

            <div className="l2-bottom-info">
              <div>{template.sample_phone || '+91 98765 43210'}</div>
              <div>Address Line 1 &nbsp;|&nbsp; {template.sample_email || 'contact@brand.in'}</div>
              <div>Address Line 2 &nbsp;|&nbsp; www.brand.in</div>
            </div>
          </div>
        ) : layout === 'corporate_red_ribbon' ? (
          /* LAYOUT 3: CORPORATE DYNAMIC RED RIBBON */
          <div className="vp-card-canvas layout-corporate-red-ribbon">
            <div className="l3-left-strip" />

            <div className="l3-top-section">
              <div className="l3-person-name" style={{ color: currentPrimary }}>
                {template.sample_name || 'Full Name'}
              </div>
              <div className="l3-person-title">{template.sample_job_title || 'Job Title'}</div>
              <div className="l3-person-email">{template.sample_email || 'email@company.com'}</div>
            </div>

            {/* Dynamic Angled Ribbon */}
            <div className="l3-ribbon-bar" style={{ background: currentPrimary }}>
              <div className="l3-company-name">
                {template.sample_company || 'Company Name'}
              </div>
              <div className="l3-company-msg">
                {template.sample_tagline || 'Company Message'}
              </div>
            </div>

            <div className="l3-bottom-section">
              <div>
                <div>Address Line 1</div>
                <div>Address Line 2</div>
                <div>City, Country</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>{template.sample_phone || 'Phone / Other'}</div>
                <div>Fax / Other</div>
                <div className="l3-web-link" style={{ color: currentPrimary }}>
                  www.company.com
                </div>
              </div>
            </div>
          </div>
        ) : layout === 'modern_geometric' ? (
          /* LAYOUT 4: ABSTRACT GEOMETRIC PRISMS */
          <div className="vp-card-canvas layout-modern-geometric">
            <div className="l4-geometric-shapes">
              <div
                className="l4-poly-1"
                style={{
                  background: `linear-gradient(135deg, ${currentPrimary} 0%, #1e293b 100%)`,
                }}
              />
              <div
                className="l4-poly-2"
                style={{
                  background: '#d4af37',
                  opacity: 0.7,
                }}
              />
              <div
                className="l4-poly-3"
                style={{
                  background: '#38bdf8',
                  opacity: 0.5,
                }}
              />
            </div>

            <div className="l4-top-row">
              <div>
                <div className="l4-company-name" style={{ color: currentPrimary }}>
                  {template.sample_company || 'COMPANY NAME'}
                </div>
                <div className="l4-company-sub">{template.sample_tagline || 'Design & Strategy'}</div>
              </div>
            </div>

            <div className="l4-bottom-row">
              <div>
                <div className="l4-person-name">{template.sample_name || 'FULL NAME'}</div>
                <div className="l4-person-title">{template.sample_job_title || 'Job Title'}</div>
                <div>Address Line 1</div>
                <div>{template.sample_email || 'Email / Other'}</div>
                <div>{template.sample_phone || '+91 98765 43210'}</div>
              </div>
            </div>
          </div>
        ) : layout === 'medical_care' ? (
          /* LAYOUT 5: MEDICAL CARE */
          <div className="vp-card-canvas layout-medical-care">
            <div className="l5-header">
              <div className="l5-cross-icon" style={{ background: currentPrimary }}>
                +
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: currentPrimary }}>
                  {template.sample_company || 'Metro Health Clinic'}
                </div>
                <div style={{ fontSize: '0.5rem', color: '#64748b' }}>
                  {template.sample_tagline || 'Diagnostics & Family Medicine'}
                </div>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${currentPrimary}33`, margin: '4px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.48rem', color: '#334155' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.7rem', color: '#0f172a' }}>
                  {template.sample_name || 'Dr. Full Name, MD'}
                </div>
                <div style={{ color: currentPrimary, fontWeight: 600 }}>
                  {template.sample_job_title || 'Senior Consultant Physician'}
                </div>
                <div>Emergency Clinic Hours: 24/7</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>{template.sample_phone || 'Direct: +91 98765 43210'}</div>
                <div>{template.sample_email || 'clinic@medicalcare.org'}</div>
                <div>Hospital Road, Suite 400</div>
              </div>
            </div>
          </div>
        ) : layout === 'legal_crest' ? (
          /* LAYOUT 6: LEGAL CREST */
          <div className="vp-card-canvas layout-legal-crest" style={{ borderColor: currentPrimary }}>
            <div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '2px', color: currentPrimary, textTransform: 'uppercase', fontWeight: 700 }}>
                {template.sample_company || 'CHAMBERS OF VERITAS'}
              </div>
              <div style={{ fontSize: '0.46rem', color: '#64748b', fontStyle: 'italic' }}>
                {template.sample_tagline || 'Advocates, Solicitors & Arbitrators'}
              </div>
            </div>

            <div style={{ margin: 'auto 0' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', letterSpacing: '1px' }}>
                {template.sample_name || 'FULL NAME'}
              </div>
              <div style={{ fontSize: '0.5rem', color: currentPrimary, fontWeight: 600 }}>
                {template.sample_job_title || 'Advocate High Court'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.45rem', color: '#475569' }}>
              <span>High Court Chambers</span>
              <span>{template.sample_phone || '+91 98765 43210'}</span>
              <span>{template.sample_email || 'counsel@veritas.legal'}</span>
            </div>
          </div>
        ) : layout === 'real_estate_horizon' ? (
          /* LAYOUT 7: REAL ESTATE HORIZON */
          <div className="vp-card-canvas" style={{ padding: 0, justifyContent: 'space-between' }}>
            <div style={{ background: currentPrimary, padding: '8px 12px', color: '#ffffff' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, letterSpacing: '0.5px' }}>
                {template.sample_company || 'PRESTIGE HORIZON REALTY'}
              </div>
              <div style={{ fontSize: '0.46rem', opacity: 0.85 }}>
                {template.sample_tagline || 'Luxury Residencies & Commercial Spaces'}
              </div>
            </div>

            <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.48rem', color: '#334155' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.72rem', color: '#0f172a' }}>{template.sample_name || 'Full Name'}</div>
                <div style={{ color: currentPrimary, fontWeight: 600 }}>{template.sample_job_title || 'Principal Property Consultant'}</div>
                <div style={{ marginTop: '3px' }}>RERA Reg. No: PRM/KA/RERA/1251</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>{template.sample_phone || '+91 98000 11223'}</div>
                <div>{template.sample_email || 'properties@prestige.com'}</div>
                <div>www.prestigehorizon.in</div>
              </div>
            </div>
          </div>
        ) : layout === 'beauty_salon' ? (
          /* LAYOUT 8: BEAUTY & SALON ATELIER */
          <div className="vp-card-canvas" style={{ background: '#fffcfc', border: `1px solid ${currentPrimary}33`, justifyContent: 'space-between', textAlign: 'center' }}>
            <div style={{ color: currentPrimary, fontSize: '0.9rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
              {template.sample_company || 'AURA ATELIER'}
            </div>
            <div style={{ fontSize: '0.46rem', color: '#64748b', fontStyle: 'italic', marginTop: '-4px' }}>
              {template.sample_tagline || 'Skin Aesthetics & Luxury Salon'}
            </div>

            <div style={{ margin: 'auto 0' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>{template.sample_name || 'Full Name'}</div>
              <div style={{ fontSize: '0.48rem', color: currentPrimary }}>{template.sample_job_title || 'Master Aesthetician & Stylist'}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.45rem', color: '#64748b', borderTop: '1px dashed #e2e8f0', paddingTop: '4px' }}>
              <span>{template.sample_phone || '+91 98888 22334'}</span>
              <span>{template.sample_email || 'info@salon.in'}</span>
            </div>
          </div>
        ) : (
          /* DEFAULT / CLASSIC PHOTO LAYOUT */
          <div className="vp-card-canvas layout-classic-photo">
            <div className="l1-top-row">
              <div className="l1-brand-col">
                <div className="l1-photo-box" style={{ borderColor: currentPrimary }}>
                  <span style={{ color: currentPrimary, fontWeight: 700 }}>Logo</span>
                  <span style={{ fontSize: '0.36rem', opacity: 0.8 }}>or</span>
                  <span>Photo</span>
                </div>
                <div className="l1-company-wrap">
                  <div className="l1-company-name" style={{ color: currentPrimary }}>
                    {template.sample_company || 'Company Name'}
                  </div>
                  <div className="l1-company-msg">
                    {template.sample_tagline || 'Professional Excellence'}
                  </div>
                </div>
              </div>

              <div className="l1-person-col">
                <div className="l1-person-name" style={{ color: currentPrimary }}>
                  {template.sample_name || 'Full Name'}
                </div>
                <div className="l1-person-title">{template.sample_job_title || 'Job Title'}</div>
                <div className="l1-person-email">{template.sample_email || 'Email / Other'}</div>
              </div>
            </div>

            <div
              className="l1-divider-line"
              style={{
                background: `linear-gradient(90deg, ${currentPrimary} 0%, rgba(203, 213, 225, 0.4) 100%)`,
              }}
            />

            <div className="l1-bottom-row">
              <div>
                <div>Address Line 1</div>
                <div>City, Country</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>{template.sample_phone || '+91 98765 43210'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. COLOR SWATCHES ROW UNDERNEATH */}
      <div className="vp-template-footer">
        <div className="vp-swatches-row">
          {swatches.map((swatch, idx) => {
            const isSelected = activeColor === swatch;
            return (
              <button
                key={idx}
                type="button"
                className={`vp-swatch-dot ${isSelected ? 'active' : ''}`}
                style={getSwatchStyle(swatch)}
                onClick={(e) => handleSwatchClick(e, swatch)}
                title={`Theme Color ${idx + 1}`}
                aria-label={`Theme Color ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
