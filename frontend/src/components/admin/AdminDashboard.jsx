import React, { useState, useEffect } from 'react';
import {
  Layers,
  Shapes,
  LayoutGrid,
  Tag,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  RotateCcw,
  Lock,
  LogOut,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { fetchPromoCodes, adminLogin, fetchAdminStats } from '../../api';

// Subcomponents in src/components/admin/
import AdminOverview from './AdminOverview';
import AdminCards from './AdminCards';
import AdminCategories from './AdminCategories';
import AdminTemplates from './AdminTemplates';
import AdminPromos from './AdminPromos';
import AdminOrders from './AdminOrders';
import AdminCardTemplatesPage from './AdminCardTemplatesPage';

// Dedicated CSS in src/css/admin/
import '../../css/admin/AdminLayout.css';
import '../../css/admin/AdminTables.css';

export default function AdminDashboard({
  cards = [],
  categories = [],
  templates = [],
  cartData = { count: 0, items: [] },
  onClose,
  onRefreshData,
}) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vp_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('Admin@12345');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fresh Dedicated Card Templates Page State
  const [selectedCardForTemplates, setSelectedCardForTemplates] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');

  const [promoCodes, setPromoCodes] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [toast, setToast] = useState(null);

  // Modals state for subcomponents
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadPromos();
      loadStatsSummary();
    }
  }, [currentUser]);

  const loadPromos = async () => {
    const list = await fetchPromoCodes();
    setPromoCodes(list);
  };

  const loadStatsSummary = async () => {
    try {
      const res = await fetchAdminStats();
      if (res?.stats?.total_orders !== undefined) {
        setOrdersCount(res.stats.total_orders);
      }
    } catch (e) {
      console.warn('Failed to load stats summary', e);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    try {
      const res = await adminLogin(usernameInput, passwordInput);
      if (res.ok && res.data.success) {
        setCurrentUser(res.data.user);
        localStorage.setItem('vp_admin_user', JSON.stringify(res.data.user));
        showToast(`Welcome back, ${res.data.user.username}!`, 'success');
      } else {
        setLoginError(res.data?.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setLoginError('Error connecting to authentication server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vp_admin_user');
    setCurrentUser(null);
    showToast('Logged out of Admin Portal.', 'info');
  };

  // If not logged in, render the secure Admin Authentication Portal
  if (!currentUser) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-box">
          <div className="admin-login-header">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <img
                src="/asap-logo.jpeg"
                alt="ASAP Logo"
                style={{ height: 50, objectFit: 'contain', borderRadius: 8, background: '#ffffff', padding: '3px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              />
            </div>
            <h2>ASAP Admin Portal</h2>
            <p>Enter your administrator credentials to access the catalog management system</p>
          </div>


          <form className="admin-login-form" onSubmit={handleLoginSubmit}>
            {loginError && (
              <div className="admin-login-error">
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <div className="admin-login-group">
              <label>Admin Username</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. admin"
                required
                autoFocus
              />
            </div>

            <div className="admin-login-group">
              <label>Admin Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>

            <div className="admin-credentials-hint">
              <span><strong>Username:</strong> admin</span>
              <span><strong>Password:</strong> Admin@12345</span>
              <span><strong>API:</strong> POST /api/admin/login/</span>
            </div>

            <button
              type="submit"
              className="admin-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
            </button>

            <button
              type="button"
              className="admin-back-btn"
              onClick={onClose}
            >
              <ArrowLeft size={14} />
              <span>Return to Storefront</span>
            </button>
          </form>
        </div>

        {toast && (
          <div className={`admin-toast ${toast.type}`}>
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    );
  }

  const switchTab = (tab) => {
    setSelectedCardForTemplates(null);
    setActiveTab(tab);
  };

  return (
    <div className="admin-wrapper">
      {/* 1. Dedicated Standalone Admin Top Navigation Bar */}
      <header className="admin-navbar">
        <div className="admin-nav-left">
          <div className="admin-brand-cluster">
            <img
              src="/asap-logo.jpeg"
              alt="ASAP Logo"
              className="admin-brand-logo"
            />
            <span className="admin-logo-badge">ADMIN</span>
          </div>

          <div className="admin-nav-divider" />

          <div className="admin-title-area">
            <h1>Catalog & Store Management Portal</h1>
            <p>Production Console &bull; Live Django REST Backend</p>
          </div>
        </div>

        <div className="admin-nav-right">
          <div className="admin-live-status-pill" title="Connected to Django REST API (Port 8000)">
            <span className="admin-pulse-dot" />
            <span>API Online</span>
          </div>

          <div className="admin-user-pill" title={`Logged in as ${currentUser?.email || currentUser?.username}`}>
            <ShieldCheck size={14} color="#16a34a" />
            <span>{currentUser?.username} (Admin)</span>
          </div>

          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => {
              onRefreshData && onRefreshData();
              loadStatsSummary();
              loadPromos();
              showToast('Refreshed live database records', 'info');
            }}
            title="Reload live database values"
          >
            <RotateCcw size={13} />
            <span>Sync Live</span>
          </button>

          <button
            type="button"
            className="admin-btn-primary"
            onClick={onClose}
            title="Exit Admin and return to customer storefront"
          >
            <ArrowLeft size={14} />
            <span>Return to Storefront</span>
          </button>

          <button
            type="button"
            className="admin-btn-ghost-danger"
            onClick={handleLogout}
            title="Log out of admin session"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* 2. Main Standalone Workspace Layout */}
      <div className="admin-container">
        {/* Modern Structured Sidebar */}
        <aside className="admin-sidebar">
          {/* Group 1: Operations */}
          <div className="admin-sidebar-group">
            <div className="admin-sidebar-section-title">Operations & Analytics</div>
            <button
              type="button"
              className={`admin-tab-btn ${!selectedCardForTemplates && activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => switchTab('overview')}
            >
              <div className="admin-tab-btn-content">
                <LayoutGrid size={16} />
                <span>Overview</span>
              </div>
            </button>

            <button
              type="button"
              className={`admin-tab-btn ${!selectedCardForTemplates && activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => switchTab('orders')}
            >
              <div className="admin-tab-btn-content">
                <ShoppingBag size={16} />
                <span>Customer Orders</span>
              </div>
              {ordersCount > 0 && <span className="admin-tab-badge orders">{ordersCount}</span>}
            </button>
          </div>

          {/* Group 2: Catalog Management */}
          <div className="admin-sidebar-group">
            <div className="admin-sidebar-section-title">Catalog Management</div>
            <button
              type="button"
              className={`admin-tab-btn ${(selectedCardForTemplates || activeTab === 'cards') ? 'active' : ''}`}
              onClick={() => switchTab('cards')}
            >
              <div className="admin-tab-btn-content">
                <Shapes size={16} />
                <span>Visiting Cards</span>
              </div>
              <span className="admin-tab-badge">{cards.length}</span>
            </button>

            <button
              type="button"
              className={`admin-tab-btn ${!selectedCardForTemplates && activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => switchTab('categories')}
            >
              <div className="admin-tab-btn-content">
                <Layers size={16} />
                <span>Categories</span>
              </div>
              <span className="admin-tab-badge">{categories.length}</span>
            </button>

            <button
              type="button"
              className={`admin-tab-btn ${!selectedCardForTemplates && activeTab === 'templates' ? 'active' : ''}`}
              onClick={() => switchTab('templates')}
            >
              <div className="admin-tab-btn-content">
                <FileText size={16} />
                <span>Studio Templates</span>
              </div>
              <span className="admin-tab-badge">{templates.length}</span>
            </button>

            <button
              type="button"
              className={`admin-tab-btn ${!selectedCardForTemplates && activeTab === 'promos' ? 'active' : ''}`}
              onClick={() => switchTab('promos')}
            >
              <div className="admin-tab-btn-content">
                <Tag size={16} />
                <span>Promo Codes</span>
              </div>
              <span className="admin-tab-badge">{promoCodes.length}</span>
            </button>
          </div>

          {/* Sidebar System Footer Card */}
          <div className="admin-sidebar-footer">
            <div className="admin-sys-status-box">
              <div className="admin-sys-row">
                <span className="admin-sys-dot online" />
                <span className="admin-sys-text">Django Engine Live</span>
              </div>
              <div className="admin-sys-sub">Port 8000 &bull; REST API v1</div>
            </div>
            <button
              type="button"
              className="admin-sidebar-exit-link"
              onClick={onClose}
            >
              <span>&larr; View Customer Storefront</span>
            </button>
          </div>
        </aside>

        {/* Content Body */}
        <main className="admin-main">
          {/* Breadcrumb strip */}
          <div className="admin-breadcrumb-bar">
            <span className="admin-breadcrumb-root">Admin Portal</span>
            <span className="admin-breadcrumb-sep">/</span>
            <span className="admin-breadcrumb-current">
              {selectedCardForTemplates
                ? `Visiting Cards / ${selectedCardForTemplates.title} / Templates`
                : activeTab === 'overview'
                ? 'Store Analytics & Overview'
                : activeTab === 'orders'
                ? 'Customer Orders & Customized Submissions'
                : activeTab === 'cards'
                ? 'Visiting Card Products'
                : activeTab === 'categories'
                ? 'Categories & Navigation Hierarchy'
                : activeTab === 'templates'
                ? 'Design Studio Templates'
                : 'Promo Codes & Discounts'}
            </span>
          </div>
          {selectedCardForTemplates ? (
            <AdminCardTemplatesPage
              card={selectedCardForTemplates}
              onBack={() => setSelectedCardForTemplates(null)}
              showToast={showToast}
              onRefreshData={onRefreshData}
            />
          ) : (
            <>
              {activeTab === 'overview' && (
                <AdminOverview
                  cardsCount={cards.length}
                  categoriesCount={categories.length}
                  templatesCount={templates.length}
                  promosCount={promoCodes.length}
                  onNavigateTab={(tab) => switchTab(tab)}
                  onOpenAddCard={() => {
                    setActiveTab('cards');
                    setIsCardModalOpen(true);
                  }}
                  onOpenAddCategory={() => {
                    setActiveTab('categories');
                    setIsCategoryModalOpen(true);
                  }}
                  onOpenAddTemplate={() => {
                    setActiveTab('templates');
                    setIsTemplateModalOpen(true);
                  }}
                  onOpenAddPromo={() => {
                    setActiveTab('promos');
                    setIsPromoModalOpen(true);
                  }}
                />
              )}

              {activeTab === 'orders' && (
                <AdminOrders
                  showToast={showToast}
                />
              )}

              {activeTab === 'cards' && (
                <AdminCards
                  cards={cards}
                  categories={categories}
                  onRefreshData={onRefreshData}
                  showToast={showToast}
                  isModalOpen={isCardModalOpen}
                  setIsModalOpen={setIsCardModalOpen}
                  onManageTemplates={(card) => setSelectedCardForTemplates(card)}
                />
              )}

              {activeTab === 'categories' && (
                <AdminCategories
                  categories={categories}
                  onRefreshData={onRefreshData}
                  showToast={showToast}
                  isModalOpen={isCategoryModalOpen}
                  setIsModalOpen={setIsCategoryModalOpen}
                />
              )}

              {activeTab === 'templates' && (
                <AdminTemplates
                  templates={templates}
                  cards={cards}
                  onRefreshData={onRefreshData}
                  showToast={showToast}
                  isModalOpen={isTemplateModalOpen}
                  setIsModalOpen={setIsTemplateModalOpen}
                />
              )}

              {activeTab === 'promos' && (
                <AdminPromos
                  promoCodes={promoCodes}
                  onReloadPromos={loadPromos}
                  showToast={showToast}
                  isModalOpen={isPromoModalOpen}
                  setIsModalOpen={setIsPromoModalOpen}
                />
              )}
            </>
          )}
        </main>
      </div>


      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
