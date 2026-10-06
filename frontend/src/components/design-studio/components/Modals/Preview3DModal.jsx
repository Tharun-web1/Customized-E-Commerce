import React from 'react';
import { ArrowRight, Check, Eye, Layers, Maximize2, Minus, Plus, RotateCcw, RotateCw, Sparkles, ZoomIn, ZoomOut, X } from 'lucide-react';
import '../../css/Preview3DModal.css';

export default function Preview3DModal({
  isOpen,
  onClose,
  previewMode,
  setPreviewMode,
  previewFinish,
  setPreviewFinish,
  previewSide,
  handlePreviewSideSwitch,
  handleSetPresetAngle,
  previewRotation,
  handlePreviewMouseDown,
  previewZoom,
  setPreviewZoom,
  renderCardSurfaceContent,
  cardBackground,
  layout,
  cornerStyle,
  backsideType,
  activeColor,
  orientation,
  onProceedToReview,
  currentCard,
  paperStock,
  setIsPreviewOpen,
  setPreviewRotation,
  setPreviewSide,
  isDraggingPreview = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="vp-studio-3d-preview-overlay" onClick={onClose}>
          <div className="vp-studio-3d-preview-modal" onClick={(e) => e.stopPropagation()}>
            {/* 1. Header with Metadata, Mode Switcher & Close */}
            <div className="vp-studio-3d-preview-header">
              <div className="vp-preview-header-meta">
                <div className="vp-preview-title-row">
                  <span className="vp-3d-preview-modal-title">Live Card Preview & 3D Mockup</span>
                  <span className="vp-preview-live-badge">
                    <Sparkles size={11} />
                    <span>Photo Real</span>
                  </span>
                </div>
                <div className="vp-preview-specs-strip">
                  <span className="vp-preview-spec-pill">{currentCard?.title || 'Visiting Card'}</span>
                  <span className="vp-preview-spec-sep">•</span>
                  <span className="vp-preview-spec-pill">{orientation === 'vertical' ? 'Vertical 5.1 × 8.9 cm' : 'Horizontal 8.9 × 5.1 cm'}</span>
                  <span className="vp-preview-spec-sep">•</span>
                  <span className="vp-preview-spec-pill">{paperStock || 'Standard Paper'}</span>
                  <span className="vp-preview-spec-sep">•</span>
                  <span className="vp-preview-spec-pill">{cornerStyle === 'rounded' ? 'Rounded Corners' : 'Standard Square'}</span>
                </div>
              </div>

              <div className="vp-preview-header-actions">
                {/* 3D vs 2D View Mode Segmented Switch */}
                <div className="vp-preview-mode-segmented">
                  <button
                    type="button"
                    className={`vp-mode-btn ${previewMode === '3d' ? 'active' : ''}`}
                    onClick={() => {
                      setPreviewMode('3d');
                      setPreviewRotation({ x: 8, y: -14 });
                    }}
                    title="Interactive 3D rotating showcase"
                  >
                    <Layers size={14} />
                    <span>3D Showcase</span>
                  </button>
                  <button
                    type="button"
                    className={`vp-mode-btn ${previewMode === '2d' ? 'active' : ''}`}
                    onClick={() => {
                      setPreviewMode('2d');
                      setPreviewRotation({ x: 0, y: previewSide === 'front' ? 0 : 180 });
                    }}
                    title="Flat 100% scale print preview"
                  >
                    <Maximize2 size={14} />
                    <span>2D Flat View</span>
                  </button>
                </div>

                <button
                  type="button"
                  className="vp-3d-preview-close-btn"
                  onClick={() => setIsPreviewOpen(false)}
                  title="Close preview"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* 2. Modal Body with Control Toolbar, Lighting Stage & Card */}
            <div className="vp-studio-3d-preview-body">
              {/* Quick Camera & Material Controls Toolbar */}
              <div className="vp-preview-toolbar-bar">
                {/* Camera Angle Presets */}
                <div className="vp-preview-preset-group">
                  <span className="vp-preview-group-lbl">Camera:</span>
                  <button
                    type="button"
                    className={`vp-preview-chip-btn ${previewRotation.x === 0 && previewRotation.y % 360 === 0 ? 'active' : ''}`}
                    onClick={() => handleSetPresetAngle('front')}
                  >
                    Front (0°)
                  </button>
                  <button
                    type="button"
                    className={`vp-preview-chip-btn ${Math.abs(previewRotation.x) > 0 ? 'active' : ''}`}
                    onClick={() => handleSetPresetAngle('3d')}
                  >
                    3D Perspective
                  </button>
                  <button
                    type="button"
                    className={`vp-preview-chip-btn ${previewRotation.x === 0 && Math.abs(previewRotation.y % 360) === 180 ? 'active' : ''}`}
                    onClick={() => handleSetPresetAngle('back')}
                  >
                    Back (180°)
                  </button>
                </div>

                {/* Simulated Paper Finish Effect */}
                <div className="vp-preview-preset-group">
                  <span className="vp-preview-group-lbl">Finish Effect:</span>
                  <button
                    type="button"
                    className={`vp-preview-chip-btn ${previewFinish === 'matte' ? 'active' : ''}`}
                    onClick={() => setPreviewFinish('matte')}
                  >
                    Matte
                  </button>
                  <button
                    type="button"
                    className={`vp-preview-chip-btn ${previewFinish === 'glossy' ? 'active' : ''}`}
                    onClick={() => setPreviewFinish('glossy')}
                  >
                    Glossy Sheen
                  </button>
                  <button
                    type="button"
                    className={`vp-preview-chip-btn ${previewFinish === 'metallic' ? 'active' : ''}`}
                    onClick={() => setPreviewFinish('metallic')}
                  >
                    Spot UV / Foil
                  </button>
                </div>

                {/* Reset Angle Button */}
                <button
                  type="button"
                  className="vp-preview-reset-btn"
                  onClick={() => {
                    setPreviewSide('front');
                    setPreviewRotation({ x: 0, y: 0 });
                  }}
                  title="Reset to flat front view"
                >
                  <RotateCcw size={13} />
                  <span>Reset View</span>
                </button>
              </div>

              {/* Interaction Hint */}
              <div className="vp-3d-preview-hint">
                {previewMode === '3d' ? (
                  <>
                    <RotateCw size={13} />
                    <span>Click and drag anywhere on the card to inspect details in 3D</span>
                  </>
                ) : (
                  <>
                    <Eye size={13} />
                    <span>Flat 2D View — Check your text placement and contact readability</span>
                  </>
                )}
              </div>

              {/* 3D Realistic Showcase Stage */}
              <div
                className="vp-3d-preview-stage"
                onMouseDown={previewMode === '3d' ? handlePreviewMouseDown : undefined}
                onWheel={(e) => {
                  const delta = e.deltaY < 0 ? 10 : -10;
                  setPreviewZoom((prev) => Math.max(50, Math.min(200, prev + delta)));
                }}
                style={{ cursor: previewMode === '3d' ? (isDraggingPreview ? 'grabbing' : 'grab') : 'default' }}
              >
                {/* Ground Drop Shadow */}
                <div
                  className="vp-3d-floor-shadow"
                  style={{
                    width: orientation === 'vertical' ? '300px' : '540px',
                    opacity: previewMode === '2d' ? 0.25 : Math.max(0.2, 0.45 - Math.abs(previewRotation.x) * 0.005),
                    transform: `rotateX(82deg) translateZ(-60px) scale(${((previewMode === '2d' ? 0.95 : 1 + Math.sin(Math.abs(previewRotation.y) * Math.PI / 180) * 0.12) * (previewZoom / 100)).toFixed(2)})`,
                  }}
                />

                <div
                  className="vp-3d-card-wrapper"
                  style={{
                    width: orientation === 'vertical' ? '330px' : '580px',
                    height: orientation === 'vertical' ? '580px' : '330px',
                    transform: previewMode === '2d'
                      ? `perspective(1200px) scale(${previewZoom / 100}) rotateX(0deg) rotateY(${previewSide === 'front' ? 0 : 180}deg)`
                      : `perspective(1200px) scale(${previewZoom / 100}) rotateX(${previewRotation.x}deg) rotateY(${previewRotation.y}deg)`,
                    transformStyle: 'preserve-3d',
                    position: 'relative',
                    transition: isDraggingPreview ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* SIMULATED CARD CORE / 3D PAPER STOCK THICKNESS */}
                  <div
                    className="vp-3d-card-core"
                    style={{
                      borderRadius: cornerStyle === 'rounded' ? '16px' : '2px',
                    }}
                  />

                  {/* FRONT FACE (Facing angle 0deg) */}
                  <div
                    className="vp-3d-card-face vp-3d-card-face-front"
                    style={{
                      borderRadius: cornerStyle === 'rounded' ? '16px' : '2px',
                      background: cardBackground.front?.value || '#ffffff',
                      boxShadow: '0 10px 30px -8px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.08)',
                      padding: '16px',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                    }}
                  >
                    {renderCardSurfaceContent('front', true)}
                    {/* Simulated Specular Finish Overlay */}
                    <div className={`vp-3d-finish-sheen finish-${previewFinish}`} />
                  </div>

                  {/* BACK FACE (Facing angle 180deg) */}
                  <div
                    className="vp-3d-card-face vp-3d-card-face-back"
                    style={{
                      borderRadius: cornerStyle === 'rounded' ? '16px' : '2px',
                      background: cardBackground.back?.value || (backsideType === 'color' ? activeColor : backsideType === 'grayscale' ? '#334155' : '#ffffff'),
                      boxShadow: '0 10px 30px -8px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.08)',
                      padding: '16px',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                    }}
                  >
                    {renderCardSurfaceContent('back', true)}
                    {/* Simulated Specular Finish Overlay */}
                    <div className={`vp-3d-finish-sheen finish-${previewFinish}`} />
                  </div>
                </div>
              </div>

              {/* 3. Bottom Controls Dock with Side Switch & Actions */}
              <div className="vp-preview-bottom-bar">
                <div className="vp-3d-preview-toggle-pill">
                  <button
                    type="button"
                    className={`vp-3d-preview-toggle-btn ${previewSide === 'front' ? 'active' : ''}`}
                    onClick={() => handlePreviewSideSwitch('front')}
                  >
                    Front Side
                  </button>

                  <button
                    type="button"
                    className="vp-3d-preview-flip-action-btn"
                    onClick={() => handleSetPresetAngle('flip')}
                    title="Flip card 180 degrees"
                  >
                    <RotateCw size={13} />
                    <span>Flip Card</span>
                  </button>

                  <button
                    type="button"
                    className={`vp-3d-preview-toggle-btn ${previewSide === 'back' ? 'active' : ''}`}
                    onClick={() => handlePreviewSideSwitch('back')}
                  >
                    Back Side
                  </button>
                </div>

                {/* Zoom Controls Pill */}
                <div
                  className="vp-3d-zoom-pill"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '24px',
                    padding: '3px 8px',
                    gap: '4px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <button
                    type="button"
                    title="Zoom out"
                    onClick={() => setPreviewZoom((prev) => Math.max(50, prev - 10))}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#475569',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span
                    title="Click to reset 100%"
                    onClick={() => setPreviewZoom(100)}
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#0f172a',
                      minWidth: '42px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    {previewZoom}%
                  </span>
                  <button
                    type="button"
                    title="Zoom in"
                    onClick={() => setPreviewZoom((prev) => Math.min(200, prev + 10))}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#475569',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="vp-preview-footer-actions">
                  <button
                    type="button"
                    className="vp-preview-return-btn"
                    onClick={() => (onClose ? onClose() : setIsPreviewOpen ? setIsPreviewOpen(false) : null)}
                  >
                    Back to Editing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
