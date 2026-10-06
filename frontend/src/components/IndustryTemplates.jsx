import React, { useState } from 'react';
import { Stethoscope, Calculator, Scale, Cpu, Scissors, Home, ArrowRight } from 'lucide-react';
import TemplateCardMockup from './TemplateCardMockup';
import '../css/IndustryTemplates.css';

export default function IndustryTemplates({ templates = [], onSelectTemplate }) {
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const industries = [
    { name: 'All', icon: null },
    { name: 'Finance & CA', icon: <Calculator size={15} /> },
    { name: 'Healthcare & Doctors', icon: <Stethoscope size={15} /> },
    { name: 'Legal & Advocates', icon: <Scale size={15} /> },
    { name: 'Tech & Software', icon: <Cpu size={15} /> },
    { name: 'Beauty & Wellness', icon: <Scissors size={15} /> },
    { name: 'Real Estate', icon: <Home size={15} /> },
  ];

  const filtered = selectedIndustry === 'All'
    ? templates
    : templates.filter((t) => {
        if (!t.industry) return false;
        const ind = t.industry.toLowerCase();
        const sel = selectedIndustry.toLowerCase();
        return (
          ind === sel ||
          sel.includes(ind) ||
          ind.includes(sel.split(' ')[0]) ||
          (sel.includes('finance') && ind.includes('finance')) ||
          (sel.includes('health') && (ind.includes('health') || ind.includes('medic'))) ||
          (sel.includes('legal') && ind.includes('legal')) ||
          (sel.includes('tech') && (ind.includes('tech') || ind.includes('software'))) ||
          (sel.includes('beauty') && (ind.includes('beauty') || ind.includes('salon') || ind.includes('spa'))) ||
          (sel.includes('real estate') && ind.includes('estate'))
        );
      });

  return (
    <section className="category-section" id="templates">
      <div className="section-header">
        <div>
          <h2 className="section-title">Industry-Specific Design Templates</h2>
          <p className="section-subtitle">
            Choose from over 4,200+ profession-ready layouts created by expert typographers.
          </p>
        </div>

        {/* Industry Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {industries.map((ind) => (
            <button
              key={ind.name}
              className={`tab-btn ${selectedIndustry === ind.name ? 'active' : ''}`}
              onClick={() => setSelectedIndustry(ind.name)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {ind.icon}
              <span>{ind.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filtered.map((item) => (
          <TemplateCardMockup
            key={item.id}
            template={item}
            onSelect={(selectedTpl) => onSelectTemplate && onSelectTemplate(selectedTpl)}
          />
        ))}
      </div>
    </section>
  );
}
