import React from 'react';
import ExecutiveSwooshLayout from './layouts/ExecutiveSwooshLayout';
import ClassicPhotoLayout from './layouts/ClassicPhotoLayout';
import LuxuryBlackGoldLayout from './layouts/LuxuryBlackGoldLayout';
import CorporateRibbonLayout from './layouts/CorporateRibbonLayout';
import ModernGeometricLayout from './layouts/ModernGeometricLayout';
import CardRecreationLayout from './layouts/CardRecreationLayout';
import FallbackLayout from './layouts/FallbackLayout';

export default function CardSurface({
  side = 'front',
  isPreview = false,
  cardBackground,
  activeGuide,
  cornerStyle,
  frontArtwork,
  backArtwork,
  isCustomMode,
  renderAdjustableArtwork,
  fields,
  renderCanvasElement,
  layout,
  activeColor,
  activeTemplate,
  uploadedLogo,
  renderAdjustableLogo,
  setActiveTool,
  setActiveField,
  backOption,
  initialTemplate,
  cardGraphics,
  renderGraphicElement,
  renderGraphicIconOrShape,
  backsideType,
  fileInputRef,
}) {
  return (
      <>
        {/* Background Pattern Overlay */}
        {cardBackground[side]?.pattern && cardBackground[side].pattern !== 'none' && (
          <div
            className={`vp-card-bg-pattern pattern-${cardBackground[side].pattern}`}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: cardBackground[side].patternOpacity ?? 0.15,
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        )}

        {/* Active Guide Overlays (Editor mode only) */}
        {!isPreview && activeGuide === 'bleed' && (
          <div
            className="vp-bleed-guide-overlay"
            style={{ borderRadius: cornerStyle === 'rounded' ? '16px' : '0px' }}
          >
            <div className="vp-guide-floating-banner bleed">
              <span>✂️ <strong>Bleed Area (+1mm):</strong> Extend background colors and full-bleed graphics to this 1mm blue cut boundary</span>
            </div>
            <span className="vp-bleed-tag top">1mm Cut / Bleed Line</span>
            <span className="vp-bleed-tag bottom">1mm Cut / Bleed Line</span>
          </div>
        )}

        {!isPreview && activeGuide === 'safety' && (
          <div
            className="vp-trim-risk-perimeter"
            style={{ borderRadius: cornerStyle === 'rounded' ? '16px' : '0px' }}
          />
        )}

        {!isPreview && (
          <div
            className={`vp-safety-guide-inner ${activeGuide === 'safety' ? 'active-highlight' : ''}`}
            style={{
              borderRadius: cornerStyle === 'rounded' ? '14px' : '0px',
            }}
          >
            {activeGuide === 'safety' && (
              <div className="vp-guide-floating-banner safety">
                <span>🛡️ <strong>Safety Area (1mm Inset):</strong> Keep all critical text, contact details & logos inside this green boundary</span>
              </div>
            )}
          </div>
        )}

        {/* FRONT SIDE VIEW */}
        {side === 'front' ? (
          (frontArtwork && (isCustomMode || layout === 'image_template' || activeTemplate?.background_image || !['executive_swoosh', 'corporate_split_swoosh', 'classic_photo', 'luxury_black_gold', 'corporate_red_ribbon', 'modern_geometric', 'medical_care', 'card_recreation', 'exact_recreation', 'corporate_split_navy', 'corporate_navy_qr'].includes(layout))) ? (
            <div
              className="vp-uploaded-design-canvas"
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: cornerStyle === 'rounded' ? '16px' : '0px',
              }}
              onClick={() => {
                if (!isPreview) {
                  setActiveField('uploaded_artwork_front');
                  setActiveTool('uploads');
                }
              }}
            >
              {renderAdjustableArtwork('front', isPreview)}
              {Object.keys(fields).filter((k) => !k.endsWith('_back')).map((k) =>
                renderCanvasElement(k, k.startsWith('custom_') ? 'Custom Text' : (fields[k] || ''), {}, isPreview)
              )}
            </div>
          ) : (
            <div className="vp-canvas-content">
              {/* LAYOUT: MATCHED SMART CARD RECREATION */}
              {(layout === 'card_recreation' || layout === 'exact_recreation' || layout === 'corporate_split_navy' || layout === 'corporate_navy_qr') && (
                <CardRecreationLayout
                  activeColor={activeColor}
                  activeTemplate={activeTemplate}
                  isPreview={isPreview}
                  renderCanvasElement={renderCanvasElement}
                  uploadedLogo={uploadedLogo}
                  renderAdjustableLogo={renderAdjustableLogo}
                  setActiveTool={setActiveTool}
                />
              )}

              {/* LAYOUT 0: EXECUTIVE SPLIT & ACCENT SWOOSH */}
              {(layout === 'executive_swoosh' || layout === 'corporate_split_swoosh') && (
                <ExecutiveSwooshLayout
                  activeColor={activeColor}
                  activeTemplate={activeTemplate}
                  isPreview={isPreview}
                  renderCanvasElement={renderCanvasElement}
                  uploadedLogo={uploadedLogo}
                  renderAdjustableLogo={renderAdjustableLogo}
                  setActiveTool={setActiveTool}
                />
              )}

              {/* LAYOUT 1: CLASSIC PHOTO */}
              {layout === 'classic_photo' && (
                <ClassicPhotoLayout
                  activeColor={activeColor}
                  isPreview={isPreview}
                  renderCanvasElement={renderCanvasElement}
                  renderAdjustableLogo={renderAdjustableLogo}
                />
              )}

              {/* LAYOUT 2: LUXURY BLACK & GOLD */}
              {layout === 'luxury_black_gold' && (
                <LuxuryBlackGoldLayout
                  isPreview={isPreview}
                  renderCanvasElement={renderCanvasElement}
                />
              )}

              {/* LAYOUT 3: CORPORATE DYNAMIC RED RIBBON */}
              {layout === 'corporate_red_ribbon' && (
                <CorporateRibbonLayout
                  activeColor={activeColor}
                  isPreview={isPreview}
                  renderCanvasElement={renderCanvasElement}
                />
              )}

              {/* LAYOUT 4: ABSTRACT GEOMETRIC PRISMS */}
              {layout === 'modern_geometric' && (
                <ModernGeometricLayout
                  activeColor={activeColor}
                  isPreview={isPreview}
                  renderCanvasElement={renderCanvasElement}
                />
              )}

              {/* FALLBACK LAYOUT */}
              {!['classic_photo', 'luxury_black_gold', 'corporate_red_ribbon', 'modern_geometric', 'executive_swoosh', 'corporate_split_swoosh', 'card_recreation', 'exact_recreation', 'corporate_split_navy', 'corporate_navy_qr'].includes(layout) && (
                <FallbackLayout
                  activeColor={activeColor}
                  isPreview={isPreview}
                  renderCanvasElement={renderCanvasElement}
                />
              )}
            </div>
          )
        ) : (
          /* BACK SIDE VIEW */
          backArtwork ? (
            <div
              className="vp-uploaded-design-canvas"
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: cornerStyle === 'rounded' ? '16px' : '0px',
              }}
              onClick={() => {
                if (!isPreview) {
                  setActiveField('uploaded_artwork_back');
                  setActiveTool('uploads');
                }
              }}
            >
              {renderAdjustableArtwork('back', isPreview)}
              {Object.keys(fields).filter((k) => k.startsWith('custom_')).map((k) =>
                renderCanvasElement(k, 'Custom Text', {}, isPreview)
              )}
            </div>
          ) : isCustomMode ? (
            isPreview ? (
              <div
                style={{
                  height: '100%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  fontSize: '13px',
                }}
              >
                Blank Backside
              </div>
            ) : (
              <div
                style={{
                  height: '100%',
                  background: '#ffffff',
                  color: '#64748b',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: '10px',
                  padding: '20px',
                  boxSizing: 'border-box',
                  borderRadius: cornerStyle === 'rounded' ? '16px' : '0px',
                }}
              >
                {isPreview ? (
                  <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', opacity: 0.7 }}>
                    Blank Card Back
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#334155' }}>
                      Back of card is blank
                    </div>
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, maxWidth: '280px' }}>
                      Single-sided printing selected. You can upload a back design or proceed with a clean blank back.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTool('uploads');
                        fileInputRef.current?.click();
                      }}
                      style={{
                        marginTop: '6px',
                        fontSize: '13px',
                        color: '#0284c7',
                        background: '#f0f9ff',
                        border: '1px solid #bae6fd',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      + Upload Back Design
                    </button>
                  </>
                )}
              </div>
            )
          ) : (
            <div
              style={{
                height: '100%',
                background: cardBackground.back.value !== '#ffffff' ? cardBackground.back.value : (backOption === 'blank' ? '#ffffff' : activeColor),
                color: (cardBackground.back.value !== '#ffffff' && !cardBackground.back.value.includes('#ffffff') && !cardBackground.back.value.includes('f8fafc')) ? '#ffffff' : (backOption === 'blank' ? '#64748b' : '#ffffff'),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              {Boolean(fields.companyName && fields.companyName.trim()) ? (
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                  {fields.companyName}
                </div>
              ) : (!isPreview ? (
                <div style={{ fontSize: '1.5rem', fontWeight: 800, opacity: 0.38, fontStyle: 'italic' }}>
                  {initialTemplate.sample_company || 'Company Name'}
                </div>
              ) : null)}

              {Boolean(fields.web && fields.web.trim()) ? (
                <div style={{ fontSize: '0.9rem', opacity: 0.85, marginTop: '4px' }}>
                  {fields.web}
                </div>
              ) : (!isPreview ? (
                <div style={{ fontSize: '0.9rem', opacity: 0.38, marginTop: '4px', fontStyle: 'italic' }}>
                  {initialTemplate.sample_web || 'www.company.com'}
                </div>
              ) : null)}
              {!isPreview && (
                <span style={{ fontSize: '0.72rem', marginTop: '14px', background: 'rgba(0,0,0,0.06)', padding: '4px 10px', borderRadius: '4px' }}>
                  Card Backside (Printed in 300 DPI CMYK)
                </span>
              )}
            </div>
          )
        )}

        {/* User-added Graphics & Shapes (Icons, Shapes, QR Codes) on This Side */}
        {isPreview ? (
          (cardGraphics[side] || []).map((item) => (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${item.x || 0}px, ${item.y || 0}px) rotate(${item.rotation || 0}deg)`,
                zIndex: 32,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              {renderGraphicIconOrShape(item)}
            </div>
          ))
        ) : (
          (cardGraphics[side] || []).map(renderGraphicElement)
        )}
      </>
    );
}

