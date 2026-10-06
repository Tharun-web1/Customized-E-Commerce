import { apiRequest } from './apiClient';

export const fetchTemplates = async ({ industry = '', cardId = null, cardSlug = '', orientation = '', search = '' } = {}) => {
  try {
    const params = new URLSearchParams();
    if (industry && industry !== 'all') params.append('industry', industry);
    if (cardId) params.append('card_id', cardId);
    if (cardSlug) params.append('card_slug', cardSlug);
    if (orientation && orientation !== 'all') params.append('orientation', orientation);
    if (search) params.append('search', search);
    const query = params.toString() ? `?${params.toString()}` : '';

    const data = await apiRequest(`/templates/${query}`);
    return Array.isArray(data) ? data : (data?.results || []);
  } catch (err) {
    console.warn('Templates fetch error, returning fallback templates:', err);
    return [
      {
        id: 1,
        title: 'Executive Swoosh Pro',
        industry: 'Corporate & Business',
        orientation: 'horizontal',
        primary_color: '#002c5f',
        preview_style: 'modern',
        layout_type: 'executive_swoosh',
        color_palette: '#002c5f,#0099ff,#f8fafc',
        sample_company: 'Apex Vertex Global Pvt Ltd',
        sample_tagline: 'Engineering Tomorrow’s Intelligence',
        sample_name: 'Rajesh Malhotra',
        sample_job_title: 'Chief Technology Officer',
        sample_phone: '+91 98765 43210',
        sample_email: 'rajesh@apexvertex.com',
      },
      {
        id: 2,
        title: 'Luxury Obsidian & Gold',
        industry: 'Real Estate & Luxury',
        orientation: 'horizontal',
        primary_color: '#09090b',
        preview_style: 'luxury_black_gold',
        layout_type: 'luxury_black_gold',
        color_palette: '#09090b,#d4af37,#27272a',
        sample_company: 'Aura Sovereign Estates',
        sample_tagline: 'Ultra-Luxury Residencies & Penthouses',
        sample_name: 'Devika Singhania',
        sample_job_title: 'Principal Managing Partner',
        sample_phone: '+91 98111 22334',
        sample_email: 'devika@aurasovereign.in',
      },
      {
        id: 3,
        title: 'Medical Clean Care',
        industry: 'Healthcare & Wellness',
        orientation: 'horizontal',
        primary_color: '#0284c7',
        preview_style: 'medical_care',
        layout_type: 'medical_care',
        color_palette: '#0284c7,#10b981,#f0f9ff',
        sample_company: 'Zenith Multi-Speciality Clinic',
        sample_tagline: 'Compassionate Advanced Care',
        sample_name: 'Dr. Siddharth Varma',
        sample_job_title: 'MD, Senior Cardiologist',
        sample_phone: '+91 94455 66778',
        sample_email: 'dr.siddharth@zenithclinic.org',
      },
      {
        id: 4,
        title: 'Creative Geometric Split',
        industry: 'Design & Creative Arts',
        orientation: 'vertical',
        primary_color: '#ea580c',
        preview_style: 'modern_geometric',
        layout_type: 'modern_geometric',
        color_palette: '#ea580c,#0f172a,#fed7aa',
        sample_company: 'Studio Prism Architects',
        sample_tagline: 'Spatial Aesthetics & Urban Form',
        sample_name: 'Ananya Roy',
        sample_job_title: 'Lead Spatial Designer',
        sample_phone: '+91 97788 11223',
        sample_email: 'ananya@prismstudio.design',
      },
      {
        id: 5,
        title: 'Legal & Advisory Crest',
        industry: 'Legal & Financial Services',
        orientation: 'horizontal',
        primary_color: '#1e3a8a',
        preview_style: 'corporate_split_swoosh',
        layout_type: 'corporate_split_swoosh',
        color_palette: '#1e3a8a,#334155,#f1f5f9',
        sample_company: 'Veritas Legal Chambers',
        sample_tagline: 'Advocates & Corporate Solicitors',
        sample_name: 'Vikramaditya Bose',
        sample_job_title: 'Senior Advocate, High Court',
        sample_phone: '+91 98200 99887',
        sample_email: 'v.bose@veritaslegal.in',
      }
    ];
  }
};
