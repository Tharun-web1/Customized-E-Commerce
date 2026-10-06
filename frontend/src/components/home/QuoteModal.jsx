// src/components/home/QuoteModal.jsx
import React, { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import './SapFooter.css';

export default function QuoteModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Visiting Cards',
    quantity: '500',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // WhatsApp direct inquiry redirect
    const msg = encodeURIComponent(
      `Hello @SAP PRINTS! I need a quote for:\nService: ${formData.service}\nQuantity: ${formData.quantity}\nName: ${formData.name}\nPhone: ${formData.phone}\nNotes: ${formData.details}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/918008517418?text=${msg}`, '_blank');
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="sap-quote-modal-backdrop" onClick={onClose}>
      <div className="sap-quote-modal-box" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="sap-quote-modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
          Get a Custom Quote
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>
          Connect directly with @SAP PRINTS Hyderabad via WhatsApp or callback.
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>✅</div>
            <h4 style={{ color: '#10b981', margin: '0 0 6px 0' }}>Request Received!</h4>
            <p style={{ color: '#64748b', fontSize: '13px' }}>Redirecting you to WhatsApp chat...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Mobile / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  placeholder="8008517418"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Service
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', boxSizing: 'border-box' }}
                >
                  <option value="Visiting Cards">Visiting Cards</option>
                  <option value="Rubber Stamps">Rubber Stamps</option>
                  <option value="ID Cards">ID Cards</option>
                  <option value="3D Printing">3D Printing</option>
                  <option value="Brochures">Brochures</option>
                  <option value="Banners & Flex">Banners & Flex</option>
                  <option value="Custom Printing">Custom Printing</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Estimated Quantity & Requirements
              </label>
              <textarea
                rows={3}
                placeholder="E.g., 500 double-sided cards with matte lamination"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '10px',
                background: 'linear-gradient(135deg, #e11d48 0%, #db2777 100%)',
                color: '#ffffff',
                border: 'none',
                height: '44px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
              }}
            >
              <MessageSquare size={16} />
              <span>Send Request to WhatsApp</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
