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
  RotateCw,
  Sparkles,
  Eye,
  EyeOff,
  Edit2,
  Image as ImageIcon,
  Plus,
  Copy,
  Undo2,
  Redo2,
  Square,
  QrCode,
  Tag,
} from 'lucide-react';

function LiveCanvasQr({ value = 'https://example.com', size = 70, src }) {
  const [dataUrl, setDataUrl] = useState('');
  useEffect(() => {
    let clean = (value || '').trim();
    if (!clean) clean = 'https://example.com';
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    QRCode.toDataURL(clean, { width: Math.max(120, size * 2), margin: 1, color: { dark: '#000000', light: '#ffffff' } })
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

const FIELD_ROLE_OPTIONS = [
  { value: 'personName', label: 'Person Name' },
  { value: 'designation', label: 'Designation / Role' },
  { value: 'companyName', label: 'Company Name' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'email', label: 'Email Address' },
  { value: 'website', label: 'Website URL' },
  { value: 'address', label: 'Address / Location' },
  { value: 'tagline', label: 'Tagline / Motto' },
  { value: 'customText', label: 'Custom Text' },
];

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

  // Undo / Redo history stacks
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const canvasWidth = templateJson?.canvas?.width || 1050;
  const canvasHeight = templateJson?.canvas?.height || 600;
  const elements = templateJson?.elements || [];
  const background = templateJson?.background || {};

  const selectedElement = elements.find((el) => el.id === selectedId);

  // Dynamic responsive scale factor so typography and assets scale 1:1 with canvas width
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      const w = containerRef.current.clientWidth;
      if (w > 0) {
        setScale(w / canvasWidth);
      }
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [canvasWidth]);

  // Push state to undo stack before mutations
  const pushUndo = (newJson) => {
    if (!onChange || !templateJson) return;
    setUndoStack((prev) => [...prev.slice(-20), JSON.parse(JSON.stringify(templateJson))]);
    setRedoStack([]);
    onChange(newJson);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((s) => s.slice(0, -1));
    setRedoStack((s) => [...s, JSON.parse(JSON.stringify(templateJson))]);
    onChange(prev);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((s) => s.slice(0, -1));
    setUndoStack((s) => [...s, JSON.parse(JSON.stringify(templateJson))]);
    onChange(next);
  };

  // Update element attributes
  const updateElement = (id, updates) => {
    if (!onChange) return;
    const updatedElements = elements.map((el) => {
      if (el.id === id) {
        return { ...el, ...updates };
      }
      return el;
    });
    pushUndo({
      ...templateJson,
      elements: updatedElements,
    });
  };

  // Delete selected element
  const handleDeleteSelected = () => {
    if (!selectedId || readOnly) return;
    const updatedElements = elements.filter((el) => el.id !== selectedId);
    setSelectedId(null);
    pushUndo({
      ...templateJson,
      elements: updatedElements,
    });
  };

  // Duplicate selected element
  const handleDuplicateSelected = () => {
    if (!selectedElement || readOnly) return;
    const newId = `el-dup-${Math.random().toString(36).substr(2, 6)}`;
    const cloned = {
      ...JSON.parse(JSON.stringify(selectedElement)),
      id: newId,
      x: Math.min(canvasWidth - 100, selectedElement.x + 25),
      y: Math.min(canvasHeight - 50, selectedElement.y + 25),
    };
    pushUndo({
      ...templateJson,
      elements: [...elements, cloned],
    });
    setSelectedId(newId);
  };

  // Add new Text element
  const handleAddText = () => {
    if (readOnly) return;
    const newId = `text-new-${Math.random().toString(36).substr(2, 6)}`;
    const newEl = {
      id: newId,
      type: 'text',
      role: 'customText',
      field: 'customText',
      content: 'New Text Item',
      defaultValue: 'New Text Item',
      x: Math.round(canvasWidth * 0.1),
      y: Math.round(canvasHeight * 0.4),
      width: 200,
      height: 30,
      fontSize: 18,
      fontWeight: '600',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: background.theme === 'light' ? '#0f172a' : '#ffffff',
      alignment: 'left',
      zIndex: elements.length + 15,
      opacity: 1,
      editable: true,
      locked: false,
      visible: true,
    };
    pushUndo({
      ...templateJson,
      elements: [...elements, newEl],
    });
    setSelectedId(newId);
  };

  // Add new QR element
  const handleAddQr = () => {
    if (readOnly) return;
    const newId = `qr-new-${Math.random().toString(36).substr(2, 6)}`;
    const newEl = {
      id: newId,
      type: 'qr',
      role: 'qrCode',
      field: 'qrCode',
      value: 'https://example.com',
      x: Math.round(canvasWidth * 0.75),
      y: Math.round(canvasHeight * 0.55),
      width: 100,
      height: 100,
      zIndex: elements.length + 20,
      opacity: 1,
      editable: true,
      locked: false,
      visible: true,
    };
    pushUndo({
      ...templateJson,
      elements: [...elements, newEl],
    });
    setSelectedId(newId);
  };

  // Add new Shape element
  const handleAddShape = () => {
    if (readOnly) return;
    const newId = `shape-new-${Math.random().toString(36).substr(2, 6)}`;
    const newEl = {
      id: newId,
      type: 'shape',
      role: 'graphic',
      color: background.primaryColor || '#0070ba',
      x: Math.round(canvasWidth * 0.2),
      y: Math.round(canvasHeight * 0.3),
      width: 160,
      height: 60,
      borderRadius: 6,
      zIndex: 5,
      opacity: 0.9,
      editable: true,
      locked: false,
      visible: true,
    };
    pushUndo({
      ...templateJson,
      elements: [...elements, newEl],
    });
    setSelectedId(newId);
  };

  // Dragging logic
  const handleMouseDown = (e, el) => {
    if (readOnly || el.locked) return;
    e.stopPropagation();
    setSelectedId(el.id);
    setDraggingId(el.id);

    const rect = containerRef.current.getBoundingClientRect();
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
    const currCanvasX = (e.clientX - rect.left) / scale;
    const currCanvasY = (e.clientY - rect.top) / scale;

    const newX = Math.round(Math.max(0, Math.min(canvasWidth - 40, currCanvasX - dragOffset.x)));
    const newY = Math.round(Math.max(0, Math.min(canvasHeight - 20, currCanvasY - dragOffset.y)));

    updateElement(draggingId, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (draggingId) {
      setDraggingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      {/* Top Admin Correction Toolbar (Only when not in readOnly mode) */}
      {!readOnly && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {/* Quick Creation Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', marginRight: 4 }}>
              TOOLS:
            </span>
            <button
              type="button"
              onClick={handleAddText}
              style={{
                padding: '4px 9px',
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: 4,
                color: '#0284c7',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Plus size={12} /> Add Text
            </button>

            <button
              type="button"
              onClick={handleAddQr}
              style={{
                padding: '4px 9px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 4,
                color: '#334155',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <QrCode size={12} /> Add QR Code
            </button>

            <button
              type="button"
              onClick={handleAddShape}
              style={{
                padding: '4px 9px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 4,
                color: '#334155',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Square size={12} /> Add Shape
            </button>
          </div>

          {/* Undo / Redo & Selection Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              title="Undo"
              style={{
                padding: '4px 8px',
                background: 'none',
                border: '1px solid #cbd5e1',
                borderRadius: 4,
                cursor: undoStack.length > 0 ? 'pointer' : 'not-allowed',
                opacity: undoStack.length > 0 ? 1 : 0.4,
              }}
            >
              <Undo2 size={13} />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              title="Redo"
              style={{
                padding: '4px 8px',
                background: 'none',
                border: '1px solid #cbd5e1',
                borderRadius: 4,
                cursor: redoStack.length > 0 ? 'pointer' : 'not-allowed',
                opacity: redoStack.length > 0 ? 1 : 0.4,
              }}
            >
              <Redo2 size={13} />
            </button>

            {selectedElement && (
              <>
                <button
                  type="button"
                  onClick={handleDuplicateSelected}
                  title="Duplicate"
                  style={{
                    padding: '4px 8px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: 4,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    color: '#334155',
                  }}
                >
                  <Copy size={12} /> Duplicate
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  title="Delete"
                  style={{
                    padding: '4px 8px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 4,
                    color: '#dc2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                  }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Selected Element Property Inspector */}
      {!readOnly && selectedElement && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #93c5fd',
            borderRadius: 8,
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            boxShadow: '0 2px 6px rgba(0, 112, 186, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Field Role Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={13} color="#0070ba" />
              <select
                value={selectedElement.role || selectedElement.field || 'customText'}
                onChange={(e) => updateElement(selectedElement.id, { role: e.target.value, field: e.target.value })}
                style={{ fontSize: '0.75rem', padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: 4, fontWeight: 700 }}
              >
                {FIELD_ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Direct Coordinate Inputs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#475569' }}>
              <span>X:</span>
              <input
                type="number"
                value={selectedElement.x || 0}
                onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })}
                style={{ width: 48, padding: '2px 4px', fontSize: '0.74rem', border: '1px solid #cbd5e1', borderRadius: 3 }}
              />
              <span>Y:</span>
              <input
                type="number"
                value={selectedElement.y || 0}
                onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })}
                style={{ width: 48, padding: '2px 4px', fontSize: '0.74rem', border: '1px solid #cbd5e1', borderRadius: 3 }}
              />
            </div>

            {/* Text Specific Typography Controls */}
            {selectedElement.type === 'text' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.74rem', color: '#475569' }}>Size:</span>
                <input
                  type="number"
                  min="8"
                  max="72"
                  value={selectedElement.fontSize || 16}
                  onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                  style={{ width: 45, padding: '2px 4px', fontSize: '0.74rem', border: '1px solid #cbd5e1', borderRadius: 3 }}
                />

                <input
                  type="color"
                  value={selectedElement.color || '#ffffff'}
                  onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                  style={{ width: 26, height: 24, padding: 0, border: 'none', borderRadius: 3, cursor: 'pointer' }}
                  title="Font Color"
                />

                <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: 4, padding: 2 }}>
                  <button
                    type="button"
                    onClick={() => updateElement(selectedElement.id, { alignment: 'left' })}
                    style={{
                      border: 'none',
                      background: selectedElement.alignment === 'left' ? '#ffffff' : 'transparent',
                      padding: 3,
                      borderRadius: 2,
                      cursor: 'pointer',
                    }}
                  >
                    <AlignLeft size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateElement(selectedElement.id, { alignment: 'center' })}
                    style={{
                      border: 'none',
                      background: selectedElement.alignment === 'center' ? '#ffffff' : 'transparent',
                      padding: 3,
                      borderRadius: 2,
                      cursor: 'pointer',
                    }}
                  >
                    <AlignCenter size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateElement(selectedElement.id, { alignment: 'right' })}
                    style={{
                      border: 'none',
                      background: selectedElement.alignment === 'right' ? '#ffffff' : 'transparent',
                      padding: 3,
                      borderRadius: 2,
                      cursor: 'pointer',
                    }}
                  >
                    <AlignRight size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* QR Specific Value Input */}
            {selectedElement.type === 'qr' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.74rem', color: '#475569' }}>Target URL:</span>
                <input
                  type="text"
                  value={selectedElement.value || ''}
                  onChange={(e) => updateElement(selectedElement.id, { value: e.target.value })}
                  style={{ width: 170, padding: '2px 6px', fontSize: '0.74rem', border: '1px solid #cbd5e1', borderRadius: 4 }}
                  placeholder="https://..."
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => updateElement(selectedElement.id, { locked: !selectedElement.locked })}
              style={{
                background: 'none',
                border: '1px solid #cbd5e1',
                padding: '3px 8px',
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
        {/* Layer 0: Pristine Inpainted Background Image */}
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
                outline: isSelected && !readOnly ? '2px solid #0070ba' : 'none',
                outlineOffset: '2px',
                borderRadius: 4,
                padding: 2,
                transition: draggingId === el.id ? 'none' : 'outline 0.15s ease',
                zIndex: isSelected ? 30 : el.zIndex || 10,
              }}
            >
              {/* Type: Text Element */}
              {el.type === 'text' && (
                isEditingInline && isSelected && !readOnly ? (
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
                      fontSize: `${Math.max(9, Math.round((el.fontSize || 16) * scale))}px`,
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
                      fontSize: `${Math.max(9, Math.round((el.fontSize || 16) * scale))}px`,
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
                    width: Math.round((el.width || 80) * scale),
                    height: Math.round((el.height || 80) * scale),
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
                <LiveCanvasQr value={el.value || 'https://example.com'} size={Math.round((el.width || 75) * scale)} src={el.src} />
              )}

              {/* Type: Shape Element */}
              {el.type === 'shape' && (
                <div
                  style={{
                    width: Math.round((el.width || 120) * scale),
                    height: Math.round((el.height || 40) * scale),
                    background: el.color || '#0070ba',
                    borderRadius: (el.borderRadius || 4) * scale,
                    opacity: el.opacity || 1,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
