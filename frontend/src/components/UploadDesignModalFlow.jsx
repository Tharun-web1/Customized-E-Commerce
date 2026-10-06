import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  QrCode,
  FileText,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Info,
  Smartphone,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { uploadDesignArtwork } from '../api';
import '../css/UploadDesignModalFlow.css';

export default function UploadDesignModalFlow({
  isOpen,
  card,
  initialQuantity = 100,
  initialCornerStyle = 'standard',
  onClose,
  onProceedToStudio,
}) {
  if (!isOpen) return null;

  const currentCard = card || {
    title: 'Standard Visiting Cards',
    slug: 'standard',
    base_price_100: 200.0,
    dimensions: '8.9 cm x 5.1 cm',
    gsm: '350 GSM',
  };

  // Step 1: 'options' (Image 2) | Step 2: 'upload' (Image 3)
  const [step, setStep] = useState('options');

  // Step 1 Form States
  const [orientation, setOrientation] = useState('horizontal'); // 'horizontal' | 'vertical'
  const [quantity, setQuantity] = useState(initialQuantity);

  // Step 2 Upload States
  const [activeSide, setActiveSide] = useState('front'); // 'front' | 'back'
  const [frontArtwork, setFrontArtwork] = useState(null);
  const [backArtwork, setBackArtwork] = useState(null);
  const [frontFileName, setFrontFileName] = useState('');
  const [backFileName, setBackFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);
  const [showPhoneQr, setShowPhoneQr] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  // Pricing calculation
  const baseRate = (currentCard.base_price_100 || 200.0) / 100;
  let discountMultiplier = 1.0;
  if (quantity >= 2000) discountMultiplier = 0.75;
  else if (quantity >= 1000) discountMultiplier = 0.8;
  else if (quantity >= 500) discountMultiplier = 0.88;
  else if (quantity >= 300) discountMultiplier = 0.92;
  else if (quantity >= 200) discountMultiplier = 0.95;

  const unitPrice = baseRate * discountMultiplier;
  const totalPrice = unitPrice * quantity;

  // Handle local file selection
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await processSelectedFile(file);
    }
  };

  // Process dropped or selected file
  const processSelectedFile = async (file) => {
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      if (activeSide === 'front') {
        setFrontArtwork(dataUrl);
        setFrontFileName(file.name);
      } else {
        setBackArtwork(dataUrl);
        setBackFileName(file.name);
      }

      // Also send to backend upload API in background
      try {
        await uploadDesignArtwork(file, file.name);
      } catch (err) {
        console.warn('Backend upload background notice:', err);
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processSelectedFile(file);
    }
  };

  // Final Action to Launch Edit Studio
  const handleLaunchStudio = () => {
    onProceedToStudio({
      ...currentCard,
      orientation,
      quantity,
      unitPrice,
      totalPrice,
      corner_style: initialCornerStyle,
      uploadedFrontArtwork: frontArtwork,
      uploadedBackArtwork: backArtwork,
      uploadedArtwork: frontArtwork || backArtwork,
    });
    onClose();
  };

  return (
    <div className="udm-overlay" onClick={onClose}>
      <div
        className={`udm-modal-box ${step === 'upload' ? 'wide' : 'compact'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          type="button"
          className="udm-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* ============================================================
            STEP 1: OPTIONS SELECTION MODAL (EXACTLY MATCHING IMAGE 2)
            ============================================================ */}
        {step === 'options' && (
          <div className="udm-options-content">
            <h2 className="udm-options-title">{currentCard.title}</h2>
            <p className="udm-options-subtext">Please select all required options.</p>

            {/* Product Orientation Selection */}
            <div className="udm-field-group">
              <label className="udm-field-label">Product Orientation*</label>
              <div className="udm-orientation-cards-row">
                <button
                  type="button"
                  className={`udm-orientation-pill ${orientation === 'horizontal' ? 'selected' : ''}`}
                  onClick={() => setOrientation('horizontal')}
                >
                  <span>Horizontal</span>
                </button>

                <button
                  type="button"
                  className={`udm-orientation-pill ${orientation === 'vertical' ? 'selected' : ''}`}
                  onClick={() => setOrientation('vertical')}
                >
                  <span>Vertical</span>
                </button>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="udm-field-group">
              <label className="udm-field-label">Quantity</label>
              <div className="udm-select-wrapper">
                <select
                  className="udm-quantity-select"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                >
                  <option value={100}>100 (₹{(baseRate * 1.0).toFixed(2)} / unit )</option>
                  <option value={200}>200 (₹{(baseRate * 0.95).toFixed(2)} / unit )</option>
                  <option value={300}>300 (₹{(baseRate * 0.92).toFixed(2)} / unit )</option>
                  <option value={500}>500 (₹{(baseRate * 0.88).toFixed(2)} / unit )</option>
                  <option value={1000}>1000 (₹{(baseRate * 0.8).toFixed(2)} / unit )</option>
                  <option value={2000}>2000 (₹{(baseRate * 0.75).toFixed(2)} / unit )</option>
                </select>
                <ChevronDown size={18} className="udm-select-chevron" />
              </div>
            </div>

            {/* Subtle Divider Line */}
            <hr className="udm-divider" />

            {/* Live Pricing Summary */}
            <div className="udm-summary-row">
              <span>
                {quantity} starting at ₹{totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Blue Next Button */}
            <button
              type="button"
              className="udm-btn-next-cyan"
              onClick={() => setStep('upload')}
            >
              Next
            </button>
          </div>
        )}

        {/* ============================================================
            STEP 2: UPLOAD YOUR DESIGN MODAL (EXACTLY MATCHING IMAGE 3)
            ============================================================ */}
        {step === 'upload' && (
          <div className="udm-upload-content">
            <div className="udm-upload-header">
              <h2 className="udm-upload-title">Upload your design</h2>
            </div>

            <div className="udm-upload-grid">
              {/* Left Column: Dropzone & Upload Actions */}
              <div
                className={`udm-dropzone-box ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,application/pdf"
                  onChange={handleFileChange}
                />

                <div className="udm-dropzone-actions">
                  {/* Blue Upload Button */}
                  <button
                    type="button"
                    className="udm-btn-device-upload"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload size={16} />
                    <span>{isUploading ? 'Processing...' : 'Upload from this device'}</span>
                  </button>

                  {/* White Phone Upload Button */}
                  <button
                    type="button"
                    className="udm-btn-phone-upload"
                    onClick={() => setShowPhoneQr((prev) => !prev)}
                  >
                    <Smartphone size={16} />
                    <span>Upload from phone</span>
                  </button>

                  <span className="udm-dropzone-caption">or drag and drop here</span>
                </div>

                {/* Phone QR Code Popover Simulation */}
                {showPhoneQr && (
                  <div className="udm-phone-qr-popup">
                    <div className="udm-qr-box">
                      <QrCode size={110} color="#0284c7" />
                    </div>
                    <p className="udm-qr-caption">
                      Scan with your smartphone camera to upload photos from your mobile device.
                    </p>
                    <button
                      type="button"
                      className="udm-qr-close"
                      onClick={() => setShowPhoneQr(false)}
                    >
                      Close QR
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Specs, Instructions & Side Mockup Slots */}
              <div className="udm-upload-sidebar">
                {/* Specs and templates expandable link */}
                <div className="udm-specs-accordion">
                  <button
                    type="button"
                    className="udm-specs-toggle-btn"
                    onClick={() => setShowSpecs((prev) => !prev)}
                  >
                    <div className="udm-specs-toggle-left">
                      <FileText size={16} />
                      <span>Specs and templates</span>
                    </div>
                    {showSpecs ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {showSpecs && (
                    <div className="udm-specs-detail-panel">
                      <div className="udm-spec-row">
                        <span className="udm-spec-name">Orientation:</span>
                        <span className="udm-spec-val" style={{ textTransform: 'capitalize' }}>
                          {orientation}
                        </span>
                      </div>
                      <div className="udm-spec-row">
                        <span className="udm-spec-name">Trim Size:</span>
                        <span className="udm-spec-val">
                          {orientation === 'horizontal' ? '89 x 51 mm' : '51 x 89 mm'}
                        </span>
                      </div>
                      <div className="udm-spec-row">
                        <span className="udm-spec-name">Bleed Size:</span>
                        <span className="udm-spec-val">
                          {orientation === 'horizontal' ? '92 x 54 mm' : '54 x 92 mm'}
                        </span>
                      </div>
                      <div className="udm-spec-row">
                        <span className="udm-spec-name">Safety Area:</span>
                        <span className="udm-spec-val">
                          {orientation === 'horizontal' ? '85 x 47 mm' : '47 x 85 mm'}
                        </span>
                      </div>
                      <div className="udm-spec-row">
                        <span className="udm-spec-name">Resolution:</span>
                        <span className="udm-spec-val">300 DPI recommended</span>
                      </div>
                      <div className="udm-spec-row">
                        <span className="udm-spec-name">File Types:</span>
                        <span className="udm-spec-val">PNG, JPG, PDF, SVG</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtext info */}
                <p className="udm-sidebar-caption">
                  {frontArtwork || backArtwork
                    ? 'Artwork uploaded! You can switch sides or proceed directly to customize in the studio.'
                    : 'Your uploaded files will appear here once you add them'}
                </p>

                {/* Front & Back Mockup Thumbnail Slots */}
                <div className="udm-sides-container">
                  {/* Front Side Slot */}
                  <div
                    className={`udm-side-slot ${activeSide === 'front' ? 'active' : ''} ${frontArtwork ? 'has-file' : ''}`}
                    onClick={() => setActiveSide('front')}
                  >
                    <div
                      className={`udm-card-preview-thumb ${orientation === 'vertical' ? 'vertical' : 'horizontal'}`}
                    >
                      {frontArtwork ? (
                        <img src={frontArtwork} alt="Front artwork" className="udm-thumb-img" />
                      ) : (
                        <div className="udm-thumb-placeholder">
                          <span>Front</span>
                        </div>
                      )}
                    </div>
                    <div className="udm-side-label">
                      <span>Front</span>
                      {frontArtwork && <CheckCircle size={14} color="#16a34a" />}
                    </div>
                    {frontFileName && <span className="udm-side-filename">{frontFileName}</span>}
                  </div>

                  {/* Back Side Slot */}
                  <div
                    className={`udm-side-slot ${activeSide === 'back' ? 'active' : ''} ${backArtwork ? 'has-file' : ''}`}
                    onClick={() => setActiveSide('back')}
                  >
                    <div
                      className={`udm-card-preview-thumb ${orientation === 'vertical' ? 'vertical' : 'horizontal'}`}
                    >
                      {backArtwork ? (
                        <img src={backArtwork} alt="Back artwork" className="udm-thumb-img" />
                      ) : (
                        <div className="udm-thumb-placeholder">
                          <span>Back</span>
                        </div>
                      )}
                    </div>
                    <div className="udm-side-label">
                      <span>Back</span>
                      {backArtwork && <CheckCircle size={14} color="#16a34a" />}
                    </div>
                    {backFileName && <span className="udm-side-filename">{backFileName}</span>}
                  </div>
                </div>

                {/* Proceed to Edit Studio Button */}
                <div className="udm-sidebar-footer">
                  <button
                    type="button"
                    className="udm-btn-proceed-studio"
                    onClick={handleLaunchStudio}
                  >
                    <span>{frontArtwork || backArtwork ? 'Continue to Studio' : 'Open in Studio'}</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    className="udm-btn-back-options"
                    onClick={() => setStep('options')}
                  >
                    ← Change orientation or quantity
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
