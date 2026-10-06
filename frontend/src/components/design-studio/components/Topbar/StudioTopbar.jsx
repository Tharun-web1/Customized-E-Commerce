import React from 'react';
import { ChevronLeft, Folder, ChevronDown, FileText, RotateCcw, RotateCw, Eye, Tag } from 'lucide-react';
import '../../css/StudioTopbar.css';

export default function StudioTopbar({
  onClose,
  currentCard,
  historyIdx,
  history,
  handleUndo,
  handleRedo,
  activeSide,
  setPreviewSide,
  setPreviewRotation,
  setIsPreviewOpen,
  basePricePer100,
  setReviewStep,
  setIsReviewApproved,
  setIsNextStepOpen,
}) {
  return (
    <header className="vp-studio-topbar">
      <div className="vp-studio-topbar-left">
        {/* Back Button */}
        <button
          type="button"
          className="vp-studio-back-nav-btn"
          onClick={onClose}
          title="Back to previous page"
        >
          <ChevronLeft size={16} />
          <span>Back</span>
        </button>

        {/* Logo */}
        <div className="vp-studio-brand" onClick={onClose} title="Back to product">
          <img src="/asap-logo.jpeg" alt="ASAP Visiting Cards" className="vp-studio-logo" />
        </div>

        {/* Product selector dropdown */}
        <div className="vp-studio-product-selector" title="Current product model">
          <Folder size={15} color="#0056b3" />
          <span>{currentCard?.title || 'Visiting Card'}</span>
          <ChevronDown size={14} color="#64748b" />
        </div>

        <div className="vp-studio-divider" />

        {/* Save / Document icon */}
        <button
          type="button"
          className="vp-studio-history-btn"
          title="Save Project"
          onClick={() => alert('Project saved successfully!')}
        >
          <FileText size={17} />
        </button>

        {/* Undo */}
        <button
          type="button"
          className="vp-studio-history-btn"
          title="Undo"
          disabled={historyIdx === 0}
          onClick={handleUndo}
        >
          <RotateCcw size={16} />
        </button>

        {/* Redo */}
        <button
          type="button"
          className="vp-studio-history-btn"
          title="Redo"
          disabled={historyIdx >= history.length - 1}
          onClick={handleRedo}
        >
          <RotateCw size={16} />
        </button>
      </div>

      <div className="vp-studio-topbar-right">
        {/* Preview Button */}
        <button
          type="button"
          className="vp-studio-preview-btn"
          onClick={() => {
            setPreviewSide(activeSide);
            setPreviewRotation({ x: 8, y: activeSide === 'back' ? 164 : -16 });
            setIsPreviewOpen(true);
          }}
        >
          <Eye size={17} />
          <span>Preview</span>
        </button>

        {/* Dynamic Base Price Indicator */}
        <div className="vp-studio-price-tag">
          <Tag size={15} color="#ea580c" />
          <span>₹{(basePricePer100 || 0).toFixed(2)}</span>
        </div>

        {/* Next Button */}
        <button
          type="button"
          className="vp-studio-next-btn"
          onClick={() => {
            setReviewStep('review');
            setIsReviewApproved(true);
            setPreviewSide('front');
            setPreviewRotation({ x: 8, y: -16 });
            setIsNextStepOpen(true);
          }}
        >
          Review & Order
        </button>
      </div>
    </header>
  );
}
