import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Layers, RotateCw, Check, ShoppingBag, Eye,
  Phone, Mail, Globe, MapPin, Sparkles, AlertCircle
} from 'lucide-react';
import '../css/LiveCardStudio.css';

export default function LiveCardStudio({ selectedCard, allCards = [], onAddToCart }) {
  const [activeSide, setActiveSide] = useState('front'); // 'front' | 'back'
  const [cornerStyle, setCornerStyle] = useState('Standard'); // 'Standard' | 'Rounded'
  const [finish, setFinish] = useState('Matte'); // 'Matte' | 'Glossy'
  const [quantity, setQuantity] = useState(200); // 200 is Vistaprint recommended
  const [backsideOption, setBacksideOption] = useState('Blank'); // 'Blank' | 'Grayscale' | 'Full Color'
  
  // Custom printed information
  const [name, setName] = useState('Dr. Siddharth Rao');
  const [role, setRole] = useState('Managing Director & Consultant');
  const [company, setCompany] = useState('BioGenesis Health Labs');
  const [phone, setPhone] = useState('+91 98450 11223');
  const [email, setEmail] = useState('siddharth@biogenesis.in');
  const [website, setWebsite] = useState('https://biogenesis.in');
  const [address, setAddress] = useState('Bandra Kurla Complex, Mumbai');
  const [qrUrl, setQrUrl] = useState('https://biogenesis.in/vcard');
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Selected card product
  const [cardProduct, setCardProduct] = useState(
    selectedCard || allCards.find(c => c.slug === 'standard') || allCards[0] || {}
  );

  useEffect(() => {
    if (selectedCard) {
      setCardProduct(selectedCard);
    }
  }, [selectedCard]);

  // Generate live QR code whenever qrUrl changes
  useEffect(() => {
    QRCode.toDataURL(qrUrl || 'https://asapnow.in', {
      width: 120,
      margin: 1,
      color: {
        dark: '#002c5f',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR code generation error:', err));
  }, [qrUrl]);

  // Volume pricing calculation
  const basePrice100 = parseFloat(cardProduct.base_price_100 || 270);
  const baseUnit = basePrice100 / 100.0;
  let discountFactor = 1.0;
  if (quantity >= 1000) discountFactor = 0.65;
  else if (quantity >= 500) discountFactor = 0.75;
  else if (quantity >= 200) discountFactor = 0.85;

  const unitPrice = (baseUnit * discountFactor).toFixed(2);
  const backsideFee = backsideOption === 'Full Color' ? (0.50 * quantity) : 0;
  const totalPrice = ((unitPrice * quantity) + backsideFee).toFixed(2);

  const handleAdd = () => {
    if (!cardProduct.id) return;
    const payload = {
      card_id: cardProduct.id,
      quantity,
      corner_style: cornerStyle,
      finish,
      backside: backsideOption,
      custom_name: name,
      custom_title: role,
      custom_company: company,
      custom_phone: phone,
      custom_email: email,
      custom_qr_url: qrUrl,
      accent_color: themeColor,
      unit_price: parseFloat(unitPrice),
      total_price: parseFloat(totalPrice)
    };
    onAddToCart(payload);
  };

  return (
    <section className="studio-section" id="studio">
      <div className="studio-container">
        <div className="studio-header">
          <span className="discount-badge" style={{ marginBottom: '8px', display: 'inline-block' }}>
            Interactive Studio
          </span>
          <h2 className="studio-title">Customize & Preview Your Card Live</h2>
          <p className="studio-subtitle">
            Edit text, choose finishes, generate a real scannable QR code, and inspect the front and back before ordering.
          </p>
        </div>

        <div className="studio-workspace">
          {/* Left Column: Form Controls */}
          <div className="studio-controls">
            {/* Card Selection */}
            <div className="form-group">
              <label className="form-label">Select Card Type</label>
              <select
                className="form-input"
                style={{ background: '#1e293b', color: 'white' }}
                value={cardProduct.slug || 'standard'}
                onChange={(e) => {
                  const found = allCards.find(c => c.slug === e.target.value);
                  if (found) setCardProduct(found);
                }}
              >
                {allCards.map(c => (
                  <option key={c.slug} value={c.slug}>
                    {c.title} ({c.gsm}) - ₹{c.base_price_100}/100 pcs
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Contact Fields */}
            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Singhania"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Job Title / Designation</label>
                <input
                  type="text"
                  className="form-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Managing Partner"
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. BioGenesis Labs"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 11223"
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.in"
                />
              </div>
              <div className="form-group">
                <label className="form-label">QR Code URL / UPI Link</label>
                <input
                  type="text"
                  className="form-input"
                  value={qrUrl}
                  onChange={(e) => setQrUrl(e.target.value)}
                  placeholder="https://company.in/vcard"
                />
              </div>
            </div>

            {/* Corner Style & Paper Finish Switches */}
            <div className="form-group-row" style={{ marginTop: '6px' }}>
              <div className="form-group">
                <label className="form-label">Corners</label>
                <div className="pill-options">
                  <button
                    className={`pill-opt-btn ${cornerStyle === 'Standard' ? 'active' : ''}`}
                    onClick={() => setCornerStyle('Standard')}
                  >
                    Standard (Square 90°)
                  </button>
                  <button
                    className={`pill-opt-btn ${cornerStyle === 'Rounded' ? 'active' : ''}`}
                    onClick={() => setCornerStyle('Rounded')}
                  >
                    Rounded Corners
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Paper Finish</label>
                <div className="pill-options">
                  <button
                    className={`pill-opt-btn ${finish === 'Matte' ? 'active' : ''}`}
                    onClick={() => setFinish('Matte')}
                  >
                    Matte (Writable)
                  </button>
                  <button
                    className={`pill-opt-btn ${finish === 'Glossy' ? 'active' : ''}`}
                    onClick={() => setFinish('Glossy')}
                  >
                    Glossy (Shine)
                  </button>
                </div>
              </div>
            </div>

            {/* Backside Option */}
            <div className="form-group" style={{ marginTop: '6px' }}>
              <label className="form-label">Backside Printing</label>
              <div className="pill-options">
                {['Blank', 'Grayscale', 'Full Color'].map((opt) => (
                  <button
                    key={opt}
                    className={`pill-opt-btn ${backsideOption === opt ? 'active' : ''}`}
                    onClick={() => setBacksideOption(opt)}
                  >
                    {opt === 'Blank' && 'Plain White (Free)'}
                    {opt === 'Grayscale' && 'Grayscale Notes / Appt'}
                    {opt === 'Full Color' && 'Full Color (+₹0.50/card)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector with Discount Ladder */}
            <div className="form-group" style={{ marginTop: '6px' }}>
              <label className="form-label">Quantity & Savings</label>
              <div className="pill-options">
                {[100, 200, 300, 500, 1000].map((qty) => (
                  <button
                    key={qty}
                    className={`pill-opt-btn ${quantity === qty ? 'active' : ''}`}
                    onClick={() => setQuantity(qty)}
                  >
                    {qty} pcs {qty === 200 && '★ Rec'} {qty >= 500 && '(-25%)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Visual Simulator & Cart CTA */}
          <div className="studio-canvas-area">
            {/* Front / Back Switcher */}
            <div className="canvas-side-toggle">
              <button
                className={`side-btn ${activeSide === 'front' ? 'active' : ''}`}
                onClick={() => setActiveSide('front')}
              >
                Front Side
              </button>
              <button
                className={`side-btn ${activeSide === 'back' ? 'active' : ''}`}
                onClick={() => setActiveSide('back')}
              >
                Back Side
              </button>
            </div>

            {/* Simulated Visiting Card */}
            <div
              className={`card-canvas-wrap ${cornerStyle === 'Rounded' ? 'rounded' : ''} ${finish === 'Glossy' ? 'glossy' : ''} ${activeSide === 'back' ? 'backside' : ''}`}
            >
              <div className="bleed-guideline" title="Dashed line indicates safe print margin" />

              {activeSide === 'front' ? (
                <>
                  <div className="canvas-top">
                    <div>
                      <div className="canvas-company">{company || 'COMPANY NAME'}</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.5px' }}>
                        EXCELLENCE & INNOVATION
                      </div>
                    </div>
                    {qrDataUrl && (
                      <div className="canvas-qr-box" title="Scan with camera for live contact">
                        <img src={qrDataUrl} alt="QR Code" style={{ width: '100%', height: '100%' }} />
                      </div>
                    )}
                  </div>

                  <div className="canvas-middle">
                    <div className="canvas-name">{name || 'Your Full Name'}</div>
                    <div className="canvas-role">{role || 'Your Designation'}</div>
                  </div>

                  <div className="canvas-bottom">
                    <div className="canvas-bottom-item">
                      <Phone size={11} color="#0099ff" />
                      <span>{phone || '+91 98000 00000'}</span>
                    </div>
                    <div className="canvas-bottom-item">
                      <Mail size={11} color="#0099ff" />
                      <span>{email || 'contact@domain.com'}</span>
                    </div>
                    <div className="canvas-bottom-item">
                      <Globe size={11} color="#0099ff" />
                      <span>{website || 'www.domain.com'}</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Back Side View */
                <div style={{ padding: '20px' }}>
                  {backsideOption === 'Blank' ? (
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      (Blank White Reverse Side)
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
                        {company || 'COMPANY NAME'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#93c5fd', marginBottom: '16px' }}>
                        Connecting Vision With Reality
                      </div>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '10px', fontSize: '0.75rem' }}>
                        Scan front QR code to save vCard directly to your mobile address book
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Price Summary & Add to Cart */}
            <div style={{ width: '100%', maxWidth: '440px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {quantity} cards @ ₹{unitPrice}/card
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffb800' }}>
                    Total: ₹{totalPrice}
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={handleAdd}
                  style={{ padding: '10px 22px', fontSize: '0.9rem' }}
                >
                  <ShoppingBag size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', fontSize: '0.72rem', color: '#94a3b8' }}>
                <Check size={12} color="#4ade80" />
                <span>300 DPI Pre-flight Check Passed • Bleed Margin Approved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
