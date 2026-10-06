import React from 'react';
import { Phone, HelpCircle, Package, Building2 } from 'lucide-react';
import '../css/Topbar.css';

export default function Topbar({ onOpenAdmin }) {
  return (
    <div className="topbar">
      <div className="topbar-container">
        <div className="topbar-left">
          <a href="tel:02522-669393" className="topbar-link">
            <Phone size={13} />
            <span>02522-669393 (Mon–Sat 9 AM – 8 PM)</span>
          </a>
          <span style={{ opacity: 0.3 }}>|</span>
          <a href="#help" className="topbar-link">
            <HelpCircle size={13} />
            <span>Help Center & FAQs</span>
          </a>
        </div>
        <div className="topbar-right">
          <a href="#track-order" className="topbar-link">
            <Package size={13} />
            <span>Track Order</span>
          </a>
          <a href="#bulk" className="topbar-link">
            <Building2 size={13} />
            <span>Bulk Orders (₹10,000+)</span>
          </a>
          <div className="flag-badge">
            <span role="img" aria-label="India Flag">🇮🇳</span>
            <span>IN (₹)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
