import React from 'react';
import { ShieldCheck, Heart, ArrowUp } from 'lucide-react';
import '../css/Footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img
                src="/asap-logo.jpeg"
                alt="ASAP Logo"
                style={{ height: 38, objectFit: 'contain', borderRadius: 6, background: '#ffffff', padding: '3px 8px' }}
              />
            </div>
            <p style={{ lineHeight: 1.6, fontSize: '0.84rem', color: '#94a3b8', marginBottom: '18px' }}>
              Empowering Indian businesses and entrepreneurs with ASAP personalized visiting cards,
              corporate stationery, and marketing merchandise. Printed with precision on sustainable papers.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#38bdf8' }}>
              <ShieldCheck size={16} />
              <span>100% Satisfaction or Free Replacement Policy</span>
            </div>
          </div>

          {/* Visiting Card Categories */}
          <div>
            <h4 className="footer-title">Visiting Cards</h4>
            <ul className="footer-links">
              <li><a href="#catalog">Standard Visiting Cards</a></li>
              <li><a href="#catalog">Rounded Corner Cards</a></li>
              <li><a href="#catalog">Square Business Cards</a></li>
              <li><a href="#catalog">400 GSM Premium Plus</a></li>
              <li><a href="#catalog">Spot UV & Raised Foil</a></li>
              <li><a href="#catalog">Waterproof Non-Tearable</a></li>
              <li><a href="#catalog">QR Code Visiting Cards</a></li>
            </ul>
          </div>

          {/* Business & Support */}
          <div>
            <h4 className="footer-title">Let Us Help</h4>
            <ul className="footer-links">
              <li><a href="#help">My Account & Orders</a></li>
              <li><a href="#help">Help Centre / FAQs</a></li>
              <li><a href="#help">Bulk Order Inquiry (₹10,000+)</a></li>
              <li><a href="#help">Same Day Delivery Guidelines</a></li>
              <li><a href="#help">Print Bleed & Margin Specs</a></li>
              <li><a href="#help">Contact: 02522-669393</a></li>
            </ul>
          </div>

          {/* Our Company & Policies */}
          <div>
            <h4 className="footer-title">Our Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About ASAP India</a></li>
              <li><a href="#sustainability">Green Printing & Sustainability</a></li>
              <li><a href="#careers">Careers & Press</a></li>
              <li><a href="#terms">Terms and Conditions</a></li>
              <li><a href="#privacy">Privacy & Cookie Policy</a></li>
              <li><a href="#security">Secure Payment Processing</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="footer-bottom">
          <div style={{ fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} ASAP India. All rights reserved. Country of origin: India.
          </div>


          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.8rem' }}>
            <span>Accepted Payments:</span>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 4, fontWeight: 700, color: 'white' }}>
              UPI
            </span>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 4, fontWeight: 700, color: 'white' }}>
              RuPay
            </span>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 4, fontWeight: 700, color: 'white' }}>
              Visa
            </span>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 4, fontWeight: 700, color: 'white' }}>
              Mastercard
            </span>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 4, fontWeight: 700, color: 'white' }}>
              NetBanking / COD
            </span>
          </div>

          <button
            onClick={scrollToTop}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#38bdf8',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            <span>Back to Top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
