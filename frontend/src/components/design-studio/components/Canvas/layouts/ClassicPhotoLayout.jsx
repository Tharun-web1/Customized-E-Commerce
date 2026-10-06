import React from 'react';

export default function ClassicPhotoLayout({
  activeColor,
  isPreview,
  renderCanvasElement,
  renderAdjustableLogo,
}) {
  return (
    <>
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {renderAdjustableLogo(isPreview)}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, overflow: 'visible' }}>
                        {renderCanvasElement('companyName', 'Company Name', {
                          fontSize: 22,
                          fontWeight: 800,
                          color: activeColor,
                        }, isPreview)}
                        {renderCanvasElement('companyMessage', 'Company Message', {
                          fontSize: 13,
                          color: '#64748b',
                        }, isPreview)}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', minWidth: 0, overflow: 'visible' }}>
                      {renderCanvasElement('fullName', 'Alexander Wright', {
                        fontSize: 18,
                        fontWeight: 800,
                        color: activeColor,
                        textAlign: 'right',
                      }, isPreview)}
                      {renderCanvasElement('jobTitle', 'Chief Technology Officer', {
                        fontSize: 13,
                        color: '#334155',
                        fontWeight: 600,
                        textAlign: 'right',
                      }, isPreview)}
                      {renderCanvasElement('email', 'alexander@apexinnovations.in', {
                        fontSize: 12,
                        color: '#64748b',
                        textAlign: 'right',
                      }, isPreview)}
                    </div>
                  </div>

                  {/* Blue Horizontal Rule */}
                  <div
                    style={{
                      height: '4px',
                      background: `linear-gradient(90deg, ${activeColor} 0%, rgba(203, 213, 225, 0.4) 100%)`,
                      borderRadius: '2px',
                      margin: '14px 0',
                    }}
                  />

                  {/* Bottom Row Contacts */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.82rem', color: '#475569' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                      {renderCanvasElement('address1', 'Tower 4, Mindspace IT Park', { fontSize: 12, color: '#475569' }, isPreview)}
                      {renderCanvasElement('address2', 'BKC, Mumbai 400051', { fontSize: 12, color: '#475569' }, isPreview)}
                      {renderCanvasElement('web', 'www.apexinnovations.in', { fontSize: 12, color: '#475569' }, isPreview)}
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      {renderCanvasElement('phone', '+91 98201 54321', { fontSize: 12, color: '#475569', textAlign: 'right' }, isPreview)}
                    </div>
                  </div>
                </>

    </>
  );
}
