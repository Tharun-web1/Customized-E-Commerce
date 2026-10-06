import React from 'react';
import { AlignCenter, AlignLeft, AlignRight, Bold, Check, ChevronDown, Copy, Crosshair, Grid, HelpCircle, Italic, Layers, List, Lock, Maximize2, Minus, MoreHorizontal, Plus, Settings, Share2, ShieldCheck, SlidersHorizontal, Sparkles, Trash2, Underline, Unlock, ZoomIn, ZoomOut } from 'lucide-react';
import CardSurface from './CardSurface';
import '../../css/StudioCanvas.css';

export default function StudioCanvas({
  setActivePopover,
  copyToast,
  zoom,
  setZoom,
  activeSide,
  activeField,
  currentStyle,
  updateActiveStyle,
  activeColor,
  handleDuplicateField,
  activePopover,
  orientation,
  cardDimension,
  dimensionUnit,
  cardBackground,
  layout,
  cornerStyle,
  cardSurfaceProps,
  hoveredGuide,
  setHoveredGuide,
  pinnedGuide,
  setPinnedGuide,
  setDimensionUnit,
  activeGuide,
  finishType,
  renderCardSurfaceContent,
}) {
  return (
        <main className="vp-studio-canvas-area" onClick={() => setActivePopover(null)}>
          {/* Duplicate Toast Notification */}
          {copyToast && (
            <div className="vp-copy-toast">
              <Check size={14} />
              <span>{copyToast}</span>
            </div>
          )}

          <div className="vp-studio-stage-wrapper" style={{ transform: `scale(${zoom / 100})` }}>
            {/* FLOATING RICH TEXT STYLING TOOLBAR (DIRECTLY ON TOP OF CARD) */}
            {activeSide === 'front' && activeField && (
              <div className="vp-floating-text-toolbar" onClick={(e) => e.stopPropagation()}>
                {/* 1. Font Family Dropdown */}
                <div className="vp-font-family-select-wrap">
                  <select
                    className="vp-font-select"
                    value={currentStyle.fontFamily || 'Fira Sans'}
                    onChange={(e) => updateActiveStyle('fontFamily', e.target.value)}
                    title="Font Family"
                  >
                    <option value="Fira Sans">Fira Sans</option>
                    <option value="Inter">Inter</option>
                    <option value="Outfit">Outfit</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Cinzel">Cinzel</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                  <ChevronDown size={14} className="vp-select-chevron" />
                </div>

                {/* 2. Font Size Controls: [-] [13 v] [+] */}
                <div className="vp-font-size-group">
                  <button
                    type="button"
                    className="vp-tb-btn vp-size-btn"
                    title="Decrease font size"
                    onClick={() => updateActiveStyle('fontSize', Math.max(8, (currentStyle.fontSize || 14) - 1))}
                  >
                    <Minus size={13} />
                  </button>

                  <div className="vp-size-input-wrap">
                    <select
                      className="vp-size-select"
                      value={currentStyle.fontSize || 14}
                      onChange={(e) => updateActiveStyle('fontSize', Number(e.target.value))}
                      title="Font Size"
                    >
                      {[8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 28, 32, 36, 42, 48].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown size={11} className="vp-size-chevron" />
                  </div>

                  <button
                    type="button"
                    className="vp-tb-btn vp-size-btn"
                    title="Increase font size"
                    onClick={() => updateActiveStyle('fontSize', Math.min(72, (currentStyle.fontSize || 14) + 1))}
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* 3. Text Color Picker Swatch */}
                <div className="vp-color-picker-wrap">
                  <label
                    className="vp-color-swatch-circle"
                    style={{ backgroundColor: currentStyle.color || activeColor }}
                    title="Change text color"
                  >
                    <input
                      type="color"
                      value={currentStyle.color || activeColor}
                      onChange={(e) => updateActiveStyle('color', e.target.value)}
                      className="vp-hidden-color-input"
                    />
                  </label>
                </div>

                {/* 4. Bold Toggle [B] */}
                <button
                  type="button"
                  className={`vp-tb-btn ${currentStyle.bold ? 'active' : ''}`}
                  title="Bold"
                  onClick={() => updateActiveStyle('bold', !currentStyle.bold)}
                >
                  <Bold size={15} />
                </button>

                {/* 5. Text Alignment Toggle [≡] */}
                <button
                  type="button"
                  className="vp-tb-btn"
                  title={`Alignment: ${currentStyle.align || 'left'}`}
                  onClick={() => {
                    const nextAlign = currentStyle.align === 'left' ? 'center' : currentStyle.align === 'center' ? 'right' : 'left';
                    updateActiveStyle('align', nextAlign);
                  }}
                >
                  {currentStyle.align === 'center' ? (
                    <AlignCenter size={15} />
                  ) : currentStyle.align === 'right' ? (
                    <AlignRight size={15} />
                  ) : (
                    <AlignLeft size={15} />
                  )}
                </button>

                {/* 6. Bullet List Toggle [:=] */}
                <button
                  type="button"
                  className={`vp-tb-btn ${currentStyle.isBullet ? 'active' : ''}`}
                  title="List Bullet"
                  onClick={() => updateActiveStyle('isBullet', !currentStyle.isBullet)}
                >
                  <List size={15} />
                </button>

                {/* 7. Spacing Controls [↕] */}
                <div className="vp-popover-anchor">
                  <button
                    type="button"
                    className={`vp-tb-btn ${activePopover === 'spacing' ? 'active' : ''}`}
                    title="Spacing (Letter & Line)"
                    onClick={() => setActivePopover((prev) => (prev === 'spacing' ? null : 'spacing'))}
                  >
                    <SlidersHorizontal size={15} />
                  </button>
                  {activePopover === 'spacing' && (
                    <div className="vp-style-popover vp-spacing-popover">
                      <div className="vp-popover-title">Letter Spacing</div>
                      <input
                        type="range"
                        min="0"
                        max="8"
                        step="0.5"
                        value={currentStyle.letterSpacing || 0}
                        onChange={(e) => updateActiveStyle('letterSpacing', parseFloat(e.target.value))}
                      />
                      <div className="vp-popover-val">{currentStyle.letterSpacing || 0}px</div>

                      <div className="vp-popover-title" style={{ marginTop: '10px' }}>Line Height</div>
                      <input
                        type="range"
                        min="1"
                        max="2.2"
                        step="0.1"
                        value={currentStyle.lineHeight || 1.2}
                        onChange={(e) => updateActiveStyle('lineHeight', parseFloat(e.target.value))}
                      />
                      <div className="vp-popover-val">{currentStyle.lineHeight || 1.2}x</div>
                    </div>
                  )}
                </div>

                {/* 8. Format Button */}
                <div className="vp-popover-anchor">
                  <button
                    type="button"
                    className={`vp-tb-text-btn ${activePopover === 'format' ? 'active' : ''}`}
                    onClick={() => setActivePopover((prev) => (prev === 'format' ? null : 'format'))}
                  >
                    Format
                  </button>
                  {activePopover === 'format' && (
                    <div className="vp-style-popover vp-format-popover">
                      <button
                        type="button"
                        className={currentStyle.italic ? 'active' : ''}
                        onClick={() => updateActiveStyle('italic', !currentStyle.italic)}
                      >
                        <em>Italic</em>
                      </button>
                      <button
                        type="button"
                        className={currentStyle.underline ? 'active' : ''}
                        onClick={() => updateActiveStyle('underline', !currentStyle.underline)}
                      >
                        <u>Underline</u>
                      </button>
                      <button
                        type="button"
                        className={currentStyle.textTransform === 'uppercase' ? 'active' : ''}
                        onClick={() => {
                          updateActiveStyle('textTransform', currentStyle.textTransform === 'uppercase' ? 'none' : 'uppercase');
                        }}
                      >
                        UPPERCASE
                      </button>
                      <button
                        type="button"
                        className={currentStyle.textTransform === 'capitalize' ? 'active' : ''}
                        onClick={() => {
                          updateActiveStyle('textTransform', currentStyle.textTransform === 'capitalize' ? 'none' : 'capitalize');
                        }}
                      >
                        Capitalize
                      </button>
                    </div>
                  )}
                </div>

                {/* 9. Effects Button */}
                <div className="vp-popover-anchor">
                  <button
                    type="button"
                    className={`vp-tb-text-btn ${activePopover === 'effects' ? 'active' : ''}`}
                    onClick={() => setActivePopover((prev) => (prev === 'effects' ? null : 'effects'))}
                  >
                    <Sparkles size={14} style={{ marginRight: '4px' }} />
                    Effects
                  </button>
                  {activePopover === 'effects' && (
                    <div className="vp-style-popover vp-effects-popover">
                      {[
                        { key: 'none', label: 'None' },
                        { key: 'shadow', label: 'Drop Shadow' },
                        { key: 'lift', label: 'Soft Lift' },
                        { key: 'glow', label: 'Neon Glow' },
                      ].map((eff) => (
                        <button
                          key={eff.key}
                          type="button"
                          className={currentStyle.effect === eff.key ? 'selected' : ''}
                          onClick={() => {
                            updateActiveStyle('effect', eff.key);
                            setActivePopover(null);
                          }}
                        >
                          {eff.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="vp-tb-divider" />

                {/* 10. Transparency / Opacity (Checkerboard icon) */}
                <div className="vp-popover-anchor">
                  <button
                    type="button"
                    className={`vp-tb-btn ${activePopover === 'opacity' ? 'active' : ''}`}
                    title="Transparency"
                    onClick={() => setActivePopover((prev) => (prev === 'opacity' ? null : 'opacity'))}
                  >
                    <Grid size={15} />
                  </button>
                  {activePopover === 'opacity' && (
                    <div className="vp-style-popover vp-opacity-popover">
                      <div className="vp-popover-title">Transparency</div>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={currentStyle.opacity !== undefined ? currentStyle.opacity : 1}
                        onChange={(e) => updateActiveStyle('opacity', parseFloat(e.target.value))}
                      />
                      <div className="vp-popover-val">
                        {Math.round((currentStyle.opacity !== undefined ? currentStyle.opacity : 1) * 100)}%
                      </div>
                    </div>
                  )}
                </div>

                {/* 11. Duplicate / Copy button */}
                <button
                  type="button"
                  className="vp-tb-btn"
                  title="Duplicate text"
                  onClick={() => handleDuplicateField(activeField)}
                >
                  <Share2 size={14} />
                </button>
              </div>
            )}

            {/* Top Right Badges */}
            <div className="vp-studio-badges-row">
              <button
                type="button"
                className={`vp-safety-pill ${activeGuide === 'safety' ? 'active-guide' : ''} ${pinnedGuide === 'safety' ? 'pinned' : ''}`}
                onMouseEnter={() => setHoveredGuide('safety')}
                onMouseLeave={() => setHoveredGuide(null)}
                onClick={() => setPinnedGuide((prev) => (prev === 'safety' ? null : 'safety'))}
                title="Hover or click to reflect Safety Area on card"
              >
                <span className="vp-guide-dot safety" />
                <span>Safety Area</span>
                {pinnedGuide === 'safety' && <span className="vp-pinned-badge">Pinned</span>}
              </button>

              <button
                type="button"
                className={`vp-bleed-pill ${activeGuide === 'bleed' ? 'active-guide' : ''} ${pinnedGuide === 'bleed' ? 'pinned' : ''}`}
                onMouseEnter={() => setHoveredGuide('bleed')}
                onMouseLeave={() => setHoveredGuide(null)}
                onClick={() => setPinnedGuide((prev) => (prev === 'bleed' ? null : 'bleed'))}
                title="Hover or click to reflect Bleed on card"
              >
                <span className="vp-guide-dot bleed" />
                <span>Bleed</span>
                {pinnedGuide === 'bleed' && <span className="vp-pinned-badge">Pinned</span>}
              </button>

              <button
                type="button"
                className="vp-unit-pill"
                onClick={() => setDimensionUnit((prev) => (prev === 'both' ? 'cm' : prev === 'cm' ? 'mm' : 'both'))}
                title="Switch units between cm, mm, and both"
              >
                Unit: {dimensionUnit === 'cm' ? 'cm' : dimensionUnit === 'mm' ? 'mm' : 'cm / mm'}
              </button>
            </div>

            {/* Stage Center Box with Dimension Guides */}
            <div className="vp-stage-center-box">
              {/* Left Vertical Dimension Guide: 5.3cm (53mm) */}
              <div
                className="vp-dimension-left"
                onClick={() => setDimensionUnit((prev) => (prev === 'both' ? 'cm' : prev === 'cm' ? 'mm' : 'both'))}
                title="Click to toggle units (cm / mm)"
                style={{ cursor: 'pointer' }}
              >
                <div className="vp-dimension-v-line" />
                <div className="vp-dimension-val-rotate">
                  {dimensionUnit === 'cm' ? '5.3cm' : dimensionUnit === 'mm' ? '53mm' : '5.3cm (53mm)'}
                </div>
              </div>

              {/* THE PHYSICAL BUSINESS CARD CANVAS (3.5" x 2" Ratio or Vertical) */}
              <div
                className={`vp-stage-card-board ${activeGuide === 'bleed' ? 'guide-bleed-active' : ''} ${activeGuide === 'safety' ? 'guide-safety-active' : ''}`}
                style={{
                  width: orientation === 'vertical' ? '330px' : '580px',
                  height: orientation === 'vertical' ? '580px' : '330px',
                  borderRadius: cornerStyle === 'rounded' ? '18px' : '2px',
                  boxShadow: finishType === 'Glossy'
                    ? '0 12px 32px rgba(0, 153, 255, 0.18), 0 4px 14px rgba(0, 0, 0, 0.1)'
                    : finishType === 'Velvet'
                      ? '0 12px 30px rgba(131, 24, 67, 0.15), 0 4px 14px rgba(0, 0, 0, 0.1)'
                      : '0 8px 30px rgba(0, 0, 0, 0.12)',
                  background: cardBackground[activeSide]?.value || '#ffffff',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {renderCardSurfaceContent(activeSide, false)}
              </div>
            </div>

            {/* Bottom Horizontal Dimension Guide: 9.1cm (91mm) */}
            <div
              className="vp-dimension-bottom"
              onClick={() => setDimensionUnit((prev) => (prev === 'both' ? 'cm' : prev === 'cm' ? 'mm' : 'both'))}
              title="Click to toggle units (cm / mm)"
              style={{ cursor: 'pointer' }}
            >
              <div className="vp-dimension-h-line" />
              <div className="vp-dimension-h-val">
                {dimensionUnit === 'cm' ? '9.1cm' : dimensionUnit === 'mm' ? '91mm' : '9.1cm (91mm)'}
              </div>
            </div>
          </div>

          {/* Floating Zoom Controls Pill */}
          <div className="vp-studio-floating-zoom">
            <button
              type="button"
              className="vp-zoom-btn"
              onClick={() => setZoom((prev) => Math.max(prev - 10, 60))}
            >
              -
            </button>
            <span className="vp-zoom-text">{zoom}%</span>
            <button
              type="button"
              className="vp-zoom-btn"
              onClick={() => setZoom((prev) => Math.min(prev + 10, 160))}
            >
              +
            </button>
            <Settings size={15} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setZoom(100)} />
          </div>

          {/* Floating Help Button */}
          <button
            type="button"
            className="vp-studio-floating-help"
            onClick={() => alert('Designer Concierge: Need help customizing? Contact our support specialists at 1800-ASAP-PRINT')}
          >
            <HelpCircle size={17} />
            <span>Need design help?</span>
          </button>
        </main>

  );
}
