import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import {
  Folder,
  ChevronLeft,
  ChevronDown,
  RotateCcw,
  RotateCw,
  Eye,
  Sliders,
  Type,
  UploadCloud,
  Shapes,
  Grid,
  Palette,
  Plus,
  Minus,
  Maximize2,
  Settings,
  HelpCircle,
  Tag,
  ArrowRight,
  Check,
  X,
  FileText,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  SlidersHorizontal,
  Sparkles,
  Lock,
  Unlock,
  Copy,
  Trash2,
  MoreHorizontal,
  Move,
  Share2,
  Crosshair,
  Layers,
  Phone,
  PhoneCall,
  Mail,
  Globe,
  MapPin,
  MessageCircle,
  Briefcase,
  User,
  Users,
  Award,
  Clock,
  CreditCard,
  QrCode,
  Star,
  Building2,
  Smartphone,
  Search,
  Square,
  Circle,
  Triangle,
  ShieldCheck,
  Send,
  Image as ImageIcon,
  Truck,
  ShoppingBag,
  ShoppingCart,
} from 'lucide-react';
import './css/index.css';
import StudioTopbar from './components/Topbar/StudioTopbar';
import StudioSidebar from './components/Sidebar/StudioSidebar';
import StudioCanvas from './components/Canvas/StudioCanvas';
import StudioSideSwitcher from './components/SideSwitcher/StudioSideSwitcher';
import CanvasElement from './components/Canvas/CanvasElement';
import CardSurface from './components/Canvas/CardSurface';
import LogoAdjustModal from './components/Modals/LogoAdjustModal';
import Preview3DModal from './components/Modals/Preview3DModal';
import ReviewDesignModal from './components/Modals/ReviewDesignModal';
import FinalStepsScreen from './components/Modals/FinalStepsScreen';

