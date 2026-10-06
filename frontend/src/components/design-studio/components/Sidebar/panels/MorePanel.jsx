import React from 'react';
import { QrCode, FileText, ShieldCheck, Check, Plus, Share2 } from 'lucide-react';

export default function MorePanel({
  fields = {},
  qrType,
  setQrType,
  qrInput,
  setQrInput,
  handleAddQrCode,
  paperStock,
  finishType,
  handleDownloadVCard,
  dimensionUnit,
  setDimensionUnit,
}) {
  return (
    <>
      <div className="vp-studio-panel-header">
        <h3>More Options &amp; Tools</h3>
      </div>

      <div className="vp-studio-panel-body" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        {/* 1. Dynamic QR Code Generator */}
        <div className="vp-more-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <QrCode size={16} color="#0099ff" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Dynamic Card QR Code</span>
          </div>
          <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 10px 0' }}>
            Generate a high-contrast QR code for instant smartphone scanning:
          </p>

          {/* QR Code Type Pills */}
          <div className="vp-filter-tabs-row" style={{ marginBottom: '8px' }}>
            {[
              { id: 'url', label: 'Website' },
              { id: 'whatsapp', label: 'WhatsApp' },
              { id: 'phone', label: 'Phone' },
              { id: 'vcard', label: 'vCard' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                className={`vp-filter-tab-pill ${qrType === t.id ? 'active' : ''}`}
                onClick={() => {
                  if (setQrType) setQrType(t.id);
                  if (setQrInput) {
                    if (t.id === 'url') setQrInput(fields.web ? (fields.web.startsWith('http') ? fields.web : `https://${fields.web}`) : 'https://asapnow.in');
                    if (t.id === 'whatsapp') setQrInput(fields.phone ? `https://wa.me/${fields.phone.replace(/[^0-9]/g, '')}` : 'https://wa.me/919876543210');
                    if (t.id === 'phone') setQrInput(fields.phone ? `tel:${fields.phone}` : 'tel:+919876543210');
                    if (t.id === 'vcard') setQrInput(`MECARD:N:${fields.fullName || 'Contact'};ORG:${fields.companyName || ''};TEL:${fields.phone || ''};EMAIL:${fields.email || ''};;`);
                  }
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div style={{ marginBottom: '8px' }}>
            <input
              type="text"
              className="vp-studio-text-input"
              value={qrInput || ''}
              onChange={(e) => setQrInput && setQrInput(e.target.value)}
              placeholder={
                qrType === 'url' ? 'https://yourwebsite.com' :
                  qrType === 'whatsapp' ? 'https://wa.me/91XXXXXXXXXX' :
                    qrType === 'phone' ? 'tel:+919876543210' : 'MECARD contact data'
              }
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          {/* Live QR Preview Box */}
          <div className="vp-qr-preview-box">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(qrInput || 'https://asapnow.in')}`}
              alt="Card QR Preview"
              style={{ width: '100px', height: '100px', borderRadius: '4px' }}
            />
            <span style={{ fontSize: '10px', color: '#64748b', marginTop: '6px' }}>Live QR Preview</span>
          </div>

          {/* Add to Card Button */}
          <button
            type="button"
            className="vp-studio-add-text-btn"
            style={{ width: '100%', justifyContent: 'center', background: '#0099ff', color: '#ffffff' }}
            onClick={() => handleAddQrCode && handleAddQrCode(qrInput)}
          >
            <Plus size={14} /> + Add QR Code to Card
          </button>
        </div>

        {/* 2. Digital vCard Contact */}
        <div className="vp-more-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <FileText size={16} color="#16a34a" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Digital Business Card (.vcf)</span>
          </div>
          <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 10px 0' }}>
            Export a digital contact card for Apple iOS Contacts &amp; Android Address Book:
          </p>
          <button
            type="button"
            className="vp-studio-add-text-btn"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleDownloadVCard}
          >
            <Share2 size={14} /> Download Digital vCard
          </button>
        </div>

        {/* 3. Commercial Print Readiness Checklist */}
        <div className="vp-more-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <ShieldCheck size={16} color="#059669" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Print Quality Guarantee</span>
          </div>
          <div className="vp-checklist-item">
            <Check size={14} color="#16a34a" />
            <span><strong>Resolution:</strong> 300 DPI Ultra High Definition</span>
          </div>
          <div className="vp-checklist-item">
            <Check size={14} color="#16a34a" />
            <span><strong>Bleed Margin:</strong> 1mm cutting safety area calibrated</span>
          </div>
          <div className="vp-checklist-item">
            <Check size={14} color="#16a34a" />
            <span><strong>Color Mode:</strong> Commercial CMYK Offset verified</span>
          </div>
          <div className="vp-checklist-item">
            <Check size={14} color="#16a34a" />
            <span><strong>Paper Stock:</strong> {paperStock || 'Standard'} with {finishType || 'Matte'} finish</span>
          </div>
        </div>
      </div>
    </>
  );
}
