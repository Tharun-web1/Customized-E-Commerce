import React from 'react';

export default function ModernGeometricLayout({
  activeColor,
  isPreview,
  renderCanvasElement,
}) {
  return (
                <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '45%', pointerEvents: 'none' }}>
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        clipPath: 'polygon(0 0, 70% 0, 100% 50%, 40% 100%, 0 100%)',
                        background: `linear-gradient(135deg, ${activeColor} 0%, #0f172a 100%)`,
                        opacity: 0.75,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '20%',
                        left: '10%',
                        width: '80%',
                        height: '60%',
                        clipPath: 'polygon(0 20%, 90% 50%, 0 80%)',
                        background: '#d4af37',
                        opacity: 0.6,
                      }}
                    />
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {renderCanvasElement('companyName', 'Company Name', { fontSize: 20, fontWeight: 800, color: activeColor, textAlign: 'right' }, isPreview)}
                    {renderCanvasElement('web', 'Web / Other', { fontSize: 12, color: '#64748b', textAlign: 'right' }, isPreview)}
                  </div>

                  <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#475569', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {renderCanvasElement('fullName', 'Full Name', { fontSize: 18, fontWeight: 800, color: '#0f172a', textAlign: 'right' }, isPreview)}
                    {renderCanvasElement('jobTitle', 'Job Title', { fontSize: 13, color: '#64748b', textAlign: 'right' }, isPreview)}
                    {renderCanvasElement('address1', 'Address Line 1', { fontSize: 11, color: '#475569', textAlign: 'right' }, isPreview)}
                    {renderCanvasElement('email', 'Email / Other', { fontSize: 11, color: '#475569', textAlign: 'right' }, isPreview)}
                    {renderCanvasElement('phone', 'Phone / Other', { fontSize: 11, color: '#475569', textAlign: 'right' }, isPreview)}
                  </div>
                </div>

  );
}
