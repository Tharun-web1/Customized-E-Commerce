import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Trash2,
  Eye,
  CheckCircle,
  ExternalLink,
  Download,
  Calendar,
  Layers,
  Phone,
  Mail,
  Building,
  User,
  X,
  RotateCw,
} from 'lucide-react';
import { fetchAdminOrders, deleteAdminOrder } from '../../api';

export default function AdminOrders({ showToast }) {
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async (query = search) => {
    setIsLoading(true);
    try {
      const res = await fetchAdminOrders(query);
      if (res && res.orders) {
        setOrders(res.orders);
        setCount(res.count || res.orders.length);
      }
    } catch (err) {
      console.warn('Failed to load admin orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders(search);
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm(`Are you sure you want to remove order #${orderId}?`)) return;
    setDeletingId(orderId);
    try {
      const ok = await deleteAdminOrder(orderId);
      if (ok) {
        if (showToast) showToast(`Order #${orderId} deleted successfully.`, 'success');
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        setCount((prev) => Math.max(0, prev - 1));
        if (selectedOrder?.id === orderId) setSelectedOrder(null);
      } else {
        if (showToast) showToast('Failed to delete order.', 'error');
      }
    } catch {
      if (showToast) showToast('Network error while deleting order.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0);

  return (
    <div className="admin-orders-view">
      {/* Header bar */}
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>Customer Orders & Designs</h2>
          <p>Inspect custom artwork, card configurations, customer details, and production specs</p>
        </div>

        <button
          type="button"
          className="admin-btn-secondary"
          onClick={() => loadOrders(search)}
          disabled={isLoading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RotateCw size={14} className={isLoading ? 'admin-spin' : ''} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* KPI mini-cards */}
      <div className="admin-orders-kpi-row">
        <div className="admin-order-kpi-card">
          <div className="admin-order-kpi-icon blue">
            <ShoppingBag size={20} />
          </div>
          <div>
            <div className="admin-order-kpi-val">{count}</div>
            <div className="admin-order-kpi-lbl">Total Custom Orders</div>
          </div>
        </div>

        <div className="admin-order-kpi-card">
          <div className="admin-order-kpi-icon green">
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="admin-order-kpi-val">₹{totalRevenue.toFixed(2)}</div>
            <div className="admin-order-kpi-lbl">Total Value (INR)</div>
          </div>
        </div>

        <div className="admin-order-kpi-card">
          <div className="admin-order-kpi-icon purple">
            <Layers size={20} />
          </div>
          <div>
            <div className="admin-order-kpi-val">
              ₹{count > 0 ? (totalRevenue / count).toFixed(2) : '0.00'}
            </div>
            <div className="admin-order-kpi-lbl">Avg. Ticket Size</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="admin-orders-toolbar">
        <form className="admin-orders-search-form" onSubmit={handleSearchSubmit}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search by customer name, company, email, phone, or card title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="admin-btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            Filter
          </button>
          {search && (
            <button
              type="button"
              className="admin-btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              onClick={() => {
                setSearch('');
                loadOrders('');
              }}
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="admin-loading-state">
          <RotateCw size={24} className="admin-spin" color="#0099ff" />
          <p>Loading customer orders and custom designs...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="admin-empty-orders">
          <ShoppingBag size={48} color="#94a3b8" />
          <h3>No customer orders found</h3>
          <p>
            {search
              ? `No orders matching "${search}". Try resetting your filter.`
              : 'When customers customize cards and add them to their cart, their submissions will appear here.'}
          </p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Preview</th>
                <th>Order / Customer</th>
                <th>Product & Specifications</th>
                <th>Pricing & Qty</th>
                <th>Date</th>
                <th style={{ textAlign: 'right', width: '130px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const previewImg = order.preview_image || order.uploaded_artwork;
                return (
                  <tr key={order.id} className="admin-order-row">
                    {/* Visual Card Thumbnail */}
                    <td>
                      <div
                        className="admin-order-thumb-wrap"
                        onClick={() => setSelectedOrder(order)}
                        title="Click to inspect design in full detail"
                      >
                        {previewImg ? (
                          <img
                            src={previewImg}
                            alt={order.custom_name || order.card_title || 'Design'}
                            className="admin-order-thumb-img"
                          />
                        ) : (
                          <div
                            className="admin-order-thumb-fallback"
                            style={{
                              background: order.accent_color ? `linear-gradient(135deg, #ffffff, ${order.accent_color}22)` : '#f8fafc',
                              borderTop: `2px solid ${order.accent_color || '#0056b3'}`,
                            }}
                          >
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: order.accent_color || '#0056b3' }}>
                              {(order.custom_company || order.custom_name || 'Card').slice(0, 10)}
                            </span>
                          </div>
                        )}
                        <span className="admin-thumb-zoom-icon">
                          <Eye size={11} />
                        </span>
                      </div>
                    </td>

                    {/* Customer & Company Details */}
                    <td>
                      <div className="admin-order-customer-block">
                        <div className="admin-order-id-badge">#{order.id}</div>
                        <div className="admin-order-name">
                          <User size={13} color="#475569" />
                          <strong>{order.custom_name || 'Guest Customer'}</strong>
                        </div>
                        {order.custom_company && (
                          <div className="admin-order-meta-line">
                            <Building size={12} color="#64748b" />
                            <span>{order.custom_company}</span>
                            {order.custom_title && <span className="admin-role-pill">({order.custom_title})</span>}
                          </div>
                        )}
                        <div className="admin-order-contacts">
                          {order.custom_email && (
                            <span title={order.custom_email}>
                              <Mail size={11} /> {order.custom_email}
                            </span>
                          )}
                          {order.custom_phone && (
                            <span>
                              <Phone size={11} /> {order.custom_phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Specs & Configuration */}
                    <td>
                      <div className="admin-order-specs-block">
                        <div className="admin-order-product-title">{order.card_title || 'Visiting Card'}</div>
                        <div className="admin-order-badges-wrap">
                          <span className="admin-spec-pill finish">{order.finish || 'Matte'}</span>
                          <span className="admin-spec-pill corners">{order.corner_style || 'Standard Square'}</span>
                          {order.backside && order.backside !== 'Blank' && (
                            <span className="admin-spec-pill backside">Back: {order.backside}</span>
                          )}
                          {order.template_name && (
                            <span className="admin-spec-pill template">{order.template_name}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Pricing */}
                    <td>
                      <div className="admin-order-price-block">
                        <div className="admin-order-total-price">₹{parseFloat(order.total_price || 0).toFixed(2)}</div>
                        <div className="admin-order-unit-price">
                          {order.quantity} units (₹{parseFloat(order.unit_price || 0).toFixed(2)}/unit)
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td>
                      <div className="admin-order-date">
                        <Calendar size={12} color="#94a3b8" />
                        <span>
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Recent'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-order-actions-wrap">
                        <button
                          type="button"
                          className="admin-action-btn view"
                          onClick={() => setSelectedOrder(order)}
                          title="View complete design and details"
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          type="button"
                          className="admin-action-btn delete"
                          onClick={() => handleDelete(order.id)}
                          disabled={deletingId === order.id}
                          title="Delete order"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Inspect Customer Design Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3>Customer Design Inspection • #{selectedOrder.id}</h3>
                <p>
                  {selectedOrder.card_title} • {selectedOrder.quantity} units
                </p>
              </div>
              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-inspection-grid">
                {/* Visual Preview Section (Front & Back) */}
                <div className="admin-inspection-visuals">
                  <div className="admin-visual-box">
                    <span className="admin-visual-label">Front Side Artwork</span>
                    {selectedOrder.preview_image || selectedOrder.uploaded_artwork ? (
                      <div className="admin-visual-preview-frame">
                        <img
                          src={selectedOrder.preview_image || selectedOrder.uploaded_artwork}
                          alt="Front Design"
                          className="admin-visual-card-img"
                        />
                        <a
                          href={selectedOrder.preview_image || selectedOrder.uploaded_artwork}
                          download={`order_${selectedOrder.id}_front.png`}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-visual-download-btn"
                          title="Download high-res artwork"
                        >
                          <Download size={13} />
                          <span>Save Artwork</span>
                        </a>
                      </div>
                    ) : (
                      <div className="admin-visual-placeholder">No visual preview available</div>
                    )}
                  </div>

                  {selectedOrder.back_preview_image && (
                    <div className="admin-visual-box">
                      <span className="admin-visual-label">Back Side Artwork</span>
                      <div className="admin-visual-preview-frame">
                        <img
                          src={selectedOrder.back_preview_image}
                          alt="Back Design"
                          className="admin-visual-card-img"
                        />
                        <a
                          href={selectedOrder.back_preview_image}
                          download={`order_${selectedOrder.id}_back.png`}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-visual-download-btn"
                          title="Download high-res back artwork"
                        >
                          <Download size={13} />
                          <span>Save Back Artwork</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="admin-inspection-details">
                  <div className="admin-detail-card">
                    <h4>Customer Profile</h4>
                    <div className="admin-detail-row">
                      <span className="lbl">Full Name:</span>
                      <strong>{selectedOrder.custom_name || 'Not provided'}</strong>
                    </div>
                    <div className="admin-detail-row">
                      <span className="lbl">Company:</span>
                      <strong>{selectedOrder.custom_company || 'Not provided'}</strong>
                    </div>
                    <div className="admin-detail-row">
                      <span className="lbl">Designation:</span>
                      <span>{selectedOrder.custom_title || 'Not provided'}</span>
                    </div>
                    <div className="admin-detail-row">
                      <span className="lbl">Phone:</span>
                      <span>{selectedOrder.custom_phone || 'Not provided'}</span>
                    </div>
                    <div className="admin-detail-row">
                      <span className="lbl">Email:</span>
                      <span>{selectedOrder.custom_email || 'Not provided'}</span>
                    </div>
                    {selectedOrder.custom_qr_url && (
                      <div className="admin-detail-row">
                        <span className="lbl">QR Target:</span>
                        <a href={selectedOrder.custom_qr_url} target="_blank" rel="noreferrer">
                          {selectedOrder.custom_qr_url}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="admin-detail-card">
                    <h4>Print & Paper Specifications</h4>
                    <div className="admin-detail-row">
                      <span className="lbl">Product Model:</span>
                      <strong>{selectedOrder.card_title}</strong>
                    </div>
                    <div className="admin-detail-row">
                      <span className="lbl">Template:</span>
                      <span>{selectedOrder.template_name || 'Custom Design'}</span>
                    </div>
                    <div className="admin-detail-row">
                      <span className="lbl">Quantity:</span>
                      <strong>{selectedOrder.quantity} units</strong>
                    </div>
                    <div className="admin-detail-row">
                      <span className="lbl">Paper Stock:</span>
                      <span>{selectedOrder.card_gsm || 'Standard 350 GSM'}</span>
                    </div>
                    <div className="admin-detail-row">
                      <span className="lbl">Finish Type:</span>
                      <span>{selectedOrder.finish || 'Matte'}</span>
                    </div>
                    <div className="admin-detail-row">
                      <span className="lbl">Corners:</span>
                      <span>{selectedOrder.corner_style || 'Standard Square'}</span>
                    </div>
                    <div className="admin-detail-row">
                      <span className="lbl">Backside:</span>
                      <span>{selectedOrder.backside || 'Blank'}</span>
                    </div>
                    <div className="admin-detail-row total-highlight">
                      <span className="lbl">Order Total:</span>
                      <strong className="price">₹{parseFloat(selectedOrder.total_price || 0).toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="admin-btn-primary"
                onClick={() => {
                  window.print();
                }}
              >
                Print Job Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
