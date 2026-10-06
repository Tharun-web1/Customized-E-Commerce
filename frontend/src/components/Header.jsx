import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, FolderHeart, User, ChevronDown, Package, FileCheck, HelpCircle, LogIn } from 'lucide-react';
import '../css/Header.css';

export default function Header({ cards = [], onSelectCard, onOpenCart, cartCount = 0, onNavigateHome }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const searchRef = useRef(null);
  const accountRef = useRef(null);

  const filteredCards = searchTerm.trim()
    ? cards.filter(c =>
        (c.title && c.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.gsm && c.gsm.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.finish_type && c.finish_type.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 6)
    : [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsAccountOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filteredCards.length > 0) {
      onSelectCard(filteredCards[0]);
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <header className="main-header">
      <div className="header-container">
        {/* Brand Logo */}
        <div
          className="logo-area"
          onClick={() => {
            if (onNavigateHome) onNavigateHome();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="ASAP Visiting Cards"
        >
          <img
            src="/asap-logo.jpeg"
            alt="ASAP Logo"
            className="asap-brand-logo"
          />
        </div>


        {/* Live Search Bar with Dropdown Auto-suggest */}
        <div className="search-wrapper" ref={searchRef}>
          <form className="search-input-box" onSubmit={handleSearchSubmit}>
            <Search size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Search visiting cards (e.g. Standard, Matte, Spot UV, 400 GSM)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <span>Search</span>
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && searchTerm.trim() && (
            <div className="search-dropdown">
              {filteredCards.length > 0 ? (
                filteredCards.map((item) => (
                  <div
                    key={item.id}
                    className="search-drop-item"
                    onClick={() => {
                      onSelectCard(item);
                      setIsSearchOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <div>
                      <div className="search-drop-title">{item.title}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        {item.gsm} • {item.finish_type}
                      </div>
                    </div>
                    <span className="search-drop-cat">
                      ₹{item.base_price_100} / 100 pcs
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.88rem', textAlign: 'center' }}>
                  No visiting cards found matching "<strong>{searchTerm}</strong>"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          <button
            className="header-btn"
            title="My Projects"
            onClick={() => {
              const el = document.getElementById('catalog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <FolderHeart size={18} />
            <span>My Projects</span>
          </button>

          {/* Account Dropdown */}
          <div style={{ position: 'relative' }} ref={accountRef}>
            <button
              className={`header-btn ${isAccountOpen ? 'active' : ''}`}
              title="Account Menu"
              onClick={() => setIsAccountOpen(prev => !prev)}
              aria-expanded={isAccountOpen}
              aria-haspopup="true"
            >
              <User size={18} />
              <span>Sign In</span>
              <ChevronDown
                size={14}
                style={{
                  transform: isAccountOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            {isAccountOpen && (
              <div className="account-dropdown">
                <div className="account-dropdown-header">
                  <strong>Welcome to ASAP</strong>
                  <p>Access your saved designs & order history</p>

                  <button
                    className="account-signin-btn"
                    onClick={() => setIsAccountOpen(false)}
                  >
                    <LogIn size={15} />
                    <span>Sign In / Register</span>
                  </button>
                </div>
                <ul className="account-dropdown-list">
                  <li onClick={() => setIsAccountOpen(false)}>
                    <Package size={15} color="#0099ff" />
                    <span>Track Your Order</span>
                  </li>
                  <li onClick={() => setIsAccountOpen(false)}>
                    <FileCheck size={15} color="#0099ff" />
                    <span>GST & Corporate Invoices</span>
                  </li>
                  <li onClick={() => setIsAccountOpen(false)}>
                    <HelpCircle size={15} color="#0099ff" />
                    <span>Help Center & Support</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <button className="header-btn" onClick={onOpenCart} title="Shopping Cart">
            <div className="cart-badge-wrap">
              <ShoppingBag size={20} color="#002c5f" />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
            <span>Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
}
