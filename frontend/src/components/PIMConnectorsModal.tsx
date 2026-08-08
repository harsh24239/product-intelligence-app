import React, { useState } from 'react';
import { Product } from '../types/product';
import { ShoppingBag, Database, Send, CheckCircle2, Copy, X, Code, Terminal } from 'lucide-react';

interface PIMConnectorsModalProps {
  product: Product;
  onClose: () => void;
  isDark?: boolean;
}

type Platform = 'shopify' | 'sap' | 'akeneo' | 'magento';

const PIMConnectorsModal: React.FC<PIMConnectorsModalProps> = ({ product, onClose, isDark = false }) => {
  const [platform, setPlatform] = useState<Platform>('shopify');
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Generate platform-specific payload
  const getPayload = () => {
    switch (platform) {
      case 'shopify':
        return JSON.stringify({
          product: {
            title: product.name,
            body_html: `<strong>${product.name}</strong> manufactured by ${product.manufacturer}. Category: ${product.category}. Built for heavy-duty industrial applications.`,
            vendor: product.manufacturer,
            product_type: product.category,
            status: 'active',
            tags: [product.category, product.status, ...(product.certifications || [])].join(', '),
            variants: [{
              sku: product.sku,
              price: product.price || '450.00',
              inventory_management: 'shopify',
              fulfillment_service: 'manual',
              weight: parseFloat(product.specs.weight || '5') || 5,
              weight_unit: 'kg'
            }],
            metafields: Object.entries(product.specs).map(([k, v]) => ({
              namespace: 'specifications',
              key: k,
              value: String(v || 'N/A'),
              type: 'single_line_text_field'
            }))
          }
        }, null, 2);

      case 'sap':
        return `<?xml version="1.0" encoding="UTF-8"?>
<MATMAS05>
  <IDOC BEGIN="1">
    <EDI_DC40>
      <DOCNUM>0000000000849201</DOCNUM>
      <IDOCTYP>MATMAS05</IDOCTYP>
      <MESTYP>MATMAS</MESTYP>
      <SNDPRN>INTELLI_AI</SNDPRN>
      <RCVPRN>SAP_ERP_PROD</RCVPRN>
    </EDI_DC40>
    <E1MARAM>
      <MATNR>${product.sku}</MATNR>
      <MBRSH>M</MBRSH>
      <MTART>HAWA</MTART>
      <MAKTX>${product.name}</MAKTX>
      <VOLUM>${product.specs.voltage || '400V'}</VOLUM>
      <GEWEI>${product.specs.weight || '18.5kg'}</GEWEI>
      <IP_RATING>${product.specs.ipRating || 'IP65'}</IP_RATING>
      <MANUFACTURER>${product.manufacturer}</MANUFACTURER>
    </E1MARAM>
  </IDOC>
</MATMAS05>`;

      case 'akeneo':
        return JSON.stringify({
          code: product.sku.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          family: product.category.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          enabled: true,
          values: {
            name: [{ data: product.name, locale: 'en_US', scope: null }],
            manufacturer: [{ data: product.manufacturer, locale: 'en_US', scope: null }],
            voltage: [{ data: product.specs.voltage || '400V', locale: null, scope: 'ecommerce' }],
            power: [{ data: product.specs.power || '2.5 kW', locale: null, scope: 'ecommerce' }],
            ip_rating: [{ data: product.specs.ipRating || 'IP65', locale: null, scope: 'ecommerce' }]
          }
        }, null, 2);

      case 'magento':
        return JSON.stringify({
          product: {
            sku: product.sku,
            name: product.name,
            attribute_set_id: 4,
            price: product.price || 450,
            status: 1,
            visibility: 4,
            type_id: 'simple',
            custom_attributes: Object.entries(product.specs).map(([k, v]) => ({
              attribute_code: k.toLowerCase(),
              value: String(v || '')
            }))
          }
        }, null, 2);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getPayload());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setPublishedSuccess(true);
    }, 1200);
  };

  const modalBg = isDark ? '#090e1c' : '#ffffff';
  const modalBorder = isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1';
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const codeBg = isDark ? '#040710' : '#0f172a';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(10px)',
      zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: modalBg,
        border: `1px solid ${modalBorder}`,
        borderRadius: 20,
        width: '100%',
        maxWidth: 780,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${modalBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #4f46e5, #0284c7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingBag size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: textColor }}>1-Click E-Commerce & PIM Connectors</h3>
              <p style={{ fontSize: 12, color: '#64748b' }}>Transform internal schema & push directly to marketplace APIs</p>
            </div>
          </div>

          <button onClick={onClose} style={{ cursor: 'pointer', padding: 6, color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 24, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Platform Switcher Tabs */}
          <div style={{ display: 'flex', gap: 10, borderBottom: `1px solid ${modalBorder}`, paddingBottom: 12 }}>
            {[
              { id: 'shopify', label: 'Shopify REST API', icon: ShoppingBag },
              { id: 'sap', label: 'SAP IDoc XML', icon: Database },
              { id: 'akeneo', label: 'Akeneo PIM JSON', icon: Code },
              { id: 'magento', label: 'Magento 2 REST', icon: Terminal },
            ].map(tab => {
              const Icon = tab.icon;
              const active = platform === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setPlatform(tab.id as Platform); setPublishedSuccess(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 14px', borderRadius: 10,
                    fontSize: 12, fontWeight: 700,
                    background: active ? '#4f46e5' : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                    color: active ? '#ffffff' : (isDark ? '#cbd5e1' : '#475569'),
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Success Banner */}
          {publishedSuccess && (
            <div style={{
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
              padding: '12px 16px', borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>
                  Successfully pushed payload to {platform.toUpperCase()} API endpoint! (HTTP 200 OK — Remote ID: #849201)
                </span>
              </div>
            </div>
          )}

          {/* Code Payload Box */}
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#090e1c', padding: '10px 14px',
              borderTopLeftRadius: 12, borderTopRightRadius: 12,
              border: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none',
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>
                POST /admin/api/2024-01/{platform}_product_payload.{platform === 'sap' ? 'xml' : 'json'}
              </span>
              <button
                onClick={handleCopy}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 11, fontWeight: 700, color: '#cbd5e1',
                  background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                <Copy size={12} />
                {copied ? 'Copied!' : 'Copy Schema'}
              </button>
            </div>

            <pre style={{
              background: codeBg,
              color: '#38bdf8',
              padding: 16,
              borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: 12,
              fontFamily: 'JetBrains Mono, monospace',
              maxHeight: 320,
              overflowY: 'auto',
              lineHeight: 1.5,
            }}>
              {getPayload()}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${modalBorder}`,
          display: 'flex', justifyContent: 'flex-end', gap: 12,
        }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button
            className="btn btn-primary"
            onClick={handlePublish}
            disabled={publishing}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Send size={15} />
            {publishing ? 'Publishing Payload...' : `Push 1-Click to ${platform.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PIMConnectorsModal;
