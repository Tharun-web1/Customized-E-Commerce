import React from 'react';

export default function TemplateSwitcherPanel({
  allTemplates = [],
  activeTemplate,
  setActiveTemplate,
  setActiveColor,
  setFrontArtwork,
  setBackArtwork,
  setFields,
}) {
  return (
    <>
      <div className="vp-studio-panel-header">
        <h3>Select Template</h3>
      </div>
      <div className="vp-studio-panel-body" style={{ maxHeight: 'calc(100vh - 120px)' }}>
        {allTemplates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => {
              let savedDraft = null;
              try {
                const raw = sessionStorage.getItem(`vp_studio_draft_${tpl.id}`);
                if (raw) savedDraft = JSON.parse(raw);
              } catch (e) {}

              setActiveTemplate(tpl);
              setActiveColor(savedDraft?.activeColor || tpl.primary_color || '#0056b3');
              if (tpl.background_image) {
                setFrontArtwork(savedDraft?.frontArtwork || tpl.background_image);
                setBackArtwork(savedDraft?.backArtwork || tpl.back_background_image || null);
              } else {
                setFrontArtwork(null);
                setBackArtwork(null);
              }
              if (savedDraft?.fields && Object.keys(savedDraft.fields).length > 0) {
                setFields(savedDraft.fields);
              } else {
                setFields((prev) => ({
                  ...prev,
                  fullName: tpl.sample_name || prev.fullName,
                  jobTitle: tpl.sample_job_title || prev.jobTitle,
                  companyName: tpl.sample_company || prev.companyName,
                  companyMessage: tpl.sample_tagline || prev.companyMessage,
                  phone: tpl.sample_phone || prev.phone,
                  email: tpl.sample_email || prev.email,
                  address1: tpl.text_positions?.sampleAddress || prev.address1,
                  web: tpl.text_positions?.sampleWebsite || prev.web,
                }));
              }
            }}
            style={{
              padding: '10px',
              background: activeTemplate?.id === tpl.id ? '#e0f2fe' : '#ffffff',
              border: activeTemplate?.id === tpl.id ? '2px solid #0099ff' : '1px solid #e2e8f0',
              borderRadius: '10px',
              marginBottom: '12px',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease',
            }}
          >
            {/* Visual Card Mockup / Thumbnail */}
            <div
              style={{
                width: '100%',
                aspectRatio: '1.75 / 1',
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '8px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                position: 'relative',
              }}
            >
              {tpl.background_image ? (
                <img
                  src={tpl.background_image}
                  alt={tpl.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: tpl.layout_type === 'luxury_black_gold' ? '#0a0a0c' : '#ffffff',
                    color: tpl.layout_type === 'luxury_black_gold' ? '#d4af37' : '#1e293b',
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                    fontSize: '0.6rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: tpl.primary_color || '#0056b3', fontSize: '0.64rem' }}>
                      {tpl.sample_company || 'COMPANY'}
                    </span>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: tpl.primary_color || '#0056b3' }} />
                  </div>
                  <div style={{ fontSize: '0.48rem', opacity: 0.8 }}>
                    {tpl.sample_tagline || 'Excellence in service'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.45rem', opacity: 0.9, borderTop: '1px solid #f1f5f9', paddingTop: '2px' }}>
                    <span>{tpl.sample_name || 'Full Name'}</span>
                    <span>{tpl.sample_phone || '+91 98765 43210'}</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0f172a' }}>{tpl.title}</div>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: '#f1f5f9',
                  color: '#475569',
                }}
              >
                {tpl.industry}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
