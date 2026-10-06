import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  UploadCloud,
  CheckCircle2,
  X,
  RefreshCw,
  Edit3,
  Layers,
  Tag,
  ExternalLink,
  Plus,
  Trash2,
  Sliders,
  Check,
} from 'lucide-react';
import { createTemplate } from '../../api';
import { preprocessCardImage } from '../../utils/cardPreprocessingEngine';
import { extractCardDetailsFromImage } from '../../utils/cardOcrParser';
import { generatePlainCardTemplate, TEMPLATE_PLACEHOLDERS } from '../../utils/plainCardTemplateEngine';
import PlainCardPreview from './PlainCardPreview';
import VistaprintDesignStudio from '../design-studio/VistaprintDesignStudio';

const INDUSTRY_OPTIONS = [
  'Corporate & Business',
  'Technology & Startups',
  'Medical & Healthcare',
  'Finance & Accounting (CA)',
  'Legal & Law Firms',
  'Real Estate & Builders',
  'Architecture & Interior',
  'Salon & Beauty',
  'Restaurant & Food',
  'Creative & Photography',
  'Education & Coaching',
  'Retail & Manufacturing',
  'Automotive & Transport',
];

const FIELD_ROLE_TAGS = [
  { value: 'fullName', label: 'Person Name' },
  { value: 'jobTitle', label: 'Designation / Title' },
  { value: 'companyName', label: 'Company Name' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'phone_2', label: 'Secondary Phone' },
  { value: 'email', label: 'Email Address' },
  { value: 'web', label: 'Website' },
  { value: 'address1', label: 'Address' },
  { value: 'customText', label: 'Custom Text' },
];

