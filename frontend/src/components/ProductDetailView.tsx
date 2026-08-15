import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import {
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Check,
  ShoppingBag,
  FileText,
  RefreshCw,
  Info,
  ChevronDown,
} from 'lucide-react';
import HITLValidationModal from './HITLValidationModal';
import CADPreview3D from './CADPreview3D';
import PIMConnectorsModal from './PIMConnectorsModal';
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
  const [showPIMModal, setShowPIMModal] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [substitutes, setSubstitutes] = useState<any[]>([]);
  const [loadingSubstitutes, setLoadingSubstitutes] = useState(false);
  const [showCAD, setShowCAD] = useState(false);

  useEffect(() => {
    const fetchSubstitutes = async () => {
      setLoadingSubstitutes(true);
      try {
        const res = await api.getSubstitutes(product.id);
        setSubstitutes(res.substitutes || []);
      } catch {
        setSubstitutes([
          {
            id: 'sub-1',
            name: 'Bosch Rexroth Servo Motor MS2N05',
            sku: 'MS2N05-D01',
            manufacturer: 'Bosch Rexroth',
            matchPercentage: '98.4%',
            recommendation: '100% Drop-in — identical mounting & voltage rating',
          },
          {
            id: 'sub-2',
            name: 'Siemens 1FK7 Synchronous Servo',
            sku: '1FK7060-2AC71',
            manufacturer: 'Siemens AG',
            matchPercentage: '95.1%',
            recommendation: 'Compatible — verify terminal box orientation',
          },
        ]);
      }
      setLoadingSubstitutes(false);
    };
    fetchSubstitutes();
  }, [product.id]);

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
                        product.category = e.target.value;
                        setActiveTab(activeTab);
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
                      {[
                        'Sanding Belt', 'Sanding Disc', 'Cut-Off Disc', 'Grinding Wheel',
                        'Dishwasher', 'Dryer', 'Washer', 'Refrigerator', 'Range',
                        'Decking', 'Fascia', 'Railing', 'Threshold', 'Skylight',
                        'Sponge', 'Tape', 'Kneeling Pad', 'Item',
                      ].map(cat => (
                        <option key={cat} value={cat} style={{ background: '#1B2433', color: '#FFFFFF' }}>{cat}</option>
                      ))}
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
                id="btn-push-pim"
                className="btn btn-accent"
                onClick={() => setShowPIMModal(true)}
                style={{ fontSize: 14, padding: '10px 20px', fontWeight: 800 }}
              >
                <ShoppingBag size={16} /> Export Structured Data
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
              borderTop: '1px solid rgba(56, 189, 248, 0.25)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                Data Completeness
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 7, background: '#0B0F17', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${product.completeness}%`, background: product.completeness >= 80 ? '#10B981' : '#3B82F6', borderRadius: 4 }} />
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>{product.completeness}%</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                Anomaly Flags
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: product.anomalies.length > 0 ? '#FBBF24' : '#34D399' }}>
                  {product.anomalies.length}
                </span>
                <span style={{ fontSize: 14, color: '#94A3B8' }}>
                  {product.anomalies.length === 0 ? 'All clear' : `flag${product.anomalies.length !== 1 ? 's' : ''} detected`}
                </span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                Enrichment Method
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#38BDF8' }}>
                {product.extractionMethod === 'unilog_rules_engine_v2' ? 'Unilog Rules Engine v2' : product.extractionMethod || 'Rules Engine'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                Attributes Extracted
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>{product.attributes?.length || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
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
                  padding: '12px 20px',
                  fontSize: 14,
                  fontWeight: 700,
                  color: activeTab === tab.id ? '#6366F1' : 'var(--text-sub)',
                  borderBottom: `3px solid ${activeTab === tab.id ? '#6366F1' : 'transparent'}`,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {tab.label}
                {tab.count !== null && (
                  <span
                    style={{
                      fontSize: 11, fontWeight: 800,
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
              <div style={{ fontSize: 14, color: '#94A3B8', marginBottom: 16, lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Info size={14} />
                Raw technical specifications extracted from the source. Fields showing N/A were not found in the original data.
              </div>
              {Object.entries(product.specs || {}).filter(([_, v]) => v).length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '32px 24px', color: '#94A3B8' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>No raw specs available</div>
                  <div style={{ fontSize: 14 }}>Switch to the <strong style={{ color: '#60A5FA' }}>AI Extracted Attributes</strong> tab to see all enriched data.</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                  {Object.entries(product.specs || {}).map(([key, value]) => (
                    <div
                      key={key}
                      className="card"
                      style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.25)' }}
                    >
                      <span style={{ fontSize: 14, color: '#94A3B8', textTransform: 'capitalize', fontWeight: 700 }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: value ? '#FFFFFF' : '#475569', background: '#0B0F17', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '5px 12px', borderRadius: 6, flexShrink: 0 }}>
                        {value || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Attributes tab */}
          {activeTab === 'attributes' && (
            <div>
              <div style={{ fontSize: 14, color: '#94A3B8', marginBottom: 16, lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Info size={14} />
                Each attribute shows the enriched value, AI confidence score, and the extraction method that produced it.
              </div>
              {product.attributes?.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>No attributes extracted</div>
                  <div style={{ fontSize: 14 }}>Run the enrichment pipeline again to extract attributes from this product's description.</div>
                </div>
              ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden', background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ minWidth: 560 }}>
                      <thead>
                        <tr style={{ background: '#0B0F17' }}>
                          <th style={{ fontSize: 13, padding: '14px 18px' }}>Attribute Label</th>
                          <th style={{ fontSize: 13, padding: '14px 18px' }}>Extracted Value</th>
                          <th style={{ fontSize: 13, padding: '14px 18px' }}>AI Confidence</th>
                          <th style={{ fontSize: 13, padding: '14px 18px' }}>Source Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(product.attributes || []).map((attr, idx) => (
                          <tr key={idx}>
                            <td style={{ padding: '14px 18px' }}>
                              <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, color: '#38BDF8', fontWeight: 700 }}>
                                {attr.key}
                              </span>
                            </td>
                            <td style={{ padding: '14px 18px' }}>
                              <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>{attr.value}</span>
                            </td>
                            <td style={{ padding: '14px 18px', minWidth: 130 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ flex: 1, height: 6, background: '#0B0F17', borderRadius: 3, overflow: 'hidden' }}>
                                  <div style={{
                                    height: '100%',
                                    width: `${attr.confidence > 1 ? attr.confidence : attr.confidence * 100}%`,
                                    background: attr.confidence > 0.8 || attr.confidence > 80 ? '#10B981' : '#38BDF8',
                                    borderRadius: 3,
                                  }} />
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>
                                  {attr.confidence > 1 ? Math.round(attr.confidence) : Math.round(attr.confidence * 100)}%
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: '14px 18px' }}>
                              <span className="source-tag">{attr.enrichedBy || 'rules_engine'}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Anomalies tab */}
          {activeTab === 'anomalies' && (
            <div>
              <div style={{ fontSize: 14, color: '#94A3B8', marginBottom: 16, lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Info size={14} />
                Anomalies are data quality issues detected during enrichment — missing units, unresolvable placeholders, or conflicting values.
              </div>
              {product.anomalies.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px 24px', background: '#1B2433', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
                  <Check size={36} color="#34D399" style={{ margin: '0 auto 12px' }} />
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginBottom: 6 }}>No Anomalies Detected</h3>
                  <p style={{ fontSize: 15, color: '#94A3B8' }}>All extracted values passed enrichment quality validation.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {product.anomalies.map((anom, idx) => (
                    <div
                      key={idx}
                      className="card"
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 20px', borderLeft: '4px solid #FBBF24', background: '#1B2433' }}
                    >
                      <ShieldAlert size={20} color="#FBBF24" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#FBBF24', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', padding: '3px 10px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {anom.severity} severity
                          </span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#38BDF8', fontFamily: 'monospace' }}>{anom.field}</span>
                        </div>
                        <p style={{ fontSize: 15, color: '#E2E8F0', lineHeight: 1.6 }}>{anom.issue}</p>
                      </div>
                      <button
                        className="btn btn-accent"
                        style={{ fontSize: 13, flexShrink: 0, padding: '8px 16px' }}
                        onClick={() => {
                          product.anomalies = product.anomalies.filter((_, i) => i !== idx);
                          setActiveTab(activeTab);
                        }}
                      >
                        Mark Resolved
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
              <div style={{ fontSize: 14, color: '#94A3B8', marginBottom: 16, lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Info size={14} />
                Complete audit trail of every enrichment action taken on this product record.
              </div>
              <div className="card" style={{ padding: '22px 24px', background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {(product.auditLog || []).map((log, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#38BDF8', marginTop: 4, flexShrink: 0, boxShadow: '0 0 6px rgba(56, 189, 248, 0.6)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>{log.action}</span>
                          <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>by {log.actor}</span>
                        </div>
                        <p style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.6 }}>{log.details}</p>
                        <span style={{ fontSize: 13, color: '#38BDF8', marginTop: 4, display: 'block', fontWeight: 600 }}>
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

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Right sidebar panels */}

          {/* Enriched Descriptions Panel */}
          <div className="card" style={{ background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Generated Descriptions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'INVOICE_DESC', val: product.hackathonEnriched?.INVOICE_DESC || '—' },
                { label: 'MOBILE_DESC', val: product.hackathonEnriched?.MOBILE_DESC || '—' },
                { label: 'SHORT_DESC', val: product.hackathonEnriched?.SHORT_DESC || product.name || '—' },
              ].map((d, i) => (
                <div key={i} style={{ background: '#0B0F17', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 5 }}>{d.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.5 }}>{d.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D CAD Preview collapsible */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)' }}>
            <button
              onClick={() => setShowCAD(!showCAD)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '14px 18px', cursor: 'pointer', borderBottom: showCAD ? '1px solid rgba(56, 189, 248, 0.25)' : 'none' }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 2 }}>3D CAD Preview</div>
                <div style={{ fontSize: 13, color: '#94A3B8' }}>Interactive WebGL model from extracted specs</div>
              </div>
              <ChevronDown size={18} color="#94A3B8" style={{ transform: showCAD ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {showCAD && (
              <div style={{ padding: 12 }}>
                <CADPreview3D product={product} isDark={true} />
              </div>
            )}
          </div>

          {/* Quick export panel */}
          <div className="card" style={{ background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>Export This Record</div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>Download or push this enriched product record</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="btn btn-primary"
                onClick={() => setShowPIMModal(true)}
                style={{ fontSize: 14, width: '100%', justifyContent: 'flex-start', padding: '12px 16px' }}
              >
                <ShoppingBag size={16} />
                Export Structured Data
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleDownloadDatasheet}
                disabled={downloadingPDF}
                style={{ fontSize: 14, width: '100%', justifyContent: 'flex-start', padding: '12px 16px' }}
              >
                <FileText size={16} />
                {downloadingPDF ? 'Generating PDF…' : 'Download PDF Datasheet'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showValidation && (
        <HITLValidationModal product={product} onClose={() => setShowValidation(false)} />
      )}
      {showPIMModal && (
        <PIMConnectorsModal product={product} onClose={() => setShowPIMModal(false)} isDark={true} />
      )}
    </div>
  );
};

export default ProductDetailView;
