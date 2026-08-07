import React, { useState } from 'react';
import { Product } from '../types/product';
import { ArrowLeft, Sparkles, CheckCircle2, Download, AlertTriangle, Clock, ShieldAlert, Check } from 'lucide-react';
import HITLValidationModal from './HITLValidationModal';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onBack }) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'attributes' | 'anomalies' | 'audit'>('specs');
  const [showValidation, setShowValidation] = useState(false);

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

  return (
    <div className="animate-fade-in-up min-w-0">
      <button 
        onClick={onBack} 
        className="inline-flex items-center gap-2 text-gray hover:text-white mb-6 transition-colors font-semibold text-xs uppercase tracking-wider bg-[rgba(255,255,255,0.04)] px-3 py-1.5 rounded-xl border border-[rgba(255,255,255,0.08)]"
      >
        <ArrowLeft size={14} /> Back to Catalog
      </button>

      {/* Header Profile Card */}
      <div className="glass-card mb-6 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-extrabold text-white leading-tight tracking-tight">{product.name}</h1>
              {getStatusBadge(product.status)}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray font-mono">
              <span>SKU: <strong className="text-cyan-300 font-bold">{product.sku}</strong></span>
              <span>•</span>
              <span>Manufacturer: <strong className="text-white">{product.manufacturer}</strong></span>
              <span>•</span>
              <span>Category: <strong className="text-white">{product.category}</strong></span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button className="btn btn-primary text-xs" onClick={() => setShowValidation(true)}>
              <Sparkles size={16} /> Human Validation & AI Enrich
            </button>
            <button className="btn btn-accent text-xs">
              <CheckCircle2 size={16} /> Publish Commerce Specs
            </button>
            <button className="btn btn-secondary p-2.5 rounded-xl" title="Export Specs JSON/CSV">
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Spec Overview Bar */}
        <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.08)] grid grid-cols-1 sm:grid-cols-3 gap-6">
           <div>
             <p className="text-xs text-gray mb-1.5 font-bold uppercase tracking-wider">Completeness Score</p>
             <div className="flex items-center gap-3">
               <div className="confidence-container flex-1">
                 <div className="confidence-bar" style={{ width: `${product.completeness}%`, background: 'var(--gradient-emerald)' }} />
               </div>
               <span className="font-extrabold text-white text-sm">{product.completeness}%</span>
             </div>
           </div>
           <div>
             <p className="text-xs text-gray mb-1.5 font-bold uppercase tracking-wider">Anomalies Detected</p>
             <div className="flex items-center gap-2">
               <AlertTriangle size={16} className={product.anomalies.length > 0 ? "text-amber-400" : "text-emerald-400"} />
               <span className="font-bold text-white text-sm">{product.anomalies.length} flag{product.anomalies.length !== 1 ? 's' : ''}</span>
             </div>
           </div>
           <div>
             <p className="text-xs text-gray mb-1.5 font-bold uppercase tracking-wider">Last Pipeline Sync</p>
             <div className="flex items-center gap-2 font-mono">
               <Clock size={16} className="text-cyan-400" />
               <span className="text-xs text-white">{new Date(product.lastUpdated).toLocaleString()}</span>
             </div>
           </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-[rgba(255,255,255,0.08)] mb-6 overflow-x-auto">
        {[
          { id: 'specs', label: 'Technical Specifications' },
          { id: 'attributes', label: 'LLM Attributes & Citation Traceability' },
          { id: 'anomalies', label: `Anomaly Flags (${product.anomalies.length})` },
          { id: 'audit', label: 'Audit Trail' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap border-b-2 ${
              activeTab === tab.id 
                ? 'border-cyan-400 text-cyan-400' 
                : 'border-transparent text-gray hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'specs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className="glass-card flex justify-between items-center p-4 rounded-xl">
              <span className="text-xs text-gray uppercase font-bold tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="text-xs font-semibold text-white font-mono bg-[rgba(255,255,255,0.04)] px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)]">
                {value || <span className="text-gray italic font-normal">N/A</span>}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'attributes' && (
        <div className="glass-card-dark overflow-hidden p-0 rounded-2xl border border-[rgba(255,255,255,0.08)]">
          <div className="overflow-x-auto w-full">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Attribute Name</th>
                  <th>Extracted Value</th>
                  <th>Confidence Spectrum</th>
                  <th>Extraction Engine</th>
                  <th>PDF/Doc Source Citation</th>
                </tr>
              </thead>
              <tbody>
                {product.attributes.map((attr, idx) => (
                  <tr key={idx}>
                    <td className="font-mono text-cyan-300 text-xs font-bold">{attr.key}</td>
                    <td className="font-bold text-white text-sm">{attr.value}</td>
                    <td className="w-40">
                      <div className="flex items-center gap-2">
                        <div className="confidence-container flex-1">
                          <div 
                            className="confidence-bar" 
                            style={{ 
                              width: `${attr.confidence * 100}%`,
                              background: attr.confidence > 0.8 ? 'var(--gradient-emerald)' : attr.confidence > 0.6 ? 'var(--gradient-primary)' : 'var(--gradient-violet)'
                            }} 
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-white">{Math.round(attr.confidence * 100)}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="source-tag">{attr.enrichedBy}</span>
                    </td>
                    <td className="max-w-xs">
                      <p className="text-xs text-white italic truncate" title={attr.sourceQuote}>"{attr.sourceQuote}"</p>
                      <p className="text-[10px] text-gray mt-0.5 font-mono">{attr.source}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'anomalies' && (
        <div className="space-y-4">
          {product.anomalies.length === 0 ? (
            <div className="glass-card text-center py-14 rounded-2xl">
              <Check size={44} className="mx-auto mb-3 text-emerald-400" />
              <h3 className="text-lg font-bold text-white mb-1">Zero Anomalies Detected</h3>
              <p className="text-gray text-sm">All extracted attributes comply with ISO standard baselines.</p>
            </div>
          ) : (
            product.anomalies.map((anom, idx) => (
              <div key={idx} className="glass-card flex items-start gap-4 p-5 rounded-2xl border-l-4 border-l-amber-500">
                <ShieldAlert size={22} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-amber-300 uppercase font-bold">{anom.field}</span>
                    <span className={`badge badge-severity-${anom.severity}`}>{anom.severity}</span>
                  </div>
                  <p className="text-sm text-white font-medium">{anom.issue}</p>
                </div>
                <button className="btn btn-secondary text-xs shrink-0">Resolve Flag</button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="glass-card p-6 rounded-2xl">
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[rgba(255,255,255,0.08)]">
            {product.auditLog.map((log, idx) => (
              <div key={idx} className="relative flex gap-4 items-start pl-8">
                <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-cyan-400 border-4 border-[#090e1a] shadow-[0_0_10px_#22d3ee]"></div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{log.action}</span>
                    <span className="text-xs text-gray">by {log.actor}</span>
                  </div>
                  <p className="text-xs text-gray mt-1 font-medium">{log.details}</p>
                  <span className="text-[10px] text-cyan-300 font-mono mt-1 block">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showValidation && (
        <HITLValidationModal 
          product={product} 
          onClose={() => setShowValidation(false)} 
        />
      )}
    </div>
  );
};

export default ProductDetailView;
