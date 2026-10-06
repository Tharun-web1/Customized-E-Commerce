import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import '../css/ReviewsSection.css';

export default function ReviewsSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const reviews = [
    {
      name: 'Ananya Deshmukh',
      role: 'Creative Director, Mumbai',
      card: 'Velvet Touch Visiting Cards',
      rating: 5,
      comment: 'The soft-touch peach skin texture is unmatched! Handed it over during our agency pitch and clients immediately noticed the quality. Printing was laser sharp.',
    },
    {
      name: 'Rajesh K. Verma',
      role: 'Chartered Accountant, Bengaluru',
      card: 'Standard Matte Visiting Cards',
      rating: 5,
      comment: 'Ordered 500 cards with our firm QR code. The matte finish is clean, glare-free, and easy to write notes on. Delivered in just 2 days in Bengaluru.',
    },
    {
      name: 'Dr. Sameer Patel',
      role: 'Dentist & Clinic Owner, Ahmedabad',
      card: 'Spot UV 400 GSM Cards',
      rating: 5,
      comment: 'The raised liquid spot UV on our clinic logo gives a truly executive, tactile feel. Very impressed with the bleed precision and card thickness.',
    },
  ];

  const faqs = [
    {
      q: '1) What are the exact dimensions of standard visiting cards?',
      a: 'Standard visiting cards in India measure 8.9 cm × 5.1 cm (3.5" × 2"). When creating custom graphics, make sure to add a 3 mm bleed margin all around to prevent any white edge lines after cutting.',
    },
    {
      q: '2) What is the difference between Classic and Standard Visiting Cards?',
      a: 'Classic visiting cards measure 9.1 cm × 5.5 cm and use lightweight economical stocks (260-300 GSM) for high-volume outreach, while Standard Visiting Cards measure 8.9 cm × 5.1 cm and use heavier commercial boards (350-400 GSM).',
    },
    {
      q: '3) Is there an extra fee for printing on the back of the card?',
      a: 'Plain blank white backsides and standard grayscale prints are free. Full-color vibrant reverse sides have a nominal charge of ₹0.50 per card.',
    },
    {
      q: '4) How does the Same Day Delivery service work?',
      a: 'Same Day Delivery is active for select pin codes in Mumbai, Bengaluru, and Kolkata. Orders placed before 12:00 PM are printed and dispatched for evening delivery between 6:00 PM and 10:00 PM.',
    },
    {
      q: '5) What should I do for bulk orders exceeding ₹10,000?',
      a: 'You can apply the coupon code SAVE5 during checkout for an instant 5% off. For multi-employee departments requiring individual names on a single corporate invoice, our team coordinates split deliveries and NEFT payments.',
    },
  ];

  return (
    <section className="category-section" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '50px' }}>
      {/* Customer Reviews */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="discount-badge" style={{ marginBottom: '8px', display: 'inline-block' }}>
          Customer Satisfaction
        </span>
        <h2 className="section-title">Loved by Over 100,000+ Indian Businesses</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={18} fill="#ffb800" color="#ffb800" />
            ))}
          </div>
          <span style={{ fontWeight: 700, color: '#002c5f' }}>4.8 / 5.0</span>
          <span style={{ color: '#64748b' }}>from 1,778+ verified reviews</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '60px' }}>
        {reviews.map((rev, i) => (
          <div
            key={i}
            style={{
              background: '#ffffff',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
              {[...Array(rev.rating)].map((_, idx) => (
                <Star key={idx} size={15} fill="#ffb800" color="#ffb800" />
              ))}
            </div>
            <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, marginBottom: '16px' }}>
              "{rev.comment}"
            </p>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <div style={{ fontWeight: 700, color: '#002c5f', fontSize: '0.92rem' }}>{rev.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{rev.role}</div>
              <div style={{ fontSize: '0.72rem', color: '#0099ff', fontWeight: 600, marginTop: '2px' }}>
                Purchased: {rev.card}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQs Accordion */}
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '24px', color: '#002c5f' }}>
          Frequently Asked Questions
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    color: '#002c5f',
                    textAlign: 'left',
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="#0099ff" /> : <ChevronDown size={18} color="#64748b" />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 20px 18px 20px', fontSize: '0.86rem', color: '#475569', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
