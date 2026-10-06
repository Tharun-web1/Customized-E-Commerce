import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Type,
  Move,
  Trash2,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Eye,
  Edit2,
  Image as ImageIcon,
} from 'lucide-react';

function LiveCanvasQr({ value = 'https://example.com', size = 70, src }) {
  const [dataUrl, setDataUrl] = useState('');
  useEffect(() => {
    let clean = (value || '').trim();
    if (!clean) clean = 'https://example.com';
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    QRCode.toDataURL(clean, { width: size * 2, margin: 1, color: { dark: '#000000', light: '#ffffff' } })
      .then(setDataUrl)
      .catch(() => {});
  }, [value, size]);

  if (src && !dataUrl) {
    return <img src={src} alt="QR Code" style={{ width: size, height: size, display: 'block', borderRadius: 4 }} />;
  }

  if (!dataUrl) {
    return <div style={{ width: size, height: size, background: '#ffffff', borderRadius: 4 }} />;
  }

  return (
    <img
      src={dataUrl}
      alt="QR Code"
      style={{
        width: size,
        height: size,
        display: 'block',
        borderRadius: 4,
        background: '#ffffff',
        padding: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}
    />
  );
}

export default function InteractiveTemplateCanvas({
  templateJson,
  onChange,
  readOnly = false,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isEditingInline, setIsEditingInline] = useState(false);
  const containerRef = useRef(null);

  const canvasWidth = templateJson?.canvas?.width || 1050;
  const canvasHeight = templateJson?.canvas?.height || 600;
  const elements = templateJson?.elements || [];
  const background = templateJson?.background || {};

  const selectedElement = elements.find((el) => el.id === selectedId);

  // Update a specific element's attributes
  const updateElement = (id, updates) => {
    if (!onChange) return;
    const updatedElements = elements.map((el) => {
      if (el.id === id) {
        return { ...el, ...updates };
      }
      return el;
    });
    onChange({
      ...templateJson,
      elements: updatedElements,
    });
  };

  // Dragging logic
  const handleMouseDown = (e, el) => {
    if (readOnly || el.locked) return;
    e.stopPropagation();
    setSelectedId(el.id);
    setDraggingId(el.id);
    setIsEditingInline(false);

    const rect = containerRef.current.getBoundingClientRect();
    const scale = rect.width / canvasWidth;
    const clickCanvasX = (e.clientX - rect.left) / scale;
    const clickCanvasY = (e.clientY - rect.top) / scale;

    setDragOffset({
      x: clickCanvasX - el.x,
      y: clickCanvasY - el.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingId || readOnly) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scale = rect.width / canvasWidth;
    const currentCanvasX = (e.clientX - rect.left) / scale;
    const currentCanvasY = (e.clientY - rect.top) / scale;

    const newX = Math.round(currentCanvasX - dragOffset.x);
    const newY = Math.round(currentCanvasY - dragOffset.y);

    updateElement(draggingId, {
      x: Math.max(0, Math.min(canvasWidth - 30, newX)),
      y: Math.max(0, Math.min(canvasHeight - 20, newY)),
    });
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {/* Interactive Canvas Properties Inspector Toolbar */}
      {!readOnly && selectedElement && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {/* Field Label & Confidence Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
              {selectedElement.field || selectedElement.type}
            </span>
            {selectedElement.confidence && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 10,
                  background: selectedElement.confidence >= 0.85 ? '#dcfce7' : '#fef3c7',
                  color: selectedElement.confidence >= 0.85 ? '#15803d' : '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                {selectedElement.confidence >= 0.85 ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                {Math.round(selectedElement.confidence * 100)}% Confidence
              </span>
            )}
          </div>

          {/* Quick Edit Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {selectedElement.type === 'text' && (
              <>
                {/* Content Input */}
                <input
                  type="text"
                  value={selectedElement.content || ''}
                  onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                  style={{
                    fontSize: '0.78rem',
                    padding: '4px 8px',
                    border: '1px solid #cbd5e1',
                    borderRadius: 4,
                    width: 220,
                  }}
                  placeholder="Text content..."
                />

                {/* Font Size */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Size:</span>
                  <input
                    type="number"
                    min={8}
                    max={72}
                    value={selectedElement.fontSize || 16}
                    onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                    style={{ width: 48, fontSize: '0.78rem', padding: '3px 4px', border: '1px solid #cbd5e1', borderRadius: 4 }}
                  />
                </div>

                {/* Text Color */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="color"
                    value={selectedElement.color || '#ffffff'}
                    onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                    style={{ width: 28, height: 26, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  />
                </div>

                {/* Alignment */}
                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 4, padding: 2 }}>
                  <button
                    type="button"
                    onClick={() => updateElement(selectedElement.id, { alignment: 'left' })}
                    style={{
                      border: 'none',
                      background: selectedElement.alignment === 'left' ? '#ffffff' : 'transparent',
                      padding: 4,
                      borderRadius: 3,
                      cursor: 'pointer',
                    }}
                  >
                    <AlignLeft size={13} color="#334155" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateElement(selectedElement.id, { alignment: 'center' })}
                    style={{
                      border: 'none',
                      background: selectedElement.alignment === 'center' ? '#ffffff' : 'transparent',
                      padding: 4,
                      borderRadius: 3,
                      cursor: 'pointer',
                    }}
                  >
                    <AlignCenter size={13} color="#334155" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateElement(selectedElement.id, { alignment: 'right' })}
                    style={{
                      border: 'none',
                      background: selectedElement.alignment === 'right' ? '#ffffff' : 'transparent',
                      padding: 4,
                      borderRadius: 3,
                      cursor: 'pointer',
                    }}
                  >
                    <AlignRight size={13} color="#334155" />
                  </button>
                </div>
              </>
            )}

            {/* Logo Image Controls */}
            {selectedElement.type === 'image' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#475569' }}>
                <span>Logo / Graphic Layer</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Size:</span>
                  <input
                    type="number"
                    value={selectedElement.width || 80}
                    onChange={(e) => {
                      const w = Number(e.target.value);
                      const ratio = (selectedElement.height || 80) / (selectedElement.width || 80);
                      updateElement(selectedElement.id, { width: w, height: Math.round(w * ratio) });
                    }}
                    style={{ width: 55, fontSize: '0.78rem', padding: '3px 4px', border: '1px solid #cbd5e1', borderRadius: 4 }}
                  />
                </div>
              </div>
            )}

            {/* QR Controls */}
            {selectedElement.type === 'qr' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  value={selectedElement.value || ''}
                  onChange={(e) => updateElement(selectedElement.id, { value: e.target.value })}
                  style={{
                    fontSize: '0.78rem',
                    padding: '4px 8px',
                    border: '1px solid #cbd5e1',
                    borderRadius: 4,
                    width: 200,
                  }}
                  placeholder="https://..."
                />
              </div>
            )}

            {/* Lock / Unlock */}
            <button
              type="button"
              onClick={() => updateElement(selectedElement.id, { locked: !selectedElement.locked })}
              style={{
                background: 'none',
                border: '1px solid #cbd5e1',
                padding: '4px 8px',
                borderRadius: 4,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.72rem',
                color: '#475569',
              }}
            >
              {selectedElement.locked ? <Lock size={12} color="#dc2626" /> : <Unlock size={12} />}
              <span>{selectedElement.locked ? 'Locked' : 'Lock'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => {
          setSelectedId(null);
          setIsEditingInline(false);
        }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: `${canvasWidth} / ${canvasHeight}`,
          background: background.color || '#151b2d',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
          userSelect: 'none',
          cursor: draggingId ? 'grabbing' : 'default',
        }}
      >
        {/* Layer 0: Pristine Inpainted Background Image (contains ALL original graphics, curves, gradients without text) */}
        {background.cleanArtworkSrc ? (
          <img
            src={background.cleanArtworkSrc}
            alt="Card Clean Background"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        ) : null}

        {/* Dynamic Render of All Editable Elements */}
        {elements.map((el) => {
          if (el.visible === false) return null;
          const isSelected = el.id === selectedId;
          const leftPercent = (el.x / canvasWidth) * 100;
          const topPercent = (el.y / canvasHeight) * 100;

          return (
            <div
              key={el.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(el.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (el.type === 'text') {
                  setIsEditingInline(true);
                }
              }}
              onMouseDown={(e) => handleMouseDown(e, el)}
              style={{
                position: 'absolute',
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                cursor: el.locked ? 'default' : 'grab',
                outline: isSelected ? '2px solid #0070ba' : 'none',
                outlineOffset: '2px',
                borderRadius: 4,
                padding: 2,
                transition: draggingId === el.id ? 'none' : 'outline 0.15s ease',
                zIndex: isSelected ? 30 : el.zIndex || 10,
              }}
            >
              {/* Type: Text Element */}
              {el.type === 'text' && (
                isEditingInline && isSelected ? (
                  <input
                    type="text"
                    value={el.content || ''}
                    autoFocus
                    onChange={(e) => updateElement(el.id, { content: e.target.value })}
                    onBlur={() => setIsEditingInline(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsEditingInline(false);
                    }}
                    style={{
                      fontSize: `calc(${el.fontSize || 16}px * 0.95)`,
                      fontFamily: el.fontFamily || 'Inter, system-ui, sans-serif',
                      fontWeight: el.fontWeight || 600,
                      color: el.color || '#ffffff',
                      background: 'rgba(0,0,0,0.6)',
                      border: '1px solid #38bdf8',
                      borderRadius: 3,
                      padding: '2px 4px',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      fontSize: `calc(${el.fontSize || 16}px * 0.95)`,
                      fontFamily: el.fontFamily || 'Inter, system-ui, sans-serif',
                      fontWeight: el.fontWeight || 600,
                      color: el.color || '#ffffff',
                      letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : 'normal',
                      textAlign: el.alignment || 'left',
                      lineHeight: 1.15,
                      whiteSpace: 'nowrap',
                      textShadow: background.theme === 'light' ? 'none' : '0 1px 3px rgba(0,0,0,0.7)',
                    }}
                  >
                    {el.content || el.defaultValue}
                  </div>
                )
              )}

              {/* Type: Logo / Image Asset */}
              {el.type === 'image' && el.src && (
                <div
                  style={{
                    position: 'relative',
                    width: el.width || 80,
                    height: el.height || 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={el.src}
                    alt="Logo Asset"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      display: 'block',
                      borderRadius: 4,
                    }}
                  />
                </div>
              )}

              {/* Type: QR Code */}
              {el.type === 'qr' && (
                <LiveCanvasQr value={el.value || 'https://example.com'} size={el.width || 75} src={el.src} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
