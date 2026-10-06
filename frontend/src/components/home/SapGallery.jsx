// src/components/home/SapGallery.jsx
import React, { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { galleryData } from '../../data/homeData';
import './SapGallery.css';

export default function SapGallery({ onViewGallery }) {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <section className="sap-gallery-section" id="gallery-section">
      <div className="sap-section-header">
        <h2 className="sap-section-title">Our Work</h2>
        <button
          type="button"
          className="sap-section-link"
          onClick={() => {
            if (onViewGallery) onViewGallery();
            else window.location.hash = '#visiting-cards';
          }}
        >
          <span>View Gallery</span>
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="sap-gallery-grid">
        {galleryData.map((item) => (
          <div
            key={item.id}
            className="sap-gallery-item"
            title={item.title}
            onClick={() => setActiveItem(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setActiveItem(item);
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="sap-gallery-img"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal on Image Click */}
      {activeItem && (
        <div
          className="sap-lightbox-backdrop"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="sap-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="sap-lightbox-close"
              onClick={() => setActiveItem(null)}
              aria-label="Close Preview"
            >
              <X size={20} />
            </button>
            <div className="sap-lightbox-img-area">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="sap-lightbox-img"
              />
            </div>
            <div className="sap-lightbox-details">
              <span className="sap-lightbox-category">{activeItem.category}</span>
              <h3 className="sap-lightbox-title">{activeItem.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
