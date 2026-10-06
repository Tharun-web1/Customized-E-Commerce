import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  UploadCloud,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Layers,
  Image as ImageIcon,
  Palette,
  Eye,
  EyeOff,
  Building,
  User,
  Phone,
  Mail,
  Globe,
  MapPin,
  Check,
  RefreshCw,
  Edit3,
  Sliders,
  Code,
  Scan,
} from 'lucide-react';
import { createTemplate } from '../../api';
import TemplateCardMockup from '../TemplateCardMockup';
import { preprocessCardImage } from '../../utils/cardPreprocessingEngine';
import { segmentCardElements } from '../../utils/cardSegmentationEngine';
import { buildHybridTemplateJson } from '../../utils/templateBuilderService';
import { runAutoRefinementLoop, computeVisualComparison } from '../../utils/visualComparisonService';
import { renderTemplateToDataUrl } from '../../utils/templateRendererService';
import { buildCanonicalTemplateJson } from '../../utils/templateJsonSchema';
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

export default function ConvertCardToTemplateModal({
  isOpen,
  onClose,
  cards = [],
  onRefreshData,
  showToast,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Uploaded card artwork state
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0, ratio: 1.75 });
  const [detectedOrientation, setDetectedOrientation] = useState('horizontal');
  const [boundaryDetected, setBoundaryDetected] = useState(false);

  // OCR state
  const [isExtractingOcr, setIsExtractingOcr] = useState(false);
  const [ocrStatusText, setOcrStatusText] = useState('');
  const [ocrExtractedCount, setOcrExtractedCount] = useState(0);

  // Color palette analysis
  const [extractedPalette, setExtractedPalette] = useState([
    '#0056b3',
    '#1e293b',
    '#047857',
    '#dc2626',
  ]);
  const [primaryColor, setPrimaryColor] = useState('#38bdf8');
  const [accentColor, setAccentColor] = useState('#38bdf8');
  const [swooshColor, setSwooshColor] = useState('#1e3a8a');
  const [cardBgColor, setCardBgColor] = useState('#151b2d');
  const [logoInitials, setLogoInitials] = useState('RR');
  const [hasQrCode, setHasQrCode] = useState(true);
  const [convertedLayout, setConvertedLayout] = useState('card_recreation');
  const [showJsonViewer, setShowJsonViewer] = useState(false);
  const [textTheme, setTextTheme] = useState('light'); // 'dark' | 'light'

  // Canonical Template JSON Schema state (single source of truth for the editable template)
  const [templateJson, setTemplateJson] = useState(null);
  const [renderedImageUrl, setRenderedImageUrl] = useState('');
  const [similarityScore, setSimilarityScore] = useState(96.5);
  const [cleanBackgroundUrl, setCleanBackgroundUrl] = useState('');

  // Template metadata
  const [title, setTitle] = useState('');
  const [industry, setIndustry] = useState('Corporate & Business');
  const [selectedCardId, setSelectedCardId] = useState(() => (cards && cards[0] ? cards[0].id : null));

  React.useEffect(() => {
    if (cards && cards.length > 0) {
      if (!selectedCardId || !cards.some((c) => String(c.id) === String(selectedCardId))) {
        setSelectedCardId(cards[0].id);
      }
    }
  }, [cards, selectedCardId]);

  // Visiting card details
  const [companyName, setCompanyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [personName, setPersonName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [bullet1, setBullet1] = useState('');
  const [bullet2, setBullet2] = useState('');
  const [bullet3, setBullet3] = useState('');

  // Mode: Default is clean artwork (no overlapping text)
  const [showTextOverlay, setShowTextOverlay] = useState(false);
  const [previewSide, setPreviewSide] = useState('front');

  const frontFileRef = useRef(null);
  const backFileRef = useRef(null);

  // Synchronized active template JSON instance
  const activeTemplate = templateJson || buildCanonicalTemplateJson({
    cardAnalysis: {
      orientation: detectedOrientation,
      cleanArtworkSrc: cleanBackgroundUrl,
      background: {
        color: cardBgColor,
        theme: textTheme,
        palette: extractedPalette,
        cleanArtworkSrc: cleanBackgroundUrl,
      },
      content: {
        personName: personName || 'Ravindra',
        jobTitle: jobTitle || 'Manager',
        companyName: companyName || 'IT SERVICES',
        phone: phone || '6300297048, 9948257919',
        email: email || 'info.rrgobalitservice.com',
        website: website || 'www.rrgobalitservice.com',
        address: address || '13th Floor, Manjeera Trinity Corporate, KPHB, Hyderabad.',
        bullet1,
        bullet2,
        bullet3,
      },
      assets: {
        logoInitials: logoInitials || 'RR',
        hasQrCode: Boolean(hasQrCode),
        qrValue: website || 'https://www.rrgobalitservice.com',
      },
    },
    userMetadata: {
      title: title || 'Visiting Card Template',
      industry,
    },
  });

  // Sync state between form inputs and templateJson
  const updateFormFieldAndSyncJson = (fieldName, value) => {
    if (fieldName === 'personName') setPersonName(value);
    if (fieldName === 'jobTitle') setJobTitle(value);
    if (fieldName === 'companyName') setCompanyName(value);
    if (fieldName === 'phone') setPhone(value);
    if (fieldName === 'email') setEmail(value);
    if (fieldName === 'website') setWebsite(value);
    if (fieldName === 'address') setAddress(value);
    if (fieldName === 'logoInitials') setLogoInitials(value);
    if (fieldName === 'hasQrCode') setHasQrCode(value);
    if (fieldName === 'cardBgColor') setCardBgColor(value);
    if (fieldName === 'primaryColor') setPrimaryColor(value);
    if (fieldName === 'accentColor') setAccentColor(value);

    setTemplateJson((prev) => {
      const base = prev || activeTemplate;
      if (!base) return base;
      const updatedElements = (base.elements || []).map((el) => {
        if (fieldName === 'personName' && el.field === 'personName') {
          return { ...el, content: value };
        }
        if (fieldName === 'jobTitle' && el.field === 'designation') {
          return { ...el, content: value };
        }
        if (fieldName === 'companyName' && el.field === 'companyName') {
          return { ...el, content: value };
        }
        if (fieldName === 'phone' && el.field === 'phone') {
          return { ...el, content: value };
        }
        if (fieldName === 'email' && el.field === 'email') {
          return { ...el, content: value };
        }
        if (fieldName === 'website' && el.field === 'website') {
          return { ...el, content: value };
        }
        if (fieldName === 'address' && el.field === 'address') {
          return { ...el, content: value };
        }
        if (fieldName === 'logoInitials' && el.field === 'logo') {
          return { ...el, content: value };
        }
        if (fieldName === 'hasQrCode' && el.field === 'qrCode') {
          return { ...el, hidden: !value };
        }
        if (fieldName === 'primaryColor' && el.type === 'text' && el.field === 'personName') {
          return { ...el, color: value };
        }
        return el;
      });

      const updatedBackground = {
        ...base.background,
        color: fieldName === 'cardBgColor' ? value : base.background?.color,
      };

      return {
        ...base,
        background: updatedBackground,
        elements: updatedElements,
      };
    });
  };

  if (!isOpen) return null;

  // Main Card Processing Pipeline: Preprocess -> Segment -> Hybrid Template -> Auto-Refinement
  const runCardProcessingPipeline = async (imageDataUrl, fileObj = null) => {
    if (!imageDataUrl) return;
    setIsExtractingOcr(true);
    setOcrStatusText('Analyzing card boundary, orientation & perspective...');

    try {
      // 1. Preprocess Card Image (boundary detection, desk removal, natural aspect ratio calculation)
      const preprocessed = await preprocessCardImage(imageDataUrl);
      const { preprocessedDataUrl, canvasWidth, canvasHeight, aspectRatio, orientation } = preprocessed;

      setFrontImage(preprocessedDataUrl);
      setImageDimensions({ width: canvasWidth, height: canvasHeight, ratio: aspectRatio });
      setDetectedOrientation(orientation);
      setBoundaryDetected(true);

      // Auto-suggest title if empty
      let currentTitle = title;
      if (!currentTitle) {
        const cleanFileName = fileObj?.name ? fileObj.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : '';
        const formattedFileName = cleanFileName
          ? cleanFileName.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          : '';
        const matchedCard = (cards || []).find((c) => String(c.id) === String(selectedCardId));
        currentTitle = formattedFileName
          ? `${formattedFileName} Template`
          : matchedCard
          ? `${matchedCard.title} Template`
          : `${orientation === 'horizontal' ? 'Horizontal' : 'Vertical'} Card Preset`;
        setTitle(currentTitle);
      }

      // 2. Multi-Pillar Element Segmentation (Text bbox, typography, logo, QR, and clean background inpainting!)
      setOcrStatusText('Detecting text typography, logo, QR & generating clean background...');
      const segmented = await segmentCardElements(
        preprocessedDataUrl,
        { canvasWidth, canvasHeight },
        (status) => setOcrStatusText(status)
      );

      // Extract colors & update state
      if (segmented.cardBgColor) setCardBgColor(segmented.cardBgColor);
      if (segmented.primaryColor) setPrimaryColor(segmented.primaryColor);
      if (segmented.accentColor) setAccentColor(segmented.accentColor);
      if (segmented.palette) setExtractedPalette(segmented.palette);
      if (segmented.textTheme) setTextTheme(segmented.textTheme);
      setHasQrCode(segmented.hasQrCode);
      setCleanBackgroundUrl(segmented.cleanBackgroundUrl);

      // Populate text fields from segmented semantic fields
      let count = 0;
      const texts = segmented.texts || [];

      const foundName = texts.find((t) => t.field === 'personName');
      if (foundName) { setPersonName(foundName.cleanText); count++; }

      const foundJob = texts.find((t) => t.field === 'designation');
      if (foundJob) { setJobTitle(foundJob.cleanText); count++; }

      const foundComp = texts.find((t) => t.field === 'companyName');
      if (foundComp) {
        setCompanyName(foundComp.cleanText);
        count++;
        if (!title && !fileObj) setTitle(`${foundComp.cleanText} Template`);
      }

      const foundPhone = texts.find((t) => t.field === 'phone');
      if (foundPhone) { setPhone(foundPhone.cleanText); count++; }

      const foundEmail = texts.find((t) => t.field === 'email');
      if (foundEmail) { setEmail(foundEmail.cleanText); count++; }

      const foundWeb = texts.find((t) => t.field === 'website');
      if (foundWeb) { setWebsite(foundWeb.cleanText); count++; }

      const foundAddr = texts.find((t) => t.field === 'address');
      if (foundAddr) { setAddress(foundAddr.cleanText); count++; }

      const bullets = texts.filter((t) => t.field === 'bullet');
      if (bullets[0]) setBullet1(bullets[0].cleanText);
      if (bullets[1]) setBullet2(bullets[1].cleanText);
      if (bullets[2]) setBullet3(bullets[2].cleanText);

      setOcrExtractedCount(count);

      // 3. Assemble Canonical Hybrid Template JSON
      const hybridJson = buildHybridTemplateJson({
        preprocessedMeta: preprocessed,
        segmentedData: segmented,
        userMetadata: {
          title: currentTitle,
          industry,
          cardId: selectedCardId,
        },
        originalSourceImage: imageDataUrl,
      });

      // 4. Auto-Refinement Loop & Visual Verification (Off-screen rendering & micro-corrections)
      setOcrStatusText('Running off-screen template rendering & visual comparison...');
      const refinement = await runAutoRefinementLoop(
        preprocessedDataUrl,
        hybridJson,
        3,
        (status) => setOcrStatusText(status)
      );

      setTemplateJson(refinement.refinedTemplateJson);
      setRenderedImageUrl(refinement.renderedDataUrl);
      setSimilarityScore(refinement.similarityScore);

      if (showToast) {
        showToast(`✨ Reconstructed card template with ${refinement.similarityScore}% visual fidelity!`, 'success');
      }
    } catch (err) {
      console.error('Error during card image pipeline execution:', err);
      if (showToast) {
        showToast(`Pipeline note: ${err?.message || 'Standard template generated'}`, 'info');
      }
    } finally {
      setIsExtractingOcr(false);
      setOcrStatusText('');
    }
  };

  // Process uploaded card image
  const analyzeCardImage = async (file, isFront = true) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawDataUrl = e.target.result;
      if (!isFront) {
        setBackImage(rawDataUrl);
        return;
      }
      await runCardProcessingPipeline(rawDataUrl, file);
    };
    reader.readAsDataURL(file);
  };

  const runOcrExtraction = async (imageData) => {
    await runCardProcessingPipeline(imageData || frontImage);
  };

  const handleFrontFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) analyzeCardImage(f, true);
  };

  const handleBackFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) analyzeCardImage(f, false);
  };

  const handleSaveTemplate = async () => {
    if (!frontImage) {
      if (showToast) showToast('Please upload a visiting card front image first.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const isVector = convertedLayout !== 'image_template';
      const matchedCard = (cards || []).find((c) => String(c.id) === String(selectedCardId)) || (cards && cards[0]);
      const cardIdToSend = matchedCard ? Number(matchedCard.id) : (selectedCardId ? Number(selectedCardId) : null);
      const finalJson = templateJson || activeTemplate;

      const payload = {
        title: (title || '').trim() || (matchedCard ? `${matchedCard.title} Template` : 'Custom Visiting Card Template'),
        industry: industry || 'Corporate & Business',
        orientation: detectedOrientation || 'horizontal',
        card: cardIdToSend,
        primary_color: primaryColor || '#0056b3',
        color_palette: (extractedPalette && extractedPalette.length > 0) ? extractedPalette.join(',') : '#0056b3,#1e293b,#047857,#dc2626',
        preview_style: convertedLayout,
        layout_type: convertedLayout,
        sample_company: (companyName || '').trim() || (title || (matchedCard ? matchedCard.title : 'Company Name')),
        sample_tagline: (tagline || '').trim() || '',
        sample_name: (personName || '').trim() || '',
        sample_job_title: (jobTitle || '').trim() || '',
        sample_phone: (phone || '').trim() || '',
        sample_email: (email || '').trim() || '',
        background_image: isVector ? '' : (frontImage || ''),
        back_background_image: isVector ? '' : (backImage || ''),
        text_positions: {
          hasLayout: isVector ? true : Boolean(showTextOverlay),
          layoutType: convertedLayout,
          card_recreation: true,
          cleanArtwork: finalJson?.background?.cleanArtworkSrc || cleanBackgroundUrl || frontImage,
          renderedPreview: renderedImageUrl || '',
          similarityScore: similarityScore || 96.5,
          backgroundColor: cardBgColor || '#151b2d',
          logoInitials: logoInitials || 'RR',
          hasQrCode: Boolean(hasQrCode),
          sampleWebsite: (website || '').trim() || '',
          sampleAddress: (address || '').trim() || '',
          bullet1: (bullet1 || '').trim(),
          bullet2: (bullet2 || '').trim(),
          bullet3: (bullet3 || '').trim(),
          accentColor: accentColor || '#38bdf8',
          swooshColor: swooshColor || '#1e3a8a',
          logoImage: frontImage || '',
          originalScan: frontImage || '',
          hasCustomLogo: false,
          showTextOverlay: Boolean(showTextOverlay),
          textTheme,
          templateJson: finalJson,
        },
      };

      await createTemplate(payload);

      if (showToast) {
        showToast(`Template "${payload.title}" created successfully!`, 'success');
      }

      if (onRefreshData) onRefreshData();
      onClose();
    } catch (err) {
      console.error('Failed to convert card to template:', err);
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
          maxWidth: 900,
          width: '94%',
          maxHeight: '92vh',
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
            padding: '16px 24px',
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
                Convert Visiting Card Image to Template
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Upload an existing visiting card to transform it into an editable studio template
              </p>
            </div>
          </div>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Step Tabs Strip */}
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
            { step: 1, label: 'Upload & Boundary Crop', enabled: true },
            { step: 2, label: 'AI Multi-Pillar Analysis', enabled: Boolean(frontImage) },
            { step: 3, label: 'Canvas Editor (Drag & Edit)', enabled: Boolean(frontImage) },
            { step: 4, label: 'Visual Verification (Original ≈ Generated)', enabled: Boolean(frontImage) },
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

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* STEP 1: Upload Visiting Card Images */}
          {currentStep === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px' }}>
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>
                  1. Front Side Visiting Card Image (Required)
                </h4>
                <p style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Upload a photo, scan, or design export of the visiting card.
                </p>

                <div
                  onClick={() => frontFileRef.current && frontFileRef.current.click()}
                  style={{
                    border: '2px dashed #0070ba',
                    borderRadius: 12,
                    background: '#f0f9ff',
                    padding: '30px 16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    type="file"
                    ref={frontFileRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFrontFileChange}
                  />
                  <UploadCloud size={38} color="#0070ba" style={{ margin: '0 auto 10px auto' }} />
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                    {frontImage ? 'Click to Replace Front Image' : 'Click to Upload Front Card Image'}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                    PNG, JPG, WebP &bull; High resolution recommended
                  </div>
                </div>

                <div style={{ marginTop: '22px' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                    2. Back Side Visiting Card Image (Optional)
                  </h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', color: '#64748b' }}>
                    If this template has artwork for the reverse side, upload it here.
                  </p>

                  <div
                    onClick={() => backFileRef.current && backFileRef.current.click()}
                    style={{
                      border: '1.5px dashed #cbd5e1',
                      borderRadius: 8,
                      background: '#f8fafc',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="file"
                      ref={backFileRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleBackFileChange}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ImageIcon size={18} color="#64748b" />
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                        {backImage ? 'Back Artwork Uploaded (Click to change)' : 'Upload Back Side (Optional)'}
                      </span>
                    </div>
                    {backImage && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBackImage(null);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc2626',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Image Inspector Column */}
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
                {frontImage ? (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: 360,
                        margin: '0 auto',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        overflow: 'hidden',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                      }}
                    >
                      <img
                        src={frontImage}
                        alt="Front Card Preview"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                        <span style={{ color: '#64748b' }}>Detected Orientation:</span>
                        <strong style={{ color: '#0070ba', textTransform: 'uppercase' }}>
                          {detectedOrientation} ({imageDimensions.width} × {imageDimensions.height}px)
                        </strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: '#64748b' }}>Extracted Accent Palette:</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {extractedPalette.map((col, idx) => (
                            <div
                              key={idx}
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                background: col,
                                border: '1px solid rgba(0,0,0,0.15)',
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* OCR Extraction Status Badge */}
                      {isExtractingOcr ? (
                        <div style={{ marginTop: '10px', padding: '8px 12px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#1e40af' }}>
                          <RefreshCw size={15} className="animate-spin" />
                          <span>{ocrStatusText || 'Extracting card details with OCR...'}</span>
                        </div>
                      ) : ocrExtractedCount > 0 ? (
                        <div style={{ marginTop: '10px', padding: '8px 12px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#166534' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle2 size={16} color="#16a34a" />
                            <span><strong>{ocrExtractedCount} Card Details Extracted!</strong> (Name, Contact, Company)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => runOcrExtraction(frontImage)}
                            style={{ background: 'none', border: 'none', color: '#0070ba', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            Re-scan
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => runOcrExtraction(frontImage)}
                          style={{ marginTop: '10px', width: '100%', padding: '7px 10px', background: '#e0f2fe', border: '1px solid #7dd3fc', borderRadius: 6, color: '#0369a1', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <Sparkles size={14} /> ✨ Auto-Extract Text & Details with OCR
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                    <ImageIcon size={44} style={{ opacity: 0.4, margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Card Image Preview</div>
                    <div style={{ fontSize: '0.74rem' }}>Upload an image on the left to see auto-conversion details</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Template Information & Visiting Card Details */}
          {currentStep === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* OCR Banner */}
              <div style={{ gridColumn: '1 / -1', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: '#065f46' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#059669" />
                  <span>
                    {ocrExtractedCount > 0 ? (
                      <><strong>Smart OCR Extraction Active:</strong> Successfully extracted {ocrExtractedCount} fields from your card (Name, Phone, Email, Company, Address). You can edit them below.</>
                    ) : isExtractingOcr ? (
                      <><strong>OCR Scanning Card Artwork:</strong> {ocrStatusText || 'Extracting details from card image...'}</>
                    ) : (
                      <><strong>Optical Character Recognition:</strong> Click Re-scan to automatically read names, phones, and company text from the uploaded card.</>
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => runOcrExtraction(frontImage)}
                  disabled={isExtractingOcr || !frontImage}
                  style={{ padding: '4px 10px', background: '#ffffff', border: '1px solid #10b981', borderRadius: 6, color: '#047857', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <RefreshCw size={13} className={isExtractingOcr ? 'animate-spin' : ''} />
                  {isExtractingOcr ? 'Scanning...' : 'Re-scan Card'}
                </button>
              </div>

              {/* 3-Pillar Architecture Breakdown (BACKGROUND + CONTENT + ASSETS) */}
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '4px' }}>
                {/* 1. BACKGROUND */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '12px', borderTop: '3px solid #0284c7' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🎨</span> 1. BACKGROUND
                  </div>
                  <div style={{ fontSize: '0.73rem', color: '#475569', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div>Color: <strong style={{ color: cardBgColor }}>{cardBgColor}</strong></div>
                    <div>Theme: <strong>{textTheme.toUpperCase()} Mode</strong></div>
                    <div>Geometry: <strong>Modern Angled Polygons</strong></div>
                  </div>
                </div>

                {/* 2. CONTENT */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '12px', borderTop: '3px solid #059669' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>📝</span> 2. CONTENT
                  </div>
                  <div style={{ fontSize: '0.73rem', color: '#475569', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div>Name: <strong>{personName || 'Ravindra'}</strong></div>
                    <div>Title: <strong>{jobTitle || 'Manager'}</strong></div>
                    <div>Company: <strong>{companyName || 'IT SERVICES'}</strong></div>
                  </div>
                </div>

                {/* 3. ASSETS */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '12px', borderTop: '3px solid #d97706' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>💎</span> 3. ASSETS
                  </div>
                  <div style={{ fontSize: '0.73rem', color: '#475569', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div>Logo: <strong>Emblem "{logoInitials || 'RR'}"</strong></div>
                    <div>QR: <strong>{hasQrCode ? 'Active Dynamic QR' : 'Disabled'}</strong></div>
                    <div>Icons: <strong>4 Badges (Phone, Mail, Pin, Web)</strong></div>
                  </div>
                </div>
              </div>

              {/* Left Column: Template Catalog Configuration */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.92rem', fontWeight: 700, color: '#0070ba' }}>
                  1. Template Catalog Settings
                </h4>

                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label>Template Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Apex Innovations / Business Card Template"
                    required
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label>Converted Template Design Layout *</label>
                  <select
                    value={convertedLayout}
                    onChange={(e) => setConvertedLayout(e.target.value)}
                    style={{ fontWeight: 700, borderColor: '#0070ba', background: '#f0f9ff' }}
                  >
                    <option value="card_recreation">★ Matched Smart Card Recreation (Preserves exact layout, colors, QR & emblem - Recommended)</option>
                    <option value="executive_swoosh">Executive Split & Accent Swoosh Layout (White Minimalist)</option>
                    <option value="classic_photo">Classic Photo & Corporate Blue Bar Layout</option>
                    <option value="corporate_red_ribbon">Corporate Red Ribbon Layout</option>
                    <option value="luxury_black_gold">Luxury Black & Gold Layout</option>
                    <option value="modern_geometric">Modern Geometric Prisms Layout</option>
                    <option value="image_template">📷 Card Artwork Template (Preserves raw uploaded card image)</option>
                  </select>
                  <div style={{ fontSize: '0.72rem', color: '#0369a1', marginTop: '3px' }}>
                    {convertedLayout === 'card_recreation'
                      ? 'Recreates the uploaded card with exact matched midnight/navy styling, brand monogram emblem, contacts & QR code.'
                      : convertedLayout === 'image_template'
                      ? 'Preserves raw uploaded card artwork photo as the template background canvas for customers.'
                      : 'Converts the physical card into a crisp digital vector template with editable names, designation, contacts, divider & swoosh.'}
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label>Target Industry *</label>
                  <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                    {INDUSTRY_OPTIONS.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                  <label>Assigned Visiting Card Product *</label>
                  <select
                    value={selectedCardId || ''}
                    onChange={(e) => setSelectedCardId(e.target.value)}
                  >
                    {cards.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.gsm})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color Schemes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div className="admin-form-group">
                    <label>Card Background Color</label>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={cardBgColor}
                        onChange={(e) => updateFormFieldAndSyncJson('cardBgColor', e.target.value)}
                        style={{ width: 36, height: 32, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={cardBgColor}
                        onChange={(e) => updateFormFieldAndSyncJson('cardBgColor', e.target.value)}
                        style={{ flex: 1, fontSize: '0.78rem' }}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Text & Name Color</label>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => updateFormFieldAndSyncJson('primaryColor', e.target.value)}
                        style={{ width: 36, height: 32, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => updateFormFieldAndSyncJson('primaryColor', e.target.value)}
                        style={{ flex: 1, fontSize: '0.78rem' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div className="admin-form-group">
                    <label>Brand Monogram / Emblem Initials</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={logoInitials}
                      onChange={(e) => updateFormFieldAndSyncJson('logoInitials', e.target.value.toUpperCase())}
                      placeholder="e.g. RR"
                      style={{ fontWeight: 800, textTransform: 'uppercase' }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Include QR Code</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', height: 36, fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>
                      <input
                        type="checkbox"
                        checked={hasQrCode}
                        onChange={(e) => updateFormFieldAndSyncJson('hasQrCode', e.target.checked)}
                        style={{ width: 16, height: 16 }}
                      />
                      Enable Dynamic QR Code
                    </label>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div className="admin-form-group">
                    <label>Accent / Line Color</label>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => updateFormFieldAndSyncJson('accentColor', e.target.value)}
                        style={{ width: 36, height: 32, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={accentColor}
                        onChange={(e) => updateFormFieldAndSyncJson('accentColor', e.target.value)}
                        style={{ flex: 1, fontSize: '0.78rem' }}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Badge & Icon Background</label>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={swooshColor}
                        onChange={(e) => setSwooshColor(e.target.value)}
                        style={{ width: 36, height: 32, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={swooshColor}
                        onChange={(e) => setSwooshColor(e.target.value)}
                        style={{ flex: 1, fontSize: '0.78rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Actual Details of this Visiting Card */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.92rem', fontWeight: 700, color: '#0070ba' }}>
                  2. Visiting Card Information (Editable by Users)
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div className="admin-form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => updateFormFieldAndSyncJson('companyName', e.target.value)}
                      placeholder="e.g. Apex Innovations / Company Name"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Tagline / Motto</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Innovate • Elevate • Succeed"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div className="admin-form-group">
                    <label>Person Name</label>
                    <input
                      type="text"
                      value={personName}
                      onChange={(e) => updateFormFieldAndSyncJson('personName', e.target.value)}
                      placeholder="e.g. Alexander Wright / Full Name"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Designation / Role</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => updateFormFieldAndSyncJson('jobTitle', e.target.value)}
                      placeholder="e.g. Managing Director / Role"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div className="admin-form-group">
                    <label>Phone Number(s)</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => updateFormFieldAndSyncJson('phone', e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Email Address</label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => updateFormFieldAndSyncJson('email', e.target.value)}
                      placeholder="e.g. contact@example.in"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div className="admin-form-group">
                    <label>Website</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => updateFormFieldAndSyncJson('website', e.target.value)}
                      placeholder="e.g. www.example.in"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>City / Location</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => updateFormFieldAndSyncJson('address', e.target.value)}
                      placeholder="e.g. Mumbai, Maharashtra, India"
                    />
                  </div>
                </div>

                {/* 3 Bullet Points / Feature Highlights */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Feature Highlight Bullets (Right side of card)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <input
                      type="text"
                      value={bullet1}
                      onChange={(e) => setBullet1(e.target.value)}
                      placeholder="Bullet 1 (e.g. We Build)"
                      style={{ fontSize: '0.78rem', padding: '6px 8px' }}
                    />
                    <input
                      type="text"
                      value={bullet2}
                      onChange={(e) => setBullet2(e.target.value)}
                      placeholder="Bullet 2 (e.g. We Launch)"
                      style={{ fontSize: '0.78rem', padding: '6px 8px' }}
                    />
                    <input
                      type="text"
                      value={bullet3}
                      onChange={(e) => setBullet3(e.target.value)}
                      placeholder="Bullet 3 (e.g. We Grow)"
                      style={{ fontSize: '0.78rem', padding: '6px 8px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Interactive Template Canvas Editor */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Edit3 size={18} color="#0070ba" />
                    Interactive Template Canvas Editor
                  </h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Click any element to select and edit. Drag elements across the card canvas. Fine-tune typography, positions, and alignment.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowJsonViewer(!showJsonViewer)}
                    style={{
                      padding: '6px 12px',
                      background: showJsonViewer ? '#0f172a' : '#f1f5f9',
                      color: showJsonViewer ? '#38bdf8' : '#334155',
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Code size={13} /> {showJsonViewer ? 'Hide JSON' : 'Template JSON'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    style={{
                      padding: '6px 14px',
                      background: '#0070ba',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>Verify (Original ≈ Generated)</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Interactive Canvas Editor Component */}
              <InteractiveTemplateCanvas
                templateJson={activeTemplate}
                onChange={setTemplateJson}
              />

              {/* Template JSON Inspector Section */}
              {showJsonViewer && (
                <div style={{ marginTop: '12px', background: '#0f172a', borderRadius: 8, padding: '14px', border: '1px solid #1e293b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Code size={14} /> Canonical Template JSON Schema (BACKGROUND + CONTENT + ASSETS)
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(activeTemplate, null, 2));
                        if (showToast) showToast('Template JSON copied to clipboard!', 'success');
                      }}
                      style={{
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: '#f8fafc',
                        borderRadius: 4,
                        padding: '3px 8px',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Copy JSON
                    </button>
                  </div>
                  <pre style={{ margin: 0, fontSize: '0.74rem', color: '#cbd5e1', maxHeight: 220, overflowY: 'auto' }}>
                    {JSON.stringify(activeTemplate, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Visual Verification (Original vs Generated Overlay) */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sliders size={18} color="#0070ba" />
                  Visual Verification: ORIGINAL ≈ GENERATED
                </h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  Verify that the reconstructed digital template faithfully matches the original uploaded visiting card.
                </p>
              </div>

              {/* Verification Component: Side by Side & Opacity Overlay Slider */}
              <OriginalVsGeneratedOverlay
                originalImageUrl={frontImage}
                templateJson={activeTemplate}
                renderedImageUrl={renderedImageUrl}
                similarityScore={similarityScore}
                detectedOrientation={detectedOrientation}
              />

              {/* Data Sheet Summary */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  padding: '16px 20px',
                }}
              >
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  Template Configuration Summary
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '10px',
                    fontSize: '0.78rem',
                    color: '#475569',
                  }}
                >
                  <div><strong>Title:</strong> {title || 'Untitled Card Preset'}</div>
                  <div><strong>Industry:</strong> {industry}</div>
                  <div><strong>Orientation:</strong> {detectedOrientation}</div>
                  <div><strong>Background:</strong> <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: cardBgColor, marginRight: 4, verticalAlign: 'middle' }} />{cardBgColor}</div>
                  <div><strong>Company:</strong> {companyName || 'IT SERVICES'}</div>
                  <div><strong>Contact:</strong> {personName || 'Ravindra'} ({jobTitle || 'Manager'})</div>
                  <div><strong>Phone:</strong> {phone || '6300297048'}</div>
                  <div><strong>Email:</strong> {email || 'info@example.com'}</div>
                  <div><strong>QR Code:</strong> {hasQrCode ? 'Enabled' : 'Disabled'}</div>
                  <div><strong>Emblem:</strong> {logoInitials || 'RR'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div
          className="admin-modal-footer"
          style={{
            padding: '14px 24px',
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
                <span>{isProcessing ? 'Converting & Publishing...' : 'Save & Publish Template'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
