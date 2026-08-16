import React, { useState } from 'react';
import { Product } from '../types/product';
import {
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Check,
  FileText,
  Info,
  ChevronDown,
} from 'lucide-react';
import HITLValidationModal from './HITLValidationModal';
import { generateProductDatasheet } from '../services/pdfGenerator';
import { api } from '../services/api';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  isDark?: boolean;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  raw:            { label: 'Raw — Not yet AI processed', color: '#94A3B8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.25)' },
  ai_enriched:    { label: 'AI Enriched',                color: '#06B6D4', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.25)'   },
  validated:      { label: 'Human Validated',            color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.25)'  },
  commerce_ready: { label: 'Commerce Ready',             color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)'  },
  flagged:        { label: 'Flagged — Needs Review',     color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)'   },
};

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onBack }) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'attributes' | 'anomalies' | 'audit'>('specs');
  const [showValidation, setShowValidation] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);



  const handleDownloadDatasheet = async () => {
    setDownloadingPDF(true);
    try {
      await generateProductDatasheet(product);
    } catch (e) {
      console.error('PDF generation failed:', e);
    }
    setDownloadingPDF(false);
  };

  const cfg = statusConfig[product.status] || statusConfig.raw;

  const tabs = [
    { id: 'specs',      label: 'Technical Specs',        count: null },
    { id: 'attributes', label: 'AI Extracted Attributes', count: product.attributes.length },
    { id: 'anomalies',  label: 'Anomaly Flags',           count: product.anomalies.length },
    { id: 'audit',      label: 'AI Audit Trail',          count: null },
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 14, fontWeight: 700,
          color: '#60A5FA',
          background: '#1B2433',
          padding: '8px 16px', borderRadius: 8,
          border: '1px solid rgba(56, 189, 248, 0.35)',
          marginBottom: 20, cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      {/* Header card */}
      <div
        className="card"
        style={{ marginBottom: 20, padding: '28px 30px', background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 16 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Status badge */}
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 6,
                  fontSize: 13, fontWeight: 800,
                  color: cfg.color,
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  marginBottom: 12,
                }}
              >
                {cfg.label}
              </span>

              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.4px',
                  marginBottom: 10,
                }}
              >
                {product.name}
              </h1>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 18,
                  fontSize: 15,
                  color: '#94A3B8',
                }}
              >
                <span>
                  SKU:{' '}
                  <strong
                    style={{
                      color: '#38BDF8',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontWeight: 800,
                    }}
                  >
                    {product.sku}
                  </strong>
                </span>
                <span>
                  Manufacturer:{' '}
                  <strong style={{ color: '#FFFFFF', fontWeight: 700 }}>{product.manufacturer}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  Category:{' '}
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <select
                      value={product.category}
                      onChange={(e) => {
                        // Optimistically update the product object for UI responsiveness
                        product.category = e.target.value;
                        // Trigger a re-render to update the display
                        setActiveTab(activeTab); // hack to force re-render
                      }}
                      style={{
                        appearance: 'none',
                        background: 'transparent',
                        border: '1px solid rgba(56, 189, 248, 0.35)',
                        color: '#38BDF8',
                        fontWeight: 700,
                        fontSize: 15,
                        padding: '2px 24px 2px 8px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="Motors & Drives" style={{ background: '#1B2433', color: '#FFFFFF' }}>Motors & Drives</option>
                      <option value="Hydraulics" style={{ background: '#1B2433', color: '#FFFFFF' }}>Hydraulics</option>
                      <option value="Pneumatics" style={{ background: '#1B2433', color: '#FFFFFF' }}>Pneumatics</option>
                      <option value="Electrical" style={{ background: '#1B2433', color: '#FFFFFF' }}>Electrical</option>
                      <option value="Automation" style={{ background: '#1B2433', color: '#FFFFFF' }}>Automation</option>
                    </select>
                    <ChevronDown size={14} color="#38BDF8" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
              <button
                id="btn-validate"
                className="btn btn-primary"
                onClick={() => setShowValidation(true)}
                style={{ fontSize: 14, padding: '10px 20px', fontWeight: 800 }}
              >
                <Sparkles size={16} /> Validate with AI
              </button>

              <button
                id="btn-pdf"
                className="btn btn-secondary"
                onClick={handleDownloadDatasheet}
                disabled={downloadingPDF}
                style={{ fontSize: 14, padding: '10px 20px', fontWeight: 700 }}
              >
                <FileText size={16} />
                {downloadingPDF ? 'Generating...' : 'Download PDF + QR'}
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div
            style={{
              paddingTop: 16,
              borderTop: '1px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Data Completeness
                <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 500 }}>(% fields filled)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    flex: 1, height: 5,
                    background: 'var(--bg)',
                    borderRadius: 3, overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${product.completeness}%`,
                      background: product.completeness >= 80 ? '#10B981' : 'var(--blue)',
                      borderRadius: 3,
                    }}
                  />
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>
                  {product.completeness}%
                </span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Anomaly Flags
                <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 500 }}>(AI-detected issues)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle
                  size={15}
                  color={product.anomalies.length > 0 ? '#F59E0B' : '#10B981'}
                />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                  {product.anomalies.length} flag{product.anomalies.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                AI Engine Used
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--blue)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}>
                <Clock size={13} />
                {product.extractionMethod || 'Gemini 1.5 Multi-Agent'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* Left: Tabs */}
        <div>
          {/* Tab navigation */}
          <div
            style={{
              display: 'flex',
              gap: 0,
              borderBottom: '1px solid var(--border)',
              marginBottom: 20,
              overflow: 'auto',
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '14px 22px',
                  fontSize: 15,
                  fontWeight: 700,
                  color: activeTab === tab.id ? '#6366F1' : 'var(--text-sub)',
                  borderBottom: `3px solid ${activeTab === tab.id ? '#6366F1' : 'transparent'}`,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                {tab.label}
                {tab.count !== null && (
                  <span
                    style={{
                      fontSize: 13, fontWeight: 800,
                      background: activeTab === tab.id ? 'var(--blue-dim)' : 'rgba(255,255,255,0.08)',
                      color: activeTab === tab.id ? '#818CF8' : 'var(--text-muted)',
                      border: `1px solid ${activeTab === tab.id ? 'var(--blue-border)' : 'var(--border)'}`,
                      padding: '2px 7px',
                      borderRadius: 6,
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Specs tab */}
          {activeTab === 'specs' && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
                <Info size={12} style={{ display: 'inline', marginRight: 4 }} />
                Raw technical specifications extracted from the source document. Fields marked N/A were not found in the original text.
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 10,
                }}
              >
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="card"
                    style={{
                      padding: '14px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 15,
                        color: 'var(--text-sub)',
                        textTransform: 'capitalize',
                        fontWeight: 700,
                      }}
                    >
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: value ? '#FFFFFF' : 'var(--text-muted)',
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        padding: '4px 10px',
                        borderRadius: 6,
                        flexShrink: 0,
                        fontStyle: value ? 'normal' : 'italic',
                      }}
                    >
                      {value || 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attributes tab */}
          {activeTab === 'attributes' && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
                <Info size={12} style={{ display: 'inline', marginRight: 4 }} />
                Each attribute shows the AI's extracted value, confidence score (how certain the model is), and the exact quote from the source document that justified the extraction.
              </div>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ minWidth: 560 }}>
                    <thead>
                      <tr>
                        <th>Attribute</th>
                        <th>Extracted Value</th>
                        <th>AI Confidence</th>
                        <th>Source Method</th>
                        <th>Evidence Quote</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.attributes.map((attr, idx) => (
                        <tr key={idx}>
                          <td>
                            <span
                              style={{
                                fontFamily: 'Plus Jakarta Sans, sans-serif',
                                fontSize: 11,
                                color: 'var(--blue)',
                                fontWeight: 600,
                              }}
                            >
                              {attr.key}
                            </span>
                          </td>
                          <td>
                            <span
                              style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}
                            >
                              {attr.value}
                            </span>
                          </td>
                          <td style={{ minWidth: 120 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div
                                style={{
                                  flex: 1,
                                  height: 4,
                                  background: 'var(--bg)',
                                  borderRadius: 2,
                                  overflow: 'hidden',
                                }}
                              >
                                <div
                                  style={{
                                    height: '100%',
                                    width: `${attr.confidence * 100}%`,
                                    background:
                                      attr.confidence > 0.8
                                        ? '#10B981'
                                        : attr.confidence > 0.5
                                        ? 'var(--blue)'
                                        : '#F59E0B',
                                    borderRadius: 2,
                                  }}
                                />
                              </div>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color:
                                    attr.confidence > 0.8
                                      ? 'var(--green)'
                                      : attr.confidence > 0.5
                                      ? 'var(--blue)'
                                      : 'var(--amber)',
                                }}
                              >
                                {Math.round(attr.confidence * 100)}%
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="source-tag">{attr.enrichedBy}</span>
                          </td>
                          <td
                            style={{
                              fontSize: 11,
                              color: 'var(--text-muted)',
                              fontStyle: 'italic',
                              maxWidth: 180,
                            }}
                          >
                            "{attr.sourceQuote}"
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Anomalies tab */}
          {activeTab === 'anomalies' && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
                <Info size={12} style={{ display: 'inline', marginRight: 4 }} />
                Anomalies are data quality issues detected by the AI's Compliance Guard Agent — values that conflict with each other, fall outside engineering norms, or are inconsistent with ISO standards.
              </div>
              {product.anomalies.length === 0 ? (
                <div
                  className="card"
                  style={{ textAlign: 'center', padding: '40px 24px' }}
                >
                  <Check size={32} color="var(--green)" style={{ margin: '0 auto 10px' }} />
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                    No Anomalies Detected
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    All extracted values passed ISO engineering baseline validation.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {product.anomalies.map((anom, idx) => (
                    <div
                      key={idx}
                      className="card"
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 14,
                        padding: '16px 18px',
                        borderLeft: '3px solid var(--amber)',
                      }}
                    >
                      <ShieldAlert
                        size={18}
                        color="var(--amber)"
                        style={{ flexShrink: 0, marginTop: 1 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span
                            style={{
                              fontFamily: 'Plus Jakarta Sans, sans-serif',
                              fontSize: 11,
                              fontWeight: 700,
                              color: 'var(--amber)',
                            }}
                          >
                            {anom.field}
                          </span>
                          <span
                            className={`badge badge-severity-${anom.severity}`}
                            style={{ fontSize: 9 }}
                          >
                            {anom.severity} severity
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                          {anom.issue}
                        </p>
                      </div>
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: 11, flexShrink: 0, opacity: anom.resolved ? 0.5 : 1 }}
                        disabled={anom.resolved}
                        onClick={async () => {
                          try {
                            const updated = await api.resolveAnomaly(product.id, idx);
                            // Optimistically update the local product state with the returned updated product
                            Object.assign(product, updated);
                            setActiveTab(activeTab); // trigger re-render
                          } catch (e) {
                            console.error('Failed to resolve anomaly:', e);
                          }
                        }}
                      >
                        {anom.resolved ? 'Resolved' : 'Mark Resolved'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Audit trail tab */}
          {activeTab === 'audit' && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
                <Info size={12} style={{ display: 'inline', marginRight: 4 }} />
                Complete audit trail of every AI and human action taken on this product record — for traceability and compliance.
              </div>
              <div className="card" style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {product.auditLog.map((log, idx) => (
                    <div
                      key={idx}
                      style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}
                    >
                      <div
                        style={{
                          width: 8, height: 8,
                          borderRadius: '50%',
                          background: 'var(--blue)',
                          marginTop: 5,
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                            {log.action}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            by {log.actor}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          {log.details}
                        </p>
                        <span
                          style={{
                            fontSize: 10,
                            color: 'var(--blue)',
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            marginTop: 4,
                            display: 'block',
                          }}
                        >
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>


      </div>

      {/* Modals */}
      {showValidation && (
        <HITLValidationModal
          product={product}
          onClose={(validated) => {
            if (validated) {
              product.status = 'validated';
            }
            setShowValidation(false);
          }}
        />
      )}

    </div>
  );
};

export default ProductDetailView;
