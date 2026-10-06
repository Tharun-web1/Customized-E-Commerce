import React from 'react';

export default function FallbackLayout({
  activeColor,
  isPreview,
  renderCanvasElement,
}) {
  return (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {renderCanvasElement('companyName', 'Company Name', { fontSize: 20, fontWeight: 800, color: activeColor }, isPreview)}
                    {renderCanvasElement('companyMessage', 'Company Message', { fontSize: 13, color: '#64748b' }, isPreview)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <div>
                      {renderCanvasElement('fullName', 'Full Name', { fontSize: 16, fontWeight: 800 }, isPreview)}
                      {renderCanvasElement('jobTitle', 'Job Title', { fontSize: 13 }, isPreview)}
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      {renderCanvasElement('phone', 'Phone / Other', { fontSize: 12, textAlign: 'right' }, isPreview)}
                      {renderCanvasElement('email', 'Email / Other', { fontSize: 12, textAlign: 'right' }, isPreview)}
                    </div>
                  </div>
                </div>

  );
}
