import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  Search,
  Filter,
  LayoutTemplate,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  Layers,
  Check,
  RotateCw
} from 'lucide-react';
import TemplateCardMockup from './TemplateCardMockup';
import '../css/BrowseDesignsPage.css';

export default function BrowseDesignsPage({
  card,
  allTemplates = [],
  onSelectTemplate,
  onNavigateBack,
  onNavigateHome,
}) {
  const currentCard = card || {
    title: 'Standard Visiting Cards',
    slug: 'standard',
    base_price_100: 200.0,
    dimensions: '8.9 cm x 5.1 cm',
    gsm: '350 GSM',
  };

  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedOrientation, setSelectedOrientation] = useState('all'); // 'all' | 'horizontal' | 'vertical'
  const [searchQuery, setSearchQuery] = useState('');

  // Industry filters
  const industries = [
    'All',
    'Medical',
    'Finance/CA',
    'Legal',
    'Tech',
    'Salon',
    'Real Estate',
    'Food',
    'Corporate',
    'Creative'
  ];

  // Templates matching this card (or catalog fallback)
  const cardTemplates = useMemo(() => {
    return allTemplates.filter((tpl) => {
      if (!tpl) return false;
      if (tpl.card && currentCard.id && Number(tpl.card) === Number(currentCard.id)) return true;
      if (tpl.card_id && currentCard.id && Number(tpl.card_id) === Number(currentCard.id)) return true;
      if (tpl.card_title && currentCard.title && tpl.card_title.toLowerCase() === currentCard.title.toLowerCase()) return true;
      return true; // show templates across catalog for rich variety
    });
  }, [allTemplates, currentCard]);

  // Filtered templates based on industry, orientation, and search query
  const filteredTemplates = useMemo(() => {
    return cardTemplates.filter((tpl) => {
      // Industry filter
      if (selectedIndustry !== 'All') {
        const ind = (tpl.industry || '').toLowerCase();
        if (!ind.includes(selectedIndustry.toLowerCase())) return false;
      }
      // Orientation filter
      if (selectedOrientation !== 'all') {
        const ort = (tpl.orientation || 'horizontal').toLowerCase();
        if (ort !== selectedOrientation.toLowerCase()) return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (tpl.title || '').toLowerCase().includes(q);
        const matchesIndustry = (tpl.industry || '').toLowerCase().includes(q);
        const matchesCompany = (tpl.sample_company || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesIndustry && !matchesCompany) return false;
      }
      return true;
    });
  }, [cardTemplates, selectedIndustry, selectedOrientation, searchQuery]);

  return (
    <div className="bdp-page-container">
      {/* 1. Top Navigation Bar (Breadcrumbs & Back button inside container) */}
      <div className="bdp-top-nav">
        <button
          type="button"
          className="bdp-back-btn"
          onClick={onNavigateBack}
        >
          <ChevronLeft size={16} />
          <span>Back to {currentCard.title}</span>
        </button>

        <nav className="bdp-breadcrumbs" aria-label="Breadcrumb">
          <button type="button" onClick={onNavigateHome} className="bdp-crumb-link">
            Home
          </button>
          <span className="bdp-crumb-sep">/</span>
          <button type="button" onClick={onNavigateBack} className="bdp-crumb-link">
            Visiting Cards
          </button>
          <span className="bdp-crumb-sep">/</span>
          <button type="button" onClick={onNavigateBack} className="bdp-crumb-link">
            {currentCard.title}
          </button>
          <span className="bdp-crumb-sep">/</span>
          <span className="bdp-crumb-current">Browse Designs</span>
        </nav>
      </div>

      {/* 2. Hero Banner (Boxed Card with Rounded Corners) */}
      <header className="bdp-hero-banner">
        <div className="bdp-hero-badge">
          <LayoutTemplate size={14} />
          <span>{filteredTemplates.length} Design Templates Available</span>
        </div>
        <h1 className="bdp-hero-title">Design Templates for {currentCard.title}</h1>
        <p className="bdp-hero-subtitle">
          Choose from professionally crafted templates tailored for {currentCard.title}. Pick your favorite color palette, click customize, and personalize your contact information.
        </p>

        <div className="bdp-card-spec-chips">
          <span className="bdp-spec-chip">Size: {currentCard.dimensions || '8.9 cm x 5.1 cm'}</span>
          <span className="bdp-spec-chip">Paper: {currentCard.gsm || '350 GSM'}</span>
          <span className="bdp-spec-chip">Starting at ₹{Number(currentCard.base_price_100 || 200).toFixed(2)}/100 units</span>
        </div>
      </header>

      {/* 3. Filter & Search Controls Toolbar Card */}
      <section className="bdp-toolbar-card">
        {/* Industry categories row */}
        <div className="bdp-industry-chips-container">
          <div className="bdp-industry-chips">
            {industries.map((ind) => (
              <button
                key={ind}
                type="button"
                className={`bdp-industry-chip ${selectedIndustry === ind ? 'active' : ''}`}
                onClick={() => setSelectedIndustry(ind)}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary filter row: Orientation & Search */}
        <div className="bdp-controls-row">
          {/* Search Input */}
          <div className="bdp-search-box">
            <Search size={16} className="bdp-search-icon" />
            <input
              type="text"
              className="bdp-search-input"
              placeholder="Search templates by profession, style or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="bdp-clear-search"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Orientation segmented toggle */}
          <div className="bdp-orientation-filter">
            <span className="bdp-filter-label">Orientation:</span>
            <div className="bdp-seg-group">
              <button
                type="button"
                className={`bdp-seg-btn ${selectedOrientation === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedOrientation('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`bdp-seg-btn ${selectedOrientation === 'horizontal' ? 'active' : ''}`}
                onClick={() => setSelectedOrientation('horizontal')}
              >
                Horizontal
              </button>
              <button
                type="button"
                className={`bdp-seg-btn ${selectedOrientation === 'vertical' ? 'active' : ''}`}
                onClick={() => setSelectedOrientation('vertical')}
              >
                Vertical
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Templates Grid */}
      <main className="bdp-templates-section">
        {filteredTemplates.length > 0 ? (
          <div className="bdp-templates-grid">
            {filteredTemplates.map((tpl) => (
              <div key={tpl.id} className="bdp-template-card-box">
                <div className="bdp-mockup-wrapper">
                  <TemplateCardMockup
                    template={tpl}
                    onSelect={(configuredTpl) => {
                      onSelectTemplate({
                        ...configuredTpl,
                        card: currentCard,
                        orientation: tpl.orientation || (selectedOrientation !== 'all' ? selectedOrientation : 'horizontal'),
                      });
                    }}
                  />
                </div>

                <div className="bdp-template-meta">
                  <div className="bdp-meta-top">
                    <span className="bdp-industry-tag">{tpl.industry || 'Professional'}</span>
                    <span className="bdp-orientation-tag">
                      {tpl.orientation === 'vertical' ? 'Vertical' : 'Horizontal'}
                    </span>
                  </div>

                  <h3 className="bdp-template-title">{tpl.title}</h3>

                  <button
                    type="button"
                    className="bdp-customize-btn"
                    onClick={() => {
                      onSelectTemplate({
                        ...tpl,
                        card: currentCard,
                        orientation: tpl.orientation || (selectedOrientation !== 'all' ? selectedOrientation : 'horizontal'),
                      });
                    }}
                  >
                    <span>Customize this design</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bdp-empty-state">
            <div className="bdp-empty-icon">
              <Search size={36} color="#94a3b8" />
            </div>
            <h3>No templates found matching your filter</h3>
            <p>Try resetting the industry or orientation filter to see more designs.</p>
            <button
              type="button"
              className="bdp-reset-btn"
              onClick={() => {
                setSelectedIndustry('All');
                setSelectedOrientation('all');
                setSearchQuery('');
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
