import React from 'react';
import { ArrowRight, Check, Minus, Plus, RotateCw, ShieldCheck, ShoppingCart, X } from 'lucide-react';
import '../../css/ReviewDesignModal.css';

export default function ReviewDesignModal({
  isOpen,
  onClose,
  reviewStep,
  setReviewStep,
  isReviewApproved,
  setIsReviewApproved,
  quantity,
  setQuantity,
  previewSide,
  handlePreviewSideSwitch,
  handleSetPresetAngle,
  previewRotation,
  handlePreviewMouseDown,
  renderCardSurfaceContent,
  cardBackground,
  layout,
  cornerStyle,
  backsideType,
  activeColor,
  orientation,
  paperStock,
  finishType,
  currentCard,
  onProceedToFinalSteps,
  // Additional state
  setIsNextStepOpen,
  setIsFinalStepsOpen,
  isCustomMode,
  activeTemplate,
  basePrice = 0,
  totalPrice = 0,
  fields = {},
  handleAddToCartConfirm,
  isDraggingPreview,
  previewZoom = 100,
  setPreviewZoom,
}) {
  if (!isOpen) return null;

  return (
    <div className="vp-studio-3d-preview-overlay" onClick={onClose}>
          {reviewStep === 'review' ? (
            <div className="vp-review-design-modal" onClick={(e) => e.stopPropagation()}>
              {/* Left Column: 3D Rotating Card Stage */}
              <div className="vp-review-stage-col">
                <div className="vp-3d-preview-hint">
                  <RotateCw size={12} />
                  <span>Drag to rotate card</span>
                </div>

                <div
                  className="vp-3d-preview-stage"
                  onMouseDown={handlePreviewMouseDown}
                  onWheel={(e) => {
                    const delta = e.deltaY < 0 ? 10 : -10;
                    setPreviewZoom((prev) => Math.max(50, Math.min(200, prev + delta)));
                  }}
                  style={{ cursor: isDraggingPreview ? 'grabbing' : 'grab' }}
                >
                  {/* Floor Shadow */}
                  <div
                    className="vp-3d-floor-shadow"
                    style={{
                      width: orientation === 'vertical' ? '280px' : '480px',
                      opacity: 0.35,
                      transform: `scale(${previewZoom / 100}) rotateX(82deg) translateZ(-50px)`,
                    }}
                  />

                  <div
                    className="vp-3d-card-wrapper"
                    style={{
                      width: orientation === 'vertical' ? '300px' : '520px',
                      height: orientation === 'vertical' ? '520px' : '300px',
                      transform: `perspective(1100px) scale(${previewZoom / 100}) rotateX(${previewRotation.x}deg) rotateY(${previewRotation.y}deg)`,
                      transformStyle: 'preserve-3d',
                      position: 'relative',
                      transition: isDraggingPreview ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {/* Simulated Paper Core */}
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
                      <div className="vp-3d-finish-sheen finish-matte" />
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
                      <div className="vp-3d-finish-sheen finish-matte" />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginTop: '16px' }}>
                  <div className="vp-3d-preview-toggle-pill">
                    <button
                      type="button"
                      className={`vp-3d-preview-toggle-btn ${previewSide === 'front' ? 'active' : ''}`}
                      onClick={() => handlePreviewSideSwitch('front')}
                    >
                      Front
                    </button>
                    <button
                      type="button"
                      className={`vp-3d-preview-toggle-btn ${previewSide === 'back' ? 'active' : ''}`}
                      onClick={() => handlePreviewSideSwitch('back')}
                    >
                      Back
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
                </div>
              </div>

              {/* Right Column: Review Checklist & Approval Actions */}
              <div className="vp-review-info-col">
                <button
                  type="button"
                  className="vp-review-close-square"
                  onClick={() => setIsNextStepOpen(false)}
                  title="Close and return to editor"
                >
                  <X size={20} />
                </button>

                <div className="vp-review-content-body">
                  <h2 className="vp-review-title">Review your design</h2>
                  <p className="vp-review-subtitle">Double-check the following details before you continue.</p>

                  <ul className="vp-review-checklist">
                    <li>Text is clear and easy to read</li>
                    <li>Information is spelled correctly</li>
                    <li>Images are sharp with no blurring</li>
                  </ul>
                </div>

                <div className="vp-review-bottom-actions">
                  <label className="vp-review-checkbox-label">
                    <input
                      type="checkbox"
                      id="authorization-check"
                      checked={isReviewApproved}
                      onChange={(e) => setIsReviewApproved(e.target.checked)}
                    />
                    <span>I have authorization to use the design, I have reviewed and approve it.</span>
                  </label>

                  <button
                    type="button"
                    className="vp-review-continue-btn"
                    onClick={() => {
                      if (!isReviewApproved) {
                        alert('Please check the authorization box to confirm you have reviewed and approve your design.');
                        return;
                      }
                      setIsNextStepOpen(false);
                      setIsFinalStepsOpen(true);
                      window.scrollTo(0, 0);
                    }}
                  >
                    Continue
                  </button>

                  <button
                    type="button"
                    className="vp-review-edit-btn"
                    onClick={() => setIsNextStepOpen(false)}
                  >
                    Edit my design
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Quantity & Order Review Step */
            <div className="vp-studio-preview-modal" onClick={(e) => e.stopPropagation()} style={{ width: '560px' }}>
              <div className="vp-studio-preview-header">
                <h3 style={{ margin: 0 }}>Review Order & Quantity</h3>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setIsNextStepOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                    Select Print Quantity
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      marginTop: '6px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                    }}
                  >
                    <option value={100}>100 cards — ₹{basePrice.toFixed(2)}</option>
                    <option value={200}>200 cards — ₹{(basePrice * 1.9).toFixed(2)} (5% off)</option>
                    <option value={300}>300 cards — ₹{(basePrice * 2.76).toFixed(2)} (8% off)</option>
                    <option value={500}>500 cards — ₹{(basePrice * 4.4).toFixed(2)} (12% off)</option>
                    <option value={1000}>1,000 cards — ₹{(basePrice * 8.0).toFixed(2)} (20% off)</option>
                  </select>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Item:</span>
                    <strong>{currentCard.title}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Paper Stock:</span>
                    <strong>{paperStock}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Finish:</span>
                    <strong>{finishType}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Corners:</span>
                    <strong>{cornerStyle === 'rounded' ? 'Rounded Die-Cut' : 'Standard 90°'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>{isCustomMode ? 'Design Type:' : 'Template:'}</span>
                    <strong>{activeTemplate?.title || (isCustomMode ? 'Custom Uploaded Artwork' : 'Custom Design')}</strong>
                  </div>
                  {fields.companyName && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span>Company:</span>
                      <strong>{fields.companyName}</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '1.05rem' }}>
                    <span>Total Amount:</span>
                    <strong style={{ color: '#0056b3' }}>₹{totalPrice}</strong>
                  </div>
                </div>
              </div>
              <div className="vp-studio-preview-footer">
                <button
                  type="button"
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  onClick={() => setReviewStep('review')}
                >
                  ← Back to Review
                </button>
                <button
                  type="button"
                  style={{
                    background: '#0099ff',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 22px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  onClick={handleAddToCartConfirm}
                >
                  Approve & Add to Cart
                </button>
              </div>
            </div>
          )}
    </div>
  );
}
