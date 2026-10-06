import React from 'react';
import { Shapes, Search, QrCode, SlidersHorizontal, Trash2, RotateCcw, RotateCw, X } from 'lucide-react';
import { VISITING_CARD_GRAPHICS } from '../../../constants/studioConstants';

export default function GraphicsPanel({
  graphicsCategory,
  setGraphicsCategory,
  graphicsSearch,
  setGraphicsSearch,
  activeSide,
  cardGraphics,
  setCardGraphics,
  handleAddGraphic,
  alignGraphic,
  updateGraphic,
  removeGraphic,
  qrInput,
  setQrInput,
  qrType,
  setQrType,
  activeField,
  setActiveField,
  renderGraphicPreview,
  activeColor = '#0056b3',
}) {
  return (
            <>
              <div className="vp-studio-panel-header">
                <h3>Graphics & Icons</h3>
              </div>

              <div className="vp-studio-panel-body" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                {/* Search Bar */}
                <div className="vp-search-input-wrap">
                  <Search size={14} className="vp-search-icon-inside" />
                  <input
                    type="text"
                    placeholder="Search card icons & shapes..."
                    value={graphicsSearch}
                    onChange={(e) => setGraphicsSearch(e.target.value)}
                  />
                  {graphicsSearch && (
                    <button
                      type="button"
                      onClick={() => setGraphicsSearch('')}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="vp-filter-tabs-row">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'contact', label: 'Contact & Comms' },
                    { id: 'social', label: 'Social Media' },
                    { id: 'business', label: 'Business & Trust' },
                    { id: 'shapes', label: 'Shapes & Dividers' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`vp-filter-tab-pill ${graphicsCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setGraphicsCategory(cat.id)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Active Selected Graphic Inspector */}
                {(() => {
                  const sel = (cardGraphics[activeSide] || []).find((g) => g.id === activeField);
                  if (!sel) return null;
                  return (
                    <div
                      style={{
                        background: '#f8fafc',
                        border: '1.5px solid #0099ff',
                        borderRadius: '8px',
                        padding: '10px',
                        marginBottom: '14px',
                        boxShadow: '0 2px 8px rgba(0, 153, 255, 0.08)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>
                            Editing: {sel.label || sel.name}
                          </span>
                          <span style={{ fontSize: '9px', fontWeight: 600, color: '#0284c7', background: '#e0f2fe', padding: '1px 6px', borderRadius: '4px', textTransform: 'capitalize' }}>
                            {sel.type}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeGraphic(sel.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>

                      {/* Color Picker & Quick Swatches */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Color:</label>
                        <input
                          type="color"
                          value={sel.color || activeColor}
                          onChange={(e) => updateGraphic(sel.id, { color: e.target.value })}
                          style={{ width: '28px', height: '26px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', padding: 0 }}
                        />
                        <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                          {['#000000', '#ffffff', '#0099ff', '#16a34a', '#dc2626', '#d4af37'].map((c) => (
                            <span
                              key={c}
                              onClick={() => updateGraphic(sel.id, { color: c })}
                              style={{ width: '16px', height: '16px', borderRadius: '50%', background: c, border: '1px solid #cbd5e1', cursor: 'pointer', display: 'inline-block' }}
                              title={`Set ${c}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Size Slider for Icons, Shapes & QR Codes */}
                      {sel.type !== 'divider' && (() => {
                        const selCurSize = typeof sel.size === 'number'
                          ? sel.size
                          : (typeof sel.size === 'object' ? (sel.size.width || sel.size.size || 24) : 24);
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600, minWidth: '70px' }}>
                              Size: {selCurSize}px
                            </label>
                            <input
                              type="range"
                              min="10"
                              max="180"
                              value={selCurSize}
                              onChange={(e) => updateGraphic(sel.id, { size: parseInt(e.target.value, 10) })}
                              style={{ flex: 1 }}
                            />
                          </div>
                        );
                      })()}

                      {/* Adjustable Width & Thickness Slider for Dividers */}
                      {sel.type === 'divider' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600, minWidth: '85px' }}>
                              Width: {typeof sel.size === 'object' ? (sel.size.width || 180) : sel.size}px
                            </label>
                            <input
                              type="range"
                              min="30"
                              max="540"
                              value={typeof sel.size === 'object' ? (sel.size.width || 180) : sel.size}
                              onChange={(e) =>
                                updateGraphic(sel.id, {
                                  size: {
                                    ...(typeof sel.size === 'object' ? sel.size : {}),
                                    width: parseInt(e.target.value, 10),
                                    height: typeof sel.size === 'object' ? (sel.size.height || 2) : 2,
                                  },
                                })
                              }
                              style={{ flex: 1 }}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600, minWidth: '85px' }}>
                              Thickness: {typeof sel.size === 'object' ? (sel.size.height || 2) : 2}px
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="16"
                              value={typeof sel.size === 'object' ? (sel.size.height || 2) : 2}
                              onChange={(e) =>
                                updateGraphic(sel.id, {
                                  size: {
                                    ...(typeof sel.size === 'object' ? sel.size : {}),
                                    height: parseInt(e.target.value, 10),
                                    width: typeof sel.size === 'object' ? (sel.size.width || 180) : 180,
                                  },
                                })
                              }
                              style={{ flex: 1 }}
                            />
                          </div>
                        </div>
                      )}

                      {/* 3x3 Card Alignment Grid */}
                      <div style={{ marginTop: '8px' }}>
                        <label style={{ fontSize: '10px', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                          CARD POSITION (3×3 GRID)
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', maxWidth: '140px' }}>
                          {[
                            { h: 'left', v: 'top', label: '↖ Top L' },
                            { h: 'center', v: 'top', label: '↑ Top' },
                            { h: 'right', v: 'top', label: '↗ Top R' },
                            { h: 'left', v: 'center', label: '← Left' },
                            { h: 'center', v: 'center', label: '• Center' },
                            { h: 'right', v: 'center', label: '→ Right' },
                            { h: 'left', v: 'bottom', label: '↙ Bot L' },
                            { h: 'center', v: 'bottom', label: '↓ Bot' },
                            { h: 'right', v: 'bottom', label: '↘ Bot R' },
                          ].map((pos, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="vp-align-btn"
                              style={{ padding: '3px 2px', fontSize: '9px', fontWeight: 700 }}
                              onClick={() => alignGraphic(sel.id, pos.h, pos.v)}
                              title={`Align ${pos.v} ${pos.h}`}
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Graphics Catalog Grid */}
                <div className="vp-graphics-grid">
                  {VISITING_CARD_GRAPHICS.filter((item) => {
                    const matchesCat = graphicsCategory === 'all' || item.category === graphicsCategory;
                    const matchesSearch = !graphicsSearch ||
                      item.label.toLowerCase().includes(graphicsSearch.toLowerCase()) ||
                      item.name.toLowerCase().includes(graphicsSearch.toLowerCase());
                    return matchesCat && matchesSearch;
                  }).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="vp-graphic-card-btn"
                      onClick={() => handleAddGraphic(item)}
                      title={`Click to add ${item.label} to ${activeSide} side`}
                    >
                      <div style={{ height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {renderGraphicPreview(item)}
                      </div>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
  );
}
