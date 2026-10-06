import React, { useState, useRef } from 'react';
import {
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  Truck,
  Calendar,
  Layers,
  Sparkles,
  Upload,
  LayoutTemplate,
  Info,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import TemplateCardMockup from './TemplateCardMockup';
import UploadDesignModalFlow from './UploadDesignModalFlow';
import '../css/ProductDetailPage.css';

export default function ProductDetailPage({
  card,
  templates = [],
  onSelectTemplate,
  onNavigateHome,
  onNavigateVisitingCards,
  onBrowseDesigns,
  onUploadDesign,
  onAddToCart,
}) {
  // Current active product fallback
  const currentCard = card || {
    title: 'Standard Visiting Cards',
    slug: 'standard',
    base_price_100: 200.00,
    min_quantity: 100,
    gsm: '350 GSM',
    finish_type: 'Matte / Glossy',
    rating: 4.4,
    reviews_count: 1780,
    dimensions: '8.9 cm x 5.1 cm',
    accent_color: '#ea580c',
    description: 'Personalized cards with a professional look. High-definition precision printing on premium quality paper board.',
  };

  // State
  const [quantity, setQuantity] = useState(100);
  const [deliverySpeed, setDeliverySpeed] = useState('standard'); // 'standard' | 'express'
  const [cornerStyle, setCornerStyle] = useState('standard'); // 'standard' | 'rounded'
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [pincode, setPincode] = useState('110001');
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [showSpecifications, setShowSpecifications] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const carouselRef = useRef(null);

  // Gallery Images dynamically loaded from card with fallback
  const galleryImages = [
    { type: 'image', src: currentCard.image_url || '/pdp_card_stack.jpg', alt: `${currentCard.title} Stack` },
    { type: 'image', src: currentCard.image_url_2 || '/pdp_card_box.jpg', alt: `${currentCard.title} Packaging` },
    { type: 'image', src: currentCard.image_url_3 || '/visiting_cards_hero.jpg', alt: `${currentCard.title} Showcase` },
  ].filter((img) => Boolean(img.src));

  const bulletList = currentCard.bullet_points?.trim()
    ? currentCard.bullet_points.split('\n').filter(Boolean)
    : [
        '4000+ design options available',
        'Standard glossy or matte paper included',
        'Need help in designing? You can avail our Design Services',
        'Same Day Delivery available on select pin codes in Mumbai, Bengaluru & Kolkata. Order before 12 noon for same day delivery. Orders placed after 12 noon will be delivered the next working day.',
        'Note: Do not upload designs containing signatures or content from Government entities, banks or financial institutions.',
        'Cash on Delivery available only for Standard delivery speed',
        'Price below is MRP (inclusive of all taxes)',
      ];

  // Templates associated with this specific card (or fallback to catalog templates)
  const cardTemplates = templates.filter((tpl) => {
    if (!tpl) return false;
    if (tpl.card && currentCard.id && Number(tpl.card) === Number(currentCard.id)) return true;
    if (tpl.card_id && currentCard.id && Number(tpl.card_id) === Number(currentCard.id)) return true;
    if (tpl.card_title && currentCard.title && tpl.card_title.toLowerCase() === currentCard.title.toLowerCase()) return true;
    return false;
  });
  const displayTemplates = cardTemplates.length > 0 ? cardTemplates : templates;

  // Pricing calculations
  const baseRatePerCard = (currentCard.base_price_100 || 200.00) / 100;

  
  // Volume discount tiers
  let discountMultiplier = 1.0;
  if (quantity >= 2000) discountMultiplier = 0.75;
  else if (quantity >= 1000) discountMultiplier = 0.80;
  else if (quantity >= 500) discountMultiplier = 0.88;
  else if (quantity >= 300) discountMultiplier = 0.92;
  else if (quantity >= 200) discountMultiplier = 0.95;

  const unitPrice = (baseRatePerCard * discountMultiplier);
  const expressFee = deliverySpeed === 'express' ? 120.00 : 0.00;
  const totalPrice = (unitPrice * quantity) + expressFee;

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Estimated delivery date (4 days from current date)
  const getDeliveryDateString = () => {
    const d = new Date();
    d.setDate(d.getDate() + (deliverySpeed === 'express' ? 1 : 4));
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
  };

  const handleStartDesigning = () => {
    if (onBrowseDesigns) {
      onBrowseDesigns({
        ...currentCard,
        quantity,
        corner_style: cornerStyle,
        delivery_speed: deliverySpeed,
        total_price: totalPrice,
      });
    }
  };

  const handleUploadArtwork = () => {
    setIsUploadModalOpen(true);
  };

  return (
    <div className="pdp-container">
      {/* 1. Breadcrumbs */}
      <nav className="pdp-breadcrumbs" aria-label="Breadcrumb">
        <button
          type="button"
          className="pdp-breadcrumb-link"
          onClick={onNavigateHome}
        >
          Home
        </button>
        <span className="pdp-breadcrumb-separator">›</span>
        <button
          type="button"
          className="pdp-breadcrumb-link"
          onClick={onNavigateVisitingCards}
        >
          Visiting Cards
        </button>
        <span className="pdp-breadcrumb-separator">›</span>
        <span className="pdp-breadcrumb-current">{currentCard.title}</span>
      </nav>

      {/* 2. Main PDP Two-Column Grid */}
      <div className="pdp-grid">
        {/* ================= LEFT COLUMN: GALLERY ================= */}
        <div className="pdp-gallery-col">
          <div className="pdp-main-image-wrapper">
            {/* Wishlist Heart Button */}
            <button
              type="button"
              className={`pdp-wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={() => setIsWishlisted(!isWishlisted)}
              aria-label="Add to wishlist"
            >
              <Heart
                size={18}
                fill={isWishlisted ? '#e11d48' : 'none'}
                color={isWishlisted ? '#e11d48' : '#334155'}
              />
            </button>

            {/* Slider Navigation Arrows */}
            <button
              type="button"
              className="pdp-nav-arrow left"
              onClick={prevImage}
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="pdp-nav-arrow right"
              onClick={nextImage}
              aria-label="Next photo"
            >
              <ChevronRight size={20} />
            </button>

            {/* Main Showcase Image */}
            <img
              src={galleryImages[activeImageIdx].src}
              alt={galleryImages[activeImageIdx].alt}
              className="pdp-main-img"
              onError={(e) => {
                // Fallback graceful handler
                e.target.src = '/visiting_cards_hero.jpg';
              }}
            />
          </div>

          {/* Thumbnails Strip */}
          <div className="pdp-thumbnails-strip">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                className={`pdp-thumb-btn ${activeImageIdx === idx ? 'active' : ''}`}
                onClick={() => setActiveImageIdx(idx)}
              >
                <img src={img.src} alt={img.alt} className="pdp-thumb-img" />
              </button>
            ))}

            {/* Extra Color/Substrate Swatch Preview */}
            <button
              type="button"
              className={`pdp-thumb-btn`}
              onClick={() => setActiveImageIdx(0)}
              title="Material Spec"
            >
              <div
                className="pdp-thumb-swatch"
                style={{
                  background: currentCard.image_gradient || currentCard.accent_color || '#0056b3',
                }}
              >
                {currentCard.gsm || '350 GSM'}
              </div>
            </button>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: BUY BOX & OPTIONS ================= */}
        <div className="pdp-details-col">
          {/* Title & Review Strip */}
          <div className="pdp-title-block">
            <h1 className="pdp-title">{currentCard.title}</h1>

            <div className="pdp-rating-strip">
              <div className="pdp-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={s <= Math.round(currentCard.rating || 4.5) ? '#ea580c' : '#cbd5e1'}
                    color={s <= Math.round(currentCard.rating || 4.5) ? '#ea580c' : '#cbd5e1'}
                  />
                ))}
              </div>
              <span className="pdp-rating-score">{currentCard.rating || 4.4}</span>
              <span className="pdp-reviews-count">({currentCard.reviews_count || 1780})</span>
            </div>

            <p className="pdp-subtitle">
              {currentCard.tagline || 'Personalized cards with a professional look.'}
            </p>

            {/* Bullet Points (Admin Managed) */}
            <ul className="pdp-bullets-list">
              {bulletList.map((bullet, idx) => (
                <li key={idx}>
                  {bullet.includes('Design Services') ? (
                    <>Need help in designing? You can avail our <a>Design Services</a></>
                  ) : bullet.startsWith('Note:') ? (
                    <><strong>Note:</strong> {bullet.replace(/^Note:\s*/, '')}</>
                  ) : (
                    bullet
                  )}
                </li>
              ))}
            </ul>

            {/* Inline Specifications Toggle (NO POP-UP) */}
            <button
              type="button"
              className="pdp-see-details-link"
              onClick={() => setShowSpecifications(!showSpecifications)}
            >
              {showSpecifications ? 'Hide Specifications ▴' : 'See Details & Specifications ▾'}
            </button>

            {/* Inline Specifications Drawer */}
            {showSpecifications && (
              <div className="pdp-inline-specs-panel">
                <h4>Product Specifications & Details</h4>
                <table className="pdp-specs-table">
                  <tbody>
                    <tr>
                      <th>Material / Paper Stock</th>
                      <td>{currentCard.gsm || '350 GSM Board'}</td>
                    </tr>
                    <tr>
                      <th>Standard Dimensions</th>
                      <td>{currentCard.dimensions || '8.9 cm x 5.1 cm'}</td>
                    </tr>
                    <tr>
                      <th>Finish Type</th>
                      <td>{currentCard.finish_type || 'Matte / Glossy'}</td>
                    </tr>
                    <tr>
                      <th>Corner Options</th>
                      <td>Standard 90° Square & 1/4" Rounded Die-Cut</td>
                    </tr>
                    <tr>
                      <th>Base Rate (100 units)</th>
                      <td>₹{Number(currentCard.base_price_100 || 200).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th>Min Order Quantity</th>
                      <td>{currentCard.min_quantity || 100} units</td>
                    </tr>
                    {currentCard.description && (
                      <tr>
                        <th>Overview</th>
                        <td>{currentCard.description}</td>
                      </tr>
                    )}
                    {currentCard.specifications && (
                      <tr>
                        <th>Extra Specifications</th>
                        <td style={{ whiteSpace: 'pre-line' }}>{currentCard.specifications}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>


          {/* Price Block */}
          <div className="pdp-price-block">
            <div className="pdp-price-amount">₹{totalPrice.toFixed(2)}</div>
            <div className="pdp-price-subtext">
              ₹{unitPrice.toFixed(2)} each / {quantity} units
            </div>
          </div>

          {/* Delivery Estimator Box */}
          <div className="pdp-delivery-box">
            <div className="pdp-delivery-header">
              <span className="pdp-delivery-pincode">
                Delivery to {pincode}
              </span>
              <button
                type="button"
                className="pdp-guide-link"
                onClick={() => {
                  const newPin = prompt('Enter your 6-digit delivery pincode:', pincode);
                  if (newPin && newPin.trim().length === 6) setPincode(newPin.trim());
                }}
              >
                Change PIN
              </button>
            </div>
            <div className="pdp-delivery-status">
              <Calendar size={14} />
              <span>{getDeliveryDateString()} FREE</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="pdp-quantity-group">
            <div className="pdp-quantity-header">
              <label className="pdp-section-label" htmlFor="pdp-qty-select">
                Quantity*
              </label>
              <button
                type="button"
                className="pdp-guide-link"
                onClick={() => alert('Volume Pricing:\n100: ₹2.00/card\n200: ₹1.90/card\n500: ₹1.76/card\n1000: ₹1.60/card')}
              >
                Show pricing guide
              </button>
            </div>
            <p className="pdp-quantity-subtext">
              Get volume pricing on higher quantities of the same design
            </p>

            <select
              id="pdp-qty-select"
              className="pdp-quantity-select"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            >
              <option value={100}>100 units</option>
              <option value={200}>200 units (Save 5%)</option>
              <option value={300}>300 units (Save 8%)</option>
              <option value={500}>500 units (Save 12%)</option>
              <option value={1000}>1,000 units (Save 20%)</option>
              <option value={2000}>2,000 units (Save 25%)</option>
              <option value={5000}>5,000 units (Bulk Best Value)</option>
            </select>
            <span className="pdp-min-caption">Minimum: 100</span>
          </div>

          {/* Delivery Speed Choice Cards */}
          <div className="pdp-choice-group">
            <label className="pdp-section-label">Delivery Speed*</label>
            <div className="pdp-choice-cards-row">
              <div
                className={`pdp-choice-card ${deliverySpeed === 'standard' ? 'selected' : ''}`}
                onClick={() => setDeliverySpeed('standard')}
              >
                <div className="pdp-choice-title">Standard</div>
                <div className="pdp-choice-sub">Delivery in 3–5 working days</div>
                <div className="pdp-choice-extra" style={{ color: '#047857' }}>Free</div>
              </div>

              <div
                className={`pdp-choice-card ${deliverySpeed === 'express' ? 'selected' : ''}`}
                onClick={() => setDeliverySpeed('express')}
              >
                <div className="pdp-choice-title">Same Day Delivery</div>
                <div className="pdp-choice-sub">Mumbai, Bengaluru & Kolkata</div>
                <div className="pdp-choice-extra">+₹120.00</div>
              </div>
            </div>
          </div>

          {/* Corners Selection Cards */}
          <div className="pdp-choice-group">
            <label className="pdp-section-label">Corners*</label>
            <div className="pdp-choice-cards-row">
              <div
                className={`pdp-choice-card ${cornerStyle === 'standard' ? 'selected' : ''}`}
                onClick={() => setCornerStyle('standard')}
              >
                <div className="pdp-choice-title">Standard (89 x 51 mm)</div>
                <div className="pdp-choice-sub">Classic sharp 90° rectangular edges</div>
              </div>

              <div
                className={`pdp-choice-card ${cornerStyle === 'rounded' ? 'selected' : ''} ${currentCard.slug === 'custom-shape' ? 'disabled' : ''}`}
                onClick={() => {
                  if (currentCard.slug !== 'custom-shape') {
                    setCornerStyle('rounded');
                  }
                }}
              >
                <div className="pdp-choice-title">Rounded Corner</div>
                <div className="pdp-choice-sub">
                  {currentCard.slug === 'custom-shape' ? 'Incompatible with custom shape' : '1/4" Smooth curved corners'}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Corner Illustration Cards */}
          <div className="pdp-choice-group">
            <label className="pdp-section-label">Corner Illustration*</label>
            <div className="pdp-visual-corners-row">
              <div
                className={`pdp-visual-corner-card ${cornerStyle === 'standard' ? 'selected' : ''}`}
                onClick={() => setCornerStyle('standard')}
              >
                <div className="pdp-corner-mockup-graphic">
                  <div className="corner-graphic-standard">
                    <span>90° SHARP CORNER</span>
                  </div>
                </div>
                <div className="pdp-corner-card-caption">
                  <span>Standard</span>
                </div>
              </div>

              <div
                className={`pdp-visual-corner-card ${cornerStyle === 'rounded' ? 'selected' : ''}`}
                onClick={() => setCornerStyle('rounded')}
              >
                <div className="pdp-corner-mockup-graphic">
                  <div className="corner-graphic-rounded">
                    <span>ROUNDED DIE-CUT</span>
                  </div>
                </div>
                <div className="pdp-corner-card-caption">
                  <span>Rounded Corner</span>
                </div>
              </div>
            </div>
          </div>

          {/* Call-to-Action Stack */}
          <div className="pdp-actions-stack">
            <button
              type="button"
              className="pdp-btn-primary-cyan"
              onClick={handleStartDesigning}
            >
              <LayoutTemplate size={18} />
              <span>Browse designs</span>
            </button>

            <button
              type="button"
              className="pdp-btn-outline-white"
              onClick={handleUploadArtwork}
            >
              <Upload size={18} />
              <span>Upload design</span>
            </button>
          </div>

          {/* Bottom Designer Concierge Bar */}
          <div className="pdp-designer-bar">
            <div className="pdp-avatars-row">
              <div className="pdp-avatar" style={{ background: '#ea580c' }}>S</div>
              <div className="pdp-avatar" style={{ background: '#0284c7' }}>P</div>
              <div className="pdp-avatar" style={{ background: '#16a34a' }}>A</div>
            </div>
            <span>
              Let us design it for you from <strong className="pdp-designer-link">₹300.00</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Design Templates for this Card - Matching Vistaprint Official Style */}
      {displayTemplates.length > 0 && (
        <section className="pdp-templates-section">
          <div className="pdp-templates-header">
            <div className="pdp-templates-badge">
              <LayoutTemplate size={14} />
              <span>{displayTemplates.length} Ready Templates</span>
            </div>
            <div className="pdp-templates-header-row">
              <div>
                <h2 className="pdp-templates-title">Design Templates for {currentCard.title}</h2>
                <p className="pdp-templates-subtitle">
                  Choose from profession-ready layouts designed specifically for {currentCard.title}. Select a color palette and customize with your details.
                </p>
              </div>
              {onBrowseDesigns && (
                <button
                  type="button"
                  className="pdp-browse-all-btn"
                  onClick={() => onBrowseDesigns(currentCard)}
                >
                  <span>Browse All ({displayTemplates.length})</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="pdp-templates-grid-3x3">
            {displayTemplates.map((tpl) => (
              <div key={tpl.id} className="pdp-templates-grid-item">
                <TemplateCardMockup
                  template={tpl}
                  onSelect={(selectedTpl) => {
                    if (onSelectTemplate) {
                      onSelectTemplate(selectedTpl);
                    } else if (onBrowseDesigns) {
                      onBrowseDesigns({
                        ...currentCard,
                        selectedTemplate: selectedTpl,
                        custom_company: selectedTpl.sample_company,
                        custom_title: selectedTpl.sample_tagline,
                        accent_color: selectedTpl.activeColor || selectedTpl.primary_color || currentCard.accent_color,
                      });
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Two-Step Upload Design Modal Flow (Matching Image 2 and Image 3) */}
      <UploadDesignModalFlow
        isOpen={isUploadModalOpen}
        card={currentCard}
        initialQuantity={quantity}
        initialCornerStyle={cornerStyle}
        onClose={() => setIsUploadModalOpen(false)}
        onProceedToStudio={(configuredData) => {
          setIsUploadModalOpen(false);
          if (onUploadDesign) {
            onUploadDesign(configuredData);
          }
        }}
      />
    </div>
  );
}
