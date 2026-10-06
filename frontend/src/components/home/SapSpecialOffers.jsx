// src/components/home/SapSpecialOffers.jsx
import React from 'react';
import { Gift, ChevronRight } from 'lucide-react';
import './SapSpecialOffers.css';

export default function SapSpecialOffers({ onExploreOffers }) {
  const deals = [
    {
      id: 1,
      tag: 'Limited Time Deal',
      name: 'Flat 20% Off Visiting Cards',
      desc: 'Valid on orders of 200+ cards',
      code: 'VISIT20',
    },
    {
      id: 2,
      tag: '3D Prototyping',
      name: '15% Off 3D Printing & Models',
      desc: 'Free design check & material consultation',
      code: 'PRINT3D',
    },
    {
      id: 3,
      tag: 'Hyderabad Special',
      name: 'Free Local Express Delivery',
      desc: 'On all corporate orders over ₹1,000',
      code: 'HYDFREE',
    },
  ];

  return (
    <section className="sap-offers-section" id="special-offers-section">
      <div className="sap-offers-box">
        <div className="sap-offers-header">
          <div className="sap-offers-title-group">
            <div className="sap-offers-icon">
              <Gift size={28} color="#e11d48" />
            </div>
            <div>
              <h2 className="sap-offers-title">Special Offers</h2>
              <div className="sap-offers-subtitle">Exciting deals on printing services. Stay tuned!</div>
            </div>
          </div>

          <button
            type="button"
            className="sap-offers-link"
            onClick={() => {
              if (onExploreOffers) onExploreOffers();
              else window.location.hash = '#visiting-cards';
            }}
          >
            <span>View All Offers</span>
            <ChevronRight size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="sap-offers-grid">
          {deals.map((deal) => (
            <div key={deal.id} className="sap-offer-card">
              <div className="sap-offer-info">
                <span className="sap-offer-tag">{deal.tag}</span>
                <span className="sap-offer-name">{deal.name}</span>
                <span className="sap-offer-desc">{deal.desc}</span>
              </div>
              <span className="sap-offer-code-pill">{deal.code}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
