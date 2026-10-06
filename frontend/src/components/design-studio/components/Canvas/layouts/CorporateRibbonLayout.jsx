import React from 'react';

export default function CorporateRibbonLayout({
  activeColor,
  isPreview,
  renderCanvasElement,
}) {
  return (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    {renderCanvasElement('fullName', 'Full Name', { fontSize: 18, fontWeight: 800, color: activeColor }, isPreview)}
                    {renderCanvasElement('jobTitle', 'Job Title', { fontSize: 13, fontWeight: 700, color: '#1e293b' }, isPreview)}
                    {renderCanvasElement('email', 'Email / Other', { fontSize: 12, color: '#64748b' }, isPreview)}
                  </div>

                  <div
                    style={{
                      background: activeColor,
                      color: '#ffffff',
                      padding: '10px 24px',
                      borderRadius: '3px',
                      boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {renderCanvasElement('companyName', 'Company Name', { fontSize: 20, fontWeight: 800, color: '#ffffff' }, isPreview)}
                    {renderCanvasElement('companyMessage', 'Company Message', { fontSize: 12, color: 'rgba(255,255,255,0.9)' }, isPreview)}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '24px', fontSize: '0.78rem', color: '#475569' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      {renderCanvasElement('address1', 'Address Line 1', { fontSize: 12, color: '#475569' }, isPreview)}
                      {renderCanvasElement('address2', 'Address Line 2', { fontSize: 12, color: '#475569' }, isPreview)}
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      {renderCanvasElement('phone', 'Phone / Other', { fontSize: 12, color: '#475569', textAlign: 'right' }, isPreview)}
                      {renderCanvasElement('web', 'Web / Other', { fontSize: 12, color: activeColor, fontWeight: 700, textAlign: 'right' }, isPreview)}
                    </div>
                  </div>
                </div>

  );
}
