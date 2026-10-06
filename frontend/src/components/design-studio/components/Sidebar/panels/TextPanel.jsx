import React from 'react';
import { AlignCenter, AlignLeft, AlignRight, Bold, ChevronDown, Italic, List, Lock, Maximize2, Plus, Sparkles, Type, Underline, Unlock } from 'lucide-react';
import { FONT_FAMILIES } from '../../../constants/studioConstants';

export default function TextPanel({
  activeField,
  setActiveField,
  fields,
  updateField,
  activeFieldStyle,
  updateActiveStyle,
  handleAddCustomField,
  activeColor,
  layout,
  isCustomMode = false,
  setFields = () => {},
  initialTemplate = {},
  setEditedFields = () => {},
}) {
  return (
            <>
              <div className="vp-studio-panel-header">
                <h3>Text</h3>
                <Maximize2 size={15} color="#94a3b8" style={{ cursor: 'pointer' }} />
              </div>

              <div className="vp-studio-panel-body">
                <button
                  type="button"
                  className="vp-studio-add-text-btn"
                  onClick={() => {
                    const newKey = `custom_${Date.now()}`;
                    updateField(newKey, 'New Text Field');
                    setActiveField(newKey);
                  }}
                >
                  <Plus size={16} />
                  <span>Add text</span>
                </button>

                {isCustomMode ? (
                  <div style={{ padding: '8px 0' }}>
                    <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                      You uploaded your complete card design. No template text is overlaid.
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>
                      Click <strong>+ Add text</strong> above if you'd like to overlay additional text onto your card.
                    </p>
                    {Object.keys(fields).filter(k => k.startsWith('custom_')).map((k) => (
                      <div key={k} className={`vp-studio-input-wrap ${activeField === k ? 'active' : ''}`} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <label className="vp-studio-input-label" style={{ margin: 0 }}>Custom Text</label>
                          <button
                            type="button"
                            onClick={() => {
                              const nextFields = { ...fields };
                              delete nextFields[k];
                              setFields(nextFields);
                              if (activeField === k) setActiveField(null);
                            }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          className="vp-studio-text-input"
                          value={fields[k]}
                          onFocus={() => setActiveField(k)}
                          onChange={(e) => updateField(k, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="vp-studio-text-inputs-list">
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#f0f9ff',
                      border: '1px solid #bae6fd',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      marginBottom: '12px',
                      fontSize: '11.5px',
                      color: '#0369a1'
                    }}>
                      <span>💡 <em>Only your edited fields appear in preview</em></span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          style={{ background: '#ffffff', border: '1px solid #bae6fd', borderRadius: '4px', padding: '2px 6px', fontSize: '10.5px', fontWeight: 600, color: '#0284c7', cursor: 'pointer' }}
                          onClick={() => {
                            const sampleData = {
                              companyName: initialTemplate.sample_company || 'Apex Innovations Pvt Ltd',
                              companyMessage: initialTemplate.sample_tagline || 'Engineering the Future',
                              fullName: initialTemplate.sample_name || 'Alexander Wright',
                              jobTitle: initialTemplate.sample_title || 'Chief Technology Officer',
                              email: initialTemplate.sample_email || 'alexander@apexinnovations.in',
                              address1: initialTemplate.sample_address || 'Tower 4, Mindspace IT Park',
                              address2: initialTemplate.sample_city || 'BKC, Mumbai 400051',
                              web: initialTemplate.sample_web || 'www.apexinnovations.in',
                              phone: initialTemplate.sample_phone || '+91 98201 54321',
                            };
                            setFields(sampleData);
                            setEditedFields({
                              companyName: true,
                              companyMessage: true,
                              fullName: true,
                              jobTitle: true,
                              email: true,
                              address1: true,
                              address2: true,
                              web: true,
                              phone: true,
                            });
                          }}
                          title="Populate all fields with sample text"
                        >
                          Fill Sample
                        </button>
                        <button
                          type="button"
                          style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px 6px', fontSize: '10.5px', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
                          onClick={() => {
                            setFields({
                              companyName: '',
                              companyMessage: '',
                              fullName: '',
                              jobTitle: '',
                              email: '',
                              address1: '',
                              address2: '',
                              web: '',
                              phone: '',
                            });
                            setEditedFields({});
                          }}
                          title="Clear all fields to leave design blank"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Company Name */}
                    <div className={`vp-studio-input-wrap ${activeField === 'companyName' ? 'active' : ''}`}>
                      <label className="vp-studio-input-label">Company Name</label>
                      <input
                        type="text"
                        className="vp-studio-text-input"
                        placeholder={initialTemplate.sample_company || 'e.g. Apex Innovations'}
                        value={fields.companyName || ''}
                        onFocus={() => setActiveField('companyName')}
                        onChange={(e) => updateField('companyName', e.target.value)}
                      />
                    </div>

                    {/* Company Message */}
                    <div className={`vp-studio-input-wrap ${activeField === 'companyMessage' ? 'active' : ''}`}>
                      <label className="vp-studio-input-label">Company Message / Tagline</label>
                      <input
                        type="text"
                        className="vp-studio-text-input"
                        placeholder={initialTemplate.sample_tagline || 'e.g. Engineering the Future'}
                        value={fields.companyMessage || ''}
                        onFocus={() => setActiveField('companyMessage')}
                        onChange={(e) => updateField('companyMessage', e.target.value)}
                      />
                    </div>

                    {/* Full Name */}
                    <div className={`vp-studio-input-wrap ${activeField === 'fullName' ? 'active' : ''}`}>
                      <label className="vp-studio-input-label">Full Name</label>
                      <input
                        type="text"
                        className="vp-studio-text-input"
                        placeholder={initialTemplate.sample_name || 'e.g. Alexander Wright'}
                        value={fields.fullName || ''}
                        onFocus={() => setActiveField('fullName')}
                        onChange={(e) => updateField('fullName', e.target.value)}
                      />
                    </div>

                    {/* Job Title */}
                    <div className={`vp-studio-input-wrap ${activeField === 'jobTitle' ? 'active' : ''}`}>
                      <label className="vp-studio-input-label">Job Title</label>
                      <input
                        type="text"
                        className="vp-studio-text-input"
                        placeholder={initialTemplate.sample_title || 'e.g. Chief Technology Officer'}
                        value={fields.jobTitle || ''}
                        onFocus={() => setActiveField('jobTitle')}
                        onChange={(e) => updateField('jobTitle', e.target.value)}
                      />
                    </div>

                    {/* Email / Other */}
                    <div className={`vp-studio-input-wrap ${activeField === 'email' ? 'active' : ''}`}>
                      <label className="vp-studio-input-label">Email / Other</label>
                      <input
                        type="text"
                        className="vp-studio-text-input"
                        placeholder={initialTemplate.sample_email || 'e.g. alexander@company.com'}
                        value={fields.email || ''}
                        onFocus={() => setActiveField('email')}
                        onChange={(e) => updateField('email', e.target.value)}
                      />
                    </div>

                    {/* Address Line 1 */}
                    <div className={`vp-studio-input-wrap ${activeField === 'address1' ? 'active' : ''}`}>
                      <label className="vp-studio-input-label">Address Line 1</label>
                      <input
                        type="text"
                        className="vp-studio-text-input"
                        placeholder={initialTemplate.sample_address || 'e.g. Tower 4, Mindspace IT Park'}
                        value={fields.address1 || ''}
                        onFocus={() => setActiveField('address1')}
                        onChange={(e) => updateField('address1', e.target.value)}
                      />
                    </div>

                    {/* Address Line 2 */}
                    <div className={`vp-studio-input-wrap ${activeField === 'address2' ? 'active' : ''}`}>
                      <label className="vp-studio-input-label">Address Line 2</label>
                      <input
                        type="text"
                        className="vp-studio-text-input"
                        placeholder={initialTemplate.sample_city || 'e.g. BKC, Mumbai 400051'}
                        value={fields.address2 || ''}
                        onFocus={() => setActiveField('address2')}
                        onChange={(e) => updateField('address2', e.target.value)}
                      />
                    </div>

                    {/* Web / Other */}
                    <div className={`vp-studio-input-wrap ${activeField === 'web' ? 'active' : ''}`}>
                      <label className="vp-studio-input-label">Web / Other</label>
                      <input
                        type="text"
                        className="vp-studio-text-input"
                        placeholder={initialTemplate.sample_web || 'e.g. www.company.com'}
                        value={fields.web || ''}
                        onFocus={() => setActiveField('web')}
                        onChange={(e) => updateField('web', e.target.value)}
                      />
                    </div>

                    {/* Phone / Other */}
                    <div className={`vp-studio-input-wrap ${activeField === 'phone' ? 'active' : ''}`}>
                      <label className="vp-studio-input-label">Phone / Other</label>
                      <input
                        type="text"
                        className="vp-studio-text-input"
                        placeholder={initialTemplate.sample_phone || 'e.g. +91 98201 54321'}
                        value={fields.phone || ''}
                        onFocus={() => setActiveField('phone')}
                        onChange={(e) => updateField('phone', e.target.value)}
                      />
                    </div>

                    {/* Highlight Bullets / Taglines (Especially for Executive Swoosh layout) */}
                    <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                        Feature Bullets & Highlights
                      </div>

                      <div className={`vp-studio-input-wrap ${activeField === 'bullet1' ? 'active' : ''}`} style={{ marginBottom: '8px' }}>
                        <label className="vp-studio-input-label">Bullet Point 1</label>
                        <input
                          type="text"
                          className="vp-studio-text-input"
                          placeholder="e.g. We Build"
                          value={fields.bullet1 || ''}
                          onFocus={() => setActiveField('bullet1')}
                          onChange={(e) => updateField('bullet1', e.target.value)}
                        />
                      </div>

                      <div className={`vp-studio-input-wrap ${activeField === 'bullet2' ? 'active' : ''}`} style={{ marginBottom: '8px' }}>
                        <label className="vp-studio-input-label">Bullet Point 2</label>
                        <input
                          type="text"
                          className="vp-studio-text-input"
                          placeholder="e.g. We Launch"
                          value={fields.bullet2 || ''}
                          onFocus={() => setActiveField('bullet2')}
                          onChange={(e) => updateField('bullet2', e.target.value)}
                        />
                      </div>

                      <div className={`vp-studio-input-wrap ${activeField === 'bullet3' ? 'active' : ''}`}>
                        <label className="vp-studio-input-label">Bullet Point 3</label>
                        <input
                          type="text"
                          className="vp-studio-text-input"
                          placeholder="e.g. We Grow"
                          value={fields.bullet3 || ''}
                          onFocus={() => setActiveField('bullet3')}
                          onChange={(e) => updateField('bullet3', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
  );
}
