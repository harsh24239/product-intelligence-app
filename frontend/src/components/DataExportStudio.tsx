import React, { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, FileText, BarChart3, Check, Code2, Info, Copy, CheckSquare, Sparkles, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

const DataExportStudio: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [exportStep, setExportStep] = useState<string | null>(null);

  // Export Customization Toggles
  const [includeConfidence, setIncludeConfidence] = useState(true);
  const [includeIso, setIncludeIso] = useState(true);
  const [includeProvenance, setIncludeProvenance] = useState(true);
  const [includeAnomalies, setIncludeAnomalies] = useState(true);

  const handleExport = (id: string) => {
    setDownloading(id);
    setExportStep('Packaging 12,450 enriched records...');
    
    setTimeout(() => {
      setExportStep('Injecting ISO/IEC compliance metadata...');
    }, 600);

    setTimeout(() => {
      setExportStep('Generating SHA-256 integrity checksum...');
    }, 1200);

    setTimeout(() => {
      setDownloading(null);
      setExportStep(null);
      setDownloaded(id);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
      setTimeout(() => setDownloaded(null), 3500);
    }, 1800);
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
      targetSystem: 'JSON Feed / Webhooks',
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
      targetSystem: 'SAP / Oracle ERP',
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
      targetSystem: 'Customer Portal',
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
      targetSystem: 'Microservices / PIM',
    },
  ];

  // Dynamic payload generator based on toggle selections
  const generateDynamicPayload = () => {
    let payload: any = {
      sku: "MX-1000-V2",
      productName: "Industrial Servo Motor MX-1000",
      manufacturer: "Parker Hannifin",
      status: "COMMERCE_READY",
    };

    if (includeConfidence) {
      payload.aiConfidence = 0.984;
    }

    if (includeProvenance) {
      payload.provenance = {
        sourceDocument: "Supplier_Catalog_Q3.pdf",
        extractedPage: 14,
        model: "Gemini-1.5-VLM",
      };
    }

    payload.attributes = {
      maxTorque: {
        value: "15.0 Nm",
        status: "HUMAN_APPROVED",
        ...(includeIso ? { isoStandard: "ISO 8608" } : {}),
      },
      ipRating: {
        value: "IP65",
        status: "RAG_INFERRED",
        ...(includeIso ? { isoStandard: "IEC 60529" } : {}),
      },
      voltage: {
        value: "400V 3-Phase",
        status: "EXTRACTED",
        ...(includeIso ? { isoStandard: "UL 508A" } : {}),
      },
    };

    if (includeAnomalies) {
      payload.auditFlags = [
        { field: "maxTorque", anomaly: "Unit conversion typo fixed (150 Nm -> 15.0 Nm)", resolvedBy: "AI Agent + QA" }
      ];
    }

    return JSON.stringify(payload, null, 2);
  };

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59, 130, 246, 0.18)', border: '1px solid rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Download size={24} color="#60A5FA" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.4px' }}>
                Export & Data Handoff Studio
              </h1>
              <div style={{ fontSize: 14, color: '#CBD5E1' }}>
                Multi-format publishing pipeline, REST API distribution, and customizable ISO payload builder
              </div>
            </div>
          </div>
        </div>

        {/* Quick KPI badge */}
        <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <ShieldCheck size={20} color="#34D399" />
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Catalog Readiness</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>12,450 Verified Records</div>
          </div>
        </div>
      </div>

      {/* Explainer Banner */}
      <div style={{
        padding: '18px 22px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.35)',
        borderRadius: 14,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
      }}>
        <Info size={20} color="#60A5FA" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
            Enterprise Data Handoff Pipeline
          </div>
          <p style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.6 }}>
            The multi-agent pipeline turns unstructured PDFs into fully traceable, commerce-ready product data. Use this studio to customize JSON metadata tags, export spreadsheet tables for SAP/Oracle ERP, or distribute live records via REST API.
          </p>
        </div>
      </div>

      {/* Payload Customization Controls */}
      <div className="card" style={{ padding: 22, background: '#1E293B', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SlidersHorizontal size={18} color="#C084FC" />
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>Export Payload Customization Options</h3>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[
            { label: 'AI Confidence Scores', state: includeConfidence, set: setIncludeConfidence, color: '#60A5FA' },
            { label: 'ISO/IEC Mapped Standards', state: includeIso, set: setIncludeIso, color: '#38BDF8' },
            { label: 'Document Provenance (PDF Citations)', state: includeProvenance, set: setIncludeProvenance, color: '#C084FC' },
            { label: 'Audit Anomaly Notes', state: includeAnomalies, set: setIncludeAnomalies, color: '#F59E0B' },
          ].map((toggle, idx) => (
            <button
              key={idx}
              onClick={() => toggle.set(!toggle.state)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                background: toggle.state ? 'rgba(59, 130, 246, 0.18)' : '#0F172A',
                color: toggle.state ? '#FFFFFF' : '#94A3B8',
                border: `1px solid ${toggle.state ? '#3B82F6' : '#334155'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <CheckSquare size={16} color={toggle.state ? toggle.color : '#64748B'} />
              {toggle.label}
            </button>
          ))}
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
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF' }}>{opt.title}</h3>
                    <span style={{ fontSize: 10, fontWeight: 800, background: opt.bg, color: opt.color, border: `1px solid ${opt.border}`, padding: '2px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {opt.badge}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, color: '#94A3B8', background: '#0F172A', border: '1px solid #334155', padding: '2px 8px', borderRadius: 6 }}>
                      {opt.format}
                    </span>
                    <span style={{ fontSize: 11, color: '#64748B' }}>Target: <strong style={{ color: '#CBD5E1' }}>{opt.targetSystem}</strong></span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.6, marginBottom: 18, flex: 1 }}>{opt.desc}</p>

              {/* Progress step feedback */}
              {isDownloading && exportStep && (
                <div style={{ marginBottom: 12, padding: '8px 12px', background: '#0F172A', border: '1px solid #334155', borderRadius: 8, fontSize: 12, color: '#60A5FA', fontFamily: 'Plus Jakarta Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={14} className="animate-spin" /> {exportStep}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid #334155' }}>
                <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>{opt.size}</span>
                {isAPI ? (
                  <button
                    className="btn btn-secondary"
                    onClick={handleCopy}
                    style={{ fontSize: 13, padding: '8px 16px', fontWeight: 800 }}
                  >
                    {copied ? <><Check size={15} color="#34D399" /> Copied Curl</> : <><Copy size={15} color="#8B5CF6" /> Copy API Curl</>}
                  </button>
                ) : (
                  <button
                    className={`btn ${isDownloaded ? 'btn-accent' : 'btn-primary'}`}
                    onClick={() => handleExport(opt.id)}
                    disabled={isDownloading || isDownloaded}
                    style={{ fontSize: 13, padding: '8px 18px', fontWeight: 800 }}
                  >
                    {isDownloading ? (
                      <><span className="animate-spin" style={{ display: 'inline-block' }}>⟳</span> Exporting...</>
                    ) : isDownloaded ? (
                      <><Check size={15} /> Downloaded</>
                    ) : (
                      <><Download size={15} /> Export {opt.format}</>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* REST API Live Response Payload Inspector */}
      <div className="card" style={{ padding: 24, background: '#1E293B' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Code2 size={22} color="#8B5CF6" />
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>Live JSON Output Payload Inspector</h3>
              <div style={{ fontSize: 13, color: '#94A3B8' }}>Updates in real-time as you toggle export payload options above</div>
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#34D399', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '3px 10px', borderRadius: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            ● Dynamic Preview
          </span>
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
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}>
          {generateDynamicPayload()}
        </pre>
      </div>

      {/* Summary KPI Footer */}
      <div className="card" style={{ padding: 24, background: '#1E293B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <BarChart3 size={20} color="#8B5CF6" />
          <span style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>Current Catalog Export Summary</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 800, color: '#34D399', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '3px 10px', borderRadius: 6 }}>
            ✓ Ready for Downstream PIM/ERP
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
