import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Trash2,
  FileText,
  Palette,
  CheckCircle,
  AlertCircle,
  Eye,
  Layers,
  Sparkles,
} from 'lucide-react';
import { fetchTemplates, createTemplate, updateTemplate, deleteTemplate } from '../../api';
import TemplateCardMockup from '../TemplateCardMockup';
import ConvertCardToTemplateModal from './ConvertCardToTemplateModal';
import '../../css/admin/AdminCardTemplates.css';

export default function AdminCardTemplatesPage({
  card,
  onBack,
  showToast,
  onRefreshData,
}) {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const initialForm = {
    title: '',
    industry: 'Tech',
    orientation: 'horizontal',
    primary_color: '#0056b3',
    layout_type: 'classic_photo',
    color_palette: '#0056b3,#1e293b,#047857,#dc2626',
    preview_style: 'classic_photo',
    sample_company: 'Apex Innovations Pvt Ltd',
    sample_tagline: 'Engineering the Future',
  };
  const [templateForm, setTemplateForm] = useState(initialForm);

  useEffect(() => {
    if (card?.id) {
      loadCardTemplates();
    }
  }, [card?.id]);

  const loadCardTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTemplates('', card.id);
      setTemplates(data);
    } catch (err) {
      console.error('Error fetching card templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingTemplate(null);
    setTemplateForm({
      ...initialForm,
      primary_color: card.accent_color || '#0056b3',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (template) => {
    setEditingTemplate(template);
    setTemplateForm({
      title: template.title || '',
      industry: template.industry || 'Tech',
      orientation: template.orientation || 'horizontal',
      primary_color: template.primary_color || '#0056b3',
      layout_type: template.layout_type || template.preview_style || 'classic_photo',
      color_palette: template.color_palette || '#0056b3,#1e293b,#047857,#dc2626',
      preview_style: template.preview_style || 'classic_photo',
      sample_company: template.sample_company || '',
      sample_tagline: template.sample_tagline || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, {
          ...templateForm,
          card: card.id,
        });
        showToast(`Updated template "${templateForm.title}"!`);
      } else {
        await createTemplate({
          ...templateForm,
          card: card.id,
        });
        showToast(`Created new template for ${card.title}!`);
      }
      setIsModalOpen(false);
      loadCardTemplates();
      onRefreshData && onRefreshData();
    } catch (err) {
      showToast('Error saving template: ' + err.message, 'error');
    }
  };

  const handleDelete = async (template) => {
    if (window.confirm(`Delete template "${template.title}"?`)) {
      try {
        await deleteTemplate(template.id);
        showToast(`Deleted template "${template.title}"`);
        loadCardTemplates();
        onRefreshData && onRefreshData();
      } catch (err) {
        showToast('Failed to delete template', 'error');
      }
    }
  };

  const filteredTemplates = templates.filter((tpl) => {
    const matchesSearch =
      tpl.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.sample_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry =
      industryFilter === 'all' ||
      tpl.industry?.toLowerCase() === industryFilter.toLowerCase();
    return matchesSearch && matchesIndustry;
  });

  const industriesList = [
    'Tech',
    'Medical',
    'Finance/CA',
    'Legal',
    'Salon & Spa',
    'Real Estate',
    'Education',
    'Creative & Design',
    'Retail',
    'Hospitality',
  ];

  return (
    <div className="admin-card-templates-page">
      {/* 1. Visiting Card Context Hero Banner */}
      <div className="card-context-banner">
        <div className="card-context-left">
          <button type="button" className="card-context-back-btn" onClick={onBack}>
            <ArrowLeft size={14} />
            <span>Back to Visiting Cards</span>
          </button>
          <h2>{card.title} — Design Templates</h2>
          <div className="card-context-pills">
            <span className="card-context-pill">{card.gsm || '350 GSM'}</span>
            <span className="card-context-pill">{card.finish_type || 'Matte / Glossy'}</span>
            <span className="card-context-pill">{card.category_name || card.category_group || 'Visiting Card'}</span>
            <span className="card-context-pill price">₹{card.base_price_100} / 100 units</span>
          </div>
        </div>

        <div className="card-context-right">
          <div className="card-context-stat">
            <div className="card-context-stat-val">{templates.length}</div>
            <div className="card-context-stat-lbl">Templates Available</div>
          </div>
        </div>
      </div>

      {/* 2. Toolbar & Controls */}
      <div className="admin-card-templates-toolbar">
        <div className="admin-card-templates-controls">
          <div className="admin-search-input-wrap">
            <Search size={15} />
            <input
              type="text"
              className="admin-search-input"
              placeholder="Search templates or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="admin-select"
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
          >
            <option value="all">All Industries</option>
            {industriesList.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
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
            <Sparkles size={15} />
            <span>Convert Card Image to Template</span>
          </button>

          <button type="button" className="admin-btn-secondary" onClick={handleOpenAdd}>
            <Plus size={15} />
            <span>Add Preset</span>
          </button>
        </div>
      </div>

      {/* 3. Templates Grid or Empty State */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          Loading templates for {card.title}...
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="card-templates-empty">
          <div className="card-templates-empty-icon">
            <FileText size={28} />
          </div>
          <h3>No templates yet for this card</h3>
          <p>
            Add ready-to-use print templates for <strong>{card.title}</strong> so customers can choose presets in the Live Card Studio and Product Page.
          </p>
          <button type="button" className="admin-btn-primary" onClick={handleOpenAdd}>
            <Plus size={15} />
            <span>Create First Template</span>
          </button>
        </div>
      ) : (
        <div className="card-templates-grid">
          {filteredTemplates.map((tpl) => (
            <div key={tpl.id} className="card-template-item">
              {/* Visual Card Mockup Matching Screenshot */}
              <div style={{ marginBottom: '12px' }}>
                <TemplateCardMockup template={tpl} />
              </div>

              {/* Template Meta and Actions */}
              <div className="card-template-info">
                <div>
                  <div className="card-template-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                    <h4 className="card-template-title">{tpl.title}</h4>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span className="card-template-industry-tag">{tpl.industry}</span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: (tpl.text_positions?.status || 'APPROVED') === 'PUBLISHED' ? '#ecfdf5' : '#eff6ff',
                          color: (tpl.text_positions?.status || 'APPROVED') === 'PUBLISHED' ? '#059669' : '#2563eb',
                          border: `1px solid ${(tpl.text_positions?.status || 'APPROVED') === 'PUBLISHED' ? '#a7f3d0' : '#bfdbfe'}`,
                        }}
                      >
                        {tpl.text_positions?.status || (tpl.text_positions?.card_recreation ? 'PUBLISHED' : 'APPROVED')}
                      </span>
                      {tpl.text_positions?.similarityScore && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '2px 5px',
                            borderRadius: 4,
                            background: '#f0fdf4',
                            color: '#15803d',
                            border: '1px solid #bbf7d0',
                          }}
                        >
                          {tpl.text_positions.similarityScore}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="card-template-specs">
                    <span>{tpl.orientation === 'vertical' ? 'Vertical' : 'Horizontal'}</span>
                    <span>•</span>
                    <span>Style: {tpl.preview_style || 'Modern'}</span>
                  </div>
                </div>

                <div className="card-template-actions-row">
                  <button
                    type="button"
                    className="admin-action-btn"
                    onClick={() => handleOpenEdit(tpl)}
                    title="Edit Template"
                  >
                    <Edit size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="admin-action-btn delete"
                    onClick={() => handleDelete(tpl)}
                    title="Delete Template"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Add / Edit Template Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <div className="admin-modal-header">
              <h3>
                {editingTemplate
                  ? `Edit Template: ${editingTemplate.title}`
                  : `Add New Template for ${card.title}`}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="admin-modal-form">
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <div className="admin-form-group full">
                    <label>Template Title *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      required
                      placeholder="e.g. Minimalist Executive, Corporate Sleek"
                      value={templateForm.title}
                      onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Industry / Sector *</label>
                    <select
                      className="admin-form-select"
                      value={templateForm.industry}
                      onChange={(e) => setTemplateForm({ ...templateForm, industry: e.target.value })}
                    >
                      {industriesList.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Card Orientation</label>
                    <select
                      className="admin-form-select"
                      value={templateForm.orientation}
                      onChange={(e) => setTemplateForm({ ...templateForm, orientation: e.target.value })}
                    >
                      <option value="horizontal">Horizontal (Standard Landscape)</option>
                      <option value="vertical">Vertical (Modern Portrait)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Sample Company Name</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Acme Tech Solutions"
                      value={templateForm.sample_company}
                      onChange={(e) => setTemplateForm({ ...templateForm, sample_company: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Sample Tagline</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Defining Excellence"
                      value={templateForm.sample_tagline}
                      onChange={(e) => setTemplateForm({ ...templateForm, sample_tagline: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Primary Brand Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={templateForm.primary_color || '#0056b3'}
                        onChange={(e) => setTemplateForm({ ...templateForm, primary_color: e.target.value })}
                        style={{ width: '40px', height: '36px', border: 'none', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        className="admin-form-input"
                        style={{ flex: 1 }}
                        value={templateForm.primary_color}
                        onChange={(e) => setTemplateForm({ ...templateForm, primary_color: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Layout Design Style (Matches Screenshot)</label>
                    <select
                      className="admin-form-select"
                      value={templateForm.layout_type || templateForm.preview_style}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTemplateForm({ ...templateForm, layout_type: val, preview_style: val });
                      }}
                    >
                      <option value="executive_swoosh">★ Executive Split & Accent Swoosh (Recommended)</option>
                      <option value="classic_photo">1. Classic Photo / Logo Placeholder</option>
                      <option value="luxury_black_gold">2. Luxury Black & Gold Filigree</option>
                      <option value="corporate_red_ribbon">3. Corporate Bold Ribbon</option>
                      <option value="modern_geometric">4. Abstract Geometric Prisms</option>
                      <option value="medical_care">5. Clinical Medical Cross</option>
                      <option value="legal_crest">6. Legal Advocate & Scales</option>
                      <option value="real_estate_horizon">7. Prestige Real Estate Arch</option>
                      <option value="beauty_salon">8. Luxe Salon & Aesthetic Spa</option>
                    </select>
                  </div>

                  <div className="admin-form-group full">
                    <label>Color Palette Swatches (Comma-separated hex colors)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="#0056b3,#1e293b,#047857,#dc2626"
                      value={templateForm.color_palette}
                      onChange={(e) => setTemplateForm({ ...templateForm, color_palette: e.target.value })}
                    />
                    <small style={{ color: '#64748b', fontSize: '0.74rem' }}>
                      These colors appear as interactive clickable dots underneath the card mockup.
                    </small>
                  </div>
                </div>

                {/* Live Real-time Card Mockup Preview in Modal */}
                <div style={{ marginTop: '18px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                    Live Template Preview
                  </label>
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      marginTop: '6px',
                      maxWidth: '320px',
                      margin: '6px auto 0',
                    }}
                  >
                    <TemplateCardMockup template={templateForm} />
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
                  {editingTemplate ? 'Update Template' : 'Add Template to Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert Card to Template Modal Wizard */}
      <ConvertCardToTemplateModal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        cards={card ? [card] : []}
        onRefreshData={() => {
          loadCardTemplates();
          if (onRefreshData) onRefreshData();
        }}
        showToast={showToast}
      />
    </div>
  );
}
