import React from 'react';
import {
  Shapes,
  Sparkles,
  Layers,
  Briefcase,
  Printer,
  Cpu,
  Box,
  Flame,
  LayoutGrid,
  CornerDownRight,
  FileText,
  Tag,
  Calendar,
  Coffee,
  Shirt,
  Smartphone,
  Upload,
  Sliders
} from 'lucide-react';
import '../css/MegaDropdown.css';

export default function MegaDropdown({ category = 'cards', onSelectCardSlug, onSelectCategory, onClose }) {

  const handleItemClick = (slug, catName) => {
    if (slug) {
      onSelectCardSlug && onSelectCardSlug(slug);
    } else if (onSelectCategory && catName) {
      onSelectCategory(catName);
    }
    onClose && onClose();
  };

  /* ==========================================================
     1. VISITING CARDS DATA (No Subtags)
     ========================================================== */
  const visitingCardsData = {
    col1: {
      title: '1. By Shape',
      icon: <Shapes size={16} color="#0099ff" />,
      items: [
        { title: 'Standard Visiting Cards', slug: 'standard' },
        { title: 'Classic Visiting Cards', slug: 'classic' },
        { title: 'Custom Shape Cards', slug: 'custom-shape' },
      ],
    },
    col2: {
      title: '2. Texture',
      icon: <Layers size={16} color="#0099ff" />,
      premiumPlus: {
        title: 'Premium Plus Cards',
        slug: 'premium-plus',
        subItems: [
          { title: 'Spot UV Cards', slug: 'spot-uv' },
          { title: 'Raised Foil Cards', slug: 'raised-foil' },
        ],
      },
      items: [
        { title: 'Non-Tearable Cards', slug: 'non-tearable' },
        { title: 'Pearl Cards', slug: 'pearl' },
        { title: 'Kraft Cards', slug: 'kraft' },
        { title: 'Transparent Cards', slug: 'transparent' },
      ],
    },
    col3: {
      specialTitle: '3. Special',
      specialIcon: <Sparkles size={16} color="#0099ff" />,
      specialItems: [
        { title: 'Bulk Visiting Cards', slug: 'bulk' },
      ],
      holdersTitle: '4. Card Holders',
      holdersIcon: <Briefcase size={16} color="#0099ff" />,
      holdersItems: [
        { title: 'Desktop Visiting Card Holder', slug: 'engraved-metal-holder' },
      ],
    },
    featured: {
      tag: "Editor's Pick",
      title: 'Standard Visiting Cards',
      desc: 'The classic rectangular standard used by millions of businesses worldwide. Choose matte, glossy, or rounded corners.',
      price: 'Starting from ₹270 / 100 pcs',
      actionText: 'Design Standard Card →',
      actionSlug: 'standard',
    },
  };

  /* ==========================================================
     2. OFFSET PRINTING DATA (Exact User Specification Sheet A - No Subtags)
     ========================================================== */
  const offsetData = {
    col1: {
      title: 'Commercial Marketing',
      icon: <Printer size={16} color="#0099ff" />,
      items: [
        { title: 'Bulk Business Cards', slug: 'bulk' },
        { title: 'Brochures', slug: 'offset' },
        { title: 'Flyers', slug: 'offset' },
        { title: 'Leaflets', slug: 'offset' },
        { title: 'Booklets', slug: 'offset' },
      ],
    },
    col2: {
      title: 'Corporate Stationery',
      icon: <FileText size={16} color="#0099ff" />,
      items: [
        { title: 'Letterheads', slug: 'offset' },
        { title: 'Envelopes', slug: 'offset' },
        { title: 'Calendars', slug: 'offset' },
        { title: 'Packaging & Boxes', slug: 'offset' },
      ],
    },
    col3: {
      title: 'Specialty & Bespoke',
      icon: <Sparkles size={16} color="#0099ff" />,
      items: [
        { title: 'Wedding Cards', slug: 'offset' },
        { title: 'Custom Bulk Printing', slug: 'offset' },
        { title: 'Catalogues & Magazines', slug: 'offset' },
        { title: 'Offset Paper Proofing', slug: 'offset' },
      ],
    },
    featured: {
      tag: 'Industrial Offset',
      title: 'Bulk Commercial Printing',
      desc: 'High-speed 4-color Heidelberg offset press production. Outstanding color consistency and unbeatable bulk pricing.',
      price: 'Starting from ₹0.45 / sheet',
      actionText: 'Get Offset Bulk Quote →',
      actionSlug: 'offset',
    },
  };

  /* ==========================================================
     3. DIGITAL PRINTING DATA (Exact User Specification Sheet B - No Subtags)
     ========================================================== */
  const digitalData = {
    col1: {
      title: 'Corporate & ID Solutions',
      icon: <Cpu size={16} color="#0099ff" />,
      items: [
        { title: 'Visiting Cards', slug: 'standard' },
        { title: 'Rubber Stamps', slug: 'digital' },
        { title: 'Button Badges', slug: 'digital' },
        { title: 'ID Cards', slug: 'digital' },
        { title: 'ID Tags & Badges', slug: 'digital' },
        { title: 'ID Holders', slug: 'digital' },
        { title: 'Lanyards', slug: 'digital' },
        { title: 'Letterheads', slug: 'digital' },
        { title: 'Notepads', slug: 'digital' },
      ],
    },
    col2: {
      title: 'Marketing & Calendars',
      icon: <Calendar size={16} color="#0099ff" />,
      items: [
        { title: 'Brochures', slug: 'digital' },
        { title: 'Flyers & Posters', slug: 'digital' },
        { title: 'Paper Options', slug: 'digital' },
        { title: 'Table Calendars', slug: 'digital' },
        { title: '1-Page Calendars', slug: 'digital' },
        { title: '3-Page Calendars', slug: 'digital' },
        { title: '6-Page Calendars', slug: 'digital' },
        { title: '12-Page Calendars', slug: 'digital' },
        { title: 'Booklets', slug: 'digital' },
        { title: 'Wedding Cards & Catalogue', slug: 'digital' },
      ],
    },
    col3: {
      title: 'Stickers & Signage',
      icon: <Tag size={16} color="#0099ff" />,
      items: [
        { title: 'Paper Stickers', slug: 'digital' },
        { title: 'PVC Stickers', slug: 'digital' },
        { title: 'Labels & Seals', slug: 'digital' },
        { title: 'Tent Cards', slug: 'digital' },
        { title: 'Roll-up Standee', slug: 'digital' },
        { title: 'Toilet Boards', slug: 'digital' },
        { title: 'No Parking Boards', slug: 'digital' },
        { title: 'Printed Envelopes', slug: 'digital' },
      ],
    },
    featured: {
      tag: 'Fast Turnaround',
      title: 'On-Demand Digital Print',
      desc: 'Ultra-fast HP Indigo & Xerox laser printing. No minimum order quantity with precise color reproduction.',
      price: 'Dispatch within 4 hours',
      actionText: 'Explore Digital Prints →',
      actionSlug: 'digital',
    },
  };

  /* ==========================================================
     4. 3D PRINTING DATA (Exact User Specification Sheet C - No Subtags)
     ========================================================== */
  const threeDData = {
    col1: {
      title: 'File Upload & Models',
      icon: <Box size={16} color="#0099ff" />,
      items: [
        { title: 'Ready-made 3D Products', slug: '3d' },
        { title: 'Customer File Upload', slug: '3d' },
        { title: 'STL / OBJ / 3MF file support', slug: '3d' },
      ],
    },
    col2: {
      title: 'Materials & Customization',
      icon: <Sliders size={16} color="#0099ff" />,
      items: [
        { title: 'Material selection', slug: '3d' },
        { title: 'Colour selection', slug: '3d' },
        { title: 'Quantity', slug: '3d' },
      ],
    },
    featured: {
      tag: 'Additive Precision',
      title: 'Custom 3D Printing Quote',
      desc: 'Instant online slicing and pricing for .STL, .OBJ, and .3MF files. Rapid prototyping to production-grade batch manufacturing.',
      price: 'Starting from ₹12 / gram',
      actionText: 'Upload CAD Model Now →',
      actionSlug: '3d',
    },
  };

  /* ==========================================================
     5. SUBLIMATION PRINTING DATA (Exact User Specification Sheet D - No Extra Items)
     ========================================================== */
  const sublimationData = {
    col1: {
      title: 'Sublimation Products',
      icon: <Coffee size={16} color="#0099ff" />,
      items: [
        { title: 'Mugs', slug: 'sublimation' },
        { title: 'T-Shirts', slug: 'sublimation' },
        { title: 'Cushions', slug: 'sublimation' },
        { title: 'Water Bottles', slug: 'sublimation' },
      ],
    },
    col2: {
      title: 'Accessories & Custom',
      icon: <Sparkles size={16} color="#0099ff" />,
      items: [
        { title: 'Phone Cases', slug: 'sublimation' },
        { title: 'Caps', slug: 'sublimation' },
        { title: 'Plates', slug: 'sublimation' },
        { title: 'Custom Sublimation Products', slug: 'sublimation' },
      ],
    },
    featured: {
      tag: 'Heat Fusion Tech',
      title: 'Custom Sublimation Gifts',
      desc: 'High-definition 300 DPI dye sublimation. True-to-life colors that will never peel, crack, or wash away over time.',
      price: 'Starting from ₹149 / piece',
      actionText: 'Create Custom Sublimation →',
      actionSlug: 'sublimation',
    },
  };

  /* ==========================================================
     6. "ALL" MASTER DIRECTORY (No Subtags)
     ========================================================== */
  const allDirectory = [
    {
      catId: 'offset',
      title: 'Offset Printing',
      icon: <Printer size={16} color="#0099ff" />,
      items: [
        { title: 'Bulk Business Cards', slug: 'bulk' },
        { title: 'Brochures & Flyers', slug: 'offset' },
        { title: 'Envelopes & Letterheads', slug: 'offset' },
        { title: 'Packaging & Calendars', slug: 'offset' },
        { title: 'Wedding Cards & Booklets', slug: 'offset' },
      ],
    },
    {
      catId: 'cards',
      title: 'Visiting Cards',
      icon: <Shapes size={16} color="#0099ff" />,
      items: [
        { title: 'Standard Visiting Cards', slug: 'standard' },
        { title: 'Classic Visiting Cards', slug: 'classic' },
        { title: 'Spot UV & Raised Foil Cards', slug: 'spot-uv' },
        { title: 'Non-Tearable & Pearl Cards', slug: 'non-tearable' },
        { title: 'Desktop Card Holders', slug: 'engraved-metal-holder' },
      ],
    },
    {
      catId: 'digital',
      title: 'Digital Printing',
      icon: <Cpu size={16} color="#0099ff" />,
      items: [
        { title: 'Rubber Stamps (All Sizes)', slug: 'digital' },
        { title: 'ID Cards & Lanyards', slug: 'digital' },
        { title: 'Paper & PVC Stickers', slug: 'digital' },
        { title: 'Roll-up Standee (6×3 ft)', slug: 'digital' },
        { title: 'Table & Wall Calendars', slug: 'digital' },
      ],
    },
    {
      catId: '3d',
      title: '3D Printing',
      icon: <Box size={16} color="#0099ff" />,
      items: [
        { title: 'Ready-made 3D Products', slug: '3d' },
        { title: 'Customer File Upload', slug: '3d' },
        { title: 'STL / OBJ / 3MF file support', slug: '3d' },
        { title: 'Material selection', slug: '3d' },
        { title: 'Colour selection', slug: '3d' },
        { title: 'Quantity', slug: '3d' },
      ],
    },
    {
      catId: 'sublimation',
      title: 'Sublimation',
      icon: <Flame size={16} color="#0099ff" />,
      items: [
        { title: 'Mugs', slug: 'sublimation' },
        { title: 'T-Shirts', slug: 'sublimation' },
        { title: 'Cushions', slug: 'sublimation' },
        { title: 'Water Bottles', slug: 'sublimation' },
        { title: 'Phone Cases', slug: 'sublimation' },
        { title: 'Caps', slug: 'sublimation' },
        { title: 'Plates', slug: 'sublimation' },
        { title: 'Custom Sublimation Products', slug: 'sublimation' },
      ],
    },
  ];

  /* Helper to render a standard 3-column + featured card category layout without subtags */
  const renderStandardCategory = (data, catSlug) => (
    <div className={`mega-dropdown ${!data.col3 ? 'mega-dropdown-2col' : ''}`}>
      {/* Column 1 */}
      <div className="mega-column">
        <div className="mega-col-title">
          {data.col1.icon}
          <span>{data.col1.title}</span>
        </div>
        <ul className="mega-list">
          {data.col1.items.map((item, idx) => (
            <li key={idx}>
              <button
                type="button"
                className="mega-link"
                onClick={() => handleItemClick(item.slug, catSlug)}
              >
                <span className="mega-link-title">{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 2 */}
      <div className="mega-column">
        <div className="mega-col-title">
          {data.col2.icon}
          <span>{data.col2.title}</span>
        </div>
        <ul className="mega-list">
          {data.col2.items.map((item, idx) => (
            <li key={idx}>
              <button
                type="button"
                className="mega-link"
                onClick={() => handleItemClick(item.slug, catSlug)}
              >
                <span className="mega-link-title">{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 3 (Optional) */}
      {data.col3 && (
        <div className="mega-column">
          <div className="mega-col-title">
            {data.col3.icon}
            <span>{data.col3.title}</span>
          </div>
          <ul className="mega-list">
            {data.col3.items.map((item, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  className="mega-link"
                  onClick={() => handleItemClick(item.slug, catSlug)}
                >
                  <span className="mega-link-title">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Column 4: Featured Promo Box */}
      <div className="mega-featured-box">
        <div>
          <span className="featured-box-tag">{data.featured.tag}</span>
          <h4 className="featured-box-title">{data.featured.title}</h4>
          <p className="featured-box-desc">{data.featured.desc}</p>
          <div className="featured-box-price">{data.featured.price}</div>
        </div>
        <button
          type="button"
          className="featured-box-btn"
          onClick={() => handleItemClick(data.featured.actionSlug, catSlug)}
        >
          {data.featured.actionText}
        </button>
      </div>
    </div>
  );

  /* Specific renderer for Visiting Cards without subtags */
  const renderVisitingCards = () => (
    <div className="mega-dropdown">
      {/* Column 1: By Shape */}
      <div className="mega-column">
        <div className="mega-col-title">
          {visitingCardsData.col1.icon}
          <span>{visitingCardsData.col1.title}</span>
        </div>
        <ul className="mega-list">
          {visitingCardsData.col1.items.map((item) => (
            <li key={item.slug}>
              <button
                type="button"
                className="mega-link"
                onClick={() => handleItemClick(item.slug, 'cards')}
              >
                <span className="mega-link-title">{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 2: Texture */}
      <div className="mega-column">
        <div className="mega-col-title">
          {visitingCardsData.col2.icon}
          <span>{visitingCardsData.col2.title}</span>
        </div>
        <ul className="mega-list">
          {/* Premium Plus Item */}
          <li>
            <button
              type="button"
              className="mega-link"
              onClick={() => handleItemClick(visitingCardsData.col2.premiumPlus.slug, 'cards')}
            >
              <span className="mega-link-title">{visitingCardsData.col2.premiumPlus.title}</span>
            </button>

            {/* Indented Sub-items */}
            <ul className="mega-sub-list">
              {visitingCardsData.col2.premiumPlus.subItems.map((sub) => (
                <li key={sub.slug}>
                  <button
                    type="button"
                    className="mega-sub-link"
                    onClick={() => handleItemClick(sub.slug, 'cards')}
                  >
                    <span className="mega-sub-link-title">
                      <CornerDownRight size={13} color="#0099ff" className="sub-icon" />
                      {sub.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </li>

          {/* Remaining Textures */}
          {visitingCardsData.col2.items.map((item) => (
            <li key={item.slug}>
              <button
                type="button"
                className="mega-link"
                onClick={() => handleItemClick(item.slug, 'cards')}
              >
                <span className="mega-link-title">{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 3: Special & Card Holders */}
      <div className="mega-column">
        {/* 3. Special */}
        <div className="mega-col-title">
          {visitingCardsData.col3.specialIcon}
          <span>{visitingCardsData.col3.specialTitle}</span>
        </div>
        <ul className="mega-list" style={{ marginBottom: '18px' }}>
          {visitingCardsData.col3.specialItems.map((item) => (
            <li key={item.slug}>
              <button
                type="button"
                className="mega-link"
                onClick={() => handleItemClick(item.slug, 'cards')}
              >
                <span className="mega-link-title">{item.title}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* 4. Card Holders */}
        <div className="mega-col-title">
          {visitingCardsData.col3.holdersIcon}
          <span>{visitingCardsData.col3.holdersTitle}</span>
        </div>
        <ul className="mega-list">
          {visitingCardsData.col3.holdersItems.map((item) => (
            <li key={item.slug}>
              <button
                type="button"
                className="mega-link"
                onClick={() => handleItemClick(item.slug, 'cards')}
              >
                <span className="mega-link-title">{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 4: Promotional Feature Card */}
      <div className="mega-featured-box">
        <div>
          <span className="featured-box-tag">{visitingCardsData.featured.tag}</span>
          <h4 className="featured-box-title">{visitingCardsData.featured.title}</h4>
          <p className="featured-box-desc">{visitingCardsData.featured.desc}</p>
          <div className="featured-box-price">{visitingCardsData.featured.price}</div>
        </div>
        <button
          type="button"
          className="featured-box-btn"
          onClick={() => handleItemClick(visitingCardsData.featured.actionSlug, 'cards')}
        >
          {visitingCardsData.featured.actionText}
        </button>
      </div>
    </div>
  );

  /* Specific renderer for "All" without subtags */
  const renderAllDirectory = () => (
    <div className="mega-dropdown mega-dropdown-all">
      {allDirectory.map((cat) => (
        <div key={cat.catId} className="mega-column">
          <div className="mega-col-title">
            {cat.icon}
            <span>{cat.title}</span>
          </div>
          <ul className="mega-list">
            {cat.items.map((item, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  className="mega-link"
                  onClick={() => handleItemClick(item.slug, cat.catId)}
                >
                  <span className="mega-link-title">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  // Switch by active category
  switch (category) {
    case 'all':
      return renderAllDirectory();
    case 'offset':
      return renderStandardCategory(offsetData, 'offset');
    case 'cards':
      return renderVisitingCards();
    case 'digital':
      return renderStandardCategory(digitalData, 'digital');
    case '3d':
      return renderStandardCategory(threeDData, '3d');
    case 'sublimation':
      return renderStandardCategory(sublimationData, 'sublimation');
    default:
      return renderVisitingCards();
  }
}
