import React from 'react';
import { Palette } from 'lucide-react';
import { BG_SOLID_PRESETS, BG_GRADIENT_PRESETS, BG_PATTERNS } from '../../../constants/studioConstants';

export default function BackgroundPanel({
  activeSide,
  setActiveSide,
  cardBackground,
  setCardBackground,
}) {
  return (
            <>
              <div className="vp-studio-panel-header">
                <h3>Card Background</h3>
                <span style={{ fontSize: '11px', color: '#0099ff', fontWeight: 600, textTransform: 'capitalize' }}>
                  {activeSide} Side
                </span>
              </div>

              <div className="vp-studio-panel-body" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                {/* Side Selector Toggle */}
                <div className="vp-options-group">
                  <div className="vp-options-label">
                    <span>Apply Background To</span>
                  </div>
                  <div className="vp-options-pills-row">
                    <div
                      className={`vp-option-pill ${activeSide === 'front' ? 'active' : ''}`}
                      onClick={() => setActiveSide('front')}
                    >
                      <div className="vp-option-pill-title">Front Side</div>
                      <div className="vp-option-pill-desc">Primary Face</div>
                    </div>
                    <div
                      className={`vp-option-pill ${activeSide === 'back' ? 'active' : ''}`}
                      onClick={() => setActiveSide('back')}
                    >
                      <div className="vp-option-pill-title">Back Side</div>
                      <div className="vp-option-pill-desc">Reverse Face</div>
                    </div>
                  </div>
                </div>

                {/* Solid Corporate Swatches */}
                <div className="vp-options-group">
                  <div className="vp-options-label">
                    <span>Solid Colors</span>
                  </div>
                  <div className="vp-bg-swatches-grid">
                    {BG_SOLID_PRESETS.map((swatch, idx) => (
                      <div
                        key={idx}
                        className={`vp-bg-swatch-card ${cardBackground[activeSide]?.value === swatch.value ? 'active' : ''}`}
                        style={{ background: swatch.value }}
                        onClick={() => {
                          setCardBackground((prev) => ({
                            ...prev,
                            [activeSide]: { ...prev[activeSide], type: 'solid', value: swatch.value },
                          }));
                        }}
                        title={swatch.name}
                      />
                    ))}
                  </div>

                  {/* Custom Hex Color Picker */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>Custom:</label>
                    <input
                      type="color"
                      value={cardBackground[activeSide]?.value?.startsWith('#') ? cardBackground[activeSide].value : '#ffffff'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCardBackground((prev) => ({
                          ...prev,
                          [activeSide]: { ...prev[activeSide], type: 'solid', value: val },
                        }));
                      }}
                      style={{ width: '32px', height: '26px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', padding: 0 }}
                    />
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b' }}>
                      {cardBackground[activeSide]?.value?.startsWith('#') ? cardBackground[activeSide].value : 'Gradient'}
                    </span>
                    <button
                      type="button"
                      className="vp-align-btn"
                      style={{ marginLeft: 'auto', fontSize: '11px' }}
                      onClick={() => {
                        setCardBackground((prev) => ({
                          ...prev,
                          [activeSide]: { type: 'solid', value: '#ffffff', pattern: 'none', patternOpacity: 0.15 },
                        }));
                      }}
                    >
                      Reset White
                    </button>
                  </div>
                </div>

                {/* Modern Luxury Gradients */}
                <div className="vp-options-group">
                  <div className="vp-options-label">
                    <span>Executive Gradients</span>
                  </div>
                  <div className="vp-bg-swatches-grid">
                    {BG_GRADIENT_PRESETS.map((grad, idx) => (
                      <div
                        key={idx}
                        className={`vp-bg-swatch-card ${cardBackground[activeSide]?.value === grad.value ? 'active' : ''}`}
                        style={{ background: grad.value }}
                        onClick={() => {
                          setCardBackground((prev) => ({
                            ...prev,
                            [activeSide]: { ...prev[activeSide], type: 'gradient', value: grad.value },
                          }));
                        }}
                        title={grad.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Subtle Texture Patterns */}
                <div className="vp-options-group">
                  <div className="vp-options-label">
                    <span>Subtle Texture Patterns</span>
                    <span className="vp-options-sub" style={{ textTransform: 'capitalize' }}>
                      {cardBackground[activeSide]?.pattern || 'none'}
                    </span>
                  </div>
                  <div className="vp-patterns-grid">
                    {BG_PATTERNS.map((pat) => (
                      <div
                        key={pat.id}
                        className={`vp-pattern-card ${(cardBackground[activeSide]?.pattern || 'none') === pat.id ? 'active' : ''}`}
                        onClick={() => {
                          setCardBackground((prev) => ({
                            ...prev,
                            [activeSide]: { ...prev[activeSide], pattern: pat.id },
                          }));
                        }}
                      >
                        <div className="vp-pattern-title">{pat.title}</div>
                        <div className="vp-pattern-desc">{pat.desc}</div>
                      </div>
                    ))}
                  </div>

                  {/* Pattern Opacity Slider */}
                  {cardBackground[activeSide]?.pattern && cardBackground[activeSide].pattern !== 'none' && (
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Pattern Opacity:</label>
                      <input
                        type="range"
                        min="0.05"
                        max="0.45"
                        step="0.05"
                        value={cardBackground[activeSide]?.patternOpacity ?? 0.15}
                        onChange={(e) => {
                          const op = parseFloat(e.target.value);
                          setCardBackground((prev) => ({
                            ...prev,
                            [activeSide]: { ...prev[activeSide], patternOpacity: op },
                          }));
                        }}
                        style={{ flex: 1 }}
                      />
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {Math.round((cardBackground[activeSide]?.patternOpacity ?? 0.15) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
          </>
  );
}
