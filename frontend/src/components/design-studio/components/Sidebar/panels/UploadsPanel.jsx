import React from 'react';
import { Check, Crosshair, Image, ImageIcon, Lock, RotateCcw, RotateCw, Sliders, SlidersHorizontal, Sparkles, Trash2, Unlock, UploadCloud } from 'lucide-react';

export default function UploadsPanel({
  activeSide,
  setActiveSide = () => {},
  frontArtwork,
  setFrontArtwork = () => {},
  backArtwork,
  setBackArtwork = () => {},
  frontArtworkTransform,
  setFrontArtworkTransform,
  backArtworkTransform,
  setBackArtworkTransform,
  fileInputRef,
  uploadedLogo,
  setUploadedLogo = () => {},
  logoTransform,
  setLogoTransform,
  logoInputRef,
  handleLogoFileChange,
  setIsLogoModalOpen,
  isCustomMode,
  handleArtworkAlign = () => {},
}) {
  return (
            <>
              <div className="vp-studio-panel-header">
                <h3>{isCustomMode ? 'Uploaded Artwork' : 'Logo & Photos'}</h3>
              </div>
              <div className="vp-studio-panel-body">
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (isCustomMode) {
                          if (activeSide === 'front') {
                            setFrontArtwork(ev.target.result);
                          } else {
                            setBackArtwork(ev.target.result);
                          }
                        } else {
                          setUploadedLogo(ev.target.result);
                        }
                      };
                      reader.readAsDataURL(f);
                    }
                  }}
                />

                {isCustomMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                          {activeSide === 'front' ? 'Front Side Artwork' : 'Back Side Artwork'}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
                          {(activeSide === 'front' ? frontArtwork : backArtwork) ? '✓ Uploaded' : 'Blank'}
                        </span>
                      </div>

                      {(activeSide === 'front' ? frontArtwork : backArtwork) ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                          <img
                            src={activeSide === 'front' ? frontArtwork : backArtwork}
                            alt="Uploaded artwork"
                            style={{
                              width: '100%',
                              maxHeight: '130px',
                              objectFit: 'contain',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                            }}
                          />
                          <button
                            type="button"
                            className="vp-studio-add-text-btn"
                            onClick={() => fileInputRef.current?.click()}
                            style={{ width: '100%', justifyContent: 'center' }}
                          >
                            <UploadCloud size={16} />
                            <span>Replace {activeSide === 'front' ? 'Front' : 'Back'} Image</span>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px 0' }}>
                            No artwork uploaded for the {activeSide} side yet.
                          </p>
                          <button
                            type="button"
                            className="vp-studio-add-text-btn"
                            onClick={() => fileInputRef.current?.click()}
                            style={{ width: '100%', justifyContent: 'center' }}
                          >
                            <UploadCloud size={16} />
                            <span>Upload {activeSide === 'front' ? 'Front' : 'Back'} Artwork</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                        Switch Side to Edit:
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <button
                          type="button"
                          className={`vp-option-pill ${activeSide === 'front' ? 'active' : ''}`}
                          onClick={() => setActiveSide('front')}
                          style={{ padding: '8px', textAlign: 'center', cursor: 'pointer' }}
                        >
                          <div className="vp-option-pill-title" style={{ fontSize: '12px' }}>Front Side</div>
                        </button>
                        <button
                          type="button"
                          className={`vp-option-pill ${activeSide === 'back' ? 'active' : ''}`}
                          onClick={() => setActiveSide('back')}
                          style={{ padding: '8px', textAlign: 'center', cursor: 'pointer' }}
                        >
                          <div className="vp-option-pill-title" style={{ fontSize: '12px' }}>Back Side</div>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Artwork / Logo Adjustment Controls */}
                    {(activeSide === 'front' ? frontArtwork : backArtwork) && (
                      <div className="vp-adjust-panel-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                            Adjust {activeSide === 'front' ? 'Front' : 'Back'} Logo / Artwork
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#0284c7', background: '#e0f2fe', padding: '1px 6px', borderRadius: '4px' }}>
                            Interactive
                          </span>
                        </div>

                        {/* 1. Size / Scale Slider */}
                        <div className="vp-adjust-row">
                          <div className="vp-adjust-label-row">
                            <span>Logo Scale / Size</span>
                            <span className="vp-adjust-val">
                              {Math.round(((activeSide === 'front' ? frontArtworkTransform : backArtworkTransform).scale || 1) * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="20"
                            max="250"
                            step="5"
                            value={Math.round(((activeSide === 'front' ? frontArtworkTransform : backArtworkTransform).scale || 1) * 100)}
                            onChange={(e) => {
                              const newScale = Number(e.target.value) / 100;
                              const setter = activeSide === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                              setter((prev) => ({ ...prev, scale: newScale }));
                            }}
                            className="vp-adjust-slider"
                          />
                          <div className="vp-adjust-presets-row">
                            {[
                              { label: '50%', scale: 0.5 },
                              { label: '75%', scale: 0.75 },
                              { label: '100%', scale: 1.0 },
                              { label: '125%', scale: 1.25 },
                              { label: 'Fit Safe', scale: 0.9, fitMode: 'contain' },
                              { label: 'Fill Bleed', scale: 1.15, fitMode: 'cover' },
                            ].map((p) => (
                              <button
                                key={p.label}
                                type="button"
                                className="vp-adjust-preset-btn"
                                onClick={() => {
                                  const setter = activeSide === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                                  setter((prev) => ({
                                    ...prev,
                                    scale: p.scale,
                                    fitMode: p.fitMode || prev.fitMode,
                                  }));
                                }}
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 2. Position & Alignment */}
                        <div className="vp-adjust-row">
                          <div className="vp-adjust-label-row">
                            <span>Position & Alignment</span>
                          </div>
                          <button
                            type="button"
                            className="vp-align-btn"
                            style={{ width: '100%', background: '#f0f9ff', borderColor: '#bae6fd', color: '#0284c7', fontWeight: 700 }}
                            onClick={() => {
                              const setter = activeSide === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                              setter((prev) => ({ ...prev, x: 0, y: 0 }));
                            }}
                          >
                            <Crosshair size={13} />
                            <span>Center on Card</span>
                          </button>
                          <div className="vp-align-grid">
                            <button
                              type="button"
                              className="vp-align-btn"
                              title="Align Top-Left"
                              onClick={() => handleArtworkAlign(activeSide, 'left', 'top')}
                            >
                              ↖ Top-Left
                            </button>
                            <button
                              type="button"
                              className="vp-align-btn"
                              title="Align Top-Center"
                              onClick={() => handleArtworkAlign(activeSide, 'center', 'top')}
                            >
                              ↑ Top
                            </button>
                            <button
                              type="button"
                              className="vp-align-btn"
                              title="Align Top-Right"
                              onClick={() => handleArtworkAlign(activeSide, 'right', 'top')}
                            >
                              ↗ Top-Right
                            </button>
                            <button
                              type="button"
                              className="vp-align-btn"
                              title="Align Bottom-Left"
                              onClick={() => handleArtworkAlign(activeSide, 'left', 'bottom')}
                            >
                              ↙ Bottom-Left
                            </button>
                            <button
                              type="button"
                              className="vp-align-btn"
                              title="Align Bottom-Center"
                              onClick={() => handleArtworkAlign(activeSide, 'center', 'bottom')}
                            >
                              ↓ Bottom
                            </button>
                            <button
                              type="button"
                              className="vp-align-btn"
                              title="Align Bottom-Right"
                              onClick={() => handleArtworkAlign(activeSide, 'right', 'bottom')}
                            >
                              ↘ Bottom-Right
                            </button>
                          </div>
                        </div>

                        {/* 3. Rotation */}
                        <div className="vp-adjust-row">
                          <div className="vp-adjust-label-row">
                            <span>Rotation</span>
                            <span className="vp-adjust-val">
                              {((activeSide === 'front' ? frontArtworkTransform : backArtworkTransform).rotation || 0)}°
                            </span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                            {[0, 90, 180, 270].map((deg) => (
                              <button
                                key={deg}
                                type="button"
                                className={`vp-adjust-preset-btn ${((activeSide === 'front' ? frontArtworkTransform : backArtworkTransform).rotation || 0) === deg ? 'active' : ''}`}
                                onClick={() => {
                                  const setter = activeSide === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                                  setter((prev) => ({ ...prev, rotation: deg }));
                                }}
                              >
                                {deg}°
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 4. Fit Mode */}
                        <div className="vp-adjust-row">
                          <div className="vp-adjust-label-row">
                            <span>Display Mode</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                            <button
                              type="button"
                              className={`vp-adjust-preset-btn ${(activeSide === 'front' ? frontArtworkTransform : backArtworkTransform).fitMode === 'contain' ? 'active' : ''}`}
                              onClick={() => {
                                const setter = activeSide === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                                setter((prev) => ({ ...prev, fitMode: 'contain' }));
                              }}
                            >
                              Fit Shape (Safe)
                            </button>
                            <button
                              type="button"
                              className={`vp-adjust-preset-btn ${(activeSide === 'front' ? frontArtworkTransform : backArtworkTransform).fitMode === 'cover' ? 'active' : ''}`}
                              onClick={() => {
                                const setter = activeSide === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                                setter((prev) => ({ ...prev, fitMode: 'cover' }));
                              }}
                            >
                              Fill Bleed
                            </button>
                          </div>
                        </div>

                        {/* 5. Opacity */}
                        <div className="vp-adjust-row">
                          <div className="vp-adjust-label-row">
                            <span>Opacity / Transparency</span>
                            <span className="vp-adjust-val">
                              {Math.round(((activeSide === 'front' ? frontArtworkTransform : backArtworkTransform).opacity !== undefined ? (activeSide === 'front' ? frontArtworkTransform : backArtworkTransform).opacity : 1) * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="5"
                            value={Math.round(((activeSide === 'front' ? frontArtworkTransform : backArtworkTransform).opacity !== undefined ? (activeSide === 'front' ? frontArtworkTransform : backArtworkTransform).opacity : 1) * 100)}
                            onChange={(e) => {
                              const newOp = Number(e.target.value) / 100;
                              const setter = activeSide === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                              setter((prev) => ({ ...prev, opacity: newOp }));
                            }}
                            className="vp-adjust-slider"
                          />
                        </div>

                        {/* 6. Reset & Lock */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '4px' }}>
                          <button
                            type="button"
                            className="vp-align-btn"
                            onClick={() => {
                              const setter = activeSide === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                              setter((prev) => ({ ...prev, locked: !prev.locked }));
                            }}
                          >
                            {(activeSide === 'front' ? frontArtworkTransform : backArtworkTransform).locked ? <Lock size={12} /> : <Unlock size={12} />}
                            <span>{(activeSide === 'front' ? frontArtworkTransform : backArtworkTransform).locked ? 'Locked' : 'Lock'}</span>
                          </button>
                          <button
                            type="button"
                            className="vp-align-btn"
                            onClick={() => {
                              const setter = activeSide === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                              setter(() => ({
                                x: 0,
                                y: 0,
                                scale: 0.95,
                                rotation: 0,
                                fitMode: 'contain',
                                opacity: 1,
                                locked: false,
                              }));
                            }}
                          >
                            <RotateCcw size={12} />
                            <span>Reset All</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      className="vp-studio-add-text-btn"
                      onClick={() => setIsLogoModalOpen(true)}
                    >
                      <UploadCloud size={16} />
                      <span>{uploadedLogo ? 'Manage / Change Logo' : 'Upload Logo / Photo'}</span>
                    </button>
                    {uploadedLogo && (
                      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ textAlign: 'center', background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                          <img
                            src={uploadedLogo}
                            alt="Uploaded Logo"
                            style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }}
                          />
                        </div>

                        {/* Template Logo Adjustment Panel */}
                        <div className="vp-adjust-panel-card" style={{ marginTop: '4px' }}>
                          <div className="vp-adjust-row">
                            <div className="vp-adjust-label-row">
                              <span>Logo Size</span>
                              <span className="vp-adjust-val">{Math.round((logoTransform.scale || 1) * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min="40"
                              max="200"
                              step="5"
                              value={Math.round((logoTransform.scale || 1) * 100)}
                              onChange={(e) => setLogoTransform((prev) => ({ ...prev, scale: Number(e.target.value) / 100 }))}
                              className="vp-adjust-slider"
                            />
                            <div className="vp-adjust-presets-row">
                              {[0.6, 0.8, 1.0, 1.3, 1.6].map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  className={`vp-adjust-preset-btn ${logoTransform.scale === s ? 'active' : ''}`}
                                  onClick={() => setLogoTransform((prev) => ({ ...prev, scale: s }))}
                                >
                                  {Math.round(s * 100)}%
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="vp-adjust-row">
                            <div className="vp-adjust-label-row">
                              <span>Rotation</span>
                              <span className="vp-adjust-val">{logoTransform.rotation || 0}°</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                              {[0, 90, 180, 270].map((deg) => (
                                <button
                                  key={deg}
                                  type="button"
                                  className={`vp-adjust-preset-btn ${(logoTransform.rotation || 0) === deg ? 'active' : ''}`}
                                  onClick={() => setLogoTransform((prev) => ({ ...prev, rotation: deg }))}
                                >
                                  {deg}°
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            className="vp-align-btn"
                            onClick={() => setLogoTransform({ x: 0, y: 0, scale: 1, rotation: 0, width: 100, height: 100, opacity: 1, locked: false })}
                          >
                            <RotateCcw size={12} />
                            <span>Reset Logo</span>
                          </button>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="vp-align-btn"
                            onClick={() => fileInputRef.current?.click()}
                            style={{ flex: 1 }}
                          >
                            <UploadCloud size={12} />
                            <span>Change</span>
                          </button>
                          <button
                            type="button"
                            className="vp-align-btn"
                            onClick={() => setUploadedLogo(null)}
                            style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                          >
                            <Trash2 size={12} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
  );
}
