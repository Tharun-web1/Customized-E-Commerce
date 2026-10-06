import React, { useState, useEffect } from 'react';
import Topbar from './components/Topbar';
import Header from './components/Header';
import Navbar from './components/Navbar';

import HeroSection from './components/HeroSection';
import TrustStrip from './components/TrustStrip';
import CategoryGrid from './components/CategoryGrid';
import VistaprintDesignStudio from './components/design-studio';
import IndustryTemplates from './components/IndustryTemplates';
import ReviewsSection from './components/ReviewsSection';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import SapNavbar from './components/home/SapNavbar';
import SapFooter from './components/home/SapFooter';
import SapHomePage from './pages/SapHomePage';
import VisitingCardsPage from './components/VisitingCardsPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ProductDetailPage from './components/ProductDetailPage';
import BrowseDesignsPage from './components/BrowseDesignsPage';
import CartPage from './components/CartPage';
import { fetchCards, fetchCategories, fetchTemplates, getCart, addToCart, removeCartItem } from './api';

// In-memory cache for uploaded custom artwork transfers across hash navigations
let cachedUploadTransfer = null;

export default function App() {
  const [cards, setCards] = useState(() => {
    try {
      const cached = sessionStorage.getItem('vp_cards_cache') || localStorage.getItem('vp_cards_cache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [categories, setCategories] = useState(() => {
    try {
      const cached = sessionStorage.getItem('vp_categories_cache') || localStorage.getItem('vp_categories_cache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [templates, setTemplates] = useState(() => {
    try {
      const cached = sessionStorage.getItem('vp_templates_cache') || localStorage.getItem('vp_templates_cache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [cartData, setCartData] = useState({ items: [], count: 0, subtotal: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'visiting-cards' | 'product-detail' | 'templates' | 'studio' | 'admin'

  const getFallbackCard = (slug) => {
    const formattedTitle = slug
      ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + (slug.includes('card') || slug.includes('holder') ? '' : ' Visiting Cards')
      : 'Standard Visiting Cards';
    return {
      title: formattedTitle,
      slug: slug || 'standard',
      base_price_100: slug === 'classic' ? 230.0 : (slug === 'custom-shape' ? 300.0 : 200.0),
      min_quantity: 100,
      gsm: '350 GSM',
      finish_type: 'Matte / Glossy',
      rating: 4.5,
      reviews_count: 240,
      dimensions: '8.9 cm x 5.1 cm',
      description: `Personalized ${formattedTitle} with a professional look. High-definition precision printing on premium quality paper.`,
    };
  };

  // Hash-based routing to allow fresh pages and full browser Back / Forward support
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || '';

      if (hash === '#admin') {
        setCurrentPage('admin');
        window.scrollTo(0, 0);
      } else if (hash === '#cart') {
        refreshCart();
        setCurrentPage('cart');
        window.scrollTo(0, 0);
      } else if (hash.startsWith('#studio/')) {
        // Dedicated Fresh Edit Studio Page: #studio/:slug?template=id&orientation=...
        const pathAndQuery = hash.replace('#studio/', '');
        const [slugPart, queryPart] = pathAndQuery.split('?');
        const queryParams = new URLSearchParams(queryPart || '');

        const isUploadMode = queryParams.get('mode') === 'upload' || queryParams.get('uploaded') === 'true';
        const foundCard = cards.find(c => c.slug === slugPart) || getFallbackCard(slugPart);
        const templateId = queryParams.get('template');
        const orientation = queryParams.get('orientation');
        const qty = queryParams.get('qty');

        let foundTemplate = null;
        if (!isUploadMode) {
          if (templateId) {
            foundTemplate = templates.find(t => String(t.id) === String(templateId)) || null;
            if (!foundTemplate) {
              try {
                const cachedActive = JSON.parse(sessionStorage.getItem('vp_active_studio_template') || 'null');
                if (cachedActive && String(cachedActive.id) === String(templateId)) {
                  foundTemplate = cachedActive;
                }
              } catch (e) {}
            }
          } else {
            try {
              const cachedActive = JSON.parse(sessionStorage.getItem('vp_active_studio_template') || 'null');
              if (cachedActive) foundTemplate = cachedActive;
            } catch (e) {}
            if (!foundTemplate && templates.length > 0) {
              foundTemplate = templates[0];
            }
          }
        }

        if (foundTemplate) {
          try {
            sessionStorage.setItem('vp_active_studio_template', JSON.stringify(foundTemplate));
          } catch (e) {}
        }

        const hasArtwork = Boolean(foundTemplate && (foundTemplate.background_image || foundTemplate.layout_type === 'image_template'));
        const isEditableTemplate = !hasArtwork && foundTemplate && (
          foundTemplate.layout_type === 'executive_swoosh' ||
          foundTemplate.layout_type === 'corporate_split_swoosh' ||
          ['classic_photo', 'luxury_black_gold', 'corporate_red_ribbon', 'modern_geometric', 'medical_care'].includes(foundTemplate.layout_type || foundTemplate.preview_style) ||
          foundTemplate.text_positions?.hasLayout
        );

        setSelectedCard((prev) => ({
          ...foundCard,
          ...(prev && prev.slug === slugPart ? prev : {}),
          isCustomUpload: isUploadMode || hasArtwork || Boolean(cachedUploadTransfer || (prev && prev.uploadedArtwork && !foundTemplate)),
          orientation: orientation || (foundTemplate && foundTemplate.orientation) || (prev && prev.orientation) || 'horizontal',
          quantity: qty ? Number(qty) : (prev && prev.quantity) || 100,
          uploadedArtwork: isUploadMode ? (cachedUploadTransfer || (prev && prev.uploadedArtwork) || null) : (hasArtwork ? (foundTemplate.background_image || null) : (isEditableTemplate ? null : ((foundTemplate && foundTemplate.background_image) || null))),
          uploadedFrontArtwork: isUploadMode ? (prev && prev.uploadedFrontArtwork || null) : (hasArtwork ? (foundTemplate.background_image || null) : (isEditableTemplate ? null : ((foundTemplate && foundTemplate.background_image) || null))),
          uploadedBackArtwork: isUploadMode ? (prev && prev.uploadedBackArtwork || null) : (hasArtwork ? (foundTemplate.back_background_image || null) : (isEditableTemplate ? null : ((foundTemplate && foundTemplate.back_background_image) || null))),
        }));
        setSelectedTemplate(foundTemplate);
        setCurrentPage('studio');
        window.scrollTo(0, 0);
      } else if (hash.startsWith('#templates/')) {
        // Dedicated Fresh Browse Designs Page: #templates/:slug
        const slug = hash.replace('#templates/', '');
        const found = cards.find(c => c.slug === slug) || getFallbackCard(slug);
        setSelectedCard(found);
        setCurrentPage('templates');
        window.scrollTo(0, 0);
      } else if (hash.startsWith('#product/')) {
        // Dedicated Fresh Product Detail Page: #product/:slug
        const slug = hash.replace('#product/', '');
        const found = cards.find(c => c.slug === slug) || getFallbackCard(slug);
        setSelectedCard(found);
        setCurrentPage('product-detail');
        window.scrollTo(0, 0);
      } else if (hash === '#visiting-cards') {
        setCurrentPage('visiting-cards');
        window.scrollTo(0, 0);
      } else {
        setCurrentPage('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [cards, templates]);

  // Reload all catalog data from server
  const refreshCatalogData = async () => {
    setIsLoading(true);
    const [cardsData, categoriesData, templatesData, cartRes] = await Promise.all([
      fetchCards(),
      fetchCategories(),
      fetchTemplates(),
      getCart(),
    ]);
    try {
      if (cardsData?.length > 0) {
        sessionStorage.setItem('vp_cards_cache', JSON.stringify(cardsData));
        localStorage.setItem('vp_cards_cache', JSON.stringify(cardsData));
      }
      if (categoriesData?.length > 0) {
        sessionStorage.setItem('vp_categories_cache', JSON.stringify(categoriesData));
        localStorage.setItem('vp_categories_cache', JSON.stringify(categoriesData));
      }
      if (templatesData?.length > 0) {
        sessionStorage.setItem('vp_templates_cache', JSON.stringify(templatesData));
        localStorage.setItem('vp_templates_cache', JSON.stringify(templatesData));
      }
    } catch (e) {}

    setCards(cardsData);
    setCategories(categoriesData);
    setTemplates(templatesData);
    setCartData(cartRes);
    if (cardsData.length > 0) {
      setSelectedCard(prev => prev ? (cardsData.find(c => c.slug === prev.slug) || cardsData[0]) : cardsData[0]);
    }
    setIsLoading(false);
  };

  // Load initial catalog data from Django REST API
  useEffect(() => {
    refreshCatalogData();
  }, []);

  // Navigation helpers that update browser history smoothly
  const navigateToAdmin = () => {
    window.location.hash = '#admin';
    window.scrollTo(0, 0);
  };

  const navigateToProductDetail = (card) => {
    setSelectedCard(card);
    window.location.hash = `#product/${card?.slug || 'standard'}`;
    window.scrollTo(0, 0);
  };

  const navigateToTemplates = (card) => {
    const targetCard = card || selectedCard || cards[0] || getFallbackCard('standard');
    setSelectedCard(targetCard);
    window.location.hash = `#templates/${targetCard.slug || 'standard'}`;
    window.scrollTo(0, 0);
  };

  const navigateToStudio = (card, template, extra = {}) => {
    const targetCard = card || selectedCard || cards[0] || getFallbackCard('standard');
    const isUploadMode = Boolean(extra.isCustomUpload || extra.uploadedArtwork || targetCard.uploadedArtwork);
    const targetTpl = isUploadMode ? null : (template || selectedTemplate || templates[0]);
    const orientation = extra.orientation || targetCard.orientation || targetTpl?.orientation || 'horizontal';
    const quantity = extra.quantity || targetCard.quantity || 100;

    if (extra.uploadedArtwork) {
      cachedUploadTransfer = extra.uploadedArtwork;
    }

    setSelectedCard({
      ...targetCard,
      ...extra,
      isCustomUpload: isUploadMode,
      orientation,
      quantity,
    });
    setSelectedTemplate(targetTpl);

    const params = new URLSearchParams();
    if (isUploadMode) {
      params.append('mode', 'upload');
    } else if (targetTpl?.id) {
      params.append('template', targetTpl.id);
    }
    if (orientation) params.append('orientation', orientation);
    if (quantity) params.append('qty', quantity);

    const hashStr = `#studio/${targetCard.slug || 'standard'}${params.toString() ? '?' + params.toString() : ''}`;
    window.location.hash = hashStr;
    window.scrollTo(0, 0);
  };

  const handleCloseStudio = () => {
    // Return gracefully using browser history, or fallback to product detail page
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateToProductDetail(selectedCard || cards[0]);
    }
  };

  const navigateToVisitingCards = () => {
    window.location.hash = '#visiting-cards';
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    window.location.hash = '';
    window.scrollTo(0, 0);
  };

  const navigateToCart = () => {
    setCurrentPage('cart');
    window.location.hash = '#cart';
    window.scrollTo(0, 0);
  };

  // Refresh cart from server
  const refreshCart = async () => {
    const updated = await getCart();
    setCartData(updated);
    return updated;
  };

  // Card selection from mega dropdown, catalog grid or search
  const handleSelectCardSlug = (slug) => {
    const found = cards.find(c => c.slug === slug || (slug === 'engraved-metal-holder' && c.category_group === 'holders'));
    if (found) {
      navigateToProductDetail(found);
    } else {
      navigateToProductDetail(getFallbackCard(slug));
    }
  };

  const handleSelectCard = (card) => {
    navigateToProductDetail(card);
  };

  const handleAddToCart = async (payload) => {
    try {
      await addToCart(payload);
      const fresh = await refreshCart();
      if (fresh) setCartData(fresh);
    } catch (err) {
      console.warn('Cart addition warning:', err);
    }
    navigateToCart();
  };

  const handleRemoveCartItem = async (itemId) => {
    const ok = await removeCartItem(itemId);
    if (ok) {
      await refreshCart();
    }
  };

  // Dedicated Full-Page Studio View
  if (currentPage === 'studio') {
    const queryTemplateId = new URLSearchParams((window.location.hash || '').split('?')[1] || '').get('template');
    if (queryTemplateId && !selectedTemplate && templates.length === 0) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: 42, height: 42, border: '3px solid #e2e8f0', borderTopColor: '#0056b3', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontSize: '15px', color: '#475569', fontWeight: 600, fontFamily: 'sans-serif' }}>Loading Design Studio...</p>
        </div>
      );
    }

    return (
      <div className="app-container">
        <VistaprintDesignStudio
          key={`studio_${selectedCard?.slug || 'std'}_${selectedTemplate?.id || 'tpl'}`}
          card={selectedCard}
          template={selectedTemplate}
          allCards={cards}
          allTemplates={templates}
          onClose={handleCloseStudio}
          onAddToCart={(item) => {
            handleAddToCart(item);
          }}
        />
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartData={cartData}
          onRemoveItem={handleRemoveCartItem}
          onCheckoutSuccess={() => refreshCart()}
        />
      </div>
    );
  }

  if (currentPage === 'admin') {
    return (
      <div className="admin-standalone-root">
        <AdminDashboard
          cards={cards}
          categories={categories}
          templates={templates}
          cartData={cartData}
          onClose={navigateToHome}
          onRefreshData={refreshCatalogData}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* @SAP PRINTS Header & Navigation */}
      <SapNavbar
        cartCount={cartData?.count || 0}
        onOpenCart={navigateToCart}
        onNavigateHome={navigateToHome}
        onNavigateAdmin={navigateToAdmin}
        onSelectService={(service) => {
          if (service.slug === 'visiting-cards') {
            navigateToVisitingCards();
          } else {
            navigateToVisitingCards();
          }
        }}
        cards={cards}
      />

      {/* 4. Main Content Area Switcher */}
      {currentPage === 'cart' ? (
        /* Fresh Dedicated Shopping Cart Page */
        <CartPage
          cartData={cartData}
          onRemoveItem={handleRemoveCartItem}
          onCheckoutSuccess={() => refreshCart()}
          onNavigateHome={navigateToHome}
          onNavigateVisitingCards={navigateToVisitingCards}
        />
      ) : currentPage === 'templates' ? (
        /* Fresh Dedicated Browse Designs Page (Shows All Templates for this Card) */
        <BrowseDesignsPage
          card={selectedCard}
          allTemplates={templates}
          onSelectTemplate={(configuredTpl) => {
            navigateToStudio(selectedCard, configuredTpl, {
              orientation: configuredTpl.orientation || 'horizontal',
              activeColor: configuredTpl.activeColor,
            });
          }}
          onNavigateBack={() => {
            if (selectedCard) {
              navigateToProductDetail(selectedCard);
            } else {
              navigateToVisitingCards();
            }
          }}
          onNavigateHome={navigateToHome}
        />
      ) : currentPage === 'product-detail' ? (
        /* Fresh Dedicated Product Detail Page */
        <ProductDetailPage
          card={selectedCard}
          templates={templates}
          onSelectTemplate={(tpl) => {
            navigateToStudio(selectedCard, tpl);
          }}
          onNavigateHome={navigateToHome}
          onNavigateVisitingCards={navigateToVisitingCards}
          onBrowseDesigns={(cfg) => {
            // Opens fresh page showing templates of that card
            navigateToTemplates(cfg || selectedCard);
          }}
          onUploadDesign={(cfg) => {
            // After options and upload modal: opens edit studio with orientation and artwork WITHOUT template boilerplate
            navigateToStudio(cfg, null, {
              isCustomUpload: true,
              orientation: cfg.orientation || 'horizontal',
              quantity: cfg.quantity || 100,
              uploadedArtwork: cfg.uploadedArtwork || null,
              uploadedFrontArtwork: cfg.uploadedFrontArtwork || null,
              uploadedBackArtwork: cfg.uploadedBackArtwork || null,
              corner_style: cfg.corner_style || 'standard',
            });
          }}
          onAddToCart={(cfg) => {
            handleAddToCart(cfg);
          }}
        />
      ) : currentPage === 'visiting-cards' ? (
        /* Standalone Dedicated Visiting Cards Page */
        <VisitingCardsPage
          cards={cards}
          onSelectCard={(card) => {
            navigateToProductDetail(card);
          }}
          onNavigateHome={navigateToHome}
          onBrowseTemplates={() => {
            const standardCard = cards.find(c => c.slug === 'standard') || cards[0] || getFallbackCard('standard');
            navigateToTemplates(standardCard);
          }}
          onStartDesigning={() => {
            const standardCard = cards.find(c => c.slug === 'standard') || cards[0] || getFallbackCard('standard');
            navigateToStudio(standardCard, templates[0]);
          }}
        />
      ) : (
        /* @SAP PRINTS Homepage Matching Exact Design Mockups */
        <SapHomePage
          cards={cards}
          onSelectService={(svc) => {
            if (svc.slug === 'visiting-cards') {
              navigateToVisitingCards();
            } else if (svc.slug === '3d-printing') {
              const el = document.getElementById('3d-printing-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else if (svc.slug === 'custom-printing') {
              const el = document.getElementById('custom-printing-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
              navigateToVisitingCards();
            }
          }}
          onViewAllServices={navigateToVisitingCards}
          onExploreServices={() => {
            const el = document.getElementById('services-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreOffers={() => {
            const el = document.getElementById('special-offers-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onExplore3d={() => {
            const el = document.getElementById('3d-printing-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreCustom={() => {
            const el = document.getElementById('custom-printing-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onViewGallery={() => {
            const el = document.getElementById('gallery-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* @SAP PRINTS Footer */}
      <SapFooter onNavigateHome={navigateToHome} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartData={cartData}
        onRemoveItem={handleRemoveCartItem}
        onCheckoutSuccess={() => refreshCart()}
      />
    </div>
  );
}