export default function ConvertCardToTemplateModal({
  isOpen,
  onClose,
  cards = [],
  onRefreshData,
  showToast,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSide, setActiveSide] = useState('front'); // 'front' | 'back'

  // Front Side State
  const [frontImage, setFrontImage] = useState(null);
  const [frontTemplateJson, setFrontTemplateJson] = useState(null);
  const [frontOrientation, setFrontOrientation] = useState('horizontal');

  // Back Side State (Optional)
  const [backImage, setBackImage] = useState(null);
  const [backTemplateJson, setBackTemplateJson] = useState(null);
  const [backOrientation, setBackOrientation] = useState('horizontal');

  // Extraction Progress & Status
  const [isExtractingOcr, setIsExtractingOcr] = useState(false);
  const [ocrStatusText, setOcrStatusText] = useState('');

  // Template Metadata
  const [title, setTitle] = useState('');
  const [industry, setIndustry] = useState('Corporate & Business');
  const [selectedCardId, setSelectedCardId] = useState(() => (cards && cards[0] ? cards[0].id : null));

  // Preview Modes & Studio State
  const [showBlueprint, setShowBlueprint] = useState(true);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  const frontFileRef = useRef(null);
  const backFileRef = useRef(null);

  useEffect(() => {
    if (cards && cards.length > 0) {
      if (!selectedCardId || !cards.some((c) => String(c.id) === String(selectedCardId))) {
        setSelectedCardId(cards[0].id);
      }
    }
  }, [cards, selectedCardId]);

  if (!isOpen) return null;

  const currentImage = activeSide === 'front' ? frontImage : backImage;
  const currentTemplateJson = activeSide === 'front' ? frontTemplateJson : backTemplateJson;

  const setCurrentTemplateJson = (updated) => {
    if (activeSide === 'front') {
      setFrontTemplateJson(updated);
    } else {
      setBackTemplateJson(updated);
    }
  };

  // Main Processing Pipeline: Preprocess -> OCR -> Plain Card Template Synthesis
  const processCardFile = async (file, side = 'front') => {
    if (!file) return;
    setIsProcessing(true);
    setIsExtractingOcr(true);
    setOcrStatusText(`Analyzing ${side} side geometry & perspective...`);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawDataUrl = e.target.result;

      try {
        // Step 1: Boundary detection, desk removal & orientation
        const preprocessed = await preprocessCardImage(rawDataUrl);
        const { preprocessedDataUrl, orientation } = preprocessed;

        if (side === 'front') {
          setFrontImage(preprocessedDataUrl);
          setFrontOrientation(orientation);
        } else {
          setBackImage(preprocessedDataUrl);
          setBackOrientation(orientation);
        }

        // Auto suggest title if empty
        if (!title && side === 'front') {
          const cleanName = file?.name ? file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : '';
          const formatted = cleanName
            ? cleanName.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            : 'Plain Card Template';
          setTitle(formatted);
        }

        // Step 2: Full Card Synthesis (Preserves real background artwork, curves & exact positions, uses generic placeholders)
        setOcrStatusText(`Extracting layout geometry, artwork graphics & text positions...`);
        const result = await generatePlainCardTemplate({
          imageDataUrl: preprocessedDataUrl,
          userTitle: title || 'Visiting Card Template',
          industry,
          side,
          onProgress: (st) => setOcrStatusText(st),
        });

        if (result && result.plainTemplateJson) {
          if (side === 'front') {
            setFrontTemplateJson(result.plainTemplateJson);
          } else {
            setBackTemplateJson(result.plainTemplateJson);
          }
          setCurrentStep(2); // Jump directly to Review & Studio Step!
          if (showToast) {
            showToast(`✨ Generated ${side} plain card template at exact positions!`, 'success');
          }
        }
      } catch (err) {
        console.error('Error during plain card processing:', err);
        if (showToast) {
          showToast(`Processing notice: ${err?.message || 'Standard template generated'}`, 'info');
        }
      } finally {
        setIsProcessing(false);
        setIsExtractingOcr(false);
        setOcrStatusText('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFrontFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) processCardFile(f, 'front');
  };

  const handleBackFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) processCardFile(f, 'back');
  };

  // Save template into Django backend
  const handleQuickPublish = async () => {
    if (!frontImage || !frontTemplateJson) {
      if (showToast) showToast('Please upload and generate a front card template first.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const matchedCard = (cards || []).find((c) => String(c.id) === String(selectedCardId)) || (cards && cards[0]);
      const cardIdToSend = matchedCard ? Number(matchedCard.id) : (selectedCardId ? Number(selectedCardId) : null);

      const payload = {
        title: (title || '').trim() || 'Plain Visiting Card Template',
        industry: industry || 'Corporate & Business',
        orientation: frontOrientation || 'horizontal',
        card: cardIdToSend,
        primary_color: frontTemplateJson?.background?.accentColor || frontTemplateJson?.background?.color || '#0070ba',
        preview_style: 'card_recreation',
        layout_type: 'card_recreation',
        sample_company: TEMPLATE_PLACEHOLDERS.companyName,
        sample_tagline: TEMPLATE_PLACEHOLDERS.companyMessage,
        sample_name: TEMPLATE_PLACEHOLDERS.fullName,
        sample_job_title: TEMPLATE_PLACEHOLDERS.jobTitle,
        sample_phone: TEMPLATE_PLACEHOLDERS.phone,
        sample_email: TEMPLATE_PLACEHOLDERS.email,
        text_positions: {
          card_recreation: true,
          status: 'PUBLISHED',
          originalScan: frontImage || '',
          backOriginalScan: backImage || '',
          templateJson: frontTemplateJson,
          frontTemplateJson,
          backTemplateJson: backTemplateJson || null,
        },
      };

      await createTemplate(payload);

      if (showToast) {
        showToast(`Template "${payload.title}" published successfully!`, 'success');
      }

      if (onRefreshData) onRefreshData();
      onClose();
    } catch (err) {
      console.error('Failed to save template:', err);
      const errMsg = err?.message || 'Failed to save template. Please try again.';
      if (showToast) showToast(errMsg, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Publish callback from inside Design Studio
  const handlePublishFromStudio = async (publishedData) => {
    try {
      setIsProcessing(true);
      const matchedCard = (cards || []).find((c) => String(c.id) === String(selectedCardId)) || (cards && cards[0]);
      const cardIdToSend = matchedCard ? Number(matchedCard.id) : (selectedCardId ? Number(selectedCardId) : null);

      const payload = {
        title: (title || publishedData.title || 'Plain Card Template').trim(),
        industry: industry || 'Corporate & Business',
        orientation: frontOrientation || 'horizontal',
        card: cardIdToSend,
        primary_color: publishedData.primary_color || '#0070ba',
        layout_type: 'card_recreation',
        preview_style: 'card_recreation',
        sample_company: publishedData.sample_company || TEMPLATE_PLACEHOLDERS.companyName,
        sample_tagline: publishedData.sample_tagline || TEMPLATE_PLACEHOLDERS.companyMessage,
        sample_name: publishedData.sample_name || TEMPLATE_PLACEHOLDERS.fullName,
        sample_job_title: publishedData.sample_job_title || TEMPLATE_PLACEHOLDERS.jobTitle,
        sample_phone: publishedData.sample_phone || TEMPLATE_PLACEHOLDERS.phone,
        sample_email: publishedData.sample_email || TEMPLATE_PLACEHOLDERS.email,
        text_positions: {
          card_recreation: true,
          status: 'PUBLISHED',
          originalScan: frontImage || '',
          backOriginalScan: backImage || '',
          templateJson: publishedData.text_positions?.templateJson || frontTemplateJson,
          frontTemplateJson: publishedData.text_positions?.templateJson || frontTemplateJson,
          backTemplateJson: backTemplateJson || null,
        },
      };

      await createTemplate(payload);
      if (showToast) {
        showToast(`Template "${payload.title}" published successfully!`, 'success');
      }
      if (onRefreshData) onRefreshData();
      setIsStudioOpen(false);
      onClose();
    } catch (err) {
      console.error('Failed to publish template from studio:', err);
      if (showToast) showToast(err?.message || 'Failed to publish template', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // FULLSCREEN DESIGN STUDIO OVERLAY MODE
  if (isStudioOpen) {
    const matchedCard = (cards || []).find((c) => String(c.id) === String(selectedCardId)) || (cards && cards[0]);
    const studioTemplate = {
      id: 'admin_preview_tpl',
      title: title || 'Plain Card Template',
      industry: industry || 'Corporate & Business',
      orientation: frontOrientation || 'horizontal',
      layout_type: 'card_recreation',
      preview_style: 'card_recreation',
      primary_color: frontTemplateJson?.background?.color || '#0070ba',
      sample_name: TEMPLATE_PLACEHOLDERS.fullName,
      sample_job_title: TEMPLATE_PLACEHOLDERS.jobTitle,
      sample_company: TEMPLATE_PLACEHOLDERS.companyName,
      sample_tagline: TEMPLATE_PLACEHOLDERS.companyMessage,
      sample_phone: TEMPLATE_PLACEHOLDERS.phone,
      sample_email: TEMPLATE_PLACEHOLDERS.email,
      sample_web: TEMPLATE_PLACEHOLDERS.web,
      text_positions: {
        card_recreation: true,
        status: 'PUBLISHED',
        templateJson: frontTemplateJson,
      },
    };

    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 999999, background: '#ffffff' }}>
        <VistaprintDesignStudio
          key="admin_studio_preview"
          card={matchedCard}
          template={studioTemplate}
          allCards={cards}
          allTemplates={[]}
          isAdminReview={true}
          onClose={() => setIsStudioOpen(false)}
          onAdminPublishTemplate={handlePublishFromStudio}
        />
      </div>
    );
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal"
        style={{
          maxWidth: 1040,
          width: '95%',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 14,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          className="admin-modal-header"
          style={{
            padding: '14px 24px',
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0070ba 0%, #004494 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                Visiting Card → Plain Card Template Generator
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Extracts graphics, icons & exact positions onto a clean template. Replaces personal data with generic placeholders.
              </p>
            </div>
          </div>

          {/* Side Switcher (Front / Back) & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 6, padding: 2 }}>
              <button
                type="button"
                onClick={() => setActiveSide('front')}
                style={{
                  padding: '4px 10px',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: activeSide === 'front' ? '#0070ba' : 'transparent',
                  color: activeSide === 'front' ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                }}
              >
                Front Side
              </button>
              <button
                type="button"
                onClick={() => setActiveSide('back')}
                style={{
                  padding: '4px 10px',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: activeSide === 'back' ? '#0070ba' : 'transparent',
                  color: activeSide === 'back' ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                }}
              >
                Back Side {backImage ? '✓' : ''}
              </button>
            </div>

            <button type="button" className="admin-modal-close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Step Navigation Strip */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            background: '#f8fafc',
            padding: '4px 24px',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          {[
            { step: 1, label: '1. Upload Card Image' },
            { step: 2, label: '2. Review Plain Template & Open in Studio' },
          ].map((tab) => (
            <button
              key={tab.step}
              type="button"
              onClick={() => (tab.step === 1 || currentTemplateJson) && setCurrentStep(tab.step)}
              disabled={tab.step === 2 && !currentTemplateJson}
              style={{
                background: 'none',
                border: 'none',
                padding: '10px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: currentStep === tab.step ? '#0070ba' : currentTemplateJson ? '#64748b' : '#cbd5e1',
                borderBottom: currentStep === tab.step ? '2px solid #0070ba' : '2px solid transparent',
                cursor: (tab.step === 1 || currentTemplateJson) ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Modal Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* STEP 1: Upload Card Image */}
          {currentStep === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px' }}>
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>
                  Upload Visiting Card ({activeSide.toUpperCase()} SIDE)
                </h4>
                <p style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Upload any card image. The engine detects graphics, contact icons, and exact positions, and creates a clean plain card template with generic placeholders.
                </p>

                {/* Dropzone */}
                <div
                  onClick={() => (activeSide === 'front' ? frontFileRef.current?.click() : backFileRef.current?.click())}
                  style={{
                    border: '2px dashed #0070ba',
                    borderRadius: 12,
                    background: '#f0f9ff',
                    padding: '28px 16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <input
                    type="file"
                    ref={activeSide === 'front' ? frontFileRef : backFileRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={activeSide === 'front' ? handleFrontFileChange : handleBackFileChange}
                  />
                  <UploadCloud size={38} color="#0070ba" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                    {currentImage ? `Click to Replace ${activeSide.toUpperCase()} Card Image` : `Upload ${activeSide.toUpperCase()} Card Image`}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                    JPG, PNG, WebP &bull; Any layout, color, or design
                  </div>
                </div>

                {/* Metadata & Title */}
                <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="admin-form-group">
                    <label>Template Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Modern Executive Card Template"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Industry Category</label>
                    <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                      {INDUSTRY_OPTIONS.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Uploaded Card Preview / Extraction Status */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 280,
                }}
              >
                {currentImage ? (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        borderRadius: 8,
                        overflow: 'hidden',
                        boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                        border: '1px solid #cbd5e1',
                      }}
                    >
                      <img src={currentImage} alt="Card Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>

                    {isExtractingOcr && (
                      <div style={{ padding: '8px 12px', background: '#eff6ff', borderRadius: 6, border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#1e40af' }}>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>{ocrStatusText || 'Analyzing card structure & exact positions...'}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                    <UploadCloud size={44} style={{ opacity: 0.4, margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Card Image Preview</div>
                    <div style={{ fontSize: '0.74rem' }}>Upload an image on the left to extract plain template</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: DUAL VIEW (ORIGINAL VS PLAIN CARD TEMPLATE) + DESIGN STUDIO LAUNCH */}
          {currentStep === 2 && currentTemplateJson && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Header with Blueprint toggle & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    Plain Card Template ({activeSide.toUpperCase()} SIDE)
                  </h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Graphics, contact icons & exact positions preserved. Personal data replaced with clean template placeholders.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowBlueprint(!showBlueprint)}
                    style={{
                      padding: '6px 12px',
                      background: showBlueprint ? '#e0f2fe' : '#ffffff',
                      color: showBlueprint ? '#0284c7' : '#475569',
                      border: showBlueprint ? '1.5px solid #7dd3fc' : '1px solid #cbd5e1',
                      borderRadius: 6,
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Tag size={13} /> {showBlueprint ? 'Hide Blueprint Tags' : 'Show Blueprint Tags'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsStudioOpen(true)}
                    style={{
                      padding: '8px 18px',
                      background: 'linear-gradient(135deg, #0070ba 0%, #2563eb 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(0, 112, 186, 0.3)',
                    }}
                  >
                    <ExternalLink size={14} /> Open in Design Studio to Edit & Review
                  </button>
                </div>
              </div>

              {/* DUAL VIEW COMPARISON */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
                {/* 1. ORIGINAL SCAN REFERENCE */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8' }} />
                    ORIGINAL UPLOADED CARD (REFERENCE)
                  </div>
                  <div style={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #cbd5e1' }}>
                    <img src={currentImage} alt="Original Scan" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                </div>

                {/* 2. PLAIN CARD TEMPLATE AT EXACT POSITIONS */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0284c7', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284c7' }} />
                    GENERATED PLAIN TEMPLATE (EXACT POSITIONS & ICONS)
                  </div>
                  <PlainCardPreview templateJson={currentTemplateJson} showBlueprint={showBlueprint} />
                </div>
              </div>

              {/* Discovered Element Coordinates Table */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ background: '#f1f5f9', padding: '8px 14px', fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>
                  Detected Layout Elements ({currentTemplateJson.elements?.length || 0})
                </div>
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                        <th style={{ padding: '6px 12px' }}>Role</th>
                        <th style={{ padding: '6px 12px' }}>Placeholder Value</th>
                        <th style={{ padding: '6px 12px' }}>Position (X, Y)</th>
                        <th style={{ padding: '6px 12px' }}>Icon</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(currentTemplateJson.elements || []).map((el, idx) => (
                        <tr key={el.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '6px 12px', fontWeight: 700, color: '#0284c7' }}>
                            {el.role ? `[${el.role.toUpperCase()}]` : '[FIELD]'}
                          </td>
                          <td style={{ padding: '6px 12px', color: '#1e293b' }}>
                            {el.content || el.value || 'Logo / Graphic'}
                          </td>
                          <td style={{ padding: '6px 12px', color: '#64748b' }}>
                            x: {Math.round(el.x)}, y: {Math.round(el.y)}
                          </td>
                          <td style={{ padding: '6px 12px', color: '#475569' }}>
                            {el.icon ? `${el.icon} icon` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div
          className="admin-modal-footer"
          style={{
            padding: '12px 24px',
            borderTop: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            {currentStep === 2 && (
              <button
                type="button"
                className="admin-btn secondary"
                onClick={() => setCurrentStep(1)}
                style={{ fontSize: '0.8rem' }}
              >
                ← Back to Upload
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button type="button" className="admin-btn secondary" onClick={onClose} style={{ fontSize: '0.8rem' }}>
              Cancel
            </button>

            {currentStep === 2 && (
              <>
                <button
                  type="button"
                  className="admin-btn"
                  onClick={handleQuickPublish}
                  disabled={isProcessing}
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    padding: '8px 18px',
                    borderRadius: 6,
                  }}
                >
                  {isProcessing ? 'Publishing...' : '✓ Quick Publish Template'}
                </button>

                <button
                  type="button"
                  className="admin-btn primary"
                  onClick={() => setIsStudioOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #0070ba 0%, #2563eb 100%)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <ExternalLink size={14} /> Open in Design Studio
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
