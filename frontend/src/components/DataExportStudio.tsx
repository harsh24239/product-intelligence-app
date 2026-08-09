import React, { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, FileText, BarChart3, Check, Code2, Info, Copy, Play } from 'lucide-react';

const DataExportStudio: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string | null>(null);
  const [apiExecuted, setApiExecuted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExport = (id: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      setDownloaded(id);
      setTimeout(() => setDownloaded(null), 3000);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('curl -X GET "https://api.intelliproduct.ai/v1/catalog?sku=MX-1000-V2" -H "Authorization: Bearer unihack_2026_key"');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportOptions = [
    {
      id: 'json',
      title: 'Structured Product JSON',
      desc: 'Full AI-extracted product intelligence exported as structured JSON — includes all attributes, confidence scores, source citations, and anomaly flags.',
      icon: FileJson,
      format: 'JSON',
      size: '~4.2 MB',
      color: '#3B82F6',
      bg: 'rgba(59,130,246,0.18)',
      border: 'rgba(59,130,246,0.4)',
      badge: 'Commerce-Ready',
    },
    {
      id: 'csv',
      title: 'CSV Attribute Export',
      desc: 'Spreadsheet-ready tabular format with all extracted product fields — suitable for ERP ingestion, manual QA review, or pipeline handoff.',
      icon: FileSpreadsheet,
      format: 'CSV',
      size: '~1.8 MB',
      color: '#10B981',
      bg: 'rgba(16,185,129,0.18)',
      border: 'rgba(16,185,129,0.4)',
      badge: 'ERP Ready',
    },
    {
      id: 'pdf',
      title: 'PDF Product Datasheet',
      desc: 'Auto-generated PDF datasheet for a single product with full traceability — shows extracted attributes, AI confidence scores, and anomaly notes.',
      icon: FileText,
      format: 'PDF',
      size: 'Per product',
      color: '#F59E0B',
      bg: 'rgba(245,158,11,0.18)',
      border: 'rgba(245,158,11,0.4)',
      badge: 'With QR Code',
    },
    {
      id: 'api',
      title: 'REST API Endpoint',
      desc: 'Query product intelligence data programmatically. Returns enriched product records in real-time via a RESTful JSON API for system integration.',
      icon: Code2,
      format: 'REST API',
      size: 'Live endpoint',
      color: '#8B5CF6',
      bg: 'rgba(139,92,246,0.18)',
      border: 'rgba(139,92,246,0.4)',
      badge: 'Live Stream',
    },
  ];

  const sampleJsonResponse = `{
  "sku": "MX-1000-V2",
  "productName": "Industrial Servo Motor MX-1000",
  "manufacturer": "Parker Hannifin",
  "status": "COMMERCE_READY",
  "aiConfidence": 0.984,
  "provenance": {
    "sourceDocument": "Supplier_Catalog_Q3.pdf",
    "extractedPage": 14,
    "model": "Gemini-1.5-VLM"
  },
  "attributes": {
    "maxTorque": { "value": "15.0 Nm", "status": "HUMAN_APPROVED", "isoStandard": "ISO 8608" },
    "ipRating": { "value": "IP65", "status": "RAG_INFERRED", "isoStandard": "IEC 60529" },
    "voltage": { "value": "400V 3-Phase", "status": "EXTRACTED", "isoStandard": "UL 508A" }
  }
}`;

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59, 130, 246, 0.18)', border: '1px solid rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Download size={22} color="#60A5FA" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.4px' }}>
                Export Structured Product Data
              </h1>
              <div style={{ fontSize: 14, color: '#CBD5E1' }}>
                Multi-format publishing pipeline, REST API distribution, and ISO provenance tracking
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explainer Banner */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(59, 130, 246, 0.12)',
        border: '1px solid rgba(59, 130, 246, 0.35)',
        borderRadius: 14,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}>
        <Info size={18} color="#60A5FA" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.6 }}>
          <strong style={{ color: '#FFFFFF' }}>AI Pipeline Handoff:</strong>{' '}
          The multi-agent pipeline extracts product attributes from unstructured PDFs, normalizes specs via ISO/IEC knowledge graph RAG, and outputs clean, commerce-ready records available for ERP ingestion or direct API query.
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
              style={{ display: 'flex', flexDirection: 'column', padding: 24, background: '#1E293B', border: '1px solid #334155', position: 'relative', borderRadius: 16 }}
            >
              {/* Top Accent Bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: opt.color, borderRadius: '16px 16px 0 0' }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: opt.bg, border: `1px solid ${opt.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} color={opt.color} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF' }}>{opt.title}</h3>
                    <span style={{ fontSize: 10, fontWeight: 800, background: opt.bg, color: opt.color, border: `1px solid ${opt.border}`, padding: '2px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {opt.badge}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#94A3B8', background: '#0F172A', border: '1px solid #334155', padding: '2px 8px', borderRadius: 6 }}>
                    {opt.format}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.6, marginBottom: 16, flex: 1 }}>{opt.desc}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid #334155' }}>
                <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>{opt.size}</span>
                {isAPI ? (
                  <button
                    className="btn btn-secondary"
                    onClick={() => setApiExecuted(!apiExecuted)}
                    style={{ fontSize: 13, padding: '7px 16px', fontWeight: 800 }}
                  >
                    <Play size={14} color="#8B5CF6" /> {apiExecuted ? 'Hide API Payload' : 'Test Endpoint'}
                  </button>
                ) : (
                  <button
                    className={`btn ${isDownloaded ? 'btn-accent' : 'btn-primary'}`}
                    onClick={() => handleExport(opt.id)}
                    disabled={isDownloading || isDownloaded}
                    style={{ fontSize: 13, padding: '7px 16px', fontWeight: 800 }}
                  >
                    {isDownloading ? (
                      <><span className="animate-spin" style={{ display: 'inline-block' }}>⟳</span> Generating...</>
                    ) : isDownloaded ? (
                      <><Check size={15} /> Downloaded</>
                    ) : (
                      <><Download size={15} /> Download</>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* REST API Live Response Payload Inspector (Collapsible / Interactive) */}
      <div className="card" style={{ padding: 24, background: '#1E293B' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Code2 size={22} color="#8B5CF6" />
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>REST API Payload Response Inspector</h3>
              <div style={{ fontSize: 13, color: '#94A3B8' }}>Real-time JSON output format returned to downstream ERP/PIM systems</div>
            </div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={handleCopy}
            style={{ fontSize: 13, padding: '6px 14px' }}
          >
            {copied ? <><Check size={14} color="#34D399" /> Copied Curl</> : <><Copy size={14} /> Copy Curl</>}
          </button>
        </div>

        <pre style={{
          background: '#070B18',
          border: '1px solid #334155',
          borderRadius: 12,
          padding: 20,
          color: '#34D399',
          fontSize: 13,
          lineHeight: 1.6,
          overflowX: 'auto',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          {sampleJsonResponse}
        </pre>
      </div>

      {/* Summary KPI Footer */}
      <div className="card" style={{ padding: 24, background: '#1E293B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <BarChart3 size={20} color="#8B5CF6" />
          <span style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>Current Catalog Export Summary</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 800, color: '#34D399', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '3px 10px', borderRadius: 6 }}>
            ✓ Export Pipeline Ready
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {[
            { label: 'Total Products', value: '12,450', color: '#60A5FA', desc: 'Across all categories' },
            { label: 'Enriched Attributes', value: '142,890', color: '#C084FC', desc: 'AI-extracted fields' },
            { label: 'Commerce-Ready', value: '94%', color: '#34D399', desc: 'Validated & complete' },
            { label: 'Unresolved Flags', value: '142', color: '#FBBF24', desc: 'Awaiting human review' },
          ].map((stat, i) => (
            <div key={i} style={{ padding: '14px 16px', background: '#0F172A', border: '1px solid #334155', borderRadius: 10 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: stat.color, letterSpacing: '-0.5px' }}>{stat.value}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginTop: 3 }}>{stat.label}</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DataExportStudio;
