import React from 'react';
import { Palette } from 'lucide-react';

export default function TemplateColorPanel({
  activeColor,
  setActiveColor,
  palette,
}) {
  return (
            <>
              <div className="vp-studio-panel-header">
                <h3>Template Color</h3>
              </div>
              <div className="vp-studio-panel-body">
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Select an official color palette theme for this template design:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '8px' }}>
                  {palette.map((clr, idx) => {
                    const isSelected = activeColor === clr;
                    const isSplit = clr.includes(':');
                    const bgStyle = isSplit
                      ? `linear-gradient(135deg, ${clr.split(':')[0]} 50%, ${clr.split(':')[1]} 50%)`
                      : clr;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveColor(isSplit ? clr.split(':')[1] : clr)}
                        style={{
                          height: '36px',
                          borderRadius: '8px',
                          background: bgStyle,
                          border: isSelected ? '2px solid #0099ff' : '1px solid #cbd5e1',
                          outline: isSelected ? '2px solid #0099ff' : 'none',
                          cursor: 'pointer',
                        }}
                        title={`Palette Color ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              </div>
            </>
  );
}
