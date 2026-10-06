import React, { useState } from 'react';
import { Sparkles, Copy, Check, Clock } from 'lucide-react';
import '../css/DiscountBar.css';

export default function DiscountBar({ onCopyCode }) {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    if (onCopyCode) onCopyCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="discount-bar">
      <div className="discount-container">
        <div className="discount-left">
          <span className="discount-badge">Festive Offer</span>
          <span>Buy More, Save More! Flat 5% OFF on Orders ₹10,000+</span>
          <div
            className="coupon-tag"
            onClick={() => handleCopy('SAVE5')}
            title="Click to copy coupon code"
          >
            {copiedCode === 'SAVE5' ? <Check size={14} color="#86efac" /> : <Copy size={13} />}
            <span>{copiedCode === 'SAVE5' ? 'COPIED!' : 'SAVE5'}</span>
          </div>

          <span style={{ opacity: 0.5, margin: '0 4px' }}>•</span>

          <span>First Time Buyer? Get 15% OFF with</span>
          <div
            className="coupon-tag"
            onClick={() => handleCopy('NEW15')}
            title="Click to copy coupon code"
          >
            {copiedCode === 'NEW15' ? <Check size={14} color="#86efac" /> : <Copy size={13} />}
            <span>{copiedCode === 'NEW15' ? 'COPIED!' : 'NEW15'}</span>
          </div>
        </div>

        <div className="discount-right">
          <Clock size={13} />
          <span>Same Day Delivery in Mumbai, Bengaluru & Kolkata</span>
        </div>
      </div>
    </div>
  );
}
