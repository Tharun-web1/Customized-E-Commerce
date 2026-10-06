// src/components/home/SapReviewsAndWhyUs.jsx
import React from 'react';
import { Check } from 'lucide-react';
import { testimonialsData, whyChooseUsPoints } from '../../data/homeData';
import './SapReviewsAndWhyUs.css';

export default function SapReviewsAndWhyUs() {
  return (
    <section className="sap-reviews-why-section" id="why-choose-us-section">
      {/* 1. What Our Customers Say */}
      <div className="sap-reviews-box">
        <h3 className="sap-reviews-title">What Our Customers Say</h3>
        <div className="sap-testimonials-grid">
          {testimonialsData.map((t) => (
            <div key={t.id} className="sap-testimonial-card">
              <div
                className="sap-avatar-circle"
                style={{ backgroundColor: t.avatarBg, color: t.avatarColor }}
              >
                {t.initial}
              </div>
              <div className="sap-testimonial-content">
                <span className="sap-customer-name">{t.name}</span>
                <div className="sap-star-rating">★★★★★</div>
                <p className="sap-review-text">"{t.review}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Why Choose @SAP PRINTS? */}
      <div className="sap-why-box">
        <h3 className="sap-why-title">
          Why Choose
          <br />
          @SAP PRINTS?
        </h3>
        <div className="sap-why-checklist">
          {whyChooseUsPoints.map((point, idx) => (
            <div key={idx} className="sap-why-item">
              <span className="sap-why-check">✓</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
