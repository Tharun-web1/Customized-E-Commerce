import React from 'react';
import { ShieldCheck, Zap, Layers, RefreshCcw } from 'lucide-react';
import '../css/TrustStrip.css';

export default function TrustStrip() {
  const items = [
    {
      icon: <ShieldCheck size={22} />,
      title: '100% Satisfaction Guarantee',
      desc: 'Free replacement or full refund if you aren’t delighted.',
    },
    {
      icon: <Zap size={22} />,
      title: 'Same Day Delivery',
      desc: 'Select pin codes in Mumbai, Bengaluru & Kolkata.',
    },
    {
      icon: <Layers size={22} />,
      title: 'Heavyweight Paper Stocks',
      desc: 'High-density card stocks from 250 GSM up to 400 GSM board.',
    },
    {
      icon: <RefreshCcw size={22} />,
      title: 'Affordable MOQ from 100 Cards',
      desc: 'Economical starter packs with steep bulk discounts.',
    },
  ];

  return (
    <div className="trust-strip">
      <div className="trust-container">
        {items.map((item, idx) => (
          <div key={idx} className="trust-item">
            <div className="trust-icon">{item.icon}</div>
            <div>
              <div className="trust-title">{item.title}</div>
              <div className="trust-desc">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
