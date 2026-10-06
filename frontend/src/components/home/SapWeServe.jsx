// src/components/home/SapWeServe.jsx
import React from 'react';
import { Building2, UtensilsCrossed, GraduationCap, Ticket, Rocket, Heart } from 'lucide-react';
import { weServeData } from '../../data/homeData';
import './SapHowItWorks.css';

export default function SapWeServe({ onSelectSector }) {
  const renderIcon = (name) => {
    const props = { size: 18, strokeWidth: 2 };
    switch (name) {
      case 'Building2':
        return <Building2 {...props} />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed {...props} />;
      case 'GraduationCap':
        return <GraduationCap {...props} />;
      case 'Ticket':
        return <Ticket {...props} />;
      case 'Rocket':
        return <Rocket {...props} />;
      case 'Heart':
        return <Heart {...props} />;
      default:
        return <Building2 {...props} />;
    }
  };

  return (
    <div className="sap-weserve-box">
      <h3 className="sap-weserve-title">We Serve</h3>
      <div className="sap-weserve-grid">
        {weServeData.map((item) => (
          <div
            key={item.id}
            className="sap-weserve-item"
            onClick={() => {
              if (onSelectSector) onSelectSector(item);
              else window.location.hash = '#visiting-cards';
            }}
          >
            <div className="sap-weserve-icon">{renderIcon(item.icon)}</div>
            <span className="sap-weserve-label">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
