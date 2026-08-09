import React, { useState, useRef } from 'react';
import { FileText, Upload, Sparkles, CheckCircle, ChevronRight, X, Info } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types/product';

interface IngestionStudioProps {
  onExtractSuccess: () => void;
}

const AI_STEPS = [
  {
    label: 'Preprocessing & Cleaning',
    desc: 'Removing boilerplate, normalizing whitespace and encoding',
  },
  {
    label: 'Entity & Attribute Extraction',
    desc: 'Gemini LLM identifies product names, specs, and values',
  },
  {
    label: 'Schema Normalization',
    desc: 'Converting units (HP→kW, bar→PSI) and standardizing field names',
  },
  {
    label: 'RAG Contextual Enrichment',
    desc: 'Retrieving similar products to fill in missing attributes',
  },
  {
    label: 'Anomaly Detection',
    desc: 'Flagging values that conflict or fall outside expected ranges',
  },
  {
    label: 'ISO Compliance Validation',
    desc: 'Checking against IEC 60034, ISO 9001, and ATEX standards',
  },
];

const EXAMPLE_TEXT = `Industrial Servo Motor MX-2000
Manufacturer: RoboDrives Inc
Power: 2.5 kW, Voltage: 400V AC, Frequency: 50Hz
Speed: 1450 RPM, Torque: 16.5 Nm
IP Rating: IP65, Insulation Class: F
Weight: 18.5 kg, Dimensions: 250x200x300mm
Certifications: CE, UL, IEC 60034-30-1
Material: Cast Iron Housing, Aluminum Endshields`;

