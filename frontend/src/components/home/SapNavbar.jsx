// src/components/home/SapNavbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Home, ChevronDown, Search, User, ShoppingCart, Menu, X, Shield } from 'lucide-react';
import logoImg from '../../assets/logo/sap_prints_logo.png';
import { navDropdowns, servicesData } from '../../data/homeData';
import './SapNavbar.css';

export default function SapNavbar({
  cartCount = 0,
  onOpenCart,
  onNavigateHome,
  onNavigateAdmin,
  onSelectService,
  cards = [],
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchContainerRef = useRef(null);
  const userMenuRef = useRef(null);

  // Live search filtering across services and cards
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const matchedServices = servicesData
      .filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
      .map((s) => ({
        id: `svc_${s.id}`,
        title: s.name,
        category: 'Printing Service',
        image: s.image,
        route: s.route,
        isService: true,
        data: s,
      }));

    const matchedCards = cards
      .filter((c) => (c.title || '').toLowerCase().includes(q))
      .slice(0, 5)
      .map((c) => ({
        id: `card_${c.id || c.slug}`,
        title: c.title,
        category: 'Visiting Card',
        image: c.image || null,
        route: `#product/${c.slug}`,
        isCard: true,
        data: c,
      }));

    const combined = [...matchedServices, ...matchedCards];
    setSearchResults(combined);
    setShowSearchResults(true);
  }, [searchQuery, cards]);

  // Handle outside clicks to close search or user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchResultClick = (item) => {
    setShowSearchResults(false);
    setSearchQuery('');
    if (item.isService && onSelectService) {
      onSelectService(item.data);
    } else {
      window.location.hash = item.route;
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleSearchResultClick(searchResults[0]);
    }
  };

  return (
    <header className="sap-header-wrapper">
      <div className="sap-header-container">
        {/* 1. Left Logo */}
        <div
          className="sap-logo-link"
          onClick={() => {
            if (onNavigateHome) onNavigateHome();
            else window.location.hash = '';
          }}
        >
          {logoImg ? (
            <img src={logoImg} alt="@SAP PRINTS" className="sap-logo-img" />
          ) : (
            <div className="sap-logo-fallback">
              <div className="sap-logo-badge">
                <span className="sap-logo-at">@</span>
                <span className="sap-logo-s">S</span>
                <span className="sap-logo-a">A</span>
                <span className="sap-logo-p">P</span>
              </div>
              <span className="sap-logo-sub">PRINTS</span>
            </div>
          )}
        </div>

        {/* 2. Center Desktop Navigation */}
        <nav className="sap-nav-menu" aria-label="Main Navigation">
          {/* Active Home Pill */}
          <div className="sap-nav-item">
            <a
              href="#"
              className="sap-nav-link active-home"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateHome) onNavigateHome();
                else window.location.hash = '';
              }}
            >
              <Home size={15} color="#ffffff" strokeWidth={2.5} />
              <span>Home</span>
            </a>
          </div>

          {/* Products Dropdown */}
          <div className="sap-nav-item">
            <button className="sap-nav-link" type="button">
              <span>Products</span>
              <ChevronDown className="sap-nav-chevron" />
            </button>
            <div className="sap-dropdown-menu">
              {navDropdowns.products.map((item, idx) => (
                <a
                  key={idx}
                  href={item.path}
                  className="sap-dropdown-item"
                  onClick={() => {
                    if (item.path === '#visiting-cards') {
                      window.location.hash = '#visiting-cards';
                    }
                  }}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* Services Dropdown */}
          <div className="sap-nav-item">
            <button className="sap-nav-link" type="button">
              <span>Services</span>
              <ChevronDown className="sap-nav-chevron" />
            </button>
            <div className="sap-dropdown-menu">
              {navDropdowns.services.map((item, idx) => (
                <a key={idx} href={item.path} className="sap-dropdown-item">
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* 3D Printing Dropdown */}
          <div className="sap-nav-item">
            <button className="sap-nav-link" type="button">
              <span>3D Printing</span>
              <ChevronDown className="sap-nav-chevron" />
            </button>
            <div className="sap-dropdown-menu">
              {navDropdowns.printing3d.map((item, idx) => (
                <a key={idx} href={item.path} className="sap-dropdown-item">
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* Offers */}
          <div className="sap-nav-item">
            <a href="#special-offers-section" className="sap-nav-link">
              <span>Offers</span>
            </a>
          </div>

          {/* About Us */}
          <div className="sap-nav-item">
            <a href="#why-choose-us-section" className="sap-nav-link">
              <span>About Us</span>
            </a>
          </div>

          {/* Contact */}
          <div className="sap-nav-item">
            <a href="#contact-footer" className="sap-nav-link">
              <span>Contact</span>
            </a>
          </div>
        </nav>

        {/* 3. Right Header Controls */}
        <div className="sap-header-right">
          {/* Working Search Bar */}
          <div className="sap-search-bar" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit}>
              <Search className="sap-search-icon" />
              <input
                type="text"
                className="sap-search-input"
                placeholder="Search for products or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim()) setShowSearchResults(true);
                }}
              />
            </form>

            {/* Instant Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="sap-search-results-panel">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="sap-search-result-item"
                    onClick={() => handleSearchResultClick(item)}
                  >
                    {item.image && (
                      <img src={item.image} alt={item.title} className="sap-search-result-thumb" />
                    )}
                    <div className="sap-search-result-info">
                      <span className="sap-search-result-title">{item.title}</span>
                      <span className="sap-search-result-category">{item.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account / User Button */}
          <div style={{ position: 'relative' }} ref={userMenuRef}>
            <button
              type="button"
              className="sap-icon-button"
              aria-label="User Account"
              onClick={() => setUserMenuOpen((prev) => !prev)}
            >
              <User size={19} />
            </button>
            {userMenuOpen && (
              <div className="sap-user-menu">
                <button
                  type="button"
                  className="sap-user-menu-item"
                  onClick={() => {
                    setUserMenuOpen(false);
                    if (onNavigateAdmin) onNavigateAdmin();
                    else window.location.hash = '#admin';
                  }}
                >
                  <Shield size={16} color="#0284c7" />
                  <span>Admin Dashboard</span>
                </button>
                <button
                  type="button"
                  className="sap-user-menu-item"
                  onClick={() => {
                    setUserMenuOpen(false);
                    if (onOpenCart) onOpenCart();
                    else window.location.hash = '#cart';
                  }}
                >
                  <ShoppingCart size={16} color="#e11d48" />
                  <span>My Cart</span>
                </button>
              </div>
            )}
          </div>

          {/* Shopping Cart Button with Dynamic Badge */}
          <button
            type="button"
            className="sap-icon-button"
            aria-label="Shopping Cart"
            onClick={() => {
              if (onOpenCart) onOpenCart();
              else window.location.hash = '#cart';
            }}
          >
            <ShoppingCart size={19} />
            <span className="sap-cart-badge">{cartCount || 0}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="sap-mobile-toggle"
            aria-label="Toggle mobile menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide Drawer */}
      <div className={`sap-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sap-mobile-drawer-content">
          <ul className="sap-mobile-nav-list">
            <li>
              <a
                href="#"
                className="sap-mobile-nav-link active-home"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigateHome) onNavigateHome();
                  else window.location.hash = '';
                }}
              >
                <span>Home</span>
              </a>
            </li>
            <li>
              <a
                href="#visiting-cards"
                className="sap-mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Visiting Cards</span>
              </a>
            </li>
            <li>
              <a
                href="#services-section"
                className="sap-mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>All Services</span>
              </a>
            </li>
            <li>
              <a
                href="#3d-printing-section"
                className="sap-mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>3D Printing</span>
              </a>
            </li>
            <li>
              <a
                href="#special-offers-section"
                className="sap-mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Special Offers</span>
              </a>
            </li>
            <li>
              <a
                href="#why-choose-us-section"
                className="sap-mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>About Us</span>
              </a>
            </li>
            <li>
              <a
                href="#contact-footer"
                className="sap-mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Contact</span>
              </a>
            </li>
            <li>
              <button
                type="button"
                className="sap-mobile-nav-link"
                style={{ width: '100%', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigateAdmin) onNavigateAdmin();
                  else window.location.hash = '#admin';
                }}
              >
                <span>Admin Dashboard</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
