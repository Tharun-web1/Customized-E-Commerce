import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  User,
  Package,
  ChevronDown,
  ChevronUp,
  X,
  Trash2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  Tag,
  Sparkles,
  Info,
  Clock,
  Check,
  Percent,
  Search,
  LogIn,
  RotateCcw,
  FileCheck,
  Star,
  Layers,
  Palette,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { validatePromoCode } from '../api';
import '../css/CartPage.css';

function KraftBagIllustration() {
  return (
    <div className="cart-luxe-bag-podium">
      <div className="cart-bag-ambient-glow" />
      <svg width="100" height="110" viewBox="0 0 84 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="cart-floating-bag">
        {/* Sparkles / Sketch rays */}
        <path d="M22 14L19 19" stroke="#0099ff" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M15 16L18 20" stroke="#0099ff" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M42 4V10" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M64 15L67 19" stroke="#0099ff" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M70 17L66 21" stroke="#0099ff" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M63 36L68 37" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <path d="M65 33L67 38" stroke="#0099ff" strokeWidth="1.8" strokeLinecap="round" />

        {/* Bag Handles */}
        <path
          d="M34 26V18C34 13.5817 37.5817 10 42 10C46.4183 10 50 13.5817 50 18V26"
          stroke="#c9955d"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M37 26V20C37 17.2386 39.2386 15 42 15C44.7614 15 47 17.2386 47 20V26"
          stroke="#f1dfcc"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Bag Body (Warm Kraft Paper) */}
        <path
          d="M24 30L26 84C26.2 86.2 28 88 30.2 88H53.8C56 88 57.8 86.2 58 84L60 30H24Z"
          fill="url(#kraftGradLuxe)"
          stroke="#9f6f3b"
          strokeWidth="1.5"
        />

        {/* Paper Fold Lines */}
        <path d="M26 30L34 88" stroke="#b9864e" strokeWidth="1" opacity="0.6" />
        <path d="M58 30L50 88" stroke="#9f6f3b" strokeWidth="1" opacity="0.4" />

        {/* Top Fold Crease */}
        <path d="M23 30H61V34H23V30Z" fill="#caa074" opacity="0.95" />

        {/* Brand Shield Logo on Bag */}
        <g transform="translate(35, 48)">
          <rect width="14" height="14" rx="3.5" fill="#002c5f" />
          <path d="M4 4.5L7 10L10 4.5H4Z" fill="#0099ff" />
        </g>

        <defs>
          <linearGradient id="kraftGradLuxe" x1="24" y1="30" x2="60" y2="88" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e8bf91" />
            <stop offset="0.5" stopColor="#caa074" />
            <stop offset="1" stopColor="#aa7c48" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function CartItemMockup({ item }) {
  const [activeSide, setActiveSide] = useState('front');

  const frontSrc = item.preview_image || item.uploaded_artwork;
  const backSrc = item.back_preview_image || item.uploaded_artwork_back;

  return (
    <div className="cart-item-mockup-wrapper">
      <div className="cart-item-wood-frame">
        {/* Natural light birch/wood desk background */}
        <img
          src="/mockup_wood_bg.png"
          alt="Desk Background"
          className="cart-wood-bg-img"
        />

        {/* The Card Layer with realistic depth */}
        <div className={`cart-mockup-card-canvas ${item.corner_style === 'Rounded' || item.corner_style === 'rounded' ? 'is-rounded' : ''}`}>
          {activeSide === 'front' ? (
            frontSrc ? (
              <img
                src={frontSrc}
                alt={item.custom_name || item.card_title || 'Card Front'}
                className="cart-card-rendered-img"
              />
            ) : (
              (() => {
                const isLuxury = (item.template_name || '').toLowerCase().includes('luxury') || (item.card_title || '').toLowerCase().includes('black');
                const isDark = isLuxury || item.accent_color === '#111827' || item.accent_color === '#0f172a' || item.accent_color === '#000000';
                const bg = isLuxury ? '#09090b' : isDark ? '#0f172a' : '#ffffff';
                const textCol = isLuxury ? '#d4af37' : isDark ? '#ffffff' : '#0f172a';
                const accent = isLuxury ? '#d4af37' : (item.accent_color || '#0056b3');

                return (
                  <div
                    className="cart-fallback-card-face"
                    style={{
                      background: bg,
                      color: textCol,
                      borderTop: `2px solid ${accent}`,
                    }}
                  >
                    {isLuxury && (
                      <div className="cart-fallback-gold-emblem" style={{ borderColor: accent }}>
                        <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
                        <span style={{ color: accent, fontSize: '9px' }}>❖</span>
                        <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
                      </div>
                    )}
                    {item.custom_company && (
                      <div className="cart-fallback-company" style={{ color: accent }}>
                        {item.custom_company}
                      </div>
                    )}
                    {item.custom_name && (
                      <div className="cart-fallback-name" style={{ color: textCol }}>
                        {item.custom_name}
                      </div>
                    )}
                    {item.custom_title && (
                      <div className="cart-fallback-title" style={{ color: isLuxury ? '#e2d59f' : '#64748b' }}>
                        {item.custom_title}
                      </div>
                    )}
                  </div>
                );
              })()
            )
          ) : (
            backSrc ? (
              <img
                src={backSrc}
                alt="Card Back"
                className="cart-card-rendered-img"
              />
            ) : (
              <div
                className="cart-fallback-card-face back-face"
                style={{
                  background: (item.template_name || '').toLowerCase().includes('luxury') ? '#09090b' : '#f8fafc',
                  borderTop: `2px solid ${item.accent_color || '#0056b3'}`,
                }}
              >
                <div
                  className="cart-back-circle"
                  style={{ background: (item.template_name || '').toLowerCase().includes('luxury') ? '#d4af37' : (item.accent_color || '#0056b3') }}
                >
                  {(item.custom_company || item.template_name || 'V').trim().charAt(0).toUpperCase()}
                </div>
                {item.custom_company && (
                  <div
                    className="cart-back-brand"
                    style={{ color: (item.template_name || '').toLowerCase().includes('luxury') ? '#d4af37' : '#334155' }}
                  >
                    {item.custom_company}
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* Hand overlay gently holding the right edge */}
        <img
          src="/mockup_hand_overlay.png"
          alt="Hand holding card"
          className="cart-hand-overlay-img"
        />
      </div>

      {/* Front / Back Pagination dots */}
      <div className="cart-mockup-dots" role="tablist" aria-label="Toggle card front and back">
        <button
          type="button"
          className={`cart-mockup-dot ${activeSide === 'front' ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setActiveSide('front');
          }}
          title="Front Side"
          aria-label="View front"
        />
        <button
          type="button"
          className={`cart-mockup-dot ${activeSide === 'back' ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setActiveSide('back');
          }}
          title="Back Side"
          aria-label="View back"
        />
      </div>
    </div>
  );
}

export default function CartPage({
  cartData,
  onRemoveItem,
  onCheckoutSuccess,
  onNavigateHome,
  onNavigateVisitingCards,
}) {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState({
    code: 'PROMO15',
    discount_percent: 15,
    message: '15% discount applied across all visiting cards.'
  });
  const [isChangingPromo, setIsChangingPromo] = useState(false);
  const [promoMsg, setPromoMsg] = useState({
    text: '15% discount applied across all visiting cards.',
    isError: false
  });
  const [showOfferDetails, setShowOfferDetails] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackOrderNumber, setTrackOrderNumber] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [inlineTrackingActive, setInlineTrackingActive] = useState(false);

  // Sync latest cart data on mount
  useEffect(() => {
    if (onCheckoutSuccess) {
      onCheckoutSuccess();
    }
  }, []);

  // Quick promo chips that can be clicked to apply instantly
  const popularPromos = [
    { code: 'PROMO15', label: '15% OFF', desc: 'Site-wide Discount' },
    { code: 'SAVE10', label: '10% OFF', desc: 'Orders 200+ cards' },
    { code: 'FREESHIP', label: 'Free Courier', desc: 'Priority Air shipping' },
    { code: 'ASAPVIP', label: '20% OFF', desc: 'Corporate Bulk orders' },
  ];

  const subtotal = cartData?.subtotal || 0;
  const discountAmount = appliedPromo ? (subtotal * (appliedPromo.discount_percent || 0)) / 100 : 0;
  const shippingFee = subtotal >= 500 || subtotal === 0 || appliedPromo?.freeShipping ? 0 : 50;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromoCode = async (codeToApply) => {
    const targetCode = (codeToApply || promoInput).trim().toUpperCase();
    if (!targetCode) return;

    if (targetCode === 'FREESHIP') {
      setAppliedPromo({
        code: 'FREESHIP',
        discount_percent: 0,
        freeShipping: true,
        message: 'Free express shipping promo applied to your order!'
      });
      setPromoMsg({ text: 'Free Express Air Shipping applied!', isError: false });
      setIsChangingPromo(false);
      return;
    }

    const res = await validatePromoCode(targetCode, subtotal);
    if (res.valid) {
      setAppliedPromo(res);
      setPromoMsg({ text: res.message || `Code ${targetCode} applied!`, isError: false });
      setIsChangingPromo(false);
    } else {
      setPromoMsg({ text: res.message || 'Invalid promo code. Try PROMO15 or SAVE10.', isError: true });
    }
  };

  const handleQuickChipClick = (code) => {
    setPromoInput(code);
    handleApplyPromoCode(code);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderDone(true);
      if (onCheckoutSuccess) onCheckoutSuccess();
    }, 1400);
  };

  const handleTrackOrderSubmit = (e) => {
    if (e) e.preventDefault();
    const query = (trackOrderNumber || 'ASAP-9821').trim().toUpperCase();
    setTrackResult({
      orderId: query,
      status: 'In Pre-Flight Quality Check',
      stage: 2,
      estimatedDelivery: '3-4 Business Days',
      carrier: 'BlueDart Air Express',
      location: 'Bangalore Production Hub',
    });
    setInlineTrackingActive(true);
  };

  const isEmpty = !cartData || !cartData.items || cartData.items.length === 0;

  return (
    <div className="cart-page-wrapper">
      {/* 1. Modern Top Header & Breadcrumb Bar */}
      <div className="cart-top-bar">
        <nav className="cart-breadcrumbs" aria-label="Breadcrumb">
          <button type="button" onClick={onNavigateHome} className="cart-crumb-link">
            Home
          </button>
          <span className="cart-crumb-sep">/</span>
          <span className="cart-crumb-current">Shopping Cart</span>
        </nav>

        <div className="cart-items-counter-pill">
          <ShoppingBag size={14} />
          <span>{isEmpty ? '0 Items in Cart' : `${cartData.items.length} ${cartData.items.length === 1 ? 'Item' : 'Items'}`}</span>
        </div>
      </div>

      {/* ================= ORDER SUCCESS STATE ================= */}
      {orderDone ? (
        <div className="cart-success-card">
          <div className="cart-success-icon-wrap">
            <CheckCircle2 size={48} color="#16a34a" />
          </div>
          <h2 className="cart-success-title">Order Placed Successfully!</h2>
          <p className="cart-success-desc">
            Thank you for ordering with ASAP Visiting Cards. Your order has been placed into pre-flight HD review and will be printed promptly.
          </p>
          <div className="cart-success-meta-box">
            <div>Order Reference: <strong>#ASAP-{Math.floor(100000 + Math.random() * 900000)}</strong></div>
            <div>Estimated Dispatch: <strong>Within 24-48 Hours</strong></div>
          </div>
          <button
            type="button"
            className="cart-shop-more-btn"
            onClick={() => {
              setOrderDone(false);
              if (onNavigateVisitingCards) onNavigateVisitingCards();
            }}
          >
            Continue Shopping
          </button>
        </div>
      ) : isEmpty ? (
        /* ================= 2. EMPTY CART VIEW (ASYMMETRIC LUXE SPLIT LAYOUT) ================= */
        <div className="cart-empty-view-container">
          {/* Main Asymmetric Split Layout: Left Spotlight (60%) + Right Action Hub (40%) */}
          <div className="cart-hero-split-grid">
            {/* LEFT COLUMN: Premium Spotlight Hero Card */}
            <div className="cart-spotlight-hero">
              <div className="cart-spotlight-top-badge">
                <Sparkles size={13} color="#0099ff" />
                <span>PREMIUM VISITING CARDS & PRINTING</span>
              </div>

              <div className="cart-spotlight-content">
                <div className="cart-spotlight-text">
                  <h1 className="cart-spotlight-title">
                    Your shopping cart is currently empty.
                  </h1>
                  <p className="cart-spotlight-desc">
                    Ready to leave a lasting impression? Create high-definition business cards with 350 GSM paper, raised spot UV, metallic gold foils, and precision corner cuts.
                  </p>

                  <div className="cart-spotlight-actions">
                    <button
                      type="button"
                      className="cart-primary-cta"
                      onClick={onNavigateVisitingCards}
                    >
                      <span>Explore Visiting Cards</span>
                      <ArrowRight size={16} />
                    </button>

                    <button
                      type="button"
                      className="cart-secondary-cta"
                      onClick={() => {
                        window.location.hash = '#studio/standard';
                      }}
                    >
                      <Palette size={16} />
                      <span>Open 3D Studio</span>
                    </button>
                  </div>

                  <div className="cart-spotlight-perks">
                    <div className="cart-perk-pill">
                      <CheckCircle2 size={13} color="#16a34a" />
                      <span>Free Pre-Flight Bleed Check</span>
                    </div>
                    <div className="cart-perk-pill">
                      <CheckCircle2 size={13} color="#16a34a" />
                      <span>Fast Air Dispatch</span>
                    </div>
                    <div className="cart-perk-pill">
                      <CheckCircle2 size={13} color="#16a34a" />
                      <span>GST Tax Invoicing</span>
                    </div>
                  </div>
                </div>

                <div className="cart-spotlight-visual">
                  <KraftBagIllustration />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Smart Hub (Stacked Action Widgets) */}
            <div className="cart-smart-hub">
              {/* Widget 1: Account / Sign In */}
              <div className="cart-hub-card card-account">
                <div className="cart-hub-header">
                  <div className="cart-hub-icon-pill blue">
                    <User size={18} />
                  </div>
                  <div className="cart-hub-title-wrap">
                    <h3>Saved Projects & Account</h3>
                    <p>Access your saved drafts, logos and previous print orders.</p>
                  </div>
                </div>

                <div className="cart-hub-body">
                  <button
                    type="button"
                    className="cart-hub-action-btn"
                    onClick={() => setShowSignInModal(true)}
                  >
                    <LogIn size={14} />
                    <span>Sign In or Register</span>
                    <ArrowRight size={13} className="hub-arrow" />
                  </button>
                </div>
              </div>

              {/* Widget 2: Order Tracker */}
              <div className="cart-hub-card card-tracking">
                <div className="cart-hub-header">
                  <div className="cart-hub-icon-pill purple">
                    <Package size={18} />
                  </div>
                  <div className="cart-hub-title-wrap">
                    <h3>Track an Order</h3>
                    <p>Check live printing progress, quality proofing, and courier dispatch.</p>
                  </div>
                </div>

                <div className="cart-hub-body">
                  {inlineTrackingActive && trackResult ? (
                    <div className="cart-live-tracking-widget">
                      <div className="cart-track-top-row">
                        <span className="track-order-tag">{trackResult.orderId}</span>
                        <span className="track-status-badge">Live Status</span>
                      </div>
                      <div className="cart-track-status-line">
                        <Clock size={13} color="#0284c7" />
                        <strong>{trackResult.status}</strong>
                      </div>
                      <div className="cart-track-details-row">
                        <span>Courier: {trackResult.carrier}</span>
                        <span>Est: {trackResult.estimatedDelivery}</span>
                      </div>
                      <button
                        type="button"
                        className="cart-track-reset-btn"
                        onClick={() => setInlineTrackingActive(false)}
                      >
                        Reset Tracking
                      </button>
                    </div>
                  ) : (
                    <div className="cart-hub-input-row">
                      <input
                        type="text"
                        placeholder="Enter Order # (e.g. ASAP-9821)"
                        value={trackOrderNumber}
                        onChange={(e) => setTrackOrderNumber(e.target.value)}
                        className="cart-hub-text-input"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleTrackOrderSubmit();
                        }}
                      />
                      <button
                        type="button"
                        className="cart-hub-mini-btn"
                        onClick={() => handleTrackOrderSubmit()}
                      >
                        <Search size={14} />
                      </button>
                    </div>
                  )}

                  {!inlineTrackingActive && (
                    <button
                      type="button"
                      className="cart-hub-demo-link"
                      onClick={() => handleTrackOrderSubmit()}
                    >
                      Or view sample tracking preview (#ASAP-9821) →
                    </button>
                  )}
                </div>
              </div>

              {/* Widget 3: Promo Codes & Coupons */}
              <div className="cart-hub-card card-promos">
                <div className="cart-hub-header">
                  <div className="cart-hub-icon-pill emerald">
                    <Tag size={18} />
                  </div>
                  <div className="cart-hub-title-wrap">
                    <div className="cart-promo-title-row">
                      <h3>Coupons & Offers</h3>
                      {appliedPromo && (
                        <span className="cart-active-promo-tag">
                          <Check size={11} /> {appliedPromo.code}
                        </span>
                      )}
                    </div>
                    <p>Click any coupon to auto-apply instant discount.</p>
                  </div>
                </div>

                <div className="cart-hub-body">
                  <div className="cart-promo-chips-cluster">
                    {popularPromos.map((p) => {
                      const isActive = appliedPromo?.code === p.code;
                      return (
                        <button
                          key={p.code}
                          type="button"
                          className={`cart-promo-chip-btn ${isActive ? 'active' : ''}`}
                          onClick={() => handleQuickChipClick(p.code)}
                        >
                          <Sparkles size={11} className="chip-sparkle-icon" />
                          <strong>{p.code}</strong>
                          <span className="chip-badge">{p.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="cart-promo-footer-row">
                    <button
                      type="button"
                      className="cart-custom-code-toggle"
                      onClick={() => setIsChangingPromo(!isChangingPromo)}
                    >
                      {isChangingPromo ? 'Hide custom code' : 'Have a custom code?'}
                      {isChangingPromo ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>

                    <button
                      type="button"
                      className="cart-offer-details-link"
                      onClick={() => setShowOfferDetails(true)}
                    >
                      Offer terms
                    </button>
                  </div>

                  {isChangingPromo && (
                    <div className="cart-custom-code-box">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        className="cart-hub-text-input"
                      />
                      <button
                        type="button"
                        className="cart-hub-apply-btn"
                        onClick={() => handleApplyPromoCode()}
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {promoMsg.text && (
                    <div className={`cart-promo-alert-pill ${promoMsg.isError ? 'error' : 'success'}`}>
                      {promoMsg.isError ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                      <span>{promoMsg.text}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ================= 4-CARD TRENDING SUBSTRATES & STYLES SHOWCASE ================= */}
          <div className="cart-styles-showcase-section">
            <div className="cart-showcase-header">
              <div>
                <span className="cart-showcase-kicker">CUSTOMIZE IN SECONDS</span>
                <h2 className="cart-showcase-title">Popular Visiting Card Styles</h2>
              </div>
              <button
                type="button"
                className="cart-view-all-link-btn"
                onClick={onNavigateVisitingCards}
              >
                <span>View All 8 Substrates</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="cart-styles-grid">
              {/* Style 1: Standard Matte */}
              <div
                className="cart-style-card"
                onClick={() => {
                  window.location.hash = '#studio/standard';
                }}
              >
                <div className="cart-style-preview matte-bg">
                  <span className="cart-style-badge">Bestseller</span>
                  <div className="cart-card-mockup-flat">
                    <div className="mockup-header-line" />
                    <div className="mockup-name-line">Standard 350 GSM</div>
                    <div className="mockup-role-line">Matte / Gloss Coated</div>
                  </div>
                </div>
                <div className="cart-style-info">
                  <div className="cart-style-name-row">
                    <h3>Standard Matte Cards</h3>
                    <span className="cart-style-price">₹200 / 100 pcs</span>
                  </div>
                  <p>Smooth, glare-free finish on high-density 350 GSM cardstock.</p>
                  <div className="cart-style-cta-row">
                    <span className="cart-style-cta-link">
                      Customize in Studio <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Style 2: Spot UV & Foil */}
              <div
                className="cart-style-card"
                onClick={() => {
                  window.location.hash = '#studio/spot-uv';
                }}
              >
                <div className="cart-style-preview luxury-bg">
                  <span className="cart-style-badge gold">Premium 3D</span>
                  <div className="cart-card-mockup-flat gold-border">
                    <div className="mockup-header-line gold" />
                    <div className="mockup-name-line gold-text">Spot UV & Foil</div>
                    <div className="mockup-role-line">Raised Dimensional Gloss</div>
                  </div>
                </div>
                <div className="cart-style-info">
                  <div className="cart-style-name-row">
                    <h3>Raised Spot UV & Foil</h3>
                    <span className="cart-style-price">₹480 / 100 pcs</span>
                  </div>
                  <p>Glossy raised tactile elements that catch the light vividly.</p>
                  <div className="cart-style-cta-row">
                    <span className="cart-style-cta-link">
                      Customize in Studio <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Style 3: Rounded Corners */}
              <div
                className="cart-style-card"
                onClick={() => {
                  window.location.hash = '#studio/rounded-corner';
                }}
              >
                <div className="cart-style-preview rounded-bg">
                  <span className="cart-style-badge cyan">Modern Cut</span>
                  <div className="cart-card-mockup-flat round-shape">
                    <div className="mockup-header-line cyan" />
                    <div className="mockup-name-line">Rounded Corners</div>
                    <div className="mockup-role-line">6mm Die-Cut Radius</div>
                  </div>
                </div>
                <div className="cart-style-info">
                  <div className="cart-style-name-row">
                    <h3>Rounded Corner Cards</h3>
                    <span className="cart-style-price">₹260 / 100 pcs</span>
                  </div>
                  <p>Curved edges prevent pocket fraying and feel ultra modern.</p>
                  <div className="cart-style-cta-row">
                    <span className="cart-style-cta-link">
                      Customize in Studio <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Style 4: Kraft Organic */}
              <div
                className="cart-style-card"
                onClick={() => {
                  window.location.hash = '#studio/kraft';
                }}
              >
                <div className="cart-style-preview kraft-bg">
                  <span className="cart-style-badge earthy">Eco Friendly</span>
                  <div className="cart-card-mockup-flat kraft-shape">
                    <div className="mockup-header-line kraft" />
                    <div className="mockup-name-line">Kraft Organic</div>
                    <div className="mockup-role-line">300 GSM Natural Fiber</div>
                  </div>
                </div>
                <div className="cart-style-info">
                  <div className="cart-style-name-row">
                    <h3>Kraft Paper Cards</h3>
                    <span className="cart-style-price">₹280 / 100 pcs</span>
                  </div>
                  <p>Natural earthy texture with visible organic fibers and warmth.</p>
                  <div className="cart-style-cta-row">
                    <span className="cart-style-cta-link">
                      Customize in Studio <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= BOTTOM TRUST STRIP ================= */}
          <div className="cart-assurance-banner">
            <div className="cart-assurance-col">
              <div className="assurance-icon-box">
                <ShieldCheck size={22} color="#0099ff" />
              </div>
              <div className="assurance-text">
                <strong>100% Satisfaction Guarantee</strong>
                <p>Delighted with your print or we reprint free</p>
              </div>
            </div>

            <div className="cart-assurance-col">
              <div className="assurance-icon-box">
                <FileCheck size={22} color="#0099ff" />
              </div>
              <div className="assurance-text">
                <strong>Free Pre-Flight Bleed Check</strong>
                <p>Automated vector resolution and bleed inspection</p>
              </div>
            </div>

            <div className="cart-assurance-col">
              <div className="assurance-icon-box">
                <Truck size={22} color="#0099ff" />
              </div>
              <div className="assurance-text">
                <strong>Priority Air Express Courier</strong>
                <p>Dispatched safely across 19,000+ pin codes in India</p>
              </div>
            </div>

            <div className="cart-assurance-col">
              <div className="assurance-icon-box">
                <CheckCircle2 size={22} color="#0099ff" />
              </div>
              <div className="assurance-text">
                <strong>GST Compliant Invoicing</strong>
                <p>Instant official tax invoice for business expense credit</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= 3. FILLED CART VIEW (2-COLUMN SUMMARY) ================= */
        <div className="cart-filled-layout">
          {/* Left Column: Items List */}
          <div className="cart-items-column">
            <div className="cart-items-header">
              <h2>Your Cart ({cartData.items.length} {cartData.items.length === 1 ? 'item' : 'items'})</h2>
              <button
                type="button"
                className="cart-continue-link"
                onClick={onNavigateVisitingCards}
              >
                + Add more cards
              </button>
            </div>

            <div className="cart-items-list">
              {cartData.items.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <CartItemMockup item={item} />

                  <div className="cart-item-details">
                    <h3 className="cart-item-title">{item.card_title}</h3>
                    <div className="cart-item-specs">
                      <span>Quantity: <strong>{item.quantity} units</strong></span>
                      <span>•</span>
                      <span>Finish: <strong>{item.finish || 'Matte'}</strong></span>
                      <span>•</span>
                      <span>Corners: <strong>{item.corner_style || 'Standard Square'}</strong></span>
                    </div>

                    {item.custom_name && (
                      <div className="cart-item-printed-name">
                        Personalized Name: <strong>{item.custom_name}</strong>
                      </div>
                    )}

                    <div className="cart-item-actions-row">
                      <button
                        type="button"
                        className="cart-item-remove-btn"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-pricing">
                    <div className="cart-item-unit-price">₹{Number(item.unit_price || 2.0).toFixed(2)} / card</div>
                    <div className="cart-item-total-price">₹{Number(item.total_price || 200).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="cart-shop-more-btn"
              onClick={onNavigateVisitingCards}
            >
              ← Continue Shopping
            </button>
          </div>

          {/* Right Column: Order Summary */}
          <div className="cart-summary-column">
            <div className="cart-summary-card">
              <h3 className="cart-summary-title">Order Summary</h3>

              {/* Promo Code Box */}
              <div className="cart-summary-promo-section">
                <div className="cart-summary-promo-row">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="cart-summary-promo-input"
                  />
                  <button
                    type="button"
                    className="cart-summary-promo-btn"
                    onClick={() => handleApplyPromoCode()}
                  >
                    Apply
                  </button>
                </div>

                {/* Popular clickable chip shortcuts */}
                <div className="cart-summary-promo-chips">
                  {popularPromos.slice(0, 2).map((p) => (
                    <button
                      key={p.code}
                      type="button"
                      className="cart-summary-chip"
                      onClick={() => handleQuickChipClick(p.code)}
                    >
                      {p.code} ({p.label})
                    </button>
                  ))}
                </div>

                {appliedPromo && (
                  <div className="cart-summary-promo-success">
                    <CheckCircle2 size={14} color="#16a34a" />
                    <span>{appliedPromo.message || `Code ${appliedPromo.code} applied!`}</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="cart-breakdown-list">
                <div className="cart-breakdown-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="cart-breakdown-row discount">
                    <span>Discount ({appliedPromo?.discount_percent}%)</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="cart-breakdown-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Standard Air Shipping
                    {shippingFee === 0 && <span className="free-shipping-tag">FREE</span>}
                  </span>
                  <span>{shippingFee === 0 ? '₹0.00' : `₹${shippingFee.toFixed(2)}`}</span>
                </div>

                <div className="cart-breakdown-divider" />

                <div className="cart-breakdown-row total">
                  <span>Estimated Total (incl. GST)</span>
                  <span className="total-amount">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                className="cart-checkout-btn"
                disabled={isCheckingOut}
                onClick={handleCheckout}
              >
                {isCheckingOut ? (
                  <span>Processing Pre-Flight Order...</span>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="cart-safe-checkout-note">
                <ShieldCheck size={14} color="#16a34a" />
                <span>100% Secure Checkout with Razorpay / UPI / Cards</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SIGN IN ================= */}
      {showSignInModal && (
        <div className="cart-modal-backdrop" onClick={() => setShowSignInModal(false)}>
          <div className="cart-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cart-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="cart-card-icon-badge blue" style={{ width: '36px', height: '36px' }}>
                  <User size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#002c5f', fontWeight: 800 }}>
                  Sign In or Create Account
                </h3>
              </div>
              <button
                type="button"
                className="cart-modal-close"
                onClick={() => setShowSignInModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="cart-modal-body">
              <p style={{ color: '#475569', fontSize: '0.88rem', margin: '0 0 20px 0' }}>
                Sign in to save your visiting card designs, track live print orders, and download official GST tax invoices.
              </p>
              <div className="cart-modal-field">
                <label>Email Address / Phone Number</label>
                <input type="text" placeholder="name@company.com" defaultValue="guest@asapcards.in" />
              </div>
              <div className="cart-modal-field">
                <label>Password</label>
                <input type="password" placeholder="••••••••" defaultValue="demo12345" />
              </div>
              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
                onClick={() => {
                  alert('Signed in successfully as Demo User!');
                  setShowSignInModal(false);
                }}
              >
                Continue to My Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: OFFER DETAILS ================= */}
      {showOfferDetails && (
        <div className="cart-modal-backdrop" onClick={() => setShowOfferDetails(false)}>
          <div className="cart-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cart-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="cart-card-icon-badge emerald" style={{ width: '36px', height: '36px' }}>
                  <Sparkles size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#002c5f', fontWeight: 800 }}>
                  Active Promotional Offers
                </h3>
              </div>
              <button
                type="button"
                className="cart-modal-close"
                onClick={() => setShowOfferDetails(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="cart-modal-body">
              <div className="cart-offer-list">
                <div className="cart-offer-item">
                  <div className="cart-offer-code">PROMO15</div>
                  <div className="cart-offer-desc">
                    <strong>15% Off Your Entire Order</strong>
                    <p>Valid on all Standard, Spot UV, and Rounded Corner Visiting Cards.</p>
                  </div>
                </div>
                <div className="cart-offer-item">
                  <div className="cart-offer-code">SAVE10</div>
                  <div className="cart-offer-desc">
                    <strong>Flat 10% Discount</strong>
                    <p>Applies to orders of 200+ cards.</p>
                  </div>
                </div>
                <div className="cart-offer-item">
                  <div className="cart-offer-code">FREESHIP</div>
                  <div className="cart-offer-desc">
                    <strong>Free Priority Air Courier</strong>
                    <p>No delivery fee on all orders exceeding ₹499 across India.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
