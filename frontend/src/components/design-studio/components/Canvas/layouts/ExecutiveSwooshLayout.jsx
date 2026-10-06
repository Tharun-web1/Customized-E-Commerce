import React from 'react';

export default function ExecutiveSwooshLayout({
  activeColor,
  activeTemplate,
  isPreview,
  renderCanvasElement,
  uploadedLogo,
  renderAdjustableLogo,
  setActiveTool,
}) {
  return (
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                    padding: '24px 28px',
                  }}
                >
                  {/* Left Column: Name, Designation & 4 Contacts */}
                  <div
                    style={{
                      flex: 1.2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      zIndex: 3,
                      paddingRight: '16px',
                      minWidth: 0,
                    }}
                  >
                    {/* Top-Left: Name & Designation */}
                    <div>
                      {renderCanvasElement('fullName', 'Y. Suneetha Reddy', {
                        fontSize: 22,
                        fontWeight: 800,
                        color: activeColor || '#1e1b4b',
                        lineHeight: 1.15,
                        letterSpacing: -0.2,
                      }, isPreview)}

                      <div style={{ marginTop: '4px' }}>
                        {renderCanvasElement('jobTitle', 'General Manager & BDM', {
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#334155',
                          letterSpacing: 0.2,
                        }, isPreview)}
                      </div>

                      {/* Dual Accent Underline */}
                      <div
                        style={{
                          display: 'flex',
                          width: '85%',
                          height: '3px',
                          marginTop: '8px',
                          borderRadius: '2px',
                          overflow: 'hidden',
                        }}
                      >
                        <div style={{ width: '35%', background: activeTemplate?.text_positions?.accentColor || '#eab308' }} />
                        <div style={{ width: '65%', background: activeColor || '#004b93' }} />
                      </div>
                    </div>

                    {/* Bottom-Left: 4 Contact details with circular icons */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        marginTop: '16px',
                        fontSize: '12px',
                        color: '#1e293b',
                      }}
                    >
                      {/* Phone */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: activeTemplate?.text_positions?.swooshColor || '#004b93',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z" />
                          </svg>
                        </div>
                        {renderCanvasElement('phone', '7569734433, 7794053340', { fontSize: 12, fontWeight: 600, color: '#1e293b' }, isPreview)}
                      </div>

                      {/* Website */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: activeTemplate?.text_positions?.swooshColor || '#004b93',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                          </svg>
                        </div>
                        {renderCanvasElement('web', 'www.ygrgobalitservices.com', { fontSize: 12, color: '#1e293b' }, isPreview)}
                      </div>

                      {/* Email */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: activeTemplate?.text_positions?.swooshColor || '#004b93',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                          </svg>
                        </div>
                        {renderCanvasElement('email', 'info@ygrgobalitservices.com', { fontSize: 12, color: '#1e293b' }, isPreview)}
                      </div>

                      {/* Location / Address */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: activeTemplate?.text_positions?.swooshColor || '#004b93',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                          </svg>
                        </div>
                        {renderCanvasElement('address1', 'Hyderabad, Telangana, India.', { fontSize: 12, color: '#1e293b' }, isPreview)}
                      </div>
                    </div>
                  </div>

                  {/* Vertical Golden Center Divider */}
                  <div
                    style={{
                      width: '3px',
                      background: activeTemplate?.text_positions?.accentColor || '#eab308',
                      margin: '6px 0',
                      alignSelf: 'stretch',
                      zIndex: 3,
                      flexShrink: 0,
                      borderRadius: '1.5px',
                    }}
                  />

                  {/* Right Column: Logo, Bullets, Bottom Swoosh */}
                  <div
                    style={{
                      flex: 0.95,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      zIndex: 3,
                      paddingLeft: '16px',
                      minWidth: 0,
                    }}
                  >
                    {/* Top-Right: Logo Area */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60px' }}>
                      {uploadedLogo ? (
                        renderAdjustableLogo(isPreview)
                      ) : (activeTemplate?.text_positions?.hasCustomLogo && activeTemplate?.text_positions?.logoImage) ? (
                        <img
                          src={activeTemplate.text_positions.logoImage}
                          alt="Logo"
                          style={{ maxHeight: 60, maxWidth: '100%', objectFit: 'contain', cursor: 'pointer' }}
                          onClick={() => {
                            if (!isPreview) {
                              setActiveTool('uploads');
                            }
                          }}
                        />
                      ) : (
                        <div style={{ textAlign: 'center', width: '100%' }}>
                          {renderCanvasElement('companyName', 'YGR GLOBAL IT SERVICES', {
                            fontSize: 16,
                            fontWeight: 900,
                            color: activeTemplate?.text_positions?.swooshColor || '#004b93',
                            letterSpacing: 0.5,
                            textAlign: 'center',
                          }, isPreview)}
                        </div>
                      )}
                    </div>

                    {/* Middle-Right: 3 Highlights / Tagline Bullets */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        margin: '6px 0 0 16px',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#1e293b',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: activeTemplate?.text_positions?.accentColor || '#eab308', fontSize: '13px' }}>▶</span>
                        {renderCanvasElement('bullet1', 'We Build', { fontSize: 13, fontWeight: 700, color: '#1e293b' }, isPreview)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: activeTemplate?.text_positions?.accentColor || '#eab308', fontSize: '13px' }}>▶</span>
                        {renderCanvasElement('bullet2', 'We Launch', { fontSize: 13, fontWeight: 700, color: '#1e293b' }, isPreview)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: activeTemplate?.text_positions?.accentColor || '#eab308', fontSize: '13px' }}>▶</span>
                        {renderCanvasElement('bullet3', 'We Grow', { fontSize: 13, fontWeight: 700, color: '#1e293b' }, isPreview)}
                      </div>
                    </div>
                  </div>

                  {/* Bottom-Right Curved Graphic Swoosh (Vector SVG) */}
                  <svg
                    viewBox="0 0 200 100"
                    preserveAspectRatio="none"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '45%',
                      height: '42%',
                      pointerEvents: 'none',
                      zIndex: 1,
                    }}
                  >
                    {/* Yellow/Gold Swoosh Layer */}
                    <path
                      d="M 0 100 C 60 85, 130 65, 200 10 L 200 100 Z"
                      fill={activeTemplate?.text_positions?.accentColor || '#eab308'}
                    />
                    {/* Deep Corporate Navy Blue Swoosh Layer */}
                    <path
                      d="M 30 100 C 80 88, 145 70, 200 25 L 200 100 Z"
                      fill={activeTemplate?.text_positions?.swooshColor || '#004b93'}
                    />
                    {/* Dark Accent Layer */}
                    <path
                      d="M 65 100 C 105 92, 160 80, 200 45 L 200 100 Z"
                      fill="#002b66"
                      opacity="0.8"
                    />
                  </svg>
                </div>

  );
}
