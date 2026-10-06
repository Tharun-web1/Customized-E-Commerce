// src/components/home/SapFeatureStrip.jsx
import React from 'react';
import { Truck, Award, Headphones, IndianRupee, Settings } from 'lucide-react';
import { featureStripData } from '../../data/homeData';
import './SapFeatureStrip.css';

export default function SapFeatureStrip() {
  const renderIcon = (iconName) => {
    const props = { size: 20, color: '#ffffff', strokeWidth: 2.2 };
    switch (iconName) {
      case 'Truck':
        return <Truck {...props} />;
      case 'Award':
        return <Award {...props} />;
      case 'Headphones':
        return <Headphones {...props} />;
      case 'IndianRupee':
        return <IndianRupee {...props} />;
      case 'Settings':
        return <Settings {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  return (
    <div className="sap-features-strip">
      <div className="sap-features-container">
        {featureStripData.map((item) => (
          <div key={item.id} className="sap-feature-item">
            <div
              className="sap-feature-icon-wrapper"
              style={{ backgroundColor: item.bgColor }}
            >
              {renderIcon(item.icon)}
            </div>
            <div className="sap-feature-text">
              <span className="sap-feature-title">{item.title}</span>
              <span className="sap-feature-subtitle">{item.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
