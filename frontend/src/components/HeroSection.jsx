import React from 'react';
import { ArrowRight, Sparkles, Upload, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import '../css/HeroSection.css';

export default function HeroSection({ onStartDesigning, onBrowseTemplates }) {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Column: Value Copy */}
        <div className="hero-content">
          <div className="hero-pill">
            <Sparkles size={14} color="#38bdf8" />
            <span>India's Most Trusted Visiting Card Maker • 100% Satisfaction</span>
          </div>

          <h1 className="hero-title">
            Visiting Cards That <span>Mean Business</span>
          </h1>

          <p className="hero-subtitle">
            Stand out in every client meeting. Choose from 4,200+ industry-tailored templates,
            premium paper weights up to 400 GSM, and same-day delivery across Mumbai, Bengaluru & Kolkata.
          </p>

          <div className="hero-price-strip">
            <span className="hero-price-val">₹270</span>
            <div className="hero-price-text">
              <strong>Starting Pack of 100 Cards</strong>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Just ₹2.70 / card • Free Shipping above ₹500</div>
            </div>
          </div>

          <div className="hero-ctas">
            <button className="btn-primary" onClick={onStartDesigning}>
              <span>Start Designing Now</span>
              <ArrowRight size={18} />
            </button>

            <button className="btn-secondary" onClick={onBrowseTemplates}>
              <Upload size={18} />
              <span>Browse 4,000+ Templates</span>
            </button>
          </div>
        </div>

        {/* Right Column: 3D Floating Perspective Cards */}
        <div className="hero-cards-visual">
          {/* Card 1: Executive Dark Spot UV */}
          <div className="floating-card card-stack-1">
            <div className="mock-logo">
              <div style={{ width: 14, height: 14, background: '#38bdf8', borderRadius: 3 }} />
              <span>NEXUS TECH</span>
            </div>
            <div>
              <div className="mock-name" style={{ color: 'white' }}>Vikram Singhania</div>
              <div className="mock-role" style={{ color: '#94a3b8' }}>Managing Partner</div>
            </div>
            <div className="mock-contacts">
              <span>+91 98765 43210</span>
              <span className="mock-badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                400 GSM Spot UV
              </span>
            </div>
          </div>

          {/* Card 2: Professional Blue */}
          <div className="floating-card card-stack-2">
            <div className="mock-logo">
              <div style={{ width: 14, height: 14, background: '#ffb800', borderRadius: '50%' }} />
              <span>CREST WEALTH</span>
            </div>
            <div>
              <div className="mock-name" style={{ color: 'white' }}>Pooja Deshmukh</div>
              <div className="mock-role" style={{ color: '#bae6fd' }}>Chartered Accountant</div>
            </div>
            <div className="mock-contacts">
              <span>pooja@crestwealth.in</span>
              <span className="mock-badge" style={{ background: '#ffb800', color: '#1e293b' }}>
                Rounded Corner
              </span>
            </div>
          </div>

          {/* Card 3: Standard White Card with QR */}
          <div className="floating-card card-stack-3">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="mock-logo" style={{ color: '#002c5f' }}>
                <div style={{ width: 16, height: 16, background: '#002c5f', borderRadius: 4 }} />
                <span>APEX STUDIO</span>
              </div>
              <div style={{ background: '#f1f5f9', padding: '4px 6px', borderRadius: 4 }}>
                <QrCode size={20} color="#002c5f" />
              </div>
            </div>

            <div>
              <div className="mock-name" style={{ color: '#002c5f' }}>Rahul Sharma</div>
              <div className="mock-role" style={{ color: '#0099ff' }}>Principal Architect</div>
            </div>

            <div className="mock-contacts">
              <span>contact@apexstudio.in</span>
              <span className="mock-badge">Matte Finish</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
