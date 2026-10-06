import React, { useState } from 'react';
import { Star, ArrowRight, Sparkles } from 'lucide-react';
import '../css/CategoryGrid.css';

export default function CategoryGrid({ cards = [], onSelectCard }) {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: `All Cards (${cards.length})` },
    { id: 'shapes', label: '1. By Shape' },
    { id: 'texture', label: '2. Texture' },
    { id: 'special', label: '3. Special' },
    { id: 'holders', label: '4. Card Holders' },
  ];

  const filteredCards = activeTab === 'all'
    ? cards
    : cards.filter(c => {
        if (activeTab === 'texture') return c.category_group === 'texture' || c.category_group === 'papers_textures';
        return c.category_group === activeTab;
      });

  return (
    <section className="category-section" id="catalog">
      <div className="section-header">
        <div>
          <h2 className="section-title">Explore Visiting Card Collections</h2>
          <p className="section-subtitle">
            Find the perfect material, shape, and tactile finish that matches your brand personality.
          </p>
        </div>

        <div className="category-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="cards-grid">
        {filteredCards.map((card) => (
          <div key={card.id} className="product-card">
            {/* Visual Header */}
            <div
              className="card-header-visual"
              style={{ background: card.image_gradient || 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span className="card-gsm-tag">{card.gsm}</span>
                {card.badge && <span className="card-badge-top">{card.badge}</span>}
              </div>
              <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>
                {card.dimensions}
              </div>
            </div>

            {/* Body Info */}
            <div className="card-body-content">
              <div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-desc">{card.description}</p>
                <div className="card-rating-strip">
                  <Star size={14} fill="#b45309" color="#b45309" />
                  <span>{card.rating}</span>
                  <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>
                    ({card.reviews_count} reviews)
                  </span>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="card-price-row">
                <div className="price-tag-wrap">
                  <span className="price-label">Starting From</span>
                  <div className="price-amount">
                    ₹{card.base_price_100}
                    <span className="price-unit"> / {card.min_quantity} pcs</span>
                  </div>
                </div>

                <button
                  className="card-action-btn"
                  onClick={() => onSelectCard(card)}
                >
                  <span>Select & Edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
