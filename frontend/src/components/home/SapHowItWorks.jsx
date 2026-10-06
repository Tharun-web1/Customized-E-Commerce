// src/components/home/SapHowItWorks.jsx
import React from 'react';
import { howItWorksSteps } from '../../data/homeData';
import './SapHowItWorks.css';

export default function SapHowItWorks() {
  return (
    <div className="sap-how-box">
      <h3 className="sap-how-title">How It Works</h3>
      <div className="sap-how-steps">
        {howItWorksSteps.map((item) => (
          <div key={item.step} className="sap-how-step-item">
            <div
              className="sap-how-step-num"
              style={{ backgroundColor: item.color }}
            >
              {item.step}
            </div>
            <div className="sap-how-step-info">
              <span className="sap-how-step-title">{item.title}</span>
              <span className="sap-how-step-desc">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
