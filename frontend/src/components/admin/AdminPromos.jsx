import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { createPromoCode, deletePromoCode } from '../../api';

export default function AdminPromos({
  promoCodes = [],
  onReloadPromos,
  showToast,
  isModalOpen,
  setIsModalOpen,
}) {
  const [form, setForm] = useState({
    code: '',
    discount_percent: 15,
    min_order_value: 0,
    description: '',
    is_active: true,
  });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await createPromoCode({
        ...form,
        code: form.code.trim().toUpperCase(),
      });
      showToast(`Promo code "${form.code.toUpperCase()}" added!`);
      setIsModalOpen(false);
      setForm({ code: '', discount_percent: 15, min_order_value: 0, description: '', is_active: true });
      onReloadPromos && onReloadPromos();
    } catch (err) {
      showToast('Failed to create promo code: ' + err.message, 'error');
    }
  };

  const handleDelete = async (promo) => {
    if (window.confirm(`Delete promo code "${promo.code}"?`)) {
      try {
        await deletePromoCode(promo.id);
        showToast(`Deleted promo code "${promo.code}"`);
        onReloadPromos && onReloadPromos();
      } catch (err) {
        showToast('Failed to delete promo code', 'error');
      }
    }
  };

  return (
    <div className="admin-promos-view">
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>Promo Codes & Discounts ({promoCodes.length})</h2>
          <p>Customer checkout discount coupons</p>
        </div>

        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={15} />
          <span>Add Promo Code</span>
        </button>
      </div>

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Discount %</th>
              <th>Min Order Value</th>
              <th>Description</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  No promo codes found.
                </td>
              </tr>
            ) : (
              promoCodes.map((promo) => (
                <tr key={promo.id}>
                  <td>
                    <code style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0056b3' }}>
                      {promo.code}
                    </code>
                  </td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>
                    {promo.discount_percent}% OFF
                  </td>
                  <td>₹{Number(promo.min_order_value || 0).toFixed(2)}</td>
                  <td style={{ color: '#64748b' }}>{promo.description || '—'}</td>
                  <td>
                    <span className={`admin-badge ${promo.is_active ? 'success' : ''}`}>
                      {promo.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="admin-action-btn delete"
                      onClick={() => handleDelete(promo)}
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Create Promo Coupon</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label>Coupon Code *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      required
                      placeholder="e.g. FLAT20"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Discount Percentage (%) *</label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      className="admin-form-input"
                      required
                      value={form.discount_percent}
                      onChange={(e) => setForm({ ...form, discount_percent: parseInt(e.target.value) || 10 })}
                    />
                  </div>

                  <div className="admin-form-group full">
                    <label>Minimum Order Value (₹)</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={form.min_order_value}
                      onChange={(e) => setForm({ ...form, min_order_value: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="admin-form-group full">
                    <label>Description</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. 20% off on all business card purchases"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