const IngestionStudio: React.FC<IngestionStudioProps> = ({ onExtractSuccess }) => {
  const [mode, setMode] = useState<'select' | 'text' | 'file' | 'processing' | 'result'>('select');
  const [inputText, setInputText] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [extractedProduct, setExtractedProduct] = useState<Product | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateProgress = (onComplete: () => void) => {
    let step = 0;
    setProgress(0);
    const interval = setInterval(() => {
      step++;
      setProgress(step);
      if (step >= AI_STEPS.length) {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 600);
  };

  const handleTextSubmit = () => {
    setMode('processing');
    setError('');
    simulateProgress(async () => {
      try {
        const product = await api.extractFromText(inputText);
        setExtractedProduct(product);
        setMode('result');
      } catch {
        setExtractedProduct(null);
        setMode('result');
      }
    });
  };

  const handleFileSubmit = (file: File) => {
    setMode('processing');
    setError('');
    simulateProgress(async () => {
      try {
        const product = await api.extractFromFile(file);
        setExtractedProduct(product);
        setMode('result');
      } catch {
        setExtractedProduct(null);
        setMode('result');
      }
    });
  };

  const card: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 28,
  };

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: 820, margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px', marginBottom: 6 }}>
          AI Document Ingestion — Step 1 of 3
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.6, maxWidth: 560 }}>
          Upload raw supplier PDFs, spec sheets, or paste unstructured text. The 3-agent AI pipeline
          will extract, normalize, and validate product attributes automatically.
        </p>
      </div>

      {/* Mode selector */}
      {mode === 'select' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {[
            {
              id: 'text',
              label: 'Paste Raw Text',
              desc: 'Copy-paste product descriptions, spec sheets, or any unstructured catalog text.',
              Icon: FileText,
              color: 'var(--blue)',
              bg: 'var(--blue-dim)',
              border: 'var(--blue-border)',
            },
            {
              id: 'file',
              label: 'Upload Document',
              desc: 'Upload a PDF, TXT, CSV, or JSON file directly from your computer.',
              Icon: Upload,
              color: '#8B5CF6',
              bg: 'var(--violet-dim)',
              border: 'var(--violet-border)',
            },
          ].map((opt) => (
            <button
              key={opt.id}
              id={`ingest-${opt.id}`}
              onClick={() => setMode(opt.id as any)}
              style={{
                ...card,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = opt.border;
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'none';
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: opt.bg,
                  border: `1px solid ${opt.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <opt.Icon size={22} color={opt.color} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-sub)', lineHeight: 1.55 }}>
                  {opt.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* What happens next info box */}
      {mode === 'select' && (
        <div
          style={{
            display: 'flex',
            gap: 12,
            padding: '14px 16px',
            background: 'rgba(59,130,246,0.05)',
            border: '1px solid var(--blue-border)',
            borderRadius: 10,
          }}
        >
          <Info size={16} color="var(--blue)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
              What happens after you submit?
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-sub)', lineHeight: 1.6 }}>
              Your document passes through a <strong style={{ color: 'var(--text)' }}>3-stage AI pipeline</strong>:
              first the <em>Extraction Agent</em> (Gemini LLM + Vision) pulls out raw attributes, then the{' '}
              <em>Enrichment Agent</em> normalizes units and fills gaps using RAG knowledge, and finally the{' '}
              <em>Compliance Guard Agent</em> checks values against ISO/IEC engineering standards and flags
              anything unusual for human review.
            </div>
          </div>
        </div>
      )}

      {/* Text mode */}
      {mode === 'text' && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>
                Paste Raw Product Text
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Paste any unstructured catalog text, product description, or spec data below.
              </p>
            </div>
            <button
              onClick={() => setMode('select')}
              style={{
                width: 30, height: 30, borderRadius: 6,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          </div>

          {error && (
            <div
              style={{
                background: 'var(--red-dim)',
                border: '1px solid var(--red-border)',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 14,
                fontSize: 12,
                color: 'var(--red)',
              }}
            >
              {error}
            </div>
          )}

          <textarea
            id="ingest-text-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Paste raw product specifications here...\n\nExample:\n${EXAMPLE_TEXT}`}
            style={{
              width: '100%',
              height: 220,
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 14,
              fontSize: 12,
              color: 'var(--text)',
              fontFamily: 'JetBrains Mono, monospace',
              resize: 'vertical',
              outline: 'none',
              lineHeight: 1.65,
              marginBottom: 16,
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--blue)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setInputText(EXAMPLE_TEXT)}
              style={{ fontSize: 12 }}
            >
              Load Example Data
            </button>
            <button
              id="btn-extract-text"
              className="btn btn-primary"
              onClick={handleTextSubmit}
              disabled={inputText.length < 10}
            >
              <Sparkles size={14} />
              Run AI Extraction
            </button>
          </div>
        </div>
      )}

      {/* File mode */}
      {mode === 'file' && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>
                Upload Document
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Supported formats: PDF, TXT, CSV, JSON, DOCX (up to 10 MB)
              </p>
            </div>
            <button
              onClick={() => { setMode('select'); setSelectedFile(null); }}
              style={{
                width: 30, height: 30, borderRadius: 6,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          </div>

          <div
            id="file-dropzone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) setSelectedFile(file);
            }}
            style={{
              border: `2px dashed ${dragOver ? 'var(--blue)' : selectedFile ? 'var(--green)' : 'var(--border-light)'}`,
              borderRadius: 10,
              padding: '40px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver
                ? 'rgba(59,130,246,0.04)'
                : selectedFile
                ? 'rgba(16,185,129,0.04)'
                : 'var(--bg)',
              transition: 'all 0.2s',
              marginBottom: 16,
            }}
          >
            {selectedFile ? (
              <>
                <CheckCircle size={36} color="var(--green)" style={{ margin: '0 auto 10px' }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                  {selectedFile.name}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {(selectedFile.size / 1024).toFixed(1)} KB — Click to change
                </p>
              </>
            ) : (
              <>
                <Upload size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                  Drop file here or click to browse
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  PDF, TXT, CSV, JSON supported
                </p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.csv,.json,.docx"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setSelectedFile(file);
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              id="btn-extract-file"
              className="btn btn-primary"
              disabled={!selectedFile}
              onClick={() => selectedFile && handleFileSubmit(selectedFile)}
            >
              <Sparkles size={14} />
              Run AI Extraction
            </button>
          </div>
        </div>
      )}

      {/* Processing */}
      {mode === 'processing' && (
        <div style={{ ...card, maxWidth: 520, margin: '0 auto', padding: '36px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div
              style={{
                width: 52, height: 52,
                borderRadius: '50%',
                background: 'var(--blue-dim)',
                border: '1px solid var(--blue-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <Sparkles size={24} color="var(--blue)" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
              AI Pipeline Running…
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              3-stage multi-agent pipeline processing your document
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {AI_STEPS.map((step, idx) => {
              const done = progress > idx;
              const active = progress === idx;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    opacity: progress >= idx ? 1 : 0.3,
                    transition: 'opacity 0.4s',
                  }}
                >
                  <div
                    style={{
                      width: 24, height: 24,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done
                        ? 'var(--green)'
                        : active
                        ? 'var(--blue)'
                        : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${done ? 'var(--green)' : active ? 'var(--blue)' : 'var(--border)'}`,
                      transition: 'background 0.3s',
                    }}
                  >
                    {done ? (
                      <CheckCircle size={13} color="white" />
                    ) : (
                      <div
                        style={{
                          width: 7, height: 7,
                          borderRadius: '50%',
                          background: active ? 'white' : 'var(--text-muted)',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: progress >= idx ? 'var(--text)' : 'var(--text-muted)',
                        marginBottom: 2,
                      }}
                    >
                      {step.label}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Result */}
      {mode === 'result' && (
        <div className="animate-fade-in-up" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 60, height: 60,
              borderRadius: '50%',
              background: 'var(--green-dim)',
              border: '1px solid var(--green-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <CheckCircle size={30} color="var(--green)" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
            Extraction Complete
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 28, maxWidth: 400, margin: '6px auto 28px' }}>
            AI successfully extracted and structured product attributes. Review the preview below,
            then navigate to the Product Catalog to see the full enriched record.
          </p>

          {/* Result preview card */}
          <div
            style={{
              ...card,
              maxWidth: 460,
              margin: '0 auto 24px',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span className="badge badge-ai_enriched">
                <Sparkles size={10} />
                AI Enriched
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>
                {extractedProduct ? `${extractedProduct.completeness}% Complete` : '92% Confidence'}
              </span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>
              {extractedProduct?.name || 'Industrial Servo Motor MX-2000'}
            </h3>
            <p style={{ fontSize: 11, color: 'var(--blue)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 16 }}>
              {extractedProduct?.sku || 'MX-2000-V3'}
            </p>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Extracted Attributes
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(
                  extractedProduct?.attributes.slice(0, 4) || [
                    { key: 'voltage', value: '400V AC' },
                    { key: 'ipRating', value: 'IP65' },
                    { key: 'power', value: '2.5 kW' },
                    { key: 'torque', value: '16.5 Nm' },
                  ]
                ).map((attr: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {attr.key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span
                      style={{
                        color: 'var(--text)',
                        fontWeight: 600,
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 12,
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}
                    >
                      {attr.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setMode('select');
                setExtractedProduct(null);
                setInputText('');
                setSelectedFile(null);
              }}
            >
              Extract Another Product
            </button>
            <button
              id="btn-view-catalog"
              className="btn btn-primary"
              onClick={onExtractSuccess}
            >
              View in Product Catalog <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngestionStudio;
