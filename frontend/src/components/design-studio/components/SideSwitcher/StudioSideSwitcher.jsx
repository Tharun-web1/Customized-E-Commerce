import React from 'react';
import '../../css/StudioSideSwitcher.css';

export default function StudioSideSwitcher({ activeSide, setActiveSide, activeColor }) {
  return (
    <aside className="vp-studio-side-switcher">
      {/* Front Side Thumbnail */}
      <div
        className={`vp-side-thumb-item ${activeSide === 'front' ? 'active' : ''}`}
        onClick={() => setActiveSide('front')}
      >
        <div className="vp-side-thumb-box">
          <div style={{ width: '80%', height: '3px', background: activeColor, borderRadius: '1px' }} />
        </div>
        <span>Front</span>
      </div>

      {/* Back Side Thumbnail */}
      <div
        className={`vp-side-thumb-item ${activeSide === 'back' ? 'active' : ''}`}
        onClick={() => setActiveSide('back')}
      >
        <div className="vp-side-thumb-box" style={{ background: '#f8fafc' }}>
          <div style={{ width: '40%', height: '2px', background: '#94a3b8' }} />
        </div>
        <span>Back</span>
      </div>
    </aside>
  );
}