export default function VistaprintDesignStudio({
  card,
  template,
  allCards = [],
  allTemplates = [],
  onClose,
  onAddToCart,
  isAdminReview = false,
  onAdminPublishTemplate,
}) {
  const currentCard = card || {
    title: 'Standard Visiting Cards',
    slug: 'standard',
    base_price_100: 200.0,
    dimensions: '8.9 cm x 5.1 cm',
    gsm: '350 GSM',
  };

  // Resolve template with active session storage fallback if prop was not yet passed
  const resolvedTemplate = template || (() => {
    try {
      const saved = sessionStorage.getItem('vp_active_studio_template');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })() || {
    id: 1,
    title: 'Classic Corporate Identity',
    layout_type: 'classic_photo',
    primary_color: '#0056b3',
    color_palette: '#0056b3,#1e293b,#047857,#b91c1c',
    sample_company: 'Company Name',
    sample_tagline: 'Company Message',
  };

  const initialTemplate = resolvedTemplate;

  // Restore saved draft for this template if user previously edited it
  const draftKey = `vp_studio_draft_${resolvedTemplate?.id || 'custom'}`;
  const savedDraft = (() => {
    try {
      const raw = sessionStorage.getItem(draftKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [activeTemplate, setActiveTemplate] = useState(resolvedTemplate);

  const [orientation, setOrientation] = useState(
    savedDraft?.orientation || card?.orientation || resolvedTemplate?.orientation || 'horizontal'
  );
  const [frontArtwork, setFrontArtwork] = useState(
    savedDraft?.frontArtwork || card?.uploadedFrontArtwork || card?.uploadedArtwork || resolvedTemplate?.background_image || null
  );
  const [backArtwork, setBackArtwork] = useState(
    savedDraft?.backArtwork || card?.uploadedBackArtwork || resolvedTemplate?.back_background_image || null
  );

  const currentTemplate = activeTemplate || resolvedTemplate;
  const hasCardArtwork = Boolean(
    frontArtwork ||
    currentTemplate?.background_image ||
    currentTemplate?.layout_type === 'image_template' ||
    card?.uploadedFrontArtwork ||
    card?.uploadedArtwork ||
    card?.isCustomUpload
  );

  const isTemplateEditable = Boolean(
    !hasCardArtwork && currentTemplate && (
      currentTemplate.layout_type === 'executive_swoosh' ||
      currentTemplate.layout_type === 'corporate_split_swoosh' ||
      ['classic_photo', 'luxury_black_gold', 'corporate_red_ribbon', 'modern_geometric', 'medical_care', 'card_recreation', 'exact_recreation', 'corporate_split_navy', 'corporate_navy_qr'].includes(currentTemplate.layout_type || currentTemplate.preview_style) ||
      currentTemplate.text_positions?.hasLayout
    )
  );

  const isCustomMode = isTemplateEditable ? false : Boolean(
    hasCardArtwork ||
    (card?.isCustomUpload && !currentTemplate) ||
    (!currentTemplate && (frontArtwork || card?.uploadedArtwork)) ||
    (currentTemplate?.layout_type === 'image_template')
  );

  const [activeColor, setActiveColor] = useState(
    savedDraft?.activeColor ||
    resolvedTemplate?.activeColor ||
    resolvedTemplate?.primary_color ||
    (resolvedTemplate?.layout_type === 'card_recreation' ? '#38bdf8' : (resolvedTemplate?.layout_type === 'executive_swoosh' ? '#1e1b4b' : '#0056b3'))
  );

  // Editable Text fields state: restore from saved draft or pre-fill from template
  const [fields, setFields] = useState(() => {
    if (savedDraft?.fields && Object.keys(savedDraft.fields).length > 0) {
      return savedDraft.fields;
    }
    if (isCustomMode) return {};
    return {
      companyName: card?.custom_company || resolvedTemplate?.sample_company || (resolvedTemplate?.layout_type === 'executive_swoosh' ? 'Your Company' : ''),
      companyMessage: card?.custom_message || resolvedTemplate?.sample_tagline || '',
      fullName: card?.custom_name || resolvedTemplate?.sample_name || (resolvedTemplate?.layout_type === 'executive_swoosh' ? 'Your Name' : ''),
      jobTitle: card?.custom_title || resolvedTemplate?.sample_job_title || (resolvedTemplate?.layout_type === 'executive_swoosh' ? 'General Manager' : ''),
      email: card?.custom_email || resolvedTemplate?.sample_email || (resolvedTemplate?.layout_type === 'executive_swoosh' ? 'info@example.com' : ''),
      address1: card?.custom_address1 || resolvedTemplate?.text_positions?.sampleAddress || (resolvedTemplate?.layout_type === 'executive_swoosh' ? 'City, Country' : ''),
      address2: card?.custom_address2 || '',
      web: card?.custom_web || resolvedTemplate?.text_positions?.sampleWebsite || (resolvedTemplate?.layout_type === 'executive_swoosh' ? 'www.example.com' : ''),
      phone: card?.custom_phone || resolvedTemplate?.sample_phone || (resolvedTemplate?.layout_type === 'executive_swoosh' ? '+91 98765 43210' : ''),
      bullet1: resolvedTemplate?.text_positions?.bullet1 || '',
      bullet2: resolvedTemplate?.text_positions?.bullet2 || '',
      bullet3: resolvedTemplate?.text_positions?.bullet3 || '',
    };
  });

  const [editedFields, setEditedFields] = useState(() => {
    if (savedDraft?.editedFields) return savedDraft.editedFields;
    return (card?.custom_name || card?.custom_company || resolvedTemplate?.sample_name || resolvedTemplate?.sample_company)
      ? { fullName: true, companyName: true, jobTitle: true, phone: true, email: true, web: true, address1: true, bullet1: true, bullet2: true, bullet3: true }
      : {};
  });

  const [activeField, setActiveField] = useState(isCustomMode ? null : 'companyName');
  const [activeTool, setActiveTool] = useState(isCustomMode ? 'uploads' : 'text'); // 'text' | 'product_options' | 'uploads' | 'graphics' | 'background' | 'template' | 'template_color'
  const [activeSide, setActiveSide] = useState('front'); // 'front' | 'back'
  const [backOption, setBackOption] = useState('blank'); // 'blank' | 'monochrome' | 'qr_contact'
  const [zoom, setZoom] = useState(100);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isNextStepOpen, setIsNextStepOpen] = useState(false);
  const [reviewStep, setReviewStep] = useState('review'); // 'review' | 'quantity'
  const [isReviewApproved, setIsReviewApproved] = useState(true);
  const [isFinalStepsOpen, setIsFinalStepsOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState('Standard Glossy');
  const [showPricingGuide, setShowPricingGuide] = useState(false);
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);
  const [quantity, setQuantity] = useState(savedDraft?.quantity || card?.quantity || 100);
  const [uploadedLogo, setUploadedLogo] = useState(savedDraft?.uploadedLogo || null);
  const [dimensionUnit, setDimensionUnit] = useState('both'); // 'both' | 'cm' | 'mm'

  // Interactive Guide Overlay States (Reflect on edit card on hover/click)
  const [hoveredGuide, setHoveredGuide] = useState(null); // 'safety' | 'bleed' | null
  const [pinnedGuide, setPinnedGuide] = useState(null); // 'safety' | 'bleed' | null
  const activeGuide = hoveredGuide || pinnedGuide;

  // Interactive Adjustable Artwork & Logo Transform States (Defaults to full edge-to-edge cover)
  const [frontArtworkTransform, setFrontArtworkTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    fitMode: 'cover', // Cover full card edge-to-edge matching exact uploaded image
    opacity: 1,
    locked: false,
  });

  const [backArtworkTransform, setBackArtworkTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    fitMode: 'cover',
    opacity: 1,
    locked: false,
  });

  const [logoTransform, setLogoTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    width: 100,
    height: 100,
    opacity: 1,
    locked: false,
  });

  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const logoInputRef = useRef(null);

  const handleLogoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setUploadedLogo(uploadEvent.target.result);
        setActiveField('logo');
      };
      reader.readAsDataURL(file);
    }
  };


  const frontArtworkRef = useRef(null);
  const backArtworkRef = useRef(null);

  // Graphics (Icons & Shapes) & Card Background States
  const [cardGraphics, setCardGraphics] = useState({
    front: [],
    back: [],
  });
  const [cardBackground, setCardBackground] = useState(
    savedDraft?.cardBackground || {
      front: { type: 'solid', value: '#ffffff', pattern: 'none', patternOpacity: 0.15 },
      back: { type: 'solid', value: '#ffffff', pattern: 'none', patternOpacity: 0.15 },
    }
  );
  const [graphicsCategory, setGraphicsCategory] = useState('all'); // 'all' | 'contact' | 'social' | 'business' | 'shapes'
  const [graphicsSearch, setGraphicsSearch] = useState('');
  const [qrInput, setQrInput] = useState('https://asapnow.in');
  const [qrType, setQrType] = useState('url'); // 'url' | 'whatsapp' | 'phone' | 'vcard'

  // Synchronize activeTemplate into sessionStorage and URL hash
  useEffect(() => {
    if (!activeTemplate?.id) return;
    try {
      sessionStorage.setItem('vp_active_studio_template', JSON.stringify(activeTemplate));
    } catch (e) {}

    const hash = window.location.hash || '';
    if (hash.startsWith('#studio/')) {
      const [pathPart, queryPart] = hash.split('?');
      const params = new URLSearchParams(queryPart || '');
      if (params.get('template') !== String(activeTemplate.id)) {
        params.set('template', activeTemplate.id);
        const newHash = `${pathPart}?${params.toString()}`;
        window.history.replaceState(null, '', newHash);
      }
    }
  }, [activeTemplate]);

  // Auto-save working draft to sessionStorage on changes
  useEffect(() => {
    if (!activeTemplate?.id) return;
    const key = `vp_studio_draft_${activeTemplate.id}`;
    const draft = {
      templateId: activeTemplate.id,
      fields,
      editedFields,
      activeColor,
      orientation,
      quantity,
      cardBackground,
      frontArtwork,
      backArtwork,
      uploadedLogo,
    };
    try {
      sessionStorage.setItem(key, JSON.stringify(draft));
    } catch (e) {}
  }, [activeTemplate, fields, editedFields, activeColor, orientation, quantity, cardBackground, frontArtwork, backArtwork, uploadedLogo]);

  // Sync if template prop changes from outside
  useEffect(() => {
    if (template && template.id && activeTemplate?.id !== template.id) {
      setActiveTemplate(template);
      setActiveColor(template.activeColor || template.primary_color || (template.layout_type === 'executive_swoosh' ? '#1e1b4b' : '#0056b3'));
      if (template.background_image) {
        setFrontArtwork(template.background_image);
        if (template.back_background_image) setBackArtwork(template.back_background_image);
      }
    }
  }, [template]);

  // Adjustable Properties Panel Width
  const [panelWidth, setPanelWidth] = useState(330);
  const [isResizingPanel, setIsResizingPanel] = useState(false);

  const handleStartPanelResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizingPanel(true);
    const startX = e.clientX;
    const initialW = panelWidth;

    const onMouseMove = (moveEv) => {
      const dw = moveEv.clientX - startX;
      const newW = Math.max(260, Math.min(540, initialW + dw));
      setPanelWidth(newW);
    };

    const onMouseUp = () => {
      setIsResizingPanel(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // 3D Interactive Card Preview Modal State (Double-Sided Physical Card)
  const [previewSide, setPreviewSide] = useState('front');
  const [previewRotation, setPreviewRotation] = useState({ x: 0, y: 0 }); // Crisp flat starting angle
  const [previewMode, setPreviewMode] = useState('3d'); // '3d' | '2d'
  const [previewFinish, setPreviewFinish] = useState('matte'); // 'matte' | 'glossy' | 'metallic'
  const [isDraggingPreview, setIsDraggingPreview] = useState(false);
  const previewDragRef = useRef({ startX: 0, startY: 0, initRotX: 0, initRotY: 0 });

  const handlePreviewMouseDown = (e) => {
    e.preventDefault();
    setIsDraggingPreview(true);
    previewDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initRotX: previewRotation.x,
      initRotY: previewRotation.y,
    };

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - previewDragRef.current.startX;
      const dy = moveEvent.clientY - previewDragRef.current.startY;
      const nextRotY = previewDragRef.current.initRotY + dx * 0.45;
      const nextRotX = Math.max(-45, Math.min(45, previewDragRef.current.initRotX - dy * 0.45));
      setPreviewRotation({ x: nextRotX, y: nextRotY });

      // Detect which face of the 3D physical card is facing the user in real time
      const normY = ((nextRotY % 360) + 360) % 360;
      const facing = (normY >= 90 && normY <= 270) ? 'back' : 'front';
      setPreviewSide(facing);
    };

    const onMouseUp = () => {
      setIsDraggingPreview(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handlePreviewSideSwitch = (targetSide) => {
    setPreviewSide(targetSide);
    if (targetSide === 'front') {
      const currentRotY = previewRotation.y;
      const base = Math.round(currentRotY / 360) * 360;
      setPreviewRotation({ x: previewMode === '2d' ? 0 : 0, y: base });
    } else {
      const currentRotY = previewRotation.y;
      const base = Math.round((currentRotY - 180) / 360) * 360;
      setPreviewRotation({ x: previewMode === '2d' ? 0 : 0, y: base + 180 });
    }
  };

  const handleSetPresetAngle = (preset) => {
    if (preset === 'front') {
      setPreviewSide('front');
      setPreviewRotation({ x: 0, y: 0 });
    } else if (preset === 'back') {
      setPreviewSide('back');
      setPreviewRotation({ x: 0, y: 180 });
    } else if (preset === '3d') {
      setPreviewSide('front');
      setPreviewRotation({ x: 8, y: -16 });
    } else if (preset === 'flip') {
      const nextSide = previewSide === 'front' ? 'back' : 'front';
      handlePreviewSideSwitch(nextSide);
    }
  };


  // Interactive Product Options
  const [paperStock, setPaperStock] = useState(currentCard.gsm || '350 GSM');
  const [finishType, setFinishType] = useState(currentCard.finish_type || 'Matte');
  const [cornerStyle, setCornerStyle] = useState(card?.corner_style || 'standard'); // 'standard' | 'rounded'
  const [cardDimension, setCardDimension] = useState(orientation === 'vertical' ? '5.1 cm x 8.9 cm' : '8.9 cm x 5.1 cm');
  const [backsideType, setBacksideType] = useState('blank'); // 'blank' | 'color' | 'grayscale'

  useEffect(() => {
    if (card?.isCustomUpload || card?.uploadedArtwork || card?.uploadedFrontArtwork) {
      setActiveField('uploaded_artwork_front');
      setActiveTool('uploads');
    }
    if (card?.orientation) setOrientation(card.orientation);
    if (card?.uploadedFrontArtwork || card?.uploadedArtwork) {
      setFrontArtwork(card.uploadedFrontArtwork || card.uploadedArtwork);
    }
    if (card?.uploadedBackArtwork) {
      setBackArtwork(card.uploadedBackArtwork);
    }
    if (card?.quantity) setQuantity(card.quantity);
    if (card?.corner_style) setCornerStyle(card.corner_style);
  }, [card]);

  useEffect(() => {
    if (template?.background_image) {
      setFrontArtwork(template.background_image);
      if (template.back_background_image) {
        setBackArtwork(template.back_background_image);
      }
      if (template.orientation) {
        setOrientation(template.orientation);
      }
      setFrontArtworkTransform((prev) => ({
        ...prev,
        fitMode: 'cover',
        scale: 1,
      }));
    }
  }, [template]);

  useEffect(() => {
    setCardDimension(orientation === 'vertical' ? '5.1 cm x 8.9 cm' : '8.9 cm x 5.1 cm');
  }, [orientation]);

  // History stack for Undo / Redo
  const [history, setHistory] = useState([fields]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const fileInputRef = useRef(null);
  const elemRefs = useRef({});

  const updateField = (key, value) => {
    const updated = { ...fields, [key]: value };
    setFields(updated);
    setEditedFields((prev) => ({ ...prev, [key]: true }));

    // Save to history
    const nextHistory = history.slice(0, historyIdx + 1);
    nextHistory.push(updated);
    setHistory(nextHistory);
    setHistoryIdx(nextHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prevIdx = historyIdx - 1;
      setHistoryIdx(prevIdx);
      setFields(history[prevIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const nextIdx = historyIdx + 1;
      setHistoryIdx(nextIdx);
      setFields(history[nextIdx]);
    }
  };

  // Default text typography styles for each field matching Canva/Vistaprint floating toolbar
  const createInitialStyles = (clr) => ({
    companyName: {
      fontFamily: 'Fira Sans',
      fontSize: 22,
      color: clr || '#0056b3',
      bold: true,
      italic: false,
      underline: false,
      align: 'left',
      letterSpacing: 0,
      lineHeight: 1.2,
      textTransform: 'none',
      opacity: 1,
      effect: 'none',
      locked: false,
      rotation: 0,
      x: 0,
      y: 0,
      width: undefined,
      isBullet: false,
    },
    companyMessage: {
      fontFamily: 'Fira Sans',
      fontSize: 13,
      color: '#64748b',
      bold: false,
      italic: false,
      underline: false,
      align: 'left',
      letterSpacing: 0,
      lineHeight: 1.2,
      textTransform: 'none',
      opacity: 1,
      effect: 'none',
      locked: false,
      rotation: 0,
      x: 0,
      y: 0,
      width: undefined,
      isBullet: false,
    },
    fullName: {
      fontFamily: 'Fira Sans',
      fontSize: 18,
      color: clr || '#0056b3',
      bold: true,
      italic: false,
      underline: false,
      align: 'right',
      letterSpacing: 0,
      lineHeight: 1.2,
      textTransform: 'none',
      opacity: 1,
      effect: 'none',
      locked: false,
      rotation: 0,
      x: 0,
      y: 0,
      width: undefined,
      isBullet: false,
    },
    jobTitle: {
      fontFamily: 'Fira Sans',
      fontSize: 13,
      color: '#334155',
      bold: false,
      italic: false,
      underline: false,
      align: 'right',
      letterSpacing: 0,
      lineHeight: 1.2,
      textTransform: 'none',
      opacity: 1,
      effect: 'none',
      locked: false,
      rotation: 0,
      x: 0,
      y: 0,
      width: undefined,
      isBullet: false,
    },
    email: {
      fontFamily: 'Fira Sans',
      fontSize: 12,
      color: '#64748b',
      bold: false,
      italic: false,
      underline: false,
      align: 'right',
      letterSpacing: 0,
      lineHeight: 1.2,
      textTransform: 'none',
      opacity: 1,
      effect: 'none',
      locked: false,
      rotation: 0,
      x: 0,
      y: 0,
      width: undefined,
      isBullet: false,
    },
    address1: {
      fontFamily: 'Fira Sans',
      fontSize: 12,
      color: '#475569',
      bold: false,
      italic: false,
      underline: false,
      align: 'left',
      letterSpacing: 0,
      lineHeight: 1.2,
      textTransform: 'none',
      opacity: 1,
      effect: 'none',
      locked: false,
      rotation: 0,
      x: 0,
      y: 0,
      width: undefined,
      isBullet: false,
    },
    address2: {
      fontFamily: 'Fira Sans',
      fontSize: 12,
      color: '#475569',
      bold: false,
      italic: false,
      underline: false,
      align: 'left',
      letterSpacing: 0,
      lineHeight: 1.2,
      textTransform: 'none',
      opacity: 1,
      effect: 'none',
      locked: false,
      rotation: 0,
      x: 0,
      y: 0,
      width: undefined,
      isBullet: false,
    },
    web: {
      fontFamily: 'Fira Sans',
      fontSize: 12,
      color: '#475569',
      bold: false,
      italic: false,
      underline: false,
      align: 'left',
      letterSpacing: 0,
      lineHeight: 1.2,
      textTransform: 'none',
      opacity: 1,
      effect: 'none',
      locked: false,
      rotation: 0,
      x: 0,
      y: 0,
      width: undefined,
      isBullet: false,
    },
    phone: {
      fontFamily: 'Fira Sans',
      fontSize: 12,
      color: '#475569',
      bold: false,
      italic: false,
      underline: false,
      align: 'right',
      letterSpacing: 0,
      lineHeight: 1.2,
      textTransform: 'none',
      opacity: 1,
      effect: 'none',
      locked: false,
      rotation: 0,
      x: 0,
      y: 0,
      width: undefined,
      isBullet: false,
    },
  });

  const [textStyles, setTextStyles] = useState(() => createInitialStyles(activeColor));
  const [activePopover, setActivePopover] = useState(null); // 'spacing' | 'format' | 'effects' | 'opacity' | null
  const [showMoreMenu, setShowMoreMenu] = useState(null);
  const [copyToast, setCopyToast] = useState('');

  const currentStyle = textStyles[activeField] || {};

  const updateActiveStyle = (prop, value) => {
    if (!activeField) return;
    setTextStyles((prev) => {
      const current = prev[activeField] || {};
      return {
        ...prev,
        [activeField]: {
          ...current,
          [prop]: value,
        },
      };
    });
  };

  const handleDuplicateField = (fieldKey) => {
    const val = fields[fieldKey] || '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(val);
    }
    setCopyToast(`"${val.slice(0, 20)}" copied!`);
    setTimeout(() => setCopyToast(''), 2500);
  };

  // --- Interactive Move / Drag Element anywhere on card ---
  const handleStartMove = (e, fieldKey) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveField(fieldKey);

    const startX = e.clientX;
    const startY = e.clientY;
    const curStyle = textStyles[fieldKey] || {};
    const initialX = curStyle.x || 0;
    const initialY = curStyle.y || 0;
    const scale = zoom / 100;

    const onMouseMove = (moveEvent) => {
      const dx = (moveEvent.clientX - startX) / scale;
      const dy = (moveEvent.clientY - startY) / scale;
      setTextStyles((prev) => ({
        ...prev,
        [fieldKey]: {
          ...(prev[fieldKey] || {}),
          x: Math.round(initialX + dx),
          y: Math.round(initialY + dy),
        },
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // --- Interactive Width Adjusting (Side Pill Handles for Text) ---
  const handleStartResizeWidth = (e, fieldKey, side) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const el = elemRefs.current[fieldKey];
    const initialWidth = textStyles[fieldKey]?.width || (el ? el.offsetWidth : 120);
    const initialX = textStyles[fieldKey]?.x || 0;
    const scale = zoom / 100;

    const onMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      const dx = (moveEvent.clientX - startX) / scale;

      if (side === 'right') {
        const newWidth = Math.max(30, Math.min(560, Math.round(initialWidth + dx)));
        setTextStyles((prev) => ({
          ...prev,
          [fieldKey]: {
            ...(prev[fieldKey] || {}),
            width: newWidth,
          },
        }));
      } else {
        const newWidth = Math.max(30, Math.min(560, Math.round(initialWidth - dx)));
        setTextStyles((prev) => ({
          ...prev,
          [fieldKey]: {
            ...(prev[fieldKey] || {}),
            width: newWidth,
            x: Math.round(initialX + dx),
          },
        }));
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // --- Interactive Width Adjusting for Dividers on Canvas ---
  const handleStartGraphicResizeWidth = (e, graphicId, side) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const currentList = cardGraphics[activeSide] || [];
    const targetItem = currentList.find((g) => g.id === graphicId);
    if (!targetItem || targetItem.locked) return;

    const initialWidth = typeof targetItem.size === 'object' ? (targetItem.size.width || 180) : (targetItem.size || 180);
    const scale = zoom / 100;

    const onMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      const dx = (moveEvent.clientX - startX) / scale;
      let newWidth = initialWidth;
      if (side === 'right') {
        newWidth = Math.max(30, Math.min(540, Math.round(initialWidth + dx * 2)));
      } else {
        newWidth = Math.max(30, Math.min(540, Math.round(initialWidth - dx * 2)));
      }

      setCardGraphics((prev) => ({
        ...prev,
        [activeSide]: (prev[activeSide] || []).map((g) => {
          if (g.id !== graphicId) return g;
          return {
            ...g,
            size: {
              width: newWidth,
              height: typeof g.size === 'object' ? (g.size.height || 2) : 2,
            },
          };
        }),
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // --- Interactive Corner Scaling for Icons, Shapes & QR on Canvas ---
  const handleStartGraphicScale = (e, graphicId, corner) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const currentList = cardGraphics[activeSide] || [];
    const target = currentList.find((g) => g.id === graphicId);
    if (!target || target.locked) return;

    const initialSize = typeof target.size === 'number'
      ? target.size
      : (typeof target.size === 'object' ? (target.size.width || 24) : 24);
    const scale = zoom / 100;
    const factorX = corner.includes('right') ? 1 : -1;
    const factorY = corner.includes('bottom') ? 1 : -1;

    const onMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      const dx = ((moveEvent.clientX - startX) / scale) * factorX;
      const dy = ((moveEvent.clientY - startY) / scale) * factorY;
      const delta = (dx + dy) / 2;
      const newSize = Math.max(12, Math.min(160, Math.round(initialSize + delta)));

      setCardGraphics((prev) => ({
        ...prev,
        [activeSide]: (prev[activeSide] || []).map((g) =>
          g.id === graphicId ? { ...g, size: newSize } : g
        ),
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // --- Interactive Corner Scaling (Font Size) ---
  const handleStartScale = (e, fieldKey, corner) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const curStyle = textStyles[fieldKey] || {};
    const initialFontSize = curStyle.fontSize || 14;
    const scale = zoom / 100;
    const factorX = corner.includes('right') ? 1 : -1;
    const factorY = corner.includes('bottom') ? 1 : -1;

    const onMouseMove = (moveEvent) => {
      const dx = ((moveEvent.clientX - startX) / scale) * factorX;
      const dy = ((moveEvent.clientY - startY) / scale) * factorY;
      const delta = (dx + dy) / 2;
      const newFontSize = Math.max(8, Math.min(72, Math.round(initialFontSize + delta / 4)));
      setTextStyles((prev) => ({
        ...prev,
        [fieldKey]: {
          ...(prev[fieldKey] || {}),
          fontSize: newFontSize,
        },
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // --- Interactive Rotation (Click or Drag) ---
  const handleStartRotate = (e, fieldKey) => {
    e.preventDefault();
    e.stopPropagation();

    const el = elemRefs.current[fieldKey];
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const initialRotation = textStyles[fieldKey]?.rotation || 0;
    let didDrag = false;

    const onMouseMove = (moveEvent) => {
      didDrag = true;
      const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * (180 / Math.PI);
      const diff = currentAngle - startAngle;
      const newRotation = Math.round((initialRotation + diff) % 360);
      setTextStyles((prev) => ({
        ...prev,
        [fieldKey]: {
          ...(prev[fieldKey] || {}),
          rotation: newRotation,
        },
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      // If user merely clicked without dragging, step rotation by 45 degrees
      if (!didDrag) {
        setTextStyles((prev) => ({
          ...prev,
          [fieldKey]: {
            ...(prev[fieldKey] || {}),
            rotation: ((prev[fieldKey]?.rotation || 0) + 45) % 360,
          },
        }));
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // ================= INTERACTIVE ADJUSTABLE ARTWORK & LOGO HANDLERS =================
  const handleStartArtworkMove = (e, side = activeSide) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveField(side === 'front' ? 'uploaded_artwork_front' : 'uploaded_artwork_back');

    const startX = e.clientX;
    const startY = e.clientY;
    const curTransform = side === 'front' ? frontArtworkTransform : backArtworkTransform;
    const initialX = curTransform.x || 0;
    const initialY = curTransform.y || 0;
    const s = zoom / 100;

    const onMouseMove = (moveEvent) => {
      const dx = (moveEvent.clientX - startX) / s;
      const dy = (moveEvent.clientY - startY) / s;
      const setter = side === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
      setter((prev) => ({
        ...prev,
        x: Math.round(initialX + dx),
        y: Math.round(initialY + dy),
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleStartArtworkScale = (e, side = activeSide, corner) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const curTransform = side === 'front' ? frontArtworkTransform : backArtworkTransform;
    const initialScale = curTransform.scale || 1.0;
    const s = zoom / 100;
    const factorX = corner.includes('right') ? 1 : -1;
    const factorY = corner.includes('bottom') ? 1 : -1;

    const onMouseMove = (moveEvent) => {
      const dx = ((moveEvent.clientX - startX) / s) * factorX;
      const dy = ((moveEvent.clientY - startY) / s) * factorY;
      const delta = (dx + dy) / 2;
      const newScale = Math.max(0.15, Math.min(3.5, Number((initialScale + delta / 180).toFixed(2))));
      const setter = side === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
      setter((prev) => ({
        ...prev,
        scale: newScale,
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleStartArtworkRotate = (e, side = activeSide) => {
    e.preventDefault();
    e.stopPropagation();

    const el = side === 'front' ? frontArtworkRef.current : backArtworkRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const curTransform = side === 'front' ? frontArtworkTransform : backArtworkTransform;
    const initialRotation = curTransform.rotation || 0;
    let didDrag = false;

    const onMouseMove = (moveEvent) => {
      didDrag = true;
      const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * (180 / Math.PI);
      const diff = currentAngle - startAngle;
      const newRotation = Math.round((initialRotation + diff) % 360);
      const setter = side === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
      setter((prev) => ({
        ...prev,
        rotation: newRotation < 0 ? newRotation + 360 : newRotation,
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (!didDrag) {
        const setter = side === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
        setter((prev) => ({
          ...prev,
          rotation: ((prev.rotation || 0) + 45) % 360,
        }));
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleArtworkAlign = (side, hAlign, vAlign) => {
    const isVert = orientation === 'vertical';
    const cardW = isVert ? 330 : 580;
    const cardH = isVert ? 580 : 330;
    const maxOffsetH = Math.round(cardW * 0.28);
    const maxOffsetV = Math.round(cardH * 0.28);

    let newX = 0;
    if (hAlign === 'left') newX = -maxOffsetH;
    else if (hAlign === 'right') newX = maxOffsetH;
    else if (hAlign === 'center') newX = 0;

    let newY = 0;
    if (vAlign === 'top') newY = -maxOffsetV;
    else if (vAlign === 'bottom') newY = maxOffsetV;
    else if (vAlign === 'middle') newY = 0;

    const setter = side === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
    setter((prev) => ({
      ...prev,
      x: hAlign !== undefined ? newX : prev.x,
      y: vAlign !== undefined ? newY : prev.y,
    }));
  };

  const renderAdjustableArtwork = (side = 'front', isPreview = false) => {
    const artworkSrc = side === 'front' ? frontArtwork : backArtwork;
    if (!artworkSrc) return null;

    const currentTransform = side === 'front' ? frontArtworkTransform : backArtworkTransform;
    const isSelected = !isPreview && activeField === (side === 'front' ? 'uploaded_artwork_front' : 'uploaded_artwork_back');
    const isLocked = Boolean(currentTransform.locked);

    if (isPreview) {
      return (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) translate(${currentTransform.x || 0}px, ${currentTransform.y || 0}px) rotate(${currentTransform.rotation || 0}deg) scale(${currentTransform.scale || 1})`,
            transformOrigin: 'center center',
            width: currentTransform.fitMode === 'cover' ? '100%' : '88%',
            height: currentTransform.fitMode === 'cover' ? '100%' : '82%',
            maxWidth: currentTransform.fitMode === 'cover' ? '100%' : '94%',
            maxHeight: currentTransform.fitMode === 'cover' ? '100%' : '90%',
            zIndex: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <img
            src={artworkSrc}
            alt="Your Uploaded Design / Logo"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: currentTransform.fitMode === 'cover' ? 'cover' : 'contain',
              opacity: currentTransform.opacity !== undefined ? currentTransform.opacity : 1,
              pointerEvents: 'none',
              userSelect: 'none',
              display: 'block',
            }}
          />
        </div>
      );
    }

    return (
      <div
        ref={side === 'front' ? frontArtworkRef : backArtworkRef}
        className={`vp-adjustable-artwork-wrapper ${isSelected ? 'active-selected' : ''}`}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${currentTransform.x || 0}px, ${currentTransform.y || 0}px) rotate(${currentTransform.rotation || 0}deg) scale(${currentTransform.scale || 1})`,
          transformOrigin: 'center center',
          width: currentTransform.fitMode === 'cover' ? '100%' : '88%',
          height: currentTransform.fitMode === 'cover' ? '100%' : '82%',
          maxWidth: currentTransform.fitMode === 'cover' ? '100%' : '94%',
          maxHeight: currentTransform.fitMode === 'cover' ? '100%' : '90%',
          cursor: isLocked ? 'default' : isSelected ? 'move' : 'pointer',
          zIndex: 15,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={(e) => {
          e.stopPropagation();
          setActiveField(side === 'front' ? 'uploaded_artwork_front' : 'uploaded_artwork_back');
          setActiveTool('uploads');
        }}
        onMouseDown={(e) => {
          if (!isLocked) {
            handleStartArtworkMove(e, side);
          }
        }}
      >
        {/* Floating Mini Action Toolbar above Selected Artwork / Logo */}
        {isSelected && (
          <div className="vp-element-mini-toolbar vp-artwork-mini-toolbar" onClick={(e) => e.stopPropagation()}>
            {/* Scale Down */}
            <button
              type="button"
              className="vp-mini-btn"
              title="Scale Down (-10%)"
              onClick={() => {
                const setter = side === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                setter((prev) => ({
                  ...prev,
                  scale: Math.max(0.15, Number(((prev.scale || 1) - 0.1).toFixed(2))),
                }));
              }}
            >
              <Minus size={12} />
            </button>

            {/* Scale percentage badge */}
            <span className="vp-mini-scale-badge" title="Current Scale">
              {Math.round((currentTransform.scale || 1) * 100)}%
            </span>

            {/* Scale Up */}
            <button
              type="button"
              className="vp-mini-btn"
              title="Scale Up (+10%)"
              onClick={() => {
                const setter = side === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                setter((prev) => ({
                  ...prev,
                  scale: Math.min(3.5, Number(((prev.scale || 1) + 0.1).toFixed(2))),
                }));
              }}
            >
              <Plus size={12} />
            </button>

            <div className="vp-toolbar-divider" />

            {/* Center on card */}
            <button
              type="button"
              className="vp-mini-action-pill"
              title="Center Logo on Card"
              onClick={() => {
                const setter = side === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                setter((prev) => ({ ...prev, x: 0, y: 0 }));
              }}
            >
              <Crosshair size={12} />
              <span>Center</span>
            </button>

            {/* Fit Safety Area */}
            <button
              type="button"
              className={`vp-mini-action-pill ${currentTransform.fitMode === 'contain' ? 'active' : ''}`}
              title="Fit Logo safely inside green margins"
              onClick={() => {
                const setter = side === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                setter((prev) => ({ ...prev, x: 0, y: 0, scale: 0.9, fitMode: 'contain' }));
              }}
            >
              <Maximize2 size={12} />
              <span>Fit Safe</span>
            </button>

            {/* Fill Bleed */}
            <button
              type="button"
              className={`vp-mini-action-pill ${currentTransform.fitMode === 'cover' ? 'active' : ''}`}
              title="Fill entire card (Full Bleed Background)"
              onClick={() => {
                const setter = side === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                setter((prev) => ({ ...prev, x: 0, y: 0, scale: 1.15, fitMode: 'cover' }));
              }}
            >
              <Layers size={12} />
              <span>Fill Bleed</span>
            </button>

            <div className="vp-toolbar-divider" />

            {/* Rotate 90 deg */}
            <button
              type="button"
              className="vp-mini-btn"
              title="Rotate 90° clockwise"
              onClick={() => {
                const setter = side === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                setter((prev) => ({
                  ...prev,
                  rotation: ((prev.rotation || 0) + 90) % 360,
                }));
              }}
            >
              <RotateCw size={12} />
            </button>

            {/* Lock / Unlock */}
            <button
              type="button"
              className={`vp-mini-btn ${isLocked ? 'locked' : ''}`}
              title={isLocked ? "Unlock Logo" : "Lock Logo in Place"}
              onClick={() => {
                const setter = side === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                setter((prev) => ({ ...prev, locked: !prev.locked }));
              }}
            >
              {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
            </button>

            {/* Reset */}
            <button
              type="button"
              className="vp-mini-btn"
              title="Reset position and size"
              onClick={() => {
                const setter = side === 'front' ? setFrontArtworkTransform : setBackArtworkTransform;
                setter(() => ({
                  x: 0,
                  y: 0,
                  scale: 0.95,
                  rotation: 0,
                  fitMode: 'contain',
                  opacity: 1,
                  locked: false,
                }));
              }}
            >
              <RotateCcw size={12} />
            </button>

            {/* Replace */}
            <button
              type="button"
              className="vp-mini-btn"
              title="Replace Image"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={12} />
            </button>

            {/* Delete */}
            <button
              type="button"
              className="vp-mini-btn delete"
              title="Remove Artwork"
              onClick={() => {
                if (side === 'front') {
                  setFrontArtwork(null);
                } else {
                  setBackArtwork(null);
                }
                setActiveField(null);
              }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}

        {/* 4 Corner Resize Handles */}
        {isSelected && !isLocked && (
          <>
            <div
              className="vp-selection-handle corner top-left"
              title="Drag to resize logo"
              onMouseDown={(e) => handleStartArtworkScale(e, side, 'top-left')}
            />
            <div
              className="vp-selection-handle corner top-right"
              title="Drag to resize logo"
              onMouseDown={(e) => handleStartArtworkScale(e, side, 'top-right')}
            />
            <div
              className="vp-selection-handle corner bottom-left"
              title="Drag to resize logo"
              onMouseDown={(e) => handleStartArtworkScale(e, side, 'bottom-left')}
            />
            <div
              className="vp-selection-handle corner bottom-right"
              title="Drag to resize logo"
              onMouseDown={(e) => handleStartArtworkScale(e, side, 'bottom-right')}
            />
          </>
        )}

        {/* The Artwork Image */}
        <img
          src={artworkSrc}
          alt="Your Uploaded Design / Logo"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: currentTransform.fitMode === 'cover' ? 'cover' : 'contain',
            opacity: currentTransform.opacity !== undefined ? currentTransform.opacity : 1,
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'block',
          }}
        />

        {/* Bottom Floating Action Badges: [✥ Move] [↻ Rotate] */}
        {isSelected && !isLocked && (
          <div className="vp-element-bottom-handles" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="vp-handle-circle vp-move-handle"
              title="Drag to move logo anywhere on card"
              onMouseDown={(e) => handleStartArtworkMove(e, side)}
            >
              <Move size={11} />
            </button>
            <button
              type="button"
              className="vp-handle-circle vp-rotate-handle"
              title="Click or drag to rotate logo"
              onMouseDown={(e) => handleStartArtworkRotate(e, side)}
            >
              <RotateCw size={11} />
            </button>
          </div>
        )}
      </div>
    );
  };

  // ================= DEDICATED ADJUSTABLE LOGO HANDLERS & RENDERER =================
  const handleStartLogoMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveField('logo');

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = logoTransform.x || 0;
    const initialY = logoTransform.y || 0;
    const s = zoom / 100;

    const onMouseMove = (moveEvent) => {
      const dx = (moveEvent.clientX - startX) / s;
      const dy = (moveEvent.clientY - startY) / s;
      setLogoTransform((prev) => ({
        ...prev,
        x: Math.round(initialX + dx),
        y: Math.round(initialY + dy),
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleStartLogoScale = (e, corner) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialScale = logoTransform.scale || 1.0;
    const s = zoom / 100;
    const factorX = corner.includes('right') ? 1 : -1;
    const factorY = corner.includes('bottom') ? 1 : -1;

    const onMouseMove = (moveEvent) => {
      const dx = ((moveEvent.clientX - startX) / s) * factorX;
      const dy = ((moveEvent.clientY - startY) / s) * factorY;
      const delta = (dx + dy) / 2;
      const newScale = Math.max(0.25, Math.min(3.0, Number((initialScale + delta / 120).toFixed(2))));
      setLogoTransform((prev) => ({
        ...prev,
        scale: newScale,
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const renderAdjustableLogo = (isPreview = false) => {
    const isSelected = !isPreview && activeField === 'logo';
    const baseSize = 74;
    const currentScale = logoTransform.scale || 1;
    const scaledWidth = Math.round(baseSize * currentScale);
    const scaledHeight = Math.round(baseSize * currentScale);

    if (isPreview) {
      if (!uploadedLogo) return null;
      return (
        <div
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            transform: `translate(${logoTransform.x || 0}px, ${logoTransform.y || 0}px) rotate(${logoTransform.rotation || 0}deg)`,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            src={uploadedLogo}
            alt="Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      );
    }

    return (
      <div
        className={`vp-adjustable-logo-wrapper ${isSelected ? 'active-selected' : ''}`}
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          transform: `translate(${logoTransform.x || 0}px, ${logoTransform.y || 0}px) rotate(${logoTransform.rotation || 0}deg)`,
          flexShrink: 0,
          position: 'relative',
          cursor: isSelected ? 'move' : 'pointer',
          borderRadius: '4px',
          background: uploadedLogo ? 'transparent' : '#f1f5f9',
          border: isSelected ? '2px solid #0099ff' : uploadedLogo ? '1.5px dashed transparent' : '1.5px dashed #94a3b8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxSizing: 'border-box',
          userSelect: 'none',
          zIndex: isSelected ? 28 : 12,
        }}
        onClick={(e) => {
          e.stopPropagation();
          setActiveField('logo');
          setActiveTool('uploads');
          if (!uploadedLogo) {
            setIsLogoModalOpen(true);
          }
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setIsLogoModalOpen(true);
        }}
        onMouseDown={(e) => {
          if (isSelected) {
            handleStartLogoMove(e);
          }
        }}
      >
        {/* Floating Mini Action Toolbar when Logo is Selected */}
        {isSelected && (
          <div className="vp-element-mini-toolbar" onClick={(e) => e.stopPropagation()} style={{ top: '-46px' }}>
            {/* Scale Down */}
            <button
              type="button"
              className="vp-mini-btn"
              title="Scale Down (-10%)"
              onClick={() => {
                setLogoTransform((prev) => ({
                  ...prev,
                  scale: Math.max(0.3, Number(((prev.scale || 1) - 0.1).toFixed(2))),
                }));
              }}
            >
              <Minus size={12} />
            </button>

            {/* Scale percentage badge */}
            <span className="vp-mini-scale-badge" title="Current Logo Size">
              {Math.round(currentScale * 100)}%
            </span>

            {/* Scale Up */}
            <button
              type="button"
              className="vp-mini-btn"
              title="Scale Up (+10%)"
              onClick={() => {
                setLogoTransform((prev) => ({
                  ...prev,
                  scale: Math.min(3.0, Number(((prev.scale || 1) + 0.1).toFixed(2))),
                }));
              }}
            >
              <Plus size={12} />
            </button>

            <div className="vp-toolbar-divider" />

            {/* Open Upload / Adjust Modal */}
            <button
              type="button"
              className="vp-mini-action-pill active"
              title="Open Logo Upload Modal"
              onClick={() => setIsLogoModalOpen(true)}
            >
              <UploadCloud size={12} />
              <span>{uploadedLogo ? 'Change' : 'Upload'}</span>
            </button>

            {/* Reset Position */}
            <button
              type="button"
              className="vp-mini-action-pill"
              title="Reset Position (0, 0)"
              onClick={() => setLogoTransform((prev) => ({ ...prev, x: 0, y: 0 }))}
            >
              <Crosshair size={12} />
              <span>Reset</span>
            </button>

            {/* Delete Logo */}
            {uploadedLogo && (
              <button
                type="button"
                className="vp-mini-btn vp-mini-btn-danger"
                title="Remove Logo"
                onClick={() => {
                  setUploadedLogo(null);
                  setLogoTransform({ x: 0, y: 0, scale: 1, rotation: 0, width: 100, height: 100, opacity: 1, locked: false });
                }}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        )}

        {/* 4 Corner Resize Handles when Selected */}
        {isSelected && (
          <>
            <div
              className="vp-selection-handle corner top-left"
              title="Drag to resize logo"
              onMouseDown={(e) => handleStartLogoScale(e, 'top-left')}
            />
            <div
              className="vp-selection-handle corner top-right"
              title="Drag to resize logo"
              onMouseDown={(e) => handleStartLogoScale(e, 'top-right')}
            />
            <div
              className="vp-selection-handle corner bottom-left"
              title="Drag to resize logo"
              onMouseDown={(e) => handleStartLogoScale(e, 'bottom-left')}
            />
            <div
              className="vp-selection-handle corner bottom-right"
              title="Drag to resize logo"
              onMouseDown={(e) => handleStartLogoScale(e, 'bottom-right')}
            />
          </>
        )}

        {/* Logo Image or Empty Placeholder */}
        {uploadedLogo ? (
          <img
            src={uploadedLogo}
            alt="Logo"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              color: '#64748b',
              cursor: 'pointer',
              width: '100%',
              height: '100%',
            }}
            onClick={() => setIsLogoModalOpen(true)}
            title="Click to upload logo or photo"
          >
            <ImageIcon size={18} style={{ opacity: 0.7, marginBottom: '2px' }} />
            <span style={{ fontSize: '0.62rem', fontWeight: 600, color: '#475569' }}>Your Photo</span>
            <span style={{ fontSize: '0.48rem', opacity: 0.8 }}>or</span>
            <span style={{ fontSize: '0.62rem', fontWeight: 600, color: '#475569' }}>Logo Here</span>
          </div>
        )}
      </div>
    );
  };

  // ================= GRAPHICS & SHAPES CATALOG & HANDLERS =================
  const VISITING_CARD_GRAPHICS = [
    // 1. Contact & Communications
    { id: 'phone', name: 'Phone', label: 'Phone', category: 'contact', type: 'icon' },
    { id: 'smartphone', name: 'Smartphone', label: 'Mobile', category: 'contact', type: 'icon' },
    { id: 'phonecall', name: 'PhoneCall', label: 'Hotline', category: 'contact', type: 'icon' },
    { id: 'mail', name: 'Mail', label: 'Email', category: 'contact', type: 'icon' },
    { id: 'globe', name: 'Globe', label: 'Website', category: 'contact', type: 'icon' },
    { id: 'mappin', name: 'MapPin', label: 'Location', category: 'contact', type: 'icon' },
    { id: 'building', name: 'Building2', label: 'Office', category: 'contact', type: 'icon' },
    { id: 'message', name: 'MessageCircle', label: 'Chat / SMS', category: 'contact', type: 'icon' },
    { id: 'send', name: 'Send', label: 'Telegram', category: 'contact', type: 'icon' },

    // 2. Social Media Channels
    { id: 'whatsapp', name: 'WhatsApp', label: 'WhatsApp', category: 'social', type: 'icon' },
    { id: 'linkedin', name: 'LinkedIn', label: 'LinkedIn', category: 'social', type: 'icon' },
    { id: 'instagram', name: 'Instagram', label: 'Instagram', category: 'social', type: 'icon' },
    { id: 'facebook', name: 'Facebook', label: 'Facebook', category: 'social', type: 'icon' },
    { id: 'twitter', name: 'Twitter', label: 'X / Twitter', category: 'social', type: 'icon' },
    { id: 'youtube', name: 'YouTube', label: 'YouTube', category: 'social', type: 'icon' },

    // 3. Business & Trust Badges
    { id: 'briefcase', name: 'Briefcase', label: 'Services', category: 'business', type: 'icon' },
    { id: 'user', name: 'User', label: 'Founder', category: 'business', type: 'icon' },
    { id: 'users', name: 'Users', label: 'Team', category: 'business', type: 'icon' },
    { id: 'award', name: 'Award', label: 'Certified', category: 'business', type: 'icon' },
    { id: 'shield', name: 'ShieldCheck', label: 'Guaranteed', category: 'business', type: 'icon' },
    { id: 'clock', name: 'Clock', label: '24/7 Hours', category: 'business', type: 'icon' },
    { id: 'creditcard', name: 'CreditCard', label: 'Payments', category: 'business', type: 'icon' },
    { id: 'star', name: 'Star', label: 'Top Rated', category: 'business', type: 'icon' },
    { id: 'qrcode', name: 'QrCode', label: 'QR Scan', category: 'business', type: 'icon' },

    // 4. Badges & Shapes
    { id: 'circle_shape', name: 'circle', label: 'Circle Dot', category: 'shapes', type: 'shape' },
    { id: 'square_shape', name: 'square', label: 'Square Block', category: 'shapes', type: 'shape' },
    { id: 'pill_shape', name: 'pill', label: 'Pill Badge', category: 'shapes', type: 'shape' },
    { id: 'badge_shape', name: 'badge', label: 'Outline Badge', category: 'shapes', type: 'shape' },

    // 5. Dividers & Accent Rules
    { id: 'divider_thin', name: 'divider', label: 'Thin Divider', category: 'shapes', type: 'divider', size: { width: 180, height: 2 } },
    { id: 'divider_thick', name: 'divider', label: 'Bold Accent Bar', category: 'shapes', type: 'divider', size: { width: 220, height: 4 } },
    { id: 'divider_short', name: 'divider', label: 'Mini Accent Bar', category: 'shapes', type: 'divider', size: { width: 60, height: 3 } },
  ];

  const BG_SOLID_PRESETS = [
    { name: 'Pure White', value: '#ffffff' },
    { name: 'Clean Slate', value: '#f8fafc' },
    { name: 'Soft Linen', value: '#fdfbf7' },
    { name: 'Warm Greige', value: '#f5f5f4' },
    { name: 'Charcoal Navy', value: '#0f172a' },
    { name: 'Executive Obsidian', value: '#09090b' },
    { name: 'Royal Sapphire', value: '#1e3a8a' },
    { name: 'Deep Navy', value: '#172554' },
    { name: 'Rich Emerald', value: '#064e3b' },
    { name: 'Burgundy Crimson', value: '#4c0519' },
    { name: 'Metallic Bronze', value: '#292524' },
    { name: 'Soft Powder Blue', value: '#f0f9ff' },
  ];

  const BG_GRADIENT_PRESETS = [
    { name: 'Executive Midnight', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
    { name: 'Royal Indigo', value: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' },
    { name: 'Luxury Gold & Slate', value: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)' },
    { name: 'Emerald Velvet', value: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)' },
    { name: 'Titanium Frost', value: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' },
    { name: 'Rose Champagne', value: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)' },
    { name: 'Warm Amber', value: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' },
    { name: 'Teal Elegance', value: 'linear-gradient(135deg, #042f2e 0%, #0d9488 100%)' },
  ];

  const BG_PATTERNS = [
    { id: 'none', title: 'None', desc: 'Plain background' },
    { id: 'dots', title: 'Dot Matrix', desc: 'Subtle micro polka dots' },
    { id: 'grid', title: 'Grid Line', desc: 'Architectural blueprint' },
    { id: 'stripes', title: 'Pinstripe', desc: 'Executive diagonal lines' },
    { id: 'mesh', title: 'Color Mesh', desc: 'Soft dual-radial gradient' },
  ];

  const alignGraphic = (graphicId, hPos, vPos) => {
    const isVert = orientation === 'vertical';
    const xOffset = isVert ? 95 : 180;
    const yOffset = isVert ? 180 : 90;

    let x = 0;
    if (hPos === 'left') x = -xOffset;
    if (hPos === 'right') x = xOffset;

    let y = 0;
    if (vPos === 'top') y = -yOffset;
    if (vPos === 'bottom') y = yOffset;

    updateGraphic(graphicId, { x, y });
  };

  const handleDownloadVCard = () => {
    const vCardContent = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${fields.fullName || 'Professional'}`,
      `TITLE:${fields.jobTitle || ''}`,
      `ORG:${fields.companyName || ''}`,
      `TEL;TYPE=WORK,VOICE:${fields.phone || ''}`,
      `EMAIL;TYPE=PREF,INTERNET:${fields.email || ''}`,
      `URL:${fields.web || ''}`,
      `ADR;TYPE=WORK:;;${fields.address1 || ''} ${fields.address2 || ''};;;;`,
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${(fields.fullName || 'visiting_card').replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderGraphicPreview = (item) => {
    if (item.type === 'divider') {
      return (
        <div
          style={{
            width: item.id === 'divider_short' ? '24px' : '40px',
            height: item.size?.height === 4 ? '4px' : '2px',
            background: activeColor,
            borderRadius: '2px',
          }}
        />
      );
    }
    if (item.type === 'shape') {
      return renderGraphicIconOrShape({ ...item, size: 18, color: activeColor });
    }
    return renderGraphicIconOrShape({ ...item, size: 20, color: activeColor });
  };

  const handleAddGraphic = (item) => {
    const newId = `gfx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newGraphic = {
      id: newId,
      type: item.type || 'icon',
      name: item.name,
      label: item.label,
      side: activeSide,
      x: 0,
      y: 0,
      size: item.type === 'divider' ? (item.size || { width: 180, height: 3 }) : 28,
      color: activeColor || '#000000',
      rotation: 0,
      locked: false,
    };
    setCardGraphics((prev) => ({
      ...prev,
      [activeSide]: [...(prev[activeSide] || []), newGraphic],
    }));
    setActiveField(newId);
  };

  const handleAddQrCode = (dataUrl) => {
    const newId = `qr_${Date.now()}`;
    const newGraphic = {
      id: newId,
      type: 'qr',
      name: 'QRCode',
      label: 'QR Code',
      side: activeSide,
      x: 0,
      y: 0,
      size: 32,
      color: '#000000',
      rotation: 0,
      locked: false,
      data: dataUrl || 'https://asapnow.in',
    };
    setCardGraphics((prev) => ({
      ...prev,
      [activeSide]: [...(prev[activeSide] || []), newGraphic],
    }));
    setActiveField(newId);
  };

  const handleStartGraphicMove = (e, graphicId) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveField(graphicId);

    const startX = e.clientX;
    const startY = e.clientY;
    const currentList = cardGraphics[activeSide] || [];
    const targetItem = currentList.find((g) => g.id === graphicId);
    if (!targetItem || targetItem.locked) return;

    const initialX = targetItem.x || 0;
    const initialY = targetItem.y || 0;
    const s = zoom / 100;

    const onMouseMove = (moveEvent) => {
      const dx = (moveEvent.clientX - startX) / s;
      const dy = (moveEvent.clientY - startY) / s;
      setCardGraphics((prev) => ({
        ...prev,
        [activeSide]: (prev[activeSide] || []).map((g) =>
          g.id === graphicId ? { ...g, x: Math.round(initialX + dx), y: Math.round(initialY + dy) } : g
        ),
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const updateGraphic = (graphicId, updates) => {
    setCardGraphics((prev) => ({
      ...prev,
      [activeSide]: (prev[activeSide] || []).map((g) =>
        g.id === graphicId ? { ...g, ...updates } : g
      ),
    }));
  };

  const removeGraphic = (graphicId) => {
    setCardGraphics((prev) => ({
      ...prev,
      [activeSide]: (prev[activeSide] || []).filter((g) => g.id !== graphicId),
    }));
    if (activeField === graphicId) setActiveField(null);
  };

  const duplicateGraphic = (graphicId) => {
    const currentList = cardGraphics[activeSide] || [];
    const targetItem = currentList.find((g) => g.id === graphicId);
    if (!targetItem) return;
    const cloned = {
      ...targetItem,
      id: `gfx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      x: (targetItem.x || 0) + 12,
      y: (targetItem.y || 0) + 12,
    };
    setCardGraphics((prev) => ({
      ...prev,
      [activeSide]: [...prev[activeSide], cloned],
    }));
    setActiveField(cloned.id);
  };

  const renderGraphicIconOrShape = (item) => {
    const size = typeof item.size === 'number'
      ? item.size
      : (typeof item.size === 'object' ? (item.size.width || item.size.size || 24) : 24);
    const color = item.color || activeColor;

    if (item.type === 'qr') {
      return (
        <div style={{ padding: '3px', background: '#ffffff', borderRadius: '4px', border: '1px solid #cbd5e1', display: 'inline-flex', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(item.data || 'https://asapnow.in')}`}
            alt="Card QR Code"
            style={{ width: `${size * 2}px`, height: `${size * 2}px`, display: 'block' }}
            draggable={false}
          />
        </div>
      );
    }

    if (item.type === 'divider') {
      const w = typeof item.size === 'object' ? (item.size.width || 180) : 180;
      const h = typeof item.size === 'object' ? (item.size.height || 2) : 2;
      return (
        <div
          style={{
            width: `${w}px`,
            height: `${h}px`,
            background: color,
            borderRadius: '2px',
          }}
        />
      );
    }

    if (item.type === 'shape') {
      if (item.name === 'circle') {
        return <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', background: color, flexShrink: 0 }} />;
      }
      if (item.name === 'square') {
        return <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: '4px', background: color, flexShrink: 0 }} />;
      }
      if (item.name === 'pill') {
        return <div style={{ width: `${Math.round(size * 2.2)}px`, height: `${Math.round(size * 0.9)}px`, borderRadius: '9999px', background: color, flexShrink: 0 }} />;
      }
      if (item.name === 'badge') {
        return <div style={{ width: `${Math.round(size * 2)}px`, height: `${size}px`, borderRadius: '9999px', border: `2px solid ${color}`, background: 'transparent', flexShrink: 0 }} />;
      }
    }

    // Social Media Icons via crisp SVGs
    if (item.name === 'WhatsApp') {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
        </svg>
      );
    }
    if (item.name === 'LinkedIn') {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    }
    if (item.name === 'Instagram') {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    }
    if (item.name === 'Facebook') {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    }
    if (item.name === 'Twitter') {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4l11.733 16h4.267l-11.733-16z" />
          <path d="M4 20l6.768-6.768m3.5-3.5L20 4" />
        </svg>
      );
    }
    if (item.name === 'YouTube') {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      );
    }

    // Lucide Icons for Visiting Cards
    const iconMap = {
      Phone: <Phone size={size} color={color} />,
      PhoneCall: <PhoneCall size={size} color={color} />,
      Smartphone: <Smartphone size={size} color={color} />,
      Mail: <Mail size={size} color={color} />,
      Globe: <Globe size={size} color={color} />,
      MapPin: <MapPin size={size} color={color} />,
      Building2: <Building2 size={size} color={color} />,
      MessageCircle: <MessageCircle size={size} color={color} />,
      Send: <Send size={size} color={color} />,
      Briefcase: <Briefcase size={size} color={color} />,
      User: <User size={size} color={color} />,
      Users: <Users size={size} color={color} />,
      Award: <Award size={size} color={color} />,
      ShieldCheck: <ShieldCheck size={size} color={color} />,
      Clock: <Clock size={size} color={color} />,
      CreditCard: <CreditCard size={size} color={color} />,
      QrCode: <QrCode size={size} color={color} />,
      Star: <Star size={size} color={color} fill={color} />,
    };

    return iconMap[item.name] || <Star size={size} color={color} />;
  };

  const renderGraphicElement = (item) => {
    const isSelected = activeField === item.id;
    const isLocked = Boolean(item.locked);
    const isDivider = item.type === 'divider';
    const curSize = typeof item.size === 'number'
      ? item.size
      : (typeof item.size === 'object' ? (item.size.width || item.size.size || 24) : 24);
    const dividerWidth = typeof item.size === 'object' ? (item.size.width || 180) : curSize;

    return (
      <div
        key={item.id}
        className={`vp-canvas-selection-box ${isSelected ? 'active-selected' : ''}`}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${item.x || 0}px, ${item.y || 0}px) rotate(${item.rotation || 0}deg)`,
          zIndex: 32,
          cursor: isLocked ? 'default' : 'move',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px',
        }}
        onClick={(e) => {
          e.stopPropagation();
          setActiveField(item.id);
        }}
        onMouseDown={(e) => {
          if (!isLocked) handleStartGraphicMove(e, item.id);
        }}
      >
        {/* Floating Mini Action Toolbar */}
        {isSelected && (
          <div className="vp-element-mini-toolbar" onClick={(e) => e.stopPropagation()}>
            {/* Color picker */}
            <label
              className="vp-color-swatch-circle"
              style={{ backgroundColor: item.color || activeColor, width: '18px', height: '18px', cursor: 'pointer' }}
              title="Change icon / shape color"
            >
              <input
                type="color"
                value={item.color || activeColor}
                onChange={(e) => updateGraphic(item.id, { color: e.target.value })}
                className="vp-hidden-color-input"
              />
            </label>

            {/* Size / Width [-] [+] */}
            <button
              type="button"
              className="vp-mini-btn"
              title={isDivider ? "Decrease width" : "Decrease size"}
              onClick={() => {
                if (isDivider) {
                  const curW = typeof item.size === 'object' ? (item.size.width || 180) : 180;
                  const curH = typeof item.size === 'object' ? (item.size.height || 2) : 2;
                  updateGraphic(item.id, { size: { width: Math.max(30, curW - 15), height: curH } });
                } else {
                  updateGraphic(item.id, { size: Math.max(10, curSize - 2) });
                }
              }}
            >
              <Minus size={11} />
            </button>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '0 3px', color: '#475569', minWidth: '28px', textAlign: 'center' }}>
              {isDivider ? `${dividerWidth}px` : `${curSize}px`}
            </span>
            <button
              type="button"
              className="vp-mini-btn"
              title={isDivider ? "Increase width" : "Increase size"}
              onClick={() => {
                if (isDivider) {
                  const curW = typeof item.size === 'object' ? (item.size.width || 180) : 180;
                  const curH = typeof item.size === 'object' ? (item.size.height || 2) : 2;
                  updateGraphic(item.id, { size: { width: Math.min(540, curW + 15), height: curH } });
                } else {
                  updateGraphic(item.id, { size: Math.min(180, curSize + 2) });
                }
              }}
            >
              <Plus size={11} />
            </button>

            {/* Center on card */}
            <button
              type="button"
              className="vp-mini-btn"
              title="Center on card"
              onClick={() => updateGraphic(item.id, { x: 0, y: 0 })}
            >
              <Crosshair size={11} />
            </button>

            {/* Rotate */}
            <button
              type="button"
              className="vp-mini-btn"
              title="Rotate 45°"
              onClick={() => updateGraphic(item.id, { rotation: ((item.rotation || 0) + 45) % 360 })}
            >
              <RotateCw size={11} />
            </button>

            {/* Lock / Unlock */}
            <button
              type="button"
              className={`vp-mini-btn ${isLocked ? 'locked' : ''}`}
              title={isLocked ? 'Unlock graphic' : 'Lock graphic'}
              onClick={() => updateGraphic(item.id, { locked: !isLocked })}
            >
              {isLocked ? <Lock size={11} /> : <Unlock size={11} />}
            </button>

            {/* Duplicate */}
            <button
              type="button"
              className="vp-mini-btn"
              title="Duplicate"
              onClick={() => duplicateGraphic(item.id)}
            >
              <Copy size={11} />
            </button>

            {/* Delete */}
            <button
              type="button"
              className="vp-mini-btn delete"
              title="Remove graphic"
              onClick={() => removeGraphic(item.id)}
            >
              <Trash2 size={11} />
            </button>
          </div>
        )}

        {/* 4 Corner Resize Handles for Icons, Shapes & QR Codes */}
        {isSelected && !isLocked && !isDivider && (
          <>
            <div
              className="vp-selection-handle corner top-left"
              title="Drag to resize"
              onMouseDown={(e) => handleStartGraphicScale(e, item.id, 'top-left')}
            />
            <div
              className="vp-selection-handle corner top-right"
              title="Drag to resize"
              onMouseDown={(e) => handleStartGraphicScale(e, item.id, 'top-right')}
            />
            <div
              className="vp-selection-handle corner bottom-left"
              title="Drag to resize"
              onMouseDown={(e) => handleStartGraphicScale(e, item.id, 'bottom-left')}
            />
            <div
              className="vp-selection-handle corner bottom-right"
              title="Drag to resize"
              onMouseDown={(e) => handleStartGraphicScale(e, item.id, 'bottom-right')}
            />
          </>
        )}

        {/* 2 Side Stretch Handles for Dividers ONLY */}
        {isSelected && !isLocked && isDivider && (
          <>
            <div
              className="vp-selection-handle side middle-left"
              title="Drag to adjust width"
              onMouseDown={(e) => handleStartGraphicResizeWidth(e, item.id, 'left')}
            />
            <div
              className="vp-selection-handle side middle-right"
              title="Drag to adjust width"
              onMouseDown={(e) => handleStartGraphicResizeWidth(e, item.id, 'right')}
            />
          </>
        )}

        {/* Graphic Content */}
        {renderGraphicIconOrShape(item)}
      </div>
    );
  };


  const renderCanvasElement = (fieldKey, placeholder = '', defaultOverrides = {}, isPreview = false) => {
    return (
      <CanvasElement
        key={fieldKey}
        fieldKey={fieldKey}
        placeholder={placeholder}
        defaultOverrides={defaultOverrides}
        isPreview={isPreview}
        activeField={activeField}
        setActiveField={setActiveField}
        textStyles={textStyles}
        setTextStyles={setTextStyles}
        fields={fields}
        updateField={updateField}
        updateActiveStyle={updateActiveStyle}
        handleDuplicateField={handleDuplicateField}
        showMoreMenu={showMoreMenu}
        setShowMoreMenu={setShowMoreMenu}
        handleStartMove={handleStartMove}
        handleStartRotate={handleStartRotate}
        handleStartScale={handleStartScale}
        handleStartResizeWidth={handleStartResizeWidth}
        activeColor={activeColor}
        elemRefs={elemRefs}
      />
    );
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setUploadedLogo(evt.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const layout = activeTemplate?.layout_type || activeTemplate?.preview_style || (isCustomMode ? 'custom_upload' : 'classic_photo');
  const palette = (activeTemplate?.color_palette || '#0056b3,#1e293b,#047857,#b91c1c')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const renderCardSurfaceContent = (side, isPreview = false) => {
    return (
      <CardSurface
        side={side}
        isPreview={isPreview}
        cardBackground={cardBackground}
        activeGuide={activeGuide}
        cornerStyle={cornerStyle}
        frontArtwork={frontArtwork}
        backArtwork={backArtwork}
        isCustomMode={isCustomMode}
        renderAdjustableArtwork={renderAdjustableArtwork}
        fields={fields}
        renderCanvasElement={renderCanvasElement}
        layout={layout}
        activeColor={activeColor}
        activeTemplate={activeTemplate}
        uploadedLogo={uploadedLogo}
        renderAdjustableLogo={renderAdjustableLogo}
        setActiveTool={setActiveTool}
        setActiveField={setActiveField}
        backOption={backOption}
        initialTemplate={activeTemplate || initialTemplate}
        cardGraphics={cardGraphics}
        renderGraphicElement={renderGraphicElement}
        renderGraphicIconOrShape={renderGraphicIconOrShape}
        backsideType={backsideType}
        fileInputRef={fileInputRef}
      />
    );
  };

  // Dynamic pricing calculation based on selected product options
  let extraPerCard = 0;
  if (paperStock.includes('400')) extraPerCard += 0.40;
  if (finishType.includes('Glossy')) extraPerCard += 0.20;
  if (finishType.includes('Velvet')) extraPerCard += 0.50;
  if (cornerStyle === 'rounded') extraPerCard += 0.30;
  if (backsideType === 'color') extraPerCard += 0.80;
  if (backsideType === 'grayscale') extraPerCard += 0.40;

  // Base price per 100 cards aligns with standard Vistaprint tier (₹300.00 for 100 units)
  const basePricePer100 = Math.max(300.0, Number(currentCard?.base_price_100 || 300.0) + (extraPerCard * 100));
  const totalPrice = (basePricePer100 * (quantity / 100)).toFixed(2);

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const generateTemplateSpecificCanvas = (side) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 230;
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      const isLuxury = layout === 'luxury_black_gold' || activeTemplate?.slug?.includes('luxury') || activeTemplate?.title?.toLowerCase().includes('luxury');
      const isDark = isLuxury || activeColor === '#111827' || activeColor === '#0f172a' || activeColor === '#000000';
      const bgColor = isLuxury ? '#09090b' : isDark ? '#0f172a' : (cardBackground[side]?.value || '#ffffff');

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 400, 230);

      const brandColor = isLuxury ? '#d4af37' : (activeColor || '#0070f3');

      if (isLuxury) {
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, 380, 210);

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(35, 115);
        ctx.lineTo(170, 115);
        ctx.moveTo(230, 115);
        ctx.lineTo(365, 115);
        ctx.stroke();

        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(200, 107);
        ctx.lineTo(210, 115);
        ctx.lineTo(200, 123);
        ctx.lineTo(190, 115);
        ctx.closePath();
        ctx.fill();

        if (fields.fullName) {
          ctx.fillStyle = '#d4af37';
          ctx.font = 'bold 16px "Segoe UI", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(fields.fullName, 200, 65);
        }
        if (fields.jobTitle) {
          ctx.fillStyle = '#e2d59f';
          ctx.font = 'italic 12px "Segoe UI", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(fields.jobTitle, 200, 85);
        }
        if (fields.companyName) {
          ctx.fillStyle = '#d4af37';
          ctx.font = 'bold 17px "Segoe UI", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(fields.companyName, 200, 160);
        }
        if (fields.phone || fields.email) {
          ctx.fillStyle = '#d4af37';
          ctx.font = '11px "Segoe UI", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText([fields.phone, fields.email].filter(Boolean).join('  •  '), 200, 190);
        }
      } else {
        ctx.fillStyle = brandColor;
        ctx.fillRect(0, 0, 10, 230);
        ctx.fillRect(0, 0, 400, 4);

        if (fields.companyName) {
          ctx.fillStyle = brandColor;
          ctx.font = 'bold 18px "Segoe UI", sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(fields.companyName, 26, 46);
        }
        if (fields.fullName) {
          ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
          ctx.font = 'bold 16px "Segoe UI", sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(fields.fullName, 26, 96);
        }
        if (fields.jobTitle) {
          ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
          ctx.font = '13px "Segoe UI", sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(fields.jobTitle, 26, 118);
        }
        if (fields.phone) {
          ctx.font = '12px "Segoe UI", sans-serif';
          ctx.fillStyle = isDark ? '#cbd5e1' : '#475569';
          ctx.textAlign = 'left';
          ctx.fillText('📞 ' + fields.phone, 26, 165);
        }
        if (fields.email) {
          ctx.font = '12px "Segoe UI", sans-serif';
          ctx.fillStyle = isDark ? '#cbd5e1' : '#475569';
          ctx.textAlign = 'left';
          ctx.fillText('✉ ' + fields.email, 26, 188);
        }
      }

      return canvas.toDataURL('image/png');
    } catch (e) {
      return '';
    }
  };

  const generateCardThumbnail = async () => {
    try {
      if (frontArtwork) {
        return frontArtwork;
      }
      const el =
        document.getElementById('vp-render-capture-front') ||
        document.querySelector('.vp-3d-card-face-front') ||
        document.querySelector('.vp-card-stage-content');

      if (el && typeof html2canvas === 'function') {
        const canvas = await html2canvas(el, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          onclone: (clonedDoc) => {
            const node = clonedDoc.getElementById('vp-render-capture-front');
            if (node) {
              node.style.opacity = '1';
              node.style.display = 'block';
              node.style.visibility = 'visible';
            }
          },
        });
        const dataUrl = canvas.toDataURL('image/png');
        if (dataUrl && dataUrl.length > 500) {
          return dataUrl;
        }
      }
    } catch (e) {
      console.warn('html2canvas capture error front:', e);
    }
    return generateTemplateSpecificCanvas('front');
  };

  const generateBackCardThumbnail = async () => {
    try {
      if (backArtwork) {
        return backArtwork;
      }
      const el =
        document.getElementById('vp-render-capture-back') ||
        document.querySelector('.vp-3d-card-face-back');

      if (el && typeof html2canvas === 'function') {
        const canvas = await html2canvas(el, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          onclone: (clonedDoc) => {
            const node = clonedDoc.getElementById('vp-render-capture-back');
            if (node) {
              node.style.opacity = '1';
              node.style.display = 'block';
              node.style.visibility = 'visible';
            }
          },
        });
        const dataUrl = canvas.toDataURL('image/png');
        if (dataUrl && dataUrl.length > 500) {
          return dataUrl;
        }
      }
    } catch (e) {
      console.warn('html2canvas capture error back:', e);
    }
    return generateTemplateSpecificCanvas('back');
  };

  const handleAddToCartConfirm = async () => {
    if (isAddingToCart) return;
    setIsAddingToCart(true);

    if (onAddToCart) {
      try {
        const previewImg = await generateCardThumbnail();
        const backPreviewImg = await generateBackCardThumbnail();
        await onAddToCart({
          card_id: currentCard?.id || 25,
          title: currentCard?.title || 'Standard Visiting Cards',
          slug: currentCard?.slug || 'standard',
          quantity: Number(quantity) || 100,
          total_price: parseFloat(totalPrice) || 200.0,
          unit_price: parseFloat((totalPrice / quantity).toFixed(2)) || 2.0,
          custom_company: fields.companyName || '',
          custom_title: fields.jobTitle || '',
          custom_name: fields.fullName || '',
          custom_phone: fields.phone || '',
          custom_email: fields.email || '',
          accent_color: activeColor,
          template_name: activeTemplate?.title || (isCustomMode ? 'Custom Uploaded Design' : 'Custom Design'),
          paper_stock: selectedStock === 'Standard Glossy' ? 'Standard Glossy (350 gsm)' : (selectedStock === 'Standard Matte' ? 'Standard Matte (350 gsm)' : paperStock),
          finish: finishType,
          corner_style: cornerStyle,
          dimensions: cardDimension,
          orientation: orientation,
          backside: backsideType,
          uploaded_artwork: frontArtwork || backArtwork || '',
          uploaded_artwork_back: backArtwork || '',
          preview_image: previewImg || frontArtwork || '',
          back_preview_image: backPreviewImg || backArtwork || '',
        });
      } finally {
        setIsAddingToCart(false);
        setIsFinalStepsOpen(false);
        setIsNextStepOpen(false);
        setIsPreviewOpen(false);
      }
    } else {
      setIsAddingToCart(false);
      setIsFinalStepsOpen(false);
      setIsNextStepOpen(false);
      setIsPreviewOpen(false);
    }
  };

  // Full-page Final Steps Screen
  if (isFinalStepsOpen) {
    return (
      <FinalStepsScreen
        isOpen={isFinalStepsOpen}
        onClose={() => setIsFinalStepsOpen(false)}
        setIsFinalStepsOpen={setIsFinalStepsOpen}
        orientation={orientation}
        cardBackground={cardBackground}
        layout={layout}
        cornerStyle={cornerStyle}
        backsideType={backsideType}
        activeColor={activeColor}
        renderCardSurfaceContent={renderCardSurfaceContent}
        previewRotation={previewRotation}
        previewMode={previewMode}
        previewSide={previewSide}
        previewFinish={previewFinish}
        handlePreviewMouseDown={handlePreviewMouseDown}
        handlePreviewSideSwitch={handlePreviewSideSwitch}
        handleSetPresetAngle={handleSetPresetAngle}
        setPreviewMode={setPreviewMode}
        setPreviewFinish={setPreviewFinish}
        selectedStock={selectedStock}
        setSelectedStock={setSelectedStock}
        setPaperStock={setPaperStock}
        quantity={quantity}
        setQuantity={setQuantity}
        handleAddToCartConfirm={handleAddToCartConfirm}
        isAddingToCart={isAddingToCart}
        currentCard={currentCard}
        finishType={finishType}
        setFinishType={setFinishType}
        showPricingGuide={showPricingGuide}
        setShowPricingGuide={setShowPricingGuide}
        showDeliveryOptions={showDeliveryOptions}
        setShowDeliveryOptions={setShowDeliveryOptions}
        totalPrice={totalPrice}
        previewZoom={previewZoom}
        setPreviewZoom={setPreviewZoom}
        isDraggingPreview={isDraggingPreview}
      />
    );
  }

  return (
    <div className="vp-studio-root">
      {/* Hidden flat 2D capture container for exact edited card snapshot */}
      <div
        id="vp-render-capture-front"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: orientation === 'vertical' ? '330px' : '580px',
          height: orientation === 'vertical' ? '580px' : '330px',
          background: cardBackground.front?.value || (layout === 'luxury_black_gold' ? '#09090b' : '#ffffff'),
          borderRadius: cornerStyle === 'rounded' ? '18px' : '2px',
          padding: '16px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          zIndex: -99999,
          opacity: 0.001,
          pointerEvents: 'none',
        }}
      >
        {renderCardSurfaceContent('front', true)}
      </div>

      <div
        id="vp-render-capture-back"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: orientation === 'vertical' ? '330px' : '580px',
          height: orientation === 'vertical' ? '580px' : '330px',
          background:
            cardBackground.back?.value ||
            (backsideType === 'color' ? activeColor : backsideType === 'grayscale' ? '#334155' : (layout === 'luxury_black_gold' ? '#09090b' : '#ffffff')),
          borderRadius: cornerStyle === 'rounded' ? '18px' : '2px',
          padding: '16px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          zIndex: -99999,
          opacity: 0.001,
          pointerEvents: 'none',
        }}
      >
        {renderCardSurfaceContent('back', true)}
      </div>

      {/* ADMIN REVIEW TOP BANNER */}
      {isAdminReview && (
        <div
          style={{
            background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #0070ba',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                background: '#0070ba',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: 4,
                fontWeight: 800,
                fontSize: '11px',
                letterSpacing: '0.5px',
              }}
            >
              ADMIN TEMPLATE STUDIO
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>
              Reviewing & Customizing Plain Card Template: <strong style={{ color: '#38bdf8' }}>{activeTemplate?.title || 'Template'}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: 6,
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'background 0.2s',
              }}
            >
              ← Back to Review Modal
            </button>
            <button
              type="button"
              onClick={() => {
                if (onAdminPublishTemplate) {
                  onAdminPublishTemplate({
                    ...(activeTemplate || {}),
                    orientation,
                    primary_color: activeColor || activeTemplate?.primary_color || '#0070ba',
                    layout_type: 'card_recreation',
                    preview_style: 'card_recreation',
                    sample_name: fields.fullName || 'Full Name',
                    sample_job_title: fields.jobTitle || 'Job Title',
                    sample_company: fields.companyName || 'COMPANY NAME',
                    sample_tagline: fields.companyMessage || 'Your Business Tagline Here',
                    sample_phone: fields.phone || '+1 (555) 000-0000',
                    sample_email: fields.email || 'contact@company.com',
                    text_positions: {
                      ...(activeTemplate?.text_positions || {}),
                      card_recreation: true,
                      status: 'PUBLISHED',
                      templateJson: {
                        ...(activeTemplate?.text_positions?.templateJson || {}),
                        canvas: {
                          ...(activeTemplate?.text_positions?.templateJson?.canvas || {}),
                          orientation,
                        },
                        background: {
                          ...(activeTemplate?.text_positions?.templateJson?.background || {}),
                          color: cardBackground?.front?.value || activeTemplate?.text_positions?.templateJson?.background?.color || '#ffffff',
                        },
                      },
                    },
                  });
                }
              }}
              style={{
                background: '#10b981',
                border: 'none',
                color: '#ffffff',
                padding: '7px 20px',
                borderRadius: 6,
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
              }}
            >
              ✓ Save & Publish Template
            </button>
          </div>
        </div>
      )}

      {/* 1. TOP NAVIGATION BAR */}
      <StudioTopbar
        onClose={onClose}
        currentCard={currentCard}
        historyIdx={historyIdx}
        history={history}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        activeSide={activeSide}
        setPreviewSide={setPreviewSide}
        setPreviewRotation={setPreviewRotation}
        setIsPreviewOpen={setIsPreviewOpen}
        basePricePer100={basePricePer100}
        setReviewStep={setReviewStep}
        setIsReviewApproved={setIsReviewApproved}
        setIsNextStepOpen={setIsNextStepOpen}
      />

      {/* 2. WORKSPACE BODY */}
      <div className="vp-studio-body">
        {/* SUB-COLUMN 1 & 2: TOOLBAR & PROPERTIES PANEL */}
        <StudioSidebar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          panelWidth={panelWidth}
          handleStartPanelResize={handleStartPanelResize}
          activeField={activeField}
          setActiveField={setActiveField}
          fields={fields}
          updateField={updateField}
          updateActiveStyle={updateActiveStyle}
          activeColor={activeColor}
          setActiveColor={setActiveColor}
          layout={layout}
          palette={palette}
          allTemplates={allTemplates}
          activeTemplate={activeTemplate}
          setActiveTemplate={setActiveTemplate}
          setFrontArtwork={setFrontArtwork}
          setBackArtwork={setBackArtwork}
          setFields={setFields}
          activeSide={activeSide}
          setActiveSide={setActiveSide}
          frontArtwork={frontArtwork}
          backArtwork={backArtwork}
          frontArtworkTransform={frontArtworkTransform}
          setFrontArtworkTransform={setFrontArtworkTransform}
          backArtworkTransform={backArtworkTransform}
          setBackArtworkTransform={setBackArtworkTransform}
          fileInputRef={fileInputRef}
          uploadedLogo={uploadedLogo}
          setUploadedLogo={setUploadedLogo}
          logoTransform={logoTransform}
          setLogoTransform={setLogoTransform}
          logoInputRef={logoInputRef}
          handleLogoFileChange={handleLogoFileChange}
          setIsLogoModalOpen={setIsLogoModalOpen}
          isCustomMode={isCustomMode}
          initialTemplate={activeTemplate || initialTemplate}
          setBackOption={setBackOption}
          handleArtworkAlign={handleArtworkAlign}
          paperStock={paperStock}
          setPaperStock={setPaperStock}
          finishType={finishType}
          setFinishType={setFinishType}
          cornerStyle={cornerStyle}
          setCornerStyle={setCornerStyle}
          orientation={orientation}
          setOrientation={setOrientation}
          cardDimension={cardDimension}
          setCardDimension={setCardDimension}
          backsideType={backsideType}
          setBacksideType={setBacksideType}
          currentCard={currentCard}
          graphicsCategory={graphicsCategory}
          setGraphicsCategory={setGraphicsCategory}
          graphicsSearch={graphicsSearch}
          setGraphicsSearch={setGraphicsSearch}
          cardGraphics={cardGraphics}
          setCardGraphics={setCardGraphics}
          handleAddGraphic={handleAddGraphic}
          alignGraphic={alignGraphic}
          updateGraphic={updateGraphic}
          removeGraphic={removeGraphic}
          qrInput={qrInput}
          setQrInput={setQrInput}
          qrType={qrType}
          setQrType={setQrType}
          renderGraphicPreview={renderGraphicPreview}
          cardBackground={cardBackground}
          setCardBackground={setCardBackground}
          dimensionUnit={dimensionUnit}
          setDimensionUnit={setDimensionUnit}
          activeGuide={activeGuide}
          setPinnedGuide={setPinnedGuide}
          handleDownloadVCard={handleDownloadVCard}
          handleAddQrCode={handleAddQrCode}
        />

        {/* 3. CENTER CANVAS WORKSPACE */}
        <StudioCanvas
          setActivePopover={setActivePopover}
          copyToast={copyToast}
          zoom={zoom}
          setZoom={setZoom}
          activeSide={activeSide}
          activeField={activeField}
          currentStyle={currentStyle}
          updateActiveStyle={updateActiveStyle}
          activeColor={activeColor}
          handleDuplicateField={handleDuplicateField}
          activePopover={activePopover}
          orientation={orientation}
          cardDimension={cardDimension}
          dimensionUnit={dimensionUnit}
          cardBackground={cardBackground}
          layout={layout}
          cornerStyle={cornerStyle}
          hoveredGuide={hoveredGuide}
          setHoveredGuide={setHoveredGuide}
          pinnedGuide={pinnedGuide}
          setPinnedGuide={setPinnedGuide}
          setDimensionUnit={setDimensionUnit}
          activeGuide={activeGuide}
          finishType={finishType}
          renderCardSurfaceContent={renderCardSurfaceContent}
        />

        {/* 4. RIGHT SIDEBAR: SIDE SWITCHER */}
        <StudioSideSwitcher
          activeSide={activeSide}
          setActiveSide={setActiveSide}
          activeColor={activeColor}
        />
      </div>

      {/* LOGO UPLOAD & ADJUSTMENT MODAL BOX */}
      <LogoAdjustModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        uploadedLogo={uploadedLogo}
        setUploadedLogo={setUploadedLogo}
        logoTransform={logoTransform}
        setLogoTransform={setLogoTransform}
        handleRemoveLogo={() => setUploadedLogo(null)}
        logoInputRef={logoInputRef}
        handleLogoFileChange={handleLogoFileChange}
        setIsLogoModalOpen={setIsLogoModalOpen}
        setActiveField={setActiveField}
      />

      {/* 3D INTERACTIVE PREVIEW MODAL */}
      <Preview3DModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        setIsPreviewOpen={setIsPreviewOpen}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        previewFinish={previewFinish}
        setPreviewFinish={setPreviewFinish}
        previewSide={previewSide}
        setPreviewSide={setPreviewSide}
        handlePreviewSideSwitch={handlePreviewSideSwitch}
        handleSetPresetAngle={handleSetPresetAngle}
        previewRotation={previewRotation}
        setPreviewRotation={setPreviewRotation}
        handlePreviewMouseDown={handlePreviewMouseDown}
        isDraggingPreview={isDraggingPreview}
        previewZoom={previewZoom}
        setPreviewZoom={setPreviewZoom}
        renderCardSurfaceContent={renderCardSurfaceContent}
        cardBackground={cardBackground}
        layout={layout}
        cornerStyle={cornerStyle}
        backsideType={backsideType}
        activeColor={activeColor}
        orientation={orientation}
        currentCard={currentCard}
        paperStock={paperStock}
        onProceedToReview={() => {
          setIsPreviewOpen(false);
          setReviewStep('review');
          setIsReviewApproved(true);
          setIsNextStepOpen(true);
        }}
      />

      {/* REVIEW YOUR DESIGN SPLIT MODAL */}
      <ReviewDesignModal
        isOpen={isNextStepOpen}
        onClose={() => setIsNextStepOpen(false)}
        reviewStep={reviewStep}
        setReviewStep={setReviewStep}
        isReviewApproved={isReviewApproved}
        setIsReviewApproved={setIsReviewApproved}
        quantity={quantity}
        setQuantity={setQuantity}
        previewSide={previewSide}
        handlePreviewSideSwitch={handlePreviewSideSwitch}
        handleSetPresetAngle={handleSetPresetAngle}
        previewRotation={previewRotation}
        handlePreviewMouseDown={handlePreviewMouseDown}
        renderCardSurfaceContent={renderCardSurfaceContent}
        cardBackground={cardBackground}
        layout={layout}
        cornerStyle={cornerStyle}
        backsideType={backsideType}
        activeColor={activeColor}
        orientation={orientation}
        paperStock={paperStock}
        finishType={finishType}
        currentCard={currentCard}
        onProceedToFinalSteps={() => {
          setIsNextStepOpen(false);
          setIsFinalStepsOpen(true);
        }}
        setIsNextStepOpen={setIsNextStepOpen}
        setIsFinalStepsOpen={setIsFinalStepsOpen}
        isCustomMode={isCustomMode}
        activeTemplate={activeTemplate}
        basePrice={basePricePer100}
        totalPrice={totalPrice}
        fields={fields}
        handleAddToCartConfirm={handleAddToCartConfirm}
        isDraggingPreview={isDraggingPreview}
        previewZoom={previewZoom}
        setPreviewZoom={setPreviewZoom}
      />
    </div>
  );
}
