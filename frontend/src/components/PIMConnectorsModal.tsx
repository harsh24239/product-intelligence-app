import React, { useState } from 'react';
import { Product } from '../types/product';
import { Download, CheckCircle2, Copy, X, Code, FileSpreadsheet, Sparkles } from 'lucide-react';

interface PIMConnectorsModalProps {
  product: Product;
  onClose: () => void;
  isDark?: boolean;
}

type ExportFormat = 'json' | 'csv' | 'api';

const PIMConnectorsModal: React.FC<PIMConnectorsModalProps> = ({ product, onClose }) => {
  const [format, setFormat] = useState<ExportFormat>('json');
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);

  // Generate structured export payload based on format
  const getPayload = (): string => {
    if (format === 'json') {
      return JSON.stringify({
        product_intelligence_export: {
          metadata: {
            export_source: 'IntelliProduct AI Pipeline',
            pipeline_version: '2.0',
            generated_at: new Date().toISOString(),
            extraction_method: product.extractionMethod || 'Gemini 1.5 Multi-Agent',
          },
          product: {
            id: product.id,
            sku: product.sku,
            name: product.name,
            manufacturer: product.manufacturer,
            category: product.category,
            status: product.status,
            data_completeness_pct: product.completeness,
            ai_enriched_attributes: product.attributes.length,
            anomaly_flags: product.anomalies.length,
          },
          extracted_specs: product.specs,
          attributes: product.attributes.map((a) => ({
            key: a.key,
            value: a.value,
            confidence_score: a.confidence,
            source_document: a.source,
            source_quote: a.sourceQuote,
            extracted_by: a.enrichedBy,
            flagged: a.flagged,
            flag_reason: a.flagReason || null,
          })),
          anomalies: product.anomalies,
          audit_trail: product.auditLog,
          certifications: product.certifications || [],
        },
      }, null, 2);
    }

    if (format === 'csv') {
      const header = 'key,value,confidence,source,enriched_by,flagged\n';
      const rows = product.attributes
        .map((a) => `"${a.key}","${a.value}",${a.confidence},"${a.source}","${a.enrichedBy}",${a.flagged}`)
        .join('\n');
      return header + rows;
    }

    if (format === 'api') {
      return `# REST API Endpoint
# Returns structured product intelligence for this product

GET /api/catalog/${product.id}
Authorization: Bearer <your_api_key>

# Example Response:
{
  "id": "${product.id}",
  "sku": "${product.sku}",
  "name": "${product.name}",
  "completeness": ${product.completeness},
  "status": "${product.status}",
  "attributes": [...],   // ${product.attributes.length} AI-extracted fields
  "anomalies": [...],    // ${product.anomalies.length} flagged issues
  "audit_trail": [...]   // Full extraction history
}

# Filter endpoints:
GET /api/catalog?status=commerce_ready
GET /api/catalog?category=${encodeURIComponent(product.category)}
GET /api/metrics`;
    }

    return '';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getPayload()).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExportedSuccess(true);
      setTimeout(() => setExportedSuccess(false), 3000);
    }, 1200);
  };

  const formatConfig = {
    json: { label: 'Structured JSON', icon: Code, desc: 'Full AI extraction with confidence scores, source citations, and anomaly flags' },
    csv: { label: 'CSV Attributes', icon: FileSpreadsheet, desc: 'Tabular format of all extracted attributes for spreadsheet / ERP ingestion' },
    api: { label: 'REST API', icon: Download, desc: 'Programmatic access — query this product record via RESTful API endpoint' },
  };

  const payload = getPayload();

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-content" style={{ maxWidth: 720 }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--blue-dim)', border: '1px solid var(--blue-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} color="var(--blue)" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Export Structured Product Data</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                AI-extracted intelligence for <strong style={{ color: 'var(--text)' }}>{product.name}</strong>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: 4, border: '1px solid var(--border)', borderRadius: 6, background: 'rgba(255,255,255,0.03)', display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', maxHeight: 'calc(90vh - 140px)' }}>

          {/* What this shows */}
          <div style={{ padding: '10px 14px', background: 'rgba(59,130,246,0.06)', border: '1px solid var(--blue-border)', borderRadius: 8, fontSize: 12, color: 'var(--text-sub)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text)' }}>AI Extraction Output:</strong>{' '}
            This product has been processed through the multi-agent pipeline — {product.attributes.length} attributes extracted, {product.anomalies.length} anomaly flags detected, data completeness at <strong style={{ color: 'var(--text)' }}>{product.completeness}%</strong>. Select a format to export the structured output.
          </div>

          {/* Format selector */}
          <div style={{ display: 'flex', gap: 8 }}>
            {(Object.entries(formatConfig) as [ExportFormat, typeof formatConfig[ExportFormat]][]).map(([key, cfg]) => {
              const Icon = cfg.icon;
              const isActive = format === key;
              return (
                <button
                  key={key}
                  onClick={() => setFormat(key)}
                  style={{
                    flex: 1, padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                    background: isActive ? 'var(--blue-dim)' : 'var(--bg)',
                    border: `1px solid ${isActive ? 'var(--blue-border)' : 'var(--border)'}`,
                    textAlign: 'left', transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Icon size={13} color={isActive ? 'var(--blue)' : 'var(--text-muted)'} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? 'var(--blue)' : 'var(--text)' }}>{cfg.label}</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4 }}>{cfg.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Payload preview */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Export Preview
              </span>
              <button
                onClick={handleCopy}
                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: copied ? 'var(--green)' : 'var(--blue)', cursor: 'pointer', padding: '3px 10px', borderRadius: 6, border: `1px solid ${copied ? 'var(--green-border)' : 'var(--blue-border)'}`, background: copied ? 'var(--green-dim)' : 'var(--blue-dim)' }}
              >
                {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <pre style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '14px 16px',
              fontSize: 11,
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--text-sub)',
              overflowX: 'auto',
              maxHeight: 280,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {payload}
            </pre>
          </div>

          {/* Action row */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={onClose} style={{ fontSize: 12 }}>Cancel</button>
            <button
              className={`btn ${exportedSuccess ? 'btn-accent' : 'btn-primary'}`}
              onClick={handleExport}
              disabled={exporting || exportedSuccess}
              style={{ fontSize: 12 }}
            >
              {exporting ? (
                <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Exporting...</>
              ) : exportedSuccess ? (
                <><CheckCircle2 size={14} /> Exported Successfully</>
              ) : (
                <><Download size={14} /> Export {formatConfig[format].label}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PIMConnectorsModal;
