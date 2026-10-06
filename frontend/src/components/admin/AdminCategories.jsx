import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { createCategory, deleteCategory } from '../../api';

export default function AdminCategories({
  categories = [],
  onRefreshData,
  showToast,
  isModalOpen,
  setIsModalOpen,
}) {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    display_order: categories.length + 1,
  });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await createCategory(form);
      showToast(`Category "${form.name}" created!`);
      setIsModalOpen(false);
      setForm({ name: '', slug: '', description: '', display_order: categories.length + 2 });
      onRefreshData && onRefreshData();
    } catch (err) {
      showToast('Error creating category: ' + err.message, 'error');
    }
  };

  const handleDelete = async (cat) => {
    if (window.confirm(`Delete category "${cat.name}"? Linked cards may be affected.`)) {
      try {
        await deleteCategory(cat.id);
        showToast(`Deleted category "${cat.name}"`);
        onRefreshData && onRefreshData();
      } catch (err) {
        showToast('Failed to delete category', 'error');
      }
    }
  };

  return (
    <div className="admin-categories-view">
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>Categories Management ({categories.length})</h2>
          <p>Organize navbar groups and page tabs</p>
        </div>

        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={15} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Category Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => (
              <tr key={cat.id || idx}>
                <td style={{ fontWeight: 700, color: '#64748b' }}>
                  #{cat.display_order || idx + 1}
                </td>
                <td style={{ fontWeight: 600, color: '#0f172a' }}>{cat.name}</td>
                <td><code>{cat.slug}</code></td>
                <td style={{ color: '#64748b', fontSize: '0.82rem', maxWidth: '320px' }}>
                  {cat.description || '—'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    className="admin-action-btn delete"
                    onClick={() => handleDelete(cat)}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Add New Product Category</h3>
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
                  <div className="admin-form-group full">
                    <label>Category Name *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      required
                      placeholder="e.g. 5. Eco Friendly Cards"
                      value={form.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setForm({ ...form, name, slug });
                      }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Slug *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      required
                      placeholder="e.g. eco-friendly"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Display Order</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={form.display_order}
                      onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 1 })}
                    />
                  </div>

                  <div className="admin-form-group full">
                    <label>Description</label>
                    <textarea
                      className="admin-form-textarea"
                      placeholder="Category highlights and offerings..."
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
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
