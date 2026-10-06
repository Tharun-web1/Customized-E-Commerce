import React, { useState } from 'react';
import { Star, Heart, ArrowRight, Upload, Sparkles, LayoutTemplate, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import '../css/VisitingCardsPage.css';

export default function VisitingCardsPage({
  cards = [],
  onSelectCard,
  onNavigateHome,
  onBrowseTemplates,
  onStartDesigning,
}) {
  const [activeCategory, setActiveCategory] = useState('shapes');
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (e, slug) => {
    e.stopPropagation();
    setWishlist(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  // Shapes collection matching user specification: Standard, Classic, and Custom Shape only
  const shapesData = [
    {
      title: 'Standard',
      slug: 'standard',
      shapeClass: 'shape-standard',
      badge: null,
      rating: 4.4,
      reviewsCount: 1780,
      basePrice: 200.00,
      unitPrice: '₹2.00 each / 100 units',
      bgTheme: '#f3f4f6',
      cardStyle: { borderRadius: '2px', border: '1px solid #e5e7eb' },
      logoType: 'standard',
      accentColor: '#ea580c',
    },
    {
      title: 'Classic',
      slug: 'classic',
      shapeClass: 'shape-classic',
      badge: null,
      rating: 4.5,
      reviewsCount: 244,
      basePrice: 230.00,
      unitPrice: '₹2.30 each / 100 units',
      bgTheme: '#fce7f3',
      cardStyle: { borderRadius: '2px', border: '1px solid #fbcfe8' },
      logoType: 'classic',
      accentColor: '#e11d48',
    },
    {
      title: 'Custom Shape Visiting Cards',
      slug: 'custom-shape',
      shapeClass: 'shape-custom',
      badge: 'New',
      rating: 4.6,
      reviewsCount: 31,
      basePrice: 300.00,
      unitPrice: '₹3.00 each / 100 units',
      bgTheme: '#eff6ff',
      cardStyle: { borderRadius: '18px 4px 18px 4px', border: '1px solid #bfdbfe' },
      logoType: 'custom',
      accentColor: '#2563eb',
    },
  ];

  // 2. Texture items matching exact specification:
  // Spot UV Cards, Raised Foil Cards, Non-Tearable Cards, Pearl Cards, Kraft Cards, Transparent Cards
  const textureData = [
    {
      title: 'Spot UV Cards',
      slug: 'spot-uv',
      badge: 'Premium Plus',
      rating: 4.6,
      reviewsCount: 124,
      basePrice: 480.00,
      unitPrice: '₹4.80 each / 100 units',
      bgTheme: '#eef2ff',
      tagline: 'High-build glossy lacquer over smooth matte stock',
      image_gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
      accentColor: '#4338ca',
      gsm: '350-400 GSM',
      finish_type: 'Raised Clear Lacquer',
    },
    {
      title: 'Raised Foil Cards',
      slug: 'raised-foil',
      badge: 'Premium Plus',
      rating: 4.8,
      reviewsCount: 92,
      basePrice: 550.00,
      unitPrice: '₹5.50 each / 100 units',
      bgTheme: '#fef3c7',
      tagline: 'Gleaming 3D metallic gold foil that catches every eye',
      image_gradient: 'linear-gradient(135deg, #78350f 0%, #f59e0b 100%)',
      accentColor: '#f59e0b',
      gsm: '350 GSM Velvet',
      finish_type: 'Embossed Gold / Silver Foil',
    },
    {
      title: 'Non-Tearable Cards',
      slug: 'non-tearable',
      badge: 'Waterproof',
      rating: 4.2,
      reviewsCount: 53,
      basePrice: 380.00,
      unitPrice: '₹3.80 each / 100 units',
      bgTheme: '#ecfeff',
      tagline: 'Untearable synthetic substrate built for field resilience',
      image_gradient: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)',
      accentColor: '#06b6d4',
      gsm: '260 GSM Synthetic',
      finish_type: 'Waterproof Plastic Film',
    },
    {
      title: 'Pearl Cards',
      slug: 'pearl',
      badge: 'Shimmer',
      rating: 4.5,
      reviewsCount: 68,
      basePrice: 410.00,
      unitPrice: '₹4.10 each / 100 units',
      bgTheme: '#fdf4ff',
      tagline: 'Gentle champagne luster that glimmers under lighting',
      image_gradient: 'linear-gradient(135deg, #701a75 0%, #d946ef 100%)',
      accentColor: '#d946ef',
      gsm: '250 GSM Pearlized',
      finish_type: 'Iridescent Metallic Shimmer',
    },
    {
      title: 'Kraft Cards',
      slug: 'kraft',
      badge: 'Eco Recycled',
      rating: 4.5,
      reviewsCount: 47,
      basePrice: 340.00,
      unitPrice: '₹3.40 each / 100 units',
      bgTheme: '#fef3c7',
      tagline: 'Organic natural brown rustic recycled fiber board',
      image_gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 100%)',
      accentColor: '#b45309',
      gsm: '280 GSM Kraft',
      finish_type: 'Natural Brown Recycled',
    },
    {
      title: 'Transparent Cards',
      slug: 'transparent',
      badge: 'Frosted PVC',
      rating: 4.1,
      reviewsCount: 26,
      basePrice: 580.00,
      unitPrice: '₹5.80 each / 100 units',
      bgTheme: '#f0fdfa',
      tagline: 'See-through frosted plastic that turns heads instantly',
      image_gradient: 'linear-gradient(135deg, #134e4a 0%, #2dd4bf 100%)',
      accentColor: '#2dd4bf',
      gsm: '0.38 mm PVC',
      finish_type: 'Translucent / Clear Frosted',
    },
  ];

  // 3. Special items matching exact specification: Bulk Visiting Cards
  const specialData = [
    {
      title: 'Bulk Visiting Cards',
      slug: 'bulk',
      badge: 'Wholesale Tier',
      rating: 4.7,
      reviewsCount: 420,
      basePrice: 850.00,
      unitPrice: '₹0.85 each / 1000 units',
      bgTheme: '#f0fdf4',
      tagline: 'Economical commercial printing for corporate teams of 5 to 500',
      image_gradient: 'linear-gradient(135deg, #14532d 0%, #22c55e 100%)',
      accentColor: '#22c55e',
      gsm: '300 GSM',
      finish_type: 'Commercial Matte / Glossy',
    },
  ];

  // 4. Card Holders matching exact specification: Desktop Visiting Card Holder
  const holdersData = [
    {
      title: 'Desktop Visiting Card Holder',
      slug: 'engraved-metal-holder',
      badge: 'Executive',
      rating: 4.8,
      reviewsCount: 312,
      basePrice: 349.00,
      unitPrice: 'Precision laser engraved',
      bgTheme: '#f8fafc',
      tagline: 'Holds up to 50 standard visiting cards crisply on your office desk',
      image_gradient: 'linear-gradient(135deg, #1e293b 0%, #64748b 100%)',
      accentColor: '#64748b',
      gsm: 'Anodized Aluminum',
      finish_type: 'Precision Laser Engraving',
    },
  ];

  // Helper to find matching database card or fallback
  const handleCardClick = (item) => {
    const found = cards.find(c => c.slug === item.slug);
    if (found) {
      onSelectCard(found);
    } else {
      // Fallback object with attributes
      onSelectCard({
        title: item.title,
        slug: item.slug,
        base_price_100: item.basePrice || 270.00,
        min_quantity: item.slug === 'bulk' ? 1000 : (item.slug === 'engraved-metal-holder' ? 1 : 100),
        gsm: item.gsm || '350 GSM',
        finish_type: item.finish_type || 'Matte / Glossy',
        rating: item.rating || 4.5,
        reviews_count: item.reviewsCount || 100,
        dimensions: '8.9 cm x 5.1 cm',
        accent_color: item.accentColor || '#0056b3',
        description: item.tagline || `Premium ${item.title} with high-definition precision printing on luxury paper board.`,
      });
    }
  };

  return (
    <div className="vc-page-container">
      {/* 1. Breadcrumbs */}
      <div className="vc-breadcrumbs">
        <button
          type="button"
          className="vc-breadcrumb-link"
          onClick={onNavigateHome}
        >
          Home
        </button>
        <span className="vc-breadcrumb-separator">›</span>
        <span className="vc-breadcrumb-current">Visiting Cards</span>
      </div>

      {/* 2. Hero Banner (Matches Screenshot) */}
      <section className="vc-hero-banner">
        <div className="vc-hero-left">
          <h1 className="vc-hero-title">Visiting Cards</h1>
          <p className="vc-hero-subtitle">
            Design and print professional visiting cards with high-definition printing capturing rich colors on premium quality paper.
          </p>

          <div className="vc-hero-actions">
            <button
              type="button"
              className="vc-btn-white"
              onClick={onBrowseTemplates}
            >
              Browse templates
            </button>
            <button
              type="button"
              className="vc-btn-white"
              onClick={onStartDesigning}
            >
              Upload design
            </button>
            <button
              type="button"
              className="vc-btn-outline"
              onClick={onStartDesigning}
            >
              Reorder
            </button>
          </div>
        </div>

        <div className="vc-hero-right">
          <div className="vc-hero-image-wrapper">
            <img
              src="/visiting_cards_hero.jpg"
              alt="Visiting Cards Showcase"
              className="vc-hero-img"
              onError={(e) => {
                // Graceful fallback if image path resolution differs in dev
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
      </section>

      {/* 3. Category Filter Tabs */}
      <div className="vc-nav-tabs-wrapper">
        <div className="vc-nav-tabs">
          <button
            type="button"
            className={`vc-tab-btn ${activeCategory === 'shapes' ? 'active' : ''}`}
            onClick={() => setActiveCategory('shapes')}
          >
            1. By Shape
          </button>
          <button
            type="button"
            className={`vc-tab-btn ${activeCategory === 'texture' ? 'active' : ''}`}
            onClick={() => setActiveCategory('texture')}
          >
            2. Texture
          </button>
          <button
            type="button"
            className={`vc-tab-btn ${activeCategory === 'special' ? 'active' : ''}`}
            onClick={() => setActiveCategory('special')}
          >
            3. Special
          </button>
          <button
            type="button"
            className={`vc-tab-btn ${activeCategory === 'holders' ? 'active' : ''}`}
            onClick={() => setActiveCategory('holders')}
          >
            4. Card Holders
          </button>
        </div>
      </div>

      {/* 4. Section: Shop by shapes */}
      {(activeCategory === 'shapes' || activeCategory === 'all') && (
        <section className="vc-section">
          <div className="vc-section-header">
            <h2 className="vc-section-heading">Shop by shapes</h2>
            <p className="vc-section-subtext">Select from various shapes & sizes.</p>
          </div>

          <div className="vc-cards-grid vc-shapes-grid">
            {shapesData.map((item) => {
              const isFav = !!wishlist[item.slug];
              return (
                <div
                  key={item.slug}
                  className="vc-product-card"
                  onClick={() => handleCardClick(item)}
                >
                  {/* Visual Mockup Box */}
                  <div
                    className="vc-card-visual"
                    style={{ backgroundColor: item.bgTheme }}
                  >
                    {/* Badge */}
                    {item.badge && (
                      <span className="vc-card-badge">{item.badge}</span>
                    )}

                    {/* Wishlist Heart Button */}
                    <button
                      type="button"
                      className={`vc-wishlist-btn ${isFav ? 'active' : ''}`}
                      onClick={(e) => toggleWishlist(e, item.slug)}
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        size={16}
                        fill={isFav ? '#e11d48' : 'none'}
                        color={isFav ? '#e11d48' : '#334155'}
                      />
                    </button>

                    {/* Shape Visual Mockup */}
                    <div className="vc-card-mockup-inner" style={item.cardStyle}>
                      <div className="vc-mockup-branding">
                        {item.logoType === 'standard' && (
                          <div className="mockup-standard">
                            <div className="mockup-logo-icon standard" />
                            <div className="mockup-brand-text">GODBEA</div>
                            <div className="mockup-lines">
                              <span className="m-line full" />
                              <span className="m-line half" />
                            </div>
                          </div>
                        )}
                        {item.logoType === 'classic' && (
                          <div className="mockup-classic">
                            <div className="mockup-logo-icon classic" />
                            <div className="mockup-brand-text" style={{ color: '#e11d48' }}>PENTAL CORNER</div>
                            <div className="mockup-lines">
                              <span className="m-line full" />
                            </div>
                          </div>
                        )}
                        {item.logoType === 'custom' && (
                          <div className="mockup-custom">
                            <div className="mockup-diecut-icon" />
                            <div className="mockup-brand-text" style={{ color: '#2563eb' }}>DENTAL & CARE</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="vc-card-info">
                    <h3 className="vc-card-title">{item.title}</h3>

                    {/* Star Rating */}
                    <div className="vc-rating-row">
                      <div className="vc-stars">
                        {[1, 2, 3, 4, 5].map((starIdx) => (
                          <Star
                            key={starIdx}
                            size={13}
                            fill={starIdx <= Math.round(item.rating) ? '#ea580c' : '#cbd5e1'}
                            color={starIdx <= Math.round(item.rating) ? '#ea580c' : '#cbd5e1'}
                          />
                        ))}
                      </div>
                      <span className="vc-rating-score">{item.rating}</span>
                      <span className="vc-rating-count">({item.reviewsCount})</span>
                    </div>

                    {/* Price and Subprice */}
                    <div className="vc-price-container">
                      <div className="vc-main-price">From ₹{item.basePrice.toFixed(2)}</div>
                      <div className="vc-sub-price">{item.unitPrice}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Section: 2. Texture */}
      {(activeCategory === 'texture' || activeCategory === 'all') && (
        <section className="vc-section">
          <div className="vc-section-header">
            <h2 className="vc-section-heading">2. Texture</h2>
            <p className="vc-section-subtext">Premium finishes including Spot UV, Raised Foil, and durable synthetic stocks.</p>
          </div>

          {/* Group 1: Premium Plus Cards */}
          <div className="vc-subgroup-banner" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, #f0fdf4 0%, #e0f2fe 100%)',
            padding: '12px 20px',
            borderRadius: '8px',
            marginBottom: '18px',
            border: '1px solid #bae6fd',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#002c5f' }}>
                  Premium Plus Cards
                </h3>
                <span className="vc-card-badge" style={{ position: 'static', background: '#0284c7', color: '#fff' }}>
                  Luxury Tactile
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#475569' }}>
                Ultra high-definition dimensional Spot UV lacquer & Raised metallic foil
              </p>
            </div>
          </div>

          <div className="vc-cards-grid" style={{ marginBottom: '32px' }}>
            {textureData.filter(i => i.slug === 'spot-uv' || i.slug === 'raised-foil').map((item) => {
              const isFav = !!wishlist[item.slug];
              return (
                <div
                  key={item.slug}
                  className="vc-product-card"
                  onClick={() => handleCardClick(item)}
                >
                  <div
                    className="vc-card-visual"
                    style={{ background: item.image_gradient }}
                  >
                    {item.badge && <span className="vc-card-badge">{item.badge}</span>}
                    <div className="vc-card-gsm-tag">{item.gsm}</div>
                    <button
                      type="button"
                      className={`vc-wishlist-btn ${isFav ? 'active' : ''}`}
                      onClick={(e) => toggleWishlist(e, item.slug)}
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        size={16}
                        fill={isFav ? '#e11d48' : 'none'}
                        color={isFav ? '#e11d48' : '#ffffff'}
                      />
                    </button>
                  </div>
                  <div className="vc-card-info">
                    <h3 className="vc-card-title">{item.title}</h3>
                    <div className="vc-rating-row">
                      <div className="vc-stars">
                        {[1, 2, 3, 4, 5].map((starIdx) => (
                          <Star
                            key={starIdx}
                            size={13}
                            fill={starIdx <= Math.round(item.rating) ? '#ea580c' : '#cbd5e1'}
                            color={starIdx <= Math.round(item.rating) ? '#ea580c' : '#cbd5e1'}
                          />
                        ))}
                      </div>
                      <span className="vc-rating-score">{item.rating}</span>
                      <span className="vc-rating-count">({item.reviewsCount})</span>
                    </div>
                    <div className="vc-price-container">
                      <div className="vc-main-price">From ₹{item.basePrice.toFixed(2)}</div>
                      <div className="vc-sub-price">{item.unitPrice}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Group 2: Specialty Textures */}
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#002c5f' }}>
              Specialty Materials & Textures
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Non-Tearable, Pearlized shimmer, Natural rustic Kraft, and Frosted Transparent PVC
            </p>
          </div>

          <div className="vc-cards-grid">
            {textureData.filter(i => i.slug !== 'spot-uv' && i.slug !== 'raised-foil').map((item) => {
              const isFav = !!wishlist[item.slug];
              return (
                <div
                  key={item.slug}
                  className="vc-product-card"
                  onClick={() => handleCardClick(item)}
                >
                  <div
                    className="vc-card-visual"
                    style={{ background: item.image_gradient }}
                  >
                    {item.badge && <span className="vc-card-badge">{item.badge}</span>}
                    <div className="vc-card-gsm-tag">{item.gsm}</div>
                    <button
                      type="button"
                      className={`vc-wishlist-btn ${isFav ? 'active' : ''}`}
                      onClick={(e) => toggleWishlist(e, item.slug)}
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        size={16}
                        fill={isFav ? '#e11d48' : 'none'}
                        color={isFav ? '#e11d48' : '#ffffff'}
                      />
                    </button>
                  </div>
                  <div className="vc-card-info">
                    <h3 className="vc-card-title">{item.title}</h3>
                    <div className="vc-rating-row">
                      <div className="vc-stars">
                        {[1, 2, 3, 4, 5].map((starIdx) => (
                          <Star
                            key={starIdx}
                            size={13}
                            fill={starIdx <= Math.round(item.rating) ? '#ea580c' : '#cbd5e1'}
                            color={starIdx <= Math.round(item.rating) ? '#ea580c' : '#cbd5e1'}
                          />
                        ))}
                      </div>
                      <span className="vc-rating-score">{item.rating}</span>
                      <span className="vc-rating-count">({item.reviewsCount})</span>
                    </div>
                    <div className="vc-price-container">
                      <div className="vc-main-price">From ₹{item.basePrice.toFixed(2)}</div>
                      <div className="vc-sub-price">{item.unitPrice}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Section: 3. Special */}
      {(activeCategory === 'special' || activeCategory === 'all') && (
        <section className="vc-section">
          <div className="vc-section-header">
            <h2 className="vc-section-heading">3. Special</h2>
            <p className="vc-section-subtext">High-volume wholesale printing for corporate teams of 5 to 500.</p>
          </div>

          <div className="vc-cards-grid vc-shapes-grid">
            {specialData.map((item) => {
              const isFav = !!wishlist[item.slug];
              return (
                <div
                  key={item.slug}
                  className="vc-product-card"
                  onClick={() => handleCardClick(item)}
                >
                  <div
                    className="vc-card-visual"
                    style={{ background: item.image_gradient }}
                  >
                    {item.badge && <span className="vc-card-badge">{item.badge}</span>}
                    <div className="vc-card-gsm-tag">{item.gsm}</div>
                    <button
                      type="button"
                      className={`vc-wishlist-btn ${isFav ? 'active' : ''}`}
                      onClick={(e) => toggleWishlist(e, item.slug)}
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        size={16}
                        fill={isFav ? '#e11d48' : 'none'}
                        color={isFav ? '#e11d48' : '#ffffff'}
                      />
                    </button>
                  </div>
                  <div className="vc-card-info">
                    <h3 className="vc-card-title">{item.title}</h3>
                    <div className="vc-rating-row">
                      <div className="vc-stars">
                        {[1, 2, 3, 4, 5].map((starIdx) => (
                          <Star
                            key={starIdx}
                            size={13}
                            fill={starIdx <= Math.round(item.rating) ? '#ea580c' : '#cbd5e1'}
                            color={starIdx <= Math.round(item.rating) ? '#ea580c' : '#cbd5e1'}
                          />
                        ))}
                      </div>
                      <span className="vc-rating-score">{item.rating}</span>
                      <span className="vc-rating-count">({item.reviewsCount})</span>
                    </div>
                    <div className="vc-price-container">
                      <div className="vc-main-price">From ₹{item.basePrice.toFixed(2)}</div>
                      <div className="vc-sub-price">{item.unitPrice}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 7. Section: 4. Card Holders */}
      {(activeCategory === 'holders' || activeCategory === 'all') && (
        <section className="vc-section">
          <div className="vc-section-header">
            <h2 className="vc-section-heading">4. Card Holders</h2>
            <p className="vc-section-subtext">Executive desktop accessories to keep your visiting cards crisp and ready on the desk.</p>
          </div>

          <div className="vc-cards-grid vc-shapes-grid">
            {holdersData.map((item) => {
              const isFav = !!wishlist[item.slug];
              return (
                <div
                  key={item.slug}
                  className="vc-product-card"
                  onClick={() => handleCardClick(item)}
                >
                  <div
                    className="vc-card-visual"
                    style={{ background: item.image_gradient }}
                  >
                    {item.badge && <span className="vc-card-badge">{item.badge}</span>}
                    <div className="vc-card-gsm-tag">{item.gsm}</div>
                    <button
                      type="button"
                      className={`vc-wishlist-btn ${isFav ? 'active' : ''}`}
                      onClick={(e) => toggleWishlist(e, item.slug)}
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        size={16}
                        fill={isFav ? '#e11d48' : 'none'}
                        color={isFav ? '#e11d48' : '#ffffff'}
                      />
                    </button>
                  </div>
                  <div className="vc-card-info">
                    <h3 className="vc-card-title">{item.title}</h3>
                    <div className="vc-rating-row">
                      <div className="vc-stars">
                        {[1, 2, 3, 4, 5].map((starIdx) => (
                          <Star
                            key={starIdx}
                            size={13}
                            fill={starIdx <= Math.round(item.rating) ? '#ea580c' : '#cbd5e1'}
                            color={starIdx <= Math.round(item.rating) ? '#ea580c' : '#cbd5e1'}
                          />
                        ))}
                      </div>
                      <span className="vc-rating-score">{item.rating}</span>
                      <span className="vc-rating-count">({item.reviewsCount})</span>
                    </div>
                    <div className="vc-price-container">
                      <div className="vc-main-price">From ₹{item.basePrice.toFixed(2)}</div>
                      <div className="vc-sub-price">{item.unitPrice}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
