// src/components/home/SapPromoBanners.jsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import banner3dVisual from '../../assets/banners/3d_printing_visual.png';
import bannerCustomVisual from '../../assets/banners/custom_printing_visual.png';
import './SapPromoBanners.css';

export default function SapPromoBanners({ onExplore3d, onExploreCustom }) {
  return (
    <section className="sap-promo-banners-section" id="promo-banners-section">
      <div className="sap-promo-banners-grid">
        {/* Left: 3D Printing */}
        <div className="sap-promo-card card-3d" id="3d-printing-section">
          <div className="sap-promo-content">
            <h2 className="sap-promo-title">3D Printing</h2>
            <div className="sap-promo-desc">
              Custom Models | Keychains | Nameplates
              <br />
              Corporate Gifts & More
            </div>
            <button
              type="button"
              className="sap-promo-btn"
              onClick={() => {
                if (onExplore3d) onExplore3d();
                else window.location.hash = '#services/3d-printing';
              }}
            >
              <span>Explore 3D Printing</span>
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
          <div className="sap-promo-visual">
            <img
              src={banner3dVisual}
              alt="3D Printed Models & Nameplates"
              className="sap-promo-img"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right: Custom Printing */}
        <div className="sap-promo-card card-custom" id="custom-printing-section">
          <div className="sap-promo-content">
            <h2 className="sap-promo-title">Custom Printing</h2>
            <div className="sap-promo-desc">
              Bring Your Ideas to Life
              <br />
              On ANY Product
            </div>
            <button
              type="button"
              className="sap-promo-btn"
              onClick={() => {
                if (onExploreCustom) onExploreCustom();
                else window.location.hash = '#services/custom-printing';
              }}
            >
              <span>Get Started</span>
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
          <div className="sap-promo-visual">
            <img
              src={bannerCustomVisual}
              alt="Custom Mugs, T-shirts & Merchandise"
              className="sap-promo-img"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
