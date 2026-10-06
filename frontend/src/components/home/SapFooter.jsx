// src/components/home/SapFooter.jsx
import React, { useState } from 'react';
import { Phone, Mail, MapPin, ChevronRight } from 'lucide-react';
import logoImg from '../../assets/logo/sap_prints_logo.png';
import QuoteModal from './QuoteModal';
import './SapFooter.css';

export default function SapFooter({ onNavigateHome }) {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <>
      <footer className="sap-footer-wrapper" id="contact-footer">
        <div className="sap-footer-container">
          {/* 1. Left Brand Info */}
          <div className="sap-footer-brand">
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (onNavigateHome) onNavigateHome();
                else window.location.hash = '';
              }}
            >
              <img src={logoImg} alt="@SAP PRINTS" className="sap-footer-logo-img" />
            </div>
            <div className="sap-footer-tagline">
              <span className="sap-footer-tagline-main">Designing & Printing</span>
              <span className="sap-footer-tagline-sub">Your Ideas Our Prints</span>
            </div>
          </div>

          {/* 2. Middle Contact Details */}
          <div className="sap-footer-contacts">
            {/* Phone / WhatsApp */}
            <div className="sap-footer-contact-item">
              <div className="sap-footer-contact-icon">
                <Phone size={18} />
              </div>
              <div className="sap-footer-contact-text">
                <span className="sap-footer-contact-label">Call / WhatsApp</span>
                <a href="tel:8008517418" className="sap-footer-contact-value">
                  8008517418
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="sap-footer-contact-item">
              <div className="sap-footer-contact-icon">
                <Mail size={18} />
              </div>
              <div className="sap-footer-contact-text">
                <span className="sap-footer-contact-label">Email Us</span>
                <a
                  href="mailto:swagathenterprises@gmail.com"
                  className="sap-footer-contact-value"
                >
                  swagathenterprises@gmail.com
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="sap-footer-contact-item">
              <div className="sap-footer-contact-icon">
                <MapPin size={18} />
              </div>
              <div className="sap-footer-contact-text">
                <span className="sap-footer-contact-label">Visit Us</span>
                <span className="sap-footer-contact-value">
                  Road No. 2, KPHB Colony, Hyderabad - 500072
                </span>
              </div>
            </div>
          </div>

          {/* 3. Right: Social Icons + Quote CTA */}
          <div className="sap-footer-actions">
            <div className="sap-footer-social-group">
              <span className="sap-footer-social-label">Follow Us</span>
              <div className="sap-footer-social-icons">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="sap-social-btn facebook"
                  title="Facebook"
                >
                  f
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="sap-social-btn instagram"
                  title="Instagram"
                >
                  📸
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="sap-social-btn youtube"
                  title="YouTube"
                >
                  ▶
                </a>
                <a
                  href="https://wa.me/918008517418"
                  target="_blank"
                  rel="noreferrer"
                  className="sap-social-btn whatsapp"
                  title="WhatsApp"
                >
                  💬
                </a>
              </div>
            </div>

            <button
              type="button"
              className="sap-footer-quote-btn"
              onClick={() => setIsQuoteOpen(true)}
            >
              <span>Get a Quote</span>
              <ChevronRight size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </footer>

      {/* Quote Dialog Modal */}
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </>
  );
}
