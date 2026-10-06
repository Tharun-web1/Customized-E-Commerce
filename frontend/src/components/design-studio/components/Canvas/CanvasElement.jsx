import React from 'react';
import { Lock, Unlock, Copy, Trash2, MoreHorizontal, Move, RotateCw } from 'lucide-react';

export default function CanvasElement({
  fieldKey,
  placeholder = '',
  defaultOverrides = {},
  isPreview = false,
  activeField,
  setActiveField,
  textStyles,
  setTextStyles,
  fields,
  updateField,
  updateActiveStyle,
  handleDuplicateField,
  showMoreMenu,
  setShowMoreMenu,
  handleStartMove,
  handleStartRotate,
  handleStartScale,
  handleStartResizeWidth,
  activeColor,
  elemRefs,
}) {
  const isSelected = !isPreview && activeField === fieldKey;
  const styleObj = textStyles[fieldKey] || {};
  const isLocked = !!styleObj.locked;

  // Effect styling
  let textShadow = 'none';
  if (styleObj.effect === 'shadow') textShadow = '2px 2px 5px rgba(0, 0, 0, 0.35)';
  if (styleObj.effect === 'lift') textShadow = '0 6px 12px rgba(0, 0, 0, 0.28)';
  if (styleObj.effect === 'glow') textShadow = `0 0 10px ${styleObj.color || activeColor}`;

  const computedBoxStyle = {
    transform: `translate(${styleObj.x || 0}px, ${styleObj.y || 0}px) rotate(${styleObj.rotation || 0}deg)`,
    width: styleObj.width ? `${styleObj.width}px` : 'auto',
    maxWidth: 'none',
  };

  const computedStyle = {
    fontFamily: styleObj.fontFamily || defaultOverrides.fontFamily || 'Fira Sans, sans-serif',
    fontSize: `${styleObj.fontSize || defaultOverrides.fontSize || 14}px`,
    fontWeight: styleObj.bold !== undefined ? (styleObj.bold ? 800 : 400) : (defaultOverrides.fontWeight || 400),
    fontStyle: styleObj.italic ? 'italic' : (defaultOverrides.fontStyle || 'normal'),
    textDecoration: styleObj.underline ? 'underline' : 'none',
    color: styleObj.color || defaultOverrides.color || activeColor,
    textAlign: styleObj.align || defaultOverrides.textAlign || 'left',
    letterSpacing: styleObj.letterSpacing ? `${styleObj.letterSpacing}px` : (defaultOverrides.letterSpacing || 'normal'),
    lineHeight: styleObj.lineHeight || defaultOverrides.lineHeight || 1.2,
    textTransform: styleObj.textTransform || defaultOverrides.textTransform || 'none',
    opacity: styleObj.opacity !== undefined ? styleObj.opacity : 1,
    textShadow,
    display: 'inline-block',
    outline: 'none',
    width: styleObj.width ? '100%' : 'auto',
    minWidth: '24px',
  };

  const userVal = fields[fieldKey];
  const hasUserEdited = Boolean(userVal && userVal.trim().length > 0);

  if (isPreview) {
    if (!hasUserEdited) {
      return null;
    }
    return (
      <div key={fieldKey} style={{ ...computedBoxStyle, pointerEvents: 'none' }}>
        <span style={computedStyle} className="vp-canvas-text-node">
          {styleObj.isBullet && '• '}
          {userVal}
        </span>
      </div>
    );
  }

  const displayText = hasUserEdited ? userVal : placeholder;
  const canvasNodeStyle = hasUserEdited
    ? computedStyle
    : {
        ...computedStyle,
        opacity: 0.38,
        fontStyle: 'italic',
      };

  return (
    <div
      key={fieldKey}
      ref={(el) => {
        if (el && elemRefs && elemRefs.current) elemRefs.current[fieldKey] = el;
      }}
      id={`vp-elem-${fieldKey}`}
      className={`vp-canvas-selection-box ${isSelected ? 'active-selected' : ''}`}
      style={computedBoxStyle}
      onClick={(e) => {
        e.stopPropagation();
        setActiveField(fieldKey);
      }}
      onMouseDown={(e) => {
        if (!isLocked && e.target === e.currentTarget && handleStartMove) {
          handleStartMove(e, fieldKey);
        }
      }}
    >
      {/* Floating Mini Action Toolbar above Selected Element */}
      {isSelected && (
        <div className="vp-element-mini-toolbar" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`vp-mini-btn ${isLocked ? 'locked' : ''}`}
            title={isLocked ? "Unlock field" : "Lock field"}
            onClick={() => updateActiveStyle('locked', !isLocked)}
          >
            {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
          </button>
          <button
            type="button"
            className="vp-mini-btn"
            title="Duplicate / Copy Text"
            onClick={() => handleDuplicateField(fieldKey)}
          >
            <Copy size={12} />
          </button>
          <button
            type="button"
            className="vp-mini-btn delete"
            title="Clear Text"
            onClick={() => updateField(fieldKey, '')}
          >
            <Trash2 size={12} />
          </button>
          <div className="vp-mini-more-wrap">
            <button
              type="button"
              className="vp-mini-btn"
              title="More Actions"
              onClick={() => setShowMoreMenu((prev) => (prev === fieldKey ? null : fieldKey))}
            >
              <MoreHorizontal size={12} />
            </button>
            {showMoreMenu === fieldKey && (
              <div className="vp-mini-more-menu">
                <button
                  type="button"
                  onClick={() => {
                    updateActiveStyle('textTransform', styleObj.textTransform === 'uppercase' ? 'none' : 'uppercase');
                    setShowMoreMenu(null);
                  }}
                >
                  Toggle UPPERCASE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTextStyles((prev) => ({
                      ...prev,
                      [fieldKey]: {
                        ...(prev[fieldKey] || {}),
                        x: 0,
                        y: 0,
                        rotation: 0,
                        width: undefined,
                      },
                    }));
                    setShowMoreMenu(null);
                  }}
                >
                  Reset Position
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateActiveStyle('fontSize', 14);
                    updateActiveStyle('bold', false);
                    updateActiveStyle('effect', 'none');
                    setShowMoreMenu(null);
                  }}
                >
                  Reset Styles
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4 Corner Circular Selection Handles (Drag to scale font size) */}
      {isSelected && !isLocked && (
        <>
          <div
            className="vp-selection-handle corner top-left"
            title="Drag to adjust size"
            onMouseDown={(e) => handleStartScale(e, fieldKey, 'top-left')}
          />
          <div
            className="vp-selection-handle corner top-right"
            title="Drag to adjust size"
            onMouseDown={(e) => handleStartScale(e, fieldKey, 'top-right')}
          />
          <div
            className="vp-selection-handle corner bottom-left"
            title="Drag to adjust size"
            onMouseDown={(e) => handleStartScale(e, fieldKey, 'bottom-left')}
          />
          <div
            className="vp-selection-handle corner bottom-right"
            title="Drag to adjust size"
            onMouseDown={(e) => handleStartScale(e, fieldKey, 'bottom-right')}
          />
          {/* 2 Side Pill Stretch Handles (Drag to adjust width) */}
          <div
            className="vp-selection-handle side middle-left"
            title="Drag to adjust width"
            onMouseDown={(e) => handleStartResizeWidth(e, fieldKey, 'left')}
          />
          <div
            className="vp-selection-handle side middle-right"
            title="Drag to adjust width"
            onMouseDown={(e) => handleStartResizeWidth(e, fieldKey, 'right')}
          />
        </>
      )}

      {/* Editable Text Node */}
      <span
        contentEditable={isSelected && !isLocked}
        suppressContentEditableWarning
        onBlur={(e) => updateField(fieldKey, e.currentTarget.textContent || '')}
        style={canvasNodeStyle}
        className={`vp-canvas-text-node ${isLocked ? 'is-locked' : ''} ${!hasUserEdited ? 'is-placeholder-guide' : ''}`}
        title={isLocked ? "Field is locked" : "Click to select, double-click or type to edit"}
      >
        {styleObj.isBullet && '• '}
        {displayText}
      </span>

      {/* Bottom Floating Action Badges: [✥ Move] [↻ Rotate] */}
      {isSelected && !isLocked && (
        <div className="vp-element-bottom-handles" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="vp-handle-circle vp-move-handle"
            title="Drag to move element anywhere on card"
            onMouseDown={(e) => handleStartMove(e, fieldKey)}
          >
            <Move size={11} />
          </button>
          <button
            type="button"
            className="vp-handle-circle vp-rotate-handle"
            title="Click or drag to rotate"
            onMouseDown={(e) => handleStartRotate(e, fieldKey)}
          >
            <RotateCw size={11} />
          </button>
        </div>
      )}
    </div>
  );
}
