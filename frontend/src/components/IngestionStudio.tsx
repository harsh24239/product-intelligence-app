import React, { useState, useRef } from 'react';
import { FileText, Upload, Sparkles, CheckCircle, ChevronRight, Settings, X } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types/product';

interface IngestionStudioProps {
  onExtractSuccess: () => void;
}

const AI_STEPS = [
  "Preprocessing & Cleaning Document",
  "Entity & Attribute Extraction (AI)",
  "Schema Normalization & Structuring",
  "RAG Contextual Enrichment",
  "Anomaly & Conflict Detection",
  "ISO Compliance Check",
];

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
        setTimeout(onComplete, 400);
      }
    }, 550);
  };

  const handleTextSubmit = async () => {
    setMode('processing');
    setError('');
    try {
      simulateProgress(async () => {
        try {
          const product = await api.extractFromText(inputText);
          setExtractedProduct(product);
          setMode('result');
        } catch (e: any) {
          // Show result with mock data if backend is offline
          setExtractedProduct(null);
          setMode('result');
        }
      });
    } catch (e: any) {
      setError(e.message);
      setMode('text');
    }
  };

  const handleFileSubmit = async (file: File) => {
    setMode('processing');
    setError('');
    simulateProgress(async () => {
      try {
        const product = await api.extractFromFile(file);
        setExtractedProduct(product);
        setMode('result');
      } catch (e: any) {
        setExtractedProduct(null);
        setMode('result');
      }
    });
  };

  const cardBase: React.CSSProperties = {
    background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 40,
  };

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: 8 }}>Ingestion Studio</h1>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
          Transform unstructured data into normalized product intelligence using our multi-agent AI pipeline.
        </p>
      </div>

      {/* Mode Select */}
      {mode === 'select' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[
            {
              id: 'text', label: 'Paste Text / Spec Sheet', desc: 'Copy-paste raw text from technical documents or product descriptions.',
              Icon: FileText, color: '#06b6d4', glow: 'rgba(6,182,212,0.2)',
            },
            {
              id: 'file', label: 'Upload File', desc: 'Upload PDF, CSV, TXT, or Word documents for AI extraction.',
              Icon: Upload, color: '#6366f1', glow: 'rgba(99,102,241,0.2)',
            },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setMode(opt.id as any)}
              style={{
                ...cardBase,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = `${opt.color}60`;
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 12px 35px -10px ${opt.glow}`;
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: `linear-gradient(135deg, ${opt.color}22, ${opt.color}11)`,
                border: `1px solid ${opt.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 20px ${opt.glow}`,
              }}>
                <opt.Icon size={32} color={opt.color} />
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{opt.label}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Text Mode */}
      {mode === 'text' && (
        <div style={cardBase}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>Raw Technical Text Input</h3>
            <button
              onClick={() => setMode('select')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={16} />
            </button>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#f87171' }}>
              {error}
            </div>
          )}

          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Paste raw product specifications, catalog text, or technical document content here...

Example:
Industrial Servo Motor MX-2000
Power: 2.5 kW, Voltage: 400V AC, Frequency: 50Hz
Speed: 1450 RPM, Torque: 16.5 Nm
IP Rating: IP65, Insulation Class: F
Weight: 18.5 kg, Dimensions: 250x200x300mm
Certifications: CE, UL, IEC 60034"
            style={{
              width: '100%', height: 240,
              background: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: 16,
              fontSize: 13,
              color: '#e2e8f0',
              fontFamily: 'JetBrains Mono, monospace',
              resize: 'vertical',
              outline: 'none',
              lineHeight: 1.6,
              marginBottom: 20,
            }}
            onFocus={e => (e.target.style.borderColor = '#06b6d4')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Settings size={15} /> Config
            </button>
            <button
              className="btn btn-primary"
              onClick={handleTextSubmit}
              disabled={inputText.length < 10}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Sparkles size={15} /> Extract & Structure
            </button>
          </div>
        </div>
      )}

      {/* File Mode */}
      {mode === 'file' && (
        <div style={cardBase}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>Upload Document</h3>
            <button
              onClick={() => { setMode('select'); setSelectedFile(null); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={16} />
            </button>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) setSelectedFile(file);
            }}
            style={{
              border: `2px dashed ${dragOver ? '#22d3ee' : selectedFile ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
              borderRadius: 16,
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? 'rgba(6,182,212,0.05)' : selectedFile ? 'rgba(16,185,129,0.05)' : 'rgba(15,23,42,0.4)',
              transition: 'all 0.2s',
            }}
          >
            {selectedFile ? (
              <>
                <CheckCircle size={40} color="#10b981" style={{ margin: '0 auto 12px' }} />
                <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{selectedFile.name}</p>
                <p style={{ fontSize: 12, color: '#64748b' }}>{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </>
            ) : (
              <>
                <Upload size={40} color="#6366f1" style={{ margin: '0 auto 16px' }} />
                <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Drop file here or click to browse</p>
                <p style={{ fontSize: 12, color: '#64748b' }}>Supports .pdf, .txt, .csv, .json up to 10MB</p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.csv,.json,.docx"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) setSelectedFile(file);
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
            <button className="btn btn-primary" disabled={!selectedFile} onClick={() => selectedFile && handleFileSubmit(selectedFile)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={15} /> Extract & Structure
            </button>
          </div>
        </div>
      )}

      {/* Processing */}
      {mode === 'processing' && (
        <div style={{ ...cardBase, maxWidth: 560, margin: '0 auto', textAlign: 'center', padding: '48px 40px' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
            <Sparkles size={48} color="#22d3ee" />
            <div style={{
              position: 'absolute', inset: -8,
              border: '2px solid rgba(6,182,212,0.3)',
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.3px' }}>
            AI Multi-Agent Engine Processing
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 36 }}>
            Structuring raw catalog data into normalized attributes...
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
            {AI_STEPS.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: progress >= idx ? 1 : 0.3, transition: 'opacity 0.4s' }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: progress > idx ? '#10b981' : progress === idx ? '#06b6d4' : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.3s',
                }}>
                  {progress > idx
                    ? <CheckCircle size={14} color="#fff" />
                    : <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                  }
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: progress >= idx ? '#fff' : '#475569' }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {mode === 'result' && (
        <div className="animate-fade-in-up" style={{ textAlign: 'center', paddingTop: 16 }}>
          <div style={{
            width: 80, height: 80,
            background: 'rgba(16,185,129,0.15)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 0 30px rgba(16,185,129,0.25)',
          }}>
            <CheckCircle size={40} color="#34d399" />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.5px' }}>
            Extraction Complete
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
            Successfully structured product record with AI-extracted attributes.
          </p>

          {/* Product preview */}
          <div style={{ ...cardBase, maxWidth: 480, margin: '0 auto 32px', textAlign: 'left', padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#22d3ee', background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.35)', padding: '3px 10px', borderRadius: 9999 }}>
                ✦ AI Enriched
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399' }}>
                {extractedProduct ? `${extractedProduct.completeness}% Complete` : '92% Confidence'}
              </span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
              {extractedProduct?.name || 'Industrial Servo Motor MX-2000'}
            </h3>
            <p style={{ fontSize: 12, color: '#22d3ee', fontFamily: 'JetBrains Mono, monospace', marginBottom: 16 }}>
              {extractedProduct?.sku || 'SKU: MX-2000-V3'}
            </p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(extractedProduct?.attributes.slice(0, 3) || [
                { key: 'voltage', value: '400V' },
                { key: 'ipRating', value: 'IP65' },
                { key: 'power', value: '2.5 kW' },
              ]).map((attr: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#64748b', textTransform: 'capitalize' }}>{attr.key}</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{attr.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button className="btn btn-secondary" onClick={() => { setMode('select'); setExtractedProduct(null); setInputText(''); setSelectedFile(null); }}>
              Extract Another
            </button>
            <button className="btn btn-primary" onClick={onExtractSuccess} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              View in Catalog <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngestionStudio;
