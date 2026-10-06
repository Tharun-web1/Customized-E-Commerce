import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { validatePromoCode } from '../api';
import '../css/CartDrawer.css';

export default function CartDrawer({
  isOpen,
  onClose,
  cartData,
  onRemoveItem,
  onCheckoutSuccess,
}) {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMsg, setPromoMsg] = useState({ text: '', isError: false });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartData?.subtotal || 0;
  const discountAmount = appliedPromo ? (subtotal * appliedPromo.discount_percent) / 100 : 0;
  const shippingFee = subtotal >= 500 || subtotal === 0 ? 0 : 50;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    const res = await validatePromoCode(promoInput.trim(), subtotal);
    if (res.valid) {
      setAppliedPromo(res);
      setPromoMsg({ text: res.message, isError: false });
    } else {
      setAppliedPromo(null);
      setPromoMsg({ text: res.message, isError: true });
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderDone(true);
      if (onCheckoutSuccess) onCheckoutSuccess();
    }, 1500);
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#002c5f" />
            <h3 style={{ fontSize: '1.2rem', color: '#002c5f', margin: 0 }}>
              Your Cart ({cartData?.count || 0})
            </h3>
          </div>
          <button onClick={onClose} style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        {/* Body Content */}
        <div className="cart-drawer-body">
          {orderDone ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <CheckCircle2 size={54} color="#16a34a" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.4rem', color: '#002c5f', marginBottom: '8px' }}>
                Order Placed Successfully!
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
                Your visiting card designs have been submitted to pre-flight inspection and will be dispatched promptly.
              </p>
              <button
                className="btn-primary"
                onClick={() => {
                  setOrderDone(false);
                  onClose();
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : cartData?.items?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
              <div style={{
                background: 'linear-gradient(155deg, #f0f7ff 0%, #e2f0fd 50%, #f4f8fe 100%)',
                padding: '30px 20px',
                borderRadius: '20px',
                border: '1px solid rgba(186, 215, 245, 0.8)',
                boxShadow: '0 8px 24px -4px rgba(2, 132, 199, 0.08)'
              }}>
                <div style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 6px 20px rgba(2, 132, 199, 0.15)',
                  border: '1.5px solid #ffffff'
                }}>
                  <ShoppingBag size={34} color="#0284c7" />
                </div>
                <h4 style={{ fontWeight: 800, fontSize: '1.18rem', color: '#002c5f', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                  Looks like your cart is empty.
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 20px 0', lineHeight: 1.45 }}>
                  Let&apos;s fix that — customize premium visiting cards or browse popular design templates!
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #002c5f 0%, #0284c7 100%)',
                      borderRadius: '10px',
                      padding: '11px',
                      fontWeight: 700,
                      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
                    }}
                    onClick={() => {
                      onClose();
                      window.location.hash = '#visiting-cards';
                    }}
                  >
                    Explore Visiting Cards
                  </button>
                  <button
                    type="button"
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '9px 14px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: '#002c5f',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                    }}
                    onClick={() => {
                      onClose();
                      window.location.hash = '#cart';
                    }}
                  >
                    Open Full Cart Page
                  </button>
                </div>
              </div>
            </div>
          ) : (
            cartData?.items?.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', color: '#002c5f', marginBottom: '4px' }}>
                      {item.card_title}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {item.quantity} cards • {item.corner_style} Corners • {item.finish}
                    </div>
                    {item.custom_name && (
                      <div style={{ fontSize: '0.72rem', color: '#0099ff', marginTop: '4px', fontWeight: 600 }}>
                        Printed Name: {item.custom_name}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    style={{ color: '#ef4444', padding: '4px' }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    ₹{item.unit_price} each
                  </span>
                  <span style={{ fontWeight: 700, color: '#002c5f', fontSize: '1.05rem' }}>
                    ₹{item.total_price}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Promo & Checkout */}
        {!orderDone && cartData?.items?.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Promo Code Input */}
            <div className="promo-input-row">
              <input
                type="text"
                placeholder="Enter coupon (e.g. NEW15, SAVE5)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                className="form-input"
                style={{ color: '#0f172a', background: '#f8fafc', border: '1px solid #cbd5e1' }}
              />
              <button className="promo-btn" onClick={handleApplyPromo}>
                Apply
              </button>
            </div>

            {promoMsg.text && (
              <div
                style={{
                  fontSize: '0.75rem',
                  color: promoMsg.isError ? '#dc2626' : '#16a34a',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {promoMsg.isError ? <AlertCircle size={13} /> : <CheckCircle2 size={13} />}
                <span>{promoMsg.text}</span>
              </div>
            )}

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.86rem', color: '#475569', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {appliedPromo && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 600 }}>
                  <span>Discount ({appliedPromo.discount_percent}%)</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Standard Delivery</span>
                <span>{shippingFee === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `₹${shippingFee}`}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '8px',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#002c5f',
                }}
              >
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              <span>{isCheckingOut ? 'Processing Payment...' : 'Proceed to Checkout'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
