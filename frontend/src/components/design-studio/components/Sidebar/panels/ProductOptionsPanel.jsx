import React from 'react';
import { Sliders, Check, ShieldCheck } from 'lucide-react';

export default function ProductOptionsPanel({
  paperStock,
  setPaperStock,
  finishType,
  setFinishType,
  cornerStyle,
  setCornerStyle,
  orientation,
  setOrientation,
  cardDimension,
  setCardDimension,
  backsideType,
  setBacksideType,
  currentCard,
  activeColor,
  setBackOption = () => {},
}) {
  return (
            <>
              <div className="vp-studio-panel-header">
                <h3>Product Options</h3>
              </div>
              <div className="vp-studio-panel-body" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                {/* 1. Paper Stock (GSM) */}
                <div className="vp-options-group">
                  <div className="vp-options-label">
                    <span>Paper Stock</span>
                    <span className="vp-options-sub">{paperStock}</span>
                  </div>
                  <div className="vp-options-pills-row">
                    {[
                      { val: '300 GSM', title: '300 GSM', desc: 'Standard' },
                      { val: '350 GSM', title: '350 GSM', desc: 'Premium Board' },
                      { val: '400 GSM', title: '400 GSM', desc: 'Ultra-Thick (+₹40)' },
                    ].map((opt) => (
                      <div
                        key={opt.val}
                        className={`vp-option-pill ${paperStock === opt.val ? 'active' : ''}`}
                        onClick={() => setPaperStock(opt.val)}
                      >
                        <div className="vp-option-pill-title">{opt.title}</div>
                        <div className="vp-option-pill-desc">{opt.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Finish Type */}
                <div className="vp-options-group">
                  <div className="vp-options-label">
                    <span>Finish Type</span>
                    <span className="vp-options-sub">{finishType}</span>
                  </div>
                  <div className="vp-options-pills-row">
                    {[
                      { val: 'Matte', title: 'Matte', desc: 'Smooth, Classic' },
                      { val: 'Glossy', title: 'Glossy', desc: 'Vibrant Shine' },
                      { val: 'Velvet', title: 'Velvet', desc: 'Soft-Touch (+₹50)' },
                    ].map((opt) => (
                      <div
                        key={opt.val}
                        className={`vp-option-pill ${finishType === opt.val ? 'active' : ''}`}
                        onClick={() => setFinishType(opt.val)}
                      >
                        <div className="vp-option-pill-title">{opt.title}</div>
                        <div className="vp-option-pill-desc">{opt.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Corner Style */}
                <div className="vp-options-group">
                  <div className="vp-options-label">
                    <span>Corner Style</span>
                    <span className="vp-options-sub">{cornerStyle === 'rounded' ? 'Rounded Die-Cut' : 'Standard 90°'}</span>
                  </div>
                  <div className="vp-options-pills-row">
                    <div
                      className={`vp-option-pill ${cornerStyle === 'standard' ? 'active' : ''}`}
                      onClick={() => setCornerStyle('standard')}
                    >
                      <div className="vp-option-pill-title">Standard</div>
                      <div className="vp-option-pill-desc">90° Sharp Edges</div>
                    </div>
                    <div
                      className={`vp-option-pill ${cornerStyle === 'rounded' ? 'active' : ''}`}
                      onClick={() => setCornerStyle('rounded')}
                    >
                      <div className="vp-option-pill-title">Rounded</div>
                      <div className="vp-option-pill-desc">1/4" Die-Cut (+₹30)</div>
                    </div>
                  </div>
                </div>

                {/* 4. Product Orientation */}
                <div className="vp-options-group">
                  <div className="vp-options-label">
                    <span>Product Orientation</span>
                    <span className="vp-options-sub" style={{ textTransform: 'capitalize' }}>{orientation}</span>
                  </div>
                  <div className="vp-options-pills-row">
                    <div
                      className={`vp-option-pill ${orientation === 'horizontal' ? 'active' : ''}`}
                      onClick={() => setOrientation('horizontal')}
                    >
                      <div className="vp-option-pill-title">Horizontal</div>
                      <div className="vp-option-pill-desc">8.9 x 5.1 cm</div>
                    </div>
                    <div
                      className={`vp-option-pill ${orientation === 'vertical' ? 'active' : ''}`}
                      onClick={() => setOrientation('vertical')}
                    >
                      <div className="vp-option-pill-title">Vertical</div>
                      <div className="vp-option-pill-desc">5.1 x 8.9 cm</div>
                    </div>
                  </div>
                </div>

                {/* 4. Dimensions */}
                <div className="vp-options-group">
                  <div className="vp-options-label">
                    <span>Dimensions</span>
                  </div>
                  <select
                    className="vp-options-select"
                    value={cardDimension}
                    onChange={(e) => setCardDimension(e.target.value)}
                  >
                    <option value="8.9 cm x 5.1 cm">Standard: 8.9 × 5.1 cm (89 × 51 mm / 3.5" × 2")</option>
                    <option value="6.5 cm x 6.5 cm">Square: 6.5 × 6.5 cm (65 × 65 mm)</option>
                    <option value="8.5 cm x 4.0 cm">Slim Line: 8.5 × 4.0 cm (85 × 40 mm)</option>
                  </select>
                </div>

                {/* 5. Backside Printing */}
                <div className="vp-options-group">
                  <div className="vp-options-label">
                    <span>Backside Printing</span>
                  </div>
                  <div className="vp-options-pills-row">
                    <div
                      className={`vp-option-pill ${backsideType === 'blank' ? 'active' : ''}`}
                      onClick={() => {
                        setBacksideType('blank');
                        setBackOption('blank');
                      }}
                    >
                      <div className="vp-option-pill-title">Blank</div>
                      <div className="vp-option-pill-desc">Included Free</div>
                    </div>
                    <div
                      className={`vp-option-pill ${backsideType === 'color' ? 'active' : ''}`}
                      onClick={() => {
                        setBacksideType('color');
                        setBackOption('color');
                      }}
                    >
                      <div className="vp-option-pill-title">Full Color</div>
                      <div className="vp-option-pill-desc">+₹80 / 100 pcs</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
  );
}
