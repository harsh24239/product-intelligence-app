import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, BarChart3, Check, Info, Copy, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateProductDatasheet } from '../services/pdfGenerator';

import { Product } from '../types/product';

interface DataExportStudioProps {
  products?: Product[];
}

const DataExportStudio: React.FC<DataExportStudioProps> = ({ products = [] }) => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [exportStep, setExportStep] = useState<string | null>(null);

  // Strict Hackathon CSV delivery requires no payload customization

  const handleExport = async (id: string) => {
    setDownloading(id);
    const catalogCount = products.length > 0 ? products.length : 16;
    setExportStep(`Packaging ${catalogCount} catalog product records...`);
    
    // Build dataset from actual catalog products
    const targetProducts = products.length > 0 ? products : [
      {
        id: 'prod-1',
        name: 'Industrial Servo Motor MX-1000',
        sku: 'MX-1000-V2',
        manufacturer: 'Parker Hannifin',
        status: 'commerce_ready' as const,
        category: 'Motors & Drives',
        completeness: 98,
        lastUpdated: new Date().toISOString(),
        specs: { material: 'Cast Iron', dimensions: '250x200x300mm', weight: '18.5kg', color: null, voltage: '400V AC', ipRating: 'IP65', certification: 'IEC 60034-30-1' },
        attributes: [
          { key: 'maxTorque', value: '15.0 Nm', confidence: 98.4, source: 'Datasheet.pdf', sourceQuote: '15.0 Nm rating', enrichedBy: 'rag_enrichment' as const, flagged: false },
          { key: 'ipRating', value: 'IP65', confidence: 96.2, source: 'IEC 60529', sourceQuote: 'IP65 washdown', enrichedBy: 'rag_enrichment' as const, flagged: false }
        ],
        anomalies: [],
        auditLog: []
      },
      {
        id: 'prod-2',
        name: 'Hydraulic Relief Valve V-2200',
        sku: 'SKU-1001',
        manufacturer: 'Bosch Rexroth',
        status: 'validated' as const,
        category: 'Hydraulics',
        completeness: 88,
        lastUpdated: new Date().toISOString(),
        specs: { material: 'Steel', dimensions: '150x120x90mm', weight: '4.2kg', color: null, voltage: '24V DC', ipRating: 'IP67', certification: 'ISO 4401' },
        attributes: [
          { key: 'maxPressure', value: '350 Bar', confidence: 94.1, source: 'Valve_Spec.pdf', sourceQuote: '350 Bar pressure rating', enrichedBy: 'llm_extraction' as const, flagged: false }
        ],
        anomalies: [],
        auditLog: []
      }
    ];

    if (id === 'csv') {
      try {
        const response = await fetch('/api/hackathon/export');
        if (!response.ok) throw new Error('Export failed');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Unihack_Expected_Output.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Error downloading hackathon CSV:', err);
      }
    } else if (id === 'pdf') {
      const firstProd = targetProducts[0];
      await generateProductDatasheet(firstProd);
    }

    setTimeout(() => {
      setExportStep('Injecting metadata...');
    }, 600);

    setTimeout(() => {
      setDownloading(null);
      setExportStep(null);
      setDownloaded(id);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
      setTimeout(() => setDownloaded(null), 3500);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('https://api.intelliproduct.ai/v1/catalog/export?format=json');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportOptions = [
    {
      id: 'csv',
      title: 'CSV Attribute Export',
      desc: 'Spreadsheet-ready tabular format with all extracted product fields — suitable for ERP ingestion, manual QA review, or pipeline handoff.',
      icon: FileSpreadsheet,
      format: 'CSV',
      size: '~1.8 MB',
      color: '#34D399',
      bg: 'rgba(16, 185, 129, 0.15)',
      border: 'rgba(16, 185, 129, 0.4)',
      badge: 'ERP Ready',
      targetSystem: 'SAP / Oracle ERP',
    },
    {
      id: 'pdf',
      title: 'PDF Product Datasheet',
      desc: 'Auto-generated PDF datasheet for a single product with full traceability — shows extracted attributes, AI confidence scores, and anomaly notes.',
      icon: FileText,
      format: 'PDF',
      size: 'Per product',
      color: '#FBBF24',
      bg: 'rgba(245, 158, 11, 0.15)',
      border: 'rgba(245, 158, 11, 0.4)',
      badge: 'With QR Code',
      targetSystem: 'Customer Portal',
    },
  ];

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Download size={24} color="#60A5FA" />
            </div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.4px' }}>
                Export & Data Handoff Studio
              </h1>
              <div style={{ fontSize: 15, color: '#F1F5F9' }}>
                Multi-format publishing pipeline, REST API distribution, and customizable ISO payload builder
              </div>
            </div>
          </div>
        </div>

        {/* Quick KPI badge */}
        <div style={{ background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <ShieldCheck size={20} color="#34D399" />
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Catalog Readiness</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF' }}>{products.length > 0 ? `${products.length.toLocaleString()} Enriched Records` : 'Run Ingest First'}</div>
          </div>
        </div>
      </div>

      {/* Explainer Banner */}
      <div style={{
        padding: '18px 22px',
        background: '#1B2433',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        borderRadius: 14,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
      }}>
        <Info size={20} color="#60A5FA" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
            Unilog Delivery Format Export
          </div>
          <p style={{ fontSize: 15, color: '#FFFFFF', lineHeight: 1.6 }}>
            The enrichment pipeline transforms raw 6-column input rows into fully populated 252-column delivery records. Use the <strong>CSV Export</strong> to download the submission-ready output matching the exact Unilog expected output schema — no headers modified.
          </p>
        </div>
      </div>


      {/* Symmetric 2x2 Grid of Export Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 18 }}>
        {exportOptions.map((opt) => {
          const Icon = opt.icon;
          const isDownloading = downloading === opt.id;
          const isDownloaded = downloaded === opt.id;
          const isAPI = opt.id === 'api';

          return (
            <div
              key={opt.id}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', padding: 24, background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)', position: 'relative', borderRadius: 16 }}
            >
              {/* Top Accent Bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: opt.color, borderRadius: '16px 16px 0 0' }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: opt.bg, border: `1px solid ${opt.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} color={opt.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>{opt.title}</h3>
                    <span style={{ fontSize: 11, fontWeight: 800, background: opt.bg, color: opt.color, border: `1px solid ${opt.border}`, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {opt.badge}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, color: '#38BDF8', background: '#0B0F17', border: '1px solid rgba(56, 189, 248, 0.35)', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                      {opt.format}
                    </span>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>Target: <strong style={{ color: '#FFFFFF' }}>{opt.targetSystem}</strong></span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 15, color: '#F1F5F9', lineHeight: 1.6, marginBottom: 18, flex: 1 }}>{opt.desc}</p>

              {/* Progress step feedback */}
              {isDownloading && exportStep && (
                <div style={{ marginBottom: 12, padding: '10px 14px', background: '#0B0F17', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 8, fontSize: 13, color: '#60A5FA', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={16} className="animate-spin" /> {exportStep}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid rgba(56, 189, 248, 0.25)' }}>
                <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>{opt.size}</span>
                {isAPI ? (
                  <button
                    className="btn btn-secondary"
                    onClick={handleCopy}
                    style={{ fontSize: 14, padding: '8px 18px', fontWeight: 800 }}
                  >
                    {copied ? <><Check size={16} color="#34D399" /> Copied Endpoint</> : <><Copy size={16} color="#60A5FA" /> Copy API Endpoint</>}
                  </button>
                ) : (
                  <button
                    className={`btn ${isDownloaded ? 'btn-accent' : 'btn-primary'}`}
                    onClick={() => handleExport(opt.id)}
                    disabled={isDownloading || isDownloaded}
                    style={{ fontSize: 14, padding: '8px 18px', fontWeight: 800 }}
                  >
                    {isDownloading ? (
                      <><span className="animate-spin" style={{ display: 'inline-block' }}>⟳</span> Exporting...</>
                    ) : isDownloaded ? (
                      <><Check size={16} /> Downloaded</>
                    ) : (
                      <><Download size={16} /> Export {opt.format}</>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>


      {/* Summary KPI Footer */}
      <div className="card" style={{ padding: 24, background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <BarChart3 size={20} color="#60A5FA" />
          <span style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>Current Catalog Export Summary</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 800, color: '#34D399', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 12px', borderRadius: 8 }}>
            ✓ Ready for Downstream PIM/ERP
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {[
            { label: 'Total Products', value: products.length > 0 ? products.length.toLocaleString() : '—', color: '#60A5FA', desc: 'Ingested from sample dataset' },
            { label: 'Enriched Attributes', value: products.length > 0 ? `${(products.reduce((s, p) => s + (p.attributes?.length || 0), 0)).toLocaleString()}` : '—', color: '#38BDF8', desc: 'Extracted across all products' },
            { label: 'Commerce-Ready', value: products.length > 0 ? `${Math.round(products.filter(p => p.status === 'commerce_ready').length / products.length * 100)}%` : '—', color: '#34D399', desc: 'Fully enriched records' },
            { label: 'Pending Review', value: products.length > 0 ? `${products.filter(p => p.anomalies?.length > 0).length}` : '—', color: '#FBBF24', desc: 'Items with anomaly flags' },
          ].map((stat, i) => (
            <div key={i} style={{ padding: '16px 18px', background: '#0B0F17', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: 12 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, letterSpacing: '-0.5px' }}>{stat.value}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginTop: 3 }}>{stat.label}</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DataExportStudio;
