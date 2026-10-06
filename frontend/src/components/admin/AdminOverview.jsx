import React, { useState, useEffect } from 'react';
import {
  Shapes,
  Layers,
  FileText,
  Tag,
  Plus,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Eye,
  CheckCircle2,
  Calendar,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import { fetchAdminStats } from '../../api';

export default function AdminOverview({
  cardsCount = 0,
  categoriesCount = 0,
  templatesCount = 0,
  promosCount = 0,
  onOpenAddCard,
  onOpenAddCategory,
  onOpenAddTemplate,
  onOpenConvertTemplate,
  onOpenAddPromo,
  onNavigateTab,
}) {
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminStats();
      if (res && res.success) {
        setStatsData(res);
      }
    } catch (e) {
      console.warn('Failed to load stats', e);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = statsData?.stats || {
    total_cards: cardsCount,
    total_categories: categoriesCount,
    total_templates: templatesCount,
    total_promos: promosCount,
    total_orders: 0,
    total_revenue: 0,
  };

  const groupStats = statsData?.group_stats || {
    '1. By Shape': 3,
    '2. Texture': 3,
    '3. Special': 2,
    '4. Card Holders': 1,
  };

  const recentOrders = statsData?.recent_orders || [];

  return (
    <div className="admin-overview-view">
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>Store Analytics & Overview</h2>
          <p>Real-time metrics, product performance, and customer custom card submissions</p>
        </div>

        <button
          type="button"
          className="admin-btn-secondary"
          onClick={loadStats}
          disabled={isLoading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RotateCw size={13} className={isLoading ? 'admin-spin' : ''} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="admin-stats-grid">
        {/* Revenue KPI */}
        <div className="admin-stat-card revenue-gradient">
          <div className="admin-stat-icon green">
            <TrendingUp size={24} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-value">₹{stats.total_revenue?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <div className="admin-stat-label">Total Custom Orders Value</div>
            <div className="admin-stat-subtext">Live order subtotal across active sessions</div>
          </div>
        </div>

        {/* Customer Submissions KPI */}
        <div className="admin-stat-card">
          <div className="admin-stat-icon blue">
            <ShoppingBag size={24} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-value">{stats.total_orders}</div>
            <div className="admin-stat-label">Customer Designs & Orders</div>
            <div className="admin-stat-subtext">
              <span
                style={{ color: '#0070ba', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => onNavigateTab && onNavigateTab('orders')}
              >
                View all orders & designs →
              </span>
            </div>
          </div>
        </div>

        {/* Active Cards KPI */}
        <div className="admin-stat-card">
          <div className="admin-stat-icon purple">
            <Shapes size={24} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-value">{stats.total_cards}</div>
            <div className="admin-stat-label">Active Card Products</div>
            <div className="admin-stat-subtext">{stats.total_categories} Categories mapped</div>
          </div>
        </div>

        {/* Templates KPI */}
        <div className="admin-stat-card">
          <div className="admin-stat-icon amber">
            <FileText size={24} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-value">{stats.total_templates}</div>
            <div className="admin-stat-label">Studio Design Templates</div>
            <div className="admin-stat-subtext">{stats.total_promos} Promo coupons active</div>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Category Distribution & Quick Actions */}
      <div className="admin-overview-mid-grid">
        {/* Left: Category Distribution */}
        <div className="admin-card-panel">
          <div className="admin-panel-header">
            <h3>Catalog Distribution by Group</h3>
            <span className="admin-panel-badge">{Object.keys(groupStats).length} Groups</span>
          </div>
          <div className="admin-group-bars-list">
            {Object.entries(groupStats).map(([groupName, count]) => {
              const pct = Math.min(100, Math.round((count / Math.max(1, stats.total_cards)) * 100));
              return (
                <div key={groupName} className="admin-group-bar-row">
                  <div className="admin-group-bar-labels">
                    <span className="admin-group-name">{groupName}</span>
                    <span className="admin-group-count">{count} {count === 1 ? 'card' : 'cards'} ({pct}%)</span>
                  </div>
                  <div className="admin-progress-track">
                    <div className="admin-progress-fill" style={{ width: `${Math.max(12, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Launch Operations */}
        <div className="admin-card-panel">
          <div className="admin-panel-header">
            <h3>Quick Launch Operations</h3>
            <span className="admin-panel-badge">Management</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px 0' }}>
            Fast shortcuts to create catalog assets or inspect incoming customer designs
          </p>
          <div className="admin-quick-actions-grid">
            <button
              type="button"
              className="admin-quick-btn primary"
              onClick={onOpenAddCard}
            >
              <Plus size={16} />
              <div>
                <strong>Add Visiting Card</strong>
                <span>New paper stock, price, dimensions</span>
              </div>
            </button>

            <button
              type="button"
              className="admin-quick-btn"
              onClick={() => onNavigateTab && onNavigateTab('orders')}
            >
              <ShoppingBag size={16} />
              <div>
                <strong>Customer Designs</strong>
                <span>Inspect user artwork & orders</span>
              </div>
            </button>

            <button
              type="button"
              className="admin-quick-btn"
              onClick={onOpenAddTemplate}
            >
              <Plus size={16} />
              <div>
                <strong>Add Template Preset</strong>
                <span>Attach to card for live customizer</span>
              </div>
            </button>

            <button
              type="button"
              className="admin-quick-btn"
              style={{ background: '#f0f9ff', borderColor: '#bae6fd' }}
              onClick={onOpenConvertTemplate || (() => onNavigateTab && onNavigateTab('templates'))}
            >
              <Sparkles size={16} color="#0070ba" />
              <div>
                <strong style={{ color: '#0070ba' }}>Convert Card Image</strong>
                <span>Upload card image to create template</span>
              </div>
            </button>

            <button
              type="button"
              className="admin-quick-btn"
              onClick={onOpenAddPromo}
            >
              <Tag size={16} />
              <div>
                <strong>Discount Coupon</strong>
                <span>Create promo code for checkout</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Customer Designs & Submissions */}
      <div className="admin-card-panel" style={{ marginTop: '20px' }}>
        <div className="admin-panel-header">
          <div>
            <h3>Recent Customer Custom Designs</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
              Latest cards customized in the 3D Studio and submitted to checkout
            </p>
          </div>
          {recentOrders.length > 0 && (
            <button
              type="button"
              className="admin-link-btn"
              onClick={() => onNavigateTab && onNavigateTab('orders')}
            >
              <span>View all orders</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748b' }}>
            <ShoppingBag size={32} color="#cbd5e1" style={{ margin: '0 auto 8px auto', display: 'block' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No custom orders placed yet</p>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              When customers design visiting cards and add to cart, they will show here immediately.
            </span>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '65px' }}>Design</th>
                  <th>Customer / Company</th>
                  <th>Card Model</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((item) => {
                  const thumb = item.preview_image || item.uploaded_artwork;
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="admin-table-mini-thumb">
                          {thumb ? (
                            <img src={thumb} alt={item.custom_name || 'Card'} />
                          ) : (
                            <div
                              className="admin-table-thumb-blank"
                              style={{ borderTop: `2px solid ${item.accent_color || '#0056b3'}` }}
                            >
                              <span>{(item.custom_company || item.custom_name || 'Card').slice(0, 8)}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <strong>{item.custom_name || 'Customer'}</strong>
                        {item.custom_company && (
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.custom_company}</div>
                        )}
                      </td>
                      <td>
                        <span>{item.card_title || 'Standard Visiting Cards'}</span>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{item.finish || 'Matte'}</div>
                      </td>
                      <td>
                        <strong>{item.quantity}</strong> units
                      </td>
                      <td>
                        <strong style={{ color: '#0f172a' }}>₹{parseFloat(item.total_price || 0).toFixed(2)}</strong>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Recent'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="admin-action-btn view"
                          onClick={() => onNavigateTab && onNavigateTab('orders')}
                          title="Open in Orders manager"
                        >
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
