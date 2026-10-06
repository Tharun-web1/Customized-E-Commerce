import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

function LiveQrCode({ url = 'https://example.com', size = 46 }) {
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
          borderRadius: 4,
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
        borderRadius: 4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
        display: 'inline-block',
      }}
    >
      <img src={dataUrl} alt="Card QR Code" style={{ width: size, height: size, display: 'block' }} />
    </div>
  );
}

export default function CardRecreationLayout({
  activeColor,
  activeTemplate,
  isPreview,
  renderCanvasElement,
  uploadedLogo,
  renderAdjustableLogo,
  setActiveTool,
}) {
  const tJson = activeTemplate?.text_positions?.templateJson;

  // 1. HYBRID RECONSTRUCTED CARD ENGINE:
  // If template contains a clean inpainted background graphic & detected elements,
  // render the exact 2D coordinate design on top of the original card artwork!
  if (tJson?.background?.cleanArtworkSrc) {
    const cW = tJson.canvas?.width || 1050;
    const cH = tJson.canvas?.height || 600;
    const elements = tJson.elements || [];

    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: tJson.background?.color || '#151b2d',
          boxSizing: 'border-box',
        }}
      >
        {/* Layer 0: Pristine Inpainted Background Graphic */}
        <img
          src={tJson.background.cleanArtworkSrc}
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

        {/* Dynamic Reconstructed Elements */}
        {elements.map((el) => {
          if (el.visible === false) return null;
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
                <LiveQrCode url={el.value || 'https://example.com'} size={el.width ? Math.round(el.width * 0.45) : 48} />
              </div>
            );
          }

          if (el.type === 'text') {
            let studioKey = 'customText';
            if (el.field === 'personName') studioKey = 'fullName';
            else if (el.field === 'designation') studioKey = 'jobTitle';
            else if (el.field === 'companyName') studioKey = 'companyName';
            else if (el.field === 'phone') studioKey = 'phone';
            else if (el.field === 'email') studioKey = 'email';
            else if (el.field === 'website') studioKey = 'website';
            else if (el.field === 'address') studioKey = 'address';

            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  zIndex: el.zIndex || 10,
                  whiteSpace: 'nowrap',
                }}
              >
                {renderCanvasElement(
                  studioKey,
                  el.content || el.defaultValue,
                  {
                    fontSize: Math.round((el.fontSize || 16) * 0.95),
                    fontWeight: el.fontWeight || 600,
                    color: el.color || '#ffffff',
                    lineHeight: 1.15,
                    letterSpacing: el.letterSpacing || -0.2,
                    textAlign: el.alignment || 'left',
                  },
                  isPreview
                )}
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  }

  const bgColor = tJson?.background?.color || activeTemplate?.text_positions?.backgroundColor || '#151b2d';
  const logoInitials = tJson?.assets?.logo?.initials || activeTemplate?.text_positions?.logoInitials || 'BC';
  const accentColor = activeTemplate?.text_positions?.accentColor || '#38bdf8';
  const badgeBg = activeTemplate?.text_positions?.swooshColor || '#1e3a8a';
  const hasQr = tJson?.assets?.qr?.enabled ?? (activeTemplate?.text_positions?.hasQrCode !== false);
  const websiteVal = tJson?.content?.website?.text || activeTemplate?.text_positions?.sampleWebsite || 'www.example.com';

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        background: bgColor,
        backgroundImage: 'linear-gradient(135deg, #101524 0%, #1c243c 55%, #131828 100%)',
        boxSizing: 'border-box',
        padding: '24px 28px',
        color: '#ffffff',
      }}
    >
      {/* Top-Right Angled Geometric Accent Cut */}
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

      {/* Bottom Angled Cut */}
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

      {/* LEFT COLUMN: Name, Designation & 3 Contacts */}
      <div
        style={{
          flex: 1.25,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 3,
          paddingRight: '16px',
          minWidth: 0,
        }}
      >
        {/* Name, Designation & Accent Underline */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            {renderCanvasElement('fullName', activeTemplate?.sample_name || 'Cardholder Name', {
              fontSize: 22,
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: -0.2,
            }, isPreview)}

            <div style={{ marginTop: '2px' }}>
              {renderCanvasElement('jobTitle', activeTemplate?.sample_job_title || 'Designation', {
                fontSize: 13,
                fontWeight: 600,
                color: '#94a3b8',
                letterSpacing: 0.2,
              }, isPreview)}
            </div>
          </div>

          {/* Underline Accent */}
          <div
            style={{
              width: 48,
              height: '3px',
              background: accentColor,
              marginTop: '6px',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* Bottom Contacts with Circular Icon Badges */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '16px',
            fontSize: '11px',
            color: '#e2e8f0',
          }}
        >
          {/* Phone */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: badgeBg,
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z" />
              </svg>
            </div>
            {renderCanvasElement('phone', activeTemplate?.sample_phone || '+1 555-0199', {
              fontSize: 11,
              fontWeight: 600,
              color: '#f8fafc',
            }, isPreview)}
          </div>

          {/* Email */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: badgeBg,
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </div>
            {renderCanvasElement('email', activeTemplate?.sample_email || 'contact@domain.com', {
              fontSize: 11,
              color: '#e2e8f0',
            }, isPreview)}
          </div>

          {/* Address */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: badgeBg,
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
              </svg>
            </div>
            {renderCanvasElement('address1', activeTemplate?.text_positions?.sampleAddress || '123 Business Avenue, Suite 100', {
              fontSize: 10,
              color: '#cbd5e1',
            }, isPreview)}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Emblem, Company Name, QR Code, Website */}
      <div
        style={{
          flex: 0.95,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 3,
          paddingLeft: '16px',
          minWidth: 0,
        }}
      >
        {/* Brand Emblem & Company Name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {uploadedLogo ? (
            renderAdjustableLogo(isPreview)
          ) : (activeTemplate?.text_positions?.hasCustomLogo && activeTemplate?.text_positions?.logoImage) ? (
            <img
              src={activeTemplate.text_positions.logoImage}
              alt="Logo"
              style={{ maxHeight: 52, maxWidth: '100%', objectFit: 'contain', cursor: 'pointer' }}
              onClick={() => {
                if (!isPreview && setActiveTool) setActiveTool('uploads');
              }}
            />
          ) : (
            <div
              style={{
                position: 'relative',
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #2563eb 0%, #1e3a8a 70%, #0f172a 100%)',
                boxShadow: '0 0 0 2px #f59e0b, 0 3px 8px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={() => {
                if (!isPreview && setActiveTool) setActiveTool('uploads');
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
                  fontSize: '0.95rem',
                  fontWeight: 900,
                  fontFamily: 'serif',
                  color: '#fbbf24',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 6px rgba(251,191,36,0.6)',
                  letterSpacing: '-0.5px',
                  zIndex: 2,
                }}
              >
                {logoInitials}
              </span>
            </div>
          )}

          {/* Company Name */}
          <div style={{ marginTop: 6, textAlign: 'center', width: '100%' }}>
            {renderCanvasElement('companyName', activeTemplate?.sample_company || 'COMPANY NAME', {
              fontSize: 15,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: 1.2,
              textAlign: 'center',
              textTransform: 'uppercase',
            }, isPreview)}
          </div>
        </div>

        {/* QR Code */}
        {hasQr && (
          <div style={{ margin: '4px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <LiveQrCode url={websiteVal} size={48} />
          </div>
        )}

        {/* Website URL with Globe Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', maxWidth: '100%', overflow: 'hidden' }}>
          <span style={{ fontSize: '11px', color: '#60a5fa' }}>🌐</span>
          {renderCanvasElement('web', websiteVal, {
            fontSize: 10,
            color: '#93c5fd',
            textAlign: 'center',
          }, isPreview)}
        </div>
      </div>
    </div>
  );
}
