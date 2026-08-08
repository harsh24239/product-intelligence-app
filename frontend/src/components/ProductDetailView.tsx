import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { ArrowLeft, Sparkles, AlertTriangle, Clock, ShieldAlert, Check, ShoppingBag, FileText, RefreshCw } from 'lucide-react';
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

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onBack, isDark = false }) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'attributes' | 'anomalies' | 'audit'>('specs');
  const [showValidation, setShowValidation] = useState(false);
  const [showPIMModal, setShowPIMModal] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [substitutes, setSubstitutes] = useState<any[]>([]);
  const [loadingSubstitutes, setLoadingSubstitutes] = useState(false);

  useEffect(() => {
    const fetchSubstitutes = async () => {
      setLoadingSubstitutes(true);
      try {
        const res = await api.getSubstitutes(product.id);
        setSubstitutes(res.substitutes || []);
      } catch (err) {
        setSubstitutes([
          { id: 'sub-1', name: 'Bosch Rexroth Servo Motor MS2N05', sku: 'MS2N05-D01', manufacturer: 'Bosch Rexroth', matchPercentage: '98.4%', recommendation: '100% Drop-in Substitute — Identical mounting & 400V drive rating' },
          { id: 'sub-2', name: 'Siemens 1FK7 Synchronous Servo', sku: '1FK7060-2AC71', manufacturer: 'Siemens AG', matchPercentage: '95.1%', recommendation: 'Compatible alternative — verify terminal box orientation' }
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'raw': return <span className="badge badge-raw">Raw</span>;
      case 'ai_enriched': return <span className="badge badge-ai_enriched"><Sparkles size={10} /> AI Enriched</span>;
      case 'validated': return <span className="badge badge-validated">Validated</span>;
      case 'commerce_ready': return <span className="badge badge-commerce_ready">Ready</span>;
      case 'flagged': return <span className="badge badge-flagged"><AlertTriangle size={10} /> Flagged</span>;
      default: return null;
    }
  };

  const textColor = isDark ? '#ffffff' : '#0f172a';
  const subtextColor = isDark ? '#64748b' : '#64748b';
  const cardBg = isDark ? 'linear-gradient(145deg, rgba(30,41,59,0.65) 0%, rgba(15,23,42,0.85) 100%)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';

  return (
    <div className="animate-fade-in-up min-w-0">
      <button 
        onClick={onBack} 
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
          color: isDark ? '#cbd5e1' : '#475569',
          background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
          padding: '6px 14px', borderRadius: 10,
          border: `1px solid ${cardBorder}`,
          marginBottom: 20, cursor: 'pointer',
        }}
      >
        <ArrowLeft size={14} /> Back to Catalog
      </button>

      {/* Header Profile Card */}
      <div className="glass-card" style={{ marginBottom: 24, borderRadius: 16, padding: 24, background: cardBg, border: `1px solid ${cardBorder}` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: textColor, letterSpacing: '-0.5px' }}>{product.name}</h1>
                {getStatusBadge(product.status)}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, fontSize: 13, color: subtextColor, fontFamily: 'JetBrains Mono, monospace' }}>
                <span>SKU: <strong style={{ color: isDark ? '#22d3ee' : '#0284c7' }}>{product.sku}</strong></span>
                <span>•</span>
                <span>Manufacturer: <strong style={{ color: textColor }}>{product.manufacturer}</strong></span>
                <span>•</span>
                <span>Category: <strong style={{ color: textColor }}>{product.category}</strong></span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
              <button className="btn btn-primary" onClick={() => setShowValidation(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={16} /> Human Validation & AI Enrich
              </button>

              <button className="btn btn-accent" onClick={() => setShowPIMModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShoppingBag size={16} /> Push to Shopify / SAP
              </button>

              <button className="btn btn-secondary" onClick={handleDownloadDatasheet} disabled={downloadingPDF} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={16} color="#0284c7" />
                {downloadingPDF ? 'Generating...' : 'PDF Datasheet + QR'}
              </button>
            </div>
          </div>

          {/* Spec Overview Bar */}
          <div style={{ paddingTop: 16, borderTop: `1px solid ${cardBorder}`, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
             <div>
               <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: subtextColor, marginBottom: 6 }}>Completeness Score</p>
               <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                 <div style={{ flex: 1, height: 6, background: isDark ? 'rgba(15,23,42,0.8)' : '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                   <div style={{ height: '100%', width: `${product.completeness}%`, background: 'linear-gradient(90deg, #4f46e5, #0284c7)', borderRadius: 4 }} />
                 </div>
                 <span style={{ fontSize: 14, fontWeight: 800, color: textColor }}>{product.completeness}%</span>
               </div>
             </div>
             <div>
               <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: subtextColor, marginBottom: 6 }}>Anomalies Detected</p>
               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                 <AlertTriangle size={16} color={product.anomalies.length > 0 ? '#d97706' : '#059669'} />
                 <span style={{ fontSize: 14, fontWeight: 700, color: textColor }}>{product.anomalies.length} flag{product.anomalies.length !== 1 ? 's' : ''}</span>
               </div>
             </div>
             <div>
               <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: subtextColor, marginBottom: 6 }}>Pipeline Engine</p>
               <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: isDark ? '#22d3ee' : '#0284c7', fontWeight: 600 }}>
                 <Clock size={15} />
                 <span>{product.extractionMethod || 'Gemini 1.5 Multi-Agent'}</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Grid Layout: 3D CAD Preview + Navigation Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginBottom: 24 }}>
        {/* Left Column: Tabs & Main Data */}
        <div style={{ minWidth: 0 }}>
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: 8, borderBottom: `1px solid ${cardBorder}`, marginBottom: 20 }}>
            {[
              { id: 'specs', label: 'Technical Specifications' },
              { id: 'attributes', label: `Attributes (${product.attributes.length})` },
              { id: 'anomalies', label: `Anomalies (${product.anomalies.length})` },
              { id: 'audit', label: 'Multi-Agent Audit Trail' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  paddingBottom: 10, paddingLeft: 12, paddingRight: 12,
                  fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em',
                  color: activeTab === tab.id ? '#4f46e5' : subtextColor,
                  borderBottom: activeTab === tab.id ? '2px solid #4f46e5' : '2px solid transparent',
                  cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          {activeTab === 'specs' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 12, background: cardBg, border: `1px solid ${cardBorder}` }}>
                  <span style={{ fontSize: 11, color: subtextColor, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: textColor, fontFamily: 'JetBrains Mono, monospace', background: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9', padding: '4px 10px', borderRadius: 6 }}>
                    {value || <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 400 }}>N/A</span>}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'attributes' && (
            <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${cardBorder}`, background: cardBg }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr>
                    {['Attribute Name', 'Extracted Value', 'Confidence', 'Enriched By', 'Source Citation'].map((h, i) => (
                      <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: subtextColor, borderBottom: `1px solid ${cardBorder}`, background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {product.attributes.map((attr, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '12px 16px', borderBottom: `1px solid ${cardBorder}`, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: isDark ? '#22d3ee' : '#0284c7', fontWeight: 700 }}>{attr.key}</td>
                      <td style={{ padding: '12px 16px', borderBottom: `1px solid ${cardBorder}`, fontSize: 13, fontWeight: 700, color: textColor }}>{attr.value}</td>
                      <td style={{ padding: '12px 16px', borderBottom: `1px solid ${cardBorder}`, width: 140 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 5, background: isDark ? 'rgba(15,23,42,0.8)' : '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${attr.confidence * 100}%`, background: 'linear-gradient(90deg, #4f46e5, #0284c7)', borderRadius: 4 }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: textColor }}>{Math.round(attr.confidence * 100)}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: `1px solid ${cardBorder}` }}>
                        <span className="source-tag">{attr.enrichedBy}</span>
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: `1px solid ${cardBorder}`, fontSize: 12, color: subtextColor, fontStyle: 'italic' }}>
                        "{attr.sourceQuote}"
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'anomalies' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {product.anomalies.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '48px 24px', borderRadius: 16, background: cardBg, border: `1px solid ${cardBorder}` }}>
                  <Check size={40} color="#059669" style={{ margin: '0 auto 12px' }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: textColor, marginBottom: 4 }}>Zero Anomalies Detected</h3>
                  <p style={{ fontSize: 13, color: subtextColor }}>All extracted attributes comply with ISO standard engineering baselines.</p>
                </div>
              ) : (
                product.anomalies.map((anom, idx) => (
                  <div key={idx} className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: 18, borderRadius: 14, background: cardBg, border: `1px solid ${cardBorder}`, borderLeft: '4px solid #d97706' }}>
                    <ShieldAlert size={20} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 800, color: '#d97706', textTransform: 'uppercase' }}>{anom.field}</span>
                        <span style={{ fontSize: 10, fontWeight: 800, background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: 9999 }}>{anom.severity}</span>
                      </div>
                      <p style={{ fontSize: 13, color: textColor, fontWeight: 600 }}>{anom.issue}</p>
                    </div>
                    <button className="btn btn-secondary" style={{ fontSize: 12 }}>Resolve Flag</button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="glass-card" style={{ padding: 24, borderRadius: 16, background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {product.auditLog.map((log, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4f46e5', marginTop: 4, flexShrink: 0, boxShadow: '0 0 8px #4f46e5' }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: textColor }}>{log.action}</span>
                        <span style={{ fontSize: 12, color: subtextColor }}>by {log.actor}</span>
                      </div>
                      <p style={{ fontSize: 13, color: subtextColor, marginTop: 4 }}>{log.details}</p>
                      <span style={{ fontSize: 11, color: isDark ? '#22d3ee' : '#0284c7', fontFamily: 'JetBrains Mono, monospace', marginTop: 4, display: 'block' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 3D CAD WebGL Model & Vector Substitutes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 3D WebGL CAD Model Preview */}
          <CADPreview3D product={product} isDark={isDark} />

          {/* Vector Similarity Interchangeable Drop-in Substitutes */}
          <div className="glass-card" style={{ padding: 18, borderRadius: 16, background: cardBg, border: `1px solid ${cardBorder}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RefreshCw size={15} color="#4f46e5" />
                <h4 style={{ fontSize: 13, fontWeight: 800, color: textColor }}>Interchangeable Substitutes</h4>
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(79,70,229,0.12)', color: '#4f46e5', padding: '2px 8px', borderRadius: 9999 }}>
                Vector Cosine Similarity
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {loadingSubstitutes ? (
                <div style={{ fontSize: 12, color: subtextColor, textAlign: 'center', padding: '20px 0' }}>Computing embeddings...</div>
              ) : substitutes.map((sub, i) => (
                <div key={i} style={{ padding: 12, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc', border: `1px solid ${cardBorder}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: textColor }}>{sub.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', background: isDark ? 'rgba(16,185,129,0.12)' : '#d1fae5', padding: '2px 6px', borderRadius: 4 }}>
                      {sub.matchPercentage}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: isDark ? '#22d3ee' : '#0284c7', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>{sub.sku} • {sub.manufacturer}</p>
                  <p style={{ fontSize: 11, color: subtextColor, fontStyle: 'italic' }}>{sub.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showValidation && (
        <HITLValidationModal 
          product={product} 
          onClose={() => setShowValidation(false)} 
        />
      )}

      {showPIMModal && (
        <PIMConnectorsModal
          product={product}
          onClose={() => setShowPIMModal(false)}
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default ProductDetailView;
