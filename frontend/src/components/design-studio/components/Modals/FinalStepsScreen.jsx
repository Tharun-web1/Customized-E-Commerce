import React from 'react';
import { Check, ChevronDown, ChevronLeft, HelpCircle, Minus, Plus, RotateCw, ShoppingCart, Sparkles, Truck, ZoomIn, ZoomOut, X } from 'lucide-react';
import '../../css/FinalStepsScreen.css';

export default function FinalStepsScreen({
  isOpen,
  onClose,
  orientation,
  cardBackground,
  layout,
  cornerStyle,
  backsideType,
  activeColor,
  renderCardSurfaceContent,
  previewRotation,
  previewMode,
  previewSide,
  previewFinish,
  handlePreviewMouseDown,
  handlePreviewSideSwitch,
  handleSetPresetAngle,
  setPreviewMode,
  setPreviewFinish,
  selectedStock,
  setSelectedStock,
  quantity,
  setQuantity,
  handleAddToCartFlow,
  isAddingToCart,
  currentCard,
  finishType,
  setFinishType,
  showPricingGuide,
  setShowPricingGuide,
  showDeliveryOptions,
  setShowDeliveryOptions,
  setIsFinalStepsOpen,
  setPaperStock = () => {},
  handleAddToCartConfirm,
  totalPrice = 0,
  previewZoom = 100,
  setPreviewZoom = () => {},
  isDraggingPreview = false,
}) {
  if (!isOpen) return null;

  return (
      <div className="vp-final-steps-page">
        {/* Hidden flat 2D capture container for exact edited card snapshot */}
        <div
          id="vp-render-capture-front"
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: orientation === 'vertical' ? '330px' : '580px',
            height: orientation === 'vertical' ? '580px' : '330px',
            background: cardBackground.front?.value || (layout === 'luxury_black_gold' ? '#09090b' : '#ffffff'),
            borderRadius: cornerStyle === 'rounded' ? '18px' : '2px',
            padding: '16px',
            boxSizing: 'border-box',
            overflow: 'hidden',
            zIndex: -99999,
            opacity: 0.001,
            pointerEvents: 'none',
          }}
        >
          {renderCardSurfaceContent('front', true)}
        </div>

        <div
          id="vp-render-capture-back"
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: orientation === 'vertical' ? '330px' : '580px',
            height: orientation === 'vertical' ? '580px' : '330px',
            background:
              cardBackground.back?.value ||
              (backsideType === 'color' ? activeColor : backsideType === 'grayscale' ? '#334155' : (layout === 'luxury_black_gold' ? '#09090b' : '#ffffff')),
            borderRadius: cornerStyle === 'rounded' ? '18px' : '2px',
            padding: '16px',
            boxSizing: 'border-box',
            overflow: 'hidden',
            zIndex: -99999,
            opacity: 0.001,
            pointerEvents: 'none',
          }}
        >
          {renderCardSurfaceContent('back', true)}
        </div>

        {/* Top Header */}
        <header className="vp-final-steps-header">
          <div
            className="vp-final-steps-logo-wrap"
            onClick={() => (onClose ? onClose() : setIsFinalStepsOpen ? setIsFinalStepsOpen(false) : null)}
            title="Return to Design Editor"
          >
            <img
              src="/asap-logo.jpeg"
              alt="ASAP Logo"
              style={{
                height: '38px',
                width: 'auto',
                objectFit: 'contain',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            />
          </div>

          <div className="vp-final-steps-help-wrap">
            <HelpCircle size={20} strokeWidth={1.8} />
            <span
              onClick={() =>
                alert('Need assistance? Call our direct print specialist at 02522-669393 (Mon–Sat 9AM–8PM IST).')
              }
            >
              Help is here
            </span>
          </div>
        </header>

        {/* Main Split Body */}
        <main className="vp-final-steps-main">
          {/* Left Column: 3D Realistic Interactive Card Preview */}
          <section className="vp-final-steps-left-col">
            <div
              className="vp-3d-preview-stage"
              onMouseDown={handlePreviewMouseDown}
              onWheel={(e) => {
                const delta = e.deltaY < 0 ? 10 : -10;
                setPreviewZoom((prev) => Math.max(50, Math.min(200, prev + delta)));
              }}
              style={{ cursor: isDraggingPreview ? 'grabbing' : 'grab' }}
            >
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
                {/* FRONT FACE */}
                <div
                  className="vp-3d-card-face vp-3d-card-face-front"
                  style={{
                    borderRadius: cornerStyle === 'rounded' ? '16px' : '2px',
                    background: cardBackground.front?.value || '#ffffff',
                    boxShadow:
                      '0 32px 64px -16px rgba(0, 0, 0, 0.25), 0 16px 32px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                    padding: '16px',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                  }}
                >
                  {renderCardSurfaceContent('front', true)}
                </div>

                {/* BACK FACE */}
                <div
                  className="vp-3d-card-face vp-3d-card-face-back"
                  style={{
                    borderRadius: cornerStyle === 'rounded' ? '16px' : '2px',
                    background:
                      cardBackground.back?.value ||
                      (backsideType === 'color' ? activeColor : backsideType === 'grayscale' ? '#334155' : '#ffffff'),
                    boxShadow:
                      '0 32px 64px -16px rgba(0, 0, 0, 0.25), 0 16px 32px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                    padding: '16px',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                  }}
                >
                  {renderCardSurfaceContent('back', true)}
                </div>
              </div>
            </div>

            {/* Bottom Front / Back pill toggle & Zoom controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
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
          </section>

          {/* Right Column: Final Steps Form */}
          <section className="vp-final-steps-right-col">
            <h1 className="vp-final-steps-title">Final Steps</h1>
            <p className="vp-final-steps-subtitle">
              Almost done! Make selections below to finalize your design. Have questions? Call us at 02522-669393.
            </p>

            {/* Quantity Section */}
            <div className="vp-final-steps-field-group">
              <div className="vp-final-steps-label-row">
                <label className="vp-final-steps-label">Quantity*</label>
                <button
                  type="button"
                  className="vp-final-steps-link-btn"
                  onClick={() => setShowPricingGuide(true)}
                >
                  Show pricing guide
                </button>
              </div>
              <p className="vp-final-steps-hint">
                Get volume pricing on higher quantities of the same design
              </p>

              <div className="vp-final-steps-select-wrapper">
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="vp-final-steps-select"
                >
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                  <option value={300}>300</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                </select>
                <ChevronDown size={18} className="vp-final-steps-select-chevron" />
              </div>
              <span className="vp-final-steps-min-note">Minimum: 100</span>
            </div>

            {/* Stock Section */}
            <div className="vp-final-steps-field-group">
              <label className="vp-final-steps-label" style={{ marginBottom: '12px' }}>
                Stock*
              </label>

              {/* Standard Glossy */}
              <div
                className={`vp-stock-option-card ${selectedStock === 'Standard Glossy' ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedStock('Standard Glossy');
                  setPaperStock('Standard 350 GSM');
                  setFinishType('Glossy');
                }}
              >
                <div className="vp-stock-card-thumb vp-stock-thumb-glossy">
                  <div className="vp-stock-thumb-sheen" />
                  <span className="vp-stock-thumb-logo">▲</span>
                </div>
                <div className="vp-stock-card-details">
                  <h3 className="vp-stock-card-name">Standard Glossy</h3>
                  <p className="vp-stock-card-desc">
                    Light-catching gloss that complements vivid designs. 350 gsm.
                  </p>
                  <ul className="vp-stock-card-bullets">
                    <li><strong>Best for:</strong> Vibrant designs</li>
                    <li><strong>Not for:</strong> Designs that use less ink; white designs</li>
                    <li><strong>Feels like:</strong> Slick front and back</li>
                  </ul>
                </div>
              </div>

              {/* Standard Matte */}
              <div
                className={`vp-stock-option-card ${selectedStock === 'Standard Matte' ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedStock('Standard Matte');
                  setPaperStock('Standard 350 GSM');
                  setFinishType('Matte');
                }}
              >
                <div className="vp-stock-card-thumb vp-stock-thumb-matte">
                  <span className="vp-stock-thumb-logo">▲</span>
                </div>
                <div className="vp-stock-card-details">
                  <h3 className="vp-stock-card-name">Standard Matte</h3>
                  <p className="vp-stock-card-desc">
                    Coated, smooth feel and easy readability. 350 gsm.
                  </p>
                  <ul className="vp-stock-card-bullets">
                    <li><strong>Best for:</strong> Light-colored designs</li>
                    <li><strong>Feels like:</strong> Smooth, shine-free finish</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Fixed Bottom Checkout Bar */}
        <footer className="vp-final-steps-bottom-bar">
          <div className="vp-final-steps-price-block">
            <div className="vp-final-steps-total-price">
              ₹{parseFloat(totalPrice).toFixed(2)}
            </div>
            <div className="vp-final-steps-unit-price">
              ₹{(parseFloat(totalPrice) / quantity).toFixed(2)} each / {quantity} units
            </div>
            <div className="vp-final-steps-delivery-info">
              <Truck size={14} color="#0f172a" />
              <span>Delivery to 110001</span>
              <button
                type="button"
                className="vp-final-steps-delivery-link"
                onClick={() => setShowDeliveryOptions(true)}
              >
                Review delivery options
              </button>
            </div>
          </div>

          <button
            type="button"
            className="vp-final-steps-add-cart-btn"
            disabled={isAddingToCart}
            onClick={handleAddToCartConfirm || handleAddToCartFlow}
            style={{
              opacity: isAddingToCart ? 0.75 : 1,
              cursor: isAddingToCart ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isAddingToCart ? (
              <>
                <RotateCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Adding to Cart...</span>
              </>
            ) : (
              <span>Add to Cart</span>
            )}
          </button>
        </footer>

        {/* Pricing Guide Modal */}
        {showPricingGuide && (
          <div className="vp-studio-3d-preview-overlay" onClick={() => setShowPricingGuide(false)}>
            <div className="vp-studio-preview-modal" onClick={(e) => e.stopPropagation()} style={{ width: '480px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Quantity Pricing Guide</h3>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setShowPricingGuide(false)}
                >
                  <X size={18} />
                </button>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                Order higher quantities to unlock wholesale manufacturing savings.
              </p>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                {[
                  { qty: 100, each: '₹3.00', total: '₹300.00', save: 'Base price' },
                  { qty: 200, each: '₹2.85', total: '₹570.00', save: '5% off' },
                  { qty: 300, each: '₹2.76', total: '₹828.00', save: '8% off' },
                  { qty: 500, each: '₹2.64', total: '₹1,320.00', save: '12% off' },
                  { qty: 1000, each: '₹2.40', total: '₹2,400.00', save: '20% off' },
                ].map((tier, idx) => (
                  <div
                    key={tier.qty}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: quantity === tier.qty ? '#f0f9ff' : idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      borderBottom: idx < 4 ? '1px solid #e2e8f0' : 'none',
                      fontSize: '13.5px',
                    }}
                  >
                    <strong>{tier.qty} cards</strong>
                    <span style={{ color: '#64748b' }}>{tier.each}/card</span>
                    <strong style={{ color: '#0056b3' }}>{tier.total}</strong>
                    <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>{tier.save}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Delivery Options Modal */}
        {showDeliveryOptions && (
          <div className="vp-studio-3d-preview-overlay" onClick={() => setShowDeliveryOptions(false)}>
            <div className="vp-studio-preview-modal" onClick={(e) => e.stopPropagation()} style={{ width: '480px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Delivery Options</h3>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setShowDeliveryOptions(false)}
                >
                  <X size={18} />
                </button>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                Estimated shipping speeds for pincode <strong>110001 (New Delhi)</strong>:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', border: '1.5px solid #0099ff', borderRadius: '8px', background: '#f0f9ff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '14px' }}>
                    <span>Standard Ground Delivery</span>
                    <span style={{ color: '#059669' }}>FREE</span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                    Delivered in 3–5 business days
                  </div>
                </div>
                <div style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '14px' }}>
                    <span>Express Priority Delivery</span>
                    <span>₹150.00</span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                    Guaranteed in 1–2 business days
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

  );
}
