import React from 'react';
import { Check, Crosshair, Image, ImageIcon, RotateCcw, RotateCw, SlidersHorizontal, Sparkles, Trash2, UploadCloud, ZoomIn, ZoomOut, X } from 'lucide-react';
import '../../css/LogoAdjustModal.css';

export default function LogoAdjustModal({
  isOpen,
  onClose,
  uploadedLogo,
  setUploadedLogo = () => {},
  logoTransform,
  setLogoTransform,
  handleRemoveLogo = () => {},
  logoInputRef,
  handleLogoFileChange,
  setIsLogoModalOpen,
  setActiveField = () => {},
}) {
  if (!isOpen) return null;

  return (
    <div className="vp-studio-preview-overlay" onClick={onClose}>
          <div
            className="vp-logo-modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              width: '560px',
              maxWidth: '94vw',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              animation: 'vpPreviewSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                height: '56px',
                padding: '0 22px',
                borderBottom: '1px solid #eef2f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <UploadCloud size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>
                    {uploadedLogo ? 'Manage & Adjust Logo' : 'Upload Logo or Photo'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="vp-3d-preview-close-btn"
                onClick={() => (onClose ? onClose() : setIsLogoModalOpen ? setIsLogoModalOpen(false) : null)}
                title="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Hidden Input for Logo Upload */}
            <input
              type="file"
              ref={logoInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleLogoFileChange}
            />

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Dropzone / Upload Area */}
              <div
                className="vp-logo-dropzone"
                onClick={() => logoInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setUploadedLogo(ev.target.result);
                      setActiveField('logo');
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: uploadedLogo ? '16px' : '32px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                {uploadedLogo ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
                    <div
                      style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '8px',
                        background: 'repeating-conic-gradient(#f1f5f9 0% 25%, #ffffff 0% 50%) 50% / 16px 16px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      }}
                    >
                      <img
                        src={uploadedLogo}
                        alt="Uploaded Logo"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          transform: `rotate(${logoTransform.rotation || 0}deg)`,
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        logoInputRef.current?.click();
                      }}
                      style={{
                        background: '#0099ff',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <UploadCloud size={15} />
                      <span>Upload Different Image</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        background: '#e0f2fe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0284c7',
                        marginBottom: '10px',
                      }}
                    >
                      <UploadCloud size={26} />
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                      Click to upload logo or drag and drop
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                      PNG, JPG, SVG, WebP up to 10MB (Transparent PNG recommended)
                    </div>
                  </>
                )}
              </div>

              {/* Adjustments Section */}
              <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
                  Adjust Size & Position
                </div>

                {/* Size / Scale Slider */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#475569', marginBottom: '6px' }}>
                    <span>Logo Size</span>
                    <strong style={{ color: '#0099ff' }}>{Math.round((logoTransform.scale || 1) * 100)}%</strong>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="250"
                    value={Math.round((logoTransform.scale || 1) * 100)}
                    onChange={(e) => {
                      const val = Number(e.target.value) / 100;
                      setLogoTransform((prev) => ({ ...prev, scale: Number(val.toFixed(2)) }));
                    }}
                    style={{ width: '100%', accentColor: '#0099ff' }}
                  />
                  {/* Size Preset Pills */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                    {[
                      { label: 'Small', scale: 0.7 },
                      { label: 'Medium', scale: 1.0 },
                      { label: 'Large', scale: 1.3 },
                      { label: 'XL', scale: 1.6 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setLogoTransform((prev) => ({ ...prev, scale: preset.scale }))}
                        style={{
                          flex: 1,
                          padding: '4px 6px',
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                          border: (logoTransform.scale || 1) === preset.scale ? '1.5px solid #0099ff' : '1px solid #cbd5e1',
                          background: (logoTransform.scale || 1) === preset.scale ? '#f0f9ff' : '#ffffff',
                          color: (logoTransform.scale || 1) === preset.scale ? '#0284c7' : '#475569',
                          fontWeight: (logoTransform.scale || 1) === preset.scale ? 700 : 500,
                          cursor: 'pointer',
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rotation Presets & Reset Position */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#475569' }}>Rotate:</span>
                    {[0, 90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setLogoTransform((prev) => ({ ...prev, rotation: deg }))}
                        style={{
                          padding: '3px 8px',
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                          border: (logoTransform.rotation || 0) === deg ? '1.5px solid #0099ff' : '1px solid #cbd5e1',
                          background: (logoTransform.rotation || 0) === deg ? '#f0f9ff' : '#ffffff',
                          color: (logoTransform.rotation || 0) === deg ? '#0284c7' : '#475569',
                          fontWeight: (logoTransform.rotation || 0) === deg ? 700 : 500,
                          cursor: 'pointer',
                        }}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setLogoTransform((prev) => ({ ...prev, x: 0, y: 0 }))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                    title="Reset to default alignment"
                  >
                    <Crosshair size={12} />
                    <span>Reset Position</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '14px 22px',
                borderTop: '1px solid #eef2f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#fafafa',
              }}
            >
              <div>
                {uploadedLogo && (
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedLogo(null);
                      setLogoTransform({ x: 0, y: 0, scale: 1, rotation: 0, width: 100, height: 100, opacity: 1, locked: false });
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Remove Logo</span>
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => (onClose ? onClose() : setIsLogoModalOpen ? setIsLogoModalOpen(false) : null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => (onClose ? onClose() : setIsLogoModalOpen ? setIsLogoModalOpen(false) : null)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#0099ff',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Done & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
  );
}
