import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  CreditCard,
} from 'lucide-react';
import MegaDropdown from './MegaDropdown';
import '../css/Navbar.css';

export default function Navbar({ onSelectCardSlug, onSelectTab, activePage = 'home' }) {
  // activeDropdown holds the id of the currently open dropdown ('cards', or null)
  const [activeDropdown, setActiveDropdown] = useState(null);
  const timeoutRef = useRef(null);
  const navContainerRef = useRef(null);

  const navTabs = [
    { id: 'cards', label: 'Visiting Cards', icon: <CreditCard size={17} color="#0099ff" /> },
  ];


  // Hover over a tab opens that dropdown immediately
  const handleTabMouseEnter = (tabId) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(tabId);
  };

  // Leaving tab or container starts debounce timer
  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 240);
  };

  const handleContainerMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Clicking a tab navigates or toggles dropdown
  const handleTabClick = (e, tabId) => {
    e.stopPropagation();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (tabId === 'cards') {
      setActiveDropdown(null);
      if (onSelectTab) {
        onSelectTab('cards');
      }
    } else {
      setActiveDropdown(prev => (prev === tabId ? null : tabId));
      if (onSelectTab) {
        onSelectTab(tabId);
      }
    }
  };

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <nav className="main-navbar">
      <div
        ref={navContainerRef}
        className="navbar-container"
        onMouseEnter={handleContainerMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ul className="nav-links" role="menubar">
          {navTabs.map((tab) => {
            const isActive = activeDropdown === tab.id;
            const isPageActive = tab.id === 'cards' && activePage === 'visiting-cards';
            return (
              <li
                key={tab.id}
                className={`nav-item ${isActive ? 'active' : ''} ${isPageActive ? 'page-active' : ''}`}
                onMouseEnter={() => handleTabMouseEnter(tab.id)}
              >
                <button
                  type="button"
                  className="nav-link-btn"
                  onClick={(e) => handleTabClick(e, tab.id)}
                  aria-expanded={isActive}
                  aria-haspopup="true"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <ChevronDown
                    size={14}
                    className="nav-chevron"
                    style={{
                      transform: isActive ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Dynamic Mega Dropdown for whichever category is active */}
        {activeDropdown && (
          <MegaDropdown
            category={activeDropdown}
            onSelectCardSlug={(slug) => {
              onSelectCardSlug(slug);
              setActiveDropdown(null);
            }}
            onSelectCategory={(cat) => {
              if (onSelectTab) onSelectTab(cat);
              setActiveDropdown(null);
            }}
            onClose={() => setActiveDropdown(null)}
          />
        )}
      </div>
    </nav>
  );
}
