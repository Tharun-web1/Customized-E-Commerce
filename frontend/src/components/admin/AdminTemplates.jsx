import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { createTemplate, deleteTemplate } from '../../api';
import ConvertCardToTemplateModal from './ConvertCardToTemplateModal';
import TemplateCardMockup from '../TemplateCardMockup';

export default function AdminTemplates({
  templates = [],
  cards = [],
  onRefreshData,
  showToast,
  isModalOpen,
  setIsModalOpen,
}) {
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    industry: 'Technology & Startups',
    orientation: 'horizontal',
    primary_color: '#0056b3',
    preview_style: 'modern',
    sample_company: 'Acme Technologies Pvt Ltd',
    sample_tagline: 'Driving Next-Gen Digital Innovation',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await createTemplate(form);
      showToast(`Template "${form.title}" added!`);
      setIsModalOpen(false);
      setForm({
        title: '',
        industry: 'Technology & Startups',
        orientation: 'horizontal',
        primary_color: '#0056b3',
        preview_style: 'modern',
        sample_company: 'Acme Technologies Pvt Ltd',
        sample_tagline: 'Driving Next-Gen Innovation',
      });
      onRefreshData && onRefreshData();
    } catch (err) {
      showToast('Failed to add template', 'error');
    }
  };

  const handleDelete = async (tmpl) => {
    if (window.confirm(`Delete template "${tmpl.title}"?`)) {
      try {
        await deleteTemplate(tmpl.id);
        showToast(`Deleted template "${tmpl.title}"`);
        onRefreshData && onRefreshData();
      } catch (err) {
        showToast('Failed to delete template', 'error');
      }
    }
  };

  return (
    <div className="admin-templates-view">
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>Industry Design Templates ({templates.length})</h2>
          <p>Presets ready for customers in the live interactive studio</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="admin-btn-primary"
            style={{
              background: 'linear-gradient(135deg, #0070ba 0%, #004494 100%)',
              border: 'none',
              boxShadow: '0 2px 6px rgba(0, 112, 186, 0.25)',
            }}
            onClick={() => setIsConvertModalOpen(true)}
          >
            <Sparkles size={14} />
            <span>Convert Card Image to Template</span>
          </button>

          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={14} />
            <span>Add Standard Preset</span>
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: '20px'
      }}>
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <div>
              {/* Full Physical Card Design Mockup */}
              <div style={{ marginBottom: '14px' }}>
                <TemplateCardMockup template={tmpl} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="admin-badge primary" style={{ textTransform: 'capitalize' }}>
                  {tmpl.industry}
                </span>
                <button
                  type="button"
                  className="admin-action-btn delete"
                  onClick={() => handleDelete(tmpl)}
                  style={{ padding: '4px 8px' }}
                  title="Delete Template"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.96rem', color: '#0f172a', fontWeight: 700 }}>
                {tmpl.title}
              </h4>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#64748b' }}>
                {tmpl.sample_company}
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.76rem',
              color: '#475569',
              borderTop: '1px solid #f1f5f9',
              paddingTop: '8px',
              marginTop: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: tmpl.primary_color || '#0056b3',
                    display: 'inline-block'
                  }}
                />
                <span style={{ textTransform: 'capitalize' }}>{tmpl.orientation || 'horizontal'}</span>
              </div>
              <span className="admin-badge secondary">
                {tmpl.background_image ? 'Card Artwork' : (tmpl.preview_style || 'Preset')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Convert Card to Template Modal Wizard */}
      <ConvertCardToTemplateModal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        cards={cards}
        onRefreshData={onRefreshData}
        showToast={showToast}
      />

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Add Industry Design Template</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <div className="admin-form-group full">
                    <label>Template Title *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      required
                      placeholder="e.g. Apex Legal Associates"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Industry</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      required
                      placeholder="e.g. Legal, Finance, Medical"
                      value={form.industry}
                      onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Primary Theme Color</label>
                    <input
                      type="color"
                      value={form.primary_color}
                      onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                      style={{ width: '100%', height: '38px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                    />
                  </div>

                  <div className="admin-form-group full">
                    <label>Sample Company Name</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Apex Corporate Law Chambers"
                      value={form.sample_company}
                      onChange={(e) => setForm({ ...form, sample_company: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group full">
                    <label>Sample Tagline</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Advocates & Supreme Court Counsel"
                      value={form.sample_tagline}
                      onChange={(e) => setForm({ ...form, sample_tagline: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
