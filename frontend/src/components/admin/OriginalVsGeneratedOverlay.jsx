import React, { useState } from 'react';
import {
  Layers,
  Sliders,
  CheckCircle2,
  SplitSquareVertical,
  Activity,
  Image as ImageIcon,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import InteractiveTemplateCanvas from './InteractiveTemplateCanvas';

export default function OriginalVsGeneratedOverlay({
  originalImageUrl,
  templateJson,
  renderedImageUrl,
  diffImageUrl,
  similarityScore = 96.5,
  detectedOrientation = 'horizontal',
}) {
  const [viewMode, setViewMode] = useState('side_by_side'); // 'side_by_side' | 'overlay' | 'difference' | 'original' | 'generated'
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);

  const cWidth = templateJson?.canvas?.width || 1050;
  const cHeight = templateJson?.canvas?.height || 600;
  const aspectRatio = `${cWidth} / ${cHeight}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Top Controls: Mode Switcher, Opacity Slider & Visual Match Score */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: 6, padding: 2, gap: 2 }}>
            <button
              type="button"
              onClick={() => setViewMode('side_by_side')}
              style={{
                padding: '5px 11px',
                border: 'none',
                borderRadius: 4,
                fontSize: '0.74rem',
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
                padding: '5px 11px',
                border: 'none',
                borderRadius: 4,
                fontSize: '0.74rem',
                fontWeight: 700,
                background: viewMode === 'overlay' ? '#0070ba' : 'transparent',
                color: viewMode === 'overlay' ? '#ffffff' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Layers size={13} /> Overlay Opacity
            </button>

            <button
              type="button"
              onClick={() => setViewMode('difference')}
              style={{
                padding: '5px 11px',
                border: 'none',
                borderRadius: 4,
                fontSize: '0.74rem',
                fontWeight: 700,
                background: viewMode === 'difference' ? '#0070ba' : 'transparent',
                color: viewMode === 'difference' ? '#ffffff' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Activity size={13} /> Difference Heatmap
            </button>

            <button
              type="button"
              onClick={() => setViewMode('original')}
              style={{
                padding: '5px 10px',
                border: 'none',
                borderRadius: 4,
                fontSize: '0.74rem',
                fontWeight: 700,
                background: viewMode === 'original' ? '#0070ba' : 'transparent',
                color: viewMode === 'original' ? '#ffffff' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ImageIcon size={12} /> Original Only
            </button>

            <button
              type="button"
              onClick={() => setViewMode('generated')}
              style={{
                padding: '5px 10px',
                border: 'none',
                borderRadius: 4,
                fontSize: '0.74rem',
                fontWeight: 700,
                background: viewMode === 'generated' ? '#0070ba' : 'transparent',
                color: viewMode === 'generated' ? '#ffffff' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={12} /> Generated Only
            </button>
          </div>

          {/* Opacity Slider for Overlay Mode */}
          {viewMode === 'overlay' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: 6 }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569' }}>
                Opacity: {Math.round(overlayOpacity * 100)}%
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                style={{ width: 110, cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', gap: '3px' }}>
                {[0, 0.25, 0.5, 0.75, 1].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setOverlayOpacity(preset)}
                    style={{
                      padding: '2px 5px',
                      fontSize: '0.68rem',
                      borderRadius: 3,
                      border: '1px solid #cbd5e1',
                      background: overlayOpacity === preset ? '#0070ba' : '#f8fafc',
                      color: overlayOpacity === preset ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    {preset * 100}%
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Visual Match Score Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: similarityScore >= 95 ? '#059669' : '#d97706',
              fontWeight: 800,
              background: similarityScore >= 95 ? '#ecfdf5' : '#fffbeb',
              padding: '4px 10px',
              borderRadius: 20,
              border: `1px solid ${similarityScore >= 95 ? '#a7f3d0' : '#fde68a'}`,
            }}
          >
            {similarityScore >= 95 ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>Visual Match Score: {similarityScore}%</span>
          </div>
        </div>
      </div>

      {/* VIEWPORT AREA */}
      {viewMode === 'side_by_side' && (
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
          {/* Left: Original Card Scan */}
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
                style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
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
      )}

      {viewMode === 'overlay' && (
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
                objectFit: 'fill',
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

      {viewMode === 'difference' && (
        <div
          style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: 10,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#f8fafc', fontSize: '0.82rem', fontWeight: 700 }}>
            <Activity size={16} color="#ef4444" />
            <span>Pixel Difference Heatmap (Red/Amber indicates visual mismatch)</span>
          </div>

          <div
            style={{
              position: 'relative',
              maxWidth: 750,
              width: '100%',
              aspectRatio,
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 12px 28px rgba(0,0,0,0.4)',
              border: '1px solid #334155',
            }}
          >
            {/* Base Layer: Original */}
            <img
              src={originalImageUrl}
              alt="Original Scan"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'fill',
                display: 'block',
                filter: 'grayscale(60%) opacity(70%)',
                zIndex: 1,
              }}
            />

            {/* Difference Heatmap Layer */}
            {diffImageUrl ? (
              <img
                src={diffImageUrl}
                alt="Difference Heatmap"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                  display: 'block',
                  zIndex: 2,
                  mixBlendMode: 'screen',
                }}
              />
            ) : null}
          </div>

          <div style={{ marginTop: '10px', fontSize: '0.74rem', color: '#94a3b8', textAlign: 'center' }}>
            Mismatches are highlighted in glowing red. Uniform dark/neutral regions indicate accurate pixel alignment.
          </div>
        </div>
      )}

      {viewMode === 'original' && (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '16px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: 750, width: '100%', aspectRatio, borderRadius: 8, overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
            <img src={originalImageUrl} alt="Original Card" style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }} />
          </div>
        </div>
      )}

      {viewMode === 'generated' && (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '16px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: 750, width: '100%', aspectRatio, borderRadius: 8, overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
            <InteractiveTemplateCanvas templateJson={templateJson} readOnly={true} />
          </div>
        </div>
      )}
    </div>
  );
}
