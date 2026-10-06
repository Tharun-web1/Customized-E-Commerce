import React from 'react';

export default function LuxuryBlackGoldLayout({
  isPreview,
  renderCanvasElement,
}) {
  return (
                <div
                  style={{
                    height: '100%',
                    background: '#09090b',
                    color: '#d4af37',
                    padding: '24px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textAlign: 'center',
                    borderRadius: '2px',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {renderCanvasElement('fullName', 'Full Name', { fontSize: 18, fontWeight: 700, color: '#d4af37' }, isPreview)}
                    {renderCanvasElement('jobTitle', 'Job Title', { fontSize: 13, fontStyle: 'italic', color: '#e2d59f' }, isPreview)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />
                    <svg width="40" height="16" viewBox="0 0 40 16" fill="currentColor">
                      <path d="M20 2C16 2 13 6 10 6C6 6 4 4 2 4C0 4 0 6 2 7C5 8 8 7 11 8C14 9 17 14 20 14C23 14 26 9 29 8C32 7 35 8 38 7C40 6 40 4 38 4C36 4 34 6 30 6C27 6 24 2 20 2Z" />
                    </svg>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {renderCanvasElement('companyName', 'Company Name', { fontSize: 20, fontWeight: 800, color: '#d4af37' }, isPreview)}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.75rem', opacity: 0.9 }}>
                    {renderCanvasElement('phone', 'Phone / Other', { fontSize: 11, color: '#d4af37' }, isPreview)}
                    {renderCanvasElement('email', 'Email / Other', { fontSize: 11, color: '#d4af37' }, isPreview)}
                    {renderCanvasElement('web', 'Web / Other', { fontSize: 11, color: '#d4af37' }, isPreview)}
                  </div>
                </div>

  );
}
