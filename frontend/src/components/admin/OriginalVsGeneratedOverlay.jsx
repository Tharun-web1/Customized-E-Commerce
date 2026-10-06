import React, { useState } from 'react';
import { Layers, Sliders, CheckCircle2, Eye, SplitSquareVertical } from 'lucide-react';
import InteractiveTemplateCanvas from './InteractiveTemplateCanvas';

export default function OriginalVsGeneratedOverlay({
  originalImageUrl,
  templateJson,
  renderedImageUrl,
  similarityScore = 96.5,
  detectedOrientation = 'horizontal',
}) {
  const [viewMode, setViewMode] = useState('side_by_side'); // 'side_by_side' | 'overlay'
  const [overlayOpacity, setOverlayOpacity] = useState(0.5); // 0.0 (original only) to 1.0 (template only)

  const cWidth = templateJson?.canvas?.width || 1050;
  const cHeight = templateJson?.canvas?.height || 600;
  const aspectRatio = `${cWidth} / ${cHeight}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Top Controls: Mode Switcher, Presets & Opacity Slider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: 8,
          padding: '8px 14px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: 6, padding: 2 }}>
            <button
              type="button"
              onClick={() => setViewMode('side_by_side')}
              style={{
                padding: '5px 12px',
                border: 'none',
                borderRadius: 4,
                fontSize: '0.76rem',
                fontWeight: 700,
                background: viewMode === 'side_by_side' ? '#0070ba' : 'transparent',
                color: viewMode === 'side_by_side' ? '#ffffff' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <SplitSquareVertical size={13} /> Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setViewMode('overlay')}
              style={{
                padding: '5px 12px',
                border: 'none',
                borderRadius: 4,
                fontSize: '0.76rem',
                fontWeight: 700,
                background: viewMode === 'overlay' ? '#0070ba' : 'transparent',
                color: viewMode === 'overlay' ? '#ffffff' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Layers size={13} /> Overlay Opacity Mode
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#059669', fontWeight: 800 }}>
            <CheckCircle2 size={16} />
            <span>Visual Match Score: {similarityScore}%</span>
          </div>
        </div>

        {/* Opacity Slider and Quick Presets for Overlay Mode */}
        {viewMode === 'overlay' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Blend:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
              style={{ width: 130, cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0070ba', minWidth: 34 }}>
              {Math.round(overlayOpacity * 100)}%
            </span>

            {/* Core Requirement 23 Opacity Presets: 0%, 25%, 50%, 75%, 100% */}
            <div style={{ display: 'flex', gap: '3px', background: '#f1f5f9', padding: 2, borderRadius: 4 }}>
              {[0, 0.25, 0.5, 0.75, 1.0].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setOverlayOpacity(val)}
                  style={{
                    border: 'none',
                    background: overlayOpacity === val ? '#0070ba' : 'transparent',
                    color: overlayOpacity === val ? '#ffffff' : '#475569',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 3,
                    cursor: 'pointer',
                  }}
                >
                  {Math.round(val * 100)}%
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Presentation Container */}
      {viewMode === 'side_by_side' ? (
        /* SIDE-BY-SIDE VIEW */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            padding: '16px',
          }}
        >
          {/* Left: Original Card Preprocessed Scan */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>
              📷 1. ORIGINAL UPLOADED CARD (Source of Truth)
            </div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio,
                borderRadius: 8,
                overflow: 'hidden',
                background: '#000000',
                boxShadow: '0 8px 22px rgba(0,0,0,0.14)',
                border: '1px solid #cbd5e1',
              }}
            >
              <img
                src={originalImageUrl}
                alt="Original Card"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
            </div>
          </div>

          {/* Right: Generated Template Canvas */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0070ba', marginBottom: '8px' }}>
              ✨ 2. GENERATED EDITABLE TEMPLATE (ORIGINAL ≈ GENERATED)
            </div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio,
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 8px 22px rgba(0,0,0,0.18)',
                border: '1.5px solid #0284c7',
              }}
            >
              <InteractiveTemplateCanvas templateJson={templateJson} readOnly={true} />
            </div>
          </div>
        </div>
      ) : (
        /* OVERLAY OPACITY SLIDER VIEW */
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: 750,
              width: '100%',
              aspectRatio,
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 12px 28px rgba(0,0,0,0.2)',
              border: '1px solid #cbd5e1',
            }}
          >
            {/* Base Layer: Original Card */}
            <img
              src={originalImageUrl}
              alt="Original Card Scan"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                zIndex: 1,
              }}
            />

            {/* Overlaid Layer: Generated Template with Variable Opacity */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                opacity: overlayOpacity,
                zIndex: 2,
                pointerEvents: 'none',
              }}
            >
              <InteractiveTemplateCanvas templateJson={templateJson} readOnly={true} />
            </div>
          </div>

          <div style={{ marginTop: '10px', fontSize: '0.74rem', color: '#64748b', textAlign: 'center' }}>
            Blend opacity from 0% (Original Card) to 100% (Generated Template) to verify alignment of logos, typography, and background graphics.
          </div>
        </div>
      )}
    </div>
  );
}
