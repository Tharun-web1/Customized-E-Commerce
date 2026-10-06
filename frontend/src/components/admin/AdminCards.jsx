import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, FileText } from 'lucide-react';
import { createCard, updateCard, deleteCard } from '../../api';

export default function AdminCards({
  cards = [],
  categories = [],
  onRefreshData,
  showToast,
  isModalOpen,
  setIsModalOpen,
  onManageTemplates,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingCard, setEditingCard] = useState(null);

  const getInitialCategoryId = () => {
    return categories.length > 0 ? categories[0].id : null;
  };

  const getInitialCategoryGroup = () => {
    return categories.length > 0 ? categories[0].slug : 'shapes';
  };

  const initialForm = {
    title: '',
    slug: '',
    category: getInitialCategoryId(),
    category_group: getInitialCategoryGroup(),
    dimensions: '8.9 cm x 5.1 cm',
    gsm: '350 GSM',
    finish_type: 'Matte / Glossy',
    base_price_100: 200.0,
    min_quantity: 100,
    rating: 4.4,
    reviews_count: 1780,
    badge: '',
    tagline: 'The universally recognized professional benchmark',
    bullet_points: '4000+ design options available\nStandard glossy or matte paper included\nNeed help in designing? You can avail our Design Services\nSame Day Delivery available on select pin codes in Mumbai, Bengaluru & Kolkata.\nNote: Do not upload designs containing signatures or content from Government entities, banks or financial institutions.\nCash on Delivery available only for Standard delivery speed\nPrice below is MRP (inclusive of all taxes)',
    specifications: 'Paper Stock: 350 GSM High Bulk Artboard\nDimensions: 8.9 cm x 5.1 cm\nCoating: Thermal Anti-Scuff Lamination\nPrint Method: Commercial 4-Color Heidelberg Offset',
    image_url: '/pdp_card_stack.jpg',
    image_url_2: '/pdp_card_box.jpg',
    image_url_3: '/visiting_cards_hero.jpg',
    description: 'Personalized visiting cards with high-definition precision printing on premium quality paper.',
    accent_color: '#0056b3',
    image_gradient: 'linear-gradient(135deg, #0a2540 0%, #1a365d 100%)',
    is_featured: true,
  };
  const [cardForm, setCardForm] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingCard(null);
    setCardForm({
      ...initialForm,
      category: getInitialCategoryId(),
      category_group: getInitialCategoryGroup(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (card) => {
    setEditingCard(card);
    setCardForm({
      title: card.title || '',
      slug: card.slug || '',
      category: card.category || getInitialCategoryId(),
      category_group: card.category_group || getInitialCategoryGroup(),
      dimensions: card.dimensions || '8.9 cm x 5.1 cm',
      gsm: card.gsm || '350 GSM',
      finish_type: card.finish_type || 'Matte',
      base_price_100: card.base_price_100 || 200.0,
      min_quantity: card.min_quantity || 100,
      rating: card.rating || 4.4,
      reviews_count: card.reviews_count || 1780,
      badge: card.badge || '',
      tagline: card.tagline || '',
      bullet_points: card.bullet_points || '4000+ design options available\nStandard glossy or matte paper included\nNeed help in designing? You can avail our Design Services\nSame Day Delivery available on select pin codes in Mumbai, Bengaluru & Kolkata.\nNote: Do not upload designs containing signatures or content from Government entities, banks or financial institutions.\nCash on Delivery available only for Standard delivery speed\nPrice below is MRP (inclusive of all taxes)',
      specifications: card.specifications || 'Paper Stock: 350 GSM High Bulk Artboard\nDimensions: 8.9 cm x 5.1 cm\nCoating: Thermal Anti-Scuff Lamination\nPrint Method: Commercial 4-Color Heidelberg Offset',
      image_url: card.image_url || '/pdp_card_stack.jpg',
      image_url_2: card.image_url_2 || '/pdp_card_box.jpg',
      image_url_3: card.image_url_3 || '/visiting_cards_hero.jpg',
      description: card.description || 'Personalized visiting cards with high-definition precision printing on premium quality paper.',
      accent_color: card.accent_color || '#0056b3',
      image_gradient: card.image_gradient || 'linear-gradient(135deg, #0a2540 0%, #1a365d 100%)',
      is_featured: card.is_featured ?? true,
    });
    setIsModalOpen(true);
  };



  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Validate category ID
      let categoryId = cardForm.category;
      if (!categoryId && categories.length > 0) {
        categoryId = categories[0].id;
      }

      const payload = {
        ...cardForm,
        category: categoryId,
        description: cardForm.description.trim() || `Personalized ${cardForm.title} with high-definition precision printing on premium quality paper.`,
      };

      if (editingCard) {
        await updateCard(editingCard.slug || editingCard.id, payload);
        showToast(`Updated "${cardForm.title}" successfully!`);
        setIsModalOpen(false);
        onRefreshData && onRefreshData();
      } else {
        const created = await createCard(payload);
        showToast(`Created new card "${cardForm.title}"!`);
        setIsModalOpen(false);
        onRefreshData && onRefreshData();

        // Prompt to add templates for this newly created card
        const cardToUse = created || { ...payload, title: cardForm.title };
        setTimeout(() => {
          if (window.confirm(`"${cardForm.title}" was created! Would you like to add design templates for this card now?`)) {
            onManageTemplates && onManageTemplates(cardToUse);
          }
        }, 300);
      }
    } catch (err) {
      showToast('Error saving card: ' + err.message, 'error');
    }
  };

  const handleDelete = async (card) => {
    if (window.confirm(`Are you sure you want to delete "${card.title}"?`)) {
      try {
        await deleteCard(card.slug || card.id);
        showToast(`Deleted "${card.title}"`);
        onRefreshData && onRefreshData();
      } catch (err) {
        showToast('Failed to delete card', 'error');
      }
    }
  };


  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.gsm?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.finish_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' ||
      card.category_group === categoryFilter ||
      (categoryFilter === 'texture' && (card.category_group === 'texture' || card.category_group === 'papers_textures'));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-cards-view">
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>Visiting Cards Catalog ({filteredCards.length})</h2>
          <p>Add new card models, edit pricing, change GSM or textures</p>
        </div>

        <div className="admin-controls-row">
          <div className="admin-search-input-wrap">
            <Search size={15} />
            <input
              type="text"
              className="admin-search-input"
              placeholder="Search title, GSM, finish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="admin-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Groups</option>
            <option value="shapes">1. By Shape</option>
            <option value="texture">2. Texture</option>
            <option value="special">3. Special</option>
            <option value="holders">4. Card Holders</option>
          </select>

          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenAdd}
          >
            <Plus size={15} />
            <span>Add Card</span>
          </button>
        </div>
      </div>

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Card / Preview</th>
              <th>Category & Group</th>
              <th>Specs (GSM & Finish)</th>
              <th>Starting Price</th>
              <th>Status & Badge</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCards.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  No visiting cards match your search criteria.
                </td>
              </tr>
            ) : (
              filteredCards.map((card) => (
                <tr key={card.id || card.slug}>
                  <td>
                    <div className="admin-table-item-cell">
                      <div
                        className="admin-card-preview"
                        style={{ background: card.image_gradient || card.accent_color || '#0056b3' }}
                      />
                      <div>
                        <div className="admin-table-item-title">{card.title}</div>
                        <div className="admin-table-item-sub">slug: {card.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge primary">
                      {card.category_name || card.category_group || 'General'}
                    </span>
                  </td>
                  <td>
                    <div>{card.gsm || '350 GSM'}</div>
                    <div className="admin-table-item-sub">{card.finish_type}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>
                      ₹{Number(card.base_price_100).toFixed(2)}
                    </div>
                    <div className="admin-table-item-sub">min {card.min_quantity} pcs</div>
                  </td>
                  <td>
                    {card.badge ? (
                      <span className="admin-badge success">{card.badge}</span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Standard</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="admin-actions-cell" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="admin-action-btn templates-btn"
                        onClick={() => onManageTemplates && onManageTemplates(card)}
                        title={`Manage Design Templates for ${card.title}`}
                      >
                        <FileText size={13} />
                        <span>Templates ({card.templates_count || 0})</span>
                      </button>

                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => handleOpenEdit(card)}
                        title="Edit Card"
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn delete"
                        onClick={() => handleDelete(card)}
                        title="Delete Card"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingCard ? `Edit Card: ${editingCard.title}` : 'Add New Visiting Card'}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="admin-modal-form">
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <div className="admin-form-group full">
                    <label>Card Title *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      required
                      placeholder="e.g. Spot UV Visiting Cards"
                      value={cardForm.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setCardForm((prev) => ({
                          ...prev,
                          title,
                          slug: editingCard ? prev.slug : slug,
                        }));
                      }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Slug (URL Identifier) *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      required
                      placeholder="e.g. spot-uv"
                      value={cardForm.slug}
                      onChange={(e) => setCardForm({ ...cardForm, slug: e.target.value })}
                    />
                  </div>

                  {/* Clean Category Selector */}
                  <div className="admin-form-group">
                    <label>Category *</label>
                    <select
                      className="admin-form-select"
                      value={cardForm.category || ''}
                      onChange={(e) => {
                        const selectedId = parseInt(e.target.value);
                        const cat = categories.find((c) => c.id === selectedId);
                        setCardForm({
                          ...cardForm,
                          category: selectedId,
                          category_group: cat ? cat.slug : 'shapes',
                        });
                      }}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>



                  <div className="admin-form-group">
                    <label>Starting Price (100 units) in ₹ *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="admin-form-input"
                      required
                      value={cardForm.base_price_100}
                      onChange={(e) => setCardForm({ ...cardForm, base_price_100: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Dimensions</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. 8.9 cm x 5.1 cm"
                      value={cardForm.dimensions}
                      onChange={(e) => setCardForm({ ...cardForm, dimensions: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Min Quantity</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={cardForm.min_quantity}
                      onChange={(e) => setCardForm({ ...cardForm, min_quantity: parseInt(e.target.value) || 100 })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Paper Weight / GSM</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. 350 GSM or 400 GSM Board"
                      value={cardForm.gsm}
                      onChange={(e) => setCardForm({ ...cardForm, gsm: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Finish Type</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Raised Lacquer, Matte, Velvet"
                      value={cardForm.finish_type}
                      onChange={(e) => setCardForm({ ...cardForm, finish_type: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Star Rating (1.0 - 5.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      className="admin-form-input"
                      value={cardForm.rating}
                      onChange={(e) => setCardForm({ ...cardForm, rating: parseFloat(e.target.value) || 4.5 })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Review Count</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={cardForm.reviews_count}
                      onChange={(e) => setCardForm({ ...cardForm, reviews_count: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Badge Pill (Optional)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Premium Plus, New, Waterproof"
                      value={cardForm.badge}
                      onChange={(e) => setCardForm({ ...cardForm, badge: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Accent Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={cardForm.accent_color || '#0056b3'}
                        onChange={(e) => setCardForm({ ...cardForm, accent_color: e.target.value })}
                        style={{ width: '40px', height: '36px', border: 'none', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        className="admin-form-input"
                        style={{ flex: 1 }}
                        value={cardForm.accent_color}
                        onChange={(e) => setCardForm({ ...cardForm, accent_color: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Showcase Images */}
                  <div className="admin-form-group full">
                    <label>Main Showcase Image URL *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="/pdp_card_stack.jpg or https://..."
                      value={cardForm.image_url}
                      onChange={(e) => setCardForm({ ...cardForm, image_url: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Gallery Image 2 (Packaging / Angle)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="/pdp_card_box.jpg or https://..."
                      value={cardForm.image_url_2}
                      onChange={(e) => setCardForm({ ...cardForm, image_url_2: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Gallery Image 3 (Texture / Display)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="/visiting_cards_hero.jpg or https://..."
                      value={cardForm.image_url_3}
                      onChange={(e) => setCardForm({ ...cardForm, image_url_3: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group full">
                    <label>Short Tagline</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. High-build glossy lacquer over smooth matte stock"
                      value={cardForm.tagline}
                      onChange={(e) => setCardForm({ ...cardForm, tagline: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group full">
                    <label>Feature Bullet Points (1 bullet per line)</label>
                    <textarea
                      className="admin-form-textarea"
                      rows={5}
                      placeholder="4000+ design options available&#10;Standard glossy or matte paper included&#10;Need help in designing? You can avail our Design Services&#10;Cash on Delivery available"
                      value={cardForm.bullet_points}
                      onChange={(e) => setCardForm({ ...cardForm, bullet_points: e.target.value })}
                    />
                    <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>
                      Each line displays as an informative bullet item under the title on the product detail page.
                    </small>
                  </div>

                  <div className="admin-form-group full">
                    <label>Technical Specifications (Shown inline on product page)</label>
                    <textarea
                      className="admin-form-textarea"
                      rows={4}
                      placeholder="Paper Stock: 350 GSM High Bulk Artboard&#10;Dimensions: 8.9 cm x 5.1 cm&#10;Coating: Thermal Anti-Scuff Lamination"
                      value={cardForm.specifications}
                      onChange={(e) => setCardForm({ ...cardForm, specifications: e.target.value })}
                    />
                    <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>
                      Displayed right on the page when the user clicks "See Details & Specifications" (no popup).
                    </small>
                  </div>

                  <div className="admin-form-group full">
                    <label>Full Description / Overview</label>
                    <textarea
                      className="admin-form-textarea"
                      placeholder="Detailed product specifications and materials..."
                      value={cardForm.description}
                      onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
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
                  {editingCard ? 'Save Changes' : 'Create Visiting Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
