// src/components/home/SapServices.jsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { servicesData } from '../../data/homeData';
import './SapServices.css';

export default function SapServices({ onSelectService, onViewAllServices }) {
  const handleCardClick = (service) => {
    if (onSelectService) {
      onSelectService(service);
    } else {
      window.location.hash = service.route;
    }
  };

  return (
    <section className="sap-services-section" id="services-section">
      <div className="sap-section-header">
        <h2 className="sap-section-title">Our Services</h2>
        <button
          type="button"
          className="sap-section-link"
          onClick={() => {
            if (onViewAllServices) onViewAllServices();
            else window.location.hash = '#visiting-cards';
          }}
        >
          <span>View All Services</span>
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="sap-services-grid">
        {servicesData.map((service) => (
          <div
            key={service.id}
            className="sap-service-card"
            onClick={() => handleCardClick(service)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick(service);
              }
            }}
          >
            <div className="sap-service-img-wrapper">
              {service.badge && (
                <span className="sap-service-badge">{service.badge}</span>
              )}
              <img
                src={service.image}
                alt={`${service.name} Printing`}
                className="sap-service-img"
                loading="lazy"
              />
            </div>
            <div className="sap-service-footer">
              <span className="sap-service-name" title={service.name}>
                {service.name}
              </span>
              <ChevronRight className="sap-service-arrow" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
