import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  UploadCloud,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Layers,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Edit3,
  Sliders,
  Code,
  Tag,
  Plus,
  Trash2,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';
import { createTemplate } from '../../api';
import { preprocessCardImage } from '../../utils/cardPreprocessingEngine';
import { segmentCardElements } from '../../utils/cardSegmentationEngine';
import { buildHybridTemplateJson } from '../../utils/templateBuilderService';
import { runAutoRefinementLoop, computeVisualComparison } from '../../utils/visualComparisonService';
import InteractiveTemplateCanvas from './InteractiveTemplateCanvas';
import OriginalVsGeneratedOverlay from './OriginalVsGeneratedOverlay';

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
  { value: 'personName', label: 'Person Name' },
  { value: 'designation', label: 'Designation' },
  { value: 'companyName', label: 'Company Name' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'email', label: 'Email Address' },
  { value: 'website', label: 'Website' },
  { value: 'address', label: 'Address' },
  { value: 'tagline', label: 'Tagline' },
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
  const [frontCleanBg, setFrontCleanBg] = useState('');
  const [frontTemplateJson, setFrontTemplateJson] = useState(null);
  const [frontRenderedUrl, setFrontRenderedUrl] = useState('');
  const [frontDiffImageUrl, setFrontDiffImageUrl] = useState('');
  const [frontSimilarityScore, setFrontSimilarityScore] = useState(96.5);
  const [frontOrientation, setFrontOrientation] = useState('horizontal');

  // Back Side State (Optional)
  const [backImage, setBackImage] = useState(null);
  const [backCleanBg, setBackCleanBg] = useState('');
  const [backTemplateJson, setBackTemplateJson] = useState(null);
  const [backRenderedUrl, setBackRenderedUrl] = useState('');
  const [backDiffImageUrl, setBackDiffImageUrl] = useState('');
  const [backSimilarityScore, setBackSimilarityScore] = useState(96.5);
  const [backOrientation, setBackOrientation] = useState('horizontal');

  // Extraction Progress & Status
  const [isExtractingOcr, setIsExtractingOcr] = useState(false);
  const [ocrStatusText, setOcrStatusText] = useState('');
  const [ocrExtractedCount, setOcrExtractedCount] = useState(0);

  // Template Metadata
  const [title, setTitle] = useState('');
  const [industry, setIndustry] = useState('Corporate & Business');
  const [selectedCardId, setSelectedCardId] = useState(() => (cards && cards[0] ? cards[0].id : null));
  const [templateStatus, setTemplateStatus] = useState('NEEDS_REVIEW'); // 'NEEDS_REVIEW' | 'APPROVED' | 'PUBLISHED'
  const [showJsonViewer, setShowJsonViewer] = useState(false);

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

  // Active side references
  const currentImage = activeSide === 'front' ? frontImage : backImage;
  const currentTemplateJson = activeSide === 'front' ? frontTemplateJson : backTemplateJson;
  const currentRenderedUrl = activeSide === 'front' ? frontRenderedUrl : backRenderedUrl;
  const currentDiffImageUrl = activeSide === 'front' ? frontDiffImageUrl : backDiffImageUrl;
  const currentSimilarity = activeSide === 'front' ? frontSimilarityScore : backSimilarityScore;
  const currentOrientation = activeSide === 'front' ? frontOrientation : backOrientation;

  const setCurrentTemplateJson = (updated) => {
    if (activeSide === 'front') {
      setFrontTemplateJson(updated);
    } else {
      setBackTemplateJson(updated);
    }
  };

  // Main Processing Pipeline: Preprocess -> Segment -> Inpaint -> Hybrid Template -> Visual Verification
  const processCardFile = async (file, side = 'front') => {
    if (!file) return;
    setIsProcessing(true);
    setIsExtractingOcr(true);
    setOcrStatusText(`Analyzing ${side} side geometry, boundary & perspective...`);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawDataUrl = e.target.result;

      try {
        // Step 1: Boundary detection, desk removal & dynamic natural aspect ratio
        const preprocessed = await preprocessCardImage(rawDataUrl);
        const { preprocessedDataUrl, canvasWidth, canvasHeight, aspectRatio, orientation } = preprocessed;

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
            : 'Custom Card Template';
          setTitle(formatted);
        }

        // Step 2: Full-Canvas Decomposition & Background Inpainting
        setOcrStatusText(`Decomposing ${side} artwork: Text, Logo, QR & Clean Background...`);
        const segmented = await segmentCardElements(
          preprocessedDataUrl,
          { canvasWidth, canvasHeight },
          (status) => setOcrStatusText(status)
        );

        if (side === 'front') {
          setFrontCleanBg(segmented.cleanBackgroundUrl);
          setOcrExtractedCount(segmented.texts?.length || 0);
        } else {
          setBackCleanBg(segmented.cleanBackgroundUrl);
        }

        // Step 3: Build Canonical Hybrid Template JSON
        const hybridJson = buildHybridTemplateJson({
          preprocessedMeta: preprocessed,
          segmentedData: segmented,
          userMetadata: {
            title: title || 'Custom Visiting Card Template',
            industry,
            cardId: selectedCardId,
            status: 'NEEDS_REVIEW',
          },
          originalSourceImage: rawDataUrl,
          side,
        });

        // Step 4: Visual Auto-Refinement Loop & Difference Heatmap Calculation
        setOcrStatusText(`Running visual similarity & micro-alignment verification...`);
        const refinement = await runAutoRefinementLoop(
          preprocessedDataUrl,
          hybridJson,
          3,
          (status) => setOcrStatusText(status)
        );

        if (side === 'front') {
          setFrontTemplateJson(refinement.refinedTemplateJson);
          setFrontRenderedUrl(refinement.renderedDataUrl);
          setFrontDiffImageUrl(refinement.diffImageUrl);
          setFrontSimilarityScore(refinement.similarityScore);
        } else {
          setBackTemplateJson(refinement.refinedTemplateJson);
          setBackRenderedUrl(refinement.renderedDataUrl);
          setBackDiffImageUrl(refinement.diffImageUrl);
          setBackSimilarityScore(refinement.similarityScore);
        }

        if (showToast) {
          showToast(`✨ Generated ${side} template with ${refinement.similarityScore}% visual match!`, 'success');
        }
      } catch (err) {
        console.error('Error during card processing:', err);
        if (showToast) {
          showToast(`Processing note: ${err?.message || 'Standard template generated'}`, 'info');
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
  const handleSaveTemplate = async () => {
    if (!frontImage || !frontTemplateJson) {
      if (showToast) showToast('Please upload and generate a front card template first.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const matchedCard = (cards || []).find((c) => String(c.id) === String(selectedCardId)) || (cards && cards[0]);
      const cardIdToSend = matchedCard ? Number(matchedCard.id) : (selectedCardId ? Number(selectedCardId) : null);

      // Extract sample fields dynamically from discovered elements
      const frontElements = frontTemplateJson?.elements || [];
      const sampleNameEl = frontElements.find((e) => e.field === 'personName' || e.role === 'personName');
      const sampleCompanyEl = frontElements.find((e) => e.field === 'companyName' || e.role === 'companyName');
      const sampleTitleEl = frontElements.find((e) => e.field === 'designation' || e.role === 'designation');
      const samplePhoneEl = frontElements.find((e) => e.field?.startsWith('phone') || e.role?.startsWith('phone'));
      const sampleEmailEl = frontElements.find((e) => e.field?.startsWith('email') || e.role?.startsWith('email'));
      const sampleTaglineEl = frontElements.find((e) => e.field === 'tagline' || e.role === 'tagline');

      const payload = {
        title: (title || '').trim() || (sampleCompanyEl ? `${sampleCompanyEl.content} Template` : 'Visiting Card Template'),
        industry: industry || 'Corporate & Business',
        orientation: frontOrientation || 'horizontal',
        card: cardIdToSend,
        primary_color: frontTemplateJson?.background?.primaryColor || '#0070ba',
        color_palette: (frontTemplateJson?.background?.palette || ['#0070ba', '#1e293b']).join(','),
        preview_style: 'card_recreation',
        layout_type: 'card_recreation',
        sample_company: sampleCompanyEl ? sampleCompanyEl.content : '',
        sample_tagline: sampleTaglineEl ? sampleTaglineEl.content : '',
        sample_name: sampleNameEl ? sampleNameEl.content : '',
        sample_job_title: sampleTitleEl ? sampleTitleEl.content : '',
        sample_phone: samplePhoneEl ? samplePhoneEl.content : '',
        sample_email: sampleEmailEl ? sampleEmailEl.content : '',
        background_image: frontCleanBg || frontImage,
        back_background_image: backCleanBg || backImage || '',
        text_positions: {
          card_recreation: true,
          status: templateStatus,
          similarityScore: frontSimilarityScore,
          cleanArtwork: frontCleanBg || frontImage,
          backCleanArtwork: backCleanBg || backImage || '',
          originalScan: frontImage || '',
          backOriginalScan: backImage || '',
          renderedPreview: frontRenderedUrl || '',
          templateJson: frontTemplateJson,
          frontTemplateJson,
          backTemplateJson: backTemplateJson || null,
        },
      };

      await createTemplate(payload);

      if (showToast) {
        showToast(`Template "${payload.title}" saved successfully with status [${templateStatus}]!`, 'success');
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

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal"
        style={{
          maxWidth: 960,
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
                Generic Card Image → Editable Template Engine
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Upload ANY visiting card. Automatically reconstructs background, logo, QR & editable fields.
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
            overflowX: 'auto',
          }}
        >
          {[
            { step: 1, label: 'Upload & Boundary Detection', enabled: true },
            { step: 2, label: 'Discovered Elements', enabled: Boolean(currentImage && currentTemplateJson) },
            { step: 3, label: 'Canvas Editor & Corrections', enabled: Boolean(currentImage && currentTemplateJson) },
            { step: 4, label: 'Visual Verification & Publishing', enabled: Boolean(currentImage && currentTemplateJson) },
          ].map((tab) => (
            <button
              key={tab.step}
              type="button"
              onClick={() => tab.enabled && setCurrentStep(tab.step)}
              disabled={!tab.enabled}
              style={{
                background: 'none',
                border: 'none',
                padding: '10px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: currentStep === tab.step ? '#0070ba' : tab.enabled ? '#64748b' : '#cbd5e1',
                borderBottom: currentStep === tab.step ? '2px solid #0070ba' : '2px solid transparent',
                cursor: tab.enabled ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: currentStep === tab.step ? '#0070ba' : tab.enabled ? '#e2e8f0' : '#f1f5f9',
                  color: currentStep === tab.step ? '#fff' : '#64748b',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                {tab.step}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Modal Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* STEP 1: Upload Card Image(s) */}
          {currentStep === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px' }}>
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>
                  1. Upload Visiting Card ({activeSide.toUpperCase()} SIDE)
                </h4>
                <p style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Upload ANY visiting card image. The engine automatically finds edges, straightens skew, in-paints text, and extracts all elements.
                </p>

                {/* Front Image Dropzone */}
                <div
                  onClick={() => (activeSide === 'front' ? frontFileRef.current?.click() : backFileRef.current?.click())}
                  style={{
                    border: '2px dashed #0070ba',
                    borderRadius: 12,
                    background: '#f0f9ff',
                    padding: '28px 16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="file"
                    ref={activeSide === 'front' ? frontFileRef : backFileRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={activeSide === 'front' ? handleFrontFileChange : handleBackFileChange}
                  />
                  <UploadCloud size={36} color="#0070ba" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                    {currentImage ? `Click to Replace ${activeSide.toUpperCase()} Image` : `Upload ${activeSide.toUpperCase()} Card Image`}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                    JPG, PNG, WebP &bull; Any size, ratio, or orientation
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
                      placeholder="e.g. Acme Tech Visiting Card"
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

              {/* Preview Column */}
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

                    {isExtractingOcr ? (
                      <div style={{ padding: '8px 12px', background: '#eff6ff', borderRadius: 6, border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#1e40af' }}>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>{ocrStatusText || 'Analyzing card...'}</span>
                      </div>
                    ) : (
                      <div style={{ padding: '8px 12px', background: '#f0fdf4', borderRadius: 6, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#166534' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={15} color="#16a34a" />
                          <span><strong>{ocrExtractedCount} Elements Discovered!</strong></span>
                        </div>
                        <button
                          type="button"
                          onClick={() => processCardFile(null, activeSide)}
                          style={{ background: 'none', border: 'none', color: '#0070ba', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Re-scan
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                    <ImageIcon size={44} style={{ opacity: 0.4, margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Card Image Preview</div>
                    <div style={{ fontSize: '0.74rem' }}>Upload an image on the left to see dynamic extraction</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Dynamically Discovered Elements List */}
          {currentStep === 2 && currentTemplateJson && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: '#0f172a' }}>
                    Discovered Elements & Variables ({activeSide.toUpperCase()} SIDE)
                  </h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Every text line, logo, and QR code discovered on the card. Change variable roles or edit text directly.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newEl = {
                      id: `text-add-${Date.now()}`,
                      type: 'text',
                      role: 'customText',
                      field: 'customText',
                      content: 'Custom Field',
                      defaultValue: 'Custom Field',
                      x: 100,
                      y: 100,
                      width: 180,
                      height: 28,
                      fontSize: 16,
                      color: '#ffffff',
                    };
                    setCurrentTemplateJson({
                      ...currentTemplateJson,
                      elements: [...(currentTemplateJson.elements || []), newEl],
                    });
                  }}
                  style={{
                    padding: '6px 12px',
                    background: '#0070ba',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Plus size={13} /> Add Element
                </button>
              </div>

              {/* Elements Table */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                      <th style={{ padding: '8px 12px' }}>Role / Variable</th>
                      <th style={{ padding: '8px 12px' }}>Detected Content</th>
                      <th style={{ padding: '8px 12px' }}>Coordinates (X, Y)</th>
                      <th style={{ padding: '8px 12px' }}>Font Size</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(currentTemplateJson.elements || []).map((el, idx) => (
                      <tr key={el.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 12px' }}>
                          <select
                            value={el.role || el.field || 'customText'}
                            onChange={(e) => {
                              const roleVal = e.target.value;
                              const updated = (currentTemplateJson.elements || []).map((item) =>
                                item.id === el.id ? { ...item, role: roleVal, field: roleVal } : item
                              );
                              setCurrentTemplateJson({ ...currentTemplateJson, elements: updated });
                            }}
                            style={{ padding: '3px 6px', fontSize: '0.74rem', border: '1px solid #cbd5e1', borderRadius: 4, fontWeight: 700 }}
                          >
                            {FIELD_ROLE_TAGS.map((t) => (
                              <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '8px 12px' }}>
                          {el.type === 'text' ? (
                            <input
                              type="text"
                              value={el.content || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const updated = (currentTemplateJson.elements || []).map((item) =>
                                  item.id === el.id ? { ...item, content: val, defaultValue: val } : item
                                );
                                setCurrentTemplateJson({ ...currentTemplateJson, elements: updated });
                              }}
                              style={{ width: '90%', padding: '3px 6px', fontSize: '0.76rem', border: '1px solid #cbd5e1', borderRadius: 4 }}
                            />
                          ) : el.type === 'qr' ? (
                            <span style={{ color: '#0284c7', fontWeight: 600 }}>QR Code: {el.value || 'URL'}</span>
                          ) : (
                            <span style={{ color: '#7c3aed', fontWeight: 600 }}>Image / Graphic Layer</span>
                          )}
                        </td>
                        <td style={{ padding: '8px 12px', color: '#64748b' }}>
                          ({el.x}, {el.y})
                        </td>
                        <td style={{ padding: '8px 12px', color: '#64748b' }}>
                          {el.fontSize ? `${el.fontSize}px` : '-'}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (currentTemplateJson.elements || []).filter((item) => item.id !== el.id);
                              setCurrentTemplateJson({ ...currentTemplateJson, elements: updated });
                            }}
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 2 }}
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 3: Canvas Editor & Interactive Corrections */}
          {currentStep === 3 && currentTemplateJson && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Edit3 size={17} color="#0070ba" />
                    Interactive Canvas Editor ({activeSide.toUpperCase()} SIDE)
                  </h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Drag elements across the card. Double-click any text to edit inline. Use toolbar to add new texts or shapes.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowJsonViewer(!showJsonViewer)}
                    style={{
                      padding: '5px 10px',
                      background: showJsonViewer ? '#0f172a' : '#f1f5f9',
                      color: showJsonViewer ? '#38bdf8' : '#334155',
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Code size={12} /> {showJsonViewer ? 'Hide JSON' : 'Template JSON'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    style={{
                      padding: '5px 12px',
                      background: '#0070ba',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>Verify (Original ≈ Generated)</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Interactive Canvas Editor Component */}
              <InteractiveTemplateCanvas
                templateJson={currentTemplateJson}
                onChange={setCurrentTemplateJson}
              />

              {/* Optional JSON Viewer */}
              {showJsonViewer && (
                <div style={{ background: '#0f172a', borderRadius: 8, padding: '12px', border: '1px solid #1e293b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#38bdf8' }}>
                      Canonical Template Schema (v2)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(currentTemplateJson, null, 2));
                        if (showToast) showToast('Template JSON copied!', 'success');
                      }}
                      style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', padding: '2px 6px', fontSize: '0.7rem', borderRadius: 4, cursor: 'pointer' }}
                    >
                      Copy
                    </button>
                  </div>
                  <pre style={{ margin: 0, fontSize: '0.72rem', color: '#cbd5e1', maxHeight: 200, overflowY: 'auto' }}>
                    {JSON.stringify(currentTemplateJson, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Visual Verification & Comparison */}
          {currentStep === 4 && currentTemplateJson && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sliders size={17} color="#0070ba" />
                    Visual Verification: ORIGINAL ≈ GENERATED ({activeSide.toUpperCase()} SIDE)
                  </h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Validate pixel alignment using Side-by-Side, Overlay Slider, or Difference Heatmap modes.
                  </p>
                </div>

                {/* Publishing Status Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569' }}>Target Status:</span>
                  <select
                    value={templateStatus}
                    onChange={(e) => setTemplateStatus(e.target.value)}
                    style={{ fontSize: '0.76rem', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: 4, fontWeight: 700 }}
                  >
                    <option value="NEEDS_REVIEW">NEEDS_REVIEW</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                  </select>
                </div>
              </div>

              {/* 5-Mode Comparison Component */}
              <OriginalVsGeneratedOverlay
                originalImageUrl={currentImage}
                templateJson={currentTemplateJson}
                renderedImageUrl={currentRenderedUrl}
                diffImageUrl={currentDiffImageUrl}
                similarityScore={currentSimilarity}
                detectedOrientation={currentOrientation}
              />
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div
          className="admin-modal-footer"
          style={{
            padding: '12px 24px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {currentStep > 1 ? (
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="admin-btn-secondary" onClick={onClose}>
              Cancel
            </button>

            {currentStep < 4 ? (
              <>
                {currentStep >= 2 && (
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={handleSaveTemplate}
                    disabled={isProcessing || !frontImage}
                    style={{ borderColor: '#0070ba', color: '#0070ba' }}
                  >
                    <Check size={14} />
                    <span>Quick Save</span>
                  </button>
                )}
                <button
                  type="button"
                  className="admin-btn-primary"
                  disabled={!frontImage}
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  style={{ opacity: frontImage ? 1 : 0.5, cursor: frontImage ? 'pointer' : 'not-allowed' }}
                >
                  <span>Continue to Step {currentStep + 1}</span>
                  <ArrowRight size={14} />
                </button>
              </>
            ) : (
              <button
                type="button"
                className="admin-btn-primary"
                onClick={handleSaveTemplate}
                disabled={isProcessing}
                style={{
                  background: 'linear-gradient(135deg, #0070ba 0%, #004494 100%)',
                  border: 'none',
                }}
              >
                <Sparkles size={14} />
                <span>{isProcessing ? 'Saving Template...' : `Save & Set as [${templateStatus}]`}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
